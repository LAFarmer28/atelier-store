// Starts an isolated Next.js server for tests and exposes its console output.
//
// - "dev": `next dev`. Next.js prints instant-navigation validation errors
//   (the dev overlay "Next.js encountered URL data..." errors) to the server
//   console. With the test logging flags below it brackets each validation
//   run with <VALIDATION_MESSAGE> markers so tests can wait for it to finish.
// - "production": `next build` + `next start`, for behaviour that differs from
//   dev, such as HTTP status codes of prerendered pages.
//
// The server builds into its own directory (.next-test) so it can run next to
// a developer's `pnpm dev`.

import { randomBytes } from "node:crypto";
import { spawn, type ChildProcess } from "node:child_process";
import { rm } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";

const projectDir = path.resolve(import.meta.dirname, "..");
const nextBin = path.join(projectDir, "node_modules", "next", "dist", "bin", "next");
const distDir = ".next-test";

type ValidationEvent = { type: string; url: string };

export type NextServer = {
  url: string;
  output: () => string;
  /** Dev only: resolves once Next.js has finished validating `pathname`. */
  waitForValidation: (pathname: string, timeoutMs?: number) => Promise<void>;
  /** Dev only: console output logged during `pathname`'s latest validation run. */
  validationOutput: (pathname: string) => string;
  stop: () => Promise<void>;
};

function freePort() {
  return new Promise<number>((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, () => {
      const address = server.address();
      server.close(() => {
        if (address && typeof address === "object") resolve(address.port);
        else reject(new Error("Could not allocate a port"));
      });
    });
  });
}

function parseEvents(output: string) {
  const events: Array<ValidationEvent & { index: number; end: number }> = [];
  const pattern = /<VALIDATION_MESSAGE>(.*?)<\/VALIDATION_MESSAGE>/g;
  for (let match = pattern.exec(output); match; match = pattern.exec(output)) {
    events.push({ ...JSON.parse(match[1]), index: match.index, end: pattern.lastIndex });
  }
  return events;
}

function matchesPath(event: ValidationEvent, pathname: string) {
  return new URL(event.url, "http://localhost").pathname === pathname;
}

async function stopProcess(child: ChildProcess) {
  if (child.exitCode !== null || child.pid === undefined) return;
  const exited = new Promise((resolve) => child.once("exit", resolve));
  if (process.platform === "win32") {
    // Kill the whole tree: Next.js spawns worker processes.
    spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    child.kill("SIGTERM");
  }
  await exited;
}

function runNext(args: string[], env: NodeJS.ProcessEnv) {
  const child = spawn(process.execPath, [nextBin, ...args], {
    cwd: projectDir,
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout!.on("data", (chunk) => (output += chunk));
  child.stderr!.on("data", (chunk) => (output += chunk));
  return { child, output: () => output };
}

export async function startNextServer(mode: "dev" | "production"): Promise<NextServer> {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    NEXT_DIST_DIR: distDir,
    NEXT_TELEMETRY_DISABLED: "1",
    FORCE_COLOR: "0",
  };
  if (mode === "dev") {
    // Emit <VALIDATION_MESSAGE> start/end markers around dev validation.
    env.__NEXT_TEST_MODE = "1";
    env.NEXT_TEST_LOG_VALIDATION = "1";
  } else {
    // `next build` loads the auth route, which refuses to start without a
    // strong secret. Tests don't sign real sessions, so a throwaway one is fine.
    env.BETTER_AUTH_SECRET = randomBytes(32).toString("base64");
  }

  const cleanup = () => rm(path.join(projectDir, distDir), { recursive: true, force: true });

  if (mode === "production") {
    const build = runNext(["build"], env);
    const code = await new Promise<number | null>((resolve) => build.child.once("exit", resolve));
    if (code !== 0) {
      await cleanup();
      throw new Error(`next build failed (exit ${code}):\n${build.output()}`);
    }
  }

  const port = await freePort();
  const url = `http://localhost:${port}`;
  const server = runNext([mode === "dev" ? "dev" : "start", "--port", String(port)], env);
  const output = server.output;

  const stop = async () => {
    await stopProcess(server.child);
    await cleanup().catch(() => {});
  };

  const deadline = Date.now() + 60_000;
  while (!/Ready in/.test(output())) {
    if (server.child.exitCode !== null) {
      await cleanup().catch(() => {});
      throw new Error(`next ${mode} exited early:\n${output()}`);
    }
    if (Date.now() > deadline) {
      await stop();
      throw new Error(`next ${mode} did not start within 60s:\n${output()}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  const lastRun = (pathname: string) => {
    const events = parseEvents(output());
    const startIndex = events.findLastIndex(
      (event) => event.type === "validation_start" && matchesPath(event, pathname),
    );
    if (startIndex === -1) return null;
    const end = events
      .slice(startIndex + 1)
      .find((event) => event.type === "validation_end" && matchesPath(event, pathname));
    return { start: events[startIndex], end };
  };

  return {
    url,
    output,
    async waitForValidation(pathname, timeoutMs = 60_000) {
      const until = Date.now() + timeoutMs;
      while (!lastRun(pathname)?.end) {
        if (Date.now() > until) {
          throw new Error(
            `No completed validation for ${pathname} within ${timeoutMs}ms:\n${output()}`,
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    },
    validationOutput(pathname) {
      const run = lastRun(pathname);
      if (!run?.end) return "";
      return output().slice(run.start.end, run.end.index);
    },
    stop,
  };
}

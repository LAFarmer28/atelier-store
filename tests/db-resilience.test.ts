// Database resilience: a transient connection failure (dropped connection,
// Neon waking from autosuspend) used to fail a catalog query outright with
// "Failed query: select ... params: ...", and the browser showed no cause.
//
// The integration tests need DATABASE_URL (from .env.local or .env) and are
// skipped without it. Run with `pnpm test`.

import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";

import { neon, neonConfig } from "@neondatabase/serverless";
import { config } from "dotenv";
import { inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import { runQuery, withCauseInMessage } from "../src/db/query-error.ts";
import { createRetryingFetch, isReadOnlyRequest } from "../src/db/retrying-fetch.ts";
import * as schema from "../src/db/schema/catalog.ts";

config({ path: [".env.local", ".env"], quiet: true });

const SELECT_BODY = JSON.stringify({ query: 'select "id" from "products"', params: [] });
const INSERT_BODY = JSON.stringify({ query: 'insert into "categories" ("slug") values ($1)', params: ["x"] });
const noSleep = async () => {};

/** A fetch that fails its first `failures` calls the way an unreachable host does. */
function flakyFetch(failures: number, failWith: () => Promise<Response> | never) {
  let calls = 0;
  const fn = (async (...args: Parameters<typeof fetch>) => {
    calls++;
    if (calls <= failures) return failWith();
    return globalThis.fetch(...args);
  }) as typeof fetch;
  return { fn, calls: () => calls };
}

const networkError = () => {
  throw new TypeError("fetch failed");
};

function fakeFetch(responses: Array<Response | Error>) {
  let calls = 0;
  const fn = (async () => {
    const next = responses[Math.min(calls++, responses.length - 1)];
    if (next instanceof Error) throw next;
    return next;
  }) as unknown as typeof fetch;
  return { fn, calls: () => calls };
}

describe("isReadOnlyRequest", () => {
  test("accepts single and batched SELECTs", () => {
    assert.equal(isReadOnlyRequest(SELECT_BODY), true);
    assert.equal(
      isReadOnlyRequest(JSON.stringify({ queries: [{ query: "select 1" }, { query: " SELECT 2" }] })),
      true,
    );
  });

  test("rejects writes, mixed batches and unknown bodies", () => {
    assert.equal(isReadOnlyRequest(INSERT_BODY), false);
    assert.equal(
      isReadOnlyRequest(JSON.stringify({ queries: [{ query: "select 1" }, { query: "delete from x" }] })),
      false,
    );
    assert.equal(isReadOnlyRequest(JSON.stringify({ query: "with x as (delete from y) select 1" })), false);
    assert.equal(isReadOnlyRequest("not json"), false);
    assert.equal(isReadOnlyRequest(undefined), false);
  });
});

describe("createRetryingFetch", () => {
  test("retries a SELECT after a network error", async () => {
    const base = fakeFetch([new TypeError("fetch failed"), new Response("ok")]);
    const retrying = createRetryingFetch(base.fn, { sleep: noSleep });

    const response = await retrying("https://db", { method: "POST", body: SELECT_BODY });
    assert.equal(await response.text(), "ok");
    assert.equal(base.calls(), 2);
  });

  test("retries a SELECT on a gateway error (database waking up)", async () => {
    const base = fakeFetch([new Response("waking", { status: 503 }), new Response("ok")]);
    const retrying = createRetryingFetch(base.fn, { sleep: noSleep });

    const response = await retrying("https://db", { method: "POST", body: SELECT_BODY });
    assert.equal(response.status, 200);
    assert.equal(base.calls(), 2);
  });

  test("does not retry SQL errors", async () => {
    const base = fakeFetch([new Response("{}", { status: 400 }), new Response("ok")]);
    const retrying = createRetryingFetch(base.fn, { sleep: noSleep });

    const response = await retrying("https://db", { method: "POST", body: SELECT_BODY });
    assert.equal(response.status, 400);
    assert.equal(base.calls(), 1);
  });

  test("never retries a write, which may already have been applied", async () => {
    const base = fakeFetch([new TypeError("fetch failed"), new Response("ok")]);
    const retrying = createRetryingFetch(base.fn, { sleep: noSleep });

    await assert.rejects(retrying("https://db", { method: "POST", body: INSERT_BODY }), /fetch failed/);
    assert.equal(base.calls(), 1);
  });

  test("gives up after the configured retries", async () => {
    const base = fakeFetch([new TypeError("fetch failed")]);
    const retrying = createRetryingFetch(base.fn, { retries: 2, sleep: noSleep });

    await assert.rejects(retrying("https://db", { method: "POST", body: SELECT_BODY }), /fetch failed/);
    assert.equal(base.calls(), 3);
  });

  test("backs off between attempts", async () => {
    const delays: number[] = [];
    const base = fakeFetch([new TypeError("fetch failed")]);
    const retrying = createRetryingFetch(base.fn, {
      retries: 2,
      baseDelayMs: 100,
      sleep: async (ms) => void delays.push(ms),
    });

    await assert.rejects(retrying("https://db", { method: "POST", body: SELECT_BODY }));
    assert.deepEqual(delays, [100, 200]);
  });

  test("does not retry a request its caller aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    const base = fakeFetch([new DOMException("aborted", "AbortError"), new Response("ok")]);
    const retrying = createRetryingFetch(base.fn, { sleep: noSleep });

    await assert.rejects(
      retrying("https://db", { method: "POST", body: SELECT_BODY, signal: controller.signal }),
    );
    assert.equal(base.calls(), 1);
  });
});

describe("withCauseInMessage", () => {
  test("appends the cause chain to the message", () => {
    const root = new TypeError("fetch failed");
    const neonError = new Error("Error connecting to database: TypeError: fetch failed", { cause: root });
    const queryError = new Error("Failed query: select 1\nparams: ", { cause: neonError });

    const wrapped = withCauseInMessage(queryError) as Error;
    assert.match(wrapped.message, /^Failed query: select 1/);
    assert.match(wrapped.message, /Caused by: Error connecting to database: TypeError: fetch failed/);
    assert.match(wrapped.message, /Caused by: fetch failed$/);
    assert.equal(wrapped.cause, queryError);
  });

  test("leaves errors without a cause untouched", () => {
    const error = new Error("plain");
    assert.equal(withCauseInMessage(error), error);
  });
});

// The editor's-picks query from the home page, run against the real database
// with the first request(s) failing like an unreachable host.
describe("catalog query against Neon with a transient failure", { skip: !process.env.DATABASE_URL }, () => {
  const editorsPicks = ["sapphire-drop-earrings", "city-backpack", "fringed-knit-poncho", "tailored-jogger", "graphic-cotton-tee"];
  const originalFetchFunction = neonConfig.fetchFunction;

  afterEach(() => {
    neonConfig.fetchFunction = originalFetchFunction;
  });

  function catalogDb() {
    return drizzle({ client: neon(process.env.DATABASE_URL!), schema });
  }

  function editorsPicksQuery(db: ReturnType<typeof catalogDb>) {
    return db.query.products.findMany({
      where: inArray(schema.products.slug, editorsPicks),
      with: { category: true, stock: true },
    });
  }

  test("without retries, reproduces the 'Failed query' error, now with its cause", async () => {
    neonConfig.fetchFunction = flakyFetch(1, networkError).fn;
    const db = catalogDb();

    await assert.rejects(runQuery(() => editorsPicksQuery(db)), (error: Error) => {
      assert.match(error.message, /^Failed query: select/);
      assert.match(error.message, /params: 1,1,sapphire-drop-earrings/);
      assert.match(error.message, /Caused by: Error connecting to database: TypeError: fetch failed/);
      return true;
    });
  });

  test("with the retrying fetch, the same query recovers", async () => {
    const flaky = flakyFetch(2, networkError);
    neonConfig.fetchFunction = createRetryingFetch(flaky.fn, { baseDelayMs: 10 });
    const db = catalogDb();

    const rows = await runQuery(() => editorsPicksQuery(db));
    assert.deepEqual(rows.map((row) => row.slug).sort(), [...editorsPicks].sort());
    assert.ok(rows.every((row) => row.category && row.stock), "category and stock are joined");
    assert.equal(flaky.calls(), 3);
  });

  test("with the retrying fetch, recovers from a 503 while the database wakes", async () => {
    const flaky = flakyFetch(1, async () => new Response("compute is waking up", { status: 503 }));
    neonConfig.fetchFunction = createRetryingFetch(flaky.fn, { baseDelayMs: 10 });
    const db = catalogDb();

    const rows = await runQuery(() => editorsPicksQuery(db));
    assert.equal(rows.length, editorsPicks.length);
  });
});

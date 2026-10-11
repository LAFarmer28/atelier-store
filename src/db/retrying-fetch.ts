// A fetch for the Neon HTTP driver that retries transient failures.
//
// Each query is one HTTP request with no retry of its own, so a dropped
// connection or a database waking from autosuspend fails the query outright
// ("Failed query ... Error connecting to database: fetch failed"). Only
// read-only statements are retried: if a write's response is lost, it may
// already have been applied, and repeating it is not safe.

type Fetch = typeof fetch;

export type RetryOptions = {
  /** Extra attempts after the first one. */
  retries?: number;
  /** Delay before the first retry; doubles on each further retry. */
  baseDelayMs?: number;
  sleep?: (ms: number) => Promise<void>;
};

/** Gateway errors: the request never reached a running database. */
const RETRYABLE_STATUSES = new Set([502, 503, 504]);

const READ_ONLY_STATEMENT = /^\s*select\b/i;

/** True when the Neon request body holds only SELECT statements. */
export function isReadOnlyRequest(body: unknown): boolean {
  if (typeof body !== "string") return false;
  try {
    const payload = JSON.parse(body) as { query?: unknown; queries?: Array<{ query?: unknown }> };
    const statements = payload.queries?.map((entry) => entry.query) ?? [payload.query];
    return (
      statements.length > 0 &&
      statements.every((sql) => typeof sql === "string" && READ_ONLY_STATEMENT.test(sql))
    );
  } catch {
    return false;
  }
}

export function createRetryingFetch(
  // Resolved per call so Next.js's patched global fetch is still used.
  baseFetch: Fetch = (...args) => globalThis.fetch(...args),
  { retries = 2, baseDelayMs = 150, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) }: RetryOptions = {},
): Fetch {
  return async (input, init) => {
    const retryable = isReadOnlyRequest(init?.body);

    for (let attempt = 0; ; attempt++) {
      const canRetry = retryable && attempt < retries && !init?.signal?.aborted;
      try {
        const response = await baseFetch(input, init);
        if (!canRetry || !RETRYABLE_STATUSES.has(response.status)) return response;
        await response.body?.cancel();
      } catch (error) {
        if (!canRetry) throw error;
      }
      await sleep(baseDelayMs * 2 ** attempt);
    }
  };
}

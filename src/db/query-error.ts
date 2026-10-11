// Drizzle reports a failed query as "Failed query: <sql> params: ..." and keeps
// the actual reason (connection refused, timeout, SQL error) in `error.cause`.
// Messages forwarded to the browser and dev overlay drop `cause`, so append it.

function causeChain(error: unknown) {
  const messages: string[] = [];
  const seen = new Set<unknown>();
  let cause = error instanceof Error ? error.cause : undefined;
  while (cause !== undefined && !seen.has(cause)) {
    seen.add(cause);
    messages.push(cause instanceof Error ? cause.message : String(cause));
    cause = cause instanceof Error ? cause.cause : undefined;
  }
  return messages;
}

/** The error with every `cause` in its chain appended to the message. */
export function withCauseInMessage(error: unknown): unknown {
  const causes = causeChain(error);
  if (!(error instanceof Error) || causes.length === 0) return error;
  const wrapped = new Error(
    [error.message, ...causes.map((message) => `Caused by: ${message}`)].join("\n"),
    { cause: error },
  );
  wrapped.name = error.name;
  return wrapped;
}

/** Runs a database query, rethrowing failures with their cause in the message. */
export async function runQuery<T>(query: () => PromiseLike<T>): Promise<T> {
  try {
    return await query();
  } catch (error) {
    throw withCauseInMessage(error);
  }
}

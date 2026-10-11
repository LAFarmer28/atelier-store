import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { createRetryingFetch } from "./retrying-fetch";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Retry reads that fail on a dropped connection or while Neon wakes up.
neonConfig.fetchFunction = createRetryingFetch();

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle({ client: sql, schema });

import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import * as schema from "@/db/schema";

const MIN_SECRET_LENGTH = 32;

// Better Auth falls back to a public, hard-coded secret when BETTER_AUTH_SECRET
// is unset outside production, and only warns about short secrets. Refuse both
// so sessions are never signed with a guessable key.
function requireSecret() {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `BETTER_AUTH_SECRET must be set to a random value of at least ${MIN_SECRET_LENGTH} characters. ` +
        "Generate one with `npx auth secret` or `openssl rand -base64 32`.",
    );
  }
  return secret;
}

// Without a fixed base URL, Better Auth derives its origin from the request's
// Host header, which an attacker controls.
function requireBaseURL() {
  const baseURL = process.env.BETTER_AUTH_URL;
  if (!baseURL) {
    throw new Error("BETTER_AUTH_URL must be set to the app's public origin.");
  }
  return baseURL;
}

export const auth = betterAuth({
  secret: requireSecret(),
  baseURL: requireBaseURL(),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  advanced: {
    // Always mark cookies Secure in production, even if TLS ends at a proxy and
    // the configured base URL is wrong.
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  // nextCookies must be the last plugin in the list.
  plugins: [nextCookies()],
});

// Storefront behaviour that only a production build shows. Product pages read
// the slug inside <Suspense> for instant navigations; `ensureStatic =
// "navigation"` must still make unknown slugs render completely before the
// response starts, so notFound() sends a real 404 instead of a streamed 200.
//
// Requires DATABASE_URL (migrated and seeded). Run with `pnpm test`.

import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";

import { startNextServer, type NextServer } from "./next-server.ts";

let server: NextServer;

before(async () => {
  server = await startNextServer("production");
});

after(async () => {
  await server?.stop();
});

async function get(pathname: string) {
  const response = await fetch(new URL(pathname, server.url));
  return { status: response.status, html: await response.text() };
}

describe("/products/[slug] (production)", () => {
  test("serves a prerendered product with 200", async () => {
    const { status, html } = await get("/products/suede-brogue");
    assert.equal(status, 200);
    assert.match(html, /<h1[^>]*>Suede brogue<\/h1>/);
  });

  test("returns a real 404 for an unknown slug", async () => {
    const { status, html } = await get("/products/does-not-exist");
    assert.equal(status, 404);
    assert.match(html, /This page is no longer available/);
  });

  test("keeps returning 404 once the unknown slug has been cached", async () => {
    await get("/products/another-missing-slug");
    const { status } = await get("/products/another-missing-slug");
    assert.equal(status, 404);
  });
});

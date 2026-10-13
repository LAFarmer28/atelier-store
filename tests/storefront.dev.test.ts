// Storefront pages under `next dev`: render from the database and pass
// Next.js instant-navigation validation. Validation only runs in dev, and its
// errors are what the dev overlay shows, e.g. "Next.js encountered URL data
// during prerendering or a navigation" when `params` is awaited outside
// <Suspense>.
//
// Requires DATABASE_URL (migrated and seeded). Run with `pnpm test`.

import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";

import { startNextServer, type NextServer } from "./next-server.ts";

const URL_DATA_ERROR = /encountered URL data|instant-shell-url-data/;
const ANY_INSTANT_ERROR =
  /Next\.js encountered (URL|runtime|uncached) data|blocking-prerender|instant-shell|instant-navigation/;

let server: NextServer;

before(async () => {
  server = await startNextServer("dev");
});

after(async () => {
  await server?.stop();
});

async function get(pathname: string) {
  const response = await fetch(new URL(pathname, server.url));
  return { status: response.status, html: await response.text() };
}

describe("/products/[slug]", () => {
  test("renders the product from the database", async () => {
    const { status, html } = await get("/products/suede-brogue");

    assert.equal(status, 200);
    assert.match(html, /<h1[^>]*>Suede brogue<\/h1>/);
    assert.match(html, /AT-SH-2384/);
    assert.match(html, /You may also like/);
  });

  test("shows stock state from the database", async () => {
    const soldOut = await get("/products/crystal-bow-sandal");
    assert.match(soldOut.html, /<button[^>]*disabled[^>]*>Sold out<\/button>/);

    const lowStock = await get("/products/technical-bomber");
    assert.match(lowStock.html, /Only 1 left/);
  });

  test("reads the slug only inside <Suspense> (instant navigation)", async () => {
    await get("/products/suede-brogue");
    await server.waitForValidation("/products/suede-brogue");

    const logged = server.validationOutput("/products/suede-brogue");
    assert.doesNotMatch(logged, URL_DATA_ERROR);
    assert.doesNotMatch(logged, ANY_INSTANT_ERROR);
  });

  test("renders the not-found page, marked noindex, for an unknown slug", async () => {
    // Dev always streams, so the status is 200 here. The real 404 status is
    // covered by the production test.
    const { html } = await get("/products/does-not-exist");
    assert.match(html, /This page is no longer available/);
    assert.match(html, /<meta name="robots" content="noindex"/);
  });
});

describe("/", () => {
  test("renders curated products and passes instant-navigation validation", async () => {
    const { status, html } = await get("/");
    assert.equal(status, 200);
    assert.match(html, /Structured top handle bag/);
    assert.match(html, /Graphic cotton T-shirt/);

    await server.waitForValidation("/");
    assert.doesNotMatch(server.validationOutput("/"), ANY_INSTANT_ERROR);
  });

  test("loads both product lists without a failed database query", async () => {
    // Both lists query the database in parallel on the home page.
    await Promise.all([get("/"), get("/"), get("/")]);
    await server.waitForValidation("/");
    assert.doesNotMatch(server.output(), /Failed query/);
  });
});

describe("/new-arrivals", () => {
  test("renders the latest products and passes instant-navigation validation", async () => {
    const { status, html } = await get("/new-arrivals");
    assert.equal(status, 200);
    assert.match(html, /<h1[^>]*>New arrivals<\/h1>/);
    assert.match(html, /href="\/products\/[a-z0-9-]+"/);

    await server.waitForValidation("/new-arrivals");
    assert.doesNotMatch(server.validationOutput("/new-arrivals"), ANY_INSTANT_ERROR);
  });
});

// Loads the development catalog. Safe to re-run: rows are upserted by slug.
// Usage: pnpm db:seed

import { config } from "dotenv";
import { sql } from "drizzle-orm";

import { seedCategories, seedProducts } from "./seed-data";

// Same precedence as Next.js: .env.local overrides .env.
config({ path: [".env.local", ".env"], quiet: true });

const excluded = (column: string) => sql.raw(`excluded.${column}`);

async function main() {
  // Imported after dotenv so DATABASE_URL is set when the client is created.
  const { db } = await import("./index");
  const { categories, products, productStock } = await import("./schema");

  const categoryRows = await db
    .insert(categories)
    .values(seedCategories.map((category, index) => ({ ...category, sortOrder: index })))
    .onConflictDoUpdate({
      target: categories.slug,
      set: { name: excluded("name"), sortOrder: excluded("sort_order") },
    })
    .returning({ id: categories.id, name: categories.name });

  const categoryIds = new Map(categoryRows.map((row) => [row.name, row.id]));

  const productRows = await db
    .insert(products)
    .values(
      seedProducts.map((product) => {
        const categoryId = categoryIds.get(product.category);
        if (!categoryId) throw new Error(`Unknown category: ${product.category}`);
        return {
          slug: product.slug,
          sku: product.sku,
          name: product.name,
          categoryId,
          color: product.color,
          priceCents: product.price,
          badge: product.badge ?? null,
          description: product.description,
          details: product.details,
          imageUrl: product.image.src,
          imageAlt: product.image.alt,
          imageViews: product.views,
        };
      }),
    )
    .onConflictDoUpdate({
      target: products.slug,
      set: {
        sku: excluded("sku"),
        name: excluded("name"),
        categoryId: excluded("category_id"),
        color: excluded("color"),
        priceCents: excluded("price_cents"),
        badge: excluded("badge"),
        description: excluded("description"),
        details: excluded("details"),
        imageUrl: excluded("image_url"),
        imageAlt: excluded("image_alt"),
        imageViews: excluded("image_views"),
        updatedAt: sql`now()`,
      },
    })
    .returning({ id: products.id, slug: products.slug });

  const stockBySlug = new Map(seedProducts.map((product) => [product.slug, product.stock]));

  await db
    .insert(productStock)
    .values(
      productRows.map((row) => ({
        productId: row.id,
        quantity: stockBySlug.get(row.slug) ?? 0,
      })),
    )
    .onConflictDoUpdate({
      target: productStock.productId,
      set: { quantity: excluded("quantity"), updatedAt: sql`now()` },
    });

  console.log(
    `Seeded ${categoryRows.length} categories and ${productRows.length} products with stock.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

// Cached catalog reads for Server Components. Results are part of the static
// prerender; call revalidateTag("catalog") after changing products or stock.

import { asc, eq, inArray, ne, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/db";
import { categories, products } from "@/db/schema";
import type { Product } from "@/lib/products";

const withRelations = { category: true, stock: true } as const;

type ProductWithRelations = NonNullable<
  Awaited<ReturnType<typeof db.query.products.findFirst<{ with: typeof withRelations }>>>
>;

function toProduct(row: ProductWithRelations): Product {
  return {
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    category: row.category.name,
    categorySlug: row.category.slug,
    color: row.color,
    price: row.priceCents,
    stock: row.stock?.quantity ?? 0,
    image: { src: row.imageUrl, alt: row.imageAlt },
    views: row.imageViews,
    description: row.description,
    details: row.details,
    badge: row.badge ?? undefined,
  };
}

function cacheCatalog() {
  cacheLife("hours");
  cacheTag("catalog");
}

export async function getAllProductSlugs(): Promise<string[]> {
  "use cache";
  cacheCatalog();

  const rows = await db
    .select({ slug: products.slug })
    .from(products)
    .orderBy(asc(products.id));
  return rows.map((row) => row.slug);
}

export async function getProduct(slug: string): Promise<Product | null> {
  "use cache";
  cacheCatalog();

  const row = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: withRelations,
  });
  return row ? toProduct(row) : null;
}

/** Products in the order of `slugs`. Slugs that no longer exist are skipped. */
export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  "use cache";
  cacheCatalog();

  if (slugs.length === 0) return [];
  const rows = await db.query.products.findMany({
    where: inArray(products.slug, slugs),
    with: withRelations,
  });
  const bySlug = new Map(rows.map((row) => [row.slug, toProduct(row)]));
  return slugs.flatMap((slug) => bySlug.get(slug) ?? []);
}

/** Products from the same category first, then the rest of the catalog. */
export function getRelatedProducts(product: Product, limit = 4) {
  return getRelated(product.slug, product.categorySlug, limit);
}

async function getRelated(slug: string, categorySlug: string, limit: number) {
  "use cache";
  cacheCatalog();

  const categoryId = db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, categorySlug));

  const rows = await db.query.products.findMany({
    where: ne(products.slug, slug),
    with: withRelations,
    orderBy: [sql`${products.categoryId} = (${categoryId}) desc`, asc(products.id)],
    limit,
  });
  return rows.map(toProduct);
}

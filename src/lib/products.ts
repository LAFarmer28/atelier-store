// Product types and presentation helpers shared by server and client code.
// Catalog data is read from the database via `@/db/queries/catalog`.

import type { ImageView } from "@/db/schema/catalog";

export type { ImageView };

export type ImageAsset = {
  src: string;
  alt: string;
};

export type Product = {
  slug: string;
  sku: string;
  name: string;
  category: string;
  categorySlug: string;
  color: string;
  price: number; // minor units (cents)
  stock: number;
  image: ImageAsset;
  views: ImageView[];
  description: string;
  details: string[];
  badge?: string;
};

export const LOW_STOCK_THRESHOLD = 3;

export type StockState = "in_stock" | "low_stock" | "out_of_stock";

export function getStockState(stock: number): StockState {
  if (stock <= 0) return "out_of_stock";
  if (stock <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "in_stock";
}

export function formatPrice(minor: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(minor / 100);
}

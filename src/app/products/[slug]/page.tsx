import type { Metadata } from "next";
import { Suspense } from "react";

import { getAllProductSlugs, getProduct } from "@/db/queries/catalog";

import { ProductDetails, ProductDetailsSkeleton } from "./product-details";

// Render unknown slugs fully before responding (instead of streaming the
// fallback shell) so notFound() can still send a real 404 status.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: `${product.image.src}?w=1200`, alt: product.image.alt }],
    },
  };
}

// Links prefetch one App Shell shared by every product, so the slug must only
// be read inside <Suspense>. Reading it here would tie the shell to one URL.
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { SectionHeading } from "@/components/section-heading";
import { getAllProductSlugs, getProduct, getRelatedProducts } from "@/db/queries/catalog";
import { getStockState } from "@/lib/products";

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

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    image: product.image.src,
    color: product.color,
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: (product.price / 100).toFixed(2),
      availability:
        getStockState(product.stock) === "out_of_stock"
          ? "https://schema.org/OutOfStock"
          : getStockState(product.stock) === "low_stock"
            ? "https://schema.org/LimitedAvailability"
            : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="container-page pt-5 md:pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="type-eyebrow cluster text-muted [--cluster-gap:--spacing(2)]">
            <li>
              <Link href="/" className="link-quiet">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/${product.categorySlug}`} className="link-quiet">
                {product.category}
              </Link>
            </li>
            <li aria-hidden="true" className="max-sm:hidden">
              /
            </li>
            <li aria-current="page" className="text-ink max-sm:hidden">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-5 grid gap-10 md:mt-8 lg:grid-cols-12 lg:gap-gutter">
          <div className="max-md:-mx-gutter lg:col-span-7 xl:col-span-8">
            <ProductGallery product={product} />
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)] lg:pl-4 xl:pl-8">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>
      </div>

      <section className="section container-page" aria-labelledby="related-title">
        <SectionHeading
          id="related-title"
          title="You may also like"
          action={{
            label: `Shop ${product.category}`,
            href: `/${product.categorySlug}`,
          }}
        />
        <div className="product-grid">
          {related.map((item, index) => (
            <ProductCard
              key={item.slug}
              product={item}
              className={index === 3 ? "md:max-lg:hidden" : undefined}
            />
          ))}
        </div>
      </section>
    </>
  );
}

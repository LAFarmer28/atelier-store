import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { SectionHeading } from "@/components/section-heading";
import { getProduct, getRelatedProducts } from "@/db/queries/catalog";
import { getStockState } from "@/lib/products";

/** Everything on the product page that depends on the URL's slug. */
export async function ProductDetails({
  params,
}: Pick<PageProps<"/products/[slug]">, "params">) {
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

/** Placeholder with the product page's layout, shown in the shared App Shell. */
export function ProductDetailsSkeleton() {
  return (
    <div className="container-page pt-5 md:pt-8" aria-busy="true">
      <div className="h-4 w-40 bg-surface" />
      <div className="mt-5 grid gap-10 md:mt-8 lg:grid-cols-12 lg:gap-gutter">
        <div className="max-md:-mx-gutter lg:col-span-7 xl:col-span-8">
          <div className="media aspect-product" />
        </div>
        <div className="stack lg:col-span-5 xl:col-span-4 lg:pl-4 xl:pl-8 [--stack-gap:--spacing(3)]">
          <div className="h-3 w-24 bg-surface" />
          <div className="h-8 w-3/4 bg-surface" />
          <div className="h-4 w-20 bg-surface" />
        </div>
      </div>
    </div>
  );
}

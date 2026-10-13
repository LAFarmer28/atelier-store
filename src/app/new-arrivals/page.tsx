import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { getLatestProducts } from "@/db/queries/catalog";

const description =
  "The latest pieces to arrive at the atelier: ready-to-wear, leather goods, shoes and jewelry.";

export const metadata: Metadata = {
  title: "New arrivals",
  description,
};

export default async function NewArrivalsPage() {
  const products = await getLatestProducts();

  return (
    <>
      <div className="container-page pt-5 md:pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="type-eyebrow cluster text-muted [--cluster-gap:--spacing(2)]">
            <li>
              <Link href="/" className="link-quiet">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              New arrivals
            </li>
          </ol>
        </nav>
      </div>

      <header className="section container-prose text-center">
        <p className="type-eyebrow text-muted">Just in</p>
        <h1 className="type-h1 mt-5 font-serif">New arrivals</h1>
        <p className="mt-5 text-muted">{description}</p>
      </header>

      <section className="container-page pb-section" aria-label="Products">
        {products.length > 0 ? (
          <>
            <p className="type-caption mb-8 text-muted md:mb-10">
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </p>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center">
            <p className="text-muted">
              New pieces are on their way. Explore the current collections in
              the meantime.
            </p>
            <Link href="/" className="btn btn-primary mt-10">
              Return to the homepage
            </Link>
          </div>
        )}
      </section>
    </>
  );
}

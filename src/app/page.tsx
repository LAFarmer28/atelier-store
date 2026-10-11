import { CategoryTiles } from "@/components/home/category-tiles";
import { EditorialStory } from "@/components/home/editorial-story";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { Hero } from "@/components/home/hero";
import { Services } from "@/components/home/services";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { getProductsBySlugs } from "@/db/queries/catalog";
import { editorsPickSlugs, newArrivalSlugs } from "@/lib/catalog";

export default async function Home() {
  const [newArrivals, editorsPicks] = await Promise.all([
    getProductsBySlugs(newArrivalSlugs),
    getProductsBySlugs(editorsPickSlugs),
  ]);

  return (
    <>
      <Hero />

      <section className="section container-prose text-center" aria-label="Introduction">
        <p className="type-eyebrow text-muted">The new season</p>
        <p className="type-h2 mt-6 font-serif">
          Soft tailoring, sculpted leather and quiet colour, designed to be worn
          season after season.
        </p>
      </section>

      <section className="container-page pb-section" aria-labelledby="new-arrivals-title">
        <SectionHeading
          id="new-arrivals-title"
          eyebrow="Just in"
          title="New arrivals"
          action={{ label: "View all", href: "/new-arrivals" }}
        />
        <div className="product-grid">
          {newArrivals.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              className={index >= 6 ? "md:max-lg:hidden" : undefined}
            />
          ))}
        </div>
      </section>

      <EditorialStory />

      <FeaturedCollections />

      <section className="bg-surface section" aria-labelledby="picks-title">
        <div className="container-page">
          <SectionHeading
            id="picks-title"
            eyebrow="Curated"
            title="Editor's picks"
            action={{ label: "Shop all", href: "/edits/editors-picks" }}
          />
          <div className="scroll-row">
            {editorsPicks.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 72vw"
              />
            ))}
          </div>
        </div>
      </section>

      <CategoryTiles />

      <Services />
    </>
  );
}

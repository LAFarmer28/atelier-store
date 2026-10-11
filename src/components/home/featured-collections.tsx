import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { featuredCollections } from "@/lib/catalog";

export function FeaturedCollections() {
  return (
    <section className="section container-page" aria-labelledby="collections-title">
      <SectionHeading
        id="collections-title"
        eyebrow="Featured"
        title="The collections"
      />

      <div className="grid gap-y-12 md:grid-cols-3 md:gap-x-grid">
        {featuredCollections.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}`}
            className="group block"
          >
            <div className="media aspect-4/3 md:aspect-portrait">
              <Image
                src={collection.image.src}
                alt={collection.image.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-5 stack items-start [--stack-gap:--spacing(2)]">
              <h3 className="type-h3">{collection.name}</h3>
              <p className="type-caption text-muted">{collection.description}</p>
              <span className="link-cta mt-1">Discover</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

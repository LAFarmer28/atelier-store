import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { categories } from "@/lib/catalog";

export function CategoryTiles() {
  return (
    <section className="section container-page" aria-labelledby="categories-title">
      <SectionHeading id="categories-title" title="Shop by category" />

      <div className="grid grid-cols-2 gap-grid md:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/${category.slug}`}
            className="group media block aspect-portrait"
          >
            <Image
              src={category.image.src}
              alt={category.image.alt}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink/50 to-transparent to-50%" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-paper lg:p-6">
              <h3 className="type-h3 font-normal">{category.name}</h3>
              <span className="type-eyebrow max-lg:hidden">Shop</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

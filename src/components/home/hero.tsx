import Image from "next/image";
import Link from "next/link";

import { hero } from "@/lib/catalog";

export function Hero() {
  const [primary, secondary] = hero.images;

  return (
    <section className="hero bg-surface" aria-labelledby="hero-title">
      <div className="absolute inset-0 grid md:grid-cols-2">
        <div className="relative">
          <Image
            src={primary.src}
            alt={primary.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover object-top"
          />
        </div>
        <div className="relative max-md:hidden">
          <Image
            src={secondary.src}
            alt={secondary.alt}
            fill
            sizes="50vw"
            loading="eager"
            className="object-cover object-[50%_30%]"
          />
        </div>
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-ink/55 via-ink/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 container-page pb-10 text-center text-paper md:pb-16">
        <div className="stack items-center [--stack-gap:--spacing(5)]">
          <p className="type-eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title" className="type-display">
            {hero.title}
          </h1>
          <div className="cluster mt-2 w-full justify-center [--cluster-gap:--spacing(3)]">
            <Link href="/women" className="btn btn-inverse max-sm:flex-1">
              Shop women
            </Link>
            <Link href="/men" className="btn btn-inverse max-sm:flex-1">
              Shop men
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";

import { editorial } from "@/lib/catalog";

export function EditorialStory() {
  return (
    <section className="grid md:grid-cols-2" aria-labelledby="editorial-title">
      <div className="media aspect-portrait md:aspect-auto md:min-h-[42rem]">
        <Image
          src={editorial.image.src}
          alt={editorial.image.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex items-center bg-surface px-gutter py-16 md:px-[8%]">
        <div className="stack max-w-md items-start [--stack-gap:--spacing(6)]">
          <p className="type-eyebrow text-muted">{editorial.eyebrow}</p>
          <h2 id="editorial-title" className="type-h1 font-serif">
            {editorial.title}
          </h2>
          <p className="text-muted">{editorial.body}</p>
          <Link href="/craft" className="link-cta">
            Discover the craft
          </Link>
        </div>
      </div>
    </section>
  );
}

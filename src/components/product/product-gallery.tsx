import Image from "next/image";

import type { Product } from "@/lib/products";

export function ProductGallery({ product }: { product: Product }) {
  return (
    <div className="gallery" aria-label="Product images" role="region">
      <div className="media aspect-product">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, (min-width: 768px) 100vw, 88vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover"
        />
      </div>

      {product.views.map((view) => {
        const origin = `${view.x}% ${view.y}%`;
        // Detail shots are crops of the main image, so request it at the zoomed size.
        const scale = (vw: number) => `${Math.round(vw * view.zoom)}vw`;

        return (
          <div key={view.alt} className="media aspect-product">
            <Image
              src={product.image.src}
              alt={view.alt}
              fill
              sizes={`(min-width: 1280px) ${scale(32)}, (min-width: 1024px) ${scale(28)}, (min-width: 768px) ${scale(50)}, ${scale(88)}`}
              className="object-cover"
              style={{
                objectPosition: origin,
                transform: `scale(${view.zoom})`,
                transformOrigin: origin,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

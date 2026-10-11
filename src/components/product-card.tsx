import Image from "next/image";
import Link from "next/link";

import { formatPrice, getStockState, type Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
  sizes?: string;
  className?: string;
};

export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw",
  className,
}: ProductCardProps) {
  const soldOut = getStockState(product.stock) === "out_of_stock";
  const badge = soldOut ? "Sold out" : product.badge;

  return (
    <article className={className}>
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="media aspect-product">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
          />
          {badge ? (
            <span className="type-eyebrow absolute top-3 left-3 bg-paper px-2 py-1">
              {badge}
            </span>
          ) : null}
        </div>

        <div className="mt-3 stack px-1 [--stack-gap:--spacing(1)] md:px-0">
          <p className="type-eyebrow text-muted">{product.category}</p>
          <h3 className="type-caption group-hover:underline group-hover:underline-offset-4">
            {product.name}
          </h3>
          <p className={soldOut ? "type-caption text-muted" : "type-caption"}>
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </article>
  );
}

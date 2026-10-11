import Link from "next/link";
import type { ReactNode } from "react";

import { PlusIcon } from "@/components/icons";
import { StockStatus } from "@/components/product/stock-status";
import { formatPrice, getStockState, type Product } from "@/lib/products";

function Disclosure({
  title,
  children,
  open,
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details className="group border-b border-line" open={open}>
      <summary className="type-eyebrow flex cursor-pointer list-none items-center justify-between py-5 [&::-webkit-details-marker]:hidden">
        {title}
        <PlusIcon
          width={16}
          height={16}
          className="transition-transform duration-300 ease-luxe group-open:rotate-45"
        />
      </summary>
      <div className="type-caption pb-6 text-muted">{children}</div>
    </details>
  );
}

export function ProductInfo({ product }: { product: Product }) {
  const soldOut = getStockState(product.stock) === "out_of_stock";

  return (
    <div className="stack [--stack-gap:--spacing(8)]">
      <div className="stack [--stack-gap:--spacing(3)]">
        <p className="type-eyebrow text-muted">{product.category}</p>
        <h1 className="type-h2">{product.name}</h1>
        <p className="type-body">{formatPrice(product.price)}</p>
      </div>

      <dl className="type-caption grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-y border-line py-5">
        <dt className="text-muted">Color</dt>
        <dd>{product.color}</dd>
        <dt className="text-muted">Style</dt>
        <dd>{product.sku}</dd>
        <dt className="text-muted">Availability</dt>
        <dd>
          <StockStatus stock={product.stock} />
        </dd>
      </dl>

      <div className="stack [--stack-gap:--spacing(3)]">
        <button type="button" className="btn btn-primary btn-block" disabled={soldOut}>
          {soldOut ? "Sold out" : "Add to bag"}
        </button>
        <Link href="/appointments" className="btn btn-secondary btn-block">
          {soldOut ? "Ask a client advisor" : "Book an appointment"}
        </Link>
        <p className="type-caption text-center text-muted">
          Complimentary shipping and returns
        </p>
      </div>

      <div>
        <p className="mb-6 text-muted">{product.description}</p>

        <div className="border-t border-line">
          <Disclosure title="Product details" open>
            <ul className="stack [--stack-gap:--spacing(1.5)]">
              {product.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </Disclosure>
          <Disclosure title="Shipping and returns">
            <p>
              Complimentary express shipping on every order, delivered in 2–4
              business days. Returns and exchanges are free within 30 days of
              delivery.
            </p>
          </Disclosure>
          <Disclosure title="Care and services">
            <p>
              Every piece arrives with care instructions. Our client services
              team can arrange repairs, personalisation and gift wrapping.
            </p>
          </Disclosure>
        </div>
      </div>
    </div>
  );
}

import { getStockState } from "@/lib/products";

const dot = {
  in_stock: "bg-success",
  low_stock: "bg-accent",
  out_of_stock: "border border-subtle",
};

export function StockStatus({ stock }: { stock: number }) {
  const state = getStockState(stock);
  const label =
    state === "in_stock"
      ? "In stock"
      : state === "low_stock"
        ? `Only ${stock} left`
        : "Sold out";

  return (
    <p className="type-caption flex items-center gap-2">
      <span className={`size-1.5 rounded-full ${dot[state]}`} aria-hidden="true" />
      <span className={state === "out_of_stock" ? "text-muted" : undefined}>
        {label}
      </span>
    </p>
  );
}

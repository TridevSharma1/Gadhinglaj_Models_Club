import type { Product } from "@/data/catalog";
import ProductCard from "./ProductCard";
import { EmptyState } from "./SiteLayout";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length)
    return (
      <EmptyState
        title="No products found"
        text="Try adjusting your filters or search for a different style."
      />
    );
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

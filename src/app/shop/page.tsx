"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductGrid from "@/components/site/ProductGrid";
import SearchFilter, {
  applyFilters,
  defaultFilters,
  sortOptions,
  type Filters,
} from "@/components/site/SearchFilter";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";

function ShopContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const catParam = searchParams.get("category") || "All";
  const typeParam = searchParams.get("type") || "All";

  const { products, categories } = useStore();
  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    q: qParam,
    category: catParam,
    type: typeParam,
  });

  const sizes = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.sizes))).sort(),
    [products],
  );
  const colors = useMemo(
    () => Array.from(new Set(products.map((p) => p.color))).sort(),
    [products],
  );
  const occasions = useMemo(
    () => Array.from(new Set(products.map((p) => p.occasion))).sort(),
    [products],
  );

  const list = useMemo(() => applyFilters(products, filters), [products, filters]);

  return (
    <div className="container-lux grid gap-8 py-14 lg:grid-cols-[280px_1fr]">
      <SearchFilter
        filters={filters}
        setFilters={setFilters}
        categories={categories.filter((c) => c.active)}
        sizes={sizes}
        colors={colors}
        occasions={occasions}
      />
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{list.length} outfits found</p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sort</span>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-rose"
            >
              {sortOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <ProductGrid products={list} />
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="The collection"
        title="Shop"
        subtitle="Ready-made designer wear and luxury rental outfits, all in one place."
      />
      <Suspense fallback={<div className="container-lux py-14">Loading collection…</div>}>
        <ShopContent />
      </Suspense>
    </SiteLayout>
  );
}

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
import { X, Sparkles } from "lucide-react";

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

  const activeChips = [
    filters.q ? { label: `"${filters.q}"`, clear: () => setFilters({ ...filters, q: "" }) } : null,
    filters.category !== "All"
      ? { label: filters.category, clear: () => setFilters({ ...filters, category: "All" }) }
      : null,
    filters.type !== "All"
      ? { label: filters.type, clear: () => setFilters({ ...filters, type: "All" }) }
      : null,
    filters.size !== "All"
      ? { label: `Size ${filters.size}`, clear: () => setFilters({ ...filters, size: "All" }) }
      : null,
    filters.color !== "All"
      ? { label: filters.color, clear: () => setFilters({ ...filters, color: "All" }) }
      : null,
    filters.occasion !== "All"
      ? { label: filters.occasion, clear: () => setFilters({ ...filters, occasion: "All" }) }
      : null,
    filters.maxPrice < 50000
      ? { label: `≤ ₹${filters.maxPrice}`, clear: () => setFilters({ ...filters, maxPrice: 50000 }) }
      : null,
    filters.minRating > 0
      ? { label: `★ ${filters.minRating}+`, clear: () => setFilters({ ...filters, minRating: 0 }) }
      : null,
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="container-lux grid gap-10 py-16 lg:grid-cols-[290px_1fr]">
      {/* Sticky Filter Sidebar */}
      <div className="h-fit lg:sticky lg:top-28">
        <SearchFilter
          filters={filters}
          setFilters={setFilters}
          categories={categories.filter((c) => c.active)}
          sizes={sizes}
          colors={colors}
          occasions={occasions}
        />
      </div>

      {/* Main Catalog Section */}
      <div>
        {/* Results Header Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-5">
          <div>
            <p className="font-display text-2xl text-primary font-medium">
              {filters.category === "All" ? "Full Collection" : filters.category}
            </p>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              Showing {list.length} couture pieces available
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Sort By:
            </span>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground outline-none focus:border-rose transition-colors shadow-soft"
            >
              {sortOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeChips.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Active Filters:
            </span>
            {activeChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={chip.clear}
                className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-blush px-3 py-1 text-xs font-medium text-primary hover:border-primary transition-colors"
              >
                <span>{chip.label}</span>
                <X className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
              </button>
            ))}
            <button
              onClick={() => setFilters(defaultFilters)}
              className="text-xs text-rose underline ml-2 hover:opacity-80"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Product Grid */}
        <ProductGrid products={list} />
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="The Atelier Wardrobe"
        title="Complete Boutique Collection"
        subtitle="Explore our curated universe of designer evening gowns, handcrafted bridal lehengas, crop tops, and photoshoot trails — available for purchase or 3-day luxury rental."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop All Outfits" }]}
      />
      <Suspense fallback={<div className="container-lux py-20 text-center">Loading luxury collection…</div>}>
        <ShopContent />
      </Suspense>
    </SiteLayout>
  );
}

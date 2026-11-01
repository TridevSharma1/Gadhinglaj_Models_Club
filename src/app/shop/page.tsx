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
import { X, Sparkles, SlidersHorizontal, ChevronDown } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") || "";
  const catParam = searchParams.get("category") || "All";
  const typeParam = searchParams.get("type") || "All";

  const { products, categories } = useStore();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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
    <div className="container-lux py-8 sm:py-12 lg:py-16">
      {/* Mobile & Tablet Quick Filter Bar (< lg) */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-xs font-semibold text-primary shadow-2xs hover:bg-primary/10 transition-colors"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filters &amp; Refine</span>
          {activeChips.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {activeChips.length}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            Sort:
          </span>
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-rose transition-colors shadow-2xs"
          >
            {sortOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Slide-in Drawer Backdrop & Filter Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            aria-hidden="true"
          />
          <div className="relative z-50 ml-auto flex h-full w-full max-w-sm flex-col bg-card p-6 shadow-2xl overflow-y-auto animate-slide-left">
            <div className="flex items-center justify-between border-b border-border/70 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h3 className="font-display text-lg font-medium text-primary">Filter Wardrobe</h3>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <SearchFilter
                filters={filters}
                setFilters={setFilters}
                categories={categories.filter((c) => c.active)}
                sizes={sizes}
                colors={colors}
                occasions={occasions}
              />
            </div>

            <div className="mt-4 border-t border-border/70 pt-4">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-full bg-primary py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-lift"
              >
                Show {list.length} Outfits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Catalog Layout */}
      <div className="grid gap-10 lg:grid-cols-[290px_1fr]">
        {/* Desktop Sticky Filter Sidebar */}
        <div className="hidden h-fit lg:block lg:sticky lg:top-28">
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
          {/* Results Header Bar (Desktop & Tablet) */}
          <div className="mb-6 hidden sm:flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-5">
            <div>
              <p className="font-display text-2xl text-primary font-medium">
                {filters.category === "All" ? "Full Collection" : filters.category}
              </p>
              <p className="text-xs text-muted-foreground font-light mt-0.5">
                Showing {list.length} couture pieces available
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-3">
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

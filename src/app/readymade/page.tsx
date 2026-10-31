"use client";

import { useMemo, useState } from "react";
import ProductGrid from "@/components/site/ProductGrid";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { sortOptions } from "@/components/site/SearchFilter";
import { useStore } from "@/lib/store";
import { Scissors, Truck, ShieldCheck, Sparkles } from "lucide-react";

export default function ReadyMadePage() {
  const { products } = useStore();
  const [sort, setSort] = useState("Newest");

  const list = useMemo(() => {
    const out = products.filter((p) => p.active && p.type === "readymade");
    if (sort === "Price Low to High") out.sort((a, b) => a.price - b.price);
    else if (sort === "Price High to Low") out.sort((a, b) => b.price - a.price);
    else if (sort === "Popular") out.sort((a, b) => b.reviews - a.reviews);
    else if (sort === "Best Rated") out.sort((a, b) => b.rating - a.rating);
    else out.sort((a, b) => b.id - a.id);
    return out;
  }, [products, sort]);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Ready-to-Wear Atelier"
        title="Ready-Made Designer Collection"
        subtitle="Purchase sculpted gowns, contemporary crop tops, and traditional ethnic silhouettes straight off the rack. Handcrafted, inspected, and delivered across Maharashtra."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Ready-Made Outfits" }]}
      />

      {/* Trust Highlights */}
      <div className="border-b border-border/80 bg-secondary/50 py-6">
        <div className="container-lux flex flex-wrap items-center justify-around gap-6 text-xs text-muted-foreground font-light">
          <div className="flex items-center gap-2">
            <Scissors className="h-4 w-4 text-primary" />
            <span className="text-foreground font-medium">Complimentary Custom Alterations</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            <span>Dispatched Within 48 Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>7-Day Sizing Exchange Guarantee</span>
          </div>
        </div>
      </div>

      <div className="container-lux py-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-5">
          <div>
            <p className="font-display text-2xl text-primary font-medium">Available Off-The-Rack</p>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              Showing {list.length} ready-to-wear pieces
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Sort:
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground outline-none focus:border-rose transition-colors shadow-soft"
            >
              {sortOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <ProductGrid products={list} />
      </div>
    </SiteLayout>
  );
}

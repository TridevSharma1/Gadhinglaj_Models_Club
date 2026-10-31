"use client";

import { useMemo, useState } from "react";
import ProductGrid from "@/components/site/ProductGrid";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { sortOptions } from "@/components/site/SearchFilter";
import { useStore } from "@/lib/store";

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
        eyebrow="Buy off the rack"
        title="Ready-Made Collection"
        subtitle="Designer gowns, crop tops, ethnic dresses and contemporary Indian wear — delivered to your door."
      />
      <div className="container-lux py-14">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{list.length} outfits</p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
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
    </SiteLayout>
  );
}

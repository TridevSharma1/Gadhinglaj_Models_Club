"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import CategoryCard from "@/components/site/CategoryCard";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import ProductCard from "@/components/site/ProductCard";
import { useStore } from "@/lib/store";
import {
  Sparkles,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Crown,
  Scissors,
  ShieldCheck,
  Calendar,
  MessageCircle,
  Layers,
} from "lucide-react";

export default function CategoriesPage() {
  const { categories, subcategories, products } = useStore();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "rental" | "readymade">("all");

  const activeCategories = useMemo(() => {
    return categories.filter((c) => c.active);
  }, [categories]);

  // Filtered categories based on search query
  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    return activeCategories.filter((c) => {
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.blurb && c.blurb.toLowerCase().includes(q));

      if (!matchSearch) return false;

      if (filterType === "rental") {
        return products.some((p) => p.category === c.name && p.type === "rental");
      }
      if (filterType === "readymade") {
        return products.some((p) => p.category === c.name && p.type === "readymade");
      }
      return true;
    });
  }, [activeCategories, search, filterType, products]);

  // Featured outfits across all active categories (up to 4)
  const featuredOutfits = useMemo(() => {
    return products.filter((p) => p.active && p.featured).slice(0, 4);
  }, [products]);

  // Subcategories mapped by Category ID or Category Name
  const subcategoriesByCategory = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const sub of subcategories) {
      if (!sub.active) continue;
      const key = sub.categoryName;
      if (!map[key]) map[key] = [];
      map[key].push(sub.name);
    }
    return map;
  }, [subcategories]);

  const totalOutfits = products.filter((p) => p.active).length;

  return (
    <SiteLayout>
      {/* Editorial Luxury Page Header */}
      <div className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-blush/60 via-card to-background py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#c59b27_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="container-lux relative z-10 text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-300/60 bg-gold-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary shadow-xs">
            <Crown className="h-3.5 w-3.5 text-gold-500" />
            <span>Gadhinglaj Models Club Atelier</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-primary tracking-tight">
            Curated Wardrobes &amp; Collections
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            Discover bespoke bridal couture, designer reception lehengas, regal rental silks, and festive prêt-à-porter hand-finished by Priyanka Desai.
          </p>

          {/* Quick Stats Pill */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5 bg-white/80 border border-border px-3 py-1 rounded-full shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-gold-500" />
              <span>{activeCategories.length} Haute Couture Themes</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 border border-border px-3 py-1 rounded-full shadow-2xs">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>{subcategories.filter((s) => s.active).length} Silhouette Styles</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/80 border border-border px-3 py-1 rounded-full shadow-2xs">
              <Crown className="h-3.5 w-3.5 text-gold-500" />
              <span>{totalOutfits} Handcrafted Outfits</span>
            </span>
          </div>

          {/* Interactive Search & Filter Controls */}
          <div className="pt-6 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search collections (e.g. Bridal, Saree, Lehengas)..."
                className="w-full rounded-2xl border border-border/80 bg-white/95 pl-11 pr-4 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-300/30 shadow-xs"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-border bg-white shadow-2xs shrink-0 w-full sm:w-auto justify-center">
              <button
                onClick={() => setFilterType("all")}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  filterType === "all"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("rental")}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  filterType === "rental"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Rental Studio
              </button>
              <button
                onClick={() => setFilterType("readymade")}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  filterType === "readymade"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Ready-to-Wear
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-lux py-14 sm:py-20 space-y-20">
        {/* Main Categories Grid */}
        <section>
          <div className="flex items-end justify-between mb-8 border-b border-border/80 pb-4">
            <div>
              <p className="eyebrow text-gold-600">The Editorial Wardrobes</p>
              <h2 className="font-display text-2xl sm:text-3xl text-primary font-normal">
                Explore Signature Silhouettes
              </h2>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Showing {filteredCategories.length} of {activeCategories.length} themes
            </span>
          </div>

          {filteredCategories.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCategories.map((c) => {
                const count = products.filter(
                  (p) =>
                    p.active &&
                    (p.category === c.name || (c.name === "Rental Collection" && p.type === "rental")),
                ).length;
                const subs = subcategoriesByCategory[c.name] || [];

                return (
                  <CategoryCard
                    key={c.id}
                    category={c}
                    productCount={count}
                    subcategories={subs}
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border/80 bg-white p-12 text-center shadow-soft max-w-xl mx-auto">
              <Sparkles className="mx-auto h-9 w-9 text-gold-400" />
              <h3 className="mt-3 font-display text-xl text-primary font-medium">
                No matching collections found
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Try searching with different terms or reset your filter.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilterType("all");
                }}
                className="mt-4 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-xs"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

        {/* Subcategories Quick Jump Gallery */}
        {subcategories.filter((s) => s.active).length > 0 && (
          <section className="rounded-3xl border border-gold-300/40 bg-gradient-to-br from-blush/40 via-card to-white p-8 sm:p-12 shadow-lift">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="eyebrow text-gold-600">Detailed Classification</span>
                <h3 className="font-display text-2xl sm:text-3xl text-primary mt-1">
                  Browse by Specific Silhouette &amp; Subcategory
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-light">
                  Direct links to our curated sub-departments with tailored size profiles.
                </p>
              </div>

              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-gold-600 transition-colors"
              >
                <span>View Full Inventory in Shop</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {subcategories
                .filter((s) => s.active)
                .map((sub) => {
                  const subProductCount = products.filter(
                    (p) => p.active && p.subcategory === sub.name,
                  ).length;

                  return (
                    <Link
                      key={sub.id}
                      href={`/shop?category=${encodeURIComponent(sub.categoryName)}&subCategory=${encodeURIComponent(sub.name)}`}
                      className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-white p-4.5 shadow-2xs hover:border-gold-400 hover:shadow-soft transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                          {sub.categoryName}
                        </span>
                        <h4 className="font-display text-lg text-primary group-hover:text-gold-700 transition-colors">
                          {sub.name}
                        </h4>
                        {sub.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 font-light">
                            {sub.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {subProductCount} {subProductCount === 1 ? "Outfit" : "Outfits"}
                        </span>
                        <span className="text-primary font-semibold text-[11px] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          <span>Explore</span>
                          <span>→</span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </section>
        )}

        {/* Featured Atelier Garments Spotlight */}
        {featuredOutfits.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-end justify-between border-b border-border/80 pb-4">
              <div>
                <span className="eyebrow text-gold-600">Curator&apos;s Highlights</span>
                <h3 className="font-display text-2xl sm:text-3xl text-primary mt-1">
                  Handcrafted Spotlight from the Collections
                </h3>
              </div>
              <Link
                href="/shop"
                className="text-xs font-semibold text-primary hover:text-gold-600 transition-colors hidden sm:inline"
              >
                View All Outfits →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredOutfits.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Boutique Distinction & Atelier Heritage Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-primary text-white p-8 sm:p-14 shadow-lift">
          <div className="relative z-10 max-w-3xl space-y-5">
            <span className="inline-block rounded-full bg-gold-400/20 border border-gold-300/40 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-300">
              Personalized Couture Fitting
            </span>

            <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white">
              Bespoke Bridal Consultations &amp; Luxury Rental Studio
            </h3>

            <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed">
              Every garment in our collection is curated with heritage craftsmanship. Visit our flagship studio at Gadhinglaj for master tailoring adjustments, personalized jewelry coordination, and bridal fittings.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="https://wa.me/919699620950?text=Hello%20Priyanka%20Desai,%20I%20would%20like%20to%20schedule%20a%20bridal%20consultation%20at%20Gadhinglaj%20Models%20Club."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-neutral-900 shadow-gold hover:bg-gold-300 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Book VIP Fitting on WhatsApp</span>
              </a>

              <Link
                href="/rental"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/20 transition-colors"
              >
                <Calendar className="h-4 w-4" />
                <span>Explore Rental Studio</span>
              </Link>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="font-display text-2xl sm:text-3xl font-bold text-gold-300">100%</p>
              <p className="text-xs text-white/70 font-light mt-1">Authentic Silks &amp; Hand Zari</p>
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-bold text-gold-300">Free</p>
              <p className="text-xs text-white/70 font-light mt-1">In-Studio Alterations</p>
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-bold text-gold-300">3-Day</p>
              <p className="text-xs text-white/70 font-light mt-1">Flexible Rental Period</p>
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-bold text-gold-300">Fast</p>
              <p className="text-xs text-white/70 font-light mt-1">Maharashtra Dispatch</p>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}

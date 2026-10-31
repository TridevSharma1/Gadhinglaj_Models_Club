"use client";

import Link from "next/link";
import ProductGrid from "@/components/site/ProductGrid";
import SiteLayout, { EmptyState, PageHero } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";

export default function WishlistPage() {
  const { products, wishlist, addToCart } = useStore();
  const list = products.filter((p) => wishlist.includes(p.id) && p.active);

  const handleAddAllToCart = () => {
    list
      .filter((p) => p.type === "readymade")
      .forEach((p) => addToCart(p.id, p.sizes[0] ?? "M", 1));
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Personal Vault"
        title="Your Saved Wishlist"
        subtitle="Keep track of your favorite gowns, celebratory lehengas, and rental picks until you are ready for your special day."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />

      <div className="container-lux py-16">
        {list.length ? (
          <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-5">
              <div>
                <p className="font-display text-2xl text-primary font-medium">Saved Pieces</p>
                <p className="text-xs text-muted-foreground font-light mt-0.5">
                  {list.length} item{list.length > 1 ? "s" : ""} currently saved in your private vault
                </p>
              </div>

              {list.some((p) => p.type === "readymade") && (
                <button
                  onClick={handleAddAllToCart}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lift hover:opacity-90 transition-opacity"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Move Ready-Made to Bag
                </button>
              )}
            </div>

            <ProductGrid products={list} />
          </div>
        ) : (
          <EmptyState
            title="Your Wishlist Is Empty"
            text="Explore our catalog and click the heart on any gown, saree, or rental outfit to save it here."
            action={
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift"
                >
                  Discover Collection
                </Link>
                <Link
                  href="/rental"
                  className="rounded-full border border-border px-8 py-3 text-xs font-semibold uppercase tracking-widest text-primary hover:bg-blush"
                >
                  Explore Rentals
                </Link>
              </div>
            }
          />
        )}
      </div>
    </SiteLayout>
  );
}

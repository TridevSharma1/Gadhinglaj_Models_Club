"use client";

import Link from "next/link";
import ProductGrid from "@/components/site/ProductGrid";
import SiteLayout, { EmptyState, PageHero } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";

export default function WishlistPage() {
  const { products, wishlist } = useStore();
  const list = products.filter((p) => wishlist.includes(p.id) && p.active);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Saved for later"
        title="Wishlist"
        subtitle="The pieces you loved, kept safe until you are ready."
      />
      <div className="container-lux py-14">
        {list.length ? (
          <ProductGrid products={list} />
        ) : (
          <EmptyState
            title="Your wishlist is empty"
            text="Tap the heart on any outfit to save it here."
            action={
              <Link
                href="/shop"
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Browse the collection
              </Link>
            }
          />
        )}
      </div>
    </SiteLayout>
  );
}

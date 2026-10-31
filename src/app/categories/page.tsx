"use client";

import CategoryCard from "@/components/site/CategoryCard";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";

export default function CategoriesPage() {
  const { categories, products } = useStore();
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Browse"
        title="Categories"
        subtitle="Eight curated collections, each styled for a different kind of moment."
      />
      <div className="container-lux grid gap-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {categories
          .filter((c) => c.active)
          .map((c) => (
            <div key={c.id}>
              <CategoryCard category={c} />
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {
                  products.filter(
                    (p) =>
                      p.active &&
                      (p.category === c.name ||
                        (c.name === "Rental Collection" && p.type === "rental")),
                  ).length
                }{" "}
                outfits
              </p>
            </div>
          ))}
      </div>
    </SiteLayout>
  );
}

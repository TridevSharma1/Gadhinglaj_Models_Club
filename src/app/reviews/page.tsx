"use client";

import SiteLayout, { EmptyState, PageHero } from "@/components/site/SiteLayout";
import { Stars } from "@/components/site/Icons";
import { useStore } from "@/lib/store";

export default function ReviewsPage() {
  const { reviews } = useStore();
  const live = reviews.filter((r) => r.approved);
  const avg = live.length ? live.reduce((n, r) => n + r.rating, 0) / live.length : 0;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Kind words"
        title="Reviews"
        subtitle={
          live.length
            ? `${avg.toFixed(1)} average rating from ${live.length} verified boutique customers.`
            : "Approved customer reviews appear here."
        }
      />
      <div className="container-lux py-14">
        {live.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {live.map((r) => (
              <article key={r.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-blush font-display text-lg text-primary">
                    {r.initials}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                </div>
                <Stars rating={r.rating} className="mt-4" />
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">"{r.text}"</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No reviews yet" text="Approved customer reviews will appear here." />
        )}
      </div>
    </SiteLayout>
  );
}

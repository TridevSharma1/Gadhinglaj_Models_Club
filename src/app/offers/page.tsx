"use client";

import Link from "next/link";
import SiteLayout, { EmptyState, PageHero } from "@/components/site/SiteLayout";
import { offerImg } from "@/data/catalog";
import { useStore } from "@/lib/store";

export default function OffersPage() {
  const { offers } = useStore();
  const live = offers.filter((o) => o.active);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Limited period"
        title="Offers"
        subtitle="Look extraordinary. Spend smart."
      />

      <section className="container-lux py-14">
        <div className="relative overflow-hidden rounded-3xl shadow-lift">
          <img src={offerImg} alt="Seasonal boutique offer" className="h-[320px] w-full object-cover md:h-[420px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/55 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-lg px-8 md:px-14">
              <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/80">
                Season edit
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight text-primary-foreground md:text-5xl">
                Up to 30% OFF on Selected Designer Collections
              </h2>
              <Link
                href="/shop"
                className="mt-7 inline-block rounded-full bg-background px-7 py-3 text-sm font-medium text-primary shadow-lift"
              >
                Shop the offer
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12">
          {live.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {live.map((o) => (
                <article key={o.id} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <span className="inline-block rounded-full bg-blush px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
                    {o.discount}
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-primary">{o.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.description}</p>
                  <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
                    Valid {o.start} to {o.end}
                  </p>
                  <Link
                    href="/shop"
                    className="mt-5 inline-block rounded-full border border-border px-5 py-2 text-sm text-primary hover:bg-blush"
                  >
                    Redeem in store
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No live offers" text="New seasonal offers are announced every month." />
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import SiteLayout, { EmptyState, PageHero } from "@/components/site/SiteLayout";
import { offerImg } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { Tag, Sparkles, Copy, Check, ArrowRight, Clock } from "lucide-react";

export default function OffersPage() {
  const { offers } = useStore();
  const live = offers.filter((o) => o.active);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCoupon = (code: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Special Privilege"
        title="Promotions &amp; Seasonal Privileges"
        subtitle="Exclusive festive discounts on designer gowns, bridal wear, and multi-day rental packages at Gadhinglaj Models Club."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Offers" }]}
      />

      <section className="container-lux py-16 space-y-16">
        {/* Editorial Feature Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border/80 shadow-lift">
          <img
            src={offerImg}
            alt="Seasonal Boutique Offer"
            className="h-[340px] md:h-[440px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-xl px-8 py-12 md:px-16 text-white space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 border border-accent/40 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                <Tag className="h-3 w-3" />
                Featured Promotion
              </span>

              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-tight">
                Up to 30% OFF On Designer Collections.
              </h2>

              <p className="text-sm text-white/85 font-light leading-relaxed max-w-md">
                Available across both ready-made purchases and celebratory rentals. Apply coupon code in bag or redeem in person at the boutique.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => copyCoupon("GMC10")}
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/30 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md hover:bg-white hover:text-primary transition-all"
                >
                  {copiedCode === "GMC10" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedCode === "GMC10" ? "Code Copied!" : "Copy Code: GMC10"}</span>
                </button>

                <Link
                  href="/shop"
                  className="rounded-full bg-accent px-8 py-3 text-xs font-semibold uppercase tracking-widest text-accent-foreground shadow-gold hover:bg-gold-light transition-all"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Live Offers Grid */}
        <div>
          <div className="mb-8 border-b border-border/70 pb-4">
            <h3 className="font-display text-2xl text-primary font-medium">Active Privileges</h3>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              Redeemable online at checkout or in-store during studio fittings
            </p>
          </div>

          {live.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {live.map((o) => (
                <article
                  key={o.id}
                  className="animate-fade-up relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                        {o.discount}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-light">
                        <Clock className="h-3 w-3" />
                        Valid {o.start} to {o.end}
                      </span>
                    </div>

                    <h4 className="font-display text-2xl font-medium text-primary">{o.title}</h4>

                    <p className="text-xs leading-relaxed text-muted-foreground font-light">
                      {o.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between gap-3">
                    <button
                      onClick={() => copyCoupon(o.discount.replace(/[^A-Za-z0-9]/g, "") || "GMC10")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary hover:text-rose transition-colors"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy Offer</span>
                    </button>

                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lift hover:opacity-90"
                    >
                      <span>Redeem</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Active Seasonal Offers"
              text="New monthly and festive privileges are published regularly. Check back soon!"
            />
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

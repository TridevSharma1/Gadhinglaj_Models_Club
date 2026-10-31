"use client";

import Link from "next/link";
import SiteLayout, { PageHero, SectionHead } from "@/components/site/SiteLayout";
import { Stars } from "@/components/site/Icons";
import { useStore } from "@/lib/store";
import { inr } from "@/data/catalog";

const occasions = [
  "Pre-wedding shoots",
  "Post-wedding celebrations",
  "Maternity photoshoots",
  "Engagements",
  "Parties",
  "Special occasions",
];

export default function RentalPage() {
  const { products } = useStore();
  const list = products.filter((p) => p.active && p.type === "rental");

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Rental studio"
        title="Luxury Looks Without the Luxury Price"
        subtitle="Wear a ₹40,000 designer creation for a fraction of the price. Every rental is dry-cleaned, fitted and styled before it reaches you."
      />

      <div className="container-lux py-12">
        <div className="flex flex-wrap justify-center gap-3">
          {occasions.map((o) => (
            <span
              key={o}
              className="rounded-full border border-accent/60 bg-accent/10 px-4 py-2 text-xs uppercase tracking-widest text-primary"
            >
              {o}
            </span>
          ))}
        </div>
      </div>

      <div className="container-lux pb-20">
        <SectionHead
          eyebrow={`${list.length} outfits available`}
          title="Rental Wardrobe"
          subtitle="Rental price, security deposit and availability shown upfront — no surprises."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <article
              key={p.id}
              className="animate-fade-up overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
            >
              <Link href={`/product/${p.id}`} className="block">
                <div className="aspect-[4/5] overflow-hidden bg-blush">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </Link>
              <div className="space-y-3 p-5">
                <p className="eyebrow text-[10px]">{p.category}</p>
                <h3 className="font-display text-xl text-primary">{p.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Stars rating={p.rating} />
                  <span>{p.rating}</span>
                </div>
                <dl className="grid grid-cols-2 gap-y-2 rounded-2xl bg-secondary/60 p-4 text-xs">
                  <dt className="text-muted-foreground">Rental price</dt>
                  <dd className="text-right font-semibold text-primary">{inr(p.rentalPrice)}</dd>
                  <dt className="text-muted-foreground">Security deposit</dt>
                  <dd className="text-right">{inr(p.deposit)}</dd>
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd className="text-right">{p.rentalDuration}</dd>
                  <dt className="text-muted-foreground">Sizes</dt>
                  <dd className="text-right">{p.sizes.join(", ")}</dd>
                  <dt className="text-muted-foreground">Availability</dt>
                  <dd
                    className={`text-right font-medium ${p.stock > 0 ? "text-primary" : "text-destructive"}`}
                  >
                    {p.stock > 0 ? `Available (${p.stock})` : "Booked out"}
                  </dd>
                </dl>
                <Link
                  href={`/rental-booking?product=${p.id}`}
                  className="block rounded-full bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground"
                >
                  Book for Rental
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}

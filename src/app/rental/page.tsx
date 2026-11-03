"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { Stars } from "@/components/site/Icons";
import { useStore } from "@/lib/store";
import { inr } from "@/data/catalog";
import {
  Calendar,
  ShieldCheck,
  Sparkles,
  Scissors,
  Clock,
  ArrowRight,
  Palette,
  Crown,
} from "lucide-react";

const occasions = [
  "All Occasions",
  "Pre-Wedding Shoots",
  "Post-Wedding Celebrations",
  "Maternity Photoshoots",
  "Engagements",
  "Gala & Party Wear",
];

export default function RentalPage() {
  const { products } = useStore();
  const [selectedOccasion, setSelectedOccasion] = useState("All Occasions");

  // Filter products: Strictly shows ONLY products marked as Rental (p.type === "rental")
  const list = useMemo(() => {
    return products.filter((p) => {
      if (!p.active) return false;
      const isRental = p.type === "rental";

      if (!isRental) return false;

      if (selectedOccasion === "All Occasions") return true;

      if (!p.occasion) return true; // keep visible if occasion isn't strictly defined
      return (
        p.occasion.toLowerCase().includes(selectedOccasion.toLowerCase().slice(0, 4)) ||
        selectedOccasion.toLowerCase().includes(p.occasion.toLowerCase().slice(0, 4))
      );
    });
  }, [products, selectedOccasion]);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Dress Rental Studio"
        title="Luxury Looks Without The Luxury Price"
        subtitle="Rent red-carpet designer gowns, wedding lehengas, and photoshoot trails starting at ₹1,999 for a 3-day window. Every rental includes custom trial fitting, steam sanitization, and hassle-free deposit refund."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dress Rental Studio" }]}
      />

      {/* Interactive Occasions Pill Bar */}
      <div className="border-b border-border/80 bg-secondary/50 py-6">
        <div className="container-lux flex flex-wrap items-center justify-center gap-2.5">
          {occasions.map((o) => (
            <button
              key={o}
              onClick={() => setSelectedOccasion(o)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedOccasion === o
                  ? "bg-primary text-primary-foreground shadow-lift scale-105"
                  : "border border-border/80 bg-card hover:bg-blush text-muted-foreground"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Rental Benefits Cards */}
      <section className="container-lux py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-soft">
            <Clock className="h-6 w-6 text-accent mb-3" />
            <h4 className="font-display text-lg font-medium text-primary">3-Day Window</h4>
            <p className="mt-1 text-xs text-muted-foreground font-light leading-relaxed">
              Pick up on Day 1, wear on Day 2, return on Day 3. Extensions available on request.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-soft">
            <ShieldCheck className="h-6 w-6 text-accent mb-3" />
            <h4 className="font-display text-lg font-medium text-primary">Zero Risk Deposit</h4>
            <p className="mt-1 text-xs text-muted-foreground font-light leading-relaxed">
              Security deposits are refunded promptly upon return of the outfit in intact condition.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-soft">
            <Scissors className="h-6 w-6 text-accent mb-3" />
            <h4 className="font-display text-lg font-medium text-primary">Complimentary Alteration</h4>
            <p className="mt-1 text-xs text-muted-foreground font-light leading-relaxed">
              We adjust the drape, bust, and waistline to your measurements prior to handover.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-soft">
            <Sparkles className="h-6 w-6 text-accent mb-3" />
            <h4 className="font-display text-lg font-medium text-primary">Steam Sanitized</h4>
            <p className="mt-1 text-xs text-muted-foreground font-light leading-relaxed">
              Professionally dry-cleaned, steam-pressed, and packed in luxury garment covers.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <div className="container-lux pb-24">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-5">
          <div>
            <p className="font-display text-2xl text-primary font-medium flex items-center gap-2">
              <span>Rental Wardrobe</span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary font-sans">
                {list.length} {list.length === 1 ? "Outfit" : "Outfits"}
              </span>
            </p>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              Curated haute couture silhouettes ready for your shoot or wedding.
            </p>
          </div>

          <Link
            href="/rental-booking"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground shadow-gold hover:bg-gold-light transition-all"
          >
            <span>Custom Rental Reservation</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {list.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => {
              const cardImg = p.image || p.colors?.[0]?.image || "";
              const cardRentalPrice = p.rentalPrice || Math.round((p.price || 4000) * 0.4) || 1999;
              const cardDeposit = p.deposit || cardRentalPrice * 2 || 3999;
              const availableShades = p.colors?.length || 1;

              return (
                <article
                  key={p.id}
                  className="group animate-fade-up flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-blush">
                    <Link href={`/product/${p.id}`} className="block h-full w-full">
                      {cardImg ? (
                        <img
                          src={cardImg}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-muted text-xs text-muted-foreground">
                          No cover image
                        </div>
                      )}
                    </Link>

                    <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                      <span className="rounded-full bg-primary/95 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground shadow-sm">
                        {p.rentalDuration || "3-Day Rental"}
                      </span>

                      {availableShades > 1 && (
                        <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-foreground border border-border/80 shadow-2xs flex items-center gap-1">
                          <Palette className="h-3 w-3 text-primary" />
                          <span>{availableShades} Shades</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6 space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="eyebrow text-[9.5px] text-gold-600 font-semibold">{p.category}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Stars rating={p.rating} className="scale-90" />
                          <span>{p.rating}</span>
                        </div>
                      </div>

                      <Link
                        href={`/product/${p.id}`}
                        className="mt-1.5 block font-display text-2xl font-medium text-primary hover:underline line-clamp-1"
                      >
                        {p.name}
                      </Link>

                      <p className="mt-1 text-xs text-muted-foreground font-light line-clamp-2">
                        {p.description}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border/70 bg-secondary/50 p-4 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-light">3-Day Rental Fee</span>
                        <span className="font-display text-lg font-bold text-primary">
                          {inr(cardRentalPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground font-light">
                          Refundable Security Deposit
                        </span>
                        <span className="font-medium text-foreground">{inr(cardDeposit)}</span>
                      </div>
                      {p.price > 0 && (
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-muted-foreground font-light">
                            Original Retail Value
                          </span>
                          <span className="line-through text-muted-foreground">{inr(p.price)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-[11px] pt-1 border-t border-border/50">
                        <span className="text-muted-foreground font-light">Fitting Sizes</span>
                        <span className="font-semibold text-primary">
                          {p.sizes && p.sizes.length > 0 ? p.sizes.join(", ") : "Free Size"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href={`/product/${p.id}`}
                        className="rounded-full border border-border py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-primary hover:bg-blush transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/rental-booking?product=${p.id}&color=${encodeURIComponent(p.color || "")}&size=${encodeURIComponent(p.sizes?.[0] || "")}`}
                        className="rounded-full bg-primary py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lift hover:opacity-90 transition-opacity"
                      >
                        Book Rental
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border/80 bg-white p-14 text-center shadow-soft max-w-xl mx-auto space-y-4">
            <Sparkles className="mx-auto h-10 w-10 text-gold-400" />
            <h3 className="font-display text-2xl text-primary font-medium">
              Rental Wardrobe Being Curated
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              No outfits currently marked as &quot;Rental Studio&quot;. Select &quot;Rental Studio Option&quot; while creating any product in the Admin Panel to display it here, or book a Custom Bespoke Rental Reservation today!
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/rental-booking"
                className="rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lift hover:bg-primary/95 transition-all"
              >
                Custom Rental Reservation →
              </Link>
              <Link
                href="/admin/products"
                className="rounded-full border border-border bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-blush transition-colors"
              >
                Admin Product Catalog
              </Link>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

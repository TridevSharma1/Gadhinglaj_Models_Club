"use client";

import Link from "next/link";
import { useState } from "react";
import Hero from "@/components/site/Hero";
import CategoryCard from "@/components/site/CategoryCard";
import ProductGrid from "@/components/site/ProductGrid";
import Testimonials from "@/components/site/Testimonials";
import SiteLayout, { SectionHead } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { aboutImg, offerImg, inr, photoshootTypes, whyChooseUs } from "@/data/catalog";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Scissors,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Tag,
  ShieldCheck,
  Star,
} from "lucide-react";

export default function Home() {
  const { products, categories, content } = useStore();
  const [tab, setTab] = useState<"featured" | "rentals" | "readymade">("featured");

  const featured = products.filter((p) => p.active && p.featured).slice(0, 8);
  const rentals = products.filter((p) => p.active && p.type === "rental").slice(0, 8);
  const readymade = products.filter((p) => p.active && p.type === "readymade").slice(0, 8);

  const displayList = tab === "featured" ? featured : tab === "rentals" ? rentals : readymade;

  return (
    <SiteLayout>
      {/* 1. Haute Couture Hero Carousel */}
      <Hero />

      {/* 2. The GMC Experience in 4 Steps */}
      <section className="border-b border-border/80 bg-secondary/40 py-16">
        <div className="container-lux">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-accent font-display text-xl font-bold shadow-soft">
                01
              </span>
              <div>
                <h4 className="font-display text-lg font-semibold text-primary">Curate Your Style</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground font-light">
                  Browse designer gowns, pre-wedding trails &amp; royal lehengas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-accent font-display text-xl font-bold shadow-soft">
                02
              </span>
              <div>
                <h4 className="font-display text-lg font-semibold text-primary">In-Studio Fitting</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground font-light">
                  Complimentary custom alteration and trial fitting at our Tilak Path boutique.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-accent font-display text-xl font-bold shadow-soft">
                03
              </span>
              <div>
                <h4 className="font-display text-lg font-semibold text-primary">Shine at Your Event</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground font-light">
                  Flaunt a ₹40,000+ luxury silhouette with confidence and zero maintenance hassle.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-accent font-display text-xl font-bold shadow-soft">
                04
              </span>
              <div>
                <h4 className="font-display text-lg font-semibold text-primary">Effortless Return</h4>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground font-light">
                  Return within the 3-day window; your security deposit is refunded promptly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Curated Wardrobes Categories */}
      <section className="container-lux py-24">
        <SectionHead
          eyebrow="Shop By Occasion"
          title="Curated Atelier Wardrobes"
          subtitle="From bridal grandeur and reception silhouettes to casual elegance — styles handcrafted for every milestone."
        />
        {categories.filter((c) => c && c.name && c.active).length > 0 ? (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories
              .filter((c) => c && c.name && c.active)
              .map((c) => (
                <CategoryCard key={c.id || c.name} category={c} />
              ))}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center shadow-soft max-w-xl mx-auto">
            <Sparkles className="mx-auto h-8 w-8 text-gold-400" />
            <h4 className="mt-3 font-serif text-xl font-medium text-primary">
              Couture Collections In Preparation
            </h4>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Our seasonal categories and wardrobes are being curated. Administrators can add fresh categories from the dashboard.
            </p>
            <div className="mt-5">
              <Link
                href="/admin/categories"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-95"
              >
                <span>Add Categories in Admin</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 4. Signature Collection with Tab Switcher */}
      <section className="border-y border-border/80 bg-secondary/30 py-24">
        <div className="container-lux">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <p className="eyebrow">Signature Edits</p>
              <h2 className="mt-2 font-display text-3xl text-primary md:text-4xl font-normal">
                Handpicked Pieces
              </h2>
            </div>

            {/* Segmented Filter Pills */}
            <div className="flex rounded-full border border-border bg-card p-1 shadow-soft">
              <button
                onClick={() => setTab("featured")}
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  tab === "featured"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Atelier Edit
              </button>
              <button
                onClick={() => setTab("rentals")}
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  tab === "rentals"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Top Rentals
              </button>
              <button
                onClick={() => setTab("readymade")}
                className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                  tab === "readymade"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Ready-To-Wear
              </button>
            </div>
          </div>

          <div className="mt-12">
            <ProductGrid products={displayList} />
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-9 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5 hover:opacity-95"
            >
              <span>Explore Complete Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Luxury Rental Highlight Banner */}
      <section className="container-lux py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border/80 bg-gradient-to-br from-primary via-wine-deep to-stone-950 p-8 md:p-16 text-white shadow-lift">
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative z-10 grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-white/10 px-4 py-1.5 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                  Gadhinglaj Dress Rental Studio
                </span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-white">
                Luxury Looks Without The Luxury Price.
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-white/85 font-light max-w-xl">
                Pre-wedding shoots, maternity milestones, sangeets, and receptions. Rent a couture piece starting from just {inr(2299)} for a 3-day window with complete fitting adjustments included.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="font-display text-2xl font-bold text-accent">3 Days</p>
                  <p className="text-xs text-white/75 font-light mt-0.5">Standard Rental Window</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="font-display text-2xl font-bold text-accent">100%</p>
                  <p className="text-xs text-white/75 font-light mt-0.5">Refundable Deposit</p>
                </div>
                <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                  <p className="font-display text-2xl font-bold text-accent">Free</p>
                  <p className="text-xs text-white/75 font-light mt-0.5">In-Studio Fitting &amp; Steam</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/rental"
                  className="rounded-full bg-accent px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground shadow-gold hover:bg-gold-light transition-all"
                >
                  Browse Rental Wardrobe
                </Link>
                <Link
                  href="/rental-booking"
                  className="rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm hover:bg-white hover:text-primary transition-all"
                >
                  Book Rental Online
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
                <img
                  src="/assets/p13.jpg"
                  alt="Rental Collection Highlight"
                  className="h-full w-full object-cover aspect-[3/4]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-center">
                  <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
                    Client Favorite
                  </span>
                  <p className="mt-2 font-display text-xl text-white">Royal Scarlet Trail Gown</p>
                  <p className="text-xs text-accent mt-0.5 font-medium">Rent from {inr(2899)} / 3 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Photoshoot Special Collection */}
      <section className="bg-secondary/40 py-24">
        <div className="container-lux">
          <SectionHead
            eyebrow="Special Occasions"
            title="Dressed For Your Perfect Shot"
            subtitle="Outfits designed specifically for photography — dramatic trails, shimmering embroidery, and vivid palettes that capture beautifully on camera."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {photoshootTypes.map((p) => (
              <Link
                key={p.name}
                href={`/shop?category=${encodeURIComponent("Photoshoot Collection")}`}
                className="group relative overflow-hidden rounded-2xl border border-border shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-lift"
              >
                <div className="aspect-[3/4] overflow-hidden bg-blush">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-4 p-4 text-center">
                  <p className="font-display text-xl text-white group-hover:text-accent transition-colors">
                    {p.name}
                  </p>
                  <span className="mt-1 inline-block text-[10px] uppercase tracking-[0.2em] text-accent">
                    View Outfits →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Meet The Founder & Boutique Philosophy */}
      <section className="container-lux py-24">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6 relative">
            <div className="overflow-hidden rounded-3xl border border-border/80 shadow-lift">
              <img
                src={aboutImg}
                alt="Inside the Gadhinglaj Models Club Boutique"
                className="h-full w-full object-cover aspect-[4/3] md:aspect-[16/11]"
              />
            </div>
            {/* Floating Luxury Stamp */}
            <div className="absolute -bottom-6 -right-6 hidden sm:block rounded-2xl border border-border bg-card p-5 shadow-lift max-w-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-primary">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-primary">500+ Clients Styled</p>
                  <p className="text-xs text-muted-foreground font-light">Across Gadhinglaj, Kolhapur &amp; Belgaum</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose/30 bg-blush px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
              The Boutique Story
            </div>

            <h2 className="font-display text-4xl sm:text-5xl text-primary font-normal leading-tight">
              A Personalised Atelier Run With Passion &amp; Elegance.
            </h2>

            <div className="gold-rule" />

            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground font-light">
              Managed personally by <strong className="font-medium text-foreground">{content.owner}</strong>, Gadhinglaj Models Club was born from a vision to make red-carpet couture and timeless ethnic royalty accessible to every woman in south Maharashtra.
            </p>

            <ul className="grid gap-3 sm:grid-cols-2 pt-2">
              {[
                "100% Women-Owned Enterprise",
                "Custom In-Studio Alterations",
                "Pan-Maharashtra Shipping",
                "Flexible 3-Day Rental Windows",
                "Personalised Styling Guidance",
                "Sanitized & Dry-Cleaned Handover",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-xs text-foreground/80 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/about"
                className="rounded-full bg-primary px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-lift hover:opacity-90 transition-all"
              >
                Our Full Journey
              </Link>
              <a
                href={`https://wa.me/919699620950?text=Hi%20Priyanka,%20I%20would%20like%20to%20consult%20with%20you%20for%20my%20event.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary hover:bg-blush transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                Consult Stylist
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Why Choose Us Promise Grid */}
      <section className="border-t border-border/80 bg-secondary/30 py-24">
        <div className="container-lux">
          <SectionHead
            eyebrow="Our Commitment"
            title="The Gadhinglaj Models Club Promise"
            subtitle="Exceptional quality, honest rental policies, and meticulous craftsmanship on every seam."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {whyChooseUs.map((w, idx) => (
              <div
                key={w.title}
                className="animate-fade-up rounded-3xl border border-border/80 bg-card p-7 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 font-display text-xl font-bold text-primary">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-xl font-medium text-primary">{w.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground font-light">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Testimonials Carousel / Grid */}
      <Testimonials />

      {/* 10. Seasonal Offer Banner */}
      <section className="container-lux pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border/80 shadow-lift">
          <img src={offerImg} alt="Special Offer" className="h-[380px] md:h-[460px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-xl px-8 py-12 md:px-16 text-white space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 border border-accent/40 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
                <Tag className="h-3 w-3" />
                Festive &amp; Wedding Privilege
              </span>

              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-tight">
                Up to 30% Off on Selected Atelier Pieces.
              </h2>

              <p className="text-sm text-white/85 font-light leading-relaxed max-w-md">
                Rentals starting from {inr(2299)}. Enjoy complimentary studio alterations and priority fitting dates when booking in advance.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/offers"
                  className="rounded-full bg-accent px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground shadow-gold hover:bg-gold-light transition-all"
                >
                  View Limited Offers
                </Link>
                <Link
                  href="/shop"
                  className="rounded-full border border-white/50 bg-white/10 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-primary transition-all"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

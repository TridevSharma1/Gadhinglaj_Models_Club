"use client";

import Link from "next/link";
import Hero from "@/components/site/Hero";
import CategoryCard from "@/components/site/CategoryCard";
import ProductGrid from "@/components/site/ProductGrid";
import Testimonials from "@/components/site/Testimonials";
import SiteLayout, { SectionHead } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { aboutImg, offerImg, inr, photoshootTypes, whyChooseUs } from "@/data/catalog";

export default function Home() {
  const { products, categories, content } = useStore();
  const featured = products.filter((p) => p.active && p.featured).slice(0, 8);
  const rentals = products.filter((p) => p.active && p.type === "rental").slice(0, 4);

  return (
    <SiteLayout>
      <Hero />

      <section className="container-lux py-20">
        <SectionHead
          eyebrow="Shop by category"
          title="Curated Wardrobes"
          subtitle="From bridal grandeur to everyday elegance — explore collections styled for every celebration."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories
            .filter((c) => c.active)
            .map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="container-lux">
          <SectionHead
            eyebrow="Handpicked for you"
            title="Featured Collection"
            subtitle="Eight signature pieces from our latest atelier edit."
          />
          <div className="mt-12">
            <ProductGrid products={featured} />
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/shop"
              className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lift"
            >
              View Full Collection
            </Link>
          </div>
        </div>
      </section>

      <section className="container-lux py-20">
        <SectionHead
          eyebrow="Rental collection"
          title="Luxury Looks Without the Luxury Price"
          subtitle="Rent premium designer outfits for pre-wedding shoots, post-wedding celebrations, maternity photoshoots, engagements and parties."
        />
        <div className="mt-12">
          <ProductGrid products={rentals} />
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/rental"
            className="rounded-full border border-primary px-8 py-3 text-sm font-medium text-primary transition-colors hover:bg-blush"
          >
            Explore Rentals
          </Link>
        </div>
      </section>

      <section className="bg-blush/60 py-20">
        <div className="container-lux grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-border shadow-lift">
            <img src={aboutImg} alt="Inside the boutique" className="h-full w-full object-cover" />
          </div>
          <div>
            <SectionHead
              center={false}
              eyebrow="About the boutique"
              title={content.businessName}
              subtitle={content.aboutText}
            />
            <p className="mt-6 text-sm text-muted-foreground">Managed by {content.owner}</p>
            <Link
              href="/about"
              className="mt-8 inline-block rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="container-lux py-20">
        <SectionHead eyebrow="Why choose us" title="The Gadhinglaj Models Club Promise" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {whyChooseUs.map((w, i) => (
            <div
              key={w.title}
              className="animate-fade-up rounded-3xl border border-border bg-card p-6 text-center shadow-soft"
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent/20 font-display text-lg text-primary">
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-lg text-primary">{w.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="container-lux">
          <SectionHead
            eyebrow="Photoshoot special"
            title="Dress for Your Perfect Shot"
            subtitle="Outfits styled specially for the camera — trails, textures and colours that photograph beautifully."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {photoshootTypes.map((p) => (
              <div
                key={p.name}
                className="group relative overflow-hidden rounded-3xl border border-border shadow-soft"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <p className="absolute inset-x-0 bottom-4 text-center font-display text-lg text-white">
                  {p.name}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/shop?category=Photoshoot%20Collection"
              className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground"
            >
              Explore Photoshoot Collection
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="container-lux pb-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-lift">
          <img src={offerImg} alt="Special offer" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-lg px-8 py-12 md:px-14">
              <p className="eyebrow text-accent">Special offer</p>
              <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
                Look Extraordinary. Spend Smart.
              </h2>
              <p className="mt-4 text-sm text-white/85">
                Up to 30% OFF on selected designer collections. Rentals starting at just{" "}
                {inr(2299)}.
              </p>
              <Link
                href="/offers"
                className="mt-7 inline-block rounded-full bg-accent px-7 py-3 text-sm font-medium text-accent-foreground"
              >
                View Offers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

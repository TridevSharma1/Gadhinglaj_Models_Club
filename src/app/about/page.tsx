"use client";

import Link from "next/link";
import SiteLayout, { PageHero, SectionHead } from "@/components/site/SiteLayout";
import { aboutImg, whyChooseUs } from "@/data/catalog";
import { useStore } from "@/lib/store";

export default function AboutPage() {
  const { content } = useStore();
  return (
    <SiteLayout>
      <PageHero eyebrow="Our story" title="About Us" subtitle={content.tagline} />

      <section className="container-lux grid items-center gap-12 py-16 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl shadow-lift">
          <img src={aboutImg} alt="Inside the Gadhinglaj Models Club boutique" className="h-full w-full object-cover" />
        </div>
        <div>
          <SectionHead
            center={false}
            eyebrow="Managed by"
            title={content.owner}
            subtitle={content.aboutText}
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Women-owned business",
              "Premium fashion",
              "Designer collections",
              "High-quality fabrics",
              "Rental fashion",
              "Personalized experience",
              "Photoshoot-specialised outfits",
              "Trusted local boutique",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t}
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-lift"
          >
            Visit the boutique
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40 py-16">
        <div className="container-lux">
          <SectionHead eyebrow="Why choose us" title="A boutique experience, end to end" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {whyChooseUs.map((w, i) => (
              <div key={w.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="font-display text-3xl text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-xl text-primary">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

"use client";

import Link from "next/link";
import SiteLayout, { PageHero, SectionHead } from "@/components/site/SiteLayout";
import { aboutImg, whyChooseUs } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { CheckCircle2, Heart, Sparkles, MapPin, Phone, MessageCircle } from "lucide-react";

export default function AboutPage() {
  const { content } = useStore();

  return (
    <SiteLayout>
      <PageHero
        eyebrow="The Atelier Story"
        title="About Gadhinglaj Models Club"
        subtitle={content.tagline}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Our Story" }]}
      />

      {/* Founder Spotlight */}
      <section className="container-lux py-16 md:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6 relative">
            <div className="overflow-hidden rounded-3xl border border-border/80 shadow-lift">
              <img
                src={aboutImg}
                alt="Inside Gadhinglaj Models Club"
                className="h-full w-full object-cover aspect-[4/3] md:aspect-[16/11]"
              />
            </div>

            {/* Quote badge */}
            <div className="mt-4 rounded-2xl border border-border/80 bg-secondary/50 p-6 text-center">
              <p className="font-display text-lg italic text-primary">
                &ldquo;Every woman deserves to feel royal on her most memorable day.&rdquo;
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                — {content.owner}, Founder &amp; Fashion Director
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose/30 bg-blush px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
              Our Vision &amp; Craft
            </div>

            <h2 className="font-display text-4xl sm:text-5xl text-primary font-normal leading-tight">
              Redefining Couture &amp; Dress Rental in South Maharashtra.
            </h2>

            <div className="gold-rule" />

            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground font-light">
              {content.aboutText}
            </p>

            <p className="text-sm leading-relaxed text-muted-foreground font-light">
              Whether you are preparing for a once-in-a-lifetime pre-wedding photoshoot, a fairy-tale reception, or a maternity milestone, our studio gives you access to a curated designer wardrobe with personalized draping and custom alterations.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 pt-2">
              {[
                "100% Women-Owned Enterprise",
                "Pan-Maharashtra Express Dispatch",
                "Complimentary Studio Alterations",
                "Sustainable Luxury Rental Model",
                "Steam-Pressed & Sanitized Outfits",
                "Personalised Drape Consultations",
              ].map((p) => (
                <div key={p} className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/contact"
                className="rounded-full bg-primary px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift hover:opacity-90 transition-opacity"
              >
                Visit Our Studio
              </Link>
              <Link
                href="/rental"
                className="rounded-full border border-border px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-primary hover:bg-blush transition-colors"
              >
                Browse Rentals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Pillars Grid */}
      <section className="border-y border-border/80 bg-secondary/30 py-24">
        <div className="container-lux">
          <SectionHead
            eyebrow="Our Standard"
            title="A Meticulous Boutique Experience"
            subtitle="Every outfit in our studio is treated as a masterpiece — inspected, tailored, and styled with utmost care."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {whyChooseUs.map((w, idx) => (
              <div
                key={w.title}
                className="rounded-3xl border border-border/80 bg-card p-7 text-center shadow-soft"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 font-display text-xl font-bold text-primary">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-xl font-medium text-primary">{w.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground font-light">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Boutique Visit Card */}
      <section className="container-lux py-24">
        <div className="rounded-[2.5rem] border border-border/80 bg-gradient-to-br from-primary via-wine-deep to-stone-950 p-8 md:p-14 text-white shadow-lift">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <span className="eyebrow text-accent">Walk In Anytime</span>
              <h3 className="font-display text-3xl sm:text-4xl text-white font-normal">
                Visit Our Boutique in Gadhinglaj
              </h3>
              <p className="text-sm text-white/85 font-light leading-relaxed">
                Experience the fabrics, try on sample sizes, and discuss alteration deadlines with Priyanka. Open all 7 days of the week.
              </p>
              <p className="text-xs text-accent font-semibold uppercase tracking-wider">
                {content.address} · Near Shivaji Bank
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
              <a
                href={`tel:${content.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-accent-foreground shadow-gold hover:bg-gold-light transition-all"
              >
                <Phone className="h-4 w-4" />
                <span>Call {content.phone}</span>
              </a>

              <a
                href={`https://wa.me/919699620950?text=Hi%20Gadhinglaj%20Models%20Club,%20I%20would%20like%20to%20plan%20a%20visit%20to%20your%20boutique.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm hover:bg-white hover:text-primary transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Appointment</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

"use client";

import Link from "next/link";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { ShieldCheckIcon, WhatsAppIcon, ClockIcon } from "@/components/site/Icons";

const sections = [
  {
    id: "general-terms",
    title: "1. Atelier General Terms & Conditions",
    summary:
      "Guidelines regarding catalog representation, prices, and website demonstration scope.",
    items: [
      "Prices, rental rates, seasonal offers, and catalog availability are subject to change without prior notice.",
      "Garment hues, zardozi embroidery tones, and fabric textures may exhibit slight variations from screen photographs due to professional photoshoot lighting and digital display profiles.",
      "This web platform serves as the official digital showcase and booking atelier for Gadhinglaj Models Club. While ordering and booking flows are simulated in this browser session, customer requests connect directly to our boutique desk via WhatsApp and phone.",
    ],
  },
  {
    id: "rental-policy",
    title: "2. Haute Couture Rental Studio Agreement",
    summary:
      "Complete terms governing standard 3-day rentals, extensions, and garment condition.",
    items: [
      "Standard rental tenure is 3 calendar days: Day 1 (Pickup/Delivery & Fitting Verification), Day 2 (Event / Photoshoot Day), Day 3 (Return & Inspection).",
      "Rental extensions must be requested at least 24 hours prior to the scheduled return date and are granted subject to calendar availability at pro-rated daily rates.",
      "A 100% refundable security deposit (customarily double the base rental amount) is collected before garment dispatch or boutique handover.",
      "Cancellations initiated more than 72 hours before the rental booking commencement date receive a complete 100% refund of any advance reservation fee.",
      "Normal cosmetic powder marks, floor swish, and minor creases are covered under our complimentary couture dry cleaning. Severe stains, burns, tears, or structural fabric damage will be deducted from the security deposit at actual repair or replacement value.",
    ],
  },
  {
    id: "alterations",
    title: "3. Fitting & Alteration Privileges",
    summary:
      "Master tailoring guidelines for ready-made and rented garments.",
    items: [
      "Every ready-made purchase and booked rental includes complimentary basic fitting alterations (bust, waist, and length adjustment) at our Gadhinglaj boutique.",
      "Alterations are executed by skilled tailors under the guidance of boutique founder Priyanka Desai.",
      "Once an outfit has been custom-altered to personalized client dimensions, returns for cash refunds are not accepted, though size re-adjustments are honored gladly.",
    ],
  },
  {
    id: "shipping-dispatch",
    title: "4. Maharashtra Shipping & Boutique Pickup",
    summary:
      "Dispatch schedules, delivery timelines, and transit care.",
    items: [
      "Ready-to-wear orders are steam-pressed, carefully packaged in garment vaults, and dispatched within 48 business hours of order confirmation.",
      "Transit delivery across Maharashtra (Kolhapur, Belagavi, Pune, Mumbai, Sangli, and surrounding regions) typically spans 4–6 working days.",
      "Rental garments are primarily intended for in-person boutique collection to verify fit. Outstation rental courier arrangements must be pre-approved with our atelier concierge.",
    ],
  },
  {
    id: "returns-exchanges",
    title: "5. Exchange & Credit Policy",
    summary:
      "Clear conditions for exchanges and boutique credits.",
    items: [
      "Unworn ready-made garments with intact designer security tags and original receipt may be exchanged within 7 days of delivery for any alternate outfit or boutique credit voucher.",
      "Sale merchandise, custom-tailored gowns, and pre-used rentals are non-exchangeable.",
      "Approved refunds, when applicable, are remitted via original payment method or issued as store privileges within 5–7 business days.",
    ],
  },
];

export default function TermsPage() {
  const { content } = useStore();

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Boutique Governance"
        title="Terms & Atelier Policies"
        subtitle="Transparent agreements regarding designer gown rentals, security deposits, complimentary alterations, and client privileges."
      />

      <div className="container-lux max-w-5xl py-14">
        {/* Key Highlights Ribbon */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gold-300/40 bg-card p-5 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush text-primary">
              <ClockIcon className="h-5 w-5 text-gold-400" />
            </div>
            <h3 className="mt-3 font-display text-base text-primary">3-Day Rental Tenure</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Pickup on Day 1, shine on Day 2, return on Day 3 with flexible extensions.
            </p>
          </div>

          <div className="rounded-2xl border border-gold-300/40 bg-card p-5 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush text-primary">
              <ShieldCheckIcon className="h-5 w-5 text-gold-400" />
            </div>
            <h3 className="mt-3 font-display text-base text-primary">100% Refundable Deposit</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Security deposits returned promptly upon safe inspection of the outfit.
            </p>
          </div>

          <div className="rounded-2xl border border-gold-300/40 bg-card p-5 shadow-soft">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush text-primary">
              <span className="font-serif text-lg font-bold text-primary">7d</span>
            </div>
            <h3 className="mt-3 font-display text-base text-primary">7-Day Tagged Exchange</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Ready-made items with intact tags can be exchanged for style or size.
            </p>
          </div>
        </div>

        {/* Quick Anchor Navigation */}
        <div className="mt-10 flex flex-wrap gap-2 rounded-2xl border border-border/80 bg-muted/30 p-4">
          <span className="self-center px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Jump to:
          </span>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-gold-300 hover:text-primary"
            >
              {s.title.split(". ")[1]}
            </a>
          ))}
        </div>

        {/* Policy Sections */}
        <div className="mt-12 space-y-12">
          {sections.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              className="scroll-mt-24 rounded-3xl border border-border/80 bg-card p-7 shadow-soft md:p-9"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                <h2 className="font-display text-2xl text-primary">{sec.title}</h2>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Effective August 2026
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground italic">{sec.summary}</p>
              <div className="gold-rule mt-4" />

              <ul className="mt-6 space-y-3.5">
                {sec.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Support & Concierge Note */}
        <div className="mt-12 rounded-2xl border border-border/80 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          <p>
            Have a specific concern regarding an upcoming wedding reservation or bespoke measurement?
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wider">
            <a
              href={`tel:${content.phone}`}
              className="text-primary hover:text-primary/80 hover:underline"
            >
              Direct Studio Desk: {content.phone}
            </a>
            <span className="text-border">·</span>
            <a
              href={`https://wa.me/91${content.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-700 hover:underline"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              WhatsApp Helpdesk
            </a>
            <span className="text-border">·</span>
            <Link href="/contact" className="text-primary hover:underline">
              Boutique Location
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

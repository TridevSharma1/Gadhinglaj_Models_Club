"use client";

import { useState } from "react";
import Link from "next/link";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { WhatsAppIcon, SparkleIcon, PhoneIcon } from "@/components/site/Icons";

interface FaqItem {
  q: string;
  a: string;
  category: "Rentals & Security" | "Alterations & Fit" | "Orders & Delivery" | "Photoshoots & Visits";
}

const faqs: FaqItem[] = [
  {
    category: "Rentals & Security",
    q: "How long is a standard outfit rental period?",
    a: "Standard rentals run for 3 calendar days (Day 1: Pickup & final fitting, Day 2: Event or photoshoot, Day 3: Boutique return). Need more time for an outstation shoot or destination wedding? Extensions are easily accommodated upon advance request with nominal pro-rated daily rates.",
  },
  {
    category: "Rentals & Security",
    q: "Is a security deposit mandatory for rental outfits?",
    a: "Yes. A 100% refundable security deposit (typically 2× the rental charge) is collected when you take custody of the garment. Once returned in undamaged condition, the full deposit is immediately refunded via UPI or cash on the spot.",
  },
  {
    category: "Rentals & Security",
    q: "What if an outfit gets stained during an outdoor or pre-wedding shoot?",
    a: "Normal dust, floor swish, and light cosmetic powder marks are entirely expected and covered by our complimentary professional couture dry-cleaning. Accidental deep tears, heavy fabric damage, or missing ornate embellishments are assessed fairly at actual atelier repair cost.",
  },
  {
    category: "Alterations & Fit",
    q: "Are alteration and fitting adjustments complimentary?",
    a: "Absolutely. Every ready-made designer outfit includes complimentary master tailoring and custom alteration (bust, waist, sleeve, and hem length) done directly at our Gadhinglaj boutique, typically completed within 24 to 48 hours.",
  },
  {
    category: "Alterations & Fit",
    q: "Can I try outfits in person before finalizing a rental booking?",
    a: "Yes, we encourage boutique visits! You can visit our studio on Station Road, Gadhinglaj, where Priyanka Desai personally assists with try-ons, draping, and styling advice. Walk-ins are welcome, or you can reserve a dedicated slot via WhatsApp.",
  },
  {
    category: "Orders & Delivery",
    q: "Do you deliver ready-made outfits across Maharashtra?",
    a: "Yes. Ready-made orders are carefully steam-pressed, packed in protective garment vaults, and dispatched across Maharashtra within 48 hours. Delivery takes approximately 4–6 working days with full tracking.",
  },
  {
    category: "Orders & Delivery",
    q: "Can rental outfits be delivered via courier?",
    a: "Rental outfits are primarily designed for boutique pickup so our master tailor can confirm exact fitting on you before your big day. However, for established clients in Kolhapur, Belagavi, and nearby towns, insured direct courier pickup can be arranged on special request.",
  },
  {
    category: "Orders & Delivery",
    q: "What is your exchange and return policy?",
    a: "Unworn ready-made garments with security tags intact can be exchanged within 7 days of delivery for another size or style. Custom-tailored pieces and completed rental bookings are non-returnable once dispatched.",
  },
  {
    category: "Photoshoots & Visits",
    q: "Do you provide styling assistance for pre-wedding & maternity shoots?",
    a: "Yes, this is our signature specialty. Priyanka Desai Gilbile personally consults on color palette coordination, venue-friendly fabrics (e.g. lightweight flowy satin for breezy hills, heavy zardozi for palace settings), matching dupattas, and bridal jewelry complements.",
  },
  {
    category: "Photoshoots & Visits",
    q: "How far in advance should I reserve bridal and photoshoot outfits?",
    a: "For peak Maharashtrian wedding and festive seasons (October through March), we strongly advise reserving your preferred designer gown or lehenga 3 to 4 weeks in advance to ensure calendar exclusivity.",
  },
];

const categories = [
  "All Questions",
  "Rentals & Security",
  "Alterations & Fit",
  "Orders & Delivery",
  "Photoshoots & Visits",
] as const;

export default function FaqPage() {
  const { content } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>("All Questions");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter(
    (item) => activeCategory === "All Questions" || item.category === activeCategory,
  );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Client Concierge"
        title="Frequently Asked Questions"
        subtitle="Transparent guidance on rentals, refundable security deposits, complimentary alterations, and studio visits."
      />

      <div className="container-lux max-w-4xl py-14">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`rounded-full px-5 py-2.5 text-xs uppercase tracking-widest transition-all ${
                activeCategory === cat
                  ? "bg-primary font-semibold text-primary-foreground shadow-lift"
                  : "border border-border/80 bg-card text-muted-foreground hover:border-gold-300 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-gold-300/60 bg-card shadow-soft"
                    : "border-border/70 bg-card/60 hover:border-border hover:bg-card"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="inline-block rounded-full bg-blush px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                      {faq.category}
                    </span>
                    <h3 className="font-display text-lg text-primary md:text-xl">{faq.q}</h3>
                  </div>
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ${
                      isOpen
                        ? "rotate-180 border-gold-300 bg-primary text-gold-300"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="animate-fade-up border-t border-border/60 bg-muted/20 px-6 py-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Concierge Help Box */}
        <div className="mt-14 overflow-hidden rounded-3xl border border-gold-300/40 bg-gradient-to-br from-card via-blush/40 to-card p-8 text-center shadow-soft md:p-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <SparkleIcon className="h-6 w-6 text-gold-400" />
          </div>
          <p className="eyebrow mt-4">Still Have A Question?</p>
          <h2 className="mt-2 font-display text-2xl text-primary md:text-3xl">
            Talk Directly With Priyanka Desai
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Our atelier concierge is available on WhatsApp or telephone to assist with custom
            measurements, rental availability dates, and photoshoot styling packages.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`https://wa.me/91${content.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Hello Priyanka ji, I have an inquiry about outfit rental and alterations at Gadhinglaj Models Club.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-emerald-700"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp Concierge
            </a>
            <a
              href={`tel:${content.phone}`}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-muted"
            >
              <PhoneIcon className="h-4 w-4" />
              Call {content.phone}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Visit Boutique
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

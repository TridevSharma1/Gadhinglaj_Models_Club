"use client";

import { useState } from "react";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";

const faqs = [
  {
    q: "Do you offer alterations?",
    a: "Yes. Basic fitting alterations on ready-made outfits are complimentary and usually completed within 48 hours at the boutique.",
  },
  {
    q: "How long is a rental period?",
    a: "Standard rentals run for 3 days and can be extended on request, subject to availability. Extension charges are pro-rated per day.",
  },
  {
    q: "Is a security deposit required for rentals?",
    a: "Yes. A refundable security deposit, typically twice the rental price, is collected at pickup and returned once the outfit is returned undamaged.",
  },
  {
    q: "What if the outfit gets stained during a shoot?",
    a: "Normal wear and light makeup marks are expected and covered by us. Heavy damage or tears are deducted from the deposit at actual repair cost.",
  },
  {
    q: "Do you deliver outside Gadhinglaj?",
    a: "Ready-made orders ship across Maharashtra in 4–6 working days. Rental outfits are pickup-only from the boutique so we can fit them for you.",
  },
  {
    q: "Can I return a ready-made outfit?",
    a: "Unworn ready-made pieces with tags intact can be exchanged within 7 days. Rental bookings and custom fittings are non-returnable.",
  },
  {
    q: "Do you help with photoshoot styling?",
    a: "Absolutely. Priyanka personally styles pre-wedding, post-wedding and maternity shoots, including accessory and drape suggestions.",
  },
  {
    q: "How do I book an outfit in advance?",
    a: "Use the Rental Booking page or call us. We recommend booking 2–3 weeks ahead for wedding season dates.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Good to know"
        title="Frequently Asked Questions"
        subtitle="Everything about sizing, rentals, deposits, delivery and returns."
      />
      <div className="container-lux max-w-3xl py-14">
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={open === i}
              >
                <span className="font-display text-lg text-primary">{f.q}</span>
                <span className={`text-accent transition-transform ${open === i ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              {open === i && (
                <p className="animate-fade-up border-t border-border px-6 py-5 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}

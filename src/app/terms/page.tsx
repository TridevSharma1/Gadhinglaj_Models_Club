"use client";

import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";

const sections = [
  {
    t: "Terms & Conditions",
    items: [
      "Prices, availability and offers are subject to change without prior notice.",
      "Product colours may vary slightly from photographs due to screen and lighting differences.",
      "This website is a frontend demonstration; no live payment is processed and all data stays in your browser.",
    ],
  },
  {
    t: "Shipping Policy",
    items: [
      "Ready-made orders are dispatched within 2 working days of confirmation.",
      "Delivery across Maharashtra typically takes 4–6 working days.",
      "A flat delivery charge applies per order and is shown at checkout.",
    ],
  },
  {
    t: "Return Policy",
    items: [
      "Unworn ready-made outfits with original tags can be exchanged within 7 days of delivery.",
      "Altered, customised or sale items are not eligible for return.",
      "Refunds, where applicable, are issued as store credit within 7 working days.",
    ],
  },
  {
    t: "Rental Policy",
    items: [
      "Standard rental duration is 3 days, extendable subject to availability.",
      "A refundable security deposit is collected at pickup and returned after inspection.",
      "Outfits must be returned in original condition; heavy damage or loss is charged at repair or replacement cost.",
      "Cancellations made more than 72 hours before the rental start date are fully refundable.",
    ],
  },
];

export default function TermsPage() {
  const { content } = useStore();
  return (
    <SiteLayout>
      <PageHero eyebrow="Legal" title="Terms & Policies" subtitle="Last updated 1 August 2026." />
      <div className="container-lux max-w-3xl space-y-10 py-14">
        {sections.map((s) => (
          <section key={s.t}>
            <h2 className="font-display text-2xl text-primary">{s.t}</h2>
            <div className="gold-rule mt-3" />
            <ul className="mt-4 space-y-3">
              {s.items.map((i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {i}
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p className="text-sm text-muted-foreground">
          For clarification contact {content.businessName} at {content.phone}.
        </p>
      </div>
    </SiteLayout>
  );
}

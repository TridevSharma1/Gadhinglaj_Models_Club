"use client";

import Link from "next/link";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { ShieldCheckIcon, PhoneIcon } from "@/components/site/Icons";

const privacyPillars = [
  {
    title: "100% Client Discretion",
    desc: "Your personal contact numbers and fitting records are strictly held within our private boutique ledger. We never share, trade, or monetize your information.",
  },
  {
    title: "On-Device Data Storage",
    desc: "Your shopping bag, saved wishlists, and demo order histories are safely stored exclusively in your own browser's local sandbox, giving you complete sovereign control.",
  },
  {
    title: "Consensual Photography",
    desc: "Boutique fitting photographs or client shoot pictures are only ever shared on our social gallery with explicit verbal or written permission from you.",
  },
];

const policySections = [
  {
    title: "Information Entrusted to Us",
    content:
      "When you place a ready-to-wear order, request an outfit alteration, or reserve a 3-day rental gown, we collect fundamental service details: your full name, WhatsApp telephone number, email address, physical delivery destination, and bespoke measurement dimensions.",
  },
  {
    title: "Purpose of Information Processing",
    content:
      "Your details are strictly utilized to coordinate master tailoring fittings, confirm garment availability dates, prepare dispatch parcels across Maharashtra, handle security deposit reimbursements, and notify you regarding order dispatches. We do not engage in automated cold marketing.",
  },
  {
    title: "Third-Party Logistics & Courier Partners",
    content:
      "For outstation ready-to-wear deliveries, only your essential shipping address and telephone number are shared with trusted courier partners (such as Delhivery, DTDC, or Speed Post) solely for seamless transit and doorstep handover.",
  },
  {
    title: "Browser Storage & Session Privacy",
    content:
      "This modern Next.js atelier platform employs client-side LocalStorage for seamless browsing without mandatory forced sign-ups. You can wipe your browsing history, bag items, and saved addresses at any time simply by clearing your browser cache.",
  },
  {
    title: "Customer Rights & Data Erasure",
    content:
      "You hold full rights to inspect, rectify, or request complete removal of your customer record from our boutique register. Reach out to Priyanka Desai directly to have your details erased without complication.",
  },
];

export default function PrivacyPage() {
  const { content } = useStore();

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Trust & Security"
        title="Privacy & Discretion Commitment"
        subtitle="How Gadhinglaj Models Club honors client confidentiality, personal fittings, and photography consent."
      />

      <div className="container-lux max-w-4xl py-14">
        {/* Privacy Pillars Grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {privacyPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-gold-300/40 bg-card p-6 shadow-soft transition-transform hover:-translate-y-1"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush text-primary">
                <ShieldCheckIcon className="h-5 w-5 text-gold-400" />
              </div>
              <h3 className="mt-4 font-display text-lg text-primary">{pillar.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Policy Cards */}
        <div className="mt-12 space-y-8">
          {policySections.map((sec, idx) => (
            <div
              key={sec.title}
              className="rounded-3xl border border-border/80 bg-card p-7 shadow-soft md:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blush text-xs font-semibold text-primary">
                  {idx + 1}
                </span>
                <h2 className="font-display text-xl text-primary md:text-2xl">{sec.title}</h2>
              </div>
              <div className="gold-rule mt-3" />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Atelier Privacy Officer */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-card via-blush/30 to-card p-8 text-center shadow-soft">
          <h3 className="font-display text-2xl text-primary">Have a Privacy Inquiry?</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Our atelier manager personally addresses all inquiries regarding client discretion,
            fitting records, and image permissions.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wider">
            <a
              href={`mailto:${content.email}`}
              className="rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
            >
              Email {content.email}
            </a>
            <a
              href={`tel:${content.phone}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-primary transition-colors hover:bg-muted"
            >
              <PhoneIcon className="h-4 w-4" />
              Call {content.phone}
            </a>
            <Link
              href="/"
              className="rounded-full border border-border px-6 py-3 text-muted-foreground transition-colors hover:text-primary"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

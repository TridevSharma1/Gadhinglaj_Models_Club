"use client";

import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";

const sections = [
  {
    t: "Information we collect",
    p: "We collect only what is needed to serve you: your name, phone number, email address and delivery address when you place an order or submit a rental request.",
  },
  {
    t: "How we use it",
    p: "Your details are used to confirm orders, arrange fittings, schedule rental pickups and returns, and share occasional offers if you have asked us to.",
  },
  {
    t: "Demonstration website",
    p: "This website is a frontend demonstration. Cart, wishlist, order and booking data are stored only in your own browser's local storage and are never transmitted to a server or database.",
  },
  {
    t: "Sharing",
    p: "We do not sell or rent customer information. Details are shared only with delivery partners where a shipment is required.",
  },
  {
    t: "Photographs",
    p: "Photographs of customers are published on our social channels only with explicit permission.",
  },
  {
    t: "Your choices",
    p: "You may ask us to correct or delete your details at any time by calling or emailing the boutique. Clearing your browser storage removes all demo data instantly.",
  },
];

export default function PrivacyPage() {
  const { content } = useStore();
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Last updated 1 August 2026."
      />
      <div className="container-lux max-w-3xl space-y-8 py-14">
        {sections.map((s) => (
          <section key={s.t}>
            <h2 className="font-display text-2xl text-primary">{s.t}</h2>
            <div className="gold-rule mt-3" />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
          </section>
        ))}
        <p className="text-sm text-muted-foreground">
          Questions? Write to{" "}
          <a href={`mailto:${content.email}`} className="text-primary hover:underline">
            {content.email}
          </a>{" "}
          or call {content.phone}.
        </p>
      </div>
    </SiteLayout>
  );
}

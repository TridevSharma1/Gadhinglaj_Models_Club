"use client";

import { useState } from "react";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";

const field =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-rose";

export default function ContactPage() {
  const { content } = useStore();
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Say hello"
        title="Contact Us"
        subtitle="Walk in for a styling session or reach out for rental availability."
      />
      <div className="container-lux grid gap-10 py-16 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-2xl text-primary">{content.businessName}</h2>
            <div className="gold-rule my-4" />
            <address className="space-y-3 text-sm not-italic leading-relaxed text-muted-foreground">
              <p>{content.address}</p>
              <p>
                <a href={`tel:${content.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                  {content.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${content.email}`} className="break-all hover:text-primary">
                  {content.email}
                </a>
              </p>
            </address>
            <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
              Open daily · 10:00 AM – 9:00 PM
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-secondary/50 p-8 text-center shadow-soft">
            <p className="eyebrow">Find us</p>
            <h3 className="mt-3 font-display text-2xl text-primary">Main Road, Tilak Path</h3>
            <div className="gold-rule mx-auto mt-4" />
            <div className="mt-6 grid h-44 place-items-center rounded-xl border border-dashed border-rose/50 bg-background">
              <div className="text-center">
                <span className="mx-auto block h-3 w-3 rounded-full bg-primary" />
                <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
                  Near Shivaji Bank, Gadhinglaj 416502
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          <h2 className="font-display text-2xl text-primary">Send an enquiry</h2>
          <div className="gold-rule my-4" />
          {sent ? (
            <div className="animate-fade-up rounded-xl bg-blush px-5 py-8 text-center">
              <p className="font-display text-xl text-primary">Thank you!</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Your message has been noted. We will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-5 rounded-full border border-border px-5 py-2 text-xs uppercase tracking-widest text-primary"
              >
                Send another
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input required placeholder="Your name" className={field} />
              <input required type="tel" placeholder="Phone number" className={field} />
              <input required type="email" placeholder="Email address" className={field} />
              <textarea required rows={5} placeholder="How can we help?" className={field} />
              <button
                type="submit"
                className="w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground shadow-lift"
              >
                Submit
              </button>
            </div>
          )}
        </form>
      </div>
    </SiteLayout>
  );
}

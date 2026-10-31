"use client";

import { useStore } from "@/lib/store";
import { Stars } from "./Icons";
import { SectionHead } from "./SiteLayout";
import { Quote, CheckCircle2 } from "lucide-react";

export default function Testimonials() {
  const { reviews } = useStore();
  const list = reviews.filter((r) => r.approved);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 via-background to-secondary/30 py-24">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="container-lux relative z-10">
        <SectionHead
          eyebrow="Client Testimonials"
          title="Stories from Our Atelier"
          subtitle="Real moments of glamour, confidence and celebration styled by Priyanka Desai and the GMC team."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <figure
              key={r.id}
              className="animate-fade-up relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Stars rating={r.rating} />
                  <Quote className="h-6 w-6 text-accent/40" />
                </div>

                <blockquote className="mt-5 text-sm leading-relaxed text-foreground/85 font-light italic">
                  &ldquo;{r.text}&rdquo;
                </blockquote>
              </div>

              <figcaption className="mt-8 flex items-center justify-between border-t border-border/60 pt-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-wine-deep font-display text-base font-semibold text-accent shadow-soft">
                    {r.initials}
                  </span>
                  <div>
                    <span className="block text-sm font-semibold text-foreground">{r.name}</span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-light">
                      <CheckCircle2 className="h-3 w-3 text-accent" />
                      Verified Client
                    </span>
                  </div>
                </div>

                <span className="rounded-full bg-secondary/80 px-2.5 py-1 text-[10px] font-medium text-primary">
                  {r.date}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Stars } from "./Icons";
import { SectionHead } from "./SiteLayout";
import { Quote, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, ExternalLink } from "lucide-react";

export default function Testimonials() {
  const { reviews, products } = useStore();
  // Only show approved reviews on the public site
  const list = reviews.filter((r) => r.approved);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Automatically advance every 4.5 seconds showing 3 feedbacks at a time
  useEffect(() => {
    if (list.length <= 3 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % list.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [list.length, isPaused]);

  // Determine the 3 feedback items to show
  const visibleItems =
    list.length <= 3
      ? list
      : [
          list[currentIndex % list.length],
          list[(currentIndex + 1) % list.length],
          list[(currentIndex + 2) % list.length],
        ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % list.length);
  };

  if (!list.length) return null;

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-secondary/50 via-background to-secondary/30 py-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="container-lux relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHead
            eyebrow="Client Testimonials"
            title="Stories from Our Atelier"
            subtitle="Real moments of glamour, confidence and celebration styled with our signature silhouettes."
          />

          {/* Carousel Navigation Buttons */}
          {list.length > 3 && (
            <div className="flex items-center gap-2 self-start md:self-end pb-2">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonials"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs hover:border-gold-400 hover:bg-gold-50/50 hover:text-primary transition-all active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next testimonials"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-xs hover:border-gold-400 hover:bg-gold-50/50 hover:text-primary transition-all active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* 3 Feedback at a time Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((r, idx) => {
            if (!r) return null;
            // Match product if available
            const matchedProduct = r.productId
              ? products.find((p) => p.id === r.productId)
              : null;
            const prodName = r.productName || matchedProduct?.name;
            const prodImage =
              r.productImage ||
              matchedProduct?.image ||
              (matchedProduct?.images && matchedProduct.images[0]);
            const prodId = r.productId || matchedProduct?.id;

            return (
              <figure
                key={`${r.id}-${idx}-${currentIndex}`}
                className="animate-fade-in relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div>
                  {/* Top: Star rating & Quote icon */}
                  <div className="flex items-center justify-between">
                    <Stars rating={r.rating} />
                    <Quote className="h-6 w-6 text-accent/40" />
                  </div>

                  {/* The Feedback Commentary */}
                  <blockquote className="mt-4 text-sm leading-relaxed text-foreground/85 font-light italic min-h-[4rem]">
                    &ldquo;{r.text}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-6 space-y-4">
                  {/* The Product Association (Shows the Feedback with the Product!) */}
                  {prodName && prodId ? (
                    <Link
                      href={`/product/${prodId}`}
                      className="group/prod flex items-center gap-3 rounded-2xl border border-border/80 bg-secondary/40 p-2.5 transition-all hover:border-primary/40 hover:bg-white shadow-2xs"
                    >
                      {prodImage ? (
                        <img
                          src={prodImage}
                          alt={prodName}
                          className="h-12 w-12 rounded-xl object-cover border border-border/60 group-hover/prod:scale-105 transition-transform shrink-0"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary text-xs font-bold shrink-0">
                          GMC
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-accent">
                          Worn &amp; Reviewed
                        </span>
                        <span className="block truncate text-xs font-semibold text-foreground group-hover/prod:text-primary transition-colors">
                          {prodName}
                        </span>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover/prod:text-primary transition-colors shrink-0 mr-1" />
                    </Link>
                  ) : null}

                  {/* Client Info footer */}
                  <figcaption className="flex items-center justify-between border-t border-border/60 pt-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-wine-deep font-display text-sm font-semibold text-accent shadow-soft">
                        {r.initials || "CL"}
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
                </div>
              </figure>
            );
          })}
        </div>

        {/* Carousel Pagination Dots & Status */}
        {list.length > 3 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 pt-6">
            <div className="flex items-center gap-1.5">
              {list.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Jump to review ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex % list.length
                      ? "w-8 bg-primary"
                      : "w-2 bg-border hover:bg-primary/40"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Auto-rotating 3 feedbacks ({currentIndex + 1} of {list.length})
              </span>
              <Link
                href="/reviews"
                className="font-semibold text-primary hover:underline hover:text-accent transition-colors"
              >
                View All Experiences →
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

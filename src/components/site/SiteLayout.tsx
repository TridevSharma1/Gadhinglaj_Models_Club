"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { useStore } from "@/lib/store";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-rose/20 selection:text-primary">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  badge,
  breadcrumbs,
  bgImage,
  pageKey,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs?: { label: string; href?: string }[];
  bgImage?: string;
  pageKey?: string;
}) {
  const pathname = usePathname();
  const { getPageHeader } = useStore();

  // Resolve background image from prop, pageKey, or current pathname
  const headerBg = bgImage || getPageHeader(pageKey || pathname || "default");

  return (
    <section className="relative overflow-hidden border-b border-border/80 bg-stone-950 text-white py-16 md:py-24 min-h-[320px] flex items-center justify-center">
      {/* Background Header Banner Image with High Visibility & Subtle Legibility Vignette */}
      {headerBg && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={headerBg}
            alt={`${title} banner`}
            className="h-full w-full object-cover object-center brightness-90 contrast-105 transition-transform duration-1000 scale-102"
          />
          {/* Balanced Subtle Vignette for High Image Visibility & Clear Text Legibility */}
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>
      )}

      {/* Subtle luxury watermark / ambient glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl z-1" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-rose/20 blur-3xl z-1" />

      <div className="container-lux relative z-10 text-center animate-fade-up max-w-4xl mx-auto">
        {breadcrumbs && (
          <nav className="mb-5 flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-widest text-stone-300 font-light">
            {breadcrumbs.map((b, i) => (
              <span key={b.label} className="flex items-center gap-2">
                {b.href ? (
                  <a href={b.href} className="transition-colors hover:text-gold-300 text-stone-300">
                    {b.label}
                  </a>
                ) : (
                  <span className="text-white font-medium">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <span className="text-stone-500">/</span>}
              </span>
            ))}
          </nav>
        )}

        <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-black/60 backdrop-blur-md px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-300 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
          {eyebrow}
        </div>

        <h1 className="mt-4 font-display text-4xl text-white md:text-5xl lg:text-6xl tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
          {title}
        </h1>

        <div className="gold-rule mx-auto mt-6" />

        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-stone-200 md:text-base font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {subtitle}
          </p>
        )}

        {badge && (
          <div className="mt-6">
            <span className="inline-block rounded-full bg-gold-400/20 border border-gold-300/40 px-4 py-1.5 text-xs font-medium text-gold-300 backdrop-blur-md">
              {badge}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  subtitle,
  center = true,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  action?: ReactNode;
}) {
  return (
    <div className={`animate-fade-up ${center ? "text-center" : "text-left"}`}>
      <div className={`flex flex-col ${center ? "items-center" : "items-start"}`}>
        <p className="eyebrow inline-flex items-center gap-2">
          <span className="h-1 w-3 rounded-full bg-accent" />
          {eyebrow}
          <span className="h-1 w-3 rounded-full bg-accent" />
        </p>
        <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-primary md:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 max-w-xl text-sm text-muted-foreground font-light leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center shadow-soft">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        ✦
      </div>
      <h3 className="mt-4 font-display text-2xl text-primary font-normal">{title}</h3>
      {text && (
        <p className="mt-2 max-w-md text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
          {text}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

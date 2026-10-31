import type { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-rose/20 selection:text-primary">
      <Navbar />
      <main className="flex-1">{children}</main>
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
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-secondary/60 via-background to-background py-16 md:py-22">
      {/* Subtle luxury watermark / ambient glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-rose/10 blur-3xl" />

      <div className="container-lux relative z-10 text-center animate-fade-up">
        {breadcrumbs && (
          <nav className="mb-5 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            {breadcrumbs.map((b, i) => (
              <span key={b.label} className="flex items-center gap-2">
                {b.href ? (
                  <a href={b.href} className="transition-colors hover:text-primary">
                    {b.label}
                  </a>
                ) : (
                  <span className="text-foreground/90 font-medium">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <span className="text-border">/</span>}
              </span>
            ))}
          </nav>
        )}

        <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          {eyebrow}
        </div>

        <h1 className="mt-4 font-display text-4xl text-primary md:text-5xl lg:text-6xl tracking-tight leading-tight">
          {title}
        </h1>

        <div className="gold-rule mx-auto mt-6" />

        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base font-light">
            {subtitle}
          </p>
        )}

        {badge && (
          <div className="mt-6">
            <span className="inline-block rounded-full bg-blush px-4 py-1.5 text-xs font-medium text-primary">
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
        <h2 className="mt-3 font-display text-3xl text-primary md:text-4xl lg:text-5xl font-normal tracking-tight">
          {title}
        </h2>
        <div className={`gold-rule mt-4 ${center ? "mx-auto" : ""}`} />
        {subtitle && (
          <p
            className={`mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base font-light ${
              center ? "mx-auto" : ""
            }`}
          >
            {subtitle}
          </p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="animate-fade-up mx-auto max-w-md rounded-3xl border border-border bg-card p-12 text-center shadow-soft">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blush text-primary">
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          <path d="M9 10h.01M15 10h.01M9.5 15.5a4 4 0 0 0 5 0" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="mt-6 font-display text-2xl text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-light">{text}</p>
      {action && <div className="mt-8 flex justify-center">{action}</div>}
    </div>
  );
}

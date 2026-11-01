"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { WhatsAppIcon } from "@/components/site/Icons";
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Scissors,
  RotateCcw,
  Clock,
  ArrowRight,
  Crown,
  Heart,
  CheckCircle2,
  ExternalLink,
  Instagram,
  Facebook,
  Youtube,
  Lock,
  Compass,
  Check,
} from "lucide-react";

const collections = [
  { href: "/shop", label: "Shop All Outfits" },
  { href: "/rental", label: "Luxury Rental Studio" },
  { href: "/readymade", label: "Ready-to-Wear Couture" },
  { href: "/categories", label: "Curated Collections" },
  { href: "/rental-booking", label: "Custom Rental Reservation" },
  { href: "/wishlist", label: "Personal Wishlist Vault" },
] as const;

const services = [
  { href: "/account", label: "My Account & Orders" },
  { href: "/rental-booking", label: "Book Studio Fitting Trial" },
  { href: "/reviews", label: "Client Testimonials & Stories" },
  { href: "/faq", label: "Boutique FAQs & Sizing Guide" },
  { href: "/terms", label: "Rental Terms & Security Deposit" },
  { href: "/privacy", label: "Privacy & Data Protection" },
] as const;

export default function Footer() {
  const { content } = useStore();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const whatsappInquiry = encodeURIComponent(
    `Hello Priyanka ji, I would like to schedule a personal bridal styling consultation at ${content.businessName}.`
  );

  return (
    <footer className="relative mt-32 border-t border-gold-300/30 bg-gradient-to-b from-[#0f0406] via-stone-950 to-stone-950 text-stone-300 font-sans overflow-hidden">
      {/* -------------------------------------------------------------
          1. VIP NEWSLETTER & PRIVATE SALON BANNER (Top Tier)
          ------------------------------------------------------------- */}
      <div className="relative border-b border-white/10 bg-gradient-to-r from-stone-950 via-[#18070b] to-stone-950 py-14">
        {/* Subtle Ambient Backlight Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/3 h-72 w-96 -translate-y-1/2 rounded-full bg-gold-400/5 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 h-72 w-96 -translate-y-1/2 rounded-full bg-rose-600/5 blur-3xl" />
        </div>

        <div className="container-lux relative flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl text-center lg:text-left space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-400/15 via-gold-300/10 to-transparent border border-gold-400/30 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-gold-300 shadow-2xs">
              <Sparkles className="h-3 w-3 text-gold-400 animate-pulse" />
              <span>The Atelier Private Circle</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-normal tracking-tight">
              Step Into the Realm of Handcrafted Elegance
            </h3>

            <p className="text-xs sm:text-sm text-stone-300/90 font-light leading-relaxed max-w-xl">
              Receive private editorial previews of upcoming bridal collections, priority photoshoot rental reservations, and bespoke styling advice curated personally by <strong className="font-medium text-gold-200">Priyanka Desai</strong>.
            </p>
          </div>

          <div className="w-full lg:w-auto shrink-0 max-w-md space-y-3">
            {subscribed ? (
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 p-4 text-emerald-300 text-xs font-semibold shadow-lift animate-fade-up">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <div>
                  <p className="font-bold">Welcome to the Private Circle</p>
                  <p className="text-[11px] font-normal opacity-90">You are now on our confidential bridal salon list.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center shadow-lift">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address…"
                  className="w-full rounded-full border border-gold-400/30 bg-stone-900/90 pl-5 pr-36 py-3.5 text-xs text-white placeholder:text-stone-500 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 hover:opacity-95 transition-all shadow-gold"
                >
                  Join Circle
                </button>
              </form>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-400">
              <span className="flex items-center gap-1.5 font-light">
                <Lock className="h-3 w-3 text-gold-400" />
                Strictly confidential · No spam
              </span>
              <a
                href={`https://wa.me/919699620950?text=${whatsappInquiry}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Stylist WhatsApp Online →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. LUXURY ATELIER PILLARS (Haute Couture Virtues)
          ------------------------------------------------------------- */}
      <div className="border-b border-white/10 bg-black/40 py-10 backdrop-blur-xs">
        <div className="container-lux grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group flex items-start gap-4 p-4.5 rounded-2xl bg-stone-900/40 border border-white/5 hover:border-gold-400/40 transition-all hover:-translate-y-0.5 duration-300">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400/20 via-gold-400/10 to-transparent border border-gold-400/30 text-gold-400 shadow-xs group-hover:scale-105 transition-transform">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-base font-semibold text-white tracking-wide">Haute Couture Quality</p>
              <p className="text-xs text-stone-400 font-light mt-1 leading-relaxed">
                Authentic pure Banarasi silks, organza &amp; artisan hand-done zardozi work.
              </p>
            </div>
          </div>

          <div className="group flex items-start gap-4 p-4.5 rounded-2xl bg-stone-900/40 border border-white/5 hover:border-gold-400/40 transition-all hover:-translate-y-0.5 duration-300">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400/20 via-gold-400/10 to-transparent border border-gold-400/30 text-gold-400 shadow-xs group-hover:scale-105 transition-transform">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-base font-semibold text-white tracking-wide">3-Day Rental Studio</p>
              <p className="text-xs text-stone-400 font-light mt-1 leading-relaxed">
                Red-carpet bridal, reception &amp; pre-wedding gowns at accessible luxury rates.
              </p>
            </div>
          </div>

          <div className="group flex items-start gap-4 p-4.5 rounded-2xl bg-stone-900/40 border border-white/5 hover:border-gold-400/40 transition-all hover:-translate-y-0.5 duration-300">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400/20 via-gold-400/10 to-transparent border border-gold-400/30 text-gold-400 shadow-xs group-hover:scale-105 transition-transform">
              <Scissors className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-base font-semibold text-white tracking-wide">Free Custom Alterations</p>
              <p className="text-xs text-stone-400 font-light mt-1 leading-relaxed">
                In-house master tailors custom adjust bust, waist &amp; silhouette length for you.
              </p>
            </div>
          </div>

          <div className="group flex items-start gap-4 p-4.5 rounded-2xl bg-stone-900/40 border border-white/5 hover:border-gold-400/40 transition-all hover:-translate-y-0.5 duration-300">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400/20 via-gold-400/10 to-transparent border border-gold-400/30 text-gold-400 shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-base font-semibold text-white tracking-wide">Steam Sanitized</p>
              <p className="text-xs text-stone-400 font-light mt-1 leading-relaxed">
                Professionally dry-cleaned &amp; steam-pressed in satin covers before handover.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          3. MAIN EDITORIAL INFORMATION COLUMNS
          ------------------------------------------------------------- */}
      <div className="container-lux relative z-10 grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        {/* Brand & Maison Heritage Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 via-gold-400 to-amber-600 text-neutral-950 font-serif text-2xl font-bold shadow-gold">
              G
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold tracking-tight text-white">
                {content.businessName}
              </h3>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold-300 font-semibold">
                Haute Couture &amp; Rental Studio
              </p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-gold-400/40 via-gold-300/20 to-transparent" />

          <p className="text-xs sm:text-sm leading-relaxed text-stone-400 font-light max-w-sm">
            {content.footerText ||
              "Gadhinglaj Models Club is Western Maharashtra's premier boutique destination for handcrafted bridal couture, regal reception gowns, and luxury photoshoot rentals."}
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1.5 backdrop-blur-xs">
            <p className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>Directed &amp; Styled by</span>
              <span className="text-gold-300 font-serif">{content.owner}</span>
            </p>
            <p className="text-[11px] text-stone-400 font-light">
              Master Couturier &amp; Boutique Founder · Gadhinglaj, Kolhapur
            </p>
          </div>

          {/* Social Media Channels */}
          <div className="space-y-2">
            <p className="text-[10.5px] uppercase font-bold tracking-[0.2em] text-gold-300/90">
              Connect With The Atelier
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 border border-white/10 text-stone-300 hover:text-white hover:border-gold-400 hover:bg-gold-400/10 transition-all shadow-2xs"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/919699620950?text=${whatsappInquiry}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Concierge"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 border border-white/10 text-emerald-400 hover:text-white hover:border-emerald-400 hover:bg-emerald-600 transition-all shadow-2xs"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 border border-white/10 text-stone-300 hover:text-white hover:border-gold-400 hover:bg-gold-400/10 transition-all shadow-2xs"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 border border-white/10 text-stone-300 hover:text-rose-400 hover:border-rose-400 hover:bg-rose-500/10 transition-all shadow-2xs"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Curated Wardrobes Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300 flex items-center gap-1.5">
            <span>Wardrobe</span>
          </h4>
          <ul className="space-y-3">
            {collections.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-xs text-stone-400 hover:text-gold-300 transition-colors font-light flex items-center gap-1.5 group"
                >
                  <span className="text-stone-600 group-hover:text-gold-400 transition-colors">›</span>
                  <span>{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Patron Care & Atelier Services Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300 flex items-center gap-1.5">
            <span>Patron Care</span>
          </h4>
          <ul className="space-y-3">
            {services.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-xs text-stone-400 hover:text-gold-300 transition-colors font-light flex items-center gap-1.5 group"
                >
                  <span className="text-stone-600 group-hover:text-gold-400 transition-colors">›</span>
                  <span>{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Flagship Atelier & Studio Coordinates Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300 flex items-center gap-2">
              <Compass className="h-3.5 w-3.5 text-gold-400" />
              <span>Flagship Atelier</span>
            </h4>
            
            <ul className="mt-4 space-y-3 text-xs text-stone-400 font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span className="text-stone-300">{content.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-gold-400 shrink-0" />
                <a
                  href={`tel:${content.phone.replace(/\s/g, "")}`}
                  className="hover:text-white transition-colors font-mono font-medium text-stone-200"
                >
                  {content.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-gold-400 shrink-0" />
                <a
                  href={`mailto:${content.email}`}
                  className="break-all hover:text-white transition-colors text-stone-300"
                >
                  {content.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-stone-300">
                <Clock className="h-4 w-4 text-gold-400 shrink-0" />
                <span>Mon – Sun: 10:00 AM – 9:00 PM</span>
              </li>
            </ul>
          </div>

          {/* In-Studio Consultation Card */}
          <div className="rounded-2xl border border-gold-400/25 bg-gradient-to-br from-gold-400/10 via-stone-900/60 to-stone-900/80 p-4.5 space-y-2.5 shadow-soft">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Private Studio Fitting</span>
              <span className="rounded-full bg-gold-400 text-neutral-950 font-bold px-2 py-0.5 text-[9.5px] uppercase tracking-wider">
                Complimentary
              </span>
            </div>
            <p className="text-[11px] text-stone-300 font-light leading-relaxed">
              Experience personalized drape trials and custom bridal sizing at our Tilak Path boutique.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Link
                href="/rental-booking"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-300 hover:text-white transition-colors"
              >
                <span>Book Fitting Session</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              <span className="text-stone-600">·</span>
              <a
                href={`https://wa.me/919699620950?text=${whatsappInquiry}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-400 hover:underline"
              >
                Instant WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          4. ARCHITECTURAL GRAND WATERMARK
          ------------------------------------------------------------- */}
      <div className="pointer-events-none select-none overflow-hidden opacity-[0.035] py-2 text-center">
        <span className="font-serif text-[65px] sm:text-[95px] lg:text-[130px] font-black tracking-[0.25em] text-white whitespace-nowrap block">
          GADHINGLAJ MODELS CLUB
        </span>
      </div>

      {/* -------------------------------------------------------------
          5. PAYMENT TRUST BAR & LEGAL FOOTER
          ------------------------------------------------------------- */}
      <div className="border-t border-white/10 bg-black/60 py-7">
        <div className="container-lux flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-[10.5px] text-stone-400">
            <span className="font-semibold uppercase tracking-wider text-stone-500 mr-1">
              Trusted Checkout:
            </span>
            <span className="rounded-lg border border-white/10 bg-stone-900 px-2.5 py-1 text-stone-300 font-medium">
              Razorpay Secured
            </span>
            <span className="rounded-lg border border-white/10 bg-stone-900 px-2.5 py-1 text-stone-300 font-medium">
              UPI &amp; QR
            </span>
            <span className="rounded-lg border border-white/10 bg-stone-900 px-2.5 py-1 text-stone-300 font-medium">
              Visa / RuPay
            </span>
            <span className="rounded-lg border border-white/10 bg-stone-900 px-2.5 py-1 text-stone-300 font-medium">
              NetBanking
            </span>
          </div>

          {/* Quick Legal Links & Admin Portal */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-light text-stone-400">
            <Link href="/terms" className="hover:text-gold-300 transition-colors">
              Terms of Service
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-gold-300 transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/rental-booking" className="hover:text-gold-300 transition-colors">
              Rental Studio
            </Link>
            <span>·</span>
            <Link
              href="/admin/login"
              className="rounded-full bg-stone-900 border border-white/10 px-3.5 py-1 text-gold-400 hover:text-white hover:border-gold-400 transition-colors text-[11px] font-medium"
            >
              Atelier Staff Portal ↗
            </Link>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="container-lux mt-5 pt-5 border-t border-white/5 text-center text-xs text-stone-400 font-light flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © 2026 {content.businessName}. Founded &amp; Directed by {content.owner}. All Rights Reserved.
          </p>
          <p className="text-[11px] text-stone-400">
            Boutique &amp; Designer Dress Rental Atelier in Gadhinglaj, Maharashtra
          </p>
        </div>
      </div>
    </footer>
  );
}

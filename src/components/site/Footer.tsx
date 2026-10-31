"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
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
} from "lucide-react";

const collections = [
  { href: "/shop", label: "Shop All Outfits" },
  { href: "/rental", label: "Luxury Rental Studio" },
  { href: "/readymade", label: "Ready-to-Wear Couture" },
  { href: "/categories", label: "Curated Collections" },
  { href: "/rental-booking", label: "Custom Rental Reservation" },
  { href: "/offers", label: "Vouchers & Seasonal Offers" },
] as const;

const services = [
  { href: "/faq", label: "Boutique FAQs" },
  { href: "/account", label: "My Account & Orders" },
  { href: "/reviews", label: "Client Testimonials" },
  { href: "/terms", label: "Rental Terms & Deposit Policy" },
  { href: "/terms", label: "Shipping & Maharashtra Delivery" },
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
    "Hello Priyanka Desai, I would like to schedule a personal bridal styling consultation at Gadhinglaj Models Club."
  );

  return (
    <footer className="mt-28 border-t border-gold-300/20 bg-stone-950 text-stone-300 font-sans">
      {/* -------------------------------------------------------------
          1. VIP NEWSLETTER & PRIVATE SALON BANNER
          ------------------------------------------------------------- */}
      <div className="border-b border-stone-800/80 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 py-12">
        <div className="container-lux flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/10 border border-gold-400/30 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-widest text-gold-300">
              <Sparkles className="h-3 w-3 text-gold-400" />
              <span>The Atelier Private Circle</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-white font-normal tracking-tight">
              Receive Private Invitations &amp; Bridal Edits
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
              Join Priyanka Desai&apos;s private patron salon for new bridal launches, priority rental bookings, and bespoke styling previews.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 max-w-md">
            {subscribed ? (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-950/80 border border-emerald-600/50 p-4 text-emerald-300 text-xs font-semibold animate-fade-up">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>You are now part of our private salon list. Welcome!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your personal email address…"
                  className="w-full rounded-full border border-stone-700 bg-stone-900/90 pl-5 pr-32 py-3.5 text-xs text-white placeholder:text-stone-500 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20 shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gold-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-900 hover:bg-gold-300 transition-all shadow-gold"
                >
                  Join Circle
                </button>
              </form>
            )}
            <p className="text-[10px] text-stone-500 font-light mt-2 text-center md:text-left">
              Strictly confidential. No spam, only editorial previews.
            </p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. LUXURY ATELIER PILLARS (RIBBON)
          ------------------------------------------------------------- */}
      <div className="border-b border-stone-800/80 bg-stone-900/40 py-10">
        <div className="container-lux grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/50 border border-stone-800/60 hover:border-gold-400/40 transition-colors">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-400/10 border border-gold-400/30 text-gold-400 shadow-xs">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-base font-medium text-white">Haute Couture Quality</p>
              <p className="text-xs text-stone-400 font-light mt-0.5">Authentic pure silks &amp; artisan zardozi hand embroidery</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/50 border border-stone-800/60 hover:border-gold-400/40 transition-colors">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-400/10 border border-gold-400/30 text-gold-400 shadow-xs">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-base font-medium text-white">3-Day Rental Studio</p>
              <p className="text-xs text-stone-400 font-light mt-0.5">Red-carpet luxury for pre-wedding &amp; wedding vows</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/50 border border-stone-800/60 hover:border-gold-400/40 transition-colors">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-400/10 border border-gold-400/30 text-gold-400 shadow-xs">
              <Scissors className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-base font-medium text-white">Free Alterations</p>
              <p className="text-xs text-stone-400 font-light mt-0.5">In-house master tailors adjust waist, bust, &amp; length</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-900/50 border border-stone-800/60 hover:border-gold-400/40 transition-colors">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-400/10 border border-gold-400/30 text-gold-400 shadow-xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-base font-medium text-white">Steam Sanitized</p>
              <p className="text-xs text-stone-400 font-light mt-0.5">Professionally dry-cleaned before every handover</p>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          3. MAIN EDITORIAL INFORMATION COLUMNS
          ------------------------------------------------------------- */}
      <div className="container-lux grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        {/* Brand & Maison Heritage Column */}
        <div className="lg:col-span-4 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 via-gold-400 to-amber-600 text-neutral-950 font-display text-2xl font-bold shadow-gold">
              G
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                {content.businessName}
              </h3>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold-300 font-semibold">
                Haute Couture &amp; Rental Studio
              </p>
            </div>
          </div>

          <div className="gold-rule my-2" />

          <p className="text-xs sm:text-sm leading-relaxed text-stone-400 font-light max-w-sm">
            {content.footerText ||
              "Gadhinglaj Models Club is Western Maharashtra's premier boutique destination for handcrafted bridal couture, regal reception gowns, and luxury photoshoot rentals."}
          </p>

          <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-3.5 space-y-1">
            <p className="text-xs font-semibold text-white">Directed &amp; Curated by {content.owner}</p>
            <p className="text-[11px] text-stone-400 font-light">
              Master Stylist &amp; Boutique Founder · Gadhinglaj, Kolhapur
            </p>
          </div>

          {/* VIP WhatsApp Concierge CTA */}
          <div className="pt-1">
            <a
              href={`https://wa.me/919699620950?text=${whatsappInquiry}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600/20 border border-emerald-500/40 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-2xs"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              <span>WhatsApp Stylist Concierge</span>
            </a>
          </div>
        </div>

        {/* Curated Wardrobes Column */}
        <div className="lg:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300 flex items-center gap-1.5">
            <span>Wardrobe</span>
          </h4>
          <ul className="mt-5 space-y-3">
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

        {/* Patron Care & Atelier Services Column */}
        <div className="lg:col-span-3">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300 flex items-center gap-1.5">
            <span>Patron Care</span>
          </h4>
          <ul className="mt-5 space-y-3">
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

        {/* Flagship Atelier & Studio Coordinates Column */}
        <div className="lg:col-span-3 space-y-5">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">
              Flagship Studio
            </h4>
            <ul className="mt-5 space-y-3 text-xs text-stone-400 font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{content.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-gold-400 shrink-0" />
                <a
                  href={`tel:${content.phone.replace(/\s/g, "")}`}
                  className="hover:text-white transition-colors font-mono"
                >
                  {content.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-gold-400 shrink-0" />
                <a
                  href={`mailto:${content.email}`}
                  className="break-all hover:text-white transition-colors"
                >
                  {content.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-stone-400">
                <Clock className="h-4 w-4 text-gold-400 shrink-0" />
                <span>Mon – Sun: 10:00 AM – 9:00 PM</span>
              </li>
            </ul>
          </div>

          {/* In-Studio Consultation Card */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">Private Studio Fitting</span>
              <span className="text-[10px] rounded-full bg-gold-400/10 text-gold-300 px-2 py-0.5 font-bold uppercase">
                Free Trial
              </span>
            </div>
            <p className="text-[11px] text-stone-400 font-light leading-relaxed">
              Walk-in or pre-book your wedding lehenga trial at our Gadhinglaj studio.
            </p>
            <Link
              href="/rental-booking"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-300 hover:text-white transition-colors pt-1"
            >
              <span>Schedule Trial Fitting</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          4. BOTTOM LUXURY TICKER & LEGAL ATTRIBUTION
          ------------------------------------------------------------- */}
      <div className="border-t border-stone-800/80 bg-stone-950 py-6">
        <div className="container-lux flex flex-col items-center justify-between gap-4 text-xs text-stone-400 sm:flex-row font-light">
          <p className="text-center sm:text-left">
            © 2026 {content.businessName}. Founded &amp; Directed by {content.owner}. All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <Link href="/terms" className="hover:text-gold-300 transition-colors">
              Terms of Service
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-gold-300 transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/rental-booking" className="hover:text-gold-300 transition-colors">
              Rental Booking
            </Link>
            <span>·</span>
            <Link
              href="/admin/login"
              className="rounded-full bg-stone-900 border border-stone-800 px-3 py-1 text-gold-400 hover:text-white transition-colors font-medium"
            >
              Staff Portal ↗
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

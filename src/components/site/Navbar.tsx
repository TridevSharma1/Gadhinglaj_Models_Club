"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  SparkleIcon,
  WhatsAppIcon,
  PhoneIcon,
} from "./Icons";
import {
  ChevronDown,
  ArrowRight,
  Scissors,
  User,
  Home,
  Sparkles,
  Crown,
  Layers,
  MapPin,
  Phone,
  ChevronRight,
  X,
} from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  badge?: string;
  badgeColor?: string;
  hideOnLg?: boolean;
  submenu?: { label: string; href: string; desc?: string }[];
}

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  {
    href: "/shop",
    label: "Catalog",
    submenu: [
      { label: "All Outfits", href: "/shop", desc: "Browse full ready-to-wear & rental wardrobe" },
      { label: "Ready-Made Boutique", href: "/readymade", desc: "Purchase designer pieces with 48h dispatch" },
      { label: "Dress Rental Studio", href: "/rental", desc: "3-day photoshoot & bridal rental booking" },
    ],
  },
  {
    href: "/rental",
    label: "Rentals",
    badge: "3-Day",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
  },
  { href: "/readymade", label: "Ready-Made" },
  { href: "/categories", label: "Collections" },
  { href: "/about", label: "The Atelier" },
  { href: "/contact", label: "Visit" },
];

const trendingSearches = [
  "Designer Gowns",
  "Pre-Wedding Shoots",
  "Bridal Lehengas",
  "Maternity Satin Gowns",
  "Wine Red",
  "Crop Top Sets",
];

export default function Navbar() {
  const { cart, wishlist, content, currentUser } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const cartCount = cart.reduce((n, c) => n + c.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileCatalogOpen(false);
    setSearchOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    const q = searchQuery.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  const handleTagClick = (tag: string) => {
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(tag)}`);
  };

  const topAdThemeClass = (() => {
    switch (content.topAdTheme) {
      case "noir":
        return "bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-zinc-800";
      case "gold":
        return "bg-gradient-to-r from-[#2A2008] via-[#4A380E] to-[#201806] border-gold-400/30";
      case "emerald":
        return "bg-gradient-to-r from-[#061A12] via-[#0E3524] to-[#04140D] border-emerald-500/30";
      case "ruby":
        return "bg-gradient-to-r from-[#26050B] via-[#4A0A16] to-[#1F0409] border-rose-500/30";
      default:
        return "bg-gradient-to-r from-[#1A080E] via-[#2D0F1A] to-[#14060B] border-gold-400/20";
    }
  })();

  const topAdPhone = content.topAdPhone || content.phone || "+91 96996 20950";
  const topAdPrefix = content.topAdPrefix ?? "Gadhinglaj Models Club";
  const topAdText =
    content.topAdText ??
    "Designer Boutique & Luxury Dress Rental Studio by Priyanka Desai";
  const topAdFeature = content.topAdFeature ?? "Complimentary Fitting";
  const topAdBtnText = content.topAdBtnText ?? "Stylist Concierge";
  const topAdWhatsAppMsg =
    content.topAdWhatsAppMessage ??
    "Hello Priyanka ji, I would like to inquire about outfit rental and trial fitting at Gadhinglaj Models Club.";

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 overflow-x-clip">
      {/* 1. Haute Couture Top Ticker Ribbon / Ad Bar */}
      {content.topAdEnabled !== false && (
        <div className={`relative border-b text-white transition-colors duration-500 ${topAdThemeClass}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-9 items-center justify-between text-[11px] font-medium tracking-wider">
            {/* Ticker message / Ad Headline */}
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="flex h-2 w-2 shrink-0 rounded-full bg-gold-400 shadow-sm animate-pulse" />
              {content.topAdLink ? (
                <Link
                  href={content.topAdLink}
                  className="truncate text-gold-300 font-light hover:text-white transition-colors"
                >
                  {topAdPrefix && (
                    <span className="font-semibold text-white mr-1.5">{topAdPrefix}</span>
                  )}
                  {topAdPrefix && topAdText && <span>· </span>}
                  <span>{topAdText}</span>
                </Link>
              ) : (
                <p className="truncate text-gold-300 font-light">
                  {topAdPrefix && (
                    <span className="font-semibold text-white mr-1.5">{topAdPrefix}</span>
                  )}
                  {topAdPrefix && topAdText && <span>· </span>}
                  <span>{topAdText}</span>
                </p>
              )}
            </div>

            {/* Quick Concierge & Booking Hotline */}
            <div className="hidden md:flex items-center gap-4 text-[10px] uppercase tracking-widest text-zinc-300 shrink-0">
              {content.topAdShowFeature !== false && topAdFeature && (
                <div className="flex items-center gap-1.5 text-gold-300">
                  <Scissors className="h-3 w-3" />
                  <span>{topAdFeature}</span>
                </div>
              )}
              {content.topAdShowFeature !== false && topAdFeature && content.topAdShowPhone !== false && (
                <span className="text-white/20">|</span>
              )}
              {content.topAdShowPhone !== false && (
                <div className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors">
                  <PhoneIcon className="h-3 w-3 text-gold-400" />
                  <a href={`tel:${topAdPhone.replace(/[^0-9]/g, "")}`}>{topAdPhone}</a>
                </div>
              )}
              {topAdBtnText && (
                <>
                  <span className="text-white/20">|</span>
                  <a
                    href={`https://wa.me/91${topAdPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      topAdWhatsAppMsg,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-emerald-300 hover:bg-emerald-500/30 transition-all font-semibold"
                  >
                    <WhatsAppIcon className="h-2.5 w-2.5" />
                    <span>{topAdBtnText}</span>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Luxury Navigation Bar */}
      <div
        className={`w-full border-b transition-all duration-300 ${
          scrolled
            ? "border-border/80 bg-white/95 backdrop-blur-md shadow-soft"
            : "border-border/60 bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex h-16 sm:h-20 items-center justify-between gap-1.5 sm:gap-3 lg:gap-4">
          {/* Brand Logo & Royal Crest */}
          <Link
            href="/"
            className="group flex items-center gap-2 sm:gap-3 shrink min-w-0 focus:outline-none"
          >
            {/* Radiant Gold/Wine Monogram Crest (Clearly visible GMC in gold) */}
            <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3D0A17] via-[#541223] to-[#25050D] font-serif text-xs sm:text-sm font-bold tracking-wider text-[#F3E5AB] shadow-md border border-[#E6C280]/60 ring-1 ring-[#D4AF37]/30 transition-transform duration-300 group-hover:scale-105">
              GMC
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5 items-center justify-center rounded-full bg-gradient-to-r from-gold-300 to-amber-500 text-[7px] sm:text-[8px] font-bold text-zinc-950 shadow-xs">
                ✦
              </span>
            </div>

            {/* Brand Title Lockup (Guaranteed No Awkward Wrapping) */}
            <div className="flex flex-col min-w-0">
              <span className="font-display text-sm xs:text-base sm:text-lg xl:text-xl font-bold tracking-tight text-primary transition-colors group-hover:text-primary/90 leading-tight truncate">
                Gadhinglaj Models Club
              </span>
              <span className="hidden xs:block text-[7.5px] sm:text-[8.5px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-gold-500 leading-tight mt-0.5 truncate">
                Haute Atelier &amp; Dress Rental Studio
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Clean, Balanced & Compact) */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3.5 2xl:gap-5 shrink-0">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              const hasSubmenu = !!link.submenu;

              return (
                <div
                  key={link.label}
                  className={`relative py-2 ${link.hideOnLg ? "hidden xl:block" : "block"}`}
                  onMouseEnter={() => hasSubmenu && setActiveDropdown(link.label)}
                  onMouseLeave={() => hasSubmenu && setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`group inline-flex items-center gap-1 whitespace-nowrap text-[10.5px] xl:text-[11.5px] 2xl:text-xs font-semibold uppercase tracking-[0.08em] xl:tracking-[0.1em] transition-all duration-200 ${
                      isActive ? "text-primary font-bold" : "text-foreground/75 hover:text-primary"
                    }`}
                  >
                    <span>{link.label}</span>

                    {/* Subtle Status Pill */}
                    {link.badge && (
                      <span
                        className={`rounded-full border px-1.5 py-0.5 text-[8.5px] font-bold tracking-normal uppercase leading-none ${
                          link.badgeColor || "bg-blush text-primary border-border"
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}

                    {hasSubmenu && (
                      <ChevronDown
                        className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
                          activeDropdown === link.label ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    )}
                  </Link>

                  {/* Gold active underline indicator */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />

                  {/* High-End Submenu Dropdown */}
                  {hasSubmenu && activeDropdown === link.label && (
                    <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2 z-50 w-64 animate-fade-up">
                      <div className="rounded-2xl border border-gold-300/40 bg-white/95 p-3 shadow-lift backdrop-blur-md">
                        <div className="space-y-1">
                          {link.submenu!.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="group flex flex-col rounded-xl p-2.5 transition-colors hover:bg-blush/60"
                            >
                              <span className="text-xs font-semibold text-primary group-hover:text-primary transition-colors">
                                {sub.label}
                              </span>
                              {sub.desc && (
                                <span className="text-[10px] text-muted-foreground mt-0.5">
                                  {sub.desc}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Icons & Booking CTA (Always fits cleanly without overflow) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search Trigger (Icon-Only to prevent horizontal overflow) */}
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Open Search"
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-border/80 bg-background/80 text-foreground/80 shadow-xs transition-all hover:border-gold-300 hover:text-primary hover:bg-white"
            >
              <SearchIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </button>

            {/* Wishlist Vault Pill */}
            <Link
              href="/wishlist"
              aria-label="Wishlist Vault"
              className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background/80 text-foreground/80 transition-all hover:border-gold-300 hover:bg-blush hover:text-primary"
            >
              <HeartIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground shadow-xs animate-pulse-subtle">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag Pill */}
            <Link
              href="/cart"
              aria-label="Shopping Bag"
              className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background/80 text-foreground/80 transition-all hover:border-gold-300 hover:bg-blush hover:text-primary"
            >
              <BagIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground shadow-xs animate-pulse-subtle">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Profile Pill */}
            <Link
              href={currentUser ? "/account" : "/login"}
              aria-label={currentUser ? "My Account" : "Sign In"}
              title={currentUser ? `Signed in as ${currentUser.email}` : "Sign In / Register"}
              className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background/80 text-foreground/80 transition-all hover:border-gold-300 hover:bg-blush hover:text-primary"
            >
              {currentUser ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-gold-300 font-serif text-[10px] font-bold">
                  {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                </span>
              ) : (
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </Link>

            {/* "Book Trial" CTA Button (Compact and gracefully responsive) */}
            <Link
              href="/rental-booking"
              className="hidden xl:inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-full bg-primary px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground shadow-lift transition-all hover:bg-primary/90 hover:-translate-y-0.5"
            >
              <SparkleIcon className="h-3 w-3 text-gold-300 shrink-0" />
              <span>Book Trial</span>
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle Mobile Drawer"
              className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-border/80 text-primary transition-colors lg:hidden hover:bg-blush"
            >
              {mobileOpen ? <CloseIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" /> : <MenuIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Haute Couture Search Bar Overlay */}
      {searchOpen && (
        <div className="border-b border-gold-300/40 bg-white/95 shadow-lift backdrop-blur-md animate-fade-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search designer gowns, bridal lehengas, maternity drapes, velvet crop tops…"
                className="w-full rounded-2xl border-2 border-gold-300/40 bg-background px-5 py-3 pl-12 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all focus:border-gold-400 focus:ring-2 focus:ring-gold-300/20 shadow-inner"
              />
              <SearchIcon className="absolute left-4 h-5 w-5 text-gold-400" />
              <div className="absolute right-2 flex items-center gap-2">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="rounded-full p-1.5 text-muted-foreground hover:text-primary"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lift hover:bg-primary/90"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Trending Curations Chips */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Trending Curations:
              </span>
              {trendingSearches.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-foreground/80 transition-colors hover:border-gold-300 hover:bg-blush hover:text-primary"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Luxury Off-Canvas Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          {/* Backdrop Blur Overlay */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            aria-hidden="true"
          />

          {/* Slide-In Sheet Panel */}
          <aside className="relative z-50 flex h-full w-[85vw] max-w-sm flex-col bg-white shadow-2xl animate-slide-left overflow-hidden">
            {/* Drawer Top Header with Crest & Close */}
            <div className="flex items-center justify-between border-b border-gold-300/30 px-5 py-4 bg-gradient-to-r from-[#FAF7F2] via-white to-[#FAF7F2]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#3D0A17] via-[#541223] to-[#25050D] font-serif text-xs font-bold text-[#F3E5AB] shadow-sm border border-[#E6C280]/60">
                  GMC
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-primary tracking-tight">
                    {content.businessName}
                  </h3>
                  <p className="text-[9px] uppercase tracking-widest text-gold-600 font-semibold">
                    Haute Couture Atelier
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-muted-foreground hover:text-primary transition-colors shadow-2xs"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Patron Profile / Membership Status Card */}
            <div className="border-b border-border/70 bg-blush/40 px-5 py-3">
              {currentUser ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-serif text-xs font-bold text-gold-300 shrink-0 shadow-xs">
                      {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-primary truncate">
                        {currentUser.name || "Patron Member"}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="text-[11px] font-semibold text-primary hover:text-gold-600 underline underline-offset-2 shrink-0 ml-2"
                  >
                    Account →
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-primary">Couture Membership</p>
                    <p className="text-[10px] text-muted-foreground">Sign in to save wishlist &amp; orders</p>
                  </div>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-xs"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Main Navigation Links */}
              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  const isCatalog = link.label === "Catalog";

                  if (isCatalog) {
                    return (
                      <div key={link.label} className="rounded-2xl border border-border/60 bg-muted/20 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setMobileCatalogOpen((prev) => !prev)}
                          className="flex w-full items-center justify-between px-3.5 py-3 text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors"
                        >
                          <span className="flex items-center gap-2.5">
                            <Sparkles className="h-4 w-4 text-gold-500" />
                            <span>Catalog &amp; Wardrobe</span>
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                              mobileCatalogOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {mobileCatalogOpen && (
                          <div className="space-y-1 border-t border-border/50 bg-white p-2 animate-fade-down">
                            {link.submenu?.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setMobileOpen(false)}
                                className="block rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-blush hover:text-primary transition-colors"
                              >
                                <span className="font-semibold block">{sub.label}</span>
                                {sub.desc && (
                                  <span className="text-[10px] text-muted-foreground font-light block">
                                    {sub.desc}
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-xs font-bold"
                          : "text-foreground/80 hover:bg-muted/40 hover:text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {link.label === "Home" && <Home className="h-4 w-4" />}
                        {link.label === "Rentals" && <Crown className="h-4 w-4 text-amber-500" />}
                        {link.label === "Ready-Made" && <Scissors className="h-4 w-4" />}
                        {link.label === "Collections" && <Layers className="h-4 w-4" />}
                        {link.label === "The Atelier" && <SparkleIcon className="h-4 w-4" />}
                        {link.label === "Visit" && <MapPin className="h-4 w-4" />}
                        <span>{link.label}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {link.badge && (
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${
                              isActive ? "bg-white text-primary border-transparent" : link.badgeColor || "bg-blush text-primary border-border"
                            }`}
                          >
                            {link.badge}
                          </span>
                        )}
                        <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Quick High-Conversion CTAs */}
              <div className="pt-2 space-y-2.5">
                <Link
                  href="/rental-booking"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lift hover:opacity-95 transition-opacity"
                >
                  <SparkleIcon className="h-3.5 w-3.5 text-gold-300" />
                  <span>Book 3-Day Rental Trial</span>
                </Link>

                <a
                  href={`https://wa.me/91${content.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    "Hello Priyanka ji, I would like to consult on outfit styling at Gadhinglaj Models Club.",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-soft hover:bg-emerald-700 transition-colors"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>Direct WhatsApp Concierge</span>
                </a>
              </div>

              {/* Studio Coordinates & Contact Card */}
              <div className="rounded-2xl border border-border/80 bg-muted/30 p-3.5 text-xs space-y-2">
                <div className="flex items-start gap-2 text-muted-foreground font-light">
                  <MapPin className="h-3.5 w-3.5 text-gold-500 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">{content.address}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-2 text-[11px]">
                  <a
                    href={`tel:${content.phone.replace(/[^0-9]/g, "")}`}
                    className="font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3 text-gold-500" />
                    <span>{content.phone}</span>
                  </a>
                  <span className="text-muted-foreground">10 AM – 9 PM</span>
                </div>
              </div>
            </div>

            {/* Drawer Footer (Legal & Staff) */}
            <div className="border-t border-border/70 bg-[#FAF7F2] px-5 py-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="text-primary font-semibold hover:underline"
              >
                Staff Portal ↗
              </Link>
              <span>·</span>
              <Link
                href="/terms"
                onClick={() => setMobileOpen(false)}
                className="hover:underline"
              >
                Rental Policies
              </Link>
              <span>·</span>
              <Link
                href="/privacy"
                onClick={() => setMobileOpen(false)}
                className="hover:underline"
              >
                Privacy
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* 5. Luxury Mobile App Bottom Navigation Dock */}
      <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden border-t border-gold-300/30 bg-white/95 backdrop-blur-md shadow-[0_-4px_25px_rgba(0,0,0,0.07)] px-2 py-1.5 flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            pathname === "/" ? "text-primary font-bold scale-105" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="h-4.5 w-4.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </Link>

        <Link
          href="/shop"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            pathname.startsWith("/shop") ? "text-primary font-bold scale-105" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="h-4.5 w-4.5" />
          <span className="text-[10px] tracking-tight">Catalog</span>
        </Link>

        <Link
          href="/rental"
          className={`relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            pathname.startsWith("/rental") ? "text-primary font-bold scale-105" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="absolute -top-1 right-1 rounded-full bg-primary text-gold-300 text-[7.5px] font-bold px-1 py-0.2 shadow-2xs">
            3-Day
          </span>
          <Crown className="h-4.5 w-4.5" />
          <span className="text-[10px] tracking-tight">Rentals</span>
        </Link>

        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            pathname === "/wishlist" ? "text-primary font-bold scale-105" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <HeartIcon className="h-4.5 w-4.5" />
          {wishlist.length > 0 && (
            <span className="absolute -top-0.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[9px] font-bold text-white shadow-xs">
              {wishlist.length}
            </span>
          )}
          <span className="text-[10px] tracking-tight">Wishlist</span>
        </Link>

        <Link
          href="/cart"
          className={`relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            pathname === "/cart" ? "text-primary font-bold scale-105" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BagIcon className="h-4.5 w-4.5" />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground shadow-xs">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] tracking-tight">Bag</span>
        </Link>
      </nav>
    </header>
  );
}

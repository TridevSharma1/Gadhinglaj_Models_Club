"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import {
  Sparkles,
  Calendar,
  Scissors,
  Truck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const fallbackBanners = [
  {
    id: 1,
    title: "Wear the Moment. Own the Look.",
    subtitle: "Premium designer outfits for your most memorable celebrations & wedding vows.",
    cta: "Explore Collection",
    link: "/shop",
    image: "/assets/hero1.jpg",
    active: true,
  },
  {
    id: 2,
    title: "Luxury Looks, Made to Impress",
    subtitle: "Discover handcrafted ethnic couture, zardozi lehengas, and regal bridal drapes.",
    cta: "Shop Ready-Made",
    link: "/readymade",
    image: "/assets/hero2.jpg",
    active: true,
  },
  {
    id: 3,
    title: "Your Perfect Photoshoot Look Awaits",
    subtitle: "Premium rental outfits for pre-wedding, post-wedding, and maternity photography.",
    cta: "Explore Rental Studio",
    link: "/rental",
    image: "/assets/hero3.jpg",
    active: true,
  },
];

export default function Hero() {
  const { banners } = useStore();

  // Active banners or fallback to default slides if empty
  const activeSlides = useMemo(() => {
    const act = banners.filter((b) => b.active);
    return act.length > 0 ? act : fallbackBanners;
  }, [banners]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide rotation every 6 seconds, paused when hovering
  useEffect(() => {
    if (activeSlides.length < 2 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused]);

  const current = activeSlides[currentIdx % activeSlides.length] || activeSlides[0];

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative h-[84vh] min-h-[640px] sm:min-h-[580px] max-h-[820px] w-full overflow-hidden bg-stone-950 select-none"
    >
      {/* Background Slides with Cinematic Cross-Fade */}
      {activeSlides.map((b, idx) => {
        const isCurrent = idx === currentIdx % activeSlides.length;
        return (
          <div
            key={b.id || idx}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              isCurrent ? "opacity-100 scale-100 z-0" : "opacity-0 scale-105 pointer-events-none z-0"
            }`}
          >
            <img
              src={b.image || fallbackBanners[idx % fallbackBanners.length].image}
              alt={b.title}
              className="h-full w-full object-cover object-center"
            />
            {/* Cinematic Luxury Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />
          </div>
        );
      })}

      {/* Hero Content Overlay */}
      <div className="container-lux relative z-10 flex h-full flex-col justify-center pb-28 sm:pb-24 pt-6 sm:pt-10">
        <div key={currentIdx} className="animate-fade-up max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-black/50 px-3.5 py-1 sm:px-4 sm:py-1.5 backdrop-blur-md shadow-xs">
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold-400" />
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-gold-300">
              Priyanka Desai Atelier · 2026
            </span>
          </div>

          <h1 className="mt-4 sm:mt-5 font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-white font-normal tracking-tight">
            {current.title}
          </h1>

          <p className="mt-3.5 sm:mt-5 max-w-lg text-xs leading-relaxed text-white/85 sm:text-base md:text-lg font-light">
            {current.subtitle}
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link
              href={current.link || "/shop"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-6 sm:px-8 py-3.5 text-xs font-bold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-neutral-900 shadow-gold transition-all duration-300 hover:scale-105 hover:bg-gold-300"
            >
              <span>{current.cta || "Explore Collection"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/rental"
              className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/10 px-6 sm:px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-primary hover:border-white text-center"
            >
              Explore Dress Rentals
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Navigation Chevrons */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 hover:bg-black/70 hover:scale-110 transition-all shadow-lg"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 hover:bg-black/70 hover:scale-110 transition-all shadow-lg"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </>
      )}

      {/* Interactive Slide Progress Indicators */}
      <div className="absolute bottom-16 right-8 z-20 hidden items-center gap-2 sm:flex">
        {activeSlides.map((b, idx) => (
          <button
            key={b.id || idx}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setCurrentIdx(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === currentIdx % activeSlides.length
                ? "w-10 bg-gold-400 shadow-xs"
                : "w-3 bg-white/40 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Bottom Luxury Value Ticker Bar */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/15 bg-black/60 backdrop-blur-md">
        <div className="container-lux py-3.5">
          <div className="grid grid-cols-2 gap-4 text-white/90 md:grid-cols-4">
            <div className="flex items-center gap-2.5 text-xs font-light">
              <Calendar className="h-4 w-4 text-gold-400 shrink-0" />
              <span>3-Day Flexible Rentals</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-light">
              <Sparkles className="h-4 w-4 text-gold-400 shrink-0" />
              <span>100% Designer Outfits</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-light">
              <Scissors className="h-4 w-4 text-gold-400 shrink-0" />
              <span>Free Studio Alterations</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-light">
              <Truck className="h-4 w-4 text-gold-400 shrink-0" />
              <span>Pan-Maharashtra Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

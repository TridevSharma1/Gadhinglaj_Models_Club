"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useMemo, useEffect } from "react";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { inr, type Booking, type Product } from "@/data/catalog";
import { useStore } from "@/lib/store";
import {
  Calendar,
  ShieldCheck,
  Scissors,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageCircle,
  Phone,
  Printer,
  ArrowRight,
  Crown,
  Palette,
  Ruler,
  AlertCircle,
  Check,
  Sparkle,
} from "lucide-react";

const field =
  "w-full rounded-2xl border border-border/80 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-gold-400 focus:bg-white focus:ring-2 focus:ring-gold-300/20 shadow-2xs";

const occasions = [
  "Pre-Wedding Shoot",
  "Post-Wedding Celebration",
  "Bridal Reception / Sangeet",
  "Engagement & Roka",
  "Maternity Photoshoots",
  "Runway / Fashion Editorial",
  "Cocktail Gala / Birthday",
  "Bespoke Festival Celebration",
];

function RentalBookingContent() {
  const searchParams = useSearchParams();
  const presetProductId = searchParams.get("product");
  const presetColor = searchParams.get("color") || "";
  const presetSize = searchParams.get("size") || "";

  const { products, currentUser, addBooking } = useStore();

  // Strictly active rental outfits only
  const rentalProducts = useMemo(() => {
    return products.filter((p) => p.type === "rental" && p.active);
  }, [products]);

  // Mode: "catalog" (curated studio outfit) or "custom" (custom bespoke design request)
  const [reservationMode, setReservationMode] = useState<"catalog" | "custom">("catalog");

  // Selected Outfit ID
  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    if (presetProductId && rentalProducts.some((p) => String(p.id) === presetProductId)) {
      return presetProductId;
    }
    return rentalProducts[0]?.id ? String(rentalProducts[0].id) : "";
  });

  const selectedOutfit: Product | undefined = useMemo(() => {
    return rentalProducts.find((p) => String(p.id) === selectedProductId) || rentalProducts[0];
  }, [rentalProducts, selectedProductId]);

  // Available colors for the chosen outfit
  const availableColors = useMemo(() => {
    if (!selectedOutfit) return [];
    if (selectedOutfit.colors && selectedOutfit.colors.length > 0) {
      return selectedOutfit.colors.map((c) => c.name);
    }
    return [selectedOutfit.color || "Standard Shade"];
  }, [selectedOutfit]);

  // Available sizes for the chosen outfit
  const availableSizes = useMemo(() => {
    if (!selectedOutfit) return ["Free Size"];
    return selectedOutfit.sizes && selectedOutfit.sizes.length > 0
      ? selectedOutfit.sizes
      : ["Free Size"];
  }, [selectedOutfit]);

  // Default dates: Today + 3 days
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const defaultReturnStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  }, []);

  // Form State
  const [form, setForm] = useState({
    color: presetColor || "",
    size: presetSize || "",
    start: todayStr,
    end: defaultReturnStr,
    name: "",
    phone: "",
    email: "",
    occasion: occasions[0]!,
    notes: "",
    // Custom Bespoke Mode fields
    customOutfitTitle: "",
    bust: "",
    waist: "",
    height: "",
  });

  // Pre-fill user profile if logged in
  useEffect(() => {
    if (currentUser) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || currentUser.name || "",
        email: prev.email || currentUser.email || "",
        phone: prev.phone || currentUser.phone || "",
        size: prev.size || currentUser.preferredSize || "",
      }));
    }
  }, [currentUser]);

  // Sync color & size when outfit changes if not set
  useEffect(() => {
    if (availableColors.length > 0 && !form.color) {
      setForm((f) => ({ ...f, color: presetColor || availableColors[0] || "Standard Shade" }));
    }
    if (availableSizes.length > 0 && !form.size) {
      setForm((f) => ({ ...f, size: presetSize || availableSizes[0] || "Free Size" }));
    }
  }, [availableColors, availableSizes, form.color, form.size, presetColor, presetSize]);

  const [done, setDone] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Date & Duration Calculation
  const days = useMemo(() => {
    if (!form.start || !form.end) return 3;
    const diffTime = new Date(form.end).getTime() - new Date(form.start).getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [form.start, form.end]);

  // Pricing calculation
  const baseRentalFee = useMemo(() => {
    if (reservationMode === "custom") {
      // Bespoke Custom Rental base estimate
      return 3500;
    }
    if (!selectedOutfit) return 2500;
    return selectedOutfit.rentalPrice || Math.round(selectedOutfit.price * 0.35) || 2500;
  }, [reservationMode, selectedOutfit]);

  // Additional day surcharge if > 3 days (₹400/day)
  const extraDays = Math.max(0, days - 3);
  const extraFee = extraDays * 400;
  const totalRentalFee = baseRentalFee + extraFee;

  const deposit = useMemo(() => {
    if (reservationMode === "custom") return 5000;
    if (!selectedOutfit) return 4000;
    return selectedOutfit.deposit || Math.round(baseRentalFee * 1.8) || 4000;
  }, [reservationMode, selectedOutfit, baseRentalFee]);

  const totalHandoverPayable = totalRentalFee + deposit;

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const val = e.target.value;
      setForm((f) => {
        const updated = { ...f, [k]: val };
        // If pickup date changed, auto-adjust return date to start + 3 days if return is before start
        if (k === "start" && val) {
          const s = new Date(val);
          const r = new Date(f.end);
          if (r <= s) {
            const next = new Date(s);
            next.setDate(next.getDate() + 3);
            updated.end = next.toISOString().slice(0, 10);
          }
        }
        return updated;
      });
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      alert("Please provide your Name and Phone number so our tailoring team can reach you.");
      return;
    }

    setIsSubmitting(true);

    const bookingId = `GMC-RNT-${Math.floor(2100 + Math.random() * 7800)}`;
    const outfitDisplayName =
      reservationMode === "custom"
        ? `Custom Bespoke: ${form.customOutfitTitle || "Bespoke Bridal / Photoshoot Silhouette"}`
        : form.color
        ? `${selectedOutfit?.name || "Designer Outfit"} (${form.color})`
        : selectedOutfit?.name || "Designer Outfit";

    const newBooking: Booking = {
      id: bookingId,
      customer: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      outfit: outfitDisplayName,
      size: form.size || "Free Size",
      color: form.color,
      start: form.start || todayStr,
      end: form.end || defaultReturnStr,
      occasion: form.occasion,
      notes: [
        form.notes,
        form.bust ? `Bust: ${form.bust}"` : "",
        form.waist ? `Waist: ${form.waist}"` : "",
        form.height ? `Height: ${form.height}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
      rental: totalRentalFee,
      deposit,
      status: "Pending",
      isCustomDesign: reservationMode === "custom",
      bust: form.bust,
      waist: form.waist,
      height: form.height,
    };

    try {
      await addBooking(newBooking);
      setDone(newBooking);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      alert("Failed to confirm reservation: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappConfirmationMessage = encodeURIComponent(
    `Hello Priyanka Desai, I have reserved a rental outfit with Gadhinglaj Models Club!%0A%0A` +
      `*Reservation Ref:* ${done?.id}%0A` +
      `*Outfit:* ${done?.outfit}%0A` +
      `*Dates:* ${done?.start} to ${done?.end} (${days} days)%0A` +
      `*Occasion:* ${done?.occasion}%0A` +
      `*Fitting Size:* ${done?.size}%0A` +
      `*Name:* ${done?.customer}%0A` +
      `*Contact:* ${done?.phone}%0A` +
      `*Handover Total:* ${inr((done?.rental || 0) + (done?.deposit || 0))}%0A%0A` +
      `Please confirm trial fitting availability at the Gadhinglaj atelier!`
  );

  return (
    <div className="container-lux py-12 sm:py-16">
      {done ? (
        /* =========================================================================
           VIP RENTAL BOOKING PASS & CONFIRMATION DOSSIER
           ========================================================================= */
        <div className="animate-fade-up mx-auto max-w-2xl rounded-3xl border-2 border-gold-300/50 bg-white p-6 sm:p-12 text-center shadow-lift space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-400 text-neutral-900 shadow-gold">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <span className="eyebrow text-gold-600">VIP Rental Reservation Confirmed</span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl text-primary font-normal">
              Booking Ref: {done.id}
            </h2>
            <div className="gold-rule mx-auto mt-3" />
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground font-light max-w-lg mx-auto">
            Your couture rental request for{" "}
            <strong className="text-foreground font-semibold">{done.outfit}</strong> has been
            scheduled for <strong className="text-foreground font-semibold">{done.occasion}</strong>{" "}
            ({done.start} to {done.end}).
          </p>

          {/* Luxury Ticket Breakdown */}
          <div className="rounded-3xl border border-border/80 bg-blush/30 p-6 space-y-3.5 text-left text-xs">
            <div className="flex justify-between items-center text-sm border-b border-border/60 pb-3">
              <span className="text-muted-foreground font-medium">Reserved Outfit</span>
              <span className="font-display font-semibold text-primary">{done.outfit}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                  Patron Name
                </span>
                <span className="font-semibold text-foreground">{done.customer}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                  Contact Mobile
                </span>
                <span className="font-semibold text-foreground">{done.phone}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                  Selected Fit / Size
                </span>
                <span className="font-semibold text-primary">{done.size}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">
                  Rental Window
                </span>
                <span className="font-semibold text-foreground">
                  {done.start} → {done.end} ({days} Days)
                </span>
              </div>
            </div>

            {done.notes && (
              <div className="border-t border-border/50 pt-2 text-[11px] text-muted-foreground">
                <span className="font-semibold text-foreground">Custom Fitting &amp; Styling Notes: </span>
                <span>{done.notes}</span>
              </div>
            )}

            <div className="border-t border-border/60 pt-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-light">Rental Fee ({days} Days)</span>
                <span className="text-foreground font-semibold">{inr(done.rental)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-light">
                  100% Refundable Security Deposit
                </span>
                <span className="text-foreground font-semibold">{inr(done.deposit)}</span>
              </div>

              <div className="flex justify-between items-center text-emerald-800">
                <span className="font-light">Complimentary Alterations &amp; Steam Press</span>
                <span className="font-semibold">Included</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t-2 border-primary/20 pt-3 text-sm">
              <div>
                <span className="font-bold text-foreground uppercase tracking-wider text-xs block">
                  Total Payable at Handover
                </span>
                <span className="text-[10px] text-muted-foreground">
                  (Rental Fee + Refundable Deposit)
                </span>
              </div>
              <span className="font-display text-2xl font-bold text-primary">
                {inr(done.rental + done.deposit)}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/919699620950?text=${whatsappConfirmationMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lift hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Confirm on WhatsApp with Priyanka Desai</span>
            </a>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-blush transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print Rental Pass</span>
            </button>
          </div>

          <div className="pt-3 border-t border-border/80 flex items-center justify-center gap-4 text-xs">
            <button
              onClick={() => {
                setDone(null);
                setForm((f) => ({ ...f, notes: "" }));
              }}
              className="text-primary hover:underline font-semibold"
            >
              ← Make another reservation
            </button>
            <span className="text-border">·</span>
            <Link href="/account" className="text-muted-foreground hover:text-primary">
              View in My Account
            </Link>
          </div>
        </div>
      ) : (
        /* =========================================================================
           RENTAL RESERVATION STUDIO FORM
           ========================================================================= */
        <form onSubmit={submit} className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left: Input Stepper Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* Mode Selector Pill */}
            <div className="rounded-3xl border border-border/80 bg-white p-2 shadow-2xs flex gap-2">
              <button
                type="button"
                onClick={() => setReservationMode("catalog")}
                className={`flex-1 rounded-2xl py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  reservationMode === "catalog"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-primary hover:bg-muted/40"
                }`}
              >
                <Crown className="h-4 w-4" />
                <span>Studio Rental Wardrobe</span>
              </button>

              <button
                type="button"
                onClick={() => setReservationMode("custom")}
                className={`flex-1 rounded-2xl py-3 px-4 text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  reservationMode === "custom"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-primary hover:bg-muted/40"
                }`}
              >
                <Scissors className="h-4 w-4" />
                <span>Bespoke Custom Rental</span>
              </button>
            </div>

            {/* Step 1: Outfit Selection or Bespoke Description */}
            <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
              <div>
                <span className="eyebrow text-gold-600">Step 1</span>
                <h2 className="mt-1 font-display text-2xl text-primary font-medium">
                  {reservationMode === "catalog"
                    ? "Choose Studio Outfit & Shade"
                    : "Describe Your Custom Dream Outfit"}
                </h2>
                <div className="gold-rule mt-2" />
              </div>

              {reservationMode === "catalog" ? (
                <div className="space-y-5">
                  <div>
                    <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Choose Designer Rental Garment
                    </label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => {
                        setSelectedProductId(e.target.value);
                        setForm((f) => ({ ...f, color: "", size: "" }));
                      }}
                      className={field}
                    >
                      {rentalProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {inr(p.rentalPrice || Math.round(p.price * 0.35))} / 3 days
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Visual Selected Outfit Quick Glance */}
                  {selectedOutfit && (
                    <div className="flex items-center gap-4 p-3.5 rounded-2xl border border-gold-300/40 bg-blush/30">
                      <img
                        src={selectedOutfit.image}
                        alt={selectedOutfit.name}
                        className="h-16 w-14 rounded-xl object-cover border border-border shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 block">
                          {selectedOutfit.category}
                        </span>
                        <h4 className="font-display text-base font-semibold text-primary truncate">
                          {selectedOutfit.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          3-Day Rental: <strong className="text-primary font-bold">{inr(baseRentalFee)}</strong> · Deposit: {inr(deposit)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Shade / Colour Picker */}
                    <div>
                      <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Selected Colour / Shade
                      </label>
                      <select value={form.color} onChange={set("color")} className={field}>
                        {availableColors.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Size Picker */}
                    <div>
                      <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Standard Size (Adjustable)
                      </label>
                      <select value={form.size} onChange={set("size")} className={field}>
                        {availableSizes.map((s) => (
                          <option key={s} value={s}>
                            Size {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                /* Bespoke Custom Mode inputs */
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl border border-gold-300/60 bg-gold-50/50 text-xs text-muted-foreground space-y-1">
                    <p className="font-semibold text-primary">Need a unique, tailored look for your special shoot?</p>
                    <p className="leading-relaxed font-light">
                      Priyanka Desai&apos;s master atelier will custom create or tailor a bespoke bridal lehenga, trail gown, or reception outfit available on rental terms.
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Desired Outfit Style / Concept *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.customOutfitTitle}
                      onChange={set("customOutfitTitle")}
                      placeholder="e.g. Royal Maroon Velvet Zardozi Bridal Lehenga, or Pastel Organza Trail Gown"
                      className={field}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Preferred Colour Theme
                      </label>
                      <input
                        type="text"
                        value={form.color}
                        onChange={set("color")}
                        placeholder="e.g. Wine Red, Champagne Gold, Emerald Green"
                        className={field}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Approximate Fit Size
                      </label>
                      <select value={form.size} onChange={set("size")} className={field}>
                        <option value="XS">Size XS (32&quot;)</option>
                        <option value="S">Size S (34&quot;)</option>
                        <option value="M">Size M (36&quot;)</option>
                        <option value="L">Size L (38&quot;)</option>
                        <option value="XL">Size XL (40&quot;)</option>
                        <option value="XXL">Size XXL (42&quot;)</option>
                        <option value="Custom Measurements">Custom Measurements (Provide below)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Event Occasion */}
              <div>
                <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Celebration / Shoot Occasion
                </label>
                <select value={form.occasion} onChange={set("occasion")} className={field}>
                  {occasions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 2: Dates & Patron Details */}
            <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-soft space-y-6">
              <div>
                <span className="eyebrow text-gold-600">Step 2</span>
                <h2 className="mt-1 font-display text-2xl text-primary font-medium">
                  Dates &amp; Fitting Coordinates
                </h2>
                <div className="gold-rule mt-2" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Pickup Date *
                  </label>
                  <input
                    required
                    type="date"
                    min={todayStr}
                    value={form.start}
                    onChange={set("start")}
                    className={field}
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    Pick up in-studio or dispatched 24h prior.
                  </span>
                </div>

                <div>
                  <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Return Date *
                  </label>
                  <input
                    required
                    type="date"
                    min={form.start || todayStr}
                    value={form.end}
                    onChange={set("end")}
                    className={field}
                  />
                  <span className="text-[10px] text-muted-foreground mt-1 block">
                    Duration: {days} Days (3 days standard)
                  </span>
                </div>

                <div>
                  <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Your Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="e.g. Sneha Patil"
                    className={field}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Mobile Phone *
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+91 98765 43210"
                    className={field}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="patron@example.com"
                    className={field}
                  />
                </div>
              </div>

              {/* Custom Tailoring & Fitting Inputs */}
              <div className="pt-2 border-t border-border/80">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5 mb-3">
                  <Scissors className="h-4 w-4 text-gold-500" />
                  <span>Custom Measurements for Complimentary Alterations (Optional):</span>
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                      Bust (in)
                    </label>
                    <input
                      type="text"
                      value={form.bust}
                      onChange={set("bust")}
                      placeholder="e.g. 36"
                      className="w-full rounded-xl border border-border/80 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                      Waist (in)
                    </label>
                    <input
                      type="text"
                      value={form.waist}
                      onChange={set("waist")}
                      placeholder="e.g. 30"
                      className="w-full rounded-xl border border-border/80 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                      Height with Heels
                    </label>
                    <input
                      type="text"
                      value={form.height}
                      onChange={set("height")}
                      placeholder="e.g. 5'6&quot;"
                      className="w-full rounded-xl border border-border/80 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold-400 outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[11px] uppercase font-semibold text-muted-foreground mb-1">
                    Special Tailoring or Drape Preferences
                  </label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Mention custom blouse neckline, can-can volume, padding, or trial date…"
                    className="w-full rounded-2xl border border-border/80 bg-background/50 p-3 text-xs text-foreground focus:border-gold-400 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sticky Summary & Handover Receipt */}
          <div className="lg:col-span-5">
            <aside className="sticky top-24 space-y-6 rounded-3xl border-2 border-gold-300/40 bg-white p-6 sm:p-8 shadow-lift">
              <div>
                <span className="eyebrow text-gold-600">Reservation Receipt</span>
                <h3 className="mt-1 font-display text-2xl text-primary font-medium">Rental Summary</h3>
                <div className="gold-rule mt-2" />
              </div>

              {/* Selected Piece Thumbnail Card */}
              {selectedOutfit && reservationMode === "catalog" ? (
                <div className="flex gap-4 items-center rounded-2xl bg-blush/40 p-4 border border-gold-300/30">
                  <img
                    src={selectedOutfit.image}
                    alt={selectedOutfit.name}
                    className="h-20 w-16 rounded-xl object-cover border border-border shrink-0 shadow-2xs"
                  />
                  <div className="min-w-0">
                    <p className="font-display text-base font-semibold text-primary truncate">
                      {selectedOutfit.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-light">
                      Shade: <strong className="text-foreground">{form.color || selectedOutfit.color}</strong> · Fit: <strong className="text-foreground">{form.size}</strong>
                    </p>
                    <p className="text-xs text-primary font-semibold mt-1">
                      {inr(baseRentalFee)} / 3 days
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gold-50/50 border border-gold-300/40 space-y-1">
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                    <Sparkles className="h-4 w-4 text-gold-500" />
                    <span>Bespoke Design Request</span>
                  </div>
                  <p className="text-xs text-foreground font-medium truncate">
                    {form.customOutfitTitle || "Custom Bridal / Shoot Outfit"}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-light">
                    Theme: {form.color || "Personalized palette"} · Size: {form.size}
                  </p>
                </div>
              )}

              {/* Itemized Calculation */}
              <dl className="space-y-3 text-xs border-t border-border/80 pt-4">
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground font-light">Rental Window</dt>
                  <dd className="font-semibold text-foreground">
                    {days} Days ({form.start} to {form.end})
                  </dd>
                </div>

                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground font-light">Base 3-Day Rental Fee</dt>
                  <dd className="font-semibold text-foreground">{inr(baseRentalFee)}</dd>
                </div>

                {extraDays > 0 && (
                  <div className="flex justify-between items-center text-primary">
                    <dt className="font-light">
                      Extension Fee (+{extraDays} {extraDays === 1 ? "day" : "days"} @ ₹400/day)
                    </dt>
                    <dd className="font-semibold">+{inr(extraFee)}</dd>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground font-light">Refundable Security Deposit</dt>
                  <dd className="font-semibold text-foreground">{inr(deposit)}</dd>
                </div>

                <div className="flex justify-between items-center text-emerald-800">
                  <dt className="font-light">Studio Trial &amp; Steam Sanitization</dt>
                  <dd className="font-semibold">Complimentary</dd>
                </div>

                <div className="flex justify-between items-center border-t-2 border-primary/20 pt-4 text-sm">
                  <dt>
                    <span className="font-bold text-foreground uppercase tracking-wider text-xs block">
                      Total Payable at Handover
                    </span>
                    <span className="text-[10px] text-muted-foreground font-light">
                      (Includes 100% refundable deposit)
                    </span>
                  </dt>
                  <dd className="font-display text-2xl font-bold text-primary">
                    {inr(totalHandoverPayable)}
                  </dd>
                </div>
              </dl>

              {/* Deposit Guarantee */}
              <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4 text-[11px] text-muted-foreground font-light space-y-1">
                <div className="flex items-center gap-1.5 text-primary font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>100% Refundable Security Deposit</span>
                </div>
                <p>
                  Your security deposit ({inr(deposit)}) is returned immediately upon outfit handover at our Gadhinglaj boutique.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-primary py-4 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-lift hover:bg-primary/95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Locking in Reservation…" : "Confirm Rental Reservation"}
              </button>

              <p className="text-center text-[11px] text-muted-foreground font-light">
                Our tailoring director Priyanka Desai will call to confirm your fitting date.
              </p>
            </aside>
          </div>
        </form>
      )}
    </div>
  );
}

export default function RentalBookingPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Dress Rental Studio"
        title="Custom Rental Reservation"
        subtitle="Reserve luxury bridal lehengas, trail gowns, and gala silhouettes for photoshoots & celebrations. Every reservation includes complimentary tailoring adjustments and steam-pressed handover."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Rentals", href: "/rental" },
          { label: "Custom Reservation" },
        ]}
      />
      <Suspense
        fallback={
          <div className="container-lux py-24 text-center text-sm text-muted-foreground">
            Loading booking studio…
          </div>
        }
      >
        <RentalBookingContent />
      </Suspense>
    </SiteLayout>
  );
}

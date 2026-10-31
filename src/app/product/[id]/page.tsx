"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import SiteLayout, { EmptyState, SectionHead } from "@/components/site/SiteLayout";
import ProductGrid from "@/components/site/ProductGrid";
import { Stars, WhatsAppIcon } from "@/components/site/Icons";
import { useStore } from "@/lib/store";
import { inr, type ProductColorVariant } from "@/data/catalog";
import {
  Heart,
  Share2,
  Scissors,
  Truck,
  ShieldCheck,
  RotateCcw,
  MessageCircle,
  Calendar,
  Sparkles,
  ShoppingBag,
  Ruler,
  Check,
  Palette,
  ArrowRight,
  X,
  ChevronRight,
  ZoomIn,
  Eye,
  Crown,
  CheckCircle2,
} from "lucide-react";

const positions = [
  { label: "Front View", class: "object-top" },
  { label: "Bodice Detail", class: "object-center" },
  { label: "Silhouette / Trail", class: "object-bottom" },
];

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { products, addToCart, toggleWishlist, wishlist } = useStore();
  const router = useRouter();

  const product = products.find((p) => p.id === Number(id) && p.active);
  const [view, setView] = useState(0);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [copied, setCopied] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<"in" | "cm">("in");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "rental" | "fitting" | "care">("details");

  // Normalize available colors from product.colors array or fallback
  const availableColors: ProductColorVariant[] = useMemo(() => {
    if (!product) return [];
    if (product.colors && product.colors.length > 0) {
      return product.colors;
    }
    return [
      {
        id: "col-default",
        name: product.color || "Standard Shade",
        stock: product.stock,
        image: product.image,
        hasSizes: (product.sizes?.length ?? 0) > 0,
        sizes: product.sizes || ["Free Size"],
        sizeStocks: (product.sizes || []).map((s) => ({
          size: s,
          stock: Math.max(1, Math.round(product.stock / (product.sizes?.length || 1))),
        })),
      },
    ];
  }, [product]);

  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const activeColor: ProductColorVariant | undefined = availableColors[selectedColorIdx] || availableColors[0];

  // Active display image from selected color variant or fallback to product image
  const displayImage = activeColor?.image || product?.image || "";

  // Available sizes according to the selected color
  const availableSizesForActiveColor = useMemo(() => {
    if (!activeColor) return product?.sizes || ["Free Size"];
    if (activeColor.hasSizes && activeColor.sizes && activeColor.sizes.length > 0) {
      return activeColor.sizes;
    }
    if (activeColor.sizeStocks && activeColor.sizeStocks.length > 0) {
      return activeColor.sizeStocks.map((s) => s.size);
    }
    return product?.sizes && product.sizes.length > 0 ? product.sizes : ["Free Size"];
  }, [activeColor, product?.sizes]);

  const chosen = size && availableSizesForActiveColor.includes(size)
    ? size
    : availableSizesForActiveColor[0] || "M";

  // Check stock for the chosen size within the chosen color
  const chosenSizeStock = useMemo(() => {
    if (!activeColor) return product?.stock ?? 0;
    if (activeColor.sizeStocks && activeColor.sizeStocks.length > 0) {
      const match = activeColor.sizeStocks.find((s) => s.size === chosen);
      return match ? match.stock : activeColor.stock;
    }
    return activeColor.stock;
  }, [activeColor, chosen, product?.stock]);

  if (!product) {
    return (
      <SiteLayout>
        <div className="container-lux py-24">
          <EmptyState
            title="Atelier Piece Not Found"
            text="This piece may have been retired or reserved from the active collection."
            action={
              <Link
                href="/shop"
                className="rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift hover:bg-primary/95 transition-all"
              >
                Return to Shop
              </Link>
            }
          />
        </div>
      </SiteLayout>
    );
  }

  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const wished = wishlist.includes(product.id);
  const related = products
    .filter((p) => p.active && p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${product.name} | Gadhinglaj Models Club`,
            text: `Take a look at this gorgeous ${product.name} from Gadhinglaj Models Club!`,
            url: window.location.href,
          });
          return;
        } catch {
          // fallback to clipboard
        }
      }
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, chosen, qty, activeColor?.name);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Priyanka Desai, I am interested in "${product.name}" in shade "${activeColor?.name || product.color}" (Size: ${chosen}, ${
      product.type === "rental" ? "Rental Studio" : "Purchase"
    }). Could you please share available delivery or fitting slots?`
  );

  return (
    <SiteLayout>
      {/* Toast Notification when added to bag */}
      {addedToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 rounded-2xl bg-neutral-900 text-white px-5 py-3.5 shadow-2xl border border-gold-300/40 animate-fade-down">
          <div className="h-8 w-8 rounded-full bg-gold-400 text-neutral-900 flex items-center justify-center font-bold">
            <Check className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Added to your Shopping Bag</p>
            <p className="text-[11px] text-white/70">
              {product.name} ({activeColor?.name || product.color} · Size {chosen})
            </p>
          </div>
          <Link
            href="/cart"
            className="ml-2 rounded-xl bg-gold-400 px-3 py-1.5 text-[11px] font-bold text-neutral-900 hover:bg-gold-300 transition-colors"
          >
            View Bag
          </Link>
        </div>
      )}

      {/* Main Container */}
      <div className="container-lux py-8 sm:py-12 md:py-16">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 sm:mb-8 flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-light">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-border">/</span>
          <Link href="/categories" className="hover:text-primary transition-colors">
            Collections
          </Link>
          <span className="text-border">/</span>
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-primary transition-colors"
          >
            {product.category}
          </Link>
          {product.subcategory && (
            <>
              <span className="text-border">/</span>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}&subCategory=${encodeURIComponent(product.subcategory)}`}
                className="hover:text-primary transition-colors"
              >
                {product.subcategory}
              </Link>
            </>
          )}
          <span className="text-border">/</span>
          <span className="text-foreground font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Showcase Split Layout */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-start">
          {/* -------------------------------------------------------------
              LEFT COLUMN: High-Fashion Showcase & Gallery
              ------------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-5 lg:sticky lg:top-24">
            {/* Main Stage Image */}
            <div className="group relative overflow-hidden rounded-3xl border border-gold-300/30 bg-blush shadow-lift">
              <img
                src={displayImage}
                alt={`${product.name} - ${activeColor?.name || ""}`}
                className={`aspect-[3/4] w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${positions[view]?.class || "object-top"}`}
              />

              {/* Floating Top Badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/95 backdrop-blur-md px-3.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground shadow-sm">
                  <Crown className="h-3 w-3 text-gold-400" />
                  <span>{product.type === "rental" ? "Rental Studio" : "Ready-Made Atelier"}</span>
                </span>

                {activeColor && (
                  <span className="rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[10.5px] font-bold text-foreground border border-border/80 shadow-xs flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#E5252A] animate-pulse" />
                    <span>Selected Shade: {activeColor.name}</span>
                  </span>
                )}
              </div>

              {/* Floating Action Buttons over image */}
              <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Save to Wishlist"
                  className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md border transition-all duration-300 shadow-md ${
                    wished
                      ? "bg-rose-50 border-rose-300 text-rose-600 scale-105"
                      : "bg-white/90 border-white/40 text-foreground hover:bg-white hover:text-rose-600"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${wished ? "fill-rose-600" : ""}`} />
                </button>

                <button
                  onClick={() => setLightboxOpen(true)}
                  aria-label="Zoom Photo"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-white/40 text-foreground hover:bg-white transition-all shadow-md"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              {/* Bottom Subtle Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 flex items-center justify-between text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[11px] font-light">Priyanka Desai Haute Couture Atelier</span>
                <span className="text-[10px] uppercase tracking-wider text-gold-300">Click to view full-scale</span>
              </div>
            </div>

            {/* View Angle Thumbnail Selectors */}
            <div className="flex gap-3">
              {positions.map((pos, idx) => (
                <button
                  key={pos.label}
                  onClick={() => setView(idx)}
                  className={`group relative flex-1 overflow-hidden rounded-2xl border-2 transition-all p-1 bg-white ${
                    view === idx ? "border-primary ring-2 ring-primary/20 shadow-xs" : "border-border/80 hover:border-gold-400"
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
                    <img
                      src={displayImage}
                      alt={pos.label}
                      className={`h-full w-full object-cover transition-transform group-hover:scale-105 ${pos.class}`}
                    />
                  </div>
                  <span className="mt-1.5 block text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-primary">
                    {pos.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Multi-Colour Preview Gallery Strip if garment has multiple colors */}
            {availableColors.length > 1 && (
              <div className="rounded-3xl border border-gold-300/30 bg-gradient-to-r from-blush/30 to-card p-4 shadow-soft">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5 text-gold-500" />
                    <span>All Available Shades for this Silhouette ({availableColors.length}):</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">Click to inspect</span>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-1.5 pt-0.5">
                  {availableColors.map((c, cIdx) => (
                    <button
                      key={c.id || cIdx}
                      type="button"
                      onClick={() => {
                        setSelectedColorIdx(cIdx);
                        const newSizes = c.sizes && c.sizes.length > 0 ? c.sizes : product.sizes;
                        if (newSizes && newSizes.length > 0 && !newSizes.includes(size)) {
                          setSize(newSizes[0]);
                        }
                      }}
                      className={`flex items-center gap-2.5 rounded-2xl p-2 border transition-all shrink-0 bg-white ${
                        selectedColorIdx === cIdx
                          ? "border-primary ring-2 ring-primary/30 shadow-md scale-102"
                          : "border-border/80 hover:border-gold-300 hover:shadow-xs"
                      }`}
                    >
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className="h-10 w-10 rounded-xl object-cover border border-border shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="text-left pr-2">
                        <span className="block text-xs font-semibold text-foreground">{c.name}</span>
                        <span className="block text-[10px] text-muted-foreground font-medium">
                          {c.stock > 0 ? `${c.stock} in stock` : "Pre-order"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Atelier Trust Badges Bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/70 text-center">
              <div className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-secondary/50 border border-border/50">
                <Scissors className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Custom Alterations</span>
                <span className="text-[10px] text-muted-foreground font-light">Free fitting in Gadhinglaj</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-secondary/50 border border-border/50">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Dry Clean Sanitized</span>
                <span className="text-[10px] text-muted-foreground font-light">Steam pressed handover</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-secondary/50 border border-border/50">
                <Truck className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Maharashtra Dispatch</span>
                <span className="text-[10px] text-muted-foreground font-light">3–5 working days</span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              RIGHT COLUMN: Information, Options, Pricing & Purchase
              ------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header: Category, Subcategory, Stars */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="eyebrow text-gold-600 font-semibold">{product.category}</span>
                  {product.subcategory && (
                    <>
                      <span className="text-border">·</span>
                      <span className="text-xs font-semibold text-primary">{product.subcategory}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Stars rating={product.rating} />
                  <span>
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-primary tracking-tight">
                {product.name}
              </h1>

              {product.barcode && (
                <p className="text-[10px] font-mono text-muted-foreground tracking-wider">
                  DESIGN CODE: #{product.barcode} {product.sku ? `· SKU: ${product.sku}` : ""}
                </p>
              )}
            </div>

            {/* Price Box */}
            <div className="rounded-3xl border border-gold-300/40 bg-gradient-to-br from-white via-card to-blush/30 p-5 shadow-2xs space-y-2">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-display text-3xl sm:text-4xl font-bold text-primary">
                  {inr(product.price)}
                </span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-base text-muted-foreground line-through font-light">
                      {inr(product.mrp)}
                    </span>
                    <span className="rounded-full bg-rose-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
                      {off}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-[11px] text-muted-foreground font-light flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Inclusive of all luxury taxes &amp; complimentary boutique garment cover.</span>
              </p>
            </div>

            {/* Rental Studio Terms Box if rental */}
            {product.type === "rental" && (
              <div className="rounded-3xl border border-accent/40 bg-accent/10 p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest font-bold text-primary flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span>Luxury Rental Studio Terms</span>
                  </span>
                  <span className="rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold text-primary-foreground">
                    {product.rentalDuration || "3-Day Rental"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-2.5 text-xs border-t border-accent/30 pt-3">
                  <span className="text-muted-foreground font-light">Standard Rental Fee</span>
                  <span className="text-right font-display text-lg font-bold text-primary">
                    {inr(product.rentalPrice)}
                  </span>

                  <span className="text-muted-foreground font-light">Refundable Security Deposit</span>
                  <span className="text-right font-semibold text-foreground">
                    {inr(product.deposit || product.rentalPrice * 2)}
                  </span>

                  <span className="text-muted-foreground font-light">Fitting &amp; Trial</span>
                  <span className="text-right text-foreground font-medium">Free walk-in trial included</span>
                </div>

                <p className="text-[11px] text-muted-foreground font-light pt-1 border-t border-accent/20">
                  * Full security deposit is refunded immediately upon undamaged return to Gadhinglaj Models Club.
                </p>
              </div>
            )}

            {/* -------------------------------------------------------------
                COLOUR SELECTION (User Requirement: "While Viewing Product Show Colour So User Can Buy")
                ------------------------------------------------------------- */}
            {availableColors.length > 0 && (
              <div className="rounded-3xl border border-border/80 bg-white p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    <Palette className="h-4 w-4 text-primary" />
                    <span>Choose Shade / Colour</span>
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    Active: <strong className="font-bold underline text-foreground">{activeColor?.name}</strong>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {availableColors.map((c, cIdx) => {
                    const isSelected = selectedColorIdx === cIdx;
                    return (
                      <button
                        key={c.id || cIdx}
                        type="button"
                        onClick={() => {
                          setSelectedColorIdx(cIdx);
                          const newSizes = c.sizes && c.sizes.length > 0 ? c.sizes : product.sizes;
                          if (newSizes && newSizes.length > 0 && !newSizes.includes(size)) {
                            setSize(newSizes[0]);
                          }
                        }}
                        className={`group flex items-center gap-2.5 rounded-2xl border px-3.5 py-2 text-xs font-medium transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-2 ring-primary/40 shadow-xs scale-102"
                            : "border-border/80 bg-white hover:border-gold-400 text-foreground"
                        }`}
                      >
                        {c.image ? (
                          <img
                            src={c.image}
                            alt={c.name}
                            className="h-6 w-6 rounded-full object-cover border border-border shrink-0 shadow-2xs"
                          />
                        ) : (
                          <span className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-serif text-[10px] font-bold text-primary shrink-0">
                            {(c.name || "ST").slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <span className="font-semibold text-foreground">{c.name}</span>
                        {c.stock <= 0 ? (
                          <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.5 rounded-md">Sold Out</span>
                        ) : c.stock <= 2 ? (
                          <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-md">{c.stock} left</span>
                        ) : (
                          <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-md">In Stock</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="rounded-3xl border border-border/80 bg-white p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Select Size {activeColor ? `(for ${activeColor.name})` : ""}
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-primary underline hover:text-gold-600 transition-colors"
                >
                  <Ruler className="h-3.5 w-3.5 text-gold-500" />
                  <span>Size &amp; Measurement Guide</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {availableSizesForActiveColor.map((s) => {
                  const szStockObj = activeColor?.sizeStocks?.find((item) => item.size === s);
                  const szStock = szStockObj ? szStockObj.stock : activeColor?.stock;
                  const isOutOfStock = szStock !== undefined && szStock <= 0;

                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      disabled={isOutOfStock}
                      className={`min-w-14 rounded-2xl border px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all flex flex-col items-center gap-0.5 ${
                        chosen === s
                          ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                          : isOutOfStock
                          ? "border-border/60 bg-muted/40 text-muted-foreground/50 cursor-not-allowed line-through"
                          : "border-border hover:border-gold-400 hover:bg-blush/40 text-foreground bg-white"
                      }`}
                    >
                      <span>{s}</span>
                      {szStock !== undefined && szStock > 0 && szStock <= 2 && (
                        <span className="text-[9px] font-normal opacity-85">
                          {szStock} left
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Scissors className="h-3.5 w-3.5 text-primary" />
                  <span>Complimentary master tailoring available on all sizes</span>
                </span>
                <span className="font-medium text-foreground">
                  {chosenSizeStock > 0 ? `${chosenSizeStock} units in ${chosen}` : "Made to order"}
                </span>
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-border/80 bg-white shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Quantity
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-border bg-card">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="h-9 w-9 flex items-center justify-center text-sm font-bold hover:text-primary disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-foreground">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(chosenSizeStock > 0 ? chosenSizeStock : 10, q + 1))}
                    disabled={qty >= (chosenSizeStock > 0 ? chosenSizeStock : 10)}
                    className="h-9 w-9 flex items-center justify-center text-sm font-bold hover:text-primary disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-muted-foreground font-light">
                  {chosenSizeStock > 0
                    ? `Max ${chosenSizeStock} available`
                    : "Pre-order custom"}
                </span>
              </div>
            </div>

            {/* Main Action CTAs */}
            <div className="space-y-3 pt-2">
              {product.type === "readymade" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={chosenSizeStock <= 0}
                    className="flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-lift hover:opacity-95 transition-all disabled:opacity-50"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Add To Bag</span>
                  </button>
                  <button
                    onClick={() => {
                      addToCart(product.id, chosen, qty, activeColor?.name);
                      router.push("/checkout");
                    }}
                    disabled={chosenSizeStock <= 0}
                    className="rounded-full bg-gold-400 py-4 text-xs font-bold uppercase tracking-widest text-neutral-900 shadow-gold hover:bg-gold-300 transition-all disabled:opacity-50"
                  >
                    Buy Now
                  </button>
                </div>
              ) : (
                <Link
                  href={`/rental-booking?product=${product.id}&color=${encodeURIComponent(activeColor?.name || "")}&size=${encodeURIComponent(chosen)}`}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-xs font-bold uppercase tracking-widest text-primary-foreground shadow-lift hover:bg-primary/95 transition-all"
                >
                  <Calendar className="h-4 w-4 text-gold-400" />
                  <span>Reserve Rental Window ({activeColor?.name || "Selected Shade"})</span>
                </Link>
              )}

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center justify-center gap-2 rounded-full border border-border py-3 text-xs font-semibold uppercase tracking-wider transition-colors bg-white ${
                    wished ? "bg-rose-50 text-rose-700 border-rose-300" : "hover:bg-blush text-primary"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${wished ? "fill-rose-700 text-rose-700" : ""}`} />
                  <span>{wished ? "Saved in Wishlist" : "Save to Wishlist"}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 rounded-full border border-border py-3 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-muted/50 transition-colors bg-white"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{copied ? "Link Copied!" : "Share Outfit"}</span>
                </button>
              </div>

              {/* WhatsApp Concierge Stylist Consultation */}
              <a
                href={`https://wa.me/919699620950?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600/10 border border-emerald-600/30 py-3.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-2xs"
              >
                <WhatsAppIcon className="h-4 w-4 text-emerald-600" />
                <span>Inquire on WhatsApp with Priyanka Desai</span>
              </a>
            </div>

            {/* Information Tabs & Accordion */}
            <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-2xs space-y-4">
              <div className="flex flex-wrap gap-2 border-b border-border/80 pb-3 text-xs font-semibold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`rounded-xl px-3 py-1.5 transition-all ${
                    activeTab === "details" ? "bg-primary text-white shadow-xs" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  Fabric &amp; Craft
                </button>
                <button
                  onClick={() => setActiveTab("fitting")}
                  className={`rounded-xl px-3 py-1.5 transition-all ${
                    activeTab === "fitting" ? "bg-primary text-white shadow-xs" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  Alterations
                </button>
                <button
                  onClick={() => setActiveTab("rental")}
                  className={`rounded-xl px-3 py-1.5 transition-all ${
                    activeTab === "rental" ? "bg-primary text-white shadow-xs" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  Rental Policy
                </button>
                <button
                  onClick={() => setActiveTab("care")}
                  className={`rounded-xl px-3 py-1.5 transition-all ${
                    activeTab === "care" ? "bg-primary text-white shadow-xs" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  Garment Care
                </button>
              </div>

              <div className="text-xs leading-relaxed text-muted-foreground font-light pt-1">
                {activeTab === "details" && (
                  <div className="space-y-3">
                    <p className="text-foreground font-normal">{product.description}</p>
                    <div className="grid grid-cols-2 gap-2.5 pt-2 text-foreground font-normal bg-muted/30 p-3 rounded-2xl border border-border/60">
                      <div>
                        <span className="text-[10px] uppercase text-muted-foreground block font-semibold">Fabric Material</span>
                        <span className="font-semibold text-primary">{product.fabric || "Pure Silk & Zari"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-muted-foreground block font-semibold">Active Shade</span>
                        <span className="font-semibold text-primary">{activeColor?.name || product.color}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-muted-foreground block font-semibold">Occasion</span>
                        <span className="font-semibold text-primary">{product.occasion || "Wedding & Reception"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-muted-foreground block font-semibold">Origin</span>
                        <span className="font-semibold text-primary">Handcrafted Atelier</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "fitting" && (
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">
                      Free in-boutique custom tailoring &amp; trial fitting.
                    </p>
                    <p>
                      Every bride and patron gets complimentary adjustments for waist, blouse bust, and skirt length. Simply visit our Gadhinglaj studio or message your exact measurements to our tailoring desk 48 hours prior to delivery.
                    </p>
                  </div>
                )}

                {activeTab === "rental" && (
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">
                      3-Day Hassle-Free Rental Experience
                    </p>
                    <p>
                      Standard rentals span 3 days (Day 1: Pickup/Delivery, Day 2: Celebration, Day 3: Easy Return). Normal wear and tear is fully insured. Your security deposit is credited back immediately upon receipt.
                    </p>
                  </div>
                )}

                {activeTab === "care" && (
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">
                      Haute Couture Preservation Protocol
                    </p>
                    <p>
                      Professional dry cleaning only. Store on padded luxury hanger inside breathable muslin garment cover. Steam press on reverse side; never apply direct iron to zari or stone embroidery.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            RELATED SILHOUETTES SECTION ("You May Also Admire")
            ------------------------------------------------------------- */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-border/80 pt-16">
            <SectionHead
              eyebrow="Atelier Styling"
              title="You May Also Admire"
              subtitle="Complementary silhouettes and matching wedding wardrobes handpicked by Priyanka Desai."
            />
            <div className="mt-12">
              <ProductGrid products={related} />
            </div>
          </section>
        )}
      </div>

      {/* -------------------------------------------------------------
          INTERACTIVE SIZE GUIDE MODAL
          ------------------------------------------------------------- */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gold-300/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-gold-500" />
                <h3 className="font-display text-2xl text-primary">Atelier Size Guide</h3>
              </div>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* Unit Switcher */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Standard measurements for lehengas, sarees, gowns &amp; blouses:</p>
                <div className="flex rounded-xl border border-border p-1 bg-muted/40">
                  <button
                    onClick={() => setSizeUnit("in")}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                      sizeUnit === "in" ? "bg-primary text-white" : "text-muted-foreground"
                    }`}
                  >
                    Inches (in)
                  </button>
                  <button
                    onClick={() => setSizeUnit("cm")}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                      sizeUnit === "cm" ? "bg-primary text-white" : "text-muted-foreground"
                    }`}
                  >
                    Centimeters (cm)
                  </button>
                </div>
              </div>

              {/* Sizing Table */}
              <div className="overflow-x-auto rounded-2xl border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/60 text-foreground font-semibold uppercase text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Bust</th>
                      <th className="px-4 py-3">Waist</th>
                      <th className="px-4 py-3">Hip</th>
                      <th className="px-4 py-3">Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-medium">
                    {sizeUnit === "in" ? (
                      <>
                        <tr>
                          <td className="px-4 py-3 font-bold text-primary">XS</td>
                          <td className="px-4 py-3 text-muted-foreground">32&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">26&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">36&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">42&quot;</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-primary">S</td>
                          <td className="px-4 py-3 text-muted-foreground">34&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">28&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">38&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">42&quot;</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-primary">M</td>
                          <td className="px-4 py-3 text-muted-foreground">36&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">30&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">40&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">43&quot;</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-primary">L</td>
                          <td className="px-4 py-3 text-muted-foreground">38&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">32&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">42&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">43&quot;</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-primary">XL</td>
                          <td className="px-4 py-3 text-muted-foreground">40&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">34&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">44&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">44&quot;</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-primary">XXL</td>
                          <td className="px-4 py-3 text-muted-foreground">42&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">36&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">46&quot;</td>
                          <td className="px-4 py-3 text-muted-foreground">44&quot;</td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr>
                          <td className="px-4 py-3 font-bold text-primary">XS</td>
                          <td className="px-4 py-3 text-muted-foreground">81 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">66 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">91 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">107 cm</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-primary">S</td>
                          <td className="px-4 py-3 text-muted-foreground">86 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">71 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">97 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">107 cm</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-primary">M</td>
                          <td className="px-4 py-3 text-muted-foreground">91 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">76 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">102 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">109 cm</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-primary">L</td>
                          <td className="px-4 py-3 text-muted-foreground">97 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">81 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">107 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">109 cm</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-primary">XL</td>
                          <td className="px-4 py-3 text-muted-foreground">102 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">86 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">112 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">112 cm</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-primary">XXL</td>
                          <td className="px-4 py-3 text-muted-foreground">107 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">91 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">117 cm</td>
                          <td className="px-4 py-3 text-muted-foreground">112 cm</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bespoke Custom Tailoring Request */}
              <div className="rounded-2xl border border-gold-300/40 bg-gold-50/50 p-4 space-y-2">
                <span className="font-semibold text-xs text-primary flex items-center gap-1.5">
                  <Scissors className="h-4 w-4 text-gold-600" />
                  <span>Need Custom Bespoke Measurements?</span>
                </span>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  Our master tailors can customize the bust, waist, sleeve length, or lehenga ghera to your exact posture. Walk into our studio or message us on WhatsApp with your blouse/lehenga measurements.
                </p>
                <a
                  href={`https://wa.me/919699620950?text=${encodeURIComponent(
                    `Hi Priyanka Desai, I need custom size fitting for "${product.name}". Here are my measurements:`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 underline hover:text-emerald-950 pt-1"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  <span>Send custom measurements on WhatsApp →</span>
                </a>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-border/80 pt-4">
              <button
                onClick={() => setShowSizeGuide(false)}
                className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          FULLSCREEN LIGHTBOX MODAL
          ------------------------------------------------------------- */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-fade-in">
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close Lightbox"
            className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors z-50 text-xl font-bold"
          >
            ✕
          </button>
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl">
            <img
              src={displayImage}
              alt={product.name}
              className="max-h-[85vh] w-auto object-contain mx-auto rounded-2xl"
            />
            <div className="text-center text-white text-xs mt-3 font-light">
              <span>{product.name} — {activeColor?.name || product.color}</span>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MOBILE STICKY ACTION BAR (High-Converting Mobile UX)
          ------------------------------------------------------------- */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-border/80 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={displayImage}
            alt={product.name}
            className="h-11 w-11 rounded-xl object-cover border border-border shrink-0"
          />
          <div className="min-w-0">
            <span className="block text-xs font-bold text-foreground truncate">{product.name}</span>
            <span className="block text-xs font-display font-semibold text-primary">
              {inr(product.price)} · <strong className="text-muted-foreground text-[10px] uppercase">{activeColor?.name || ""}</strong>
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {product.type === "readymade" ? (
            <button
              onClick={handleAddToCart}
              className="rounded-full bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lift flex items-center gap-1.5"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Add to Bag</span>
            </button>
          ) : (
            <Link
              href={`/rental-booking?product=${product.id}&color=${encodeURIComponent(activeColor?.name || "")}&size=${encodeURIComponent(chosen)}`}
              className="rounded-full bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lift"
            >
              Reserve
            </Link>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

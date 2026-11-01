"use client";

import Link from "next/link";
import { useState } from "react";
import { inr, type Product } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { HeartIcon, Stars } from "./Icons";
import { Calendar, ShoppingBag, Eye } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const wished = wishlist.includes(product.id);
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const colors = product.colors && product.colors.length > 0 ? product.colors : [];
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const activeColor = colors[activeColorIdx] || null;
  const cardImage = activeColor?.image || product.image;

  return (
    <article className="group animate-fade-up flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary/40">
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={cardImage}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
          {product.type === "rental" ? (
            <span className="rounded-full bg-primary/95 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground shadow-sm">
              Rental Available
            </span>
          ) : (
            <span className="rounded-full bg-stone-900/90 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white shadow-sm">
              Ready-Made
            </span>
          )}

          {product.newArrival && (
            <span className="rounded-full bg-accent/95 backdrop-blur-md px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-accent-foreground shadow-sm">
              New Edit
            </span>
          )}

          {product.type === "readymade" && off > 0 && (
            <span className="rounded-full bg-rose/95 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-rose-foreground shadow-sm">
              {off}% Off
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(product.id)}
          className={`absolute right-3 top-3 rounded-full border border-border/80 bg-white/90 p-2.5 backdrop-blur-md transition-all duration-300 hover:scale-110 ${
            wished ? "text-rose bg-white" : "text-foreground/60 hover:text-rose hover:bg-white"
          }`}
        >
          <HeartIcon filled={wished} className="h-4 w-4" />
        </button>

        {/* Floating Quick Action Overlay (Touch-friendly on mobile, hover reveal on desktop) */}
        <div className="absolute inset-x-2.5 bottom-2.5 sm:inset-x-3 sm:bottom-3 flex gap-1.5 sm:gap-2 opacity-100 sm:opacity-0 sm:translate-y-2 transition-all duration-300 sm:group-hover:opacity-100 sm:group-hover:translate-y-0">
          <Link
            href={`/product/${product.id}`}
            className="flex flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-full border border-border/80 bg-white/95 py-2 sm:py-2.5 text-center text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary shadow-soft backdrop-blur-md hover:bg-white active:scale-95 transition-transform"
          >
            <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>View</span>
          </Link>

          {product.type === "readymade" ? (
            <button
              onClick={() => addToCart(product.id, product.sizes[0] ?? "M", 1, activeColor?.name)}
              className="flex flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-full bg-primary py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lift hover:opacity-90 active:scale-95 transition-transform"
            >
              <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Add</span>
            </button>
          ) : (
            <Link
              href={`/rental-booking?product=${product.id}&color=${encodeURIComponent(activeColor?.name || "")}`}
              className="flex flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-full bg-primary py-2 sm:py-2.5 text-center text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lift hover:opacity-90 active:scale-95 transition-transform"
            >
              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>Rent</span>
            </Link>
          )}
        </div>
      </div>

      {/* Outfit Information */}
      <div className="flex flex-1 flex-col justify-between p-4.5 space-y-2.5">
        <div>
          <div className="flex items-center justify-between">
            <p className="eyebrow text-[9.5px]">{product.category}</p>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Stars rating={product.rating} className="scale-90" />
              <span>({product.reviews})</span>
            </div>
          </div>

          <Link
            href={`/product/${product.id}`}
            className="mt-1.5 block font-display text-lg font-medium leading-snug text-foreground hover:text-primary transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Colours Swatches */}
          {colors.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-medium">Shades:</span>
              <div className="flex items-center gap-1">
                {colors.map((c, i) => (
                  <button
                    key={c.id || i}
                    type="button"
                    title={c.name}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveColorIdx(i);
                    }}
                    className={`h-5 px-2 rounded-full border text-[10px] font-semibold transition-all ${
                      activeColorIdx === i
                        ? "border-primary bg-primary text-white shadow-2xs scale-105"
                        : "border-border/80 bg-muted/40 text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing Box */}
        <div className="border-t border-border/60 pt-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-bold text-primary">
                {inr(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-muted-foreground line-through font-light">
                  {inr(product.mrp)}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {product.sizes.slice(0, 3).join(" · ")}
            </span>
          </div>

          {product.type === "rental" ? (
            <div className="mt-2 flex items-center justify-between rounded-lg bg-secondary/80 px-2.5 py-1.5 text-xs">
              <span className="text-muted-foreground font-light">Rent for 3 Days</span>
              <span className="font-semibold text-rose">{inr(product.rentalPrice)}</span>
            </div>
          ) : (
            <div className="mt-2 flex items-center justify-between rounded-lg bg-blush/60 px-2.5 py-1.5 text-xs">
              <span className="text-muted-foreground font-light">Direct Purchase</span>
              <span className="font-medium text-primary">Free Alteration</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

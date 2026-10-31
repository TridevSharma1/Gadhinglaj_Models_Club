"use client";

import Link from "next/link";
import { inr, type Product } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { HeartIcon, Stars } from "./Icons";

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const wished = wishlist.includes(product.id);
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <article className="group animate-fade-up overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/5] overflow-hidden bg-blush">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.type === "rental" && (
            <span className="rounded-full bg-primary/95 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-primary-foreground">
              Rental
            </span>
          )}
          {product.newArrival && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-accent-foreground">
              New
            </span>
          )}
          {product.type === "readymade" && off > 0 && (
            <span className="rounded-full bg-rose px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-rose-foreground">
              {off}% Off
            </span>
          )}
        </div>
        <button
          aria-label="Toggle wishlist"
          onClick={() => toggleWishlist(product.id)}
          className={`absolute right-3 top-3 rounded-full border border-border bg-card/90 p-2 transition-colors ${
            wished ? "text-rose" : "text-foreground/70 hover:text-rose"
          }`}
        >
          <HeartIcon filled={wished} className="h-4 w-4" />
        </button>
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Link
            href={`/product/${product.id}`}
            className="flex-1 rounded-full border border-border bg-card/95 py-2 text-center text-xs font-medium text-primary"
          >
            Quick View
          </Link>
          {product.type === "readymade" ? (
            <button
              onClick={() => addToCart(product.id, product.sizes[0] ?? "M")}
              className="flex-1 rounded-full bg-primary py-2 text-xs font-medium text-primary-foreground"
            >
              Add to Cart
            </button>
          ) : (
            <Link
              href={`/rental-booking?product=${product.id}`}
              className="flex-1 rounded-full bg-primary py-2 text-center text-xs font-medium text-primary-foreground"
            >
              Book Rental
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-2 p-4">
        <p className="eyebrow text-[10px]">{product.category}</p>
        <Link
          href={`/product/${product.id}`}
          className="block font-display text-lg leading-snug text-foreground hover:text-primary"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Stars rating={product.rating} />
          <span>
            {product.rating} ({product.reviews})
          </span>
        </div>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-base font-semibold text-primary">{inr(product.price)}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-muted-foreground line-through">{inr(product.mrp)}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Rent from <span className="font-medium text-rose">{inr(product.rentalPrice)}</span> / 3 days
        </p>
      </div>
    </article>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import SiteLayout, { EmptyState, PageHero } from "@/components/site/SiteLayout";
import { inr } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { useCartTotals } from "@/hooks/use-cart-totals";
import {
  ShoppingBag,
  Trash2,
  Heart,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  CheckCircle2,
} from "lucide-react";

export { useCartTotals };

export default function CartPage() {
  const { removeFromCart, setQty, toggleWishlist } = useStore();
  const { lines, subtotal, discount, delivery, tax, total } = useCartTotals();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promo.trim().toUpperCase() === "GMC10" || promo.trim().toUpperCase() === "FESTIVE") {
      setPromoApplied(true);
    }
  };

  const finalTotal = promoApplied ? Math.max(0, Math.round(total * 0.9)) : total;

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Your Curated Bag"
        title="Shopping Cart"
        subtitle="Review your selected designer silhouettes, adjust quantities, and verify sizing before proceeding to checkout."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shopping Bag" }]}
      />

      <div className="container-lux py-16">
        {!lines.length ? (
          <EmptyState
            title="Your Shopping Bag Is Empty"
            text="Discover our latest handcrafted ready-made gowns, bridal lehengas, and crop tops to add to your wardrobe."
            action={
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift"
                >
                  Explore Collection
                </Link>
                <Link
                  href="/rental"
                  className="rounded-full border border-border px-8 py-3 text-xs font-semibold uppercase tracking-widest text-primary hover:bg-blush"
                >
                  Explore Rentals
                </Link>
              </div>
            }
          />
        ) : (
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <h2 className="font-display text-2xl text-primary font-medium">
                  Bag Items ({lines.reduce((n, l) => n + l.qty, 0)})
                </h2>
                <span className="text-xs text-muted-foreground font-light">
                  Free In-Studio Alterations Included
                </span>
              </div>

              {lines.map((l) => {
                const colorVariant = l.product.colors?.find((c) => c.name === l.color);
                const itemImg = colorVariant?.image || l.product.image;
                return (
                  <div
                    key={`${l.productId}-${l.size}-${l.color || "def"}`}
                    className="animate-fade-up flex flex-col sm:flex-row gap-5 rounded-3xl border border-border/80 bg-card p-5 shadow-soft transition-all hover:border-primary/40"
                  >
                    <Link href={`/product/${l.product.id}`} className="shrink-0 overflow-hidden rounded-2xl bg-blush">
                      <img
                        src={itemImg}
                        alt={l.product.name}
                        className="h-44 w-full sm:w-32 object-cover object-top hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="eyebrow text-[9.5px]">{l.product.category}</p>
                            <Link
                              href={`/product/${l.product.id}`}
                              className="font-display text-xl font-medium text-foreground hover:text-primary transition-colors"
                            >
                              {l.product.name}
                            </Link>
                          </div>
                          <p className="font-display text-xl font-bold text-primary">
                            {inr(l.product.price * l.qty)}
                          </p>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground font-light">
                          <span className="rounded-lg bg-secondary px-2.5 py-1 text-primary font-medium">
                            Size: {l.size}
                          </span>
                          {l.color && (
                            <span className="rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-primary font-semibold">
                              Colour: {l.color}
                            </span>
                          )}
                          <span>Unit: {inr(l.product.price)}</span>
                          {l.product.mrp > l.product.price && (
                            <span className="line-through">{inr(l.product.mrp)}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-3 text-xs">
                        {/* Quantity Controller */}
                        <div className="flex items-center rounded-xl border border-border bg-background">
                          <button
                            onClick={() => setQty(l.productId, l.size, l.qty - 1, l.color)}
                            className="px-3 py-1 hover:text-primary"
                            aria-label="Decrease"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold">{l.qty}</span>
                          <button
                            onClick={() => setQty(l.productId, l.size, l.qty + 1, l.color)}
                            className="px-3 py-1 hover:text-primary"
                            aria-label="Increase"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => {
                              toggleWishlist(l.productId);
                              removeFromCart(l.productId, l.size, l.color);
                            }}
                            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Heart className="h-3.5 w-3.5" />
                            <span>Move to Wishlist</span>
                          </button>

                          <button
                            onClick={() => removeFromCart(l.productId, l.size, l.color)}
                            className="flex items-center gap-1.5 text-rose hover:opacity-80 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Order Summary Card */}
            <div className="lg:col-span-4">
              <aside className="sticky top-28 space-y-6 rounded-3xl border border-border/80 bg-card p-8 shadow-lift">
                <div>
                  <span className="eyebrow">Price Breakdown</span>
                  <h3 className="mt-1 font-display text-2xl text-primary font-medium">Order Summary</h3>
                  <div className="gold-rule mt-2" />
                </div>

                {/* Promo Code Box */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                      placeholder="Coupon Code (e.g. GMC10)"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs uppercase tracking-wider outline-none focus:border-rose"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-secondary px-4 text-xs font-semibold uppercase text-primary hover:bg-blush"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                      <CheckCircle2 className="h-3 w-3" />
                      10% Atelier Discount Applied!
                    </p>
                  )}
                </form>

                <dl className="space-y-3 text-xs border-t border-border/60 pt-4">
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground font-light">Subtotal</dt>
                    <dd className="font-medium text-foreground">{inr(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground font-light">Catalog Savings</dt>
                    <dd className="font-semibold text-rose">− {inr(discount)}</dd>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between items-center text-emerald-600">
                      <dt className="font-light">Promo Discount (10%)</dt>
                      <dd className="font-semibold">− {inr(Math.round(total * 0.1))}</dd>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground font-light">Pan-Maharashtra Delivery</dt>
                    <dd className="font-semibold text-foreground">
                      {delivery > 0 ? inr(delivery) : "Free"}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground font-light">GST / Taxes</dt>
                    <dd className="font-medium text-foreground">{inr(tax)}</dd>
                  </div>
                  <div className="flex justify-between items-center border-t border-border pt-4 text-sm">
                    <dt className="font-semibold text-foreground uppercase tracking-wider text-xs">
                      Grand Total
                    </dt>
                    <dd className="font-display text-2xl font-bold text-primary">
                      {inr(finalTotal)}
                    </dd>
                  </div>
                </dl>

                <Link
                  href="/checkout"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift hover:opacity-90 transition-opacity"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="space-y-2 border-t border-border/60 pt-4 text-[11px] text-muted-foreground font-light">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span>Secure Checkout &amp; COD Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-accent shrink-0" />
                    <span>Estimated 4–6 business days delivery</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

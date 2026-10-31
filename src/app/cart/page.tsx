"use client";

import Link from "next/link";
import SiteLayout, { EmptyState, PageHero } from "@/components/site/SiteLayout";
import { inr } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { useCartTotals } from "@/hooks/use-cart-totals";

export { useCartTotals };

export default function CartPage() {
  const { removeFromCart, setQty, toggleWishlist } = useStore();
  const { lines, subtotal, discount, delivery, tax, total } = useCartTotals();

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Your selection"
        title="Shopping Cart"
        subtitle="Review your pieces, adjust sizes and quantities, then check out."
      />
      <div className="container-lux py-14">
        {!lines.length ? (
          <EmptyState
            title="Your cart is empty"
            text="Add a designer piece and it will appear here."
            action={
              <Link
                href="/shop"
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Start shopping
              </Link>
            }
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {lines.map((l) => (
                <div
                  key={`${l.productId}-${l.size}`}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-row"
                >
                  <img
                    src={l.product.image}
                    alt={l.product.name}
                    loading="lazy"
                    className="h-40 w-full rounded-xl object-cover sm:h-32 sm:w-28"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${l.product.id}`}
                      className="font-display text-lg text-primary hover:underline"
                    >
                      {l.product.name}
                    </Link>
                    <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                      {l.product.category} · Size {l.size}
                    </p>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {inr(l.product.price)}
                      <span className="ml-2 text-xs text-muted-foreground line-through">
                        {inr(l.product.mrp)}
                      </span>
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button
                          onClick={() => setQty(l.productId, l.size, l.qty - 1)}
                          className="px-3 py-1 text-sm"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-sm">{l.qty}</span>
                        <button
                          onClick={() => setQty(l.productId, l.size, l.qty + 1)}
                          className="px-3 py-1 text-sm"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          toggleWishlist(l.productId);
                          removeFromCart(l.productId, l.size);
                        }}
                        className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
                      >
                        Move to wishlist
                      </button>
                      <button
                        onClick={() => removeFromCart(l.productId, l.size)}
                        className="text-xs uppercase tracking-widest text-destructive/80 hover:text-destructive"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="shrink-0 font-display text-xl text-primary">
                    {inr(l.product.price * l.qty)}
                  </p>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-2xl text-primary">Order Summary</h2>
              <div className="gold-rule my-4" />
              <dl className="space-y-3 text-sm">
                <Row label="Subtotal" value={inr(subtotal)} />
                <Row label="Discount" value={`− ${inr(discount)}`} />
                <Row label="Delivery" value={inr(delivery)} />
                <Row label="Tax" value={inr(tax)} />
              </dl>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm uppercase tracking-widest text-muted-foreground">
                  Grand Total
                </span>
                <span className="font-display text-2xl text-primary">{inr(total)}</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Estimated delivery in 4–6 working days across Maharashtra.
              </p>
              <Link
                href="/checkout"
                className="mt-6 block rounded-full bg-primary py-3 text-center text-sm font-medium text-primary-foreground shadow-lift"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

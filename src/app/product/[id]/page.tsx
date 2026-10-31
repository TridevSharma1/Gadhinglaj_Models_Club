"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import SiteLayout, { EmptyState, SectionHead } from "@/components/site/SiteLayout";
import ProductGrid from "@/components/site/ProductGrid";
import { Stars } from "@/components/site/Icons";
import { useStore } from "@/lib/store";
import { inr } from "@/data/catalog";

const positions = ["object-top", "object-center", "object-bottom"];

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { products, addToCart, toggleWishlist, wishlist } = useStore();
  const router = useRouter();
  const product = products.find((p) => p.id === Number(id) && p.active);
  const [view, setView] = useState(0);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);

  if (!product)
    return (
      <SiteLayout>
        <div className="container-lux py-24">
          <EmptyState
            title="Outfit not found"
            text="This piece may have been retired from the collection."
            action={
              <Link href="/shop" className="rounded-full bg-primary px-6 py-2.5 text-sm text-primary-foreground">
                Back to Shop
              </Link>
            }
          />
        </div>
      </SiteLayout>
    );

  const chosen = size || product.sizes[0] || "M";
  const off = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const wished = wishlist.includes(product.id);
  const related = products
    .filter((p) => p.active && p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <SiteLayout>
      <div className="container-lux py-12">
        <nav className="mb-8 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>{" "}
          / <Link href="/shop" className="hover:text-primary">Shop</Link> /{" "}
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-3xl border border-border bg-blush shadow-lift">
              <img
                src={product.image}
                alt={product.name}
                className={`aspect-[4/5] w-full object-cover ${positions[view]}`}
              />
            </div>
            <div className="mt-4 flex gap-3">
              {positions.map((pos, i) => (
                <button
                  key={pos}
                  onClick={() => setView(i)}
                  className={`h-24 w-20 overflow-hidden rounded-2xl border-2 transition-colors ${
                    view === i ? "border-primary" : "border-border"
                  }`}
                >
                  <img src={product.image} alt="" className={`h-full w-full object-cover ${pos}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">{product.category}</p>
            <h1 className="mt-3 font-display text-3xl text-primary md:text-4xl">{product.name}</h1>
            <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
              <Stars rating={product.rating} />
              <span>
                {product.rating} · {product.reviews} reviews
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-3xl text-primary">{inr(product.price)}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-sm text-muted-foreground line-through">
                    {inr(product.mrp)}
                  </span>
                  <span className="rounded-full bg-rose px-2.5 py-1 text-[11px] font-medium text-rose-foreground">
                    {off}% OFF
                  </span>
                </>
              )}
            </div>

            {product.type === "rental" && (
              <div className="mt-6 grid grid-cols-2 gap-y-2 rounded-2xl border border-accent/40 bg-accent/10 p-5 text-sm">
                <span className="text-muted-foreground">Rental price</span>
                <span className="text-right font-semibold text-primary">
                  {inr(product.rentalPrice)}
                </span>
                <span className="text-muted-foreground">Security deposit</span>
                <span className="text-right">{inr(product.deposit)}</span>
                <span className="text-muted-foreground">Rental duration</span>
                <span className="text-right">{product.rentalDuration}</span>
                <span className="text-muted-foreground">Available dates</span>
                <span className="text-right">Any date, subject to booking</span>
              </div>
            )}

            <div className="mt-7">
              <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Select size
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-12 rounded-full border px-4 py-2 text-sm transition-colors ${
                      chosen === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-blush"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Quantity
              </span>
              <div className="flex items-center rounded-full border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2">
                  −
                </button>
                <span className="w-8 text-center text-sm">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2">
                  +
                </button>
              </div>
              <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {product.type === "readymade" ? (
                <>
                  <button
                    onClick={() => addToCart(product.id, chosen, qty)}
                    className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-lift"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      addToCart(product.id, chosen, qty);
                      router.push("/checkout");
                    }}
                    className="rounded-full bg-rose px-7 py-3 text-sm font-medium text-rose-foreground"
                  >
                    Buy Now
                  </button>
                </>
              ) : (
                <Link
                  href={`/rental-booking?product=${product.id}`}
                  className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-lift"
                >
                  Book Rental
                </Link>
              )}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="rounded-full border border-border px-7 py-3 text-sm text-primary transition-colors hover:bg-blush"
              >
                {wished ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-y-3 border-t border-border pt-6 text-sm">
              <dt className="text-muted-foreground">Fabric</dt>
              <dd>{product.fabric}</dd>
              <dt className="text-muted-foreground">Colour</dt>
              <dd>{product.color}</dd>
              <dt className="text-muted-foreground">Occasion</dt>
              <dd>{product.occasion}</dd>
              <dt className="text-muted-foreground">Care</dt>
              <dd>Dry clean only. Store on a padded hanger.</dd>
              <dt className="text-muted-foreground">Delivery</dt>
              <dd>3–6 working days across Maharashtra.</dd>
              <dt className="text-muted-foreground">Returns</dt>
              <dd>
                {product.type === "rental"
                  ? "Return within the rental window; deposit refunded after inspection."
                  : "7-day exchange on unworn pieces with tags intact."}
              </dd>
            </dl>
          </div>
        </div>

        {related.length > 0 && (
          <section className="pt-24">
            <SectionHead eyebrow="You may also like" title="Related Outfits" />
            <div className="mt-10">
              <ProductGrid products={related} />
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}

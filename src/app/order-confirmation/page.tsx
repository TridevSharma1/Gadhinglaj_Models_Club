"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SiteLayout, { EmptyState } from "@/components/site/SiteLayout";
import { inr } from "@/data/catalog";
import { useStore } from "@/lib/store";
import {
  CheckCircle2,
  Printer,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  Calendar,
} from "lucide-react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { orders, content } = useStore();
  const order = orders.find((o) => o.id === id);

  return (
    <div className="container-lux py-16 md:py-24">
      {!order ? (
        <EmptyState
          title="Order Not Found"
          text="We could not locate that order reference in your current session records."
          action={
            <Link
              href="/shop"
              className="rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift"
            >
              Continue Shopping
            </Link>
          }
        />
      ) : (
        <div className="animate-fade-up mx-auto max-w-2xl rounded-3xl border border-border/80 bg-card p-8 md:p-14 text-center shadow-lift space-y-7">
          {/* Animated Gold Checkmark */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent to-gold text-accent-foreground shadow-gold">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>

          <div>
            <span className="eyebrow">Thank You For Your Patronage</span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-primary font-normal">
              Order Confirmed
            </h1>
            <div className="gold-rule mx-auto mt-4" />
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground font-light max-w-lg mx-auto">
            Your boutique order <strong className="font-semibold text-foreground">{order.id}</strong> has been registered. Our concierge will contact you on <strong className="font-semibold text-foreground">{order.phone}</strong> for fitting preferences and dispatch coordination.
          </p>

          {/* Delivery Timeline Card */}
          <div className="rounded-2xl border border-accent/40 bg-accent/10 p-5 text-left text-xs space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Truck className="h-4 w-4" />
              <span>Estimated Delivery: 4 to 6 Working Days</span>
            </div>
            <p className="text-muted-foreground font-light">
              Your garments are currently undergoing custom studio fitting, steam pressing, and premium satin-cover packaging.
            </p>
          </div>

          {/* Itemized Order Receipt */}
          <div className="rounded-2xl border border-border bg-secondary/50 p-6 space-y-3.5 text-left text-xs">
            <p className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px]">
              Purchased Silhouettes
            </p>

            <div className="divide-y divide-border/60">
              {order.items.map((it, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                  <div>
                    <span className="font-medium text-foreground">{it.name}</span>
                    <span className="block text-[11px] text-muted-foreground font-light">
                      Size {it.size} · Qty {it.qty}
                    </span>
                  </div>
                  <span className="font-semibold text-primary">{inr(it.price * it.qty)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="font-semibold text-foreground uppercase tracking-wider text-xs">
                Total Paid ({order.payment})
              </span>
              <span className="font-display text-2xl font-bold text-primary">
                {inr(order.amount)}
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-3 pt-3">
            <a
              href={`https://wa.me/919699620950?text=Hi%20Gadhinglaj%20Models%20Club,%20I%20have%20placed%20order%20${order.id}.%20Can%20you%20confirm%20dispatch%20status?`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lift hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Support
            </a>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-blush transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print Invoice
            </button>
          </div>

          <div className="pt-2">
            <Link
              href="/shop"
              className="text-xs text-muted-foreground hover:text-primary underline"
            >
              Continue Exploring Collection
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <SiteLayout>
      <Suspense fallback={<div className="container-lux py-24 text-center">Loading order receipt…</div>}>
        <OrderConfirmationContent />
      </Suspense>
    </SiteLayout>
  );
}

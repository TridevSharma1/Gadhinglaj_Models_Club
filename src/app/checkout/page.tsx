"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SiteLayout, { EmptyState, PageHero } from "@/components/site/SiteLayout";
import { inr, type Order } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { useCartTotals } from "@/hooks/use-cart-totals";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const payments = [
  { id: "Cash on Delivery", label: "Cash on Delivery (COD)", icon: Banknote, desc: "Pay upon delivery at your doorstep." },
  { id: "UPI", label: "Instant UPI / QR Code", icon: QrCode, desc: "Google Pay, PhonePe, Paytm, BHIM." },
  { id: "Card", label: "Credit or Debit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay cards." },
];

const field =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-rose shadow-soft";

export default function CheckoutPage() {
  const { placeOrder } = useStore();
  const { lines, subtotal, discount, delivery, tax, total } = useCartTotals();
  const router = useRouter();

  const [payment, setPayment] = useState(payments[0]!.id);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "Gadhinglaj",
    state: "Maharashtra",
    pincode: "416502",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const order: Order = {
      id: `GMC-${Math.floor(1100 + Math.random() * 8900)}`,
      customer: form.name,
      phone: form.phone,
      date: new Date().toISOString().slice(0, 10),
      items: lines.map((l) => ({
        name: l.color ? `${l.product.name} [${l.color}]` : l.product.name,
        qty: l.qty,
        size: l.size,
        price: l.product.price,
      })),
      amount: total,
      payment,
      status: "Pending",
    };
    placeOrder(order);
    router.push(`/order-confirmation?id=${order.id}`);
  };

  if (!lines.length) {
    return (
      <SiteLayout>
        <PageHero eyebrow="Almost Ready" title="Checkout" />
        <div className="container-lux py-16">
          <EmptyState
            title="Nothing in Your Checkout Bag"
            text="Your shopping cart is currently empty. Explore our ready-made and rental collections."
            action={
              <Link
                href="/shop"
                className="rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift"
              >
                Browse Collection
              </Link>
            }
          />
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Final Step"
        title="Secure Checkout"
        subtitle="Provide your shipping destination and select your preferred payment mode. Orders are hand-inspected and dispatched in luxury protective packaging."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      />

      <form onSubmit={submit} className="container-lux py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Form: Address & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Delivery Address */}
            <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-soft space-y-6">
              <div>
                <span className="eyebrow">Destination</span>
                <h2 className="mt-1 font-display text-2xl text-primary font-medium">Shipping Address</h2>
                <div className="gold-rule mt-2" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Recipient Full Name
                    </span>
                    <input
                      required
                      value={form.name}
                      onChange={set("name")}
                      placeholder="e.g. Radhika Sharma"
                      className={field}
                    />
                  </label>
                </div>

                <div>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Mobile Number
                    </span>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="+91 98765 43210"
                      className={field}
                    />
                  </label>
                </div>

                <div>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email Address
                    </span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="radhika@example.com"
                      className={field}
                    />
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Street Address &amp; House / Flat No.
                    </span>
                    <input
                      required
                      value={form.address}
                      onChange={set("address")}
                      placeholder="Flat 402, Royal Residency, Tilak Path"
                      className={field}
                    />
                  </label>
                </div>

                <div>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      City / Town
                    </span>
                    <input
                      required
                      value={form.city}
                      onChange={set("city")}
                      className={field}
                    />
                  </label>
                </div>

                <div>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Pincode
                    </span>
                    <input
                      required
                      value={form.pincode}
                      onChange={set("pincode")}
                      className={field}
                    />
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      State
                    </span>
                    <input
                      required
                      value={form.state}
                      onChange={set("state")}
                      className={field}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Payment Mode Selection */}
            <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-soft space-y-6">
              <div>
                <span className="eyebrow">Payment Option</span>
                <h2 className="mt-1 font-display text-2xl text-primary font-medium">Select Payment Method</h2>
                <div className="gold-rule mt-2" />
              </div>

              <div className="space-y-3">
                {payments.map((p) => {
                  const Icon = p.icon;
                  const isSelected = payment === p.id;
                  return (
                    <label
                      key={p.id}
                      className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4.5 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-soft"
                          : "border-border hover:bg-blush/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={isSelected}
                        onChange={() => setPayment(p.id)}
                        className="mt-1 accent-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground text-sm">{p.label}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground font-light">{p.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-5">
            <aside className="sticky top-28 space-y-6 rounded-3xl border border-border/80 bg-card p-8 shadow-lift">
              <div>
                <span className="eyebrow">Order Items</span>
                <h3 className="mt-1 font-display text-2xl text-primary font-medium">Summary &amp; Total</h3>
                <div className="gold-rule mt-2" />
              </div>

              <ul className="space-y-3 divide-y divide-border/60 max-h-72 overflow-y-auto pr-1">
                {lines.map((l) => {
                  const colorVariant = l.product.colors?.find((c) => c.name === l.color);
                  const itemImg = colorVariant?.image || l.product.image;
                  return (
                    <li key={`${l.productId}-${l.size}-${l.color || "def"}`} className="flex gap-3 pt-3 first:pt-0">
                      <img
                        src={itemImg}
                        alt={l.product.name}
                        className="h-16 w-14 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{l.product.name}</p>
                        <p className="text-xs text-muted-foreground font-light">
                          Size {l.size} {l.color && `· ${l.color}`} × {l.qty}
                        </p>
                        <p className="text-xs text-primary font-semibold mt-1">
                          {inr(l.product.price * l.qty)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <dl className="space-y-3 text-xs border-t border-border/60 pt-4">
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground font-light">Subtotal</dt>
                  <dd className="font-medium text-foreground">{inr(subtotal)}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground font-light">Promotional Discount</dt>
                  <dd className="font-semibold text-rose">− {inr(discount)}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground font-light">Shipping</dt>
                  <dd className="font-semibold text-foreground">
                    {delivery > 0 ? inr(delivery) : "Complimentary"}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground font-light">Taxes (GST)</dt>
                  <dd className="font-medium text-foreground">{inr(tax)}</dd>
                </div>
                <div className="flex justify-between items-center border-t border-border pt-4 text-sm">
                  <dt className="font-semibold text-foreground uppercase tracking-wider text-xs">
                    Grand Total
                  </dt>
                  <dd className="font-display text-2xl font-bold text-primary">
                    {inr(total)}
                  </dd>
                </div>
              </dl>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift hover:opacity-95 transition-opacity"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Place Order ({inr(total)})</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-center text-[11px] text-muted-foreground font-light">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>Encrypted 256-Bit Checkout · 100% Guaranteed</span>
              </div>
            </aside>
          </div>
        </div>
      </form>
    </SiteLayout>
  );
}

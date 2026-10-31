"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SiteLayout, { EmptyState, PageHero } from "@/components/site/SiteLayout";
import { inr, type Order } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { useCartTotals } from "@/hooks/use-cart-totals";

const payments = ["Cash on Delivery", "UPI", "Card", "Digital Wallet"];
const field =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-rose";

export default function CheckoutPage() {
  const { placeOrder } = useStore();
  const { lines, subtotal, discount, delivery, tax, total } = useCartTotals();
  const router = useRouter();
  const [payment, setPayment] = useState(payments[0]!);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
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
        name: l.product.name,
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

  if (!lines.length)
    return (
      <SiteLayout>
        <PageHero eyebrow="Almost there" title="Checkout" />
        <div className="container-lux py-14">
          <EmptyState
            title="Nothing to check out"
            text="Your cart is empty — add an outfit first."
            action={
              <Link
                href="/shop"
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Browse the collection
              </Link>
            }
          />
        </div>
      </SiteLayout>
    );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Almost there"
        title="Checkout"
        subtitle="Tell us where to deliver your outfit. This is a demonstration checkout — no payment is processed."
      />
      <form onSubmit={submit} className="container-lux grid gap-8 py-14 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-2xl text-primary">Customer Information</h2>
            <div className="gold-rule my-4" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name">
                <input required value={form.name} onChange={set("name")} className={field} />
              </Field>
              <Field label="Mobile Number">
                <input
                  required
                  type="tel"
                  pattern="[0-9+ ]{10,15}"
                  value={form.phone}
                  onChange={set("phone")}
                  className={field}
                />
              </Field>
              <Field label="Email">
                <input required type="email" value={form.email} onChange={set("email")} className={field} />
              </Field>
              <Field label="Pincode">
                <input required value={form.pincode} onChange={set("pincode")} className={field} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Address">
                  <input required value={form.address} onChange={set("address")} className={field} />
                </Field>
              </div>
              <Field label="City">
                <input required value={form.city} onChange={set("city")} className={field} />
              </Field>
              <Field label="State">
                <input required value={form.state} onChange={set("state")} className={field} />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-2xl text-primary">Payment Method</h2>
            <div className="gold-rule my-4" />
            <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
              Demo only — no gateway is connected
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {payments.map((p) => (
                <label
                  key={p}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    payment === p ? "border-rose bg-blush" : "border-border hover:bg-blush/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="accent-primary"
                    checked={payment === p}
                    onChange={() => setPayment(p)}
                  />
                  {p}
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-2xl text-primary">Order Summary</h2>
          <div className="gold-rule my-4" />
          <ul className="space-y-3">
            {lines.map((l) => (
              <li key={`${l.productId}-${l.size}`} className="flex gap-3">
                <img
                  src={l.product.image}
                  alt={l.product.name}
                  loading="lazy"
                  className="h-16 w-14 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{l.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Size {l.size} × {l.qty}
                  </p>
                </div>
                <span className="text-sm text-foreground">{inr(l.product.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
            <SumRow label="Subtotal" value={inr(subtotal)} />
            <SumRow label="Discount" value={`− ${inr(discount)}`} />
            <SumRow label="Delivery" value={inr(delivery)} />
            <SumRow label="Tax" value={inr(tax)} />
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm uppercase tracking-widest text-muted-foreground">Grand Total</span>
            <span className="font-display text-2xl text-primary">{inr(total)}</span>
          </div>
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground shadow-lift transition-opacity hover:opacity-90"
          >
            Place Order
          </button>
        </aside>
      </form>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

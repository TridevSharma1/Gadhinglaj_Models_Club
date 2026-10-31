"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { inr, type Booking } from "@/data/catalog";
import { useStore } from "@/lib/store";

const field =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-rose";

const occasions = [
  "Pre-Wedding Shoot",
  "Post-Wedding Celebration",
  "Maternity Shoot",
  "Engagement",
  "Party",
  "Other Special Occasion",
];

function RentalBookingContent() {
  const searchParams = useSearchParams();
  const preset = searchParams.get("product");
  const { products, addBooking } = useStore();
  const rentals = products.filter((p) => p.type === "rental" && p.active);
  const [done, setDone] = useState<Booking | null>(null);
  const [form, setForm] = useState({
    productId: String(preset ?? rentals[0]?.id ?? ""),
    size: "",
    start: "",
    end: "",
    name: "",
    phone: "",
    email: "",
    occasion: occasions[0]!,
    notes: "",
  });

  const outfit = rentals.find((p) => String(p.id) === form.productId) ?? rentals[0];
  const days =
    form.start && form.end
      ? Math.max(
          1,
          Math.round(
            (new Date(form.end).getTime() - new Date(form.start).getTime()) / 86400000,
          ) || 1,
        )
      : 1;
  const rental = outfit ? outfit.rentalPrice : 0;
  const deposit = outfit ? outfit.deposit : 0;

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outfit) return;
    const booking: Booking = {
      id: `RNT-${Math.floor(2100 + Math.random() * 7800)}`,
      customer: form.name,
      phone: form.phone,
      email: form.email,
      outfit: outfit.name,
      size: form.size || outfit.sizes[0] || "Free Size",
      start: form.start,
      end: form.end,
      occasion: form.occasion,
      notes: form.notes,
      rental,
      deposit,
      status: "Pending",
    };
    addBooking(booking);
    setDone(booking);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container-lux py-14">
      {done ? (
        <div className="animate-fade-up mx-auto max-w-xl rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
          <p className="eyebrow">Request received</p>
          <h2 className="mt-3 font-display text-3xl text-primary">Booking {done.id}</h2>
          <div className="gold-rule mx-auto mt-5" />
          <p className="mt-5 text-sm text-muted-foreground">
            {done.outfit} reserved for {done.occasion} from {done.start} to {done.end}. We will
            call {done.phone} to confirm.
          </p>
          <div className="mt-6 flex justify-between rounded-2xl bg-secondary/50 px-5 py-4 text-sm">
            <span className="text-muted-foreground">Rental {inr(done.rental)}</span>
            <span className="text-muted-foreground">Deposit {inr(done.deposit)}</span>
            <span className="font-medium text-primary">Total {inr(done.rental + done.deposit)}</span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/rental"
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
            >
              Browse more rentals
            </Link>
            <button
              onClick={() => setDone(null)}
              className="rounded-full border border-border px-6 py-2.5 text-sm text-primary hover:bg-blush"
            >
              New request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-2xl text-primary">Booking Details</h2>
            <div className="gold-rule my-4" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label text="Outfit">
                  <select value={form.productId} onChange={set("productId")} className={field}>
                    {rentals.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {inr(p.rentalPrice)}
                      </option>
                    ))}
                  </select>
                </Label>
              </div>
              <Label text="Size">
                <select value={form.size} onChange={set("size")} className={field}>
                  {(outfit?.sizes ?? ["Free Size"]).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Label>
              <Label text="Occasion">
                <select value={form.occasion} onChange={set("occasion")} className={field}>
                  {occasions.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Label>
              <Label text="Rental Start Date">
                <input required type="date" value={form.start} onChange={set("start")} className={field} />
              </Label>
              <Label text="Rental End Date">
                <input required type="date" value={form.end} onChange={set("end")} className={field} />
              </Label>
              <Label text="Full Name">
                <input required value={form.name} onChange={set("name")} className={field} />
              </Label>
              <Label text="Phone">
                <input required type="tel" value={form.phone} onChange={set("phone")} className={field} />
              </Label>
              <div className="sm:col-span-2">
                <Label text="Email">
                  <input required type="email" value={form.email} onChange={set("email")} className={field} />
                </Label>
              </div>
              <div className="sm:col-span-2">
                <Label text="Notes">
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={set("notes")}
                    placeholder="Alterations, pickup preference, styling requests…"
                    className={field}
                  />
                </Label>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-2xl text-primary">Booking Summary</h2>
            <div className="gold-rule my-4" />
            {outfit && (
              <>
                <img
                  src={outfit.image}
                  alt={outfit.name}
                  loading="lazy"
                  className="h-56 w-full rounded-xl object-cover"
                />
                <p className="mt-4 font-display text-lg text-primary">{outfit.name}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {outfit.category} · {outfit.rentalDuration}
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  <Row label="Rental price" value={inr(rental)} />
                  <Row label="Security deposit" value={inr(deposit)} />
                  <Row label="Duration" value={`${days} day${days > 1 ? "s" : ""}`} />
                </dl>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm uppercase tracking-widest text-muted-foreground">
                    Total payable
                  </span>
                  <span className="font-display text-2xl text-primary">{inr(rental + deposit)}</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Deposit is refunded after the outfit is returned undamaged.
                </p>
              </>
            )}
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground shadow-lift transition-opacity hover:opacity-90"
            >
              Submit Rental Request
            </button>
          </aside>
        </form>
      )}
    </div>
  );
}

export default function RentalBookingPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Rental studio"
        title="Rental Booking"
        subtitle="Reserve your outfit with dates, size and occasion. Our team confirms availability by phone."
      />
      <Suspense fallback={<div className="container-lux py-14">Loading booking form…</div>}>
        <RentalBookingContent />
      </Suspense>
    </SiteLayout>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
        {text}
      </span>
      {children}
    </label>
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

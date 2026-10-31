"use client";

import { useState } from "react";
import AdminShell, { btn, btnGhost, card, input } from "@/components/admin/AdminShell";
import type { Offer } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { SparkleIcon } from "@/components/site/Icons";

type OfferDraft = Offer & { banner?: string };

export default function AdminOffersPage() {
  const { offers, update } = useStore();
  const [draft, setDraft] = useState<OfferDraft | null>(null);
  const [viewOffer, setViewOffer] = useState<Offer | null>(null);

  const save = () => {
    if (!draft || !draft.title.trim()) return;
    const exists = offers.some((o) => o.id === draft.id);
    update(
      "offers",
      exists ? offers.map((o) => (o.id === draft.id ? draft : o)) : [draft, ...offers],
    );
    setDraft(null);
  };

  const onImage = (file: File | undefined) => {
    if (!file || !draft) return;
    const reader = new FileReader();
    reader.onload = () => setDraft({ ...draft, banner: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const remove = (id: number) => {
    if (confirm("Are you sure you want to remove this seasonal offer?")) {
      update("offers", offers.filter((o) => o.id !== id));
    }
  };

  return (
    <AdminShell
      title="Vouchers & Privileges"
      subtitle={`${offers.length} active client promotions and seasonal offers.`}
      action={
        <button
          className={btn}
          onClick={() =>
            setDraft({
              id: Math.max(0, ...offers.map((o) => o.id)) + 1,
              title: "",
              discount: "10% OFF",
              description: "",
              start: new Date().toISOString().split("T")[0],
              end: "",
              active: true,
            })
          }
        >
          <span>+</span>
          <span>Create New Privilege</span>
        </button>
      }
    >
      {/* Editor Modal/Card */}
      {draft && (
        <div className="mb-8 rounded-3xl border-2 border-gold-400/40 bg-white p-7 shadow-lift animate-fade-up">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div className="flex items-center gap-2">
              <SparkleIcon className="h-5 w-5 text-gold-400" />
              <h2 className="font-display text-xl text-primary">
                {offers.some((o) => o.id === draft.id) ? "Edit Privilege Voucher" : "New Seasonal Offer"}
              </h2>
            </div>
            <button
              onClick={() => setDraft(null)}
              className="text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
            >
              ✕ Close
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Privilege Title
              </label>
              <input
                placeholder="e.g. Bridal Trousseau Privilege"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className={input}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Discount Tag
              </label>
              <input
                placeholder="e.g. 15% OFF or COMPLIMENTARY"
                value={draft.discount}
                onChange={(e) => setDraft({ ...draft, discount: e.target.value })}
                className={input}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Promotional Banner
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onImage(e.target.files?.[0])}
                className={input}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Commencement Date
              </label>
              <input
                type="date"
                value={draft.start}
                onChange={(e) => setDraft({ ...draft, start: e.target.value })}
                className={input}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Expiry Date
              </label>
              <input
                type="date"
                value={draft.end}
                onChange={(e) => setDraft({ ...draft, end: e.target.value })}
                className={input}
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 pb-3 text-xs font-semibold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
                Active on Offers Page
              </label>
            </div>

            <div className="md:col-span-3">
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Terms & Conditions Description
              </label>
              <textarea
                rows={3}
                placeholder="Details of the offer, minimum order threshold, and redemption steps…"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                className={input}
              />
            </div>

            <div className="flex items-center justify-between gap-4 md:col-span-3 border-t border-border/80 pt-5">
              {draft.banner && (
                <img
                  src={draft.banner}
                  alt="Offer preview"
                  className="h-14 w-28 rounded-xl border border-border object-cover"
                />
              )}
              <div className="ml-auto flex gap-2">
                <button className={btnGhost} onClick={() => setDraft(null)}>
                  Cancel
                </button>
                <button className={btn} onClick={save}>
                  Save Privilege
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offers Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {offers.map((o) => (
          <div
            key={o.id}
            className={`${card} relative flex flex-col justify-between border-gold-300/40 bg-gradient-to-br from-card via-blush/20 to-card shadow-soft`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-gold-400/20 border border-gold-400/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  {o.discount}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    o.active ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {o.active ? "Live" : "Paused"}
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl text-primary">{o.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{o.description}</p>
            </div>

            <div className="mt-6 border-t border-border/80 pt-4">
              <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Validity:</span>
                <span className="font-medium text-foreground">
                  {o.start} → {o.end || "Ongoing"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setViewOffer(o)}
                    className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setDraft(o)}
                    className="rounded-lg border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(o.id)}
                    className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <button
                  onClick={() =>
                    update(
                      "offers",
                      offers.map((x) => (x.id === o.id ? { ...x, active: !x.active } : x)),
                    )
                  }
                  className="text-[11px] text-muted-foreground hover:text-foreground"
                >
                  {o.active ? "Pause" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* VIEW OFFER MODAL */}
      {viewOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Privilege Voucher</span>
                <h3 className="font-serif text-2xl font-semibold text-foreground">{viewOffer.title}</h3>
              </div>
              <button
                onClick={() => setViewOffer(null)}
                className="text-muted-foreground hover:text-foreground p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl border border-gold-400/40 bg-gradient-to-br from-gold-50/50 to-amber-50/40 p-4 text-center">
              <span className="inline-block rounded-full bg-gold-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                {viewOffer.discount}
              </span>
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                Validity: {viewOffer.start} → {viewOffer.end || "Ongoing"}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-muted-foreground font-semibold block">Terms &amp; Details:</span>
              <p className="rounded-xl bg-muted/30 p-3.5 text-foreground leading-relaxed">
                {viewOffer.description}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
              <button
                onClick={() => {
                  const o = viewOffer;
                  setViewOffer(null);
                  setDraft(o);
                }}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-lift"
              >
                Edit Offer
              </button>
              <button
                onClick={() => setViewOffer(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

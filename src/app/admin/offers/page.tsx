"use client";

import { useState } from "react";
import AdminShell, { btn, btnGhost, card, input } from "@/components/admin/AdminShell";
import type { Offer } from "@/data/catalog";
import { useStore } from "@/lib/store";

type OfferDraft = Offer & { banner?: string };

export default function AdminOffersPage() {
  const { offers, update } = useStore();
  const [draft, setDraft] = useState<OfferDraft | null>(null);

  const save = () => {
    if (!draft) return;
    const exists = offers.some((o) => o.id === draft.id);
    update("offers", exists ? offers.map((o) => (o.id === draft.id ? draft : o)) : [draft, ...offers]);
    setDraft(null);
  };

  const onImage = (file: File | undefined) => {
    if (!file || !draft) return;
    const reader = new FileReader();
    reader.onload = () => setDraft({ ...draft, banner: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <AdminShell title="Offers" subtitle={`${offers.length} offers configured.`}>
      <button
        className={`${btn} mb-6`}
        onClick={() =>
          setDraft({
            id: Math.max(0, ...offers.map((o) => o.id)) + 1,
            title: "",
            discount: "",
            description: "",
            start: "",
            end: "",
            active: true,
          })
        }
      >
        Create Offer
      </button>

      {draft && (
        <div className={`${card} mb-6 grid gap-4 md:grid-cols-3`}>
          <input placeholder="Offer title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className={input} />
          <input placeholder="Discount (e.g. 30% OFF)" value={draft.discount} onChange={(e) => setDraft({ ...draft, discount: e.target.value })} className={input} />
          <input type="file" accept="image/*" onChange={(e) => onImage(e.target.files?.[0])} className={input} />
          <input type="date" value={draft.start} onChange={(e) => setDraft({ ...draft, start: e.target.value })} className={input} />
          <input type="date" value={draft.end} onChange={(e) => setDraft({ ...draft, end: e.target.value })} className={input} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} className="accent-primary" />
            Active
          </label>
          <div className="md:col-span-3">
            <textarea
              rows={3}
              placeholder="Description"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className={input}
            />
          </div>
          <div className="flex items-center gap-4 md:col-span-3">
            {draft.banner && <img src={draft.banner} alt="Offer banner preview" className="h-16 w-28 rounded-lg object-cover" />}
            <div className="ml-auto flex gap-2">
              <button className={btnGhost} onClick={() => setDraft(null)}>
                Cancel
              </button>
              <button className={btn} onClick={save}>
                Save Offer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {offers.map((o) => (
          <div key={o.id} className={card}>
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-blush px-3 py-1 text-xs uppercase tracking-widest text-primary">
                {o.discount}
              </span>
              <span className="text-xs text-muted-foreground">{o.active ? "Live" : "Paused"}</span>
            </div>
            <h3 className="mt-3 font-display text-xl text-primary">{o.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{o.description}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {o.start} → {o.end}
            </p>
            <div className="mt-4 flex gap-3 text-xs">
              <button onClick={() => setDraft(o)} className="text-primary hover:underline">
                Edit
              </button>
              <button
                onClick={() => update("offers", offers.map((x) => (x.id === o.id ? { ...x, active: !x.active } : x)))}
                className="text-muted-foreground hover:underline"
              >
                {o.active ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => update("offers", offers.filter((x) => x.id !== o.id))}
                className="text-destructive hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

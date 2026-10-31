"use client";

import { useState } from "react";
import AdminShell, { btn, btnGhost, card, input } from "@/components/admin/AdminShell";
import type { Banner } from "@/data/catalog";
import { useStore } from "@/lib/store";

export default function AdminBannersPage() {
  const { banners, update } = useStore();
  const [draft, setDraft] = useState<Banner | null>(null);

  const save = () => {
    if (!draft) return;
    const exists = banners.some((b) => b.id === draft.id);
    update("banners", exists ? banners.map((b) => (b.id === draft.id ? draft : b)) : [...banners, draft]);
    setDraft(null);
  };

  const onImage = (file: File | undefined) => {
    if (!file || !draft) return;
    const reader = new FileReader();
    reader.onload = () => setDraft({ ...draft, image: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <AdminShell title="Hero Banners" subtitle="Only active banners appear on the homepage slider.">
      <button
        className={`${btn} mb-6`}
        onClick={() =>
          setDraft({
            id: Math.max(0, ...banners.map((b) => b.id)) + 1,
            title: "",
            subtitle: "",
            cta: "Shop Now",
            link: "/shop",
            image: "",
            active: true,
          })
        }
      >
        Add Banner
      </button>

      {draft && (
        <div className={`${card} mb-6 grid gap-4 md:grid-cols-2`}>
          <input placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className={input} />
          <input placeholder="Subtitle" value={draft.subtitle} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} className={input} />
          <input placeholder="CTA label" value={draft.cta} onChange={(e) => setDraft({ ...draft, cta: e.target.value })} className={input} />
          <select value={draft.link} onChange={(e) => setDraft({ ...draft, link: e.target.value })} className={input}>
            <option value="/shop">/shop</option>
            <option value="/rental">/rental</option>
            <option value="/readymade">/readymade</option>
            <option value="/offers">/offers</option>
            <option value="/categories">/categories</option>
          </select>
          <input type="file" accept="image/*" onChange={(e) => onImage(e.target.files?.[0])} className={input} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} className="accent-primary" />
            Active
          </label>
          <div className="flex items-center gap-4 md:col-span-2">
            {draft.image && <img src={draft.image} alt="Banner preview" className="h-20 w-36 rounded-lg object-cover" />}
            <div className="ml-auto flex gap-2">
              <button className={btnGhost} onClick={() => setDraft(null)}>
                Cancel
              </button>
              <button className={btn} onClick={save}>
                Save Banner
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {banners.map((b) => (
          <div key={b.id} className={`${card} flex flex-col gap-4 sm:flex-row sm:items-center`}>
            {b.image && <img src={b.image} alt={b.title} className="h-24 w-full rounded-xl object-cover sm:w-40" />}
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg text-primary">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.subtitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                CTA: {b.cta} → {b.link}
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <button onClick={() => setDraft(b)} className="text-primary hover:underline">
                Edit
              </button>
              <button
                onClick={() => update("banners", banners.map((x) => (x.id === b.id ? { ...x, active: !x.active } : x)))}
                className="text-muted-foreground hover:underline"
              >
                {b.active ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => update("banners", banners.filter((x) => x.id !== b.id))}
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

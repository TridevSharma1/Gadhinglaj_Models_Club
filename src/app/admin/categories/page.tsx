"use client";

import { useState } from "react";
import AdminShell, { btn, btnGhost, card, input } from "@/components/admin/AdminShell";
import type { Category } from "@/data/catalog";
import { useStore } from "@/lib/store";

export default function AdminCategoriesPage() {
  const { categories, update } = useStore();
  const [draft, setDraft] = useState<Category | null>(null);

  const save = () => {
    if (!draft) return;
    const exists = categories.some((c) => c.id === draft.id);
    update(
      "categories",
      exists ? categories.map((c) => (c.id === draft.id ? draft : c)) : [...categories, draft],
    );
    setDraft(null);
  };

  const onImage = (file: File | undefined) => {
    if (!file || !draft) return;
    const reader = new FileReader();
    reader.onload = () => setDraft({ ...draft, image: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <AdminShell title="Categories" subtitle={`${categories.length} categories.`}>
      <button
        className={`${btn} mb-6`}
        onClick={() =>
          setDraft({
            id: Math.max(0, ...categories.map((c) => c.id)) + 1,
            name: "",
            image: "",
            blurb: "",
            active: true,
          })
        }
      >
        Add Category
      </button>

      {draft && (
        <div className={`${card} mb-6 grid gap-4 md:grid-cols-3`}>
          <input placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={input} />
          <input placeholder="Blurb" value={draft.blurb} onChange={(e) => setDraft({ ...draft, blurb: e.target.value })} className={input} />
          <input type="file" accept="image/*" onChange={(e) => onImage(e.target.files?.[0])} className={input} />
          <div className="flex items-center gap-4 md:col-span-3">
            {draft.image && <img src={draft.image} alt="Preview" className="h-16 w-20 rounded-lg object-cover" />}
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                className="accent-primary"
              />
              Active
            </label>
            <div className="ml-auto flex gap-2">
              <button className={btnGhost} onClick={() => setDraft(null)}>
                Cancel
              </button>
              <button className={btn} onClick={save}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <div key={c.id} className={card}>
            {c.image && <img src={c.image} alt={c.name} className="h-36 w-full rounded-xl object-cover" />}
            <h3 className="mt-3 font-display text-lg text-primary">{c.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{c.blurb}</p>
            <div className="mt-4 flex items-center gap-3 text-xs">
              <button onClick={() => setDraft(c)} className="text-primary hover:underline">
                Edit
              </button>
              <button
                onClick={() =>
                  update("categories", categories.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)))
                }
                className="text-muted-foreground hover:underline"
              >
                {c.active ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => update("categories", categories.filter((x) => x.id !== c.id))}
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

"use client";

import { useMemo, useState } from "react";
import AdminShell, { btn, btnGhost, card, input } from "@/components/admin/AdminShell";
import { inr, type Product } from "@/data/catalog";
import { useStore } from "@/lib/store";

const blank = (id: number): Product => ({
  id,
  name: "",
  category: "Designer Gowns",
  type: "readymade",
  price: 0,
  mrp: 0,
  rentalPrice: 0,
  deposit: 0,
  rentalDuration: "3 days (extendable)",
  rating: 4.5,
  reviews: 0,
  sizes: ["S", "M", "L"],
  color: "",
  fabric: "",
  occasion: "",
  stock: 1,
  featured: false,
  newArrival: true,
  active: true,
  available: true,
  image: "",
  description: "",
});

export default function AdminProductsPage() {
  const { products, categories, update } = useStore();
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [cat, setCat] = useState("All");
  const [draft, setDraft] = useState<Product | null>(null);

  const list = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) &&
          (type === "All" || p.type === type) &&
          (cat === "All" || p.category === cat),
      ),
    [products, q, type, cat],
  );

  const save = () => {
    if (!draft) return;
    const exists = products.some((p) => p.id === draft.id);
    update(
      "products",
      exists ? products.map((p) => (p.id === draft.id ? draft : p)) : [draft, ...products],
    );
    setDraft(null);
  };

  const patch = (id: number, changes: Partial<Product>) =>
    update("products", products.map((p) => (p.id === id ? { ...p, ...changes } : p)));

  const remove = (id: number) => update("products", products.filter((p) => p.id !== id));

  const onImage = (file: File | undefined) => {
    if (!file || !draft) return;
    const reader = new FileReader();
    reader.onload = () => setDraft({ ...draft, image: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <AdminShell title="Products" subtitle={`${products.length} products in the catalogue.`}>
      <div className={`${card} mb-6 flex flex-wrap items-end gap-3`}>
        <div className="min-w-48 flex-1">
          <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
            Search
          </label>
          <input value={q} onChange={(e) => setQ(e.target.value)} className={input} placeholder="Product name" />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={input}>
            <option>All</option>
            <option value="readymade">Ready-Made</option>
            <option value="rental">Rental</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Category</label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className={input}>
            <option>All</option>
            {categories.map((c) => (
              <option key={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <button
          className={btn}
          onClick={() => setDraft(blank(Math.max(0, ...products.map((p) => p.id)) + 1))}
        >
          Add Product
        </button>
      </div>

      {draft && (
        <div className={`${card} mb-6`}>
          <h2 className="font-display text-xl text-primary">
            {products.some((p) => p.id === draft.id) ? "Edit" : "New"} Product
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Field label="Name">
              <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={input} />
            </Field>
            <Field label="Category">
              <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className={input}>
                {categories.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Type">
              <select
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value as Product["type"] })}
                className={input}
              >
                <option value="readymade">Ready-Made</option>
                <option value="rental">Rental</option>
              </select>
            </Field>
            <Field label="Price">
              <input type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} className={input} />
            </Field>
            <Field label="MRP">
              <input type="number" value={draft.mrp} onChange={(e) => setDraft({ ...draft, mrp: Number(e.target.value) })} className={input} />
            </Field>
            <Field label="Rental Price">
              <input
                type="number"
                value={draft.rentalPrice}
                onChange={(e) =>
                  setDraft({ ...draft, rentalPrice: Number(e.target.value), deposit: Number(e.target.value) * 2 })
                }
                className={input}
              />
            </Field>
            <Field label="Stock">
              <input type="number" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} className={input} />
            </Field>
            <Field label="Sizes (comma separated)">
              <input
                value={draft.sizes.join(", ")}
                onChange={(e) => setDraft({ ...draft, sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                className={input}
              />
            </Field>
            <Field label="Colour">
              <input value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value })} className={input} />
            </Field>
            <Field label="Fabric">
              <input value={draft.fabric} onChange={(e) => setDraft({ ...draft, fabric: e.target.value })} className={input} />
            </Field>
            <Field label="Occasion">
              <input value={draft.occasion} onChange={(e) => setDraft({ ...draft, occasion: e.target.value })} className={input} />
            </Field>
            <Field label="Image">
              <input type="file" accept="image/*" onChange={(e) => onImage(e.target.files?.[0])} className={input} />
            </Field>
            <div className="md:col-span-3">
              <Field label="Description">
                <textarea
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  className={input}
                />
              </Field>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {draft.image && <img src={draft.image} alt="Preview" className="h-20 w-16 rounded-lg object-cover" />}
            <Toggle label="Featured" on={draft.featured} onChange={(v) => setDraft({ ...draft, featured: v })} />
            <Toggle label="New Arrival" on={draft.newArrival} onChange={(v) => setDraft({ ...draft, newArrival: v })} />
            <Toggle label="Active" on={draft.active} onChange={(v) => setDraft({ ...draft, active: v })} />
            <div className="ml-auto flex gap-2">
              <button className={btnGhost} onClick={() => setDraft(null)}>
                Cancel
              </button>
              <button className={btn} onClick={save}>
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`${card} overflow-x-auto p-0`}>
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.image && <img src={p.image} alt={p.name} className="h-12 w-10 rounded object-cover" />}
                    <span className="text-foreground">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.type === "rental" ? "Rental" : "Ready-Made"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.type === "rental" ? inr(p.rentalPrice) : inr(p.price)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5 text-[10px] uppercase tracking-widest">
                    <button
                      onClick={() => patch(p.id, { featured: !p.featured })}
                      className={`rounded-full px-2 py-1 ${p.featured ? "bg-blush text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      Featured
                    </button>
                    <button
                      onClick={() => patch(p.id, { newArrival: !p.newArrival })}
                      className={`rounded-full px-2 py-1 ${p.newArrival ? "bg-blush text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      New
                    </button>
                    <button
                      onClick={() => patch(p.id, { active: !p.active })}
                      className={`rounded-full px-2 py-1 ${p.active ? "bg-blush text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      {p.active ? "Active" : "Hidden"}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 text-xs">
                    <button onClick={() => setDraft(p)} className="text-primary hover:underline">
                      Edit
                    </button>
                    <button onClick={() => remove(p.id)} className="text-destructive hover:underline">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">No products match these filters.</p>
        )}
      </div>
    </AdminShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} className="accent-primary" />
      {label}
    </label>
  );
}

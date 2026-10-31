"use client";

import { useState } from "react";
import Link from "next/link";
import AdminShell, { card, input, btn, btnGhost } from "@/components/admin/AdminShell";
import { inr, type Product } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { SparkleIcon } from "@/components/site/Icons";

export default function AdminLowStockPage() {
  const { products, update } = useStore();
  const [q, setQ] = useState("");
  const [threshold, setThreshold] = useState<number>(3);
  const [catFilter, setCatFilter] = useState("All");
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const lowStockProducts = products.filter(
    (p) =>
      p.stock <= threshold &&
      (catFilter === "All" || p.category === catFilter) &&
      p.name.toLowerCase().includes(q.toLowerCase()),
  );

  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const criticalCount = products.filter((p) => p.stock > 0 && p.stock <= 2).length;

  const quickRestock = (productId: number, addQty: number) => {
    update(
      "products",
      products.map((p) => (p.id === productId ? { ...p, stock: p.stock + addQty } : p)),
    );
  };

  const setExactStock = (productId: number, newStock: number) => {
    update(
      "products",
      products.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p)),
    );
  };

  const removeProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product from the catalog?")) {
      update(
        "products",
        products.filter((p) => p.id !== id),
      );
    }
  };

  return (
    <AdminShell
      title="Low Stock & Inventory Alerts"
      subtitle="Track atelier items nearing exhaustion and replenish bridal & rental supplies."
    >
      {/* Metric Cards */}
      <div className="grid gap-5 sm:grid-cols-3 mb-8">
        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Critical Low Stock (≤ 2 Units)
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
              ⚠️
            </span>
          </div>
          <p className="mt-2 font-display text-3xl text-amber-700">{criticalCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">High risk of customer checkout failure</p>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Completely Out of Stock
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-800 font-bold text-xs">
              ✕
            </span>
          </div>
          <p className="mt-2 font-display text-3xl text-rose-700">{outOfStockCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Items hidden or disabled on storefront</p>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Total Monitored Items
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blush text-primary font-bold text-xs">
              📦
            </span>
          </div>
          <p className="mt-2 font-display text-3xl text-primary">{lowStockProducts.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Matching threshold of ≤ {threshold} units
          </p>
        </div>
      </div>

      {/* Filter and Threshold Controls */}
      <div className={`${card} mb-8 flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search low stock outfits…"
            className={`${input} w-72`}
          />

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Threshold:
            </span>
            {[2, 3, 5].map((t) => (
              <button
                key={t}
                onClick={() => setThreshold(t)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  threshold === t
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                ≤ {t} units
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Table */}
      <div className={`${card} overflow-hidden p-0`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="border-b border-border/80 bg-muted/40 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Outfit Details</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Acquisition Type</th>
                <th className="px-5 py-4">Current Stock</th>
                <th className="px-5 py-4">Price / Rental</th>
                <th className="px-5 py-4 text-right">Quick Restock Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {lowStockProducts.map((p) => {
                const isOutOfStock = p.stock === 0;
                return (
                  <tr key={p.id} className="transition-colors hover:bg-muted/20">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-14 w-12 rounded-xl border border-border object-cover shadow-xs shrink-0"
                          />
                        ) : (
                          <div className="flex h-14 w-12 items-center justify-center rounded-xl bg-muted text-xs text-muted-foreground shrink-0">
                            No Pic
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-foreground block truncate">{p.name}</span>
                          <span className="text-[11px] text-muted-foreground block truncate">
                            Sizes: [{p.sizes.join(", ")}] · {p.color}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs text-muted-foreground">{p.category}</td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          p.type === "rental"
                            ? "bg-purple-100 text-purple-900 border border-purple-200"
                            : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                        }`}
                      >
                        {p.type === "rental" ? "Rental Studio" : "Ready-Made"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                          isOutOfStock
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : p.stock <= 2
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-yellow-50 text-yellow-800 border border-yellow-200"
                        }`}
                      >
                        <span>{isOutOfStock ? "Out of Stock" : `${p.stock} units left`}</span>
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-primary">
                        {p.type === "rental" ? inr(p.rentalPrice) : inr(p.price)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setViewProduct(p)}
                            className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setEditProduct(p)}
                            className="rounded-lg border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeProduct(p.id)}
                            className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                          >
                            Delete
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 pt-1 border-t border-border/50">
                          <button
                            onClick={() => quickRestock(p.id, 5)}
                            className="rounded-lg border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-primary hover:bg-blush hover:border-gold-300 transition-colors"
                            title="Quick replenish +5 units"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => quickRestock(p.id, 10)}
                            className="rounded-lg border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-primary hover:bg-blush hover:border-gold-300 transition-colors"
                            title="Quick replenish +10 units"
                          >
                            +10
                          </button>
                          <input
                            type="number"
                            min="0"
                            defaultValue={p.stock}
                            key={p.stock}
                            onBlur={(e) => setExactStock(p.id, Number(e.target.value))}
                            className="w-14 rounded-lg border border-border bg-background px-1.5 py-0.5 text-center text-xs font-medium text-foreground outline-none focus:border-gold-400"
                            title="Type exact stock and press Tab or click outside"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!lowStockProducts.length && (
          <div className="py-14 text-center text-sm text-muted-foreground">
            ✓ All atelier inventory levels are healthy (no products at or below {threshold} units).
          </div>
        )}
      </div>

      {/* Product View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-lift border border-gold-300/40">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <SparkleIcon className="h-5 w-5 text-gold-400" />
                <h3 className="font-display text-xl text-primary">Low Stock Outfit Inspection</h3>
              </div>
              <button
                onClick={() => setViewProduct(null)}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex gap-4">
                <img
                  src={viewProduct.image}
                  alt={viewProduct.name}
                  className="h-28 w-24 rounded-2xl object-cover border border-border shrink-0 shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <span className="rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {viewProduct.stock === 0 ? "Out of Stock" : `${viewProduct.stock} Units Remaining`}
                  </span>
                  <h4 className="font-display text-lg text-primary mt-1.5 truncate">{viewProduct.name}</h4>
                  <p className="text-xs text-muted-foreground">Category: {viewProduct.category} {viewProduct.subcategory ? `· ${viewProduct.subcategory}` : ""}</p>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {viewProduct.type === "rental" ? `Rental: ${inr(viewProduct.rentalPrice)}` : `Price: ${inr(viewProduct.price)}`}
                  </p>
                  {viewProduct.barcode && (
                    <p className="text-[11px] font-mono text-muted-foreground mt-1">Barcode: {viewProduct.barcode}</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/30 p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available Sizes:</span>
                  <span className="font-semibold text-foreground">[{viewProduct.sizes.join(", ")}]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Primary Color:</span>
                  <span className="font-semibold text-foreground">{viewProduct.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-semibold text-foreground uppercase">{viewProduct.type}</span>
                </div>
              </div>

              {viewProduct.colors && viewProduct.colors.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">Color-wise Breakdown:</span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {viewProduct.colors.map((c, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-white border border-border/80 px-2.5 py-1 text-xs">
                        <span className="font-semibold text-foreground">{c.name || "Default"}: <strong className="text-primary">{c.stock} units</strong></span>
                        {c.sizeStocks && c.sizeStocks.length > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            {c.sizeStocks.map((s) => `${s.size}:${s.stock}`).join(" ")}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border/80 pt-4">
              <Link
                href={`/product/${viewProduct.id}`}
                target="_blank"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>Storefront View ↗</span>
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const p = viewProduct;
                    setViewProduct(null);
                    setEditProduct(p);
                  }}
                  className="rounded-xl border border-primary/40 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  Edit Stock
                </button>
                <button
                  onClick={() => setViewProduct(null)}
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Quick Edit Stock Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lift border border-gold-300/40">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <SparkleIcon className="h-5 w-5 text-gold-400" />
                <h3 className="font-display text-xl text-primary">Replenish Inventory</h3>
              </div>
              <button
                onClick={() => setEditProduct(null)}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-foreground">{editProduct.name}</h4>
                <p className="text-xs text-muted-foreground">Current total stock: {editProduct.stock} units</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Update Total Available Stock (Units)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditProduct({ ...editProduct, stock: Math.max(0, editProduct.stock - 1) })}
                    className="h-10 w-10 rounded-xl border border-border bg-muted flex items-center justify-center text-lg font-bold hover:bg-blush"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={editProduct.stock}
                    onChange={(e) => setEditProduct({ ...editProduct, stock: Math.max(0, Number(e.target.value)) })}
                    className="flex-1 rounded-xl border border-border/80 bg-background/50 px-3.5 py-2 text-center text-lg font-bold text-foreground focus:border-gold-400 outline-none"
                  />
                  <button
                    onClick={() => setEditProduct({ ...editProduct, stock: editProduct.stock + 1 })}
                    className="h-10 w-10 rounded-xl border border-border bg-muted flex items-center justify-center text-lg font-bold hover:bg-blush"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditProduct({ ...editProduct, stock: editProduct.stock + 5 })}
                  className="flex-1 rounded-xl border border-border bg-muted/40 py-2 text-xs font-semibold text-primary hover:bg-blush"
                >
                  +5 Units
                </button>
                <button
                  type="button"
                  onClick={() => setEditProduct({ ...editProduct, stock: editProduct.stock + 10 })}
                  className="flex-1 rounded-xl border border-border bg-muted/40 py-2 text-xs font-semibold text-primary hover:bg-blush"
                >
                  +10 Units
                </button>
                <button
                  type="button"
                  onClick={() => setEditProduct({ ...editProduct, stock: editProduct.stock + 25 })}
                  className="flex-1 rounded-xl border border-border bg-muted/40 py-2 text-xs font-semibold text-primary hover:bg-blush"
                >
                  +25 Units
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-border/80 pt-4">
              <button
                onClick={() => setEditProduct(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  update(
                    "products",
                    products.map((p) => (p.id === editProduct.id ? editProduct : p)),
                  );
                  setEditProduct(null);
                }}
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-lift"
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

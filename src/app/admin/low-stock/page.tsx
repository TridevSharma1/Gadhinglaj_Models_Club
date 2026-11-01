"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdminShell, { card, input, btn, btnGhost } from "@/components/admin/AdminShell";
import { inr, type Product, type ProductColorVariant } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { SparkleIcon } from "@/components/site/Icons";
import {
  analyzeProductStock,
  updateProductStockDetails,
  type ProductStockAnalysis,
  type SizeStockInfo,
} from "@/lib/stock-utils";
import {
  AlertTriangle,
  Package,
  Layers,
  Search,
  Filter,
  CheckCircle,
  RefreshCw,
  Plus,
  Minus,
  ExternalLink,
  ChevronDown,
  Info,
} from "lucide-react";

type FilterMode = "all" | "product" | "size" | "out_of_stock";

export default function AdminLowStockPage() {
  const { products, categories, update, saveProduct, deleteProduct } = useStore();
  const [q, setQ] = useState("");
  const [threshold, setThreshold] = useState<number>(3);
  const [catFilter, setCatFilter] = useState("All");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>("All");

  const [viewAnalysis, setViewAnalysis] = useState<ProductStockAnalysis | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editColorIdx, setEditColorIdx] = useState<number>(0);
  const [editSizeDrafts, setEditSizeDrafts] = useState<{ [size: string]: number }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [restockNotice, setRestockNotice] = useState<string | null>(null);

  // Analyze all products with current threshold
  const analyzedProducts = useMemo(() => {
    return products.map((p) => analyzeProductStock(p, threshold));
  }, [products, threshold]);

  // Distinct sizes available across the entire catalog for filtering
  const allAvailableSizes = useMemo(() => {
    const set = new Set<string>();
    analyzedProducts.forEach((item) => {
      item.sizeStocks.forEach((s) => set.add(s.size));
    });
    return Array.from(set).sort();
  }, [analyzedProducts]);

  // Distinct categories from products
  const categoryList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  // Filtering based on search query, category, filterMode, and specific size
  const filteredAnalyses = useMemo(() => {
    return analyzedProducts.filter((item) => {
      const p = item.product;

      // Category filter
      if (catFilter !== "All" && p.category !== catFilter) {
        return false;
      }

      // Search query (matches name, category, subcategory, sku, barcode, color, or sizes)
      if (q.trim()) {
        const query = q.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchCat = (p.category || "").toLowerCase().includes(query);
        const matchSub = (p.subcategory || "").toLowerCase().includes(query);
        const matchSku = (p.sku || "").toLowerCase().includes(query);
        const matchBarcode = (p.barcode || "").toLowerCase().includes(query);
        const matchColor = (p.color || "").toLowerCase().includes(query);
        const matchSize = item.sizeStocks.some((s) => s.size.toLowerCase().includes(query));

        if (!matchName && !matchCat && !matchSub && !matchSku && !matchBarcode && !matchColor && !matchSize) {
          return false;
        }
      }

      // Specific size filter (if user wants to see only outfits low in e.g. "M")
      if (selectedSizeFilter !== "All") {
        const sizeObj = item.sizeStocks.find((s) => s.size === selectedSizeFilter);
        if (!sizeObj || sizeObj.stock > threshold) {
          return false;
        }
      }

      // Filter Mode condition
      switch (filterMode) {
        case "product":
          // Low in total product quantity
          return item.isProductLow || item.isProductOutOfStock;
        case "size":
          // Low in at least one size quantity
          return item.hasLowSizes || item.hasOutOfStockSizes;
        case "out_of_stock":
          // Completely depleted either at product level or any size level
          return item.isProductOutOfStock || item.hasOutOfStockSizes;
        case "all":
        default:
          // Low either by total product quantity OR any size quantity
          return (
            item.isProductLow ||
            item.isProductOutOfStock ||
            item.hasLowSizes ||
            item.hasOutOfStockSizes
          );
      }
    });
  }, [analyzedProducts, q, catFilter, filterMode, selectedSizeFilter, threshold]);

  // Overall catalog metrics
  const criticalCount = useMemo(() => {
    return analyzedProducts.filter((item) => item.isCritical).length;
  }, [analyzedProducts]);

  const totalOutOfStockProducts = useMemo(() => {
    return analyzedProducts.filter((item) => item.isProductOutOfStock).length;
  }, [analyzedProducts]);

  const depletedSizesCount = useMemo(() => {
    return analyzedProducts.reduce((acc, item) => acc + item.outOfStockSizes.length, 0);
  }, [analyzedProducts]);

  const lowSizesCount = useMemo(() => {
    return analyzedProducts.reduce((acc, item) => acc + item.lowSizes.length, 0);
  }, [analyzedProducts]);

  const showTemporaryNotice = (msg: string) => {
    setRestockNotice(msg);
    setTimeout(() => setRestockNotice(null), 4000);
  };

  // Quick Restock an entire product's total stock
  const quickRestockProduct = async (p: Product, addQty: number) => {
    const analysis = analyzeProductStock(p, threshold);
    const updatedSizeDrafts: { [size: string]: number } = {};

    if (analysis.sizeStocks.length > 0) {
      // Distribute evenly among all sizes, prioritizing depleted sizes
      const evenAdd = Math.floor(addQty / analysis.sizeStocks.length);
      const rem = addQty % analysis.sizeStocks.length;

      analysis.sizeStocks.forEach((s, idx) => {
        updatedSizeDrafts[s.size] = s.stock + evenAdd + (idx === 0 ? rem : 0);
      });
    } else {
      updatedSizeDrafts["Standard"] = p.stock + addQty;
    }

    const updatedProduct = updateProductStockDetails(p, updatedSizeDrafts, 0);

    // Optimistic update
    update(
      "products",
      products.map((item) => (item.id === p.id ? updatedProduct : item))
    );

    try {
      await saveProduct(updatedProduct);
      showTemporaryNotice(`Added +${addQty} units to "${p.name}". Stock updated.`);
    } catch (err: any) {
      console.error("Failed to save quick restock:", err);
      showTemporaryNotice(`Error saving restock: ${err.message || "Failed to persist"}`);
    }
  };

  // Quick Restock a specific size of a product directly
  const quickRestockSize = async (p: Product, sizeName: string, addQty: number) => {
    const analysis = analyzeProductStock(p, threshold);
    const updatedSizeDrafts: { [size: string]: number } = {};

    analysis.sizeStocks.forEach((s) => {
      updatedSizeDrafts[s.size] = s.size === sizeName ? s.stock + addQty : s.stock;
    });

    const updatedProduct = updateProductStockDetails(p, updatedSizeDrafts, 0);

    update(
      "products",
      products.map((item) => (item.id === p.id ? updatedProduct : item))
    );

    try {
      await saveProduct(updatedProduct);
      showTemporaryNotice(`Added +${addQty} units to Size "${sizeName}" of "${p.name}".`);
    } catch (err: any) {
      console.error("Failed to save size restock:", err);
      showTemporaryNotice(`Error saving size restock: ${err.message || "Failed to persist"}`);
    }
  };

  // Delete product action
  const handleRemoveProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product from the catalog? This will delete it permanently.")) {
      try {
        await deleteProduct(id);
        showTemporaryNotice("Product deleted from catalog.");
      } catch (err: any) {
        // Fallback store update
        update(
          "products",
          products.filter((p) => p.id !== id)
        );
        showTemporaryNotice("Product deleted.");
      }
    }
  };

  // Open Edit Stock Modal for a product
  const openEditModal = (p: Product) => {
    setEditProduct(p);
    setEditColorIdx(0);

    const analysis = analyzeProductStock(p, threshold);
    const initialDrafts: { [size: string]: number } = {};

    if (analysis.sizeStocks.length > 0) {
      analysis.sizeStocks.forEach((s) => {
        initialDrafts[s.size] = s.stock;
      });
    } else {
      initialDrafts["Standard"] = p.stock;
    }

    setEditSizeDrafts(initialDrafts);
  };

  // Save changes from Edit Stock Modal
  const handleSaveEditStock = async () => {
    if (!editProduct) return;
    setIsSaving(true);

    try {
      const updatedProduct = updateProductStockDetails(
        editProduct,
        editSizeDrafts,
        editColorIdx
      );

      // Local state optimistic update
      update(
        "products",
        products.map((item) => (item.id === editProduct.id ? updatedProduct : item))
      );

      // Backend persist to MongoDB
      await saveProduct(updatedProduct);

      showTemporaryNotice(`Successfully updated inventory for "${editProduct.name}".`);
      setEditProduct(null);
    } catch (err: any) {
      console.error("Save stock error:", err);
      alert(`Failed to save inventory: ${err.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate dynamic total quantity in Edit Modal
  const editModalTotalStock = useMemo(() => {
    return Object.values(editSizeDrafts).reduce((sum, val) => sum + Math.max(0, Number(val) || 0), 0);
  }, [editSizeDrafts]);

  return (
    <AdminShell
      title="Low Stock & Inventory Alerts"
      subtitle="Track atelier outfits and individual sizes nearing exhaustion. Replenish inventory according to size and product quantity."
    >
      {/* Toast Notice */}
      {restockNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-foreground px-5 py-3.5 text-xs font-semibold text-background shadow-2xl animate-fade-in border border-gold-400/30">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{restockNotice}</span>
          <button
            onClick={() => setRestockNotice(null)}
            className="ml-2 text-muted-foreground hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Critical Low Stock */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Critical Low Stock (≤ 2)
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
              ⚠️
            </span>
          </div>
          <p className="mt-2 font-display text-3xl text-amber-700">{criticalCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Outfits with product or size stock at high exhaustion risk
          </p>
        </div>

        {/* Depleted / Out of Stock Sizes */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Depleted Size Variants
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-800 font-bold text-xs">
              <Layers className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-3xl text-rose-700">{depletedSizesCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Sizes completely at 0 units across atelier outfits
          </p>
        </div>

        {/* Low Sizes Needing Replenishment */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Low Sizes (≤ {threshold})
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-800 font-bold text-xs">
              <Package className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-3xl text-yellow-800">{lowSizesCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Specific size units needing replenishment soon
          </p>
        </div>

        {/* Total Monitored Items */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Flagged Outfits
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blush text-primary font-bold text-xs">
              📋
            </span>
          </div>
          <p className="mt-2 font-display text-3xl text-primary">{filteredAnalyses.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Filtered by size & product stock thresholds
          </p>
        </div>
      </div>

      {/* Filter and Threshold Controls */}
      <div className={`${card} mb-8 space-y-4`}>
        {/* Top Filter Row: Search & Category */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by outfit name, size, category, SKU…"
                className={`${input} pl-9`}
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category:
              </span>
              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                className="rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-gold-400"
              >
                {categoryList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Threshold Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Threshold:
            </span>
            {[1, 2, 3, 5].map((t) => (
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

        {/* Bottom Filter Row: Mode Tabs & Size Specific Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4">
          {/* Mode Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">
              View By:
            </span>
            <button
              onClick={() => setFilterMode("all")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterMode === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              All Low Stock
            </button>
            <button
              onClick={() => setFilterMode("product")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterMode === "product"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              Low Product Total (≤ {threshold})
            </button>
            <button
              onClick={() => setFilterMode("size")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterMode === "size"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              Low by Size Quantity
            </button>
            <button
              onClick={() => setFilterMode("out_of_stock")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterMode === "out_of_stock"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              Out of Stock Only (0 Qty)
            </button>
          </div>

          {/* Filter by Specific Size */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Filter by Size:
            </span>
            <select
              value={selectedSizeFilter}
              onChange={(e) => setSelectedSizeFilter(e.target.value)}
              className="rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none focus:border-gold-400"
            >
              <option value="All">All Sizes</option>
              {allAvailableSizes.map((sz) => (
                <option key={sz} value={sz}>
                  Size {sz}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Low Stock Table */}
      <div className={`${card} overflow-hidden p-0 shadow-soft`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="border-b border-border/80 bg-muted/40 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Outfit Details</th>
                <th className="px-5 py-4">Product Quantity</th>
                <th className="px-5 py-4">Stock According to Size</th>
                <th className="px-5 py-4">Health & Diagnosis</th>
                <th className="px-5 py-4 text-right">Quick Restock & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredAnalyses.map((item) => {
                const p = item.product;
                const isOutOfStock = item.isProductOutOfStock;

                return (
                  <tr key={p.id} className="transition-colors hover:bg-muted/20">
                    {/* Outfit Details */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3.5">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-16 w-14 rounded-xl border border-border object-cover shadow-xs shrink-0"
                          />
                        ) : (
                          <div className="flex h-16 w-14 items-center justify-center rounded-xl bg-muted text-xs text-muted-foreground shrink-0">
                            No Pic
                          </div>
                        )}
                        <div className="min-w-0 max-w-[220px]">
                          <span className="font-semibold text-foreground block truncate">{p.name}</span>
                          <span className="text-[11px] text-muted-foreground block truncate">
                            {p.category} {p.subcategory ? `· ${p.subcategory}` : ""}
                          </span>
                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                p.type === "rental"
                                  ? "bg-purple-100 text-purple-900 border border-purple-200"
                                  : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                              }`}
                            >
                              {p.type === "rental" ? "Rental Studio" : "Ready-Made"}
                            </span>
                            {p.color && (
                              <span className="text-[10px] text-muted-foreground truncate">
                                Color: {p.color}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Product Quantity (Total Stock) */}
                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            isOutOfStock
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : item.totalStock <= 2
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : item.totalStock <= threshold
                              ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                              : "bg-slate-100 text-slate-800 border border-slate-200"
                          }`}
                        >
                          <span>
                            {isOutOfStock ? "0 Units (Out)" : `${item.totalStock} Units Total`}
                          </span>
                        </span>
                        <div className="text-xs font-medium text-primary">
                          {p.type === "rental" ? inr(p.rentalPrice) : inr(p.price)}
                        </div>
                      </div>
                    </td>

                    {/* Stock According to Size */}
                    <td className="px-5 py-4">
                      <div className="space-y-2 max-w-[320px]">
                        <div className="flex flex-wrap gap-1.5">
                          {item.sizeStocks.map((sz) => {
                            const isSzOut = sz.stock === 0;
                            const isSzLow = sz.stock > 0 && sz.stock <= threshold;

                            return (
                              <div
                                key={sz.size}
                                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                                  isSzOut
                                    ? "bg-rose-50 border-rose-300 text-rose-800 font-semibold"
                                    : isSzLow
                                    ? "bg-amber-50 border-amber-300 text-amber-800 font-semibold"
                                    : "bg-background border-border/80 text-foreground"
                                }`}
                                title={`Size ${sz.size}: ${sz.stock} units in stock${
                                  isSzOut ? " (Completely Out)" : isSzLow ? " (Running Low)" : ""
                                }`}
                              >
                                <span className="font-bold">{sz.size}:</span>
                                <span>{sz.stock}</span>
                                {isSzOut && (
                                  <span className="rounded bg-rose-200 px-1 py-0.2 text-[9px] font-bold text-rose-900 uppercase">
                                    0
                                  </span>
                                )}
                                {isSzLow && (
                                  <span className="rounded bg-amber-200 px-1 py-0.2 text-[9px] font-bold text-amber-900">
                                    Low
                                  </span>
                                )}

                                {/* Inline +1 Quick Size Replenisher */}
                                <button
                                  onClick={() => quickRestockSize(p, sz.size, 1)}
                                  className="ml-1 rounded px-1 text-[10px] font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                                  title={`Add +1 unit to Size ${sz.size}`}
                                >
                                  +1
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Color-wise Breakdown Indicator if multiple colors exist */}
                        {p.colors && p.colors.length > 1 && (
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Layers className="h-3 w-3 text-gold-500" />
                            <span>
                              {p.colors.length} Color Shades ({p.colors.map((c) => c.name).join(", ")})
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Health & Diagnosis */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                            item.statusBadge.variant === "rose"
                              ? "bg-rose-100 text-rose-800"
                              : item.statusBadge.variant === "amber"
                              ? "bg-amber-100 text-amber-800"
                              : item.statusBadge.variant === "yellow"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {item.statusBadge.label}
                        </span>
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          {item.statusBadge.reason}
                        </p>
                      </div>
                    </td>

                    {/* Quick Restock & Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setViewAnalysis(item)}
                            className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                            title="Inspect size & product inventory details"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="rounded-lg border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                            title="Edit stock according to size & product quantity"
                          >
                            Edit Stock
                          </button>
                          <button
                            onClick={() => handleRemoveProduct(p.id)}
                            className="rounded-lg border border-rose-300 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                            title="Delete outfit"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Quick Total Restock Controls */}
                        <div className="flex items-center gap-1.5 pt-1 border-t border-border/50">
                          <span className="text-[10px] text-muted-foreground mr-0.5">Replenish:</span>
                          <button
                            onClick={() => quickRestockProduct(p, 5)}
                            className="rounded-lg border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-primary hover:bg-blush hover:border-gold-300 transition-colors"
                            title="Quick replenish +5 units distributed across sizes"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => quickRestockProduct(p, 10)}
                            className="rounded-lg border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-primary hover:bg-blush hover:border-gold-300 transition-colors"
                            title="Quick replenish +10 units distributed across sizes"
                          >
                            +10
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!filteredAnalyses.length && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            <CheckCircle className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
            <p className="font-semibold text-foreground">All inventory levels are healthy</p>
            <p className="text-xs text-muted-foreground mt-1">
              No products or sizes found at or below {threshold} units matching current filters.
            </p>
          </div>
        )}
      </div>

      {/* Product View / Inspection Modal */}
      {viewAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-lift border border-gold-300/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <SparkleIcon className="h-5 w-5 text-gold-400" />
                <h3 className="font-display text-xl text-primary">Outfit & Size Inventory Inspection</h3>
              </div>
              <button
                onClick={() => setViewAnalysis(null)}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {/* Outfit Header Card */}
              <div className="flex gap-4">
                <img
                  src={viewAnalysis.product.image}
                  alt={viewAnalysis.product.name}
                  className="h-28 w-24 rounded-2xl object-cover border border-border shrink-0 shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      viewAnalysis.isProductOutOfStock
                        ? "bg-rose-100 text-rose-800"
                        : viewAnalysis.totalStock <= 2
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {viewAnalysis.isProductOutOfStock
                      ? "Product Out of Stock"
                      : `${viewAnalysis.totalStock} Total Units Remaining`}
                  </span>
                  <h4 className="font-display text-lg text-primary mt-1.5 truncate">
                    {viewAnalysis.product.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Category: {viewAnalysis.product.category}{" "}
                    {viewAnalysis.product.subcategory ? `· ${viewAnalysis.product.subcategory}` : ""}
                  </p>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {viewAnalysis.product.type === "rental"
                      ? `Rental: ${inr(viewAnalysis.product.rentalPrice)}`
                      : `Price: ${inr(viewAnalysis.product.price)}`}
                  </p>
                  {viewAnalysis.product.barcode && (
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                      Barcode: {viewAnalysis.product.barcode}
                    </p>
                  )}
                </div>
              </div>

              {/* Size-wise Detailed Table */}
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-gold-500" />
                  <span>Stock Breakdown According to Size</span>
                </h5>
                <div className="overflow-hidden rounded-xl border border-border/80">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 font-semibold text-muted-foreground border-b border-border/70">
                      <tr>
                        <th className="px-3.5 py-2.5">Size</th>
                        <th className="px-3.5 py-2.5">Available Quantity</th>
                        <th className="px-3.5 py-2.5">Status</th>
                        <th className="px-3.5 py-2.5 text-right">Quick Restock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {viewAnalysis.sizeStocks.map((sz) => (
                        <tr key={sz.size} className="hover:bg-muted/20">
                          <td className="px-3.5 py-2.5 font-bold text-foreground">{sz.size}</td>
                          <td className="px-3.5 py-2.5 font-semibold text-primary">
                            {sz.stock} units
                          </td>
                          <td className="px-3.5 py-2.5">
                            {sz.stock === 0 ? (
                              <span className="rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold">
                                Depleted (0)
                              </span>
                            ) : sz.stock <= threshold ? (
                              <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
                                Low Stock
                              </span>
                            ) : (
                              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                                Optimal
                              </span>
                            )}
                          </td>
                          <td className="px-3.5 py-2.5 text-right">
                            <button
                              onClick={() => {
                                quickRestockSize(viewAnalysis.product, sz.size, 5);
                                setViewAnalysis((prev) => {
                                  if (!prev) return null;
                                  return analyzeProductStock(
                                    {
                                      ...prev.product,
                                      stock: prev.product.stock + 5,
                                    },
                                    threshold
                                  );
                                });
                              }}
                              className="rounded border border-primary/40 bg-primary/5 px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                            >
                              +5 {sz.size}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Color Details if any */}
              {viewAnalysis.product.colors && viewAnalysis.product.colors.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-gold-500" />
                    <span>Color Variations & Size Breakdown</span>
                  </h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {viewAnalysis.product.colors.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl bg-muted/20 border border-border/80 px-3 py-2 text-xs"
                      >
                        <span className="font-semibold text-foreground">
                          {c.name || "Standard"}:{" "}
                          <strong className="text-primary">{c.stock} units</strong>
                        </span>
                        {c.sizeStocks && c.sizeStocks.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {c.sizeStocks.map((s) => (
                              <span
                                key={s.size}
                                className={`rounded px-1.5 py-0.5 text-[10px] ${
                                  s.stock === 0
                                    ? "bg-rose-100 text-rose-800 font-bold"
                                    : s.stock <= threshold
                                    ? "bg-amber-100 text-amber-800 font-bold"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {s.size}:{s.stock}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">Single shade</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border/80 pt-4">
              <Link
                href={`/product/${viewAnalysis.product.id}`}
                target="_blank"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>Storefront View</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const prod = viewAnalysis.product;
                    setViewAnalysis(null);
                    openEditModal(prod);
                  }}
                  className="rounded-xl border border-primary/40 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  Edit Stock by Size
                </button>
                <button
                  onClick={() => setViewAnalysis(null)}
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Quick Edit Stock Modal (Replenish by Size and Product Quantity) */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-lift border border-gold-300/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <SparkleIcon className="h-5 w-5 text-gold-400" />
                <h3 className="font-display text-xl text-primary">Replenish by Size & Product Quantity</h3>
              </div>
              <button
                onClick={() => setEditProduct(null)}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {/* Header Info */}
              <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-2xl border border-border/60">
                {editProduct.image && (
                  <img
                    src={editProduct.image}
                    alt={editProduct.name}
                    className="h-12 w-10 rounded-lg object-cover border border-border shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm text-foreground truncate">{editProduct.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    Calculated Total Stock:{" "}
                    <strong className="text-primary font-bold">{editModalTotalStock} Units</strong>
                  </p>
                </div>
              </div>

              {/* Color Variant Selector if multiple exist */}
              {editProduct.colors && editProduct.colors.length > 1 && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Select Color Shade to Update:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {editProduct.colors.map((c, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setEditColorIdx(idx);
                          // Initialize size drafts for this color
                          const drafts: { [size: string]: number } = {};
                          if (c.sizeStocks && c.sizeStocks.length > 0) {
                            c.sizeStocks.forEach((s) => (drafts[s.size] = s.stock));
                          } else if (c.sizes && c.sizes.length > 0) {
                            c.sizes.forEach((s) => (drafts[s] = 0));
                          }
                          setEditSizeDrafts(drafts);
                        }}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${
                          editColorIdx === idx
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-foreground hover:bg-muted"
                        }`}
                      >
                        {c.name || `Color #${idx + 1}`} ({c.stock} units)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size-wise Quantity Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Quantity per Size:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      // Quick add +5 to all sizes
                      setEditSizeDrafts((prev) => {
                        const next = { ...prev };
                        Object.keys(next).forEach((sz) => {
                          next[sz] = (next[sz] || 0) + 5;
                        });
                        return next;
                      });
                    }}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    +5 to all sizes
                  </button>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {Object.keys(editSizeDrafts).map((sz) => {
                    const currentQty = editSizeDrafts[sz] ?? 0;
                    const isZero = currentQty === 0;
                    const isLow = currentQty > 0 && currentQty <= threshold;

                    return (
                      <div
                        key={sz}
                        className={`flex items-center justify-between gap-3 rounded-2xl border p-2.5 transition-all ${
                          isZero
                            ? "border-rose-200 bg-rose-50/40"
                            : isLow
                            ? "border-amber-200 bg-amber-50/40"
                            : "border-border/80 bg-background"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                            {sz}
                          </span>
                          <div>
                            <span className="font-semibold text-xs text-foreground block">
                              Size {sz}
                            </span>
                            <span className="text-[10px] text-muted-foreground block">
                              {isZero ? "Depleted" : isLow ? "Running Low" : "Optimal"}
                            </span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setEditSizeDrafts((prev) => ({
                                ...prev,
                                [sz]: Math.max(0, (prev[sz] ?? 0) - 1),
                              }))
                            }
                            className="h-8 w-8 rounded-lg border border-border bg-white flex items-center justify-center text-sm font-bold hover:bg-muted"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={currentQty}
                            onChange={(e) => {
                              const val = Math.max(0, Number(e.target.value) || 0);
                              setEditSizeDrafts((prev) => ({
                                ...prev,
                                [sz]: val,
                              }));
                            }}
                            className="w-14 rounded-lg border border-border bg-white px-2 py-1 text-center text-xs font-bold text-foreground outline-none focus:border-gold-400"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setEditSizeDrafts((prev) => ({
                                ...prev,
                                [sz]: (prev[sz] ?? 0) + 1,
                              }))
                            }
                            className="h-8 w-8 rounded-lg border border-border bg-white flex items-center justify-center text-sm font-bold hover:bg-muted"
                          >
                            +
                          </button>

                          {/* Quick add +5 for this specific size */}
                          <button
                            type="button"
                            onClick={() =>
                              setEditSizeDrafts((prev) => ({
                                ...prev,
                                [sz]: (prev[sz] ?? 0) + 5,
                              }))
                            }
                            className="rounded-lg border border-border bg-muted/60 px-2 py-1 text-[11px] font-semibold text-primary hover:bg-blush transition-colors"
                            title={`Add +5 units to size ${sz}`}
                          >
                            +5
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Product Summary Banner */}
              <div className="flex items-center justify-between rounded-2xl bg-blush/40 border border-gold-300/40 p-3.5 text-xs">
                <div>
                  <span className="font-semibold text-primary block">Overall Inventory Summary</span>
                  <span className="text-[11px] text-muted-foreground block">
                    Total will automatically sync across all {Object.keys(editSizeDrafts).length} sizes
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-display text-2xl text-primary font-bold">
                    {editModalTotalStock}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">total units</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-2 border-t border-border/80 pt-4">
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                disabled={isSaving}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditStock}
                disabled={isSaving}
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all shadow-lift flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>{isSaving ? "Saving Inventory..." : "Save Stock"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

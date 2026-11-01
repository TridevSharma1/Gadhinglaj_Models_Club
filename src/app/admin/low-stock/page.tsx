"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdminShell, { card, input, btn, btnGhost } from "@/components/admin/AdminShell";
import { inr, type Product, type ProductColorVariant } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { SparkleIcon } from "@/components/site/Icons";
import {
  analyzeProductStock,
  getProductVariants,
  updateVariantSizeStock,
  saveAllVariants,
  type ProductStockAnalysis,
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
  Palette,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

type FilterMode = "all" | "product" | "variant" | "out_of_stock";

export default function AdminLowStockPage() {
  const { products, categories, update, saveProduct, deleteProduct } = useStore();
  const [q, setQ] = useState("");
  const [threshold, setThreshold] = useState<number>(3);
  const [catFilter, setCatFilter] = useState("All");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>("All");
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>("All");

  const [viewAnalysis, setViewAnalysis] = useState<ProductStockAnalysis | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editVariantsDraft, setEditVariantsDraft] = useState<ProductColorVariant[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [restockNotice, setRestockNotice] = useState<string | null>(null);

  // Analyze all products with current threshold
  const analyzedProducts = useMemo(() => {
    return products.map((p) => analyzeProductStock(p, threshold));
  }, [products, threshold]);

  // Distinct sizes available across the catalog
  const allAvailableSizes = useMemo(() => {
    const set = new Set<string>();
    analyzedProducts.forEach((item) => {
      item.sizeStocks.forEach((s) => set.add(s.size));
    });
    return Array.from(set).sort();
  }, [analyzedProducts]);

  // Distinct colors available across the catalog
  const allAvailableColors = useMemo(() => {
    const set = new Set<string>();
    analyzedProducts.forEach((item) => {
      item.variants.forEach((c) => {
        if (c.name) set.add(c.name);
      });
    });
    return ["All", ...Array.from(set).sort()];
  }, [analyzedProducts]);

  // Distinct categories
  const categoryList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  // Filtering based on search query, category, filterMode, specific size and color
  const filteredAnalyses = useMemo(() => {
    return analyzedProducts.filter((item) => {
      const p = item.product;

      // Category filter
      if (catFilter !== "All" && p.category !== catFilter) {
        return false;
      }

      // Color filter
      if (selectedColorFilter !== "All") {
        const hasColor = item.variants.some(
          (c) => (c.name || "").toLowerCase() === selectedColorFilter.toLowerCase()
        );
        if (!hasColor) return false;
      }

      // Specific size filter
      if (selectedSizeFilter !== "All") {
        const hasLowSizeInVariant = item.variants.some((c) =>
          c.sizeStocks?.some(
            (s) => s.size === selectedSizeFilter && s.stock <= threshold
          )
        );
        const overallSizeObj = item.sizeStocks.find((s) => s.size === selectedSizeFilter);
        const hasLowSizeOverall = overallSizeObj ? overallSizeObj.stock <= threshold : false;

        if (!hasLowSizeInVariant && !hasLowSizeOverall) {
          return false;
        }
      }

      // Search query (matches name, category, subcategory, sku, barcode, color, or sizes)
      if (q.trim()) {
        const query = q.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchCat = (p.category || "").toLowerCase().includes(query);
        const matchSub = (p.subcategory || "").toLowerCase().includes(query);
        const matchSku = (p.sku || "").toLowerCase().includes(query);
        const matchBarcode = (p.barcode || "").toLowerCase().includes(query);
        const matchColor = item.variants.some((c) => (c.name || "").toLowerCase().includes(query));
        const matchSize = item.sizeStocks.some((s) => s.size.toLowerCase().includes(query));

        if (!matchName && !matchCat && !matchSub && !matchSku && !matchBarcode && !matchColor && !matchSize) {
          return false;
        }
      }

      // Filter Mode condition
      switch (filterMode) {
        case "product":
          return item.isProductLow || item.isProductOutOfStock;
        case "variant":
          return (
            item.hasLowSizes ||
            item.hasOutOfStockSizes ||
            item.variants.some((c) => c.stock <= threshold)
          );
        case "out_of_stock":
          return (
            item.isProductOutOfStock ||
            item.hasOutOfStockSizes ||
            item.variants.some((c) => c.stock === 0 || c.sizeStocks?.some((s) => s.stock === 0))
          );
        case "all":
        default:
          return (
            item.isProductLow ||
            item.isProductOutOfStock ||
            item.hasLowSizes ||
            item.hasOutOfStockSizes ||
            item.variants.some((c) => c.stock <= threshold)
          );
      }
    });
  }, [analyzedProducts, q, catFilter, filterMode, selectedSizeFilter, selectedColorFilter, threshold]);

  // Overall catalog metrics
  const criticalCount = useMemo(() => {
    return analyzedProducts.filter((item) => item.isCritical).length;
  }, [analyzedProducts]);

  const totalOutOfStockProducts = useMemo(() => {
    return analyzedProducts.filter((item) => item.isProductOutOfStock).length;
  }, [analyzedProducts]);

  const depletedVariantsCount = useMemo(() => {
    return analyzedProducts.reduce((acc, item) => {
      const outSizes = item.variants.reduce((cAcc, c) => {
        return cAcc + (c.sizeStocks ? c.sizeStocks.filter((s) => s.stock === 0).length : (c.stock === 0 ? 1 : 0));
      }, 0);
      return acc + outSizes;
    }, 0);
  }, [analyzedProducts]);

  const lowVariantsCount = useMemo(() => {
    return analyzedProducts.reduce((acc, item) => {
      const lowSizes = item.variants.reduce((cAcc, c) => {
        return cAcc + (c.sizeStocks ? c.sizeStocks.filter((s) => s.stock > 0 && s.stock <= threshold).length : (c.stock > 0 && c.stock <= threshold ? 1 : 0));
      }, 0);
      return acc + lowSizes;
    }, 0);
  }, [analyzedProducts, threshold]);

  const showTemporaryNotice = (msg: string) => {
    setRestockNotice(msg);
    setTimeout(() => setRestockNotice(null), 4000);
  };

  // Quick Restock a specific size within a specific color variant
  const quickRestockColorSize = async (
    p: Product,
    colorIdx: number,
    sizeName: string,
    addQty: number
  ) => {
    const variants = getProductVariants(p);
    const targetCol = variants[colorIdx] || variants[0];
    const currentQty =
      targetCol.sizeStocks?.find((s) => s.size === sizeName)?.stock ?? 0;
    const newQty = currentQty + addQty;

    const updatedProduct = updateVariantSizeStock(p, colorIdx, sizeName, newQty);

    // Optimistic update
    update(
      "products",
      products.map((item) => (item.id === p.id ? updatedProduct : item))
    );

    try {
      await saveProduct(updatedProduct);
      showTemporaryNotice(
        `Added +${addQty} to ${targetCol.name || "Shade"} [Size ${sizeName}].`
      );
    } catch (err: any) {
      console.error("Failed to save size restock:", err);
      showTemporaryNotice(`Error saving size restock: ${err.message || "Failed"}`);
    }
  };

  // Quick Restock an entire product's total stock
  const quickRestockProduct = async (p: Product, addQty: number) => {
    const variants = getProductVariants(p);
    if (!variants.length) return;

    // Distribute among colors and their sizes
    const evenPerColor = Math.floor(addQty / variants.length);
    const remPerColor = addQty % variants.length;

    const updatedVariants = variants.map((c, cIdx) => {
      const colAdd = evenPerColor + (cIdx === 0 ? remPerColor : 0);
      if (c.sizeStocks && c.sizeStocks.length > 0) {
        const evenPerSize = Math.floor(colAdd / c.sizeStocks.length);
        const remPerSize = colAdd % c.sizeStocks.length;
        const updatedStocks = c.sizeStocks.map((s, sIdx) => ({
          ...s,
          stock: s.stock + evenPerSize + (sIdx === 0 ? remPerSize : 0),
        }));
        return {
          ...c,
          sizeStocks: updatedStocks,
          stock: updatedStocks.reduce((sum, s) => sum + s.stock, 0),
        };
      }
      return {
        ...c,
        stock: c.stock + colAdd,
      };
    });

    const updatedProduct = saveAllVariants(p, updatedVariants);

    update(
      "products",
      products.map((item) => (item.id === p.id ? updatedProduct : item))
    );

    try {
      await saveProduct(updatedProduct);
      showTemporaryNotice(`Replenished +${addQty} units across "${p.name}".`);
    } catch (err: any) {
      console.error("Failed to save product restock:", err);
      showTemporaryNotice(`Error saving restock: ${err.message || "Failed"}`);
    }
  };

  // Delete product action
  const handleRemoveProduct = async (id: number) => {
    if (confirm("Are you sure you want to delete this product from the catalog? This will delete it permanently.")) {
      try {
        await deleteProduct(id);
        showTemporaryNotice("Product deleted from catalog.");
      } catch (err: any) {
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
    const variants = getProductVariants(p);
    setEditVariantsDraft(JSON.parse(JSON.stringify(variants)));
  };

  // Handle single size change in Edit Modal
  const handleEditModalSizeChange = (colorIdx: number, sizeName: string, newQty: number) => {
    const safeQty = Math.max(0, isNaN(newQty) ? 0 : newQty);
    setEditVariantsDraft((prev) => {
      return prev.map((col, idx) => {
        if (idx !== colorIdx) return col;
        const currentSizes = col.sizeStocks && col.sizeStocks.length > 0 ? [...col.sizeStocks] : [];
        const existingIdx = currentSizes.findIndex((s) => s.size === sizeName);
        if (existingIdx >= 0) {
          currentSizes[existingIdx] = { ...currentSizes[existingIdx], stock: safeQty };
        } else {
          currentSizes.push({ size: sizeName, stock: safeQty });
        }
        const newColorTotal = currentSizes.reduce((sum, s) => sum + (Number(s.stock) || 0), 0);
        return {
          ...col,
          hasSizes: true,
          sizeStocks: currentSizes,
          stock: newColorTotal,
        };
      });
    });
  };

  // Handle color total stock change (for colors without sizes)
  const handleEditModalColorStockChange = (colorIdx: number, newQty: number) => {
    const safeQty = Math.max(0, isNaN(newQty) ? 0 : newQty);
    setEditVariantsDraft((prev) => {
      return prev.map((col, idx) => {
        if (idx !== colorIdx) return col;
        return {
          ...col,
          stock: safeQty,
        };
      });
    });
  };

  // Save changes from Edit Stock Modal
  const handleSaveEditStock = async () => {
    if (!editProduct) return;
    setIsSaving(true);

    try {
      const updatedProduct = saveAllVariants(editProduct, editVariantsDraft);

      // Local state optimistic update
      update(
        "products",
        products.map((item) => (item.id === editProduct.id ? updatedProduct : item))
      );

      // Backend persist to MongoDB
      await saveProduct(updatedProduct);

      showTemporaryNotice(`Successfully updated colour & size inventory for "${editProduct.name}".`);
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
    return editVariantsDraft.reduce((sum, c) => sum + (Number(c.stock) || 0), 0);
  }, [editVariantsDraft]);

  return (
    <AdminShell
      title="Low Stock & Inventory Alerts"
      subtitle="Track atelier outfits, colors, and individual sizes nearing exhaustion. Replenish inventory according to color and size breakdown."
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
            Outfits or colors with inventory near exhaustion
          </p>
        </div>

        {/* Depleted Size & Color Variants */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Depleted Variants (0 Qty)
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-800 font-bold text-xs">
              <Layers className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-3xl text-rose-700">{depletedVariantsCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Color & size variants completely out of stock
          </p>
        </div>

        {/* Low Stock Variants Needing Replenishment */}
        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Low Variants (≤ {threshold})
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-800 font-bold text-xs">
              <Package className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-3xl text-yellow-800">{lowVariantsCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Color and size units requiring restocking
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
            Matching color & size low-stock threshold of ≤ {threshold}
          </p>
        </div>
      </div>

      {/* Filter and Threshold Controls */}
      <div className={`${card} mb-8 space-y-4`}>
        {/* Top Filter Row: Search & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search outfit, color, size, SKU, category…"
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

        {/* Bottom Filter Row: Mode Tabs & Color/Size Dropdowns */}
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
              Low Product Total
            </button>
            <button
              onClick={() => setFilterMode("variant")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterMode === "variant"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              Low by Colour &amp; Size
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

          {/* Color & Size Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by Colour */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Colour:
              </span>
              <select
                value={selectedColorFilter}
                onChange={(e) => setSelectedColorFilter(e.target.value)}
                className="rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none focus:border-gold-400"
              >
                {allAvailableColors.map((col) => (
                  <option key={col} value={col}>
                    {col === "All" ? "All Colours" : col}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Size */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Size:
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
      </div>

      {/* Low Stock Table Styled Like Inventory */}
      <div className={`${card} overflow-hidden p-0 shadow-soft`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b border-border/80 bg-muted/40 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Outfit Details</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Pricing</th>
                <th className="px-5 py-4">Colour &amp; Size Breakdown (Low Stock Highlights)</th>
                <th className="px-5 py-4">Total Stock</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredAnalyses.map((item) => {
                const p = item.product;
                const variants = item.variants;
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
                        <div className="min-w-0 max-w-[200px]">
                          <span className="font-semibold text-foreground block truncate">{p.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono block">
                            SKU: {p.sku || `GMC-${p.id + 1000}`}
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
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-xs">
                      <span className="font-medium text-primary block">{p.category}</span>
                      {p.subcategory && (
                        <span className="text-[10px] text-muted-foreground block">
                          {p.subcategory}
                        </span>
                      )}
                    </td>

                    {/* Pricing */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-primary">
                        {p.type === "rental" ? inr(p.rentalPrice) : inr(p.price)}
                      </span>
                      <span className="block text-[10px] text-muted-foreground">
                        {p.type === "rental" ? "Rental (3 Days)" : "Purchase"}
                      </span>
                    </td>

                    {/* Colour & Size Breakdown (Like Inventory!) */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2 max-w-[380px]">
                        {variants.map((c, cIdx) => {
                          const isColOut = c.stock === 0;
                          const isColLow = c.stock > 0 && c.stock <= threshold;
                          const hasOutSizes = c.sizeStocks?.some((s) => s.stock === 0);
                          const hasLowSizes = c.sizeStocks?.some(
                            (s) => s.stock > 0 && s.stock <= threshold
                          );

                          return (
                            <div
                              key={c.id || cIdx}
                              className={`inline-flex flex-col rounded-xl border px-3 py-1.5 text-[11px] font-medium shadow-2xs transition-all ${
                                isColOut
                                  ? "border-rose-300 bg-rose-50/60 ring-1 ring-rose-200"
                                  : isColLow || hasOutSizes
                                  ? "border-amber-300 bg-amber-50/50"
                                  : "border-border/80 bg-white"
                              }`}
                            >
                              {/* Color Header Row */}
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-muted-foreground truncate max-w-[130px] font-semibold flex items-center gap-1.5">
                                  <span
                                    className={`h-2 w-2 rounded-full shrink-0 ${
                                      isColOut
                                        ? "bg-rose-500 ring-2 ring-rose-200"
                                        : isColLow || hasOutSizes
                                        ? "bg-amber-500 ring-2 ring-amber-200"
                                        : "bg-emerald-500"
                                    }`}
                                  />
                                  <span>{c.name || "Colour"}:</span>
                                </span>
                                <span
                                  className={`font-bold ${
                                    isColOut
                                      ? "text-rose-700"
                                      : isColLow
                                      ? "text-amber-700"
                                      : "text-primary"
                                  }`}
                                >
                                  {c.stock === 0 ? "0 units (Out)" : `${c.stock} units`}
                                </span>
                              </div>

                              {/* Size Stock Badges Inside Color */}
                              {c.sizeStocks && c.sizeStocks.length > 0 && (
                                <div className="flex flex-wrap gap-1 text-[10px] text-muted-foreground border-t border-border/50 pt-1 mt-1">
                                  {c.sizeStocks.map((s) => {
                                    const szOut = s.stock === 0;
                                    const szLow = s.stock > 0 && s.stock <= threshold;

                                    return (
                                      <span
                                        key={s.size}
                                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded transition-all ${
                                          szOut
                                            ? "bg-rose-100 text-rose-800 border border-rose-300 font-bold"
                                            : szLow
                                            ? "bg-amber-100 text-amber-900 border border-amber-300 font-bold"
                                            : "bg-muted/70 text-foreground font-medium"
                                        }`}
                                        title={`${c.name || "Colour"} - Size ${s.size}: ${s.stock} units in stock${
                                          szOut ? " (Completely Out)" : szLow ? " (Running Low)" : ""
                                        }`}
                                      >
                                        <span>{s.size}:</span>
                                        <strong className={szOut ? "text-rose-700 font-extrabold" : szLow ? "text-amber-800 font-bold" : ""}>
                                          {s.stock}
                                        </strong>
                                        {szOut && (
                                          <span className="text-[8px] uppercase tracking-tighter text-rose-600 font-bold">
                                            out
                                          </span>
                                        )}
                                        {szLow && (
                                          <span className="text-[8px] uppercase tracking-tighter text-amber-700 font-bold">
                                            low
                                          </span>
                                        )}

                                        {/* Inline Quick +1 Replenisher for this specific size and color */}
                                        <button
                                          onClick={() => quickRestockColorSize(p, cIdx, s.size, 1)}
                                          className="ml-0.5 rounded px-1 text-[9px] font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                                          title={`Add +1 unit to ${c.name} - Size ${s.size}`}
                                        >
                                          +
                                        </button>
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Total Stock */}
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            isOutOfStock
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : item.totalStock <= 2
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : item.totalStock <= threshold
                              ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {isOutOfStock ? "Out of Stock" : `${item.totalStock} units total`}
                        </span>
                        <div className="text-[10px] text-muted-foreground block truncate max-w-[130px]">
                          {item.statusBadge.label}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setViewAnalysis(item)}
                            className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors flex items-center gap-1"
                            title="Inspect colour & size breakdown in detail"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="rounded-lg border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors flex items-center gap-1"
                            title="Edit colour & size stock inventory"
                          >
                            <SlidersHorizontal className="h-3 w-3" />
                            <span>Edit Stock</span>
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
                          <span className="text-[10px] text-muted-foreground mr-0.5">Quick:</span>
                          <button
                            onClick={() => quickRestockProduct(p, 5)}
                            className="rounded-lg border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-primary hover:bg-blush hover:border-gold-300 transition-colors"
                            title="Replenish +5 units across colors & sizes"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => quickRestockProduct(p, 10)}
                            className="rounded-lg border border-border bg-background px-2 py-0.5 text-[11px] font-semibold text-primary hover:bg-blush hover:border-gold-300 transition-colors"
                            title="Replenish +10 units across colors & sizes"
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
              No products, colours, or sizes found at or below {threshold} units matching current filters.
            </p>
          </div>
        )}
      </div>

      {/* Product View / Inspection Modal (Detailed Colour & Size Breakdown) */}
      {viewAnalysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-lift border border-gold-300/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <SparkleIcon className="h-5 w-5 text-gold-400" />
                <h3 className="font-display text-xl text-primary">Colour &amp; Size Breakdown Inspection</h3>
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

              {/* Colour-Wise Breakdown Cards Like Inventory Spotlight */}
              <div>
                <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-gold-500" />
                  <span>Colour &amp; Size Breakdown Status</span>
                </h5>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {viewAnalysis.variants.map((col, cIdx) => (
                    <div
                      key={col.id || cIdx}
                      className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {col.image ? (
                            <img
                              src={col.image}
                              alt={col.name}
                              className="h-9 w-9 rounded-lg object-cover border border-border shrink-0"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs shrink-0">
                              {(col.name || "ST").slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-sm text-foreground block">
                              {col.name || "Standard Colour"}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              Shade Total: <strong className="text-primary">{col.stock} units</strong>
                            </span>
                          </div>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            col.stock === 0
                              ? "bg-rose-100 text-rose-800"
                              : col.stock <= threshold
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {col.stock === 0 ? "Depleted" : col.stock <= threshold ? "Low Stock" : "In Stock"}
                        </span>
                      </div>

                      {/* Sizes in this color */}
                      {col.sizeStocks && col.sizeStocks.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60">
                          {col.sizeStocks.map((sz) => {
                            const isSzOut = sz.stock === 0;
                            const isSzLow = sz.stock > 0 && sz.stock <= threshold;

                            return (
                              <div
                                key={sz.size}
                                className={`rounded-xl border p-2 flex items-center justify-between text-xs ${
                                  isSzOut
                                    ? "bg-rose-50 border-rose-300"
                                    : isSzLow
                                    ? "bg-amber-50 border-amber-300"
                                    : "bg-white border-border/80"
                                }`}
                              >
                                <div>
                                  <span className="font-bold text-foreground block">{sz.size}</span>
                                  <span
                                    className={`text-[10px] font-bold ${
                                      isSzOut
                                        ? "text-rose-700"
                                        : isSzLow
                                        ? "text-amber-800"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {sz.stock} units
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    quickRestockColorSize(viewAnalysis.product, cIdx, sz.size, 5);
                                    setViewAnalysis((prev) => {
                                      if (!prev) return null;
                                      return analyzeProductStock(
                                        updateVariantSizeStock(prev.product, cIdx, sz.size, sz.stock + 5),
                                        threshold
                                      );
                                    });
                                  }}
                                  className="rounded border border-primary/40 bg-primary/5 px-1.5 py-0.5 text-[10px] font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                                  title={`Add +5 units to ${col.name} - ${sz.size}`}
                                >
                                  +5
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
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
                  Edit Colour &amp; Size Stock
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

      {/* Edit Colour & Size Stock Modal (Styled Exactly Like Inventory Spotlight!) */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-lift border border-gold-300/40 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <SparkleIcon className="h-5 w-5 text-gold-400" />
                <h3 className="font-display text-xl text-primary">
                  Colour &amp; Size-Wise Stock Replenishment
                </h3>
              </div>
              <button
                onClick={() => setEditProduct(null)}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {/* Product Header */}
              <div className="flex items-center gap-3 bg-muted/20 p-3.5 rounded-2xl border border-border/60">
                {editProduct.image && (
                  <img
                    src={editProduct.image}
                    alt={editProduct.name}
                    className="h-14 w-12 rounded-xl object-cover border border-border shrink-0 shadow-xs"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm text-foreground truncate">{editProduct.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    Category: {editProduct.category} · Total Inventory:{" "}
                    <strong className="text-primary font-bold">{editModalTotalStock} Units</strong>
                  </p>
                </div>
              </div>

              {/* Color & Size Cards Like Inventory Spotlight */}
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {editVariantsDraft.map((col, idx) => {
                  const sizeStocksList = col.sizeStocks || [];
                  const hasSizes = (col.hasSizes ?? false) || sizeStocksList.length > 0;

                  return (
                    <div
                      key={col.id || idx}
                      className="rounded-2xl border border-border/80 bg-white p-4 sm:p-5 hover:border-gold-300/60 transition-all shadow-2xs"
                    >
                      {/* Top Row: Color Details & Total */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3.5 mb-3.5">
                        <div className="flex items-center gap-3">
                          {col.image ? (
                            <img
                              src={col.image}
                              alt={col.name}
                              className="h-11 w-11 rounded-xl object-cover border border-border shadow-2xs shrink-0"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs shrink-0">
                              {(col.name || "ST").slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-sm text-foreground">
                              {col.name || `Colour #${idx + 1}`}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              Sizes: [{sizeStocksList.map((s) => s.size).join(", ")}]
                            </span>
                          </div>
                        </div>

                        {/* Right: Color Total Stock */}
                        <div className="flex items-center gap-3 sm:self-center">
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                              Colour Total
                            </span>
                            <span className="font-display text-xl font-bold text-primary">
                              {col.stock} <span className="text-xs font-normal text-muted-foreground">units</span>
                            </span>
                          </div>

                          {!hasSizes && (
                            <div className="flex items-center rounded-xl border border-border bg-background p-1">
                              <button
                                type="button"
                                onClick={() => handleEditModalColorStockChange(idx, col.stock - 1)}
                                disabled={col.stock <= 0}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-foreground hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-40"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={col.stock}
                                onChange={(e) =>
                                  handleEditModalColorStockChange(idx, Number(e.target.value) || 0)
                                }
                                className="w-14 text-center text-sm font-bold text-primary outline-none bg-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => handleEditModalColorStockChange(idx, col.stock + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-foreground hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Size-wise Grid Like Inventory */}
                      {hasSizes && (
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                              <SparkleIcon className="h-3 w-3 text-gold-600" />
                              <span>Stock by Size for &quot;{col.name || "Colour"}&quot;:</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditVariantsDraft((prev) =>
                                  prev.map((c, i) => {
                                    if (i !== idx) return c;
                                    const updated = (c.sizeStocks || []).map((s) => ({
                                      ...s,
                                      stock: s.stock + 5,
                                    }));
                                    return {
                                      ...c,
                                      sizeStocks: updated,
                                      stock: updated.reduce((sum, s) => sum + s.stock, 0),
                                    };
                                  })
                                );
                              }}
                              className="text-[11px] font-semibold text-primary hover:underline"
                            >
                              +5 to all sizes in this shade
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                            {sizeStocksList.map((szObj) => {
                              const sz = szObj.size;
                              const currentQty = szObj.stock;
                              const isSzOut = currentQty === 0;
                              const isSzLow = currentQty > 0 && currentQty <= threshold;

                              return (
                                <div
                                  key={sz}
                                  className={`flex flex-col justify-between rounded-xl border p-2.5 transition-all ${
                                    isSzOut
                                      ? "border-rose-300 bg-rose-50/50"
                                      : isSzLow
                                      ? "border-amber-300 bg-amber-50/50"
                                      : "border-border/80 bg-white"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                      {sz}
                                    </span>
                                    <span
                                      className={`text-[10px] font-bold ${
                                        isSzOut
                                          ? "text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded"
                                          : isSzLow
                                          ? "text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded"
                                          : "text-muted-foreground"
                                      }`}
                                    >
                                      {isSzOut ? "Out (0)" : isSzLow ? "Low Stock" : "In Stock"}
                                    </span>
                                  </div>

                                  {/* Stepper controls */}
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleEditModalSizeChange(idx, sz, currentQty - 1)}
                                      disabled={currentQty <= 0}
                                      className="h-8 w-8 rounded-lg border border-border bg-white hover:bg-rose-50 hover:text-rose-600 text-sm font-bold text-foreground flex items-center justify-center transition-colors disabled:opacity-40"
                                    >
                                      <Minus className="h-3.5 w-3.5" />
                                    </button>
                                    <input
                                      type="number"
                                      min="0"
                                      value={currentQty}
                                      onChange={(e) =>
                                        handleEditModalSizeChange(
                                          idx,
                                          sz,
                                          Number(e.target.value) || 0
                                        )
                                      }
                                      className="h-8 flex-1 w-12 rounded-lg border border-border bg-white text-center text-xs font-bold text-foreground outline-none focus:border-gold-400"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleEditModalSizeChange(idx, sz, currentQty + 1)}
                                      className="h-8 w-8 rounded-lg border border-border bg-white hover:bg-emerald-50 hover:text-emerald-700 text-sm font-bold text-foreground flex items-center justify-center transition-colors"
                                    >
                                      <Plus className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleEditModalSizeChange(idx, sz, currentQty + 5)}
                                      className="h-8 rounded-lg border border-border bg-muted/60 px-2 text-[10px] font-bold text-primary hover:bg-blush transition-colors"
                                      title="Add +5 units"
                                    >
                                      +5
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Total Product Summary Banner */}
              <div className="flex items-center justify-between rounded-2xl bg-blush/40 border border-gold-300/40 p-4 text-xs">
                <div>
                  <span className="font-semibold text-primary block">Overall Inventory Summary</span>
                  <span className="text-[11px] text-muted-foreground block">
                    Total units automatically recalculated across all color shades &amp; sizes
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

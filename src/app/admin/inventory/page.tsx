"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdminShell, { card, input, btn } from "@/components/admin/AdminShell";
import { inr, type Product, type ProductColorVariant, type ProductSizeStock } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { SparkleIcon } from "@/components/site/Icons";
import {
  Search,
  Plus,
  Minus,
  CheckCircle2,
  Package,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  Tag,
  Barcode,
  Palette,
  AlertTriangle,
} from "lucide-react";

export default function AdminInventoryPage() {
  const { products, categories, saveProduct, update } = useStore();

  // Search by Slug / SKU / Barcode / Name
  const [q, setQ] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // Selected product for detailed color-wise upgrade inspection
  const [spotlightId, setSpotlightId] = useState<number | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const removeProduct = (id: number) => {
    if (confirm("Are you sure you want to remove this garment from inventory?")) {
      update(
        "products",
        products.filter((p) => p.id !== id),
      );
    }
  };

  // Local draft changes for variants { [productId: number]: ProductColorVariant[] }
  const [variantDrafts, setVariantDrafts] = useState<{ [productId: number]: ProductColorVariant[] }>({});
  const [savingProductId, setSavingProductId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Overall statistics
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValuation = products.reduce((acc, p) => acc + p.stock * p.price, 0);
  const rentalUnits = products.filter((p) => p.type === "rental").reduce((acc, p) => acc + p.stock, 0);
  const readymadeUnits = products.filter((p) => p.type === "readymade").reduce((acc, p) => acc + p.stock, 0);

  // Filtered product list matching Slug Number, SKU, Barcode, ID or Name
  const filteredProducts = useMemo(() => {
    const query = q.trim().toLowerCase();
    return products.filter((p) => {
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        (p.sku && p.sku.toLowerCase().includes(query)) ||
        (p.barcode && p.barcode.toLowerCase().includes(query)) ||
        String(p.id).includes(query) ||
        (p.fabric && p.fabric.toLowerCase().includes(query)) ||
        (p.color && p.color.toLowerCase().includes(query));

      const matchCat = selectedCat === "All" || p.category === selectedCat;
      const matchType = typeFilter === "All" || p.type === typeFilter;

      return matchQuery && matchCat && matchType;
    });
  }, [products, q, selectedCat, typeFilter]);

  // If search matches exactly one product or top search result, spotlight it
  const spotlightProduct = useMemo(() => {
    if (spotlightId) {
      return products.find((p) => p.id === spotlightId) || null;
    }
    if (q.trim() && filteredProducts.length > 0) {
      return filteredProducts[0];
    }
    return null;
  }, [spotlightId, q, filteredProducts, products]);

  // Helper: Get draft or normalized variants array for any product
  const getProductVariants = (p: Product): ProductColorVariant[] => {
    if (variantDrafts[p.id]) {
      return variantDrafts[p.id];
    }
    if (p.colors && p.colors.length > 0) {
      return p.colors.map((c) => {
        const sizesList = c.sizes && c.sizes.length > 0 ? c.sizes : (p.sizes && p.sizes.length > 0 ? p.sizes : []);
        let sizeStocks = c.sizeStocks;
        // If color has sizes enabled or sizes exist but sizeStocks is empty, initialize evenly
        if ((c.hasSizes || sizesList.length > 0) && (!sizeStocks || sizeStocks.length === 0) && sizesList.length > 0) {
          const evenStock = Math.floor(c.stock / sizesList.length);
          const remainder = c.stock % sizesList.length;
          sizeStocks = sizesList.map((sz, i) => ({
            size: sz,
            stock: evenStock + (i === 0 ? remainder : 0),
          }));
        }
        return {
          ...c,
          hasSizes: c.hasSizes ?? (sizesList.length > 0),
          sizes: sizesList,
          sizeStocks: sizeStocks || [],
        };
      });
    }

    const defaultSizes = p.sizes && p.sizes.length > 0 ? p.sizes : [];
    const defaultSizeStocks = defaultSizes.map((sz, i) => {
      const evenStock = Math.floor(p.stock / defaultSizes.length);
      const remainder = p.stock % defaultSizes.length;
      return { size: sz, stock: evenStock + (i === 0 ? remainder : 0) };
    });

    return [
      {
        id: "col-default",
        name: p.color || "Standard Shade",
        stock: p.stock || 0,
        image: p.image || "",
        hasSizes: defaultSizes.length > 0,
        sizes: defaultSizes,
        sizeStocks: defaultSizeStocks,
      },
    ];
  };

  // Helper: Get draft stock or current stock for a specific color of a product
  const getColorStock = (p: Product, colorIdx: number): number => {
    const variants = getProductVariants(p);
    return variants[colorIdx]?.stock ?? 0;
  };

  // Handle entire color stock quantity change (for colors without sizes)
  const handleColorStockChange = (productId: number, colorIdx: number, newQty: number) => {
    const p = products.find((item) => item.id === productId);
    if (!p) return;

    const currentVariants = getProductVariants(p);
    const updatedVariants = currentVariants.map((col, idx) => {
      if (idx !== colorIdx) return col;
      const safeQty = Math.max(0, isNaN(newQty) ? 0 : newQty);
      return {
        ...col,
        stock: safeQty,
      };
    });

    setVariantDrafts((prev) => ({
      ...prev,
      [productId]: updatedVariants,
    }));
  };

  // Handle specific size stock quantity change within a color
  const handleSizeStockChange = (productId: number, colorIdx: number, sizeName: string, newQty: number) => {
    const p = products.find((item) => item.id === productId);
    if (!p) return;

    const currentVariants = getProductVariants(p);
    const updatedVariants = currentVariants.map((col, idx) => {
      if (idx !== colorIdx) return col;

      const safeQty = Math.max(0, isNaN(newQty) ? 0 : newQty);
      const currentSizes = col.sizes && col.sizes.length > 0 ? col.sizes : [sizeName];
      let updatedSizeStocks = col.sizeStocks && col.sizeStocks.length > 0 ? [...col.sizeStocks] : currentSizes.map(s => ({ size: s, stock: 0 }));

      const existingIdx = updatedSizeStocks.findIndex((s) => s.size === sizeName);
      if (existingIdx >= 0) {
        updatedSizeStocks[existingIdx] = {
          ...updatedSizeStocks[existingIdx],
          stock: safeQty,
        };
      } else {
        updatedSizeStocks.push({ size: sizeName, stock: safeQty });
      }

      const newColorStock = updatedSizeStocks.reduce((sum, s) => sum + (Number(s.stock) || 0), 0);

      return {
        ...col,
        sizeStocks: updatedSizeStocks,
        stock: newColorStock,
      };
    });

    setVariantDrafts((prev) => ({
      ...prev,
      [productId]: updatedVariants,
    }));
  };

  // Check if a product has pending unsaved variant or size changes
  const hasChanges = (p: Product): boolean => {
    const draftList = variantDrafts[p.id];
    if (!draftList) return false;
    const originalColors = p.colors && p.colors.length > 0 ? p.colors : [
      {
        id: "col-default",
        name: p.color || "Standard Shade",
        stock: p.stock || 0,
        image: p.image || "",
        hasSizes: (p.sizes && p.sizes.length > 0) || false,
        sizes: p.sizes || [],
        sizeStocks: (p.sizes || []).map((s) => ({ size: s, stock: 0 })),
      }
    ];

    if (draftList.length !== originalColors.length) return true;

    for (let i = 0; i < draftList.length; i++) {
      const draftCol = draftList[i];
      const origCol = originalColors[i];
      if (!origCol) return true;
      if (draftCol.stock !== origCol.stock) return true;

      const draftSizes = draftCol.sizeStocks || [];
      const origSizes = origCol.sizeStocks || [];
      if (draftSizes.length !== origSizes.length) return true;

      for (const ds of draftSizes) {
        const os = origSizes.find((s) => s.size === ds.size);
        if (!os || os.stock !== ds.stock) return true;
      }
    }
    return false;
  };

  // Calculate new total stock for a product based on drafts
  const getDraftTotalStock = (p: Product): number => {
    const variants = getProductVariants(p);
    return variants.reduce((sum, c) => sum + (Number(c.stock) || 0), 0);
  };

  // Save color and size stock changes to MongoDB Atlas and update store
  const saveColorStockChanges = async (p: Product) => {
    const updatedVariants = getProductVariants(p);
    const newTotalStock = updatedVariants.reduce((sum, c) => sum + (Number(c.stock) || 0), 0);
    const allSizes = Array.from(new Set(updatedVariants.flatMap((c) => c.sizes || [])));

    const updatedProduct: Product = {
      ...p,
      colors: updatedVariants,
      stock: newTotalStock,
      color: updatedVariants[0]?.name || p.color,
      sizes: allSizes.length > 0 ? allSizes : p.sizes,
    };

    setSavingProductId(p.id);
    try {
      // Optimistic update in client store
      update(
        "products",
        products.map((item) => (item.id === p.id ? updatedProduct : item)),
      );

      // Persist to MongoDB Atlas backend
      await saveProduct(updatedProduct);

      // Clear draft for this product
      setVariantDrafts((prev) => {
        const next = { ...prev };
        delete next[p.id];
        return next;
      });

      setSuccessMessage(`✓ Stock updated successfully for "${p.name}" (Total: ${newTotalStock} units)`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert("Error saving stock changes to database: " + err.message);
    } finally {
      setSavingProductId(null);
    }
  };

  return (
    <AdminShell
      title="Atelier Inventory Control & Stock Upgrades"
      subtitle="Search by Slug Number or SKU to inspect colour-wise and size-wise stock and upgrade quantities using Plus (+) and Minus (-)."
    >
      {/* 1. Overview Metric Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <div className={card}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Total Inventory Valuation
          </p>
          <p className="mt-2 font-serif text-3xl font-medium text-primary">{inr(totalValuation)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across active atelier garments</p>
        </div>

        <div className={card}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Total Units On Hand
          </p>
          <p className="mt-2 font-serif text-3xl font-medium text-primary">{totalStockUnits} Units</p>
          <p className="mt-1 text-xs text-muted-foreground">Physical items in Tilak Path boutique</p>
        </div>

        <div className={card}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Ready-to-Wear Stock
          </p>
          <p className="mt-2 font-serif text-3xl font-medium text-emerald-700">{readymadeUnits} Units</p>
          <p className="mt-1 text-xs text-muted-foreground">Available for immediate shipping</p>
        </div>

        <div className={card}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Rental Studio Wardrobe
          </p>
          <p className="mt-2 font-serif text-3xl font-medium text-purple-700">{rentalUnits} Units</p>
          <p className="mt-1 text-xs text-muted-foreground">Photoshoot &amp; bridal trail gowns</p>
        </div>
      </div>

      {/* 2. Success Alert Banner */}
      {successMessage && (
        <div className="mb-6 rounded-2xl border-2 border-emerald-400 bg-emerald-50/90 p-4 shadow-sm flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-emerald-900">
              {successMessage}
            </span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Search by Slug Number / Barcode / SKU */}
      <div className={`${card} mb-8 border-gold-300/60 shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Slug Number, SKU (e.g. GMC-1001), Barcode, or Garment Name..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setSpotlightId(null);
              }}
              className="w-full rounded-2xl border border-border/80 bg-background/50 pl-10 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono placeholder:font-sans"
            />
            {q && (
              <button
                onClick={() => {
                  setQ("");
                  setSpotlightId(null);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground p-1"
                title="Clear Search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="rounded-xl border border-border/80 bg-background/50 px-3.5 py-3 text-xs font-medium text-foreground outline-none focus:border-primary"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-border/80 bg-background/50 px-3.5 py-3 text-xs font-medium text-foreground outline-none focus:border-primary"
            >
              <option value="All">All Acquisition Modes</option>
              <option value="readymade">Ready-to-Wear</option>
              <option value="rental">Rental Studio</option>
            </select>
          </div>
        </div>

        {/* Helpful Slug Search Hints */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-semibold text-primary">Quick Search by Slug / SKU:</span>
          {products.slice(0, 4).map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setQ(p.sku || String(p.id));
                setSpotlightId(p.id);
              }}
              className="rounded-lg bg-muted/60 hover:bg-muted px-2 py-0.5 font-mono text-[10px] text-foreground border border-border/60 transition-colors"
            >
              {p.sku || `#${p.id}`}
            </button>
          ))}
          {products.length === 0 && <span>No products in catalog yet.</span>}
        </div>
      </div>

      {/* =========================================================================
          4. SPOTLIGHT: COLOUR & SIZE-WISE STOCK INSPECTION & UPGRADE CARD
          (Appears prominently when searching or selecting any product)
          ========================================================================= */}
      {spotlightProduct && (
        <div className="mb-10 rounded-3xl border-2 border-gold-400/60 bg-white p-6 sm:p-8 shadow-lift animate-fade-up">
          
          {/* Spotlight Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
            <div className="flex items-center gap-4">
              {spotlightProduct.image ? (
                <img
                  src={spotlightProduct.image}
                  alt={spotlightProduct.name}
                  className="h-18 w-16 sm:h-20 sm:w-18 rounded-2xl border border-border object-cover shadow-sm shrink-0"
                />
              ) : (
                <div className="flex h-18 w-16 sm:h-20 sm:w-18 items-center justify-center rounded-2xl bg-muted text-xs text-muted-foreground shrink-0">
                  No Pic
                </div>
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-medium text-primary">
                    {spotlightProduct.name}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      spotlightProduct.type === "rental"
                        ? "bg-purple-100 text-purple-900 border border-purple-200"
                        : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                    }`}
                  >
                    {spotlightProduct.type === "rental" ? "Rental Studio" : "Ready-Made"}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded-md">
                    <Tag className="h-3 w-3 text-gold-600" />
                    Slug / SKU: {spotlightProduct.sku || `#${spotlightProduct.id}`}
                  </span>
                  {spotlightProduct.barcode && (
                    <span className="flex items-center gap-1 font-mono text-[11px] bg-muted/60 px-2 py-0.5 rounded-md">
                      <Barcode className="h-3 w-3 text-muted-foreground" />
                      Barcode: {spotlightProduct.barcode}
                    </span>
                  )}
                  <span>Category: <strong className="text-foreground">{spotlightProduct.category}</strong></span>
                  {spotlightProduct.subcategory && (
                    <span>Subcategory: <strong className="text-foreground">{spotlightProduct.subcategory}</strong></span>
                  )}
                </div>
              </div>
            </div>

            {/* Total Stock Counter */}
            <div className="text-right sm:self-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Total Stock
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-primary">
                  {getDraftTotalStock(spotlightProduct)}
                </span>
                <span className="text-xs text-muted-foreground font-medium">units</span>
              </div>
              {hasChanges(spotlightProduct) && (
                <span className="text-[10px] font-bold text-amber-600 animate-pulse">
                  Unsaved Upgrades
                </span>
              )}
            </div>
          </div>

          {/* Colour & Size-Wise Breakdown & Controls */}
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h3 className="font-serif text-base font-semibold text-foreground flex items-center gap-2">
                <Palette className="h-4 w-4 text-gold-600" />
                <span>Colour &amp; Size-Wise Current Quantity &amp; Stock Upgrades</span>
              </h3>
              <span className="text-xs text-muted-foreground">
                Use <strong className="text-foreground">Plus (+)</strong> and <strong className="text-foreground">Minus (-)</strong> to update quantities per size.
              </span>
            </div>

            <div className="space-y-4">
              {getProductVariants(spotlightProduct).map((col, idx) => {
                const origVariants = spotlightProduct.colors && spotlightProduct.colors.length > 0 
                  ? spotlightProduct.colors 
                  : [{ id: "col-default", name: spotlightProduct.color, stock: spotlightProduct.stock, sizes: spotlightProduct.sizes, sizeStocks: [] }];
                const origCol = origVariants[idx] || origVariants[0] || col;

                const currentOriginalStock = origCol.stock;
                const draftStock = col.stock;
                const isModified = draftStock !== currentOriginalStock;
                const diff = draftStock - currentOriginalStock;

                const hasSizes = (col.hasSizes ?? false) || (col.sizes && col.sizes.length > 0) || (col.sizeStocks && col.sizeStocks.length > 0);
                const sizeStocksList: ProductSizeStock[] = col.sizeStocks && col.sizeStocks.length > 0
                  ? col.sizeStocks
                  : (col.sizes || []).map((sz) => ({ size: sz, stock: 0 }));

                return (
                  <div
                    key={col.id || idx}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                      isModified
                        ? "border-amber-400 bg-amber-50/30 shadow-xs"
                        : "border-border/80 bg-white hover:border-gold-300/60"
                    }`}
                  >
                    {/* Top Row: Color Details, Swatch & Color Stock Summary */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3.5 mb-3.5">
                      <div className="flex items-center gap-3.5">
                        {col.image ? (
                          <img
                            src={col.image}
                            alt={col.name}
                            className="h-12 w-12 rounded-xl object-cover border border-border shadow-2xs shrink-0"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-serif font-bold text-xs shrink-0">
                            {(col.name || "ST").slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-base font-semibold text-foreground">
                              {col.name || "Standard Color"}
                            </h4>
                            {isModified && (
                              <span className="rounded-md bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 text-[10px] font-bold">
                                {diff > 0 ? `+${diff} Added` : `${diff} Reduced`}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span>
                              Current in Atelier:{" "}
                              <strong className="text-foreground font-semibold">{currentOriginalStock} units</strong>
                            </span>
                            {hasSizes && (
                              <span className="text-[11px] text-[#E5252A] font-semibold">
                                Sizes: [{sizeStocksList.map(s => s.size).join(", ")}]
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Color Total Stock & Fallback Direct Stepper if no sizes */}
                      <div className="flex items-center gap-3 sm:self-center">
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">
                            Colour Total
                          </span>
                          <span className="font-serif text-xl font-bold text-primary">
                            {draftStock} <span className="text-xs font-normal text-muted-foreground">units</span>
                          </span>
                        </div>

                        {!hasSizes && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center rounded-2xl border-2 border-border/80 bg-background p-1 shadow-xs">
                              <button
                                type="button"
                                onClick={() => handleColorStockChange(spotlightProduct.id, idx, draftStock - 1)}
                                disabled={draftStock <= 0}
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-foreground hover:bg-rose-50 hover:text-rose-600 border border-border/60 transition-colors disabled:opacity-40"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={draftStock}
                                onChange={(e) =>
                                  handleColorStockChange(
                                    spotlightProduct.id,
                                    idx,
                                    Number(e.target.value) || 0,
                                  )
                                }
                                className="w-16 text-center font-serif text-lg font-bold text-primary outline-none bg-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => handleColorStockChange(spotlightProduct.id, idx, draftStock + 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-foreground hover:bg-emerald-50 hover:text-emerald-700 border border-border/60 transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleColorStockChange(spotlightProduct.id, idx, draftStock + 5)}
                              className="rounded-xl border border-border bg-white px-2.5 py-2 text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                            >
                              +5
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Size-Wise Upgrade Grid when Color Has Sizes */}
                    {hasSizes && (
                      <div className="pt-1">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <SparkleIcon className="h-3.5 w-3.5 text-gold-600" />
                            <span>Upgrade Stock By Size for &quot;{col.name || "Colour"}&quot;:</span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Color total sums automatically: <strong className="text-foreground">{draftStock}</strong>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                          {sizeStocksList.map((szObj) => {
                            const sz = szObj.size;
                            const currentQty = szObj.stock;
                            const origSizeStock = origCol.sizeStocks?.find((s) => s.size === sz)?.stock ?? currentQty;
                            const sizeDiff = currentQty - origSizeStock;
                            const isSizeModified = sizeDiff !== 0;

                            return (
                              <div
                                key={sz}
                                className={`flex flex-col justify-between rounded-xl border p-2.5 transition-all ${
                                  isSizeModified
                                    ? "border-amber-400 bg-amber-50/60 shadow-2xs ring-1 ring-amber-300"
                                    : currentQty > 0
                                    ? "border-[#E5252A]/40 bg-red-50/20"
                                    : "border-border/80 bg-white"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded-lg text-xs font-bold border ${
                                        currentQty > 0
                                          ? "bg-[#E5252A] text-white border-[#E5252A]"
                                          : "bg-muted/60 text-foreground border-border/80"
                                      }`}
                                    >
                                      {sz}
                                    </span>
                                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                                      Size
                                    </span>
                                  </div>

                                  {isSizeModified && (
                                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.2 rounded">
                                      {sizeDiff > 0 ? `+${sizeDiff}` : sizeDiff}
                                    </span>
                                  )}
                                </div>

                                {/* Stepper controls */}
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSizeStockChange(
                                        spotlightProduct.id,
                                        idx,
                                        sz,
                                        Math.max(0, currentQty - 1)
                                      )
                                    }
                                    disabled={currentQty <= 0}
                                    className="h-8 w-8 rounded-lg border border-border bg-white hover:bg-rose-50 hover:text-rose-600 text-sm font-bold text-foreground flex items-center justify-center transition-colors disabled:opacity-40"
                                    title={`Decrease ${sz} quantity`}
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>

                                  <input
                                    type="number"
                                    min="0"
                                    value={currentQty}
                                    onChange={(e) =>
                                      handleSizeStockChange(
                                        spotlightProduct.id,
                                        idx,
                                        sz,
                                        Math.max(0, parseInt(e.target.value) || 0)
                                      )
                                    }
                                    className="h-8 w-full rounded-lg border border-border/80 text-center text-xs font-bold text-primary bg-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSizeStockChange(
                                        spotlightProduct.id,
                                        idx,
                                        sz,
                                        currentQty + 1
                                      )
                                    }
                                    className="h-8 w-8 rounded-lg border border-border bg-white hover:bg-emerald-50 hover:text-emerald-700 text-sm font-bold text-foreground flex items-center justify-center transition-colors"
                                    title={`Increase ${sz} quantity`}
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>

                                  {/* Quick +5 */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSizeStockChange(
                                        spotlightProduct.id,
                                        idx,
                                        sz,
                                        currentQty + 5
                                      )
                                    }
                                    className="h-8 rounded-lg border border-border bg-white px-1.5 text-[10.5px] font-semibold text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                                    title={`Add 5 units to ${sz}`}
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

            {/* Spotlight Footer Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/80 pt-5">
              <div className="text-xs text-muted-foreground">
                {hasChanges(spotlightProduct) ? (
                  <span className="text-amber-800 font-medium flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    Unsaved stock changes pending. Click &quot;Save Stock Upgrades&quot; to commit to MongoDB.
                  </span>
                ) : (
                  <span>All colour and size quantities are synchronized with warehouse ledger.</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {hasChanges(spotlightProduct) && (
                  <button
                    type="button"
                    onClick={() => {
                      setVariantDrafts((prev) => {
                        const next = { ...prev };
                        delete next[spotlightProduct.id];
                        return next;
                      });
                    }}
                    className="rounded-xl border border-border bg-white px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    Discard Changes
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => saveColorStockChanges(spotlightProduct)}
                  disabled={savingProductId === spotlightProduct.id}
                  className="rounded-xl bg-primary px-7 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lift hover:opacity-95 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {savingProductId === spotlightProduct.id ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Updating Database...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-gold-300" />
                      <span>Save Stock Upgrades</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. COMPLETE INVENTORY LEDGER TABLE WITH COLOUR & SIZE BREAKDOWN
          ========================================================================= */}
      <div className={`${card} overflow-hidden p-0`}>
        <div className="border-b border-border/80 bg-muted/20 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-semibold text-foreground">
              Master Garment Inventory
            </h3>
            <p className="text-xs text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products in catalog.
            </p>
          </div>
          {q && (
            <span className="text-xs text-primary font-medium">
              Filtered by: &ldquo;{q}&rdquo;
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="border-b border-border/80 bg-muted/40 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Outfit Details</th>
                <th className="px-5 py-4">Slug / SKU</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Pricing</th>
                <th className="px-5 py-4">Colour &amp; Size Breakdown</th>
                <th className="px-5 py-4">Total Stock</th>
                <th className="px-5 py-4 text-right">Adjust Stock Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredProducts.map((p) => {
                const variants = getProductVariants(p);
                const isSelected = spotlightProduct?.id === p.id;
                const draftTotal = getDraftTotalStock(p);
                const hasPending = hasChanges(p);

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isSelected ? "bg-gold-50/40" : "hover:bg-muted/20"
                    }`}
                  >
                    {/* Outfit Details */}
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
                        <div className="min-w-0">
                          <span className="font-medium text-foreground block truncate">{p.name}</span>
                          <span className="text-[11px] text-muted-foreground block truncate">
                            {p.fabric || "Haute Fabric"} · {p.color || "Multi"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Slug / SKU */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-bold text-foreground bg-muted px-2 py-1 rounded-md inline-block">
                        {p.sku || `#${p.id}`}
                      </span>
                      {p.barcode && (
                        <span className="block text-[10px] text-muted-foreground font-mono mt-0.5">
                          {p.barcode}
                        </span>
                      )}
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

                    {/* Colour & Size Breakdown */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2 max-w-[300px]">
                        {variants.map((c, cIdx) => (
                          <div
                            key={c.id || cIdx}
                            className="inline-flex flex-col rounded-lg border border-border/80 bg-white px-2.5 py-1 text-[11px] font-medium shadow-2xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-muted-foreground truncate max-w-[90px] font-semibold">
                                {c.name || "Colour"}:
                              </span>
                              <span className="font-bold text-primary">{c.stock} units</span>
                            </div>
                            {c.sizeStocks && c.sizeStocks.length > 0 && (
                              <div className="flex flex-wrap gap-1 text-[10px] text-muted-foreground border-t border-border/50 pt-0.5 mt-0.5">
                                {c.sizeStocks.map((s) => (
                                  <span key={s.size} className="bg-muted/60 px-1 rounded text-foreground font-medium">
                                    {s.size}: <strong>{s.stock}</strong>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total Stock */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            draftTotal === 0
                              ? "bg-rose-100 text-rose-800"
                              : draftTotal <= 3
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {draftTotal === 0
                            ? "Out of Stock"
                            : `${draftTotal} units`}
                        </span>
                        {hasPending && (
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" title="Unsaved changes" />
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewProduct(p)}
                          className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setSpotlightId(p.id);
                            setQ(p.sku || p.name);
                            window.scrollTo({ top: 380, behavior: "smooth" });
                          }}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors flex items-center gap-1 ${
                            isSelected
                              ? "bg-primary text-white border-primary"
                              : "border-primary/40 bg-primary/5 text-primary hover:bg-primary hover:text-white"
                          }`}
                        >
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => removeProduct(p.id)}
                          className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No atelier garments found matching your search criteria.
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
                <h3 className="font-display text-xl text-primary">Inventory Stock Dossier</h3>
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
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {viewProduct.stock} Total Units in Stock
                  </span>
                  <h4 className="font-display text-lg text-primary mt-1.5 truncate">{viewProduct.name}</h4>
                  <p className="text-xs text-muted-foreground">Category: {viewProduct.category} {viewProduct.subcategory ? `· ${viewProduct.subcategory}` : ""}</p>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {viewProduct.type === "rental" ? `Rental: ${inr(viewProduct.rentalPrice)}` : `Price: ${inr(viewProduct.price)}`}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {viewProduct.sku && (
                      <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-foreground">
                        SKU: {viewProduct.sku}
                      </span>
                    )}
                    {viewProduct.barcode && (
                      <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-foreground">
                        Barcode: {viewProduct.barcode}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/30 p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sizes Enabled:</span>
                  <span className="font-semibold text-foreground">[{viewProduct.sizes.join(", ")}]</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Default Color:</span>
                  <span className="font-semibold text-foreground">{viewProduct.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inventory Valuation:</span>
                  <span className="font-semibold text-primary">{inr(viewProduct.stock * viewProduct.price)}</span>
                </div>
              </div>

              {viewProduct.colors && viewProduct.colors.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">Color & Size Inventory:</span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {viewProduct.colors.map((c, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-white border border-border/80 px-2.5 py-1.5 text-xs">
                        <span className="font-semibold text-foreground">{c.name || "Default"}: <strong className="text-primary">{c.stock} units</strong></span>
                        {c.sizeStocks && c.sizeStocks.length > 0 ? (
                          <span className="text-[10px] text-muted-foreground">
                            {c.sizeStocks.map((s) => `${s.size}:${s.stock}`).join(" ")}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">[{c.sizes?.join(", ")}]</span>
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
                    setSpotlightId(p.id);
                    setQ(p.sku || p.name);
                    window.scrollTo({ top: 380, behavior: "smooth" });
                  }}
                  className="rounded-xl border border-primary/40 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  Adjust Stock Levels
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
    </AdminShell>
  );
}

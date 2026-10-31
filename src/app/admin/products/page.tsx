"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdminShell, { btn, btnGhost, card, input } from "@/components/admin/AdminShell";
import { inr, type Product, type ProductColorVariant, type ProductSizeStock } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { SparkleIcon } from "@/components/site/Icons";
import { ArrowRight, Upload, X } from "lucide-react";

const blank = (id: number, defaultCategory: string, defaultSubcategory?: string): Product => ({
  id,
  name: "",
  sku: `GMC-${Math.floor(1000 + Math.random() * 9000)}`,
  barcode: `890${Math.floor(100000000 + Math.random() * 900000000)}`,
  brand: "Gadhinglaj Models Club Atelier",
  category: defaultCategory,
  subcategory: defaultSubcategory || "",
  type: "readymade",
  price: 0,
  mrp: 0,
  rentalPrice: 0,
  deposit: 0,
  rentalDuration: "3 days (extendable)",
  rating: 4.8,
  reviews: 0,
  sizes: ["S", "M", "L", "XL"],
  color: "",
  fabric: "",
  sareeLength: "",
  offerText: "",
  tags: [],
  occasion: "",
  stock: 1,
  featured: false,
  newArrival: true,
  isPremium: false,
  isTrending: false,
  isLiveSpecial: false,
  isLimitedOffer: false,
  prebookingEnabled: false,
  colors: [
    {
      id: "col-1",
      name: "",
      stock: 1,
      image: "",
      hasSizes: false,
      sizes: ["S", "M", "L", "XL"],
    },
  ],
  active: true,
  available: true,
  image: "",
  description: "",
});

export default function AdminProductsPage() {
  const { products, categories, subcategories, saveProduct, deleteProduct, uploadImage, update } = useStore();
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [cat, setCat] = useState("All");
  const [subCat, setSubCat] = useState("All");
  const [draft, setDraft] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  // Available subcategories for the selected Category filter
  const availableSubcategoriesForFilter = useMemo(() => {
    if (cat === "All") return subcategories;
    return subcategories.filter((s) => s.categoryName === cat);
  }, [subcategories, cat]);

  // Available sizes according to chosen Sub Category (from its sizeTemplate)
  const availableSizesForCurrentSub = useMemo(() => {
    if (!draft) return ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
    const subObj =
      subcategories.find(
        (s) =>
          s.name === draft.subcategory &&
          (s.categoryName === draft.category || !draft.category)
      ) || subcategories.find((s) => s.name === draft.subcategory);

    if (subObj?.sizeTemplate && subObj.sizeTemplate.trim()) {
      const parsed = subObj.sizeTemplate
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (parsed.length > 0) return parsed;
    }
    return ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
  }, [subcategories, draft?.subcategory, draft?.category]);

  const handleToggleHasSizes = (colorIdx: number, hasSizes: boolean) => {
    if (!draft) return;
    const updated = [...(draft.colors || [])];
    const targetCol = { ...updated[colorIdx] };
    targetCol.hasSizes = hasSizes;

    if (hasSizes) {
      if (!targetCol.sizeStocks || targetCol.sizeStocks.length === 0) {
        targetCol.sizeStocks = availableSizesForCurrentSub.map((sz) => ({
          size: sz,
          stock: 0,
        }));
        targetCol.sizes = availableSizesForCurrentSub;
        targetCol.stock = 0;
      } else {
        targetCol.stock = targetCol.sizeStocks.reduce(
          (sum, s) => sum + (Number(s.stock) || 0),
          0
        );
      }
    }

    updated[colorIdx] = targetCol;
    const newProductStock = updated.reduce(
      (sum, c) => sum + (Number(c.stock) || 0),
      0
    );

    setDraft({
      ...draft,
      colors: updated,
      stock: newProductStock,
    });
  };

  const handleSizeStockChange = (
    colorIdx: number,
    sizeName: string,
    newQty: number
  ) => {
    if (!draft) return;
    const safeQty = Math.max(0, isNaN(newQty) ? 0 : newQty);
    const updatedColors = [...(draft.colors || [])];
    const targetCol = { ...updatedColors[colorIdx] };

    // Get current sizeStocks or initialize from availableSizesForCurrentSub
    let existingStocks: ProductSizeStock[] = targetCol.sizeStocks
      ? [...targetCol.sizeStocks]
      : availableSizesForCurrentSub.map((s) => ({ size: s, stock: 0 }));

    const existingIdx = existingStocks.findIndex((s) => s.size === sizeName);
    if (existingIdx >= 0) {
      existingStocks[existingIdx] = {
        ...existingStocks[existingIdx],
        stock: safeQty,
      };
    } else {
      existingStocks.push({ size: sizeName, stock: safeQty });
    }

    // Color total stock is sum of all size stocks
    const colorTotal = existingStocks.reduce(
      (sum, s) => sum + (Number(s.stock) || 0),
      0
    );
    const activeSizes = existingStocks
      .filter((s) => s.stock > 0)
      .map((s) => s.size);

    targetCol.sizeStocks = existingStocks;
    targetCol.sizes =
      activeSizes.length > 0 ? activeSizes : availableSizesForCurrentSub;
    targetCol.stock = colorTotal;

    updatedColors[colorIdx] = targetCol;

    const overallProductStock = updatedColors.reduce(
      (sum, c) => sum + (Number(c.stock) || 0),
      0
    );
    const allProductSizes = Array.from(
      new Set(updatedColors.flatMap((c) => c.sizes || []))
    );

    setDraft({
      ...draft,
      colors: updatedColors,
      stock: overallProductStock,
      sizes:
        allProductSizes.length > 0
          ? allProductSizes
          : availableSizesForCurrentSub,
    });
  };

  // Available subcategories for the active draft product
  const availableSubcategoriesForDraft = useMemo(() => {
    if (!draft) return [];
    return subcategories.filter((s) => s.categoryName === draft.category);
  }, [subcategories, draft?.category]);

  const list = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) &&
          (type === "All" || p.type === type) &&
          (cat === "All" || p.category === cat) &&
          (subCat === "All" || p.subcategory === subCat),
      ),
    [products, q, type, cat, subCat],
  );

  const save = async () => {
    if (!draft || !draft.name.trim()) {
      alert("Please enter a product name.");
      return;
    }
    if (!draft.category) {
      alert("Please select a Category first.");
      return;
    }

    try {
      setSavingProduct(true);
      // Calculate total stock from colors if defined
      const totalStock =
        draft.colors && draft.colors.length > 0
          ? draft.colors.reduce((sum, c) => sum + (Number(c.stock) || 0), 0)
          : draft.stock;

      // Use primary color name if present
      const primaryColor = draft.colors?.[0]?.name || draft.color || "Standard";
      // Use first color image if product image is empty
      const primaryImage = draft.image || draft.colors?.find((c) => c.image)?.image || "";

      // Ensure proper rental pricing and deposit configuration
      const isRental = draft.type === "rental";
      const rentalPrice = isRental
        ? Number(draft.rentalPrice) || Math.round((Number(draft.price) || 3500) * 0.4) || 1999
        : Number(draft.rentalPrice) || 0;
      const deposit = isRental
        ? Number(draft.deposit) || rentalPrice * 2 || 3999
        : Number(draft.deposit) || 0;

      const finalDraft: Product = {
        ...draft,
        type: isRental ? "rental" : "readymade",
        rentalPrice,
        deposit,
        rentalDuration: draft.rentalDuration || "3 days (extendable)",
        stock: totalStock,
        color: primaryColor,
        image: primaryImage,
      };

      await saveProduct(finalDraft);
      setDraft(null);
    } catch (err: any) {
      alert("Error saving product to MongoDB: " + err.message);
    } finally {
      setSavingProduct(false);
    }
  };

  const patch = (id: number, changes: Partial<Product>) =>
    update("products", products.map((p) => (p.id === id ? { ...p, ...changes } : p)));

  const remove = async (id: number) => {
    if (confirm("Are you sure you want to remove this piece from the catalog?")) {
      try {
        await deleteProduct(id);
      } catch (err: any) {
        alert("Error deleting product from MongoDB: " + err.message);
      }
    }
  };

  const handleCategoryChange = (newCat: string) => {
    const matchingSubs = subcategories.filter((s) => s.categoryName === newCat);
    const defaultSub = matchingSubs[0];
    setDraft((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        category: newCat,
        subcategory: defaultSub ? defaultSub.name : "",
        sizes:
          defaultSub?.sizeTemplate && prev.sizes.length === 0
            ? defaultSub.sizeTemplate.split(",").map((s) => s.trim())
            : prev.sizes,
      };
    });
  };

  const handleSubcategoryChange = (newSubName: string) => {
    const subObj = subcategories.find((s) => s.name === newSubName);
    setDraft((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        subcategory: newSubName,
        sizes:
          subObj?.sizeTemplate
            ? subObj.sizeTemplate.split(",").map((s) => s.trim())
            : prev.sizes,
      };
    });
  };

  const startNewProduct = () => {
    if (categories.length === 0) {
      alert("Atelier Workflow: Please create a Category and Subcategory first before adding a Product.");
      return;
    }
    const firstCat = categories[0].name;
    const matchingSubs = subcategories.filter((s) => s.categoryName === firstCat);
    const firstSub = matchingSubs[0]?.name || "";
    setDraft(blank(Math.max(0, ...products.map((p) => p.id)) + 1, firstCat, firstSub));
  };

  const editProduct = (p: Product) => {
    // Ensure colors array exists on legacy products
    const initialColors: ProductColorVariant[] =
      p.colors && p.colors.length > 0
        ? p.colors
        : [
            {
              id: "col-1",
              name: p.color || "Standard",
              stock: p.stock || 1,
              image: p.image || "",
              hasSizes: (p.sizes && p.sizes.length > 0) || false,
              sizes: p.sizes || ["S", "M", "L", "XL"],
            },
          ];

    setDraft({
      ...p,
      sku: p.sku || `GMC-${p.id + 1000}`,
      barcode: p.barcode || `890${p.id + 100000000}`,
      brand: p.brand || "Gadhinglaj Models Club Atelier",
      tags: p.tags || [p.fabric, p.color].filter(Boolean),
      colors: initialColors,
    });
  };

  return (
    <AdminShell
      title="Couture Product Catalog"
      subtitle="Step 3 in Atelier Workflow: Products are categorized by Category and Sub Category."
      action={
        <button className={btn} onClick={startNewProduct}>
          <span>+</span>
          <span>Add Variant Product</span>
        </button>
      }
    >
      {categories.length === 0 && (
        <div className="mb-6 rounded-2xl border-2 border-amber-300 bg-amber-50/80 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏷️</span>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Step 1 Required: Create Category &amp; Subcategory
              </h4>
              <p className="text-xs text-amber-800">
                All dummy data has been removed. Products require an active Category. Please create your first category to get started.
              </p>
            </div>
          </div>
          <Link
            href="/admin/categories"
            className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
          >
            Create Category Now →
          </Link>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-1">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Search Wardrobe
          </label>
          <input
            placeholder="Search by name, fabric, silhouette…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className={input}
          />
        </div>

        <div className="w-40">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Channel
          </label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={input}>
            <option value="All">All Channels</option>
            <option value="readymade">Ready-Made Purchase</option>
            <option value="rental">3-Day Rental Studio</option>
          </select>
        </div>

        {/* 1. Category Filter */}
        <div className="w-48">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            1. Category
          </label>
          <select
            value={cat}
            onChange={(e) => {
              setCat(e.target.value);
              setSubCat("All");
            }}
            className={input}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Sub Category Filter */}
        <div className="w-48">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            2. Sub Category
          </label>
          <select
            value={subCat}
            onChange={(e) => setSubCat(e.target.value)}
            className={input}
            disabled={cat !== "All" && availableSubcategoriesForFilter.length === 0}
          >
            <option value="All">
              {cat === "All" ? "All Subcategories" : `All ${cat} Subs`}
            </option>
            {availableSubcategoriesForFilter.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {(q || type !== "All" || cat !== "All" || subCat !== "All") && (
          <button
            onClick={() => {
              setQ("");
              setType("All");
              setCat("All");
              setSubCat("All");
            }}
            className="pb-2.5 text-xs text-primary underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* =========================================================================
          MODAL: ADD / EDIT VARIANT PRODUCT (Matches uploaded 4 screenshots exactly)
          ========================================================================= */}
      {draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl my-auto rounded-3xl bg-white shadow-2xl border border-border/80 flex flex-col max-h-[92vh] overflow-hidden animate-fade-up">
            
            {/* Modal Top Header */}
            <div className="flex items-center justify-between border-b border-border/80 px-6 sm:px-8 py-5 bg-white shrink-0">
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-foreground tracking-tight">
                {products.some((p) => p.id === draft.id)
                  ? "Edit Variant Product"
                  : "Add Variant Product"}
              </h2>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted/60 transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              
              {/* ----------------------------------------------------
                  SECTION 1: Basic Information (Screenshot 1)
                  ---------------------------------------------------- */}
              <div>
                <h3 className="font-serif text-base sm:text-lg font-medium text-foreground tracking-tight mb-4">
                  Basic Information
                </h3>

                {/* Product Name */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="Enter product name"
                    className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* SKU * & Barcode * */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      SKU *
                    </label>
                    <input
                      type="text"
                      value={draft.sku || ""}
                      onChange={(e) => setDraft({ ...draft, sku: e.target.value })}
                      placeholder="Enter SKU"
                      className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Barcode *
                    </label>
                    <input
                      type="text"
                      value={draft.barcode || ""}
                      onChange={(e) => setDraft({ ...draft, barcode: e.target.value })}
                      placeholder="Enter Barcode"
                      className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Original Price (₹) & Sale Price (₹) */}
                {/* Note: Wholesale Price and MOQ omitted as explicitly instructed */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      value={draft.mrp || ""}
                      onChange={(e) => setDraft({ ...draft, mrp: Number(e.target.value) })}
                      placeholder="e.g. 4000"
                      className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Sale Price (₹)
                    </label>
                    <input
                      type="number"
                      value={draft.price || ""}
                      onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
                      placeholder="e.g. 1999"
                      className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Product Acquisition / Studio Option (Rental vs Ready-to-Wear) */}
                <div className="mb-4 rounded-2xl border-2 border-gold-300/40 bg-gold-50/20 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Listing Type / Studio Availability *
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      Select &quot;Rental Option&quot; to showcase this outfit on the /rental studio page
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option 1: Ready-to-Wear */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        draft.type === "readymade"
                          ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                          : "border-border bg-white hover:bg-muted/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="productListingType"
                        value="readymade"
                        checked={draft.type === "readymade"}
                        onChange={() => setDraft({ ...draft, type: "readymade" })}
                        className="mt-1 h-4 w-4 accent-primary"
                      />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-foreground block">
                          Ready-to-Wear (Buy / Sell)
                        </span>
                        <span className="text-[11px] text-muted-foreground block mt-0.5">
                          Standard boutique purchase delivered to the client.
                        </span>
                      </div>
                    </label>

                    {/* Option 2: Rental Option */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        draft.type === "rental"
                          ? "border-[#E5252A] bg-red-50/60 ring-2 ring-red-400/40 shadow-xs"
                          : "border-border bg-white hover:bg-muted/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="productListingType"
                        value="rental"
                        checked={draft.type === "rental"}
                        onChange={() =>
                          setDraft({
                            ...draft,
                            type: "rental",
                            rentalPrice:
                              draft.rentalPrice || Math.round((draft.price || 4000) * 0.4) || 1999,
                            deposit: draft.deposit || Math.round((draft.price || 4000) * 0.8) || 3999,
                            rentalDuration: draft.rentalDuration || "3 days (extendable)",
                          })
                        }
                        className="mt-1 h-4 w-4 accent-[#E5252A]"
                      />
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-foreground block flex items-center gap-1.5">
                          <span>Rental Studio Option</span>
                          <span className="text-[9.5px] bg-[#E5252A] text-white font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
                            SHOW ON /RENTAL
                          </span>
                        </span>
                        <span className="text-[11px] text-muted-foreground block mt-0.5">
                          Will automatically appear on the Rental Studio page for 3-day bookings.
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* If Rental Option selected: show Rental Price & Security Deposit */}
                  {draft.type === "rental" && (
                    <div className="mt-4 pt-3.5 border-t border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in bg-white/70 p-3 rounded-xl border border-red-200">
                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1.5">
                          3-Day Rental Fee (₹) *
                        </label>
                        <input
                          type="number"
                          value={draft.rentalPrice || ""}
                          onChange={(e) => {
                            const rPrice = Number(e.target.value);
                            setDraft({
                              ...draft,
                              rentalPrice: rPrice,
                              deposit: draft.deposit || rPrice * 2,
                            });
                          }}
                          placeholder="e.g. 1999"
                          className="w-full rounded-xl border border-border/80 bg-white px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 font-semibold"
                        />
                        <span className="text-[10px] text-muted-foreground block mt-1">
                          Amount charged to patron for standard 3-day booking.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-primary mb-1.5">
                          Refundable Security Deposit (₹) *
                        </label>
                        <input
                          type="number"
                          value={draft.deposit || ""}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              deposit: Number(e.target.value),
                            })
                          }
                          placeholder="e.g. 3999"
                          className="w-full rounded-xl border border-border/80 bg-white px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 font-semibold"
                        />
                        <span className="text-[10px] text-muted-foreground block mt-1">
                          Refunded immediately upon return of the outfit.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category * & Subcategory */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Category *
                    </label>
                    <select
                      value={draft.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Subcategory
                    </label>
                    <select
                      value={draft.subcategory || ""}
                      onChange={(e) => handleSubcategoryChange(e.target.value)}
                      disabled={!draft.category}
                      className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
                    >
                      <option value="">
                        {draft.category ? "Select Subcategory" : "Select Category First"}
                      </option>
                      {availableSubcategoriesForDraft.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Brand
                </label>
                <input
                  type="text"
                  value={draft.brand || ""}
                  onChange={(e) => setDraft({ ...draft, brand: e.target.value })}
                  placeholder="Enter brand name"
                  className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* ----------------------------------------------------
                  SECTION 2: Additional Details (Screenshot 2)
                  ---------------------------------------------------- */}
              <div className="pt-2 border-t border-border/60">
                <h3 className="font-serif text-base sm:text-lg font-medium text-foreground tracking-tight mb-4">
                  Additional Details
                </h3>

                {/* Fabric & Saree Length (meters) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Fabric
                    </label>
                    <input
                      type="text"
                      value={draft.fabric}
                      onChange={(e) => setDraft({ ...draft, fabric: e.target.value })}
                      placeholder="e.g. Cotton, Silk"
                      className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Saree Length (meters)
                    </label>
                    <input
                      type="text"
                      value={draft.sareeLength || ""}
                      onChange={(e) => setDraft({ ...draft, sareeLength: e.target.value })}
                      placeholder="e.g. 5.5"
                      className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    placeholder="Enter description..."
                    className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-y"
                  />
                </div>

                {/* Product Card Offer Text */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Product Card Offer Text
                  </label>
                  <input
                    type="text"
                    value={draft.offerText || ""}
                    onChange={(e) => setDraft({ ...draft, offerText: e.target.value })}
                    placeholder="e.g. BUY 1 GET 1"
                    className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* ----------------------------------------------------
                  SECTION 3: Tags, Flags & Ratings (Screenshot 3)
                  ---------------------------------------------------- */}
              <div className="pt-2 border-t border-border/60 space-y-4">
                {/* Tags (comma separated) */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(draft.tags || []).join(", ")}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        tags: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Enter tags separated by comma"
                    className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* Checkbox Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-2.5 text-xs font-medium text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.featured}
                      onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#E5252A] cursor-pointer"
                    />
                    <span>Featured Product</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs font-medium text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.newArrival}
                      onChange={(e) => setDraft({ ...draft, newArrival: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#E5252A] cursor-pointer"
                    />
                    <span>New Product</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs font-medium text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.isPremium ?? false}
                      onChange={(e) => setDraft({ ...draft, isPremium: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#E5252A] cursor-pointer"
                    />
                    <span>Premium Product</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs font-medium text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.isTrending ?? false}
                      onChange={(e) => setDraft({ ...draft, isTrending: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#E5252A] cursor-pointer"
                    />
                    <span>Trending Product</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs font-medium text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.isLiveSpecial ?? false}
                      onChange={(e) => setDraft({ ...draft, isLiveSpecial: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#E5252A] cursor-pointer"
                    />
                    <span>Live Special</span>
                  </label>
                </div>

                {/* Card Checkbox 1: Limited Offer Product */}
                <div className="rounded-2xl border border-border/80 bg-white p-3.5 shadow-2xs">
                  <label className="flex items-center gap-2.5 text-xs font-medium text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.isLimitedOffer ?? false}
                      onChange={(e) => setDraft({ ...draft, isLimitedOffer: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#E5252A] cursor-pointer"
                    />
                    <span>Limited Offer Product</span>
                  </label>
                </div>

                {/* Card Checkbox 2: Enable Prebooking */}
                <div className="rounded-2xl border border-border/80 bg-white p-3.5 shadow-2xs">
                  <label className="flex items-center gap-2.5 text-xs font-medium text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.prebookingEnabled ?? false}
                      onChange={(e) =>
                        setDraft({ ...draft, prebookingEnabled: e.target.checked })
                      }
                      className="h-4 w-4 rounded accent-[#E5252A] cursor-pointer"
                    />
                    <span>Enable Prebooking</span>
                  </label>
                </div>

                {/* Rating & Reviews */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={draft.rating || ""}
                      onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
                      placeholder="0.0"
                      className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">
                      Reviews
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={draft.reviews || ""}
                      onChange={(e) => setDraft({ ...draft, reviews: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* ----------------------------------------------------
                  SECTION 4: Colors (Screenshot 4)
                  ---------------------------------------------------- */}
              <div className="pt-2 border-t border-border/60">
                <div className="border-b border-border/60 pb-2 mb-4">
                  <h3 className="font-serif text-base sm:text-lg font-medium text-foreground tracking-tight">
                    Colors
                  </h3>
                </div>

                <div className="space-y-4">
                  {(draft.colors || []).map((col, idx) => (
                    <div
                      key={col.id || idx}
                      className="relative rounded-2xl border border-border/80 bg-white p-4 sm:p-5 shadow-2xs"
                    >
                      {/* Delete X icon */}
                      {(draft.colors?.length || 0) > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (draft.colors || []).filter((_, i) => i !== idx);
                            const newTotal = updated.reduce(
                              (s, c) => s + (Number(c.stock) || 0),
                              0,
                            );
                            setDraft({ ...draft, colors: updated, stock: newTotal });
                          }}
                          className="absolute top-3.5 right-3.5 text-red-500 hover:text-red-700 text-lg leading-none"
                          title="Delete Color"
                        >
                          ✕
                        </button>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1.5">
                            Color Name
                          </label>
                          <input
                            type="text"
                            value={col.name}
                            onChange={(e) => {
                              const updated = [...(draft.colors || [])];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              setDraft({
                                ...draft,
                                colors: updated,
                                color: updated[0]?.name || draft.color,
                              });
                            }}
                            placeholder="Enter color name"
                            className="w-full rounded-xl border border-border/80 bg-background/50 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-medium text-foreground">
                              Stock {col.hasSizes ? "(From sizes)" : ""}
                            </label>
                            {col.hasSizes && (
                              <span className="text-[10px] text-[#E5252A] font-bold">
                                Auto-calculated
                              </span>
                            )}
                          </div>
                          <input
                            type="number"
                            value={col.stock}
                            disabled={col.hasSizes}
                            onChange={(e) => {
                              const updated = [...(draft.colors || [])];
                              updated[idx] = {
                                ...updated[idx],
                                stock: Number(e.target.value) || 0,
                              };
                              const newTotal = updated.reduce(
                                (s, c) => s + (Number(c.stock) || 0),
                                0,
                              );
                              setDraft({ ...draft, colors: updated, stock: newTotal });
                            }}
                            placeholder="0"
                            className={`w-full rounded-xl border border-border/80 px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 ${
                              col.hasSizes
                                ? "bg-muted/50 cursor-not-allowed font-bold text-[#E5252A]"
                                : "bg-background/50"
                            }`}
                          />
                        </div>
                      </div>

                      {/* This product has sizes */}
                      <div className="mt-3">
                        <label className="inline-flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
                          <input
                            type="checkbox"
                            checked={col.hasSizes ?? false}
                            onChange={(e) => handleToggleHasSizes(idx, e.target.checked)}
                            className="h-4 w-4 rounded accent-[#E5252A] cursor-pointer"
                          />
                          <span className="font-semibold text-foreground">This product has sizes.</span>
                        </label>

                        {col.hasSizes && (
                          <div className="mt-3 rounded-2xl border border-border/80 bg-muted/20 p-3.5 sm:p-4 space-y-3 animate-fade-in">
                            {/* Visual pill strip matching user screenshot */}
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="text-[11px] font-semibold text-muted-foreground mr-1">
                                Sizes:
                              </span>
                              {availableSizesForCurrentSub.map((sz) => {
                                const currentStock =
                                  col.sizeStocks?.find((s) => s.size === sz)?.stock ?? 0;
                                return (
                                  <span
                                    key={sz}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                                      currentStock > 0
                                        ? "bg-[#E5252A] text-white border-[#E5252A] shadow-2xs"
                                        : "bg-white text-muted-foreground border-border/80"
                                    }`}
                                  >
                                    <span>{sz}</span>
                                    {currentStock > 0 && (
                                      <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-bold">
                                        {currentStock}
                                      </span>
                                    )}
                                  </span>
                                );
                              })}
                            </div>

                            {/* Quantity according to Size */}
                            <div className="pt-2 border-t border-border/60">
                              <div className="flex items-center justify-between mb-2.5">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                  Quantity According to Size ({draft.subcategory || "Subcategory"})
                                </span>
                                <span className="text-xs font-medium text-muted-foreground">
                                  Color Total:{" "}
                                  <strong className="text-[#E5252A] font-bold text-sm">
                                    {col.stock}
                                  </strong>{" "}
                                  units
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                                {availableSizesForCurrentSub.map((sz) => {
                                  const currentQty =
                                    col.sizeStocks?.find((s) => s.size === sz)?.stock ?? 0;
                                  return (
                                    <div
                                      key={sz}
                                      className={`flex flex-col justify-between rounded-xl border p-2.5 transition-all ${
                                        currentQty > 0
                                          ? "border-[#E5252A]/60 bg-red-50/40 ring-1 ring-[#E5252A]/30"
                                          : "border-border/80 bg-white"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <span
                                          className={`inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded-lg text-xs font-bold border ${
                                            currentQty > 0
                                              ? "bg-[#E5252A] text-white border-[#E5252A]"
                                              : "bg-muted/60 text-foreground border-border/80"
                                          }`}
                                        >
                                          {sz}
                                        </span>
                                        <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                                          Qty
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleSizeStockChange(
                                              idx,
                                              sz,
                                              Math.max(0, currentQty - 1)
                                            )
                                          }
                                          className="h-8 w-8 rounded-lg border border-border bg-muted/40 hover:bg-muted text-sm font-bold text-foreground flex items-center justify-center transition-colors active:scale-95"
                                          title="Decrease quantity"
                                        >
                                          -
                                        </button>
                                        <input
                                          type="number"
                                          min="0"
                                          value={currentQty === 0 ? "0" : currentQty}
                                          onChange={(e) =>
                                            handleSizeStockChange(
                                              idx,
                                              sz,
                                              Math.max(0, parseInt(e.target.value) || 0)
                                            )
                                          }
                                          className="h-8 w-full rounded-lg border border-border/80 text-center text-xs font-bold text-foreground bg-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleSizeStockChange(idx, sz, currentQty + 1)
                                          }
                                          className="h-8 w-8 rounded-lg border border-border bg-muted/40 hover:bg-muted text-sm font-bold text-foreground flex items-center justify-center transition-colors active:scale-95"
                                          title="Increase quantity"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Upload Image Button */}
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          Upload Image
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="inline-flex items-center gap-2 rounded-xl bg-muted/60 hover:bg-muted px-4 py-2 text-xs font-medium text-foreground cursor-pointer border border-border/80 transition-colors">
                            <Upload className="h-3.5 w-3.5" />
                            <span>{uploadingIdx === idx ? "Uploading to Cloudinary..." : "Upload image"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingIdx === idx}
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  setUploadingIdx(idx);
                                  const cdnUrl = await uploadImage(file, "gmc_products");
                                  const updated = [...(draft.colors || [])];
                                  updated[idx] = { ...updated[idx], image: cdnUrl };
                                  setDraft({
                                    ...draft,
                                    colors: updated,
                                    image: draft.image || cdnUrl,
                                  });
                                } catch (err: any) {
                                  alert("Failed to upload image to Cloudinary: " + err.message);
                                } finally {
                                  setUploadingIdx(null);
                                }
                              }}
                            />
                          </label>

                          {col.image && (
                            <div className="flex items-center gap-2">
                              <img
                                src={col.image}
                                alt={col.name || "Preview"}
                                className="h-10 w-10 rounded-lg object-cover border border-border shadow-2xs"
                              />
                              <span className="text-[11px] text-emerald-600 font-medium">
                                Image ready
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* + Add Color Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const newColor: ProductColorVariant = {
                        id: `col-${Date.now()}`,
                        name: "",
                        stock: 0,
                        image: "",
                        hasSizes: false,
                        sizes: availableSizesForCurrentSub,
                        sizeStocks: availableSizesForCurrentSub.map((sz) => ({
                          size: sz,
                          stock: 0,
                        })),
                      };
                      setDraft({
                        ...draft,
                        colors: [...(draft.colors || []), newColor],
                      });
                    }}
                    className="w-full rounded-2xl border-2 border-dashed border-border/80 py-3.5 text-center text-xs font-medium text-muted-foreground hover:border-[#E5252A]/50 hover:text-[#E5252A] transition-colors"
                  >
                    + Add Color
                  </button>

                  {/* Total Stock Banner */}
                  <div className="rounded-xl bg-muted/40 border border-border/70 p-3.5 text-xs text-foreground/90 font-medium">
                    Total product stock is calculated from color quantities:{" "}
                    <span className="font-bold text-foreground">
                      {(draft.colors || []).reduce(
                        (sum, c) => sum + (Number(c.stock) || 0),
                        0,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* -----------------------------------------------------------------
                  SECTION 5: Rental Option Radio Selection (User's Explicit Directive)
                  "There IS a Redio Button Option In End Before Create It Will Be For Rental option"
                  ----------------------------------------------------------------- */}
              <div className="pt-2 border-t border-border/60">
                <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 sm:p-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Product Acquisition / Studio Option *
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Radio 1: Ready to wear */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        draft.type === "readymade"
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border bg-white hover:bg-muted/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="productAcquisitionChannel"
                        value="readymade"
                        checked={draft.type === "readymade"}
                        onChange={() => setDraft({ ...draft, type: "readymade" })}
                        className="mt-1 h-4 w-4 accent-primary"
                      />
                      <div>
                        <span className="font-medium text-xs sm:text-sm text-foreground block">
                          Ready-to-Wear (Purchase / Buy)
                        </span>
                        <span className="text-[11px] text-muted-foreground block mt-0.5">
                          Standard purchase delivered directly to the client.
                        </span>
                      </div>
                    </label>

                    {/* Radio 2: Rental Option */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        draft.type === "rental"
                          ? "border-[#E5252A] bg-red-50/50 ring-1 ring-[#E5252A]"
                          : "border-border bg-white hover:bg-muted/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="productAcquisitionChannel"
                        value="rental"
                        checked={draft.type === "rental"}
                        onChange={() =>
                          setDraft({
                            ...draft,
                            type: "rental",
                            rentalPrice:
                              draft.rentalPrice || Math.round((draft.price || 4000) * 0.4),
                            deposit: draft.deposit || Math.round((draft.price || 4000) * 0.8),
                          })
                        }
                        className="mt-1 h-4 w-4 accent-[#E5252A]"
                      />
                      <div>
                        <span className="font-medium text-xs sm:text-sm text-foreground block flex items-center gap-1.5">
                          Rental Option (3-Day Rental Studio)
                          <span className="text-[10px] bg-red-100 text-[#E5252A] font-bold px-1.5 py-0.5 rounded">
                            RENTAL
                          </span>
                        </span>
                        <span className="text-[11px] text-muted-foreground block mt-0.5">
                          High-fashion rental for weddings, shoots &amp; galas.
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* If Rental Option selected: show Rental Price & Security Deposit */}
                  {draft.type === "rental" && (
                    <div className="mt-4 pt-4 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          Rental Price (3 Days) (₹) *
                        </label>
                        <input
                          type="number"
                          value={draft.rentalPrice || ""}
                          onChange={(e) => {
                            const rPrice = Number(e.target.value);
                            setDraft({
                              ...draft,
                              rentalPrice: rPrice,
                              deposit: draft.deposit || rPrice * 2,
                            });
                          }}
                          placeholder="e.g. 1999"
                          className="w-full rounded-xl border border-border/80 bg-white px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          Refundable Security Deposit (₹) *
                        </label>
                        <input
                          type="number"
                          value={draft.deposit || ""}
                          onChange={(e) =>
                            setDraft({ ...draft, deposit: Number(e.target.value) })
                          }
                          placeholder="e.g. 4000"
                          className="w-full rounded-xl border border-border/80 bg-white px-3.5 py-2.5 text-sm text-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                        <span className="text-[10px] text-muted-foreground mt-1 block">
                          Refunded automatically upon return verification.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Bottom Footer (Screenshot 4: Cancel & Add Product buttons) */}
            <div className="flex items-center justify-between border-t border-border/80 px-6 sm:px-8 py-4 bg-white shrink-0">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded-xl border border-border bg-white px-7 py-2.5 text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={save}
                className="rounded-xl bg-[#E5252A] hover:bg-[#c91d22] text-white px-8 py-2.5 text-sm font-medium shadow-sm transition-colors"
              >
                {savingProduct
                  ? "Saving to Database..."
                  : products.some((p) => p.id === draft.id)
                  ? "Update Product"
                  : "Add Product"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TABLE: PRODUCTS CATALOG LISTING
          ========================================================================= */}
      <div className={`${card} overflow-hidden p-0`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b border-border/80 bg-muted/40 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Outfit Details</th>
                <th className="px-5 py-4">Category &amp; Subcategory</th>
                <th className="px-5 py-4">Mode</th>
                <th className="px-5 py-4">Pricing</th>
                <th className="px-5 py-4">Sizes &amp; Stock</th>
                <th className="px-5 py-4">Showcase Flags</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {list.map((p) => (
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
                      <div className="min-w-0">
                        <span className="font-medium text-foreground block truncate">{p.name}</span>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground truncate">
                          <span>{p.fabric || "Haute Fabric"}</span>
                          <span>·</span>
                          <span>{p.color || "Multi"}</span>
                          {p.sku && (
                            <>
                              <span>·</span>
                              <span className="font-mono text-[10px] bg-muted px-1.5 py-0.2 rounded">
                                {p.sku}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category & Subcategory display */}
                  <td className="px-5 py-4">
                    <span className="font-medium text-primary block text-xs">
                      {p.category}
                    </span>
                    {p.subcategory ? (
                      <span className="mt-0.5 inline-block rounded-md bg-blush px-2 py-0.5 text-[10.5px] font-medium text-foreground">
                        {p.subcategory}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic">
                        No Subcategory
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        p.type === "rental"
                          ? "bg-purple-100 text-purple-900 border border-purple-200"
                          : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                      }`}
                    >
                      {p.type === "rental" ? "Rental Studio" : "Ready-Made"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {p.type === "rental" ? (
                      <div>
                        <span className="font-semibold text-primary">{inr(p.rentalPrice)}</span>
                        <span className="block text-[10px] text-muted-foreground">
                          Dep: {inr(p.deposit || p.rentalPrice * 2)}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="font-semibold text-primary">{inr(p.price)}</span>
                        {p.mrp > p.price && (
                          <span className="block text-[10px] text-muted-foreground line-through">
                            {inr(p.mrp)}
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-4 text-xs">
                    <span className="font-medium text-foreground">
                      {p.stock > 0 ? `${p.stock} units` : "Out of stock"}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">
                      [{p.sizes.join(", ")}]
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1 text-[10px] font-medium uppercase tracking-wider">
                      <button
                        onClick={() => patch(p.id, { featured: !p.featured })}
                        className={`rounded-full px-2 py-0.5 transition-colors ${
                          p.featured
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {p.featured ? "★ Featured" : "Feature"}
                      </button>
                      <button
                        onClick={() => patch(p.id, { active: !p.active })}
                        className={`rounded-full px-2 py-0.5 transition-colors ${
                          p.active
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-rose-100 text-rose-800 border border-rose-300"
                        }`}
                      >
                        {p.active ? "Active" : "Hidden"}
                      </button>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs">
                      <button
                        onClick={() => setViewProduct(p)}
                        className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => editProduct(p)}
                        className="rounded-lg border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(p.id)}
                        className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!list.length && (
          <div className="py-14 text-center text-sm text-muted-foreground">
            No products found matching the specified filters.
          </div>
        )}
      </div>
      {/* View Product Details Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {viewProduct.category} {viewProduct.subcategory ? `· ${viewProduct.subcategory}` : ""}
                </span>
                <h3 className="font-serif text-2xl font-semibold text-foreground">
                  {viewProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setViewProduct(null)}
                className="text-muted-foreground hover:text-foreground p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Image & Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                {viewProduct.image ? (
                  <img
                    src={viewProduct.image}
                    alt={viewProduct.name}
                    className="aspect-[3/4] w-full rounded-2xl object-cover border border-border shadow-xs"
                  />
                ) : (
                  <div className="flex aspect-[3/4] w-full items-center justify-center rounded-2xl bg-muted text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-muted/30 p-3 rounded-xl border border-border/60">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">SKU</span>
                    <span className="font-mono font-bold text-foreground">{viewProduct.sku || `#${viewProduct.id}`}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Barcode</span>
                    <span className="font-mono text-foreground">{viewProduct.barcode || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Acquisition</span>
                    <span className="font-semibold text-primary">{viewProduct.type === "rental" ? "Rental Studio" : "Ready-Made"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Total Stock</span>
                    <span className="font-bold text-foreground text-sm">{viewProduct.stock} units</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Selling Price</span>
                    <span className="font-bold text-primary text-sm">{inr(viewProduct.price)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">MRP Price</span>
                    <span className="line-through text-muted-foreground">{inr(viewProduct.mrp)}</span>
                  </div>
                </div>

                {viewProduct.type === "rental" && (
                  <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-3 text-purple-950 flex justify-between">
                    <div>
                      <span className="block font-semibold">3-Day Rental: {inr(viewProduct.rentalPrice)}</span>
                      <span className="text-[11px] text-purple-700">Refundable Deposit: {inr(viewProduct.deposit || viewProduct.rentalPrice * 2)}</span>
                    </div>
                    <span className="text-[10px] bg-purple-200 px-2 py-0.5 rounded font-bold self-start">RENTAL</span>
                  </div>
                )}

                <div className="pt-1">
                  <span className="text-muted-foreground font-semibold block mb-1">Color Variants &amp; Sizes:</span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {(viewProduct.colors && viewProduct.colors.length > 0
                      ? viewProduct.colors
                      : [{ id: "c1", name: viewProduct.color, stock: viewProduct.stock, sizes: viewProduct.sizes, sizeStocks: [] }]
                    ).map((c, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-white border border-border/80 px-2.5 py-1 text-[11px]">
                        <span className="font-semibold text-foreground">{c.name || "Standard"}: <strong className="text-primary">{c.stock} units</strong></span>
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
              </div>
            </div>

            {viewProduct.description && (
              <div className="pt-2 border-t border-border/60">
                <span className="text-[11px] font-semibold text-muted-foreground block mb-1">Description:</span>
                <p className="text-xs text-foreground bg-muted/30 p-3 rounded-xl border border-border/60 leading-relaxed">
                  {viewProduct.description}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <Link
                href={`/product/${viewProduct.id}`}
                target="_blank"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>Open Storefront Page ↗</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const p = viewProduct;
                    setViewProduct(null);
                    editProduct(p);
                  }}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-lift"
                >
                  Edit Product
                </button>
                <button
                  onClick={() => setViewProduct(null)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

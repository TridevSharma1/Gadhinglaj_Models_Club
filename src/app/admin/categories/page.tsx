"use client";

import { useState } from "react";
import Link from "next/link";
import AdminShell, { card, input } from "@/components/admin/AdminShell";
import type { Category, SubCategory } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { SparkleIcon } from "@/components/site/Icons";
import { Upload, X, ArrowRight, Check } from "lucide-react";

export default function AdminCategoriesPage() {
  const { categories, subcategories, products, saveCategory, deleteCategory, saveSubcategory, deleteSubcategory, uploadImage, update } = useStore();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingSubcategory, setSavingSubcategory] = useState(false);
  const [activeTab, setActiveTab] = useState<"categories" | "subcategories">("categories");

  // Modal States
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);

  // Drafts
  const [draftCat, setDraftCat] = useState<Partial<Category>>({
    name: "",
    slug: "",
    blurb: "",
    description: "",
    image: "",
    active: true,
  });

  const [draftSub, setDraftSub] = useState<Partial<SubCategory>>({
    name: "",
    slug: "",
    categoryId: categories[0]?.id || 1,
    categoryName: categories[0]?.name || "Designer Gowns",
    description: "",
    sizeTemplate: "S, M, L, XL",
    image: "",
    active: true,
  });

  const [selectedParentFilter, setSelectedParentFilter] = useState<string>("All");
  const [viewCategory, setViewCategory] = useState<Category | null>(null);
  const [viewSubcategory, setViewSubcategory] = useState<SubCategory | null>(null);

  // Slug generator helper
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Open New Category Modal
  const openNewCategory = () => {
    setDraftCat({
      id: Math.max(0, ...categories.map((c) => c.id)) + 1,
      name: "",
      slug: "",
      blurb: "",
      description: "",
      image: "",
      active: true,
    });
    setCatModalOpen(true);
  };

  // Open Edit Category Modal
  const openEditCategory = (cat: Category) => {
    setDraftCat({
      ...cat,
      slug: cat.slug || slugify(cat.name),
      description: cat.description || cat.blurb || "",
    });
    setCatModalOpen(true);
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftCat.name?.trim()) return;

    try {
      setSavingCategory(true);
      const finalSlug = draftCat.slug?.trim() ? slugify(draftCat.slug) : slugify(draftCat.name);
      await saveCategory({
        id: draftCat.id,
        name: draftCat.name.trim(),
        slug: finalSlug,
        blurb: draftCat.blurb?.trim() || draftCat.description?.trim() || "",
        description: draftCat.description?.trim() || draftCat.blurb?.trim() || "",
        image: draftCat.image || "",
        active: draftCat.active ?? true,
      });
      setCatModalOpen(false);
    } catch (err: any) {
      alert("Error saving category to MongoDB: " + err.message);
    } finally {
      setSavingCategory(false);
    }
  };

  // Open New Subcategory Modal
  const openNewSubcategory = (preselectedParentId?: number) => {
    if (categories.length === 0) {
      alert("Please create at least one parent Category first before creating a Subcategory.");
      openNewCategory();
      return;
    }

    const parent =
      (preselectedParentId ? categories.find((c) => c.id === preselectedParentId) : null) ||
      categories[0];

    setDraftSub({
      id: Math.max(0, ...subcategories.map((s) => s.id)) + 1,
      name: "",
      slug: "",
      categoryId: parent.id,
      categoryName: parent.name,
      description: "",
      sizeTemplate: "S, M, L, XL",
      image: "",
      active: true,
    });
    setSubModalOpen(true);
  };

  // Open Edit Subcategory Modal
  const openEditSubcategory = (sub: SubCategory) => {
    setDraftSub({
      ...sub,
      slug: sub.slug || slugify(sub.name),
      sizeTemplate: sub.sizeTemplate || "S, M, L, XL",
    });
    setSubModalOpen(true);
  };

  // Save Subcategory
  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftSub.name?.trim()) return;

    try {
      setSavingSubcategory(true);
      const parent = categories.find((c) => c.id === Number(draftSub.categoryId)) || {
        id: Number(draftSub.categoryId),
        name: draftSub.categoryName || "Standard",
      };

      const finalSlug = draftSub.slug?.trim() ? slugify(draftSub.slug) : slugify(draftSub.name);
      await saveSubcategory({
        id: draftSub.id,
        name: draftSub.name.trim(),
        categoryId: parent.id,
        categoryName: parent.name,
        slug: finalSlug,
        description: draftSub.description?.trim() || "",
        sizeTemplate: draftSub.sizeTemplate?.trim() || "S, M, L, XL",
        image: draftSub.image || "",
        active: draftSub.active ?? true,
      });
      setSubModalOpen(false);
    } catch (err: any) {
      alert("Error saving subcategory to MongoDB: " + err.message);
    } finally {
      setSavingSubcategory(false);
    }
  };

  const handleImageUpload = async (
    file: File | undefined,
    setTarget: (url: string) => void,
  ) => {
    if (!file) return;
    try {
      setUploadingImage(true);
      const cdnUrl = await uploadImage(file, "gmc_categories");
      setTarget(cdnUrl);
    } catch (err: any) {
      alert("Failed to upload image to Cloudinary: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeCategory = async (id: number) => {
    if (confirm("Are you sure you want to delete this category and its subcategories from MongoDB?")) {
      try {
        await deleteCategory(id);
      } catch (err: any) {
        alert("Error deleting category: " + err.message);
      }
    }
  };

  const removeSubcategory = async (id: number) => {
    if (confirm("Are you sure you want to delete this subcategory from MongoDB?")) {
      try {
        await deleteSubcategory(id);
      } catch (err: any) {
        alert("Error deleting subcategory: " + err.message);
      }
    }
  };

  const filteredSubcategories = subcategories.filter(
    (s) => selectedParentFilter === "All" || s.categoryName === selectedParentFilter,
  );

  return (
    <AdminShell
      title="Category & Sub Category Management"
      subtitle="Step 1: Create Category → Step 2: Create Sub Category → Step 3: Create Products."
      action={
        <div className="flex gap-2">
          {activeTab === "categories" ? (
            <button
              onClick={openNewCategory}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lift hover:bg-primary/95 transition-all"
            >
              <span>+</span>
              <span>Add Category</span>
            </button>
          ) : (
            <button
              onClick={() => openNewSubcategory()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lift hover:bg-primary/95 transition-all"
            >
              <span>+</span>
              <span>Add Subcategory</span>
            </button>
          )}
        </div>
      }
    >
      {/* Tabs */}
      <div className="mb-6 flex gap-3 border-b border-border/80 pb-3">
        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === "categories"
              ? "bg-primary text-primary-foreground shadow-lift"
              : "bg-white border border-border text-muted-foreground hover:text-primary"
          }`}
        >
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("subcategories")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === "subcategories"
              ? "bg-primary text-primary-foreground shadow-lift"
              : "bg-white border border-border text-muted-foreground hover:text-primary"
          }`}
        >
          <span>Subcategories ({subcategories.length})</span>
        </button>
      </div>

      {/* TAB 1: CATEGORIES LIST */}
      {activeTab === "categories" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((c) => {
            const productCount = products.filter((p) => p.category === c.name).length;
            const subCount = subcategories.filter(
              (s) => s.categoryId === c.id || s.categoryName === c.name,
            ).length;

            return (
              <div
                key={c.id}
                className={`${card} group relative flex flex-col justify-between overflow-hidden p-0`}
              >
                <div className="relative h-44 w-full overflow-hidden bg-muted">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      No cover image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        c.active
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      {c.active ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <p className="text-[10px] uppercase tracking-widest text-gold-300">
                      {productCount} Outfits · {subCount} Subcategories
                    </p>
                    <h3 className="font-display text-xl text-white">{c.name}</h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {c.description || c.blurb}
                  </p>

                  <div className="mt-5 space-y-3">
                    <button
                      onClick={() => openNewSubcategory(c.id)}
                      className="w-full text-center rounded-lg border border-gold-300/60 bg-blush/40 py-1.5 text-xs font-semibold text-primary hover:bg-blush transition-colors"
                    >
                      + Add Subcategory under {c.name}
                    </button>

                    <div className="flex items-center justify-between border-t border-border/80 pt-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setViewCategory(c)}
                          className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEditCategory(c)}
                          className="rounded-lg border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeCategory(c.id)}
                          className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          update(
                            "categories",
                            categories.map((x) =>
                              x.id === c.id ? { ...x, active: !x.active } : x,
                            ),
                          )
                        }
                        className="text-[11px] text-muted-foreground hover:text-foreground"
                      >
                        {c.active ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: SUBCATEGORIES LIST */}
      {activeTab === "subcategories" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className={`${card} flex flex-wrap items-center justify-between gap-4 p-4`}>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Parent Category:
              </span>
              <select
                value={selectedParentFilter}
                onChange={(e) => setSelectedParentFilter(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none focus:border-rose"
              >
                <option value="All">All Categories ({subcategories.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => openNewSubcategory()}
              className="text-xs font-semibold text-primary hover:underline"
            >
              + Create Another Subcategory
            </button>
          </div>

          {/* Subcategories Table */}
          <div className={`${card} overflow-hidden p-0`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="border-b border-border/80 bg-muted/40 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4">Subcategory Name &amp; Slug</th>
                    <th className="px-5 py-4">Parent Category</th>
                    <th className="px-5 py-4">Size Template</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredSubcategories.map((sub) => (
                    <tr key={sub.id} className="transition-colors hover:bg-muted/20">
                      <td className="px-5 py-4">
                        <span className="font-semibold text-foreground block">{sub.name}</span>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          /{sub.slug || slugify(sub.name)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blush px-2.5 py-0.5 text-xs font-medium text-primary">
                          {sub.categoryName}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-mono text-foreground">
                          {sub.sizeTemplate || "S, M, L, XL"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            sub.active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {sub.active ? "Active" : "Disabled"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-xs">
                          <button
                            onClick={() => setViewSubcategory(sub)}
                            className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEditSubcategory(sub)}
                            className="rounded-lg border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => removeSubcategory(sub.id)}
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

            {!filteredSubcategories.length && (
              <div className="py-14 text-center text-sm text-muted-foreground">
                No subcategories found under this category filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* EXACT MODAL 1: "Add Category" (Matches uploaded screenshot) */}
      {/* ────────────────────────────────────────────────────────── */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-up">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setCatModalOpen(false)}
              className="absolute right-5 top-5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                {categories.some((c) => c.id === draftCat.id) ? "Edit Category" : "Add Category"}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Fill in the details for the category.
              </p>
            </div>

            <form onSubmit={handleSaveCategory} className="mt-6 space-y-4">
              {/* Category Image */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Category Image
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e.target.files?.[0], (url) =>
                          setDraftCat({ ...draftCat, image: url }),
                        )
                      }
                    />
                  </label>
                  {draftCat.image && (
                    <img
                      src={draftCat.image}
                      alt="Preview"
                      className="h-10 w-12 rounded-lg border border-border object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Name
                </label>
                <input
                  required
                  value={draftCat.name || ""}
                  onChange={(e) =>
                    setDraftCat({
                      ...draftCat,
                      name: e.target.value,
                      slug: draftCat.slug ? draftCat.slug : slugify(e.target.value),
                    })
                  }
                  className="w-full rounded-2xl border-2 border-rose-500 bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-rose-600 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* Slug (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Slug (Optional)
                </label>
                <input
                  placeholder="auto-generated-if-empty"
                  value={draftCat.slug || ""}
                  onChange={(e) => setDraftCat({ ...draftCat, slug: e.target.value })}
                  className="w-full rounded-2xl border border-border/80 bg-muted/20 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-rose"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={draftCat.description || ""}
                  onChange={(e) => setDraftCat({ ...draftCat, description: e.target.value })}
                  className="w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-rose resize-y"
                />
              </div>

              {/* Active Status Card with Toggle */}
              <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/10 p-4">
                <div>
                  <p className="text-xs font-semibold text-foreground">Active Status</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Enable or disable this category globally.
                  </p>
                </div>

                {/* Red/Rose Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setDraftCat({ ...draftCat, active: !draftCat.active })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    draftCat.active ? "bg-rose-500" : "bg-zinc-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      draftCat.active ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Full Width Submit Button */}
              <button
                type="submit"
                className="w-full rounded-2xl bg-rose-500 py-3.5 text-sm font-semibold text-white shadow-lift hover:bg-rose-600 transition-colors"
              >
                {categories.some((c) => c.id === draftCat.id)
                  ? "Update Category"
                  : "Create Category"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* EXACT MODAL 2: "Add Subcategory" (Matches uploaded screenshot) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-up">
          <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSubModalOpen(false)}
              className="absolute right-5 top-5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                {subcategories.some((s) => s.id === draftSub.id)
                  ? "Edit Subcategory"
                  : "Add Subcategory"}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Fill in the details for the subcategory.
              </p>
            </div>

            <form onSubmit={handleSaveSubcategory} className="mt-6 space-y-4">
              {/* Parent Category */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Parent Category
                </label>
                <select
                  required
                  value={draftSub.categoryId}
                  onChange={(e) => {
                    const parent = categories.find((c) => c.id === Number(e.target.value));
                    if (parent) {
                      setDraftSub({
                        ...draftSub,
                        categoryId: parent.id,
                        categoryName: parent.name,
                      });
                    }
                  }}
                  className="w-full rounded-2xl border-2 border-rose-500 bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-rose-600 focus:ring-1 focus:ring-rose-500"
                >
                  <option value="" disabled>
                    Select a parent category
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Image (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Subcategory Image (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e.target.files?.[0], (url) =>
                          setDraftSub({ ...draftSub, image: url }),
                        )
                      }
                    />
                  </label>
                  {draftSub.image && (
                    <img
                      src={draftSub.image}
                      alt="Preview"
                      className="h-10 w-12 rounded-lg border border-border object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Name
                </label>
                <input
                  required
                  placeholder="Subcategory name"
                  value={draftSub.name || ""}
                  onChange={(e) =>
                    setDraftSub({
                      ...draftSub,
                      name: e.target.value,
                      slug: draftSub.slug ? draftSub.slug : slugify(e.target.value),
                    })
                  }
                  className="w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-rose"
                />
              </div>

              {/* Slug (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Slug (Optional)
                </label>
                <input
                  placeholder="auto-generated-if-empty"
                  value={draftSub.slug || ""}
                  onChange={(e) => setDraftSub({ ...draftSub, slug: e.target.value })}
                  className="w-full rounded-2xl border border-border/80 bg-muted/20 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-rose"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={draftSub.description || ""}
                  onChange={(e) => setDraftSub({ ...draftSub, description: e.target.value })}
                  className="w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-rose resize-y"
                />
              </div>

              {/* Size Template (comma-separated) */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Size Template (comma-separated)
                </label>
                <input
                  placeholder="e.g. S, M, L, XL or 28, 30, 32"
                  value={draftSub.sizeTemplate || ""}
                  onChange={(e) => setDraftSub({ ...draftSub, sizeTemplate: e.target.value })}
                  className="w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-rose"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Define the sizes available for products in this subcategory.
                </p>
              </div>

              {/* Active Status Card with Toggle */}
              <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/10 p-4">
                <div>
                  <p className="text-xs font-semibold text-foreground">Active Status</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Enable or disable this subcategory globally.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDraftSub({ ...draftSub, active: !draftSub.active })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    draftSub.active ? "bg-rose-500" : "bg-zinc-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      draftSub.active ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Full Width Submit Button */}
              <button
                type="submit"
                className="w-full rounded-2xl bg-rose-500 py-3.5 text-sm font-semibold text-white shadow-lift hover:bg-rose-600 transition-colors"
              >
                {subcategories.some((s) => s.id === draftSub.id)
                  ? "Update Subcategory"
                  : "Create Subcategory"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* View Category Modal */}
      {viewCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="font-serif text-xl font-semibold text-foreground">
                Category Details
              </h3>
              <button
                onClick={() => setViewCategory(null)}
                className="text-muted-foreground hover:text-foreground p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {viewCategory.image ? (
              <img
                src={viewCategory.image}
                alt={viewCategory.name}
                className="h-44 w-full rounded-2xl object-cover border border-border"
              />
            ) : (
              <div className="flex h-32 w-full items-center justify-center rounded-2xl bg-muted text-xs text-muted-foreground">
                No image uploaded
              </div>
            )}

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground font-medium">Name:</span>
                <span className="font-bold text-foreground text-sm">{viewCategory.name}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground font-medium">Slug:</span>
                <span className="font-mono text-foreground">/{viewCategory.slug || slugify(viewCategory.name)}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground font-medium">Status:</span>
                <span className={viewCategory.active ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                  {viewCategory.active ? "Active Globally" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground font-medium">Subcategories:</span>
                <span className="font-semibold text-primary">
                  {subcategories.filter((s) => s.categoryName === viewCategory.name).length} created
                </span>
              </div>
              <div className="pt-1">
                <span className="text-muted-foreground font-medium block mb-1">Description:</span>
                <p className="rounded-xl bg-muted/40 p-3 text-foreground leading-relaxed">
                  {viewCategory.description || viewCategory.blurb || "No description provided."}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
              <button
                onClick={() => {
                  const cat = viewCategory;
                  setViewCategory(null);
                  openEditCategory(cat);
                }}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-lift"
              >
                Edit Category
              </button>
              <button
                onClick={() => setViewCategory(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Subcategory Modal */}
      {viewSubcategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="font-serif text-xl font-semibold text-foreground">
                Subcategory Details
              </h3>
              <button
                onClick={() => setViewSubcategory(null)}
                className="text-muted-foreground hover:text-foreground p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {viewSubcategory.image && (
              <img
                src={viewSubcategory.image}
                alt={viewSubcategory.name}
                className="h-40 w-full rounded-2xl object-cover border border-border"
              />
            )}

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground font-medium">Subcategory Name:</span>
                <span className="font-bold text-foreground text-sm">{viewSubcategory.name}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground font-medium">Parent Category:</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-bold text-primary">
                  {viewSubcategory.categoryName}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground font-medium">Slug:</span>
                <span className="font-mono text-foreground">/{viewSubcategory.slug || slugify(viewSubcategory.name)}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground font-medium">Size Template:</span>
                <span className="font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                  {viewSubcategory.sizeTemplate || "Default (XS, S, M, L, XL, XXL, Free Size)"}
                </span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1.5">
                <span className="text-muted-foreground font-medium">Status:</span>
                <span className={viewSubcategory.active ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                  {viewSubcategory.active ? "Active Globally" : "Disabled"}
                </span>
              </div>
              {viewSubcategory.description && (
                <div className="pt-1">
                  <span className="text-muted-foreground font-medium block mb-1">Description:</span>
                  <p className="rounded-xl bg-muted/40 p-3 text-foreground leading-relaxed">
                    {viewSubcategory.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
              <button
                onClick={() => {
                  const sub = viewSubcategory;
                  setViewSubcategory(null);
                  openEditSubcategory(sub);
                }}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-lift"
              >
                Edit Subcategory
              </button>
              <button
                onClick={() => setViewSubcategory(null)}
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

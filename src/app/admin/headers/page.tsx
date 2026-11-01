"use client";

import { useState } from "react";
import AdminShell, { btn, btnGhost, card, input } from "@/components/admin/AdminShell";
import type { PageHeader } from "@/data/catalog";
import { defaultPageHeaders } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { SparkleIcon } from "@/components/site/Icons";
import {
  Eye,
  Edit2,
  RotateCcw,
  Upload,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  Plus,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminHeadersPage() {
  const { pageHeaders, savePageHeader, deletePageHeader, uploadImage } = useStore();
  const [draft, setDraft] = useState<PageHeader | null>(null);
  const [viewHeader, setViewHeader] = useState<PageHeader | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingHeader, setSavingHeader] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Combine pageHeaders from store with any missing defaultPageHeaders so every page is always editable
  const allHeaders: PageHeader[] = (() => {
    const list = [...pageHeaders];
    for (const def of defaultPageHeaders) {
      if (!list.some((h) => h.pageKey === def.pageKey)) {
        list.push(def);
      }
    }
    return list;
  })();

  const filteredHeaders = allHeaders.filter(
    (h) =>
      h.pageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.pageKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const save = async () => {
    if (!draft || !draft.pageKey.trim()) {
      alert("Please specify a page key identifier (e.g. shop, rental, about).");
      return;
    }
    if (!draft.imageUrl.trim()) {
      alert("Please provide an image URL or upload a header banner image.");
      return;
    }

    try {
      setSavingHeader(true);
      await savePageHeader(draft);
      const name = draft.pageName || draft.pageKey;
      setDraft(null);
      setSavedNotice(`Header banner image for "${name}" updated successfully!`);
      setTimeout(() => setSavedNotice(null), 4000);
    } catch (err: any) {
      alert("Error saving header banner to database: " + err.message);
    } finally {
      setSavingHeader(false);
    }
  };

  const onImageUpload = async (file: File | undefined) => {
    if (!file || !draft) return;
    try {
      setUploadingImage(true);
      const url = await uploadImage(file, "gmc_page_headers");
      setDraft((d) => (d ? { ...d, imageUrl: url } : null));
    } catch (err: any) {
      alert("Error uploading banner image to Cloudinary: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleReset = async (header: PageHeader) => {
    const def = defaultPageHeaders.find((d) => d.pageKey === header.pageKey);
    const confirmMsg = def
      ? `Reset "${header.pageName}" banner image to the default asset (${def.imageUrl})?`
      : `Remove custom header banner for "${header.pageName}"?`;

    if (confirm(confirmMsg)) {
      try {
        await deletePageHeader(header.pageKey);
        // If it was a default page, ensure it stays visible with default image
        if (def) {
          await savePageHeader(def);
        }
      } catch (err: any) {
        alert("Error resetting header: " + err.message);
      }
    }
  };

  const toggleActive = async (h: PageHeader) => {
    try {
      await savePageHeader({ ...h, active: !h.active });
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  return (
    <AdminShell
      title="Header Banner Images"
      subtitle="Customize the luxury background header banner image displayed at the top of every page across Gadhinglaj Models Club."
      action={
        <button
          className={btn}
          onClick={() =>
            setDraft({
              pageKey: "",
              pageName: "",
              route: "/",
              imageUrl: "",
              subtitle: "",
              active: true,
            })
          }
        >
          <Plus className="h-4 w-4" />
          <span>New Page Header</span>
        </button>
      }
    >
      {/* Saved Notice Alert */}
      {savedNotice && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 shadow-sm animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* 1. Metric Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className={card}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Total Pages Configured
          </p>
          <p className="mt-2 font-serif text-3xl font-medium text-primary">
            {allHeaders.length} Pages
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Across shop, rental & info routes</p>
        </div>

        <div className={card}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Active Banner Images
          </p>
          <p className="mt-2 font-serif text-3xl font-medium text-emerald-700">
            {allHeaders.filter((h) => h.active).length} Active
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Live on boutique pages</p>
        </div>

        <div className={card}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Cloudinary / Custom Assets
          </p>
          <p className="mt-2 font-serif text-3xl font-medium text-gold-700">
            {allHeaders.filter((h) => h.imageUrl?.startsWith("http")).length} Hosted
          </p>
          <p className="mt-1 text-xs text-muted-foreground">High-definition CDN banners</p>
        </div>

        <div className={card}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Default Curated Assets
          </p>
          <p className="mt-2 font-serif text-3xl font-medium text-zinc-700">
            {allHeaders.filter((h) => h.imageUrl?.startsWith("/")).length} Local
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Atelier heritage assets</p>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search page by name, route (e.g. /shop, /rental)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border/80 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs"
          />
        </div>
        <p className="text-xs text-muted-foreground self-start sm:self-center">
          Showing <strong>{filteredHeaders.length}</strong> of {allHeaders.length} page banners
        </p>
      </div>

      {/* 3. Header Edit / Create Centered Modal Overlay */}
      {draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-gold-400/40 bg-white p-6 sm:p-8 shadow-2xl my-auto animate-fade-up">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <SparkleIcon className="h-5 w-5 text-gold-500" />
                <h2 className="font-display text-xl text-primary">
                  {allHeaders.some((h) => h.pageKey === draft.pageKey && draft.pageKey !== "")
                    ? `Edit Header Banner: ${draft.pageName || draft.pageKey}`
                    : "Configure New Page Header Banner"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Page Key (Unique Identifier)
                  </label>
                  <input
                    className={input}
                    placeholder="e.g. shop, rental, readymade, categories, offers, about"
                    value={draft.pageKey}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        pageKey: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
                      })
                    }
                    disabled={allHeaders.some((h) => h.pageKey === draft.pageKey && draft.pageKey !== "")}
                  />
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    Used by the system to match the page (e.g. &quot;shop&quot;, &quot;rental&quot;, &quot;categories&quot;).
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Page Display Name
                  </label>
                  <input
                    className={input}
                    placeholder="e.g. Shop All Outfits, Dress Rental Studio"
                    value={draft.pageName}
                    onChange={(e) => setDraft({ ...draft, pageName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Page Route URL
                  </label>
                  <input
                    className={input}
                    placeholder="e.g. /shop, /rental, /categories, /about"
                    value={draft.route}
                    onChange={(e) => setDraft({ ...draft, route: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Optional Subtitle / Tagline
                  </label>
                  <input
                    className={input}
                    placeholder="e.g. Handcrafted wedding and festive silhouettes for regal occasions"
                    value={draft.subtitle ?? ""}
                    onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                  />
                </div>

                <div className="pt-2">
                  <label className="inline-flex items-center gap-2.5 text-xs font-medium text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.active}
                      onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#E5252A] cursor-pointer"
                    />
                    <span className="font-semibold text-foreground">
                      Active (Display this background banner on the website)
                    </span>
                  </label>
                </div>
              </div>

              {/* Right: Image Selector & Live Preview */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Background Banner Image URL
                  </label>
                  <input
                    className={input}
                    placeholder="https://res.cloudinary.com/... or /assets/hero1.jpg"
                    value={draft.imageUrl}
                    onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Or Upload From Device (Cloudinary)
                  </label>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gold-300/60 bg-gold-50/20 py-4 text-xs font-semibold text-primary hover:border-gold-400 hover:bg-gold-50/40 transition-colors">
                    <Upload className="h-4 w-4 text-gold-600" />
                    <span>{uploadingImage ? "Uploading to Cloudinary…" : "Choose Banner Image File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onImageUpload(e.target.files?.[0])}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>

                {/* Live Preview Box */}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Live Banner Preview
                  </span>
                  <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-border/80 bg-zinc-900 shadow-inner flex items-center justify-center">
                    {draft.imageUrl ? (
                      <>
                        <img
                          src={draft.imageUrl}
                          alt="Preview"
                          className="h-full w-full object-cover object-center brightness-90 contrast-105"
                        />
                        <div className="absolute inset-0 bg-black/35" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/45 flex flex-col justify-end p-4 text-white">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-gold-300">
                            {draft.route || "/page"}
                          </span>
                          <h3 className="font-serif text-lg font-bold text-white drop-shadow">
                            {draft.pageName || "Page Header Title"}
                          </h3>
                          {draft.subtitle && (
                            <p className="text-xs text-white/80 line-clamp-1">{draft.subtitle}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-zinc-500">
                        <ImageIcon className="h-8 w-8 text-zinc-600" />
                        <span className="text-xs">No image selected yet</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 border-t border-border/80 pt-4">
              <button
                type="button"
                className={btnGhost}
                onClick={() => setDraft(null)}
                disabled={savingHeader}
              >
                Cancel
              </button>
              <button
                type="button"
                className={btn}
                onClick={save}
                disabled={savingHeader || uploadingImage}
              >
                {savingHeader ? "Saving to Database…" : "Save Header Banner"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Page Headers Table / Card Grid */}
      <div className="space-y-4">
        {filteredHeaders.map((header) => {
          const isDefault = defaultPageHeaders.some(
            (d) => d.pageKey === header.pageKey && d.imageUrl === header.imageUrl
          );

          return (
            <div
              key={header.pageKey}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-white p-4 sm:p-5 shadow-xs hover:shadow-lift transition-all"
            >
              {/* Left: Thumbnail & Details */}
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-32 sm:h-24 sm:w-40 shrink-0 overflow-hidden rounded-2xl border border-border bg-zinc-950 shadow-2xs group">
                  {header.imageUrl ? (
                    <img
                      src={header.imageUrl}
                      alt={header.pageName}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-1.5">
                    <span className="text-[9px] font-bold text-white/90 truncate">
                      {header.route}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-foreground">
                      {header.pageName}
                    </h3>
                    {header.active ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-600 border border-zinc-200">
                        <XCircle className="h-3 w-3" />
                        Inactive
                      </span>
                    )}

                    {isDefault ? (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                        Default
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                        Customized
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="font-mono text-[11px] bg-muted/60 px-1.5 py-0.5 rounded text-foreground">
                      {header.pageKey}
                    </span>
                    <span>•</span>
                    <a
                      href={header.route}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline inline-flex items-center gap-0.5"
                    >
                      {header.route}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground truncate max-w-md font-mono text-[11px]">
                    {header.imageUrl}
                  </p>
                </div>
              </div>

              {/* Right: Actions Bar (View, Edit, Reset/Delete) */}
              <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                {/* Active Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleActive(header)}
                  className={`rounded-xl px-2.5 py-1.5 text-xs font-semibold border transition-colors ${
                    header.active
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      : "border-zinc-300 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                  }`}
                  title="Toggle active display on site"
                >
                  {header.active ? "Enabled" : "Disabled"}
                </button>

                {/* View Button */}
                <button
                  type="button"
                  onClick={() => setViewHeader(header)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted hover:border-foreground/30 transition-colors shadow-2xs"
                  title="View Realistic Page Header Preview"
                >
                  <Eye className="h-3.5 w-3.5 text-blue-600" />
                  <span>View</span>
                </button>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => setDraft({ ...header })}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gold-300 bg-gold-50/80 px-3 py-1.5 text-xs font-semibold text-gold-900 hover:bg-gold-100 transition-colors shadow-2xs"
                  title="Edit Banner Image & Text"
                >
                  <Edit2 className="h-3.5 w-3.5 text-gold-700" />
                  <span>Edit</span>
                </button>

                {/* Reset / Delete Button */}
                <button
                  type="button"
                  onClick={() => handleReset(header)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs"
                  title={isDefault ? "Reset to default asset" : "Reset custom banner"}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          );
        })}

        {filteredHeaders.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border bg-white py-16 text-center text-sm text-muted-foreground">
            No page header banners match your search.
          </div>
        )}
      </div>

      {/* 5. Realistic View Modal */}
      {viewHeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-lift border border-gold-300/40">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20">
              <div className="flex items-center gap-2">
                <SparkleIcon className="h-5 w-5 text-gold-500" />
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Page Header Banner Preview: {viewHeader.pageName}
                </h3>
              </div>
              <button
                onClick={() => setViewHeader(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Realistic Page Hero Simulation */}
            <div className="p-6">
              <p className="text-xs text-muted-foreground mb-3">
                This is a realistic rendering of how the banner appears to visitors at the top of{" "}
                <strong className="text-foreground">{viewHeader.route}</strong>:
              </p>

              <div className="relative overflow-hidden rounded-2xl border border-gold-400/30 bg-zinc-950 text-white min-h-[260px] flex flex-col justify-end p-8 md:p-12 shadow-inner">
                {/* Background Image with Dual Gradients */}
                {viewHeader.imageUrl && (
                  <img
                    src={viewHeader.imageUrl}
                    alt={viewHeader.pageName}
                    className="absolute inset-0 h-full w-full object-cover object-center brightness-90 contrast-105 transition-all duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/45" />

                {/* Content Overlay */}
                <div className="relative z-10 max-w-2xl">
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-300 font-semibold mb-2 drop-shadow">
                    <span>Home</span>
                    <span>/</span>
                    <span className="text-white">{viewHeader.pageName}</span>
                  </div>

                  {/* Title */}
                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                    {viewHeader.pageName}
                  </h1>

                  {/* Subtitle */}
                  <p className="mt-2 text-sm sm:text-base text-white/90 drop-shadow line-clamp-2">
                    {viewHeader.subtitle ||
                      "Explore our curated bespoke collection crafted with artisan mastery."}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold text-gold-300 border border-gold-400/40 backdrop-blur-xs">
                      Route: {viewHeader.route}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-xs">
                      Key: {viewHeader.pageKey}
                    </span>
                  </div>
                </div>
              </div>

              {/* Asset URL & Quick Edit Link */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-muted/30 p-3.5 rounded-xl border border-border/60">
                <div className="truncate max-w-lg">
                  <span className="font-semibold text-muted-foreground mr-1.5">Asset URL:</span>
                  <span className="font-mono text-foreground">{viewHeader.imageUrl}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      const h = viewHeader;
                      setViewHeader(null);
                      setDraft({ ...h });
                    }}
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Change Image</span>
                  </button>
                  <span>•</span>
                  <a
                    href={viewHeader.route}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-gold-700 hover:underline"
                  >
                    <span>Open Live Page</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-border/80 px-6 py-3.5 bg-muted/20 flex justify-end">
              <button
                onClick={() => setViewHeader(null)}
                className="rounded-xl border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

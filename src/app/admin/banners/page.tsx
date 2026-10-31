"use client";

import { useState } from "react";
import AdminShell, { btn, btnGhost, card, input } from "@/components/admin/AdminShell";
import type { Banner } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { SparkleIcon } from "@/components/site/Icons";

export default function AdminBannersPage() {
  const { banners, saveBanner, deleteBanner, uploadImage, update } = useStore();
  const [draft, setDraft] = useState<Banner | null>(null);
  const [viewBanner, setViewBanner] = useState<Banner | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingBanner, setSavingBanner] = useState(false);

  const save = async () => {
    if (!draft || !draft.title.trim()) {
      alert("Please enter a headline title for this hero showcase.");
      return;
    }
    try {
      setSavingBanner(true);
      await saveBanner(draft);
      setDraft(null);
    } catch (err: any) {
      alert("Error saving banner to MongoDB: " + err.message);
    } finally {
      setSavingBanner(false);
    }
  };

  const onImage = async (file: File | undefined) => {
    if (!file || !draft) return;
    try {
      setUploadingImage(true);
      const url = await uploadImage(file, "gmc_banners");
      setDraft((d) => (d ? { ...d, image: url } : null));
    } catch (err: any) {
      alert("Error uploading image to Cloudinary: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const remove = async (id: number) => {
    if (confirm("Are you sure you want to remove this hero showcase banner?")) {
      try {
        await deleteBanner(id);
      } catch (err: any) {
        alert("Error deleting banner: " + err.message);
      }
    }
  };

  const toggleActive = async (b: Banner) => {
    try {
      await saveBanner({ ...b, active: !b.active });
    } catch (err: any) {
      alert("Error updating banner status: " + err.message);
    }
  };

  return (
    <AdminShell
      title="Hero Showcases"
      subtitle={`${banners.length} editorial slides curated for the boutique homepage.`}
      action={
        <button
          className={btn}
          onClick={() =>
            setDraft({
              id: Math.max(0, ...banners.map((b) => b.id)) + 1,
              title: "",
              subtitle: "",
              cta: "Explore Collection",
              link: "/shop",
              image: "",
              active: true,
            })
          }
        >
          <span>+</span>
          <span>New Hero Slide</span>
        </button>
      }
    >
      {/* Slide Editor */}
      {draft && (
        <div className="mb-8 rounded-3xl border-2 border-gold-400/40 bg-white p-7 shadow-lift animate-fade-up">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div className="flex items-center gap-2">
              <SparkleIcon className="h-5 w-5 text-gold-400" />
              <h2 className="font-display text-xl text-primary">
                {banners.some((b) => b.id === draft.id)
                  ? "Edit Hero Slide"
                  : "Compose New Hero Banner"}
              </h2>
            </div>
            <button
              onClick={() => setDraft(null)}
              className="text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
            >
              ✕ Close
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Headline Title
              </label>
              <input
                placeholder="e.g. Designer Bridal Lehengas"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className={input}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Editorial Subtitle
              </label>
              <input
                placeholder="e.g. Handcrafted zardozi & royal silks for unforgettable vows"
                value={draft.subtitle}
                onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                className={input}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                CTA Button Text
              </label>
              <input
                placeholder="Explore Collection"
                value={draft.cta}
                onChange={(e) => setDraft({ ...draft, cta: e.target.value })}
                className={input}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Destination Link
              </label>
              <select
                value={draft.link}
                onChange={(e) => setDraft({ ...draft, link: e.target.value })}
                className={input}
              >
                <option value="/shop">Shop All (/shop)</option>
                <option value="/rental">Rental Studio (/rental)</option>
                <option value="/readymade">Ready-to-Wear (/readymade)</option>
                <option value="/offers">Offers (/offers)</option>
                <option value="/categories">Categories (/categories)</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Full-Bleed Cover Image</span>
                {uploadingImage && <span className="text-[10px] text-primary animate-pulse">Uploading to Cloudinary…</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                disabled={uploadingImage}
                onChange={(e) => onImage(e.target.files?.[0])}
                className={input}
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 pb-3 text-xs font-semibold text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
                Active in Homepage Slide Rotation
              </label>
            </div>

            <div className="flex items-center justify-between gap-4 md:col-span-2 border-t border-border/80 pt-5">
              {draft.image && (
                <div className="flex items-center gap-2">
                  <img
                    src={draft.image}
                    alt="Slide preview"
                    className="h-20 w-36 rounded-xl border border-border object-cover shadow-sm"
                  />
                  <span className="text-[10px] text-muted-foreground font-mono">Image loaded ✓</span>
                </div>
              )}
              <div className="ml-auto flex gap-2">
                <button className={btnGhost} onClick={() => setDraft(null)} disabled={savingBanner || uploadingImage}>
                  Cancel
                </button>
                <button className={btn} onClick={save} disabled={savingBanner || uploadingImage}>
                  {savingBanner ? "Saving to Cloud…" : "Save Hero Slide"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banners List */}
      <div className="space-y-4">
        {banners.map((b) => (
          <div
            key={b.id}
            className={`${card} flex flex-col gap-5 sm:flex-row sm:items-center justify-between`}
          >
            <div className="flex items-center gap-4 min-w-0">
              {b.image ? (
                <img
                  src={b.image}
                  alt={b.title}
                  className="h-24 w-36 shrink-0 rounded-2xl border border-border object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-24 w-36 shrink-0 items-center justify-center rounded-2xl bg-muted text-xs text-muted-foreground">
                  No Image
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      b.active ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {b.active ? "Active In Rotation" : "Paused"}
                  </span>
                  <span className="text-xs text-muted-foreground">Target: {b.link}</span>
                </div>
                <h3 className="mt-1.5 font-display text-xl text-primary truncate">{b.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{b.subtitle}</p>
                <span className="mt-2 inline-block rounded-full bg-blush px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                  Button: "{b.cta}"
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 border-t border-border/80 sm:border-0 pt-3 sm:pt-0">
              <button
                onClick={() => setViewBanner(b)}
                className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                View
              </button>
              <button
                onClick={() => {
                  setDraft(b);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-lg border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => toggleActive(b)}
                className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {b.active ? "Pause" : "Activate"}
              </button>
              <button
                onClick={() => remove(b.id)}
                className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Banner View Modal */}
      {viewBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-lift border border-gold-300/40">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <SparkleIcon className="h-5 w-5 text-gold-400" />
                <h3 className="font-display text-xl text-primary">Hero Banner Preview</h3>
              </div>
              <button
                onClick={() => setViewBanner(null)}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-border aspect-16/9 bg-muted">
                {viewBanner.image ? (
                  <img
                    src={viewBanner.image}
                    alt={viewBanner.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    No image configured
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block rounded-full bg-gold-400/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-900 mb-2">
                    {viewBanner.active ? "Active In Rotation" : "Paused"}
                  </span>
                  <h4 className="font-display text-2xl text-white">{viewBanner.title}</h4>
                  <p className="text-xs text-white/80 mt-1 max-w-md">{viewBanner.subtitle}</p>
                  <div className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-primary">
                    {viewBanner.cta} →
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-muted/40 p-3.5 rounded-xl border border-border">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Slide ID</span>
                  <span className="font-medium text-foreground">#{viewBanner.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Target Link</span>
                  <span className="font-medium text-primary">{viewBanner.link}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-border/80 pt-4">
              <button
                onClick={() => {
                  const b = viewBanner;
                  setViewBanner(null);
                  setDraft(b);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-xl border border-primary/40 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Edit Slide
              </button>
              <button
                onClick={() => setViewBanner(null)}
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

"use client";

import { useState } from "react";
import AdminShell, { card, btn, btnGhost, input } from "@/components/admin/AdminShell";
import { Stars } from "@/components/site/Icons";
import { useStore } from "@/lib/store";
import type { Review } from "@/data/catalog";

export default function AdminReviewsPage() {
  const { reviews, update } = useStore();
  const [filter, setFilter] = useState<"All" | "Approved" | "Hidden">("All");

  const [viewReview, setViewReview] = useState<Review | null>(null);
  const [editReview, setEditReview] = useState<Review | null>(null);

  const approvedCount = reviews.filter((r) => r.approved).length;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const list = reviews.filter((r) => {
    if (filter === "Approved") return r.approved;
    if (filter === "Hidden") return !r.approved;
    return true;
  });

  const removeReview = (id: number) => {
    if (confirm("Delete this review permanently?")) {
      update("reviews", reviews.filter((x) => x.id !== id));
    }
  };

  const saveEditReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editReview) return;
    update(
      "reviews",
      reviews.map((r) => (r.id === editReview.id ? editReview : r)),
    );
    setEditReview(null);
  };

  return (
    <AdminShell
      title="Testimonials & Reviews"
      subtitle={`${reviews.length} customer reviews submitted for Gadhinglaj Models Club.`}
    >
      {/* Metrics Banner */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className={card}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Total Reviews
          </p>
          <p className="mt-1 font-display text-3xl text-primary">{reviews.length}</p>
        </div>

        <div className={card}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Average Client Rating
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-3xl text-primary">{avgRating}</span>
            <span className="text-xs text-muted-foreground">out of 5 stars</span>
          </div>
        </div>

        <div className={card}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Approved On Website
          </p>
          <p className="mt-1 font-display text-3xl text-emerald-700">{approvedCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {(["All", "Approved", "Hidden"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              filter === f
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {list.map((r) => (
          <div
            key={r.id}
            className={`${card} flex flex-col justify-between border-border/80 bg-card`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">{r.name}</h3>
                  <p className="text-[11px] text-muted-foreground">{r.date}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    r.approved
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {r.approved ? "Approved" : "Needs Review"}
                </span>
              </div>

              <div className="mt-3">
                <Stars rating={r.rating} />
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground italic">
                &ldquo;{r.text}&rdquo;
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border/80 pt-4 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setViewReview(r)}
                  className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => setEditReview({ ...r })}
                  className="rounded-lg border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeReview(r.id)}
                  className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                >
                  Delete
                </button>
              </div>

              <div>
                {!r.approved ? (
                  <button
                    onClick={() =>
                      update(
                        "reviews",
                        reviews.map((x) => (x.id === r.id ? { ...x, approved: true } : x)),
                      )
                    }
                    className="font-semibold text-emerald-700 hover:underline text-xs"
                  >
                    ✓ Approve
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      update(
                        "reviews",
                        reviews.map((x) => (x.id === r.id ? { ...x, approved: false } : x)),
                      )
                    }
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Hide
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {!list.length && (
          <div className="col-span-full py-14 text-center text-sm text-muted-foreground">
            No testimonials match the selected status filter.
          </div>
        )}
      </div>

      {/* VIEW REVIEW MODAL */}
      {viewReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Testimonial Details</span>
                <h3 className="font-serif text-2xl font-semibold text-foreground">{viewReview.name}</h3>
              </div>
              <button
                onClick={() => setViewReview(null)}
                className="text-muted-foreground hover:text-foreground p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between text-xs bg-muted/30 p-3 rounded-xl border border-border/60">
              <div className="flex items-center gap-1.5">
                <Stars rating={viewReview.rating} />
                <span className="font-bold text-foreground">({viewReview.rating}/5)</span>
              </div>
              <span className="text-muted-foreground">{viewReview.date}</span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-muted-foreground font-semibold block">Client Feedback:</span>
              <p className="rounded-xl bg-blush/30 p-4 text-foreground text-sm italic leading-relaxed border border-border/60">
                &ldquo;{viewReview.text}&rdquo;
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border/60">
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                viewReview.approved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}>
                {viewReview.approved ? "Published on Site" : "Pending Review"}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const r = viewReview;
                    setViewReview(null);
                    setEditReview({ ...r });
                  }}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-lift"
                >
                  Edit Review
                </button>
                <button
                  onClick={() => setViewReview(null)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT REVIEW MODAL */}
      {editReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <form onSubmit={saveEditReview} className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="font-serif text-xl font-semibold text-foreground">
                Edit Testimonial
              </h3>
              <button
                type="button"
                onClick={() => setEditReview(null)}
                className="text-muted-foreground hover:text-foreground p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Client Name</label>
                <input
                  type="text"
                  value={editReview.name}
                  onChange={(e) => setEditReview({ ...editReview, name: e.target.value })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={editReview.rating}
                  onChange={(e) => setEditReview({ ...editReview, rating: Number(e.target.value) })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} Stars</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Testimonial Text</label>
                <textarea
                  rows={4}
                  value={editReview.text}
                  onChange={(e) => setEditReview({ ...editReview, text: e.target.value })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={editReview.approved}
                    onChange={(e) => setEditReview({ ...editReview, approved: e.target.checked })}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                  Approved &amp; Visible on Public Website
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={() => setEditReview(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white shadow-lift"
              >
                Save Review
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}

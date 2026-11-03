"use client";

import { useState } from "react";
import Link from "next/link";
import AdminShell, { card, btn, btnGhost, input } from "@/components/admin/AdminShell";
import { Stars } from "@/components/site/Icons";
import { useStore } from "@/lib/store";
import type { Review } from "@/data/catalog";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Trash2,
  Edit,
  Eye,
  AlertCircle,
} from "lucide-react";

export default function AdminReviewsPage() {
  const { reviews, products, updateReviewStatus, deleteReview, editReviewItem } = useStore();
  const [filter, setFilter] = useState<"All" | "Pending" | "Approved" | "Hidden">("All");

  const [viewReview, setViewReview] = useState<Review | null>(null);
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const approvedCount = reviews.filter((r) => r.approved).length;
  const pendingCount = reviews.filter((r) => !r.approved).length;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : "5.0";

  const list = reviews.filter((r) => {
    if (filter === "Approved") return r.approved;
    if (filter === "Pending") return !r.approved;
    if (filter === "Hidden") return !r.approved;
    return true;
  });

  const handleToggleApprove = async (id: number | string, newStatus: boolean) => {
    setActionLoading(String(id));
    try {
      await updateReviewStatus(id, newStatus);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveReview = async (id: number | string) => {
    if (confirm("Delete this review permanently? This cannot be undone.")) {
      setActionLoading(String(id));
      try {
        await deleteReview(id);
      } finally {
        setActionLoading(null);
      }
    }
  };

  const saveEditReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editReview) return;
    setActionLoading(String(editReview.id));
    try {
      await editReviewItem(editReview);
      setEditReview(null);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AdminShell
      title="Testimonials &amp; Product Feedback"
      subtitle={`${reviews.length} total reviews · ${pendingCount} pending admin approval.`}
    >
      {/* Metrics Banner */}
      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        <div className={card}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Total Feedback
          </p>
          <p className="mt-1 font-display text-3xl text-primary">{reviews.length}</p>
        </div>

        <div className={`${card} ${pendingCount > 0 ? "border-amber-300 bg-amber-50/40" : ""}`}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
              Needs Approval
            </p>
            {pendingCount > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <p className="mt-1 font-display text-3xl text-amber-800 font-bold">{pendingCount}</p>
        </div>

        <div className={card}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Live on Website
          </p>
          <p className="mt-1 font-display text-3xl text-emerald-700">{approvedCount}</p>
        </div>

        <div className={card}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Average Rating
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-3xl text-primary">{avgRating}</span>
            <span className="text-xs text-muted-foreground">/ 5.0</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {(["All", "Pending", "Approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
              filter === f
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <span>{f === "Pending" ? "Pending Approval" : f}</span>
            {f === "Pending" && pendingCount > 0 && (
              <span className="rounded-full bg-amber-500 text-white px-2 py-0.2 text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
            {f === "Approved" && (
              <span className="rounded-full bg-emerald-600/20 text-emerald-800 px-1.5 py-0.2 text-[10px]">
                {approvedCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {list.map((r) => {
          const matchedProduct = r.productId
            ? products.find((p) => p.id === r.productId)
            : null;
          const prodName = r.productName || matchedProduct?.name;
          const prodImage =
            r.productImage ||
            matchedProduct?.image ||
            (matchedProduct?.images && matchedProduct.images[0]);

          return (
            <div
              key={r.id}
              className={`${card} flex flex-col justify-between border-border/80 bg-card transition-all ${
                !r.approved ? "border-amber-300 ring-1 ring-amber-300/40 bg-amber-50/10" : ""
              }`}
            >
              <div>
                {/* Header: Client & Approval Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-wine-deep font-display text-xs font-semibold text-accent shrink-0">
                      {r.initials || "CL"}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm truncate">{r.name}</h3>
                      <p className="text-[11px] text-muted-foreground">{r.date}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 flex items-center gap-1 ${
                      r.approved
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                    }`}
                  >
                    {r.approved ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Approved
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 text-amber-700" />
                        Needs Review
                      </>
                    )}
                  </span>
                </div>

                {/* Star rating */}
                <div className="mt-3 flex items-center gap-1.5">
                  <Stars rating={r.rating} />
                  <span className="text-xs font-bold text-foreground">({r.rating}/5)</span>
                </div>

                {/* Feedback commentary */}
                <p className="mt-3 text-xs leading-relaxed text-foreground/85 italic bg-muted/20 p-3 rounded-2xl border border-border/50">
                  &ldquo;{r.text}&rdquo;
                </p>

                {/* Product Association Card */}
                {prodName ? (
                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border/80 bg-white p-2.5 shadow-2xs">
                    {prodImage ? (
                      <img
                        src={prodImage}
                        alt={prodName}
                        className="h-10 w-10 rounded-xl object-cover border border-border/60 shrink-0"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                        GMC
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-accent">
                        Product Feedback
                      </span>
                      <span className="block truncate text-xs font-medium text-foreground">
                        {prodName}
                      </span>
                    </div>
                    {r.productId && (
                      <Link
                        href={`/product/${r.productId}`}
                        target="_blank"
                        className="text-muted-foreground hover:text-primary p-1"
                        title="View Product Page"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    General Boutique Testimonial
                  </div>
                )}
              </div>

              {/* Actions Footer */}
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
                    onClick={() => handleRemoveReview(r.id)}
                    className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                </div>

                <div>
                  {!r.approved ? (
                    <button
                      disabled={actionLoading === String(r.id)}
                      onClick={() => handleToggleApprove(r.id, true)}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1 text-xs font-bold text-white shadow-xs transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <span>✓ Approve</span>
                    </button>
                  ) : (
                    <button
                      disabled={actionLoading === String(r.id)}
                      onClick={() => handleToggleApprove(r.id, false)}
                      className="text-xs text-muted-foreground hover:text-rose-600 transition-colors disabled:opacity-50"
                    >
                      Hide from Site
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {!list.length && (
          <div className="col-span-full py-16 text-center text-sm text-muted-foreground border border-dashed border-border rounded-3xl bg-card/40">
            No reviews match the selected filter.
          </div>
        )}
      </div>

      {/* VIEW REVIEW MODAL */}
      {viewReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Review Inspection
                </span>
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
                <span className="font-bold text-foreground">({viewReview.rating}/5 Stars)</span>
              </div>
              <span className="text-muted-foreground">{viewReview.date}</span>
            </div>

            {viewReview.productName && (
              <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-secondary/30 p-3">
                {viewReview.productImage && (
                  <img
                    src={viewReview.productImage}
                    alt={viewReview.productName}
                    className="h-12 w-12 rounded-xl object-cover border border-border/80 shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-accent">
                    Associated Product
                  </span>
                  <span className="block text-xs font-semibold text-foreground truncate">
                    {viewReview.productName}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-1 text-xs">
              <span className="text-muted-foreground font-semibold block">Client Feedback:</span>
              <p className="rounded-xl bg-blush/30 p-4 text-foreground text-sm italic leading-relaxed border border-border/60">
                &ldquo;{viewReview.text}&rdquo;
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border/60">
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  viewReview.approved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {viewReview.approved ? "Published on Site" : "Pending Admin Approval"}
              </span>

              <div className="flex gap-2">
                {!viewReview.approved && (
                  <button
                    onClick={() => {
                      handleToggleApprove(viewReview.id, true);
                      setViewReview((prev) => (prev ? { ...prev, approved: true } : null));
                    }}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-xs"
                  >
                    ✓ Approve Now
                  </button>
                )}
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
          <form
            onSubmit={saveEditReview}
            className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="font-serif text-xl font-semibold text-foreground">Edit Feedback</h3>
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
                <label className="block text-muted-foreground font-semibold mb-1">
                  Rating (1 to 5 Stars)
                </label>
                <select
                  value={editReview.rating}
                  onChange={(e) => setEditReview({ ...editReview, rating: Number(e.target.value) })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} Stars
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Feedback Text</label>
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
                  Approved &amp; Visible on Public Website &amp; Product Page
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
                disabled={actionLoading === String(editReview.id)}
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white shadow-lift disabled:opacity-50"
              >
                Save Feedback
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}

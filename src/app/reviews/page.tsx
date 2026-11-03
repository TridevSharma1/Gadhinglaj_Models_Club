"use client";

import { useState } from "react";
import Link from "next/link";
import SiteLayout, { EmptyState, PageHero } from "@/components/site/SiteLayout";
import { Stars } from "@/components/site/Icons";
import { useStore } from "@/lib/store";
import {
  MessageSquarePlus,
  CheckCircle2,
  Quote,
  Star,
  Sparkles,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

export default function ReviewsPage() {
  const { reviews, products, submitReview, currentUser } = useStore();
  const live = reviews.filter((r) => r.approved);
  const avg = live.length
    ? live.reduce((n, r) => n + (Number(r.rating) || 5), 0) / live.length
    : 5.0;

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    text: "",
    rating: 5,
    productId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;

    setIsSubmitting(true);
    try {
      const selectedProduct = form.productId
        ? products.find((p) => p.id === Number(form.productId))
        : null;

      await submitReview({
        productId: selectedProduct ? selectedProduct.id : undefined,
        productName: selectedProduct ? selectedProduct.name : undefined,
        productImage: selectedProduct ? selectedProduct.image : undefined,
        name: form.name.trim(),
        rating: form.rating,
        text: form.text.trim(),
      });

      setSubmitted(true);
      setTimeout(() => {
        setShowModal(false);
        setSubmitted(false);
        setForm({ name: currentUser?.name || "", text: "", rating: 5, productId: "" });
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Client Stories"
        title="Patron Reviews &amp; Testimonials"
        subtitle="Genuine experiences from women and couples who styled their biggest occasions with Gadhinglaj Models Club."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
      />

      <div className="container-lux py-16 space-y-16">
        {/* Rating Breakdown Header Card */}
        <div className="rounded-3xl border border-border/80 bg-gradient-to-r from-secondary/60 via-card to-secondary/40 p-8 md:p-12 shadow-soft">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lift">
                <span className="font-display text-4xl font-bold">{avg.toFixed(1)}</span>
                <span className="text-[10px] uppercase tracking-widest text-accent font-medium">Out of 5</span>
              </div>

              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Stars rating={avg} className="scale-110" />
                  <span className="text-sm font-semibold text-foreground">Verified Rating</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground font-light">
                  Based on {live.length} client experiences across weddings, pre-wedding shoots &amp; rentals
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift hover:opacity-90 transition-opacity"
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span>Share Your Story</span>
            </button>
          </div>
        </div>

        {/* Modal for adding review */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 shadow-2xl animate-fade-up">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <h3 className="font-display text-2xl text-primary font-medium">Write Your Review</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  ✕ Close
                </button>
              </div>

              <p className="text-xs text-muted-foreground font-light mt-2">
                Your feedback helps future clients choose their dream outfit.
              </p>

              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                  <p className="font-display text-xl text-primary font-medium">Thank you for sharing!</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Your feedback has been submitted to the atelier desk and will appear live once approved by the admin team.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                      Your Name
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Ananya Kulkarni"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                      Select Outfit / Product (Optional)
                    </label>
                    <select
                      value={form.productId}
                      onChange={(e) => setForm({ ...form, productId: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none focus:border-primary"
                    >
                      <option value="">General Boutique Experience (No specific product)</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                      Rating (1 to 5 Stars)
                    </label>
                    <select
                      value={form.rating}
                      onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none focus:border-primary"
                    >
                      <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                      <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                      <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                      <option value={2}>★★☆☆☆ (2 Stars - Below Average)</option>
                      <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                      Your Feedback / Experience
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.text}
                      onChange={(e) => setForm({ ...form, text: e.target.value })}
                      placeholder="Tell us about the outfit fit, fabric, compliments received, or service at the boutique…"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none focus:border-primary"
                    />
                  </div>

                  {/* Approval notification notice */}
                  <div className="flex items-start gap-2 rounded-xl border border-border/80 bg-muted/30 p-3 text-[11px] text-muted-foreground">
                    <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      To ensure verified authentic reviews, client feedback is approved first by the admin panel before publication.
                    </span>
                  </div>

                  <div className="flex gap-3 justify-end pt-3 border-t border-border/60">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="rounded-full border border-border px-6 py-2.5 text-xs uppercase tracking-wider text-muted-foreground hover:bg-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full bg-primary px-7 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lift disabled:opacity-50"
                    >
                      {isSubmitting ? "Submitting…" : "Submit Review"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        <div>
          {live.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {live.map((r) => {
                const matchedProduct = r.productId
                  ? products.find((p) => p.id === r.productId)
                  : null;
                const prodName = r.productName || matchedProduct?.name;
                const prodImage =
                  r.productImage ||
                  matchedProduct?.image ||
                  (matchedProduct?.images && matchedProduct.images[0]);
                const prodId = r.productId || matchedProduct?.id;

                return (
                  <article
                    key={r.id}
                    className="animate-fade-up relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Stars rating={r.rating} />
                        <Quote className="h-5 w-5 text-accent/40" />
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-foreground/85 font-light italic">
                        &ldquo;{r.text}&rdquo;
                      </p>
                    </div>

                    <div className="mt-6 space-y-4">
                      {/* Product Preview if linked */}
                      {prodName && prodId && (
                        <Link
                          href={`/product/${prodId}`}
                          className="group/prod flex items-center gap-3 rounded-2xl border border-border/80 bg-secondary/40 p-2.5 transition-all hover:border-primary/40 hover:bg-white shadow-2xs"
                        >
                          {prodImage ? (
                            <img
                              src={prodImage}
                              alt={prodName}
                              className="h-11 w-11 rounded-xl object-cover border border-border/60 group-hover/prod:scale-105 transition-transform shrink-0"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                              GMC
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="block text-[9px] font-semibold uppercase tracking-wider text-accent">
                              Reviewed Outfit
                            </span>
                            <span className="block truncate text-xs font-semibold text-foreground group-hover/prod:text-primary transition-colors">
                              {prodName}
                            </span>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover/prod:text-primary transition-colors shrink-0 mr-1" />
                        </Link>
                      )}

                      <div className="flex items-center justify-between border-t border-border/60 pt-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-wine-deep font-display text-sm font-semibold text-accent shadow-soft">
                            {r.initials || "CL"}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-foreground">{r.name}</p>
                            <p className="flex items-center gap-1 text-[10px] text-muted-foreground font-light">
                              <CheckCircle2 className="h-3 w-3 text-accent" />
                              Verified Client
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] text-muted-foreground font-light">{r.date}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No Client Reviews Yet"
              text="Be the first to share your styling experience with our boutique."
            />
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

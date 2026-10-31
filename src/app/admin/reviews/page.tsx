"use client";

import AdminShell, { card } from "@/components/admin/AdminShell";
import { Stars } from "@/components/site/Icons";
import { useStore } from "@/lib/store";

export default function AdminReviewsPage() {
  const { reviews, update } = useStore();
  return (
    <AdminShell
      title="Reviews"
      subtitle="Only approved reviews are visible on the customer website."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((r) => (
          <div key={r.id} className={card}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs ${r.approved ? "bg-blush text-primary" : "bg-muted text-muted-foreground"}`}
              >
                {r.approved ? "Approved" : "Hidden"}
              </span>
            </div>
            <Stars rating={r.rating} className="mt-3" />
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">"{r.text}"</p>
            <div className="mt-4 flex gap-3 text-xs">
              <button
                onClick={() => update("reviews", reviews.map((x) => (x.id === r.id ? { ...x, approved: true } : x)))}
                className="text-primary hover:underline"
              >
                Approve
              </button>
              <button
                onClick={() => update("reviews", reviews.map((x) => (x.id === r.id ? { ...x, approved: false } : x)))}
                className="text-muted-foreground hover:underline"
              >
                Hide
              </button>
              <button
                onClick={() => update("reviews", reviews.filter((x) => x.id !== r.id))}
                className="text-destructive hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {!reviews.length && (
        <div className={`${card} py-14 text-center text-sm text-muted-foreground`}>No reviews yet.</div>
      )}
    </AdminShell>
  );
}

"use client";

import { useState } from "react";
import AdminShell, { card, input, btn } from "@/components/admin/AdminShell";
import { inr, type Booking } from "@/data/catalog";
import { bookingStatuses, useStore } from "@/lib/store";
import { WhatsAppIcon, SparkleIcon } from "@/components/site/Icons";

export default function AdminRentalsPage() {
  const { bookings, update } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");

  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);

  const list = bookings.filter(
    (b) =>
      (b.customer.toLowerCase().includes(q.toLowerCase()) ||
        b.id.toLowerCase().includes(q.toLowerCase()) ||
        b.outfit.toLowerCase().includes(q.toLowerCase()) ||
        b.phone.includes(q)) &&
      (status === "All" || b.status === status),
  );

  const removeBooking = async (id: string) => {
    if (confirm(`Are you sure you want to delete rental reservation "${id}"?`)) {
      update(
        "bookings",
        bookings.filter((b) => b.id !== id),
      );
      try {
        await fetch(`/api/bookings?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      } catch (e) {
        console.warn("Failed to delete booking in MongoDB:", e);
      }
    }
  };

  const saveEditBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBooking) return;
    update(
      "bookings",
      bookings.map((b) => (b.id === editBooking.id ? editBooking : b)),
    );
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editBooking),
      });
    } catch (e) {
      console.warn("Failed to update booking in MongoDB:", e);
    }
    setEditBooking(null);
  };

  const handleStatusChange = async (booking: Booking, newStatus: string) => {
    const updated = { ...booking, status: newStatus };
    update(
      "bookings",
      bookings.map((x) => (x.id === booking.id ? updated : x)),
    );
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.warn("Failed to update status in MongoDB:", e);
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Confirmed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Picked Up":
      case "Rented":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Returned":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Cancelled":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <AdminShell
      title="Rental Studio Bookings"
      subtitle={`${bookings.length} couture dress rental reservations recorded.`}
    >
      {/* Search & Status Filter */}
      <div className={`${card} mb-8 flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search booking ID, customer, outfit name, or phone…"
            className={`${input} w-80`}
          />
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setStatus("All")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                status === "All"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All ({bookings.length})
            </button>
            {bookingStatuses.map((s) => {
              const count = bookings.filter((b) => b.status === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                    status === s
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {s} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className={`${card} overflow-hidden p-0`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="border-b border-border/80 bg-muted/40 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Booking Reference</th>
                <th className="px-5 py-4">Client Details</th>
                <th className="px-5 py-4">Rented Outfit &amp; Occasion</th>
                <th className="px-5 py-4">Rental Duration</th>
                <th className="px-5 py-4">Rental &amp; Deposit</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {list.map((b) => (
                <tr key={b.id} className="align-top transition-colors hover:bg-muted/20">
                  <td className="px-5 py-4">
                    <span className="font-semibold text-primary block">{b.id}</span>
                    <span
                      className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(
                        b.status,
                      )}`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-medium text-foreground block">{b.customer}</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{b.phone}</span>
                      <a
                        href={`https://wa.me/91${b.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hello ${b.customer}, regarding your rental booking ${b.id} for "${b.outfit}" at Gadhinglaj Models Club. Your reservation status is currently ${b.status}.`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 hover:bg-emerald-200"
                      >
                        <WhatsAppIcon className="h-3 w-3" />
                        Remind
                      </a>
                    </div>
                    {b.email && <span className="text-[11px] text-muted-foreground block">{b.email}</span>}
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-medium text-primary block flex items-center gap-1.5">
                      <span>{b.outfit}</span>
                      {b.isCustomDesign && (
                        <span className="rounded-full bg-gold-100 text-gold-900 border border-gold-300 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                          Custom Design
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground block mt-0.5">
                      Size: {b.size} {b.color ? `· ${b.color}` : ""} · {b.occasion}
                    </span>
                    {b.notes && (
                      <span className="mt-1.5 block max-w-xs rounded-lg bg-blush/60 px-2.5 py-1 text-[11px] text-primary italic">
                        Note: {b.notes}
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-xs">
                    <div className="font-medium text-foreground">
                      {b.start} → {b.end}
                    </div>
                    <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      Reserved Window
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-semibold text-primary">{inr(b.rental)}</div>
                    <span className="block text-[11px] text-emerald-700">
                      Deposit: {inr(b.deposit)} (Refundable)
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b, e.target.value)}
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none focus:border-gold-400"
                    >
                      {bookingStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs">
                      <button
                        onClick={() => setViewBooking(b)}
                        className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setEditBooking({ ...b })}
                        className="rounded-lg border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeBooking(b.id)}
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
            No rental studio bookings found for this filter.
          </div>
        )}
      </div>

      {/* VIEW BOOKING MODAL */}
      {viewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Rental VIP Pass</span>
                <h3 className="font-serif text-2xl font-semibold text-foreground">{viewBooking.id}</h3>
              </div>
              <button
                onClick={() => setViewBooking(null)}
                className="text-muted-foreground hover:text-foreground p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs bg-muted/30 p-4 rounded-2xl border border-border/60">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground font-semibold">Client Name</span>
                <span className="font-bold text-foreground text-sm">{viewBooking.customer}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground font-semibold">Phone / WhatsApp</span>
                <span className="font-mono text-foreground">{viewBooking.phone}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground font-semibold">Reserved Outfit</span>
                <span className="font-bold text-primary">{viewBooking.outfit}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground font-semibold">Size &amp; Occasion</span>
                <span className="text-foreground">Size {viewBooking.size} · {viewBooking.occasion}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground font-semibold">Rental Duration</span>
                <span className="font-medium text-foreground">{viewBooking.start} to {viewBooking.end}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground font-semibold">Rental Fee</span>
                <span className="font-serif text-base font-bold text-primary">{inr(viewBooking.rental)}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground font-semibold">Refundable Deposit</span>
                <span className="font-medium text-emerald-700">{inr(viewBooking.deposit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-semibold">Reservation Status</span>
                <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(viewBooking.status)}`}>
                  {viewBooking.status}
                </span>
              </div>
            </div>

            {viewBooking.notes && (
              <div className="rounded-xl bg-blush/40 p-3 text-xs border border-border/60">
                <span className="font-semibold text-primary block mb-0.5">Special Fitting Notes:</span>
                <p className="text-muted-foreground italic">{viewBooking.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
              <button
                onClick={() => {
                  const b = viewBooking;
                  setViewBooking(null);
                  setEditBooking({ ...b });
                }}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-lift"
              >
                Edit Booking
              </button>
              <button
                onClick={() => setViewBooking(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT BOOKING MODAL */}
      {editBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <form onSubmit={saveEditBooking} className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="font-serif text-xl font-semibold text-foreground">
                Edit Rental Reservation {editBooking.id}
              </h3>
              <button
                type="button"
                onClick={() => setEditBooking(null)}
                className="text-muted-foreground hover:text-foreground p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Customer Name</label>
                <input
                  type="text"
                  value={editBooking.customer}
                  onChange={(e) => setEditBooking({ ...editBooking, customer: e.target.value })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editBooking.phone}
                  onChange={(e) => setEditBooking({ ...editBooking, phone: e.target.value })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Rental Start Date</label>
                  <input
                    type="date"
                    value={editBooking.start}
                    onChange={(e) => setEditBooking({ ...editBooking, start: e.target.value })}
                    className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Return Due Date</label>
                  <input
                    type="date"
                    value={editBooking.end}
                    onChange={(e) => setEditBooking({ ...editBooking, end: e.target.value })}
                    className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Booking Status</label>
                <select
                  value={editBooking.status}
                  onChange={(e) => setEditBooking({ ...editBooking, status: e.target.value })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  {bookingStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Rental Fee (₹)</label>
                  <input
                    type="number"
                    value={editBooking.rental}
                    onChange={(e) => setEditBooking({ ...editBooking, rental: Number(e.target.value) })}
                    className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={editBooking.deposit}
                    onChange={(e) => setEditBooking({ ...editBooking, deposit: Number(e.target.value) })}
                    className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Fitting &amp; Alteration Notes</label>
                <textarea
                  rows={2}
                  value={editBooking.notes}
                  onChange={(e) => setEditBooking({ ...editBooking, notes: e.target.value })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={() => setEditBooking(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white shadow-lift"
              >
                Save Reservation Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}

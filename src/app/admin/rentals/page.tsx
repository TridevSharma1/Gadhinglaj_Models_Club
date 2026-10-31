"use client";

import { useState } from "react";
import AdminShell, { card, input } from "@/components/admin/AdminShell";
import { inr } from "@/data/catalog";
import { bookingStatuses, useStore } from "@/lib/store";

export default function AdminRentalsPage() {
  const { bookings, update } = useStore();
  const [status, setStatus] = useState("All");
  const list = bookings.filter((b) => status === "All" || b.status === status);

  return (
    <AdminShell title="Rental Bookings" subtitle={`${bookings.length} bookings recorded.`}>
      <div className={`${card} mb-6`}>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${input} max-w-44`}>
          <option>All</option>
          {bookingStatuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {list.length ? (
        <div className={`${card} overflow-x-auto p-0`}>
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Outfit</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
                <th className="px-4 py-3">Rental</th>
                <th className="px-4 py-3">Deposit</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id} className="border-t border-border align-top">
                  <td className="px-4 py-3 text-foreground">{b.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {b.customer}
                    <span className="block text-xs">{b.phone}</span>
                    <span className="block text-xs">{b.email}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {b.outfit}
                    <span className="block text-xs">
                      Size {b.size} · {b.occasion}
                    </span>
                    {b.notes && <span className="block text-xs italic">{b.notes}</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{b.start}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.end}</td>
                  <td className="px-4 py-3 text-muted-foreground">{inr(b.rental)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{inr(b.deposit)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      onChange={(e) =>
                        update("bookings", bookings.map((x) => (x.id === b.id ? { ...x, status: e.target.value } : x)))
                      }
                      className={input}
                    >
                      {bookingStatuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={`${card} py-14 text-center text-sm text-muted-foreground`}>
          No rental bookings yet.
        </div>
      )}
    </AdminShell>
  );
}

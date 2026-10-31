"use client";

import { useState } from "react";
import AdminShell, { card, input } from "@/components/admin/AdminShell";
import { inr } from "@/data/catalog";
import { orderStatuses, useStore } from "@/lib/store";

export default function AdminOrdersPage() {
  const { orders, update } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const list = orders.filter(
    (o) =>
      (o.customer.toLowerCase().includes(q.toLowerCase()) || o.id.toLowerCase().includes(q.toLowerCase())) &&
      (status === "All" || o.status === status),
  );

  return (
    <AdminShell title="Orders" subtitle={`${orders.length} orders recorded.`}>
      <div className={`${card} mb-6 flex flex-wrap gap-3`}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order or customer" className={`${input} max-w-xs`} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${input} max-w-44`}>
          <option>All</option>
          {orderStatuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className={`${card} overflow-x-auto p-0`}>
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-t border-border align-top">
                <td className="px-4 py-3 text-foreground">{o.id}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {o.customer}
                  <span className="block text-xs">{o.phone}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {o.items.map((i, k) => (
                    <span key={k} className="block text-xs">
                      {i.name} ({i.size} × {i.qty})
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{inr(o.amount)}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.payment}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) =>
                      update("orders", orders.map((x) => (x.id === o.id ? { ...x, status: e.target.value } : x)))
                    }
                    className={input}
                  >
                    {orderStatuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="px-4 py-10 text-center text-sm text-muted-foreground">No orders found.</p>}
      </div>
    </AdminShell>
  );
}

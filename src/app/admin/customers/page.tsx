"use client";

import { useState } from "react";
import AdminShell, { card, input } from "@/components/admin/AdminShell";
import { inr } from "@/data/catalog";
import { useStore } from "@/lib/store";

export default function AdminCustomersPage() {
  const { customers } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const list = customers.filter(
    (c) =>
      (c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q.toLowerCase())) &&
      (status === "All" || c.status === status),
  );

  return (
    <AdminShell title="Customers" subtitle={`${customers.length} customer records.`}>
      <div className={`${card} mb-6 flex flex-wrap gap-3`}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone or email" className={`${input} max-w-xs`} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${input} max-w-40`}>
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className={`${card} overflow-x-auto p-0`}>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Bookings</th>
              <th className="px-4 py-3">Total Spent</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.orders}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.bookings}</td>
                <td className="px-4 py-3 text-muted-foreground">{inr(c.spent)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${c.status === "Active" ? "bg-blush text-primary" : "bg-muted text-muted-foreground"}`}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="px-4 py-10 text-center text-sm text-muted-foreground">No customers found.</p>}
      </div>
    </AdminShell>
  );
}

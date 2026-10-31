"use client";

import AdminShell, { card } from "@/components/admin/AdminShell";
import { inr } from "@/data/catalog";
import { useStore } from "@/lib/store";

export default function AdminDashboardPage() {
  const { products, orders, bookings, customers } = useStore();
  const revenue = orders.reduce((n, o) => n + o.amount, 0);
  const pending =
    orders.filter((o) => o.status === "Pending").length +
    bookings.filter((b) => b.status === "Pending").length;

  const stats = [
    { label: "Total Products", value: products.length },
    { label: "Ready-Made Products", value: products.filter((p) => p.type === "readymade").length },
    { label: "Rental Products", value: products.filter((p) => p.type === "rental").length },
    { label: "Total Orders", value: orders.length },
    { label: "Rental Bookings", value: bookings.length },
    { label: "Customers", value: customers.length },
    { label: "Revenue", value: inr(revenue) },
    { label: "Pending Requests", value: pending },
  ];

  return (
    <AdminShell title="Dashboard" subtitle="A snapshot of the boutique today.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={card}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-display text-3xl text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className={card}>
          <h2 className="font-display text-xl text-primary">Recent Orders</h2>
          <ul className="mt-4 space-y-3">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-foreground">
                  {o.id} · {o.customer}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {inr(o.amount)} · {o.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className={card}>
          <h2 className="font-display text-xl text-primary">Recent Rental Bookings</h2>
          <ul className="mt-4 space-y-3">
            {bookings.slice(0, 5).map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-foreground">
                  {b.id} · {b.customer}
                </span>
                <span className="shrink-0 text-muted-foreground">{b.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}

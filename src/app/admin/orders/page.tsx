"use client";

import { useState } from "react";
import AdminShell, { card, input, btn } from "@/components/admin/AdminShell";
import { inr, type Order } from "@/data/catalog";
import { orderStatuses, useStore } from "@/lib/store";
import { WhatsAppIcon } from "@/components/site/Icons";

export default function AdminOrdersPage() {
  const { orders, update } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");

  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);

  const list = orders.filter(
    (o) =>
      (o.customer.toLowerCase().includes(q.toLowerCase()) ||
        o.id.toLowerCase().includes(q.toLowerCase()) ||
        o.phone.includes(q)) &&
      (status === "All" || o.status === status),
  );

  const removeOrder = (id: string) => {
    if (confirm(`Are you sure you want to delete order "${id}"?`)) {
      update("orders", orders.filter((o) => o.id !== id));
    }
  };

  const saveEditOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOrder) return;
    update(
      "orders",
      orders.map((o) => (o.id === editOrder.id ? editOrder : o)),
    );
    setEditOrder(null);
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Confirmed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Shipped":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Cancelled":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <AdminShell
      title="Client Orders"
      subtitle={`${orders.length} ready-to-wear boutique orders recorded.`}
    >
      {/* Search & Status Filter */}
      <div className={`${card} mb-8 flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search order ID, client name, or phone…"
            className={`${input} w-72`}
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
              All ({orders.length})
            </button>
            {orderStatuses.map((s) => {
              const count = orders.filter((o) => o.status === s).length;
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

      {/* Orders Table */}
      <div className={`${card} overflow-hidden p-0`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] text-left text-sm">
            <thead className="border-b border-border/80 bg-muted/40 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Order ID &amp; Date</th>
                <th className="px-5 py-4">Client Details</th>
                <th className="px-5 py-4">Selected Outfits</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {list.map((o) => (
                <tr key={o.id} className="align-top transition-colors hover:bg-muted/20">
                  <td className="px-5 py-4">
                    <span className="font-semibold text-primary block">{o.id}</span>
                    <span className="text-xs text-muted-foreground mt-0.5 block">{o.date}</span>
                    <span
                      className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(
                        o.status,
                      )}`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-medium text-foreground block">{o.customer}</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{o.phone}</span>
                      <a
                        href={`https://wa.me/91${o.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hello ${o.customer}, greeting from Gadhinglaj Models Club regarding your order ${o.id}. Your status is currently ${o.status}.`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 hover:bg-emerald-200"
                      >
                        <WhatsAppIcon className="h-3 w-3" />
                        Chat
                      </a>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="space-y-1.5">
                      {o.items.map((i, k) => (
                        <div key={k} className="text-xs">
                          <span className="font-medium text-foreground">{i.name}</span>
                          <span className="text-muted-foreground ml-1">
                            · Size {i.size} × {i.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground block">{o.payment}</span>
                    <span className="text-[11px] text-muted-foreground">Standard Delivery</span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-primary block">{inr(o.amount)}</span>
                    <span className="text-[10px] text-muted-foreground">Includes taxes</span>
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={o.status}
                      onChange={(e) =>
                        update(
                          "orders",
                          orders.map((x) =>
                            x.id === o.id ? { ...x, status: e.target.value } : x,
                          ),
                        )
                      }
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none focus:border-gold-400"
                    >
                      {orderStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs">
                      <button
                        onClick={() => setViewOrder(o)}
                        className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setEditOrder({ ...o })}
                        className="rounded-lg border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeOrder(o.id)}
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
            No orders found matching the filter.
          </div>
        )}
      </div>

      {/* VIEW ORDER MODAL */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Order Details</span>
                <h3 className="font-serif text-2xl font-semibold text-foreground">{viewOrder.id}</h3>
              </div>
              <button
                onClick={() => setViewOrder(null)}
                className="text-muted-foreground hover:text-foreground p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-muted/30 p-3.5 rounded-2xl border border-border/60">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Customer</span>
                <span className="font-bold text-foreground text-sm">{viewOrder.customer}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Phone</span>
                <span className="font-semibold text-foreground">{viewOrder.phone}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Date</span>
                <span className="text-foreground">{viewOrder.date}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Status</span>
                <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(viewOrder.status)}`}>
                  {viewOrder.status}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Payment</span>
                <span className="text-foreground font-medium">{viewOrder.payment}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Total Amount</span>
                <span className="font-serif text-base font-bold text-primary">{inr(viewOrder.amount)}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-2">
                Order Items ({viewOrder.items.length})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {viewOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-border/70 bg-card text-xs">
                    <div>
                      <span className="font-semibold text-foreground block">{item.name}</span>
                      <span className="text-muted-foreground text-[11px]">Size: {item.size} · Qty: {item.qty}</span>
                    </div>
                    <span className="font-bold text-primary">{inr(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
              <button
                onClick={() => {
                  const o = viewOrder;
                  setViewOrder(null);
                  setEditOrder({ ...o });
                }}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-lift"
              >
                Edit Order
              </button>
              <button
                onClick={() => setViewOrder(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ORDER MODAL */}
      {editOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <form onSubmit={saveEditOrder} className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="font-serif text-xl font-semibold text-foreground">
                Edit Order {editOrder.id}
              </h3>
              <button
                type="button"
                onClick={() => setEditOrder(null)}
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
                  value={editOrder.customer}
                  onChange={(e) => setEditOrder({ ...editOrder, customer: e.target.value })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Customer Phone</label>
                <input
                  type="text"
                  value={editOrder.phone}
                  onChange={(e) => setEditOrder({ ...editOrder, phone: e.target.value })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Order Status</label>
                <select
                  value={editOrder.status}
                  onChange={(e) => setEditOrder({ ...editOrder, status: e.target.value })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  {orderStatuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Payment Method</label>
                <input
                  type="text"
                  value={editOrder.payment}
                  onChange={(e) => setEditOrder({ ...editOrder, payment: e.target.value })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Total Amount (₹)</label>
                <input
                  type="number"
                  value={editOrder.amount}
                  onChange={(e) => setEditOrder({ ...editOrder, amount: Number(e.target.value) })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={() => setEditOrder(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white shadow-lift"
              >
                Save Order Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}

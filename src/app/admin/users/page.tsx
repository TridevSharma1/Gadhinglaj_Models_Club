"use client";

import { useState } from "react";
import AdminShell, { card, input, btn, btnGhost } from "@/components/admin/AdminShell";
import { inr, type Customer } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { WhatsAppIcon, SparkleIcon } from "@/components/site/Icons";

export default function AdminUsersPage() {
  const { customers, update } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [draft, setDraft] = useState<Customer | null>(null);
  const [viewUser, setViewUser] = useState<Customer | null>(null);

  const list = customers.filter(
    (c) =>
      (c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q.toLowerCase())) &&
      (status === "All" || c.status === status),
  );

  const getTier = (spent: number) => {
    if (spent >= 40000) return { label: "Couture Patron", color: "bg-amber-100 text-amber-800 border-amber-300" };
    if (spent >= 15000) return { label: "Bridal VIP", color: "bg-purple-100 text-purple-800 border-purple-300" };
    return { label: "Boutique Client", color: "bg-muted text-muted-foreground border-border" };
  };

  const saveUser = () => {
    if (!draft || !draft.name.trim()) return;
    const exists = customers.some((c) => c.id === draft.id);
    update(
      "customers",
      exists ? customers.map((c) => (c.id === draft.id ? draft : c)) : [draft, ...customers],
    );
    setDraft(null);
  };

  const removeUser = (id: number) => {
    if (confirm("Are you sure you want to remove this client record?")) {
      update("customers", customers.filter((c) => c.id !== id));
    }
  };

  return (
    <AdminShell
      title="Users & Client Directory"
      subtitle={`${customers.length} registered bridal patrons, boutique clients, and atelier users.`}
      action={
        <button
          className={btn}
          onClick={() =>
            setDraft({
              id: Math.max(0, ...customers.map((c) => c.id)) + 1,
              name: "",
              phone: "+91 ",
              email: "",
              orders: 0,
              bookings: 0,
              spent: 0,
              status: "Active",
            })
          }
        >
          <span>+</span>
          <span>Register New User</span>
        </button>
      }
    >
      {/* Create / Edit User Modal */}
      {draft && (
        <div className="mb-8 rounded-3xl border-2 border-gold-400/40 bg-white p-7 shadow-lift animate-fade-up">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div className="flex items-center gap-2">
              <SparkleIcon className="h-5 w-5 text-gold-400" />
              <h2 className="font-display text-xl text-primary">
                {customers.some((c) => c.id === draft.id) ? "Edit User Profile" : "Register New Client"}
              </h2>
            </div>
            <button
              onClick={() => setDraft(null)}
              className="text-xs uppercase tracking-wider text-muted-foreground hover:text-primary"
            >
              ✕ Close
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Client Name
              </label>
              <input
                placeholder="Full Name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className={input}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Phone Number
              </label>
              <input
                placeholder="+91 98765 43210"
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                className={input}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                className={input}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Total Orders Placed
              </label>
              <input
                type="number"
                value={draft.orders}
                onChange={(e) => setDraft({ ...draft, orders: Number(e.target.value) })}
                className={input}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Rental Bookings Count
              </label>
              <input
                type="number"
                value={draft.bookings}
                onChange={(e) => setDraft({ ...draft, bookings: Number(e.target.value) })}
                className={input}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </label>
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                className={input}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 md:col-span-3 border-t border-border/80 pt-5">
              <button className={btnGhost} onClick={() => setDraft(null)}>
                Cancel
              </button>
              <button className={btn} onClick={saveUser}>
                Save User Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className={`${card} mb-8 flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users by name, phone or email…"
            className={`${input} w-80`}
          />
          <div className="flex gap-2">
            {["All", "Active", "Inactive"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  status === s
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`${card} overflow-hidden p-0`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="border-b border-border/80 bg-muted/40 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Patron & Tier</th>
                <th className="px-5 py-4">Contact Details</th>
                <th className="px-5 py-4">Orders</th>
                <th className="px-5 py-4">Rentals</th>
                <th className="px-5 py-4">Lifetime Spend</th>
                <th className="px-5 py-4">Status & Outreach</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {list.map((c) => {
                const tier = getTier(c.spent);
                return (
                  <tr key={c.id} className="transition-colors hover:bg-muted/20">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush font-serif text-sm font-bold text-primary">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-medium text-foreground block">{c.name}</span>
                          <span
                            className={`mt-0.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${tier.color}`}
                          >
                            {tier.label}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      <div className="font-medium text-foreground">{c.phone}</div>
                      <div className="text-[11px]">{c.email}</div>
                    </td>

                    <td className="px-5 py-4 text-xs">
                      <span className="font-semibold text-foreground">{c.orders}</span>
                      <span className="text-muted-foreground ml-1">orders</span>
                    </td>

                    <td className="px-5 py-4 text-xs">
                      <span className="font-semibold text-foreground">{c.bookings}</span>
                      <span className="text-muted-foreground ml-1">rentals</span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-primary">{inr(c.spent)}</span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            c.status === "Active"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {c.status}
                        </span>

                        <a
                          href={`https://wa.me/91${c.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hello ${c.name}, greetings from Priyanka Desai at Gadhinglaj Models Club! We have curated new luxury arrivals for you.`,
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100"
                        >
                          <WhatsAppIcon className="h-3 w-3" />
                          Chat
                        </a>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewUser(c)}
                          className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setDraft(c)}
                          className="rounded-lg border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeUser(c.id)}
                          className="rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!list.length && (
          <div className="py-14 text-center text-sm text-muted-foreground">
            No patrons or users found matching your search.
          </div>
        )}
      </div>

      {/* User / Patron View Modal */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-lift border border-gold-300/40">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <SparkleIcon className="h-5 w-5 text-gold-400" />
                <h3 className="font-display text-xl text-primary">Patron Dossier</h3>
              </div>
              <button
                onClick={() => setViewUser(null)}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-4 bg-blush/20 p-4 rounded-2xl border border-gold-300/30">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-display font-semibold text-white">
                  {viewUser.name.charAt(0) || "U"}
                </div>
                <div>
                  <h4 className="font-display text-lg text-primary">{viewUser.name}</h4>
                  <p className="text-xs text-muted-foreground">{viewUser.email || "No email registered"}</p>
                  <p className="text-xs font-medium text-foreground">{viewUser.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Account Status</span>
                  <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    viewUser.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"
                  }`}>
                    {viewUser.status}
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Client Tier</span>
                  <span className="font-semibold text-primary mt-1 inline-block">
                    {getTier(viewUser.spent).label}
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Total Lifetime Spent</span>
                  <span className="text-base font-display font-bold text-primary mt-0.5 inline-block">
                    {inr(viewUser.spent)}
                  </span>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Activity Count</span>
                  <span className="font-semibold text-foreground mt-1 inline-block">
                    {viewUser.orders} Orders · {viewUser.bookings} Rentals
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/91${viewUser.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hello ${viewUser.name}, greetings from Priyanka Desai at Gadhinglaj Models Club!`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Chat on WhatsApp with {viewUser.name}
                </a>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-border/80 pt-4">
              <button
                onClick={() => {
                  const u = viewUser;
                  setViewUser(null);
                  setDraft(u);
                }}
                className="rounded-xl border border-primary/40 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Edit Patron
              </button>
              <button
                onClick={() => setViewUser(null)}
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/95 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

"use client";

import { useState } from "react";
import AdminShell, { card, input, btn } from "@/components/admin/AdminShell";
import { type Inquiry } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { WhatsAppIcon } from "@/components/site/Icons";

export default function AdminInquiriesPage() {
  const { inquiries, update, updateInquiryStatus, deleteInquiry } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");

  const [viewInquiry, setViewInquiry] = useState<Inquiry | null>(null);
  const [editInquiry, setEditInquiry] = useState<Inquiry | null>(null);

  const inqList = inquiries || [];

  const list = inqList.filter(
    (i) =>
      (i.name.toLowerCase().includes(q.toLowerCase()) ||
        i.phone.includes(q) ||
        i.subject.toLowerCase().includes(q.toLowerCase()) ||
        i.id.toLowerCase().includes(q.toLowerCase())) &&
      (status === "All" || i.status === status),
  );

  const updateStatus = async (id: string, newStatus: Inquiry["status"]) => {
    if (updateInquiryStatus) {
      await updateInquiryStatus(id, newStatus);
    } else {
      update(
        "inquiries",
        inqList.map((x) => (x.id === id ? { ...x, status: newStatus } : x)),
      );
    }
  };

  const removeInquiry = async (id: string) => {
    if (confirm(`Delete inquiry "${id}"?`)) {
      if (deleteInquiry) {
        await deleteInquiry(id);
      } else {
        update(
          "inquiries",
          inqList.filter((x) => x.id !== id),
        );
      }
    }
  };

  const saveEditInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInquiry) return;
    if (updateInquiryStatus) {
      await updateInquiryStatus(editInquiry.id, editInquiry.status, editInquiry.notes);
    }
    update(
      "inquiries",
      inqList.map((x) => (x.id === editInquiry.id ? editInquiry : x)),
    );
    setEditInquiry(null);
  };

  const newCount = inqList.filter((i) => i.status === "New").length;
  const contactedCount = inqList.filter((i) => i.status === "Contacted").length;
  const resolvedCount = inqList.filter((i) => i.status === "Resolved").length;

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "New":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "Contacted":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Resolved":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <AdminShell
      title="Client Consultations & Inquiries"
      subtitle={`${inqList.length} inquiries received from boutique patrons seeking custom styling or rental trails.`}
    >
      {/* Overview Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              New Consultations
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-800 font-bold text-xs">
              ★
            </span>
          </div>
          <p className="mt-2 font-display text-3xl text-rose-700">{newCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Requires stylist initial contact</p>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              In Discussion
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
              ⏳
            </span>
          </div>
          <p className="mt-2 font-display text-3xl text-amber-700">{contactedCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Stylist currently in discussion</p>
        </div>

        <div className={card}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Resolved &amp; Booked
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
              ✓
            </span>
          </div>
          <p className="mt-2 font-display text-3xl text-blue-700">{resolvedCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Trial completed or order finalized</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={`${card} mb-8 flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search inquiries by client, phone, or subject…"
            className={`${input} w-80`}
          />

          <div className="flex gap-2">
            {["All", "New", "Contacted", "Resolved"].map((s) => (
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

      {/* Inquiries Table */}
      <div className={`${card} overflow-hidden p-0`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1020px] text-left text-sm">
            <thead className="border-b border-border/80 bg-muted/40 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-5 py-4">Inquiry Ref &amp; Date</th>
                <th className="px-5 py-4">Client Contact</th>
                <th className="px-5 py-4">Subject &amp; Message</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {list.map((inq) => (
                <tr key={inq.id} className="transition-colors hover:bg-muted/20 align-top">
                  <td className="px-5 py-4">
                    <span className="font-semibold text-primary block">{inq.id}</span>
                    <span className="text-xs text-muted-foreground mt-0.5 block">{inq.date}</span>
                    <span
                      className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(
                        inq.status,
                      )}`}
                    >
                      {inq.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-medium text-foreground block">{inq.name}</span>
                    <span className="text-xs text-muted-foreground block mt-0.5">{inq.phone}</span>
                    {inq.email && (
                      <span className="text-[11px] text-muted-foreground block">{inq.email}</span>
                    )}
                  </td>

                  <td className="px-5 py-4 max-w-md">
                    <span className="font-semibold text-foreground block">{inq.subject}</span>
                    {inq.preferredDate && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md mt-1">
                        📅 Planned Visit: {inq.preferredDate} {inq.preferredTime ? `(${inq.preferredTime})` : ""}
                      </span>
                    )}
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed bg-blush/40 p-2.5 rounded-xl border border-border/60 italic line-clamp-2">
                      &ldquo;{inq.message}&rdquo;
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={inq.status}
                      onChange={(e) => updateStatus(inq.id, e.target.value as Inquiry["status"])}
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-gold-400"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs">
                      <button
                        onClick={() => setViewInquiry(inq)}
                        className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setEditInquiry({ ...inq })}
                        className="rounded-lg border border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <a
                        href={`https://wa.me/91${inq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hello ${inq.name}, greeting from Priyanka Desai at Gadhinglaj Models Club regarding your inquiry about "${inq.subject}". We would love to assist you!`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <WhatsAppIcon className="h-3 w-3" />
                        Reply
                      </a>
                      <button
                        onClick={() => removeInquiry(inq.id)}
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
            No customer inquiries found for this filter.
          </div>
        )}
      </div>

      {/* VIEW INQUIRY MODAL */}
      {viewInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Inquiry Reference</span>
                <h3 className="font-serif text-2xl font-semibold text-foreground">{viewInquiry.id}</h3>
              </div>
              <button
                onClick={() => setViewInquiry(null)}
                className="text-muted-foreground hover:text-foreground p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs bg-muted/30 p-3.5 rounded-2xl border border-border/60">
              <div className="flex justify-between border-b border-border/50 py-1">
                <span className="text-muted-foreground font-semibold">Client Name:</span>
                <span className="font-bold text-foreground text-sm">{viewInquiry.name}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-1">
                <span className="text-muted-foreground font-semibold">Phone:</span>
                <span className="font-mono text-foreground">{viewInquiry.phone}</span>
              </div>
              {viewInquiry.email && (
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground font-semibold">Email:</span>
                  <span className="text-foreground">{viewInquiry.email}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-border/50 py-1">
                <span className="text-muted-foreground font-semibold">Date Received:</span>
                <span className="text-foreground">{viewInquiry.date}</span>
              </div>
              {viewInquiry.preferredDate && (
                <div className="flex justify-between border-b border-border/50 py-1">
                  <span className="text-muted-foreground font-semibold">Planned Studio Visit:</span>
                  <span className="font-bold text-primary">
                    {viewInquiry.preferredDate} {viewInquiry.preferredTime ? `(${viewInquiry.preferredTime})` : ""}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground font-semibold">Status:</span>
                <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(viewInquiry.status)}`}>
                  {viewInquiry.status}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="text-muted-foreground font-semibold block">Subject:</span>
              <p className="font-bold text-foreground text-sm">{viewInquiry.subject}</p>
              <span className="text-muted-foreground font-semibold block pt-2">Full Message:</span>
              <p className="rounded-xl bg-blush/40 p-4 text-foreground leading-relaxed border border-border/60 italic">
                &ldquo;{viewInquiry.message}&rdquo;
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border/60">
              <a
                href={`https://wa.me/91${viewInquiry.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hello ${viewInquiry.name}, greeting from Priyanka Desai at Gadhinglaj Models Club regarding your inquiry about "${viewInquiry.subject}". We would love to assist you!`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lift hover:bg-emerald-700 transition-colors"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                Reply via WhatsApp
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const i = viewInquiry;
                    setViewInquiry(null);
                    setEditInquiry({ ...i });
                  }}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-lift"
                >
                  Edit Status
                </button>
                <button
                  onClick={() => setViewInquiry(null)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT INQUIRY MODAL */}
      {editInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
          <form onSubmit={saveEditInquiry} className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="font-serif text-xl font-semibold text-foreground">
                Edit Inquiry {editInquiry.id}
              </h3>
              <button
                type="button"
                onClick={() => setEditInquiry(null)}
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
                  value={editInquiry.name}
                  onChange={(e) => setEditInquiry({ ...editInquiry, name: e.target.value })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editInquiry.phone}
                  onChange={(e) => setEditInquiry({ ...editInquiry, phone: e.target.value })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Workflow Status</label>
                <select
                  value={editInquiry.status}
                  onChange={(e) => setEditInquiry({ ...editInquiry, status: e.target.value as Inquiry["status"] })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="New">New (Pending Contact)</option>
                  <option value="Contacted">Contacted (In Discussion)</option>
                  <option value="Resolved">Resolved (Booking Finalized)</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  value={editInquiry.subject}
                  onChange={(e) => setEditInquiry({ ...editInquiry, subject: e.target.value })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Message</label>
                <textarea
                  rows={3}
                  value={editInquiry.message}
                  onChange={(e) => setEditInquiry({ ...editInquiry, message: e.target.value })}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={() => setEditInquiry(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white shadow-lift"
              >
                Save Inquiry Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}

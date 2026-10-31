"use client";

import { useState } from "react";
import AdminShell, { btn, card, input } from "@/components/admin/AdminShell";
import { useStore } from "@/lib/store";

export default function AdminSettingsPage() {
  const { settings, update } = useStore();
  const [draft, setDraft] = useState(settings);
  const [saved, setSaved] = useState(false);

  const text = (k: "businessName" | "phone" | "email" | "address" | "currency") => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft({ ...draft, [k]: e.target.value });
    setSaved(false);
  };
  const nums = (k: "tax" | "delivery" | "depositMultiplier") => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft({ ...draft, [k]: Number(e.target.value) });
    setSaved(false);
  };

  return (
    <AdminShell title="Settings" subtitle="Store configuration used across checkout and rentals.">
      <div className={`${card} grid max-w-3xl gap-4 md:grid-cols-2`}>
        <Field label="Business name">
          <input value={draft.businessName} onChange={text("businessName")} className={input} />
        </Field>
        <Field label="Phone">
          <input value={draft.phone} onChange={text("phone")} className={input} />
        </Field>
        <Field label="Email">
          <input value={draft.email} onChange={text("email")} className={input} />
        </Field>
        <Field label="Currency">
          <input value={draft.currency} onChange={text("currency")} className={input} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Address">
            <input value={draft.address} onChange={text("address")} className={input} />
          </Field>
        </div>
        <Field label="Tax percentage">
          <input type="number" value={draft.tax} onChange={nums("tax")} className={input} />
        </Field>
        <Field label="Delivery charge">
          <input type="number" value={draft.delivery} onChange={nums("delivery")} className={input} />
        </Field>
        <Field label="Rental deposit multiplier">
          <input type="number" value={draft.depositMultiplier} onChange={nums("depositMultiplier")} className={input} />
        </Field>
        <div className="flex items-center gap-4 md:col-span-2">
          <button
            className={btn}
            onClick={() => {
              update("settings", draft);
              setSaved(true);
            }}
          >
            Save Settings
          </button>
          {saved && <span className="text-sm text-muted-foreground">Saved to this browser.</span>}
        </div>
      </div>
    </AdminShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

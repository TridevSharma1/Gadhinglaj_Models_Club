"use client";

import { useState } from "react";
import AdminShell, { btn, card, input } from "@/components/admin/AdminShell";
import { useStore } from "@/lib/store";

export default function AdminContentPage() {
  const { content, update } = useStore();
  const [draft, setDraft] = useState(content);
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDraft({ ...draft, [k]: e.target.value });
    setSaved(false);
  };

  return (
    <AdminShell title="Website Content" subtitle="Copy shown across the customer website.">
      <div className={`${card} grid max-w-3xl gap-4`}>
        <Field label="Business name">
          <input value={draft.businessName} onChange={set("businessName")} className={input} />
        </Field>
        <Field label="Owner">
          <input value={draft.owner} onChange={set("owner")} className={input} />
        </Field>
        <Field label="Phone">
          <input value={draft.phone} onChange={set("phone")} className={input} />
        </Field>
        <Field label="Email">
          <input value={draft.email} onChange={set("email")} className={input} />
        </Field>
        <Field label="Address">
          <input value={draft.address} onChange={set("address")} className={input} />
        </Field>
        <Field label="Business description / tagline">
          <textarea rows={2} value={draft.tagline} onChange={set("tagline")} className={input} />
        </Field>
        <Field label="About Us text">
          <textarea rows={5} value={draft.aboutText} onChange={set("aboutText")} className={input} />
        </Field>
        <Field label="Footer description">
          <textarea rows={3} value={draft.footerText} onChange={set("footerText")} className={input} />
        </Field>
        <div className="flex items-center gap-4">
          <button
            className={btn}
            onClick={() => {
              update("content", draft);
              setSaved(true);
            }}
          >
            Save Content
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

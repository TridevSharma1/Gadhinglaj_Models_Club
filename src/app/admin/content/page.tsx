"use client";

import { useState } from "react";
import AdminShell, { btn, card, input } from "@/components/admin/AdminShell";
import { useStore } from "@/lib/store";
import { SparkleIcon } from "@/components/site/Icons";

export default function AdminContentPage() {
  const { content, update } = useStore();
  const [draft, setDraft] = useState(content);
  const [saved, setSaved] = useState(false);

  const set =
    (k: keyof typeof draft) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraft({ ...draft, [k]: e.target.value });
      setSaved(false);
    };

  return (
    <AdminShell
      title="Atelier Story & Copy"
      subtitle="Edit branding, founder attribution, contact concierge lines, and studio description."
      action={
        <button
          className={btn}
          onClick={() => {
            update("content", draft);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
          }}
        >
          <span>✓</span>
          <span>Publish Changes</span>
        </button>
      }
    >
      <div className="max-w-4xl space-y-8">
        {saved && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-fade-up">
            ✓ Content changes saved and published across the website.
          </div>
        )}

        {/* Section 1: Brand & Founder Identity */}
        <div className={card}>
          <div className="flex items-center gap-2 border-b border-border/80 pb-3">
            <SparkleIcon className="h-4 w-4 text-gold-400" />
            <h2 className="font-display text-lg text-primary">Brand & Leadership Attribution</h2>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Business Trade Name">
              <input value={draft.businessName} onChange={set("businessName")} className={input} />
            </Field>

            <Field label="Founder & Boutique Director">
              <input value={draft.owner} onChange={set("owner")} className={input} />
            </Field>

            <div className="md:col-span-2">
              <Field label="Hero Brand Tagline">
                <textarea
                  rows={2}
                  value={draft.tagline}
                  onChange={set("tagline")}
                  className={input}
                  placeholder="e.g. Designer Boutique & Luxury Rental Studio · Priyanka Desai"
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Desk & Boutique Location */}
        <div className={card}>
          <div className="flex items-center gap-2 border-b border-border/80 pb-3">
            <h2 className="font-display text-lg text-primary">Contact Concierge & Studio Location</h2>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Direct Phone / WhatsApp">
              <input value={draft.phone} onChange={set("phone")} className={input} />
            </Field>

            <Field label="Concierge Email">
              <input value={draft.email} onChange={set("email")} className={input} />
            </Field>

            <div className="md:col-span-2">
              <Field label="Physical Boutique Address">
                <input value={draft.address} onChange={set("address")} className={input} />
              </Field>
            </div>
          </div>
        </div>

        {/* Section 3: Atelier Story & Footer Narrative */}
        <div className={card}>
          <div className="flex items-center gap-2 border-b border-border/80 pb-3">
            <h2 className="font-display text-lg text-primary">Narrative & Editorial Copy</h2>
          </div>

          <div className="mt-5 space-y-5">
            <Field label="About Us Atelier Narrative (Shown on /about and homepage founder spotlight)">
              <textarea
                rows={5}
                value={draft.aboutText}
                onChange={set("aboutText")}
                className={input}
              />
            </Field>

            <Field label="Footer Summary Narrative">
              <textarea
                rows={3}
                value={draft.footerText}
                onChange={set("footerText")}
                className={input}
              />
            </Field>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/80 pt-6">
          <p className="text-xs text-muted-foreground">
            Changes persist safely in your browser storage session.
          </p>
          <button
            className={btn}
            onClick={() => {
              update("content", draft);
              setSaved(true);
              setTimeout(() => setSaved(false), 3000);
            }}
          >
            <span>✓</span>
            <span>Publish Changes</span>
          </button>
        </div>
      </div>
    </AdminShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

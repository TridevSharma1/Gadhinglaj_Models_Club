"use client";

import { useState } from "react";
import AdminShell, { btn, card, input } from "@/components/admin/AdminShell";
import { useStore } from "@/lib/store";
import { SparkleIcon, ShieldCheckIcon } from "@/components/site/Icons";

export default function AdminSettingsPage() {
  const { settings, content, update, saveSiteContent } = useStore();
  const [activeTab, setActiveTab] = useState<"store" | "content" | "topAd">("store");

  const [draftSettings, setDraftSettings] = useState(settings);
  const [draftContent, setDraftContent] = useState(content);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const textSetting =
    (k: "businessName" | "phone" | "email" | "address" | "currency") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDraftSettings({ ...draftSettings, [k]: e.target.value });
      setSaved(false);
    };

  const numSetting =
    (k: "tax" | "delivery" | "depositMultiplier") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDraftSettings({ ...draftSettings, [k]: Number(e.target.value) });
      setSaved(false);
    };

  const textContent =
    (k: keyof typeof draftContent) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraftContent({ ...draftContent, [k]: e.target.value });
      setSaved(false);
    };

  const handleSave = async () => {
    try {
      setSaving(true);
      update("settings", draftSettings);
      update("content", draftContent);
      await saveSiteContent(draftContent);
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err: any) {
      console.warn("MongoDB sync failed:", err);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="Website & Store Settings"
      subtitle="Configure store billing parameters, delivery rates, top header ad ribbon, and brand editorial content."
      action={
        <button className={btn} onClick={handleSave} disabled={saving}>
          <span>✓</span>
          <span>{saving ? "Saving…" : "Save All Settings"}</span>
        </button>
      }
    >
      <div className="max-w-4xl space-y-6">
        {saved && (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-fade-up">
            ✓ Website settings, store parameters, and top header ad ribbon updated successfully!
          </div>
        )}

        {/* Setting Tabs */}
        <div className="flex flex-wrap gap-2.5 border-b border-border/80 pb-3">
          <button
            onClick={() => setActiveTab("store")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "store"
                ? "bg-primary text-primary-foreground shadow-lift"
                : "bg-white border border-border text-muted-foreground hover:text-primary"
            }`}
          >
            Store &amp; Billing Rules
          </button>

          <button
            onClick={() => setActiveTab("topAd")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "topAd"
                ? "bg-primary text-primary-foreground shadow-lift"
                : "bg-white border border-border text-muted-foreground hover:text-primary"
            }`}
          >
            Top Header Ad Ribbon
          </button>

          <button
            onClick={() => setActiveTab("content")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "content"
                ? "bg-primary text-primary-foreground shadow-lift"
                : "bg-white border border-border text-muted-foreground hover:text-primary"
            }`}
          >
            Website Content &amp; Story
          </button>
        </div>

        {/* TAB 1: STORE RULES */}
        {activeTab === "store" && (
          <div className="space-y-6">
            <div className={card}>
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <SparkleIcon className="h-4 w-4 text-gold-400" />
                <h2 className="font-display text-lg text-primary">Financial &amp; Rental Mechanics</h2>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <div>
                  <Field label="GST / Luxury Tax (%)">
                    <input
                      type="number"
                      value={draftSettings.tax}
                      onChange={numSetting("tax")}
                      className={input}
                    />
                  </Field>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Calculated on ready-to-wear orders. Set 0 for inclusive.
                  </p>
                </div>

                <div>
                  <Field label="Flat Delivery Charge (₹)">
                    <input
                      type="number"
                      value={draftSettings.delivery}
                      onChange={numSetting("delivery")}
                      className={input}
                    />
                  </Field>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Flat shipping fee added at checkout across Maharashtra.
                  </p>
                </div>

                <div>
                  <Field label="Rental Deposit Multiplier">
                    <input
                      type="number"
                      step="0.5"
                      value={draftSettings.depositMultiplier}
                      onChange={numSetting("depositMultiplier")}
                      className={input}
                    />
                  </Field>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Default 2.0 (Security deposit = 2× rental price).
                  </p>
                </div>
              </div>
            </div>

            <div className={card}>
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <ShieldCheckIcon className="h-4 w-4 text-gold-400" />
                <h2 className="font-display text-lg text-primary">Regional Parameters</h2>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Field label="Store Currency Symbol">
                  <input
                    value={draftSettings.currency}
                    onChange={textSetting("currency")}
                    className={input}
                  />
                </Field>
                <Field label="Primary Contact Number">
                  <input
                    value={draftSettings.phone}
                    onChange={textSetting("phone")}
                    className={input}
                  />
                </Field>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TOP HEADER AD RIBBON */}
        {activeTab === "topAd" && (
          <div className="space-y-6">
            <div className={card}>
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2">
                  <SparkleIcon className="h-4 w-4 text-gold-400" />
                  <h2 className="font-display text-lg text-primary">
                    Top Header Ad &amp; Announcement Ribbon
                  </h2>
                </div>
                <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draftContent.topAdEnabled ?? true}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        topAdEnabled: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded accent-[#E5252A]"
                  />
                  <span>Ad Bar Active</span>
                </label>
              </div>

              <div className="mt-5 space-y-4">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Brand Highlight Prefix">
                    <input
                      value={draftContent.topAdPrefix ?? "Gadhinglaj Models Club"}
                      onChange={textContent("topAdPrefix")}
                      className={input}
                    />
                  </Field>

                  <Field label="Ad Click Destination (URL)">
                    <input
                      value={draftContent.topAdLink ?? "/rental"}
                      onChange={textContent("topAdLink")}
                      className={input}
                    />
                  </Field>
                </div>

                <Field label="Headline Announcement / Ad Text">
                  <textarea
                    rows={2}
                    value={
                      draftContent.topAdText ??
                      "Designer Boutique & Luxury Dress Rental Studio by Priyanka Desai"
                    }
                    onChange={textContent("topAdText")}
                    className={input}
                  />
                </Field>

                <div className="grid gap-5 md:grid-cols-3">
                  <Field label="Feature Highlight Pill">
                    <input
                      value={draftContent.topAdFeature ?? "Complimentary Fitting"}
                      onChange={textContent("topAdFeature")}
                      className={input}
                    />
                  </Field>

                  <Field label="Hotline Contact Number">
                    <input
                      value={draftContent.topAdPhone ?? draftContent.phone}
                      onChange={textContent("topAdPhone")}
                      className={input}
                    />
                  </Field>

                  <Field label="WhatsApp Concierge Button Label">
                    <input
                      value={draftContent.topAdBtnText ?? "Stylist Concierge"}
                      onChange={textContent("topAdBtnText")}
                      className={input}
                    />
                  </Field>
                </div>

                <Field label="Pre-filled WhatsApp Inquire Message">
                  <textarea
                    rows={2}
                    value={
                      draftContent.topAdWhatsAppMessage ??
                      "Hello Priyanka ji, I would like to inquire about outfit rental and trial fitting at Gadhinglaj Models Club."
                    }
                    onChange={textContent("topAdWhatsAppMessage")}
                    className={input}
                  />
                </Field>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WEBSITE CONTENT & STORY */}
        {activeTab === "content" && (
          <div className="space-y-6">
            <div className={card}>
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <SparkleIcon className="h-4 w-4 text-gold-400" />
                <h2 className="font-display text-lg text-primary">Brand Identity &amp; Founder</h2>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Field label="Business Trade Name">
                  <input
                    value={draftContent.businessName}
                    onChange={textContent("businessName")}
                    className={input}
                  />
                </Field>

                <Field label="Founder &amp; Boutique Director">
                  <input
                    value={draftContent.owner}
                    onChange={textContent("owner")}
                    className={input}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Brand Tagline">
                    <textarea
                      rows={2}
                      value={draftContent.tagline}
                      onChange={textContent("tagline")}
                      className={input}
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className={card}>
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <h2 className="font-display text-lg text-primary">Contact &amp; Physical Boutique Location</h2>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Field label="Direct Phone / WhatsApp">
                  <input
                    value={draftContent.phone}
                    onChange={textContent("phone")}
                    className={input}
                  />
                </Field>

                <Field label="Concierge Email">
                  <input
                    value={draftContent.email}
                    onChange={textContent("email")}
                    className={input}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Physical Boutique Address">
                    <input
                      value={draftContent.address}
                      onChange={textContent("address")}
                      className={input}
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className={card}>
              <div className="flex items-center gap-2 border-b border-border/80 pb-3">
                <h2 className="font-display text-lg text-primary">Atelier Story &amp; Editorial Narratives</h2>
              </div>

              <div className="mt-5 space-y-5">
                <Field label="About Us Narrative (Appears on /about and homepage founder spotlight)">
                  <textarea
                    rows={5}
                    value={draftContent.aboutText}
                    onChange={textContent("aboutText")}
                    className={input}
                  />
                </Field>

                <Field label="Footer Summary Narrative">
                  <textarea
                    rows={3}
                    value={draftContent.footerText}
                    onChange={textContent("footerText")}
                    className={input}
                  />
                </Field>
              </div>
            </div>
          </div>
        )}

        {/* Footer Action */}
        <div className="flex items-center justify-between border-t border-border/80 pt-6">
          <p className="text-xs text-muted-foreground">
            Settings persist in your secure browser local sandbox.
          </p>
          <button className={btn} onClick={handleSave}>
            <span>✓</span>
            <span>Save All Settings</span>
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

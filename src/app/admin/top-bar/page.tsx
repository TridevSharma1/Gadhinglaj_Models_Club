"use client";

import { useState } from "react";
import AdminShell, { btn, btnGhost, card, input } from "@/components/admin/AdminShell";
import { useStore } from "@/lib/store";
import { SparkleIcon } from "@/components/site/Icons";
import { Scissors, Phone, CheckCircle2, Eye, Megaphone, Link as LinkIcon, Palette } from "lucide-react";

export default function AdminTopBarPage() {
  const { content, saveSiteContent, update } = useStore();

  const [draft, setDraft] = useState({
    topAdEnabled: content.topAdEnabled ?? true,
    topAdPrefix: content.topAdPrefix ?? "Gadhinglaj Models Club",
    topAdText:
      content.topAdText ??
      "Designer Boutique & Luxury Dress Rental Studio by Priyanka Desai",
    topAdLink: content.topAdLink ?? "/rental",
    topAdFeature: content.topAdFeature ?? "Complimentary Fitting",
    topAdShowFeature: content.topAdShowFeature ?? true,
    topAdPhone: content.topAdPhone ?? content.phone ?? "+91 96996 20950",
    topAdShowPhone: content.topAdShowPhone ?? true,
    topAdBtnText: content.topAdBtnText ?? "Stylist Concierge",
    topAdWhatsAppMessage:
      content.topAdWhatsAppMessage ??
      "Hello Priyanka ji, I would like to inquire about outfit rental and trial fitting at Gadhinglaj Models Club.",
    topAdTheme: content.topAdTheme ?? "burgundy",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const previewThemeClass = (() => {
    switch (draft.topAdTheme) {
      case "noir":
        return "bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-zinc-800";
      case "gold":
        return "bg-gradient-to-r from-[#2A2008] via-[#4A380E] to-[#201806] border-gold-400/30";
      case "emerald":
        return "bg-gradient-to-r from-[#061A12] via-[#0E3524] to-[#04140D] border-emerald-500/30";
      case "ruby":
        return "bg-gradient-to-r from-[#26050B] via-[#4A0A16] to-[#1F0409] border-rose-500/30";
      default:
        return "bg-gradient-to-r from-[#1A080E] via-[#2D0F1A] to-[#14060B] border-gold-400/20";
    }
  })();

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess(false);

      // Optimistic update
      update("content", { ...content, ...draft });

      // Save to MongoDB Atlas
      await saveSiteContent(draft);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      alert("Error saving top ad banner settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (confirm("Reset Top Header Ad settings to atelier defaults?")) {
      setDraft({
        topAdEnabled: true,
        topAdPrefix: "Gadhinglaj Models Club",
        topAdText:
          "Designer Boutique & Luxury Dress Rental Studio by Priyanka Desai",
        topAdLink: "/rental",
        topAdFeature: "Complimentary Fitting",
        topAdShowFeature: true,
        topAdPhone: "+91 96996 20950",
        topAdShowPhone: true,
        topAdBtnText: "Stylist Concierge",
        topAdWhatsAppMessage:
          "Hello Priyanka ji, I would like to inquire about outfit rental and trial fitting at Gadhinglaj Models Club.",
        topAdTheme: "burgundy",
      });
    }
  };

  return (
    <AdminShell
      title="Top Header Ad & Announcement Ribbon"
      subtitle="Manage the top header advertisement bar displayed above the navbar across every page of the website."
      action={
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={btnGhost}
            onClick={handleResetToDefault}
            disabled={saving}
          >
            Reset Defaults
          </button>
          <button
            type="button"
            className={btn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving Changes…" : "Save Ad Changes"}
          </button>
        </div>
      }
    >
      {/* Success Notification Alert */}
      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 shadow-sm animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>Top Header Ad changes successfully saved to database and live across the boutique!</span>
        </div>
      )}

      {/* 1. Live Interactive Preview */}
      <div className="mb-8 rounded-3xl border-2 border-gold-400/40 bg-white p-6 shadow-lift">
        <div className="flex items-center justify-between border-b border-border/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gold-600" />
            <h2 className="font-serif text-base font-bold text-foreground">
              Live Real-Time Ad Ribbon Preview
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            Status:{" "}
            <strong className={draft.topAdEnabled ? "text-emerald-700" : "text-rose-700"}>
              {draft.topAdEnabled ? "Visible to Visitors" : "Hidden from Website"}
            </strong>
          </span>
        </div>

        {draft.topAdEnabled ? (
          <div
            className={`relative rounded-xl border p-2.5 text-white shadow-inner transition-all duration-300 ${previewThemeClass}`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-medium tracking-wider">
              {/* Left: Message */}
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="flex h-2 w-2 shrink-0 rounded-full bg-gold-400 shadow-sm animate-pulse" />
                <p className="truncate text-gold-300 font-light">
                  {draft.topAdPrefix && (
                    <span className="font-semibold text-white mr-1.5">
                      {draft.topAdPrefix}
                    </span>
                  )}
                  {draft.topAdPrefix && draft.topAdText && <span>· </span>}
                  <span>{draft.topAdText}</span>
                </p>
              </div>

              {/* Right: Hotline & Concierge Button */}
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-zinc-300 shrink-0">
                {draft.topAdShowFeature && draft.topAdFeature && (
                  <div className="flex items-center gap-1.5 text-gold-300">
                    <Scissors className="h-3 w-3" />
                    <span>{draft.topAdFeature}</span>
                  </div>
                )}
                {draft.topAdShowFeature && draft.topAdFeature && draft.topAdShowPhone && (
                  <span className="text-white/20">|</span>
                )}
                {draft.topAdShowPhone && (
                  <div className="flex items-center gap-1 text-zinc-300">
                    <Phone className="h-3 w-3 text-gold-400" />
                    <span>{draft.topAdPhone}</span>
                  </div>
                )}
                {draft.topAdBtnText && (
                  <>
                    <span className="text-white/20">|</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[9px] text-emerald-300 font-bold">
                      {draft.topAdBtnText}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 py-6 text-center text-xs text-muted-foreground">
            Top Header Ad ribbon is currently turned off. Check the &quot;Enable Ad Ribbon&quot; box below to activate.
          </div>
        )}
      </div>

      {/* 2. Configuration Form */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Core Message & Visibility */}
        <div className="space-y-6">
          <div className={card}>
            <div className="flex items-center gap-2 border-b border-border/80 pb-3 mb-4">
              <Megaphone className="h-4 w-4 text-gold-600" />
              <h3 className="font-serif text-base font-bold text-foreground">
                Headline Message &amp; Link
              </h3>
            </div>

            <div className="space-y-4">
              {/* Enable / Disable Toggle */}
              <div className="rounded-2xl border border-border/80 bg-muted/20 p-3.5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.topAdEnabled}
                    onChange={(e) =>
                      setDraft({ ...draft, topAdEnabled: e.target.checked })
                    }
                    className="h-4 w-4 rounded accent-[#E5252A] cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-foreground block">
                      Enable Top Header Ad Ribbon
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Display this announcement strip at the very top of all website pages.
                    </span>
                  </div>
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Brand Highlight Prefix
                </label>
                <input
                  className={input}
                  placeholder="e.g. Gadhinglaj Models Club"
                  value={draft.topAdPrefix}
                  onChange={(e) =>
                    setDraft({ ...draft, topAdPrefix: e.target.value })
                  }
                />
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  Displayed in bold white text at the start of the ribbon.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Ad Headline / Announcement Text
                </label>
                <textarea
                  rows={2}
                  className={input}
                  placeholder="e.g. Designer Boutique & Luxury Dress Rental Studio by Priyanka Desai"
                  value={draft.topAdText}
                  onChange={(e) =>
                    setDraft({ ...draft, topAdText: e.target.value })
                  }
                />
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  The primary promotional message seen by visitors.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Ad Click URL / Destination Page
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    className={`${input} pl-9`}
                    placeholder="e.g. /rental, /readymade, /categories, /shop"
                    value={draft.topAdLink}
                    onChange={(e) =>
                      setDraft({ ...draft, topAdLink: e.target.value })
                    }
                  />
                </div>
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  Optional destination when visitors click the announcement text.
                </span>
              </div>
            </div>
          </div>

          {/* Color Theme Selector */}
          <div className={card}>
            <div className="flex items-center gap-2 border-b border-border/80 pb-3 mb-4">
              <Palette className="h-4 w-4 text-gold-600" />
              <h3 className="font-serif text-base font-bold text-foreground">
                Ribbon Background Theme
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: "burgundy", name: "Burgundy Atelier", color: "bg-[#2D0F1A]" },
                { id: "noir", name: "Royal Noir Black", color: "bg-zinc-950" },
                { id: "gold", name: "Imperial Gold", color: "bg-[#4A380E]" },
                { id: "emerald", name: "Emerald Silk", color: "bg-[#0E3524]" },
                { id: "ruby", name: "Festive Crimson", color: "bg-[#4A0A16]" },
              ].map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setDraft({ ...draft, topAdTheme: theme.id })}
                  className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs font-semibold transition-all ${
                    draft.topAdTheme === theme.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 text-primary"
                      : "border-border/80 bg-white hover:border-gold-300 text-foreground"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full border border-white/20 shrink-0 ${theme.color}`}
                  />
                  <span className="truncate">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Hotline, Badge & Concierge CTA */}
        <div className="space-y-6">
          <div className={card}>
            <div className="flex items-center gap-2 border-b border-border/80 pb-3 mb-4">
              <SparkleIcon className="h-4 w-4 text-gold-600" />
              <h3 className="font-serif text-base font-bold text-foreground">
                Right-Side Highlights &amp; Hotline
              </h3>
            </div>

            <div className="space-y-4">
              {/* Feature Badge */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Feature Highlight Badge
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.topAdShowFeature}
                      onChange={(e) =>
                        setDraft({ ...draft, topAdShowFeature: e.target.checked })
                      }
                      className="h-3.5 w-3.5 rounded accent-[#E5252A]"
                    />
                    <span>Show on bar</span>
                  </label>
                </div>
                <input
                  className={input}
                  placeholder="e.g. Complimentary Fitting"
                  value={draft.topAdFeature}
                  onChange={(e) =>
                    setDraft({ ...draft, topAdFeature: e.target.value })
                  }
                  disabled={!draft.topAdShowFeature}
                />
              </div>

              {/* Phone Hotline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Hotline Phone Number
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.topAdShowPhone}
                      onChange={(e) =>
                        setDraft({ ...draft, topAdShowPhone: e.target.checked })
                      }
                      className="h-3.5 w-3.5 rounded accent-[#E5252A]"
                    />
                    <span>Show on bar</span>
                  </label>
                </div>
                <input
                  className={input}
                  placeholder="e.g. +91 96996 20950"
                  value={draft.topAdPhone}
                  onChange={(e) =>
                    setDraft({ ...draft, topAdPhone: e.target.value })
                  }
                  disabled={!draft.topAdShowPhone}
                />
              </div>

              {/* Button Text */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  WhatsApp Concierge Button Label
                </label>
                <input
                  className={input}
                  placeholder="e.g. Stylist Concierge"
                  value={draft.topAdBtnText}
                  onChange={(e) =>
                    setDraft({ ...draft, topAdBtnText: e.target.value })
                  }
                />
              </div>

              {/* WhatsApp Message */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Pre-filled WhatsApp Inquire Message
                </label>
                <textarea
                  rows={3}
                  className={input}
                  placeholder="e.g. Hello Priyanka ji, I would like to inquire about outfit rental and trial fitting at Gadhinglaj Models Club."
                  value={draft.topAdWhatsAppMessage}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      topAdWhatsAppMessage: e.target.value,
                    })
                  }
                />
                <span className="text-[11px] text-muted-foreground mt-1 block">
                  Automatically pre-filled when visitors tap the Concierge button.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

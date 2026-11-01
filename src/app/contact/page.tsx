"use client";

import { useState } from "react";
import Link from "next/link";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { type Inquiry } from "@/data/catalog";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Calendar,
  Sparkles,
  CalendarDays,
  ExternalLink,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";

const field =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-gold-400 focus:ring-1 focus:ring-gold-400 shadow-soft";

export default function ContactPage() {
  const { content, addInquiry } = useStore();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedInquiry, setConfirmedInquiry] = useState<Inquiry | null>(null);

  // Today's date in YYYY-MM-DD for min date picker
  const todayStr = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "In-Studio Trial & Fitting Consultation",
    preferredDate: todayStr,
    preferredTime: "Afternoon (1:00 PM – 5:00 PM)",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate phone number
    const cleanPhone = form.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit phone or WhatsApp number.");
      return;
    }

    setLoading(true);

    try {
      const now = new Date();
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const generatedId = `INQ-${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${randomCode}`;

      const newInquiry: Partial<Inquiry> = {
        id: generatedId,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        subject: form.subject,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        message: form.message.trim(),
        date: todayStr,
        status: "New",
        source: "Visit Atelier Page",
      };

      const result = await addInquiry(newInquiry);
      setConfirmedInquiry(result || (newInquiry as Inquiry));
      setSent(true);
    } catch (err: any) {
      console.error("Inquiry submission error:", err);
      setErrorMessage(
        err.message || "Failed to submit inquiry. Please try again or message us on WhatsApp."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      subject: "In-Studio Trial & Fitting Consultation",
      preferredDate: todayStr,
      preferredTime: "Afternoon (1:00 PM – 5:00 PM)",
      message: "",
    });
    setSent(false);
    setConfirmedInquiry(null);
    setErrorMessage(null);
  };

  // WhatsApp prefilled message URL for the confirmed inquiry
  const getWhatsAppConfirmationUrl = () => {
    const inq = confirmedInquiry;
    const phoneNum = content.phone.replace(/[^0-9]/g, "") || "9699620950";
    const text = encodeURIComponent(
      `Hello Gadhinglaj Models Club Atelier!\n\n` +
      `I just submitted a Visit / Trial Inquiry on your website:\n` +
      `• Reference ID: #${inq?.id || "NEW"}\n` +
      `• Name: ${inq?.name || form.name}\n` +
      `• Purpose: ${inq?.subject || form.subject}\n` +
      (inq?.preferredDate ? `• Preferred Visit Date: ${inq.preferredDate} (${inq.preferredTime || "Flexible"})\n` : "") +
      `\nCould you please confirm slot availability for my trial session? Thank you!`
    );
    return `https://wa.me/91${phoneNum}?text=${text}`;
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Connect With Us"
        title="Visit The Atelier &amp; Contact Us"
        subtitle="Walk in for a personalized trial fitting session or reserve dedicated studio time for our luxury bridal &amp; rental collections."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Visit & Contact" }]}
      />

      <div className="container-lux py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column: Boutique Information & Visit Guide */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-soft space-y-6">
              <div>
                <span className="eyebrow">Gadhinglaj Studio</span>
                <h2 className="mt-1 font-display text-3xl text-primary font-medium">
                  {content.businessName}
                </h2>
                <div className="gold-rule mt-2" />
              </div>

              <div className="space-y-4 text-sm text-muted-foreground font-light leading-relaxed">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-medium text-foreground">Boutique Address</strong>
                    <span>{content.address}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      Near Shivaji Bank, Tilak Path, Gadhinglaj 416502
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-medium text-foreground">Phone &amp; Styling Inquiries</strong>
                    <a
                      href={`tel:${content.phone.replace(/\s/g, "")}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {content.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-medium text-foreground">Email Support</strong>
                    <a
                      href={`mailto:${content.email}`}
                      className="break-all text-primary hover:underline"
                    >
                      {content.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-medium text-foreground">Studio Operating Hours</strong>
                    <span>Open all 7 Days · 10:00 AM – 9:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="border-t border-border/70 pt-5">
                <a
                  href={`https://wa.me/91${content.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    "Hi Gadhinglaj Models Club, I would like to inquire about your outfits and plan a studio trial visit.",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lift hover:bg-emerald-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Instant WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Travel / Landmark note */}
            <div className="rounded-3xl border border-border/80 bg-secondary/50 p-6 space-y-2 text-xs">
              <p className="font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-gold-500" />
                <span>Visiting from out of town?</span>
              </p>
              <p className="text-muted-foreground font-light leading-relaxed">
                We frequently welcome brides and families traveling from Kolhapur, Belgaum, Sankeshwar, Nipani, and Ajra. Submitting this inquiry allows our master tailor and lead stylist Priyanka Desai to prep your curated trial rack prior to your arrival.
              </p>
            </div>
          </div>

          {/* Right Column: Workable Inquiry & Visit Booking Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border/80 bg-card p-8 md:p-12 shadow-lift space-y-6">
              <div>
                <span className="eyebrow">Atelier Desk</span>
                <h3 className="mt-1 font-display text-3xl text-primary font-medium">
                  {sent ? "Inquiry Confirmed" : "Book A Studio Visit / Inquiry"}
                </h3>
                <div className="gold-rule mt-2" />
                <p className="mt-3 text-xs text-muted-foreground font-light">
                  {sent
                    ? "Your appointment & inquiry details have been registered directly in our studio desk."
                    : "Share your upcoming occasion, preferred fitting date, or questions. We will confirm your session immediately."}
                </p>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 animate-fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {sent && confirmedInquiry ? (
                <div className="animate-fade-up rounded-3xl bg-secondary/60 p-8 md:p-10 text-center space-y-5 border border-border/70">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-soft">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>

                  <div>
                    <span className="rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-mono font-bold tracking-wider inline-block">
                      Reference #{confirmedInquiry.id}
                    </span>
                    <h4 className="font-display text-2xl text-primary font-medium mt-3">
                      Thank You, {confirmedInquiry.name}!
                    </h4>
                    <p className="text-sm text-muted-foreground font-light max-w-md mx-auto mt-1.5">
                      Your visit inquiry for <strong>{confirmedInquiry.subject}</strong> has been logged in our atelier schedule.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="rounded-2xl border border-border/80 bg-white p-5 text-left text-xs space-y-2.5 max-w-md mx-auto shadow-2xs">
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">Client Name:</span>
                      <strong className="text-foreground">{confirmedInquiry.name}</strong>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">Phone Number:</span>
                      <strong className="text-foreground">{confirmedInquiry.phone}</strong>
                    </div>
                    {confirmedInquiry.email && (
                      <div className="flex justify-between border-b border-border/50 pb-2">
                        <span className="text-muted-foreground">Email:</span>
                        <strong className="text-foreground">{confirmedInquiry.email}</strong>
                      </div>
                    )}
                    {confirmedInquiry.preferredDate && (
                      <div className="flex justify-between border-b border-border/50 pb-2">
                        <span className="text-muted-foreground">Planned Visit:</span>
                        <strong className="text-primary font-bold">
                          {confirmedInquiry.preferredDate}{" "}
                          {confirmedInquiry.preferredTime ? `· ${confirmedInquiry.preferredTime}` : ""}
                        </strong>
                      </div>
                    )}
                    {confirmedInquiry.message && (
                      <div className="pt-1">
                        <span className="text-muted-foreground block mb-0.5">Fitting Notes:</span>
                        <p className="italic text-foreground line-clamp-2">
                          &quot;{confirmedInquiry.message}&quot;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Direct Action Button */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={getWhatsAppConfirmationUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lift hover:bg-emerald-700 transition-all hover:-translate-y-0.5"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Connect on WhatsApp Now</span>
                    </a>

                    <button
                      onClick={handleReset}
                      className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-muted transition-colors"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name and Phone Row */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Meera Patil"
                        className={field}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                        Phone / WhatsApp Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className={field}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email & Purpose Row */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                        Email Address <span className="text-muted-foreground/60 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="meera@example.com"
                        className={field}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                        Occasion / Interest Type <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className={field}
                        disabled={loading}
                      >
                        <option>In-Studio Trial &amp; Fitting Consultation</option>
                        <option>Pre-Wedding Shoot Gown &amp; Outfit Rental</option>
                        <option>Bridal &amp; Reception Luxury Collection</option>
                        <option>Maternity Photoshoot Gown</option>
                        <option>Ready-Made Direct Purchase</option>
                        <option>Saree Draping &amp; Styling Assistance</option>
                        <option>Bespoke Tailoring &amp; Alterations</option>
                        <option>Other Atelier Enquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Planned Visit Date & Time Slot Row */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-gold-500" />
                        <span>Preferred Visit / Trial Date</span>
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        value={form.preferredDate}
                        onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                        className={field}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gold-500" />
                        <span>Preferred Time Slot</span>
                      </label>
                      <select
                        value={form.preferredTime}
                        onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                        className={field}
                        disabled={loading}
                      >
                        <option>Morning (10:00 AM – 1:00 PM)</option>
                        <option>Afternoon (1:00 PM – 5:00 PM)</option>
                        <option>Evening (5:00 PM – 9:00 PM)</option>
                        <option>Flexible / Walk-in Any Time</option>
                      </select>
                    </div>
                  </div>

                  {/* Message & Fitting Notes */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                      Your Message or Fitting Notes <span className="text-muted-foreground/60 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Share your event date, preferred colors/silhouettes, or trial requirements…"
                      className={field}
                      disabled={loading}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2.5 rounded-full bg-primary py-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift hover:opacity-95 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-gold-300" />
                        <span>Submitting Your Inquiry…</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Book Visit &amp; Send Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

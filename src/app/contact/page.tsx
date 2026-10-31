"use client";

import { useState } from "react";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
} from "lucide-react";

const field =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-rose shadow-soft";

export default function ContactPage() {
  const { content, addInquiry } = useStore();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Pre-Wedding Shoot Rental",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      name: form.name,
      phone: form.phone,
      email: form.email,
      subject: form.subject,
      message: form.message,
      date: new Date().toISOString().split("T")[0],
      status: "New",
    });
    setSent(true);
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Connect With Us"
        title="Visit The Atelier &amp; Contact Us"
        subtitle="Walk in for a personalized trial fitting session or reach out for date availability on our luxury dress rentals."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />

      <div className="container-lux py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column: Boutique Information */}
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
                    <span className="block text-xs text-muted-foreground mt-0.5">Near Shivaji Bank, Tilak Path</span>
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
                    "Hi Gadhinglaj Models Club, I would like to inquire about your outfits and trial fittings.",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lift hover:bg-emerald-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Direct WhatsApp Chat
                </a>
              </div>
            </div>

            {/* Travel / Landmark note */}
            <div className="rounded-3xl border border-border/80 bg-secondary/50 p-6 space-y-2 text-xs">
              <p className="font-semibold text-primary uppercase tracking-wider">Visiting from out of town?</p>
              <p className="text-muted-foreground font-light leading-relaxed">
                We regularly welcome clients traveling from Kolhapur, Belgaum, Sankeshwar, Nipani, and Ajra. Feel free to call us ahead so we can prepare your preferred pieces for trial.
              </p>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border/80 bg-card p-8 md:p-12 shadow-lift space-y-6">
              <div>
                <span className="eyebrow">Message The Stylist</span>
                <h3 className="mt-1 font-display text-3xl text-primary font-medium">
                  Send A Direct Inquiry
                </h3>
                <div className="gold-rule mt-2" />
                <p className="mt-3 text-xs text-muted-foreground font-light">
                  Tell us about your upcoming event, preferred trial date, or outfit requirements.
                </p>
              </div>

              {sent ? (
                <div className="animate-fade-up rounded-2xl bg-secondary/60 p-10 text-center space-y-3">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                  <h4 className="font-display text-2xl text-primary font-medium">Inquiry Received</h4>
                  <p className="text-sm text-muted-foreground font-light max-w-md mx-auto">
                    Thank you for reaching out to Gadhinglaj Models Club. Priyanka will respond to you via phone or WhatsApp shortly.
                  </p>
                  <button
                    onClick={() => {
                      setForm({
                        name: "",
                        phone: "",
                        email: "",
                        subject: "Pre-Wedding Shoot Rental",
                        message: "",
                      });
                      setSent(false);
                    }}
                    className="mt-4 rounded-full border border-border px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-blush"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                        Your Full Name
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Meera Patil"
                        className={field}
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                        Phone / WhatsApp Number
                      </label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className={field}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="meera@example.com"
                        className={field}
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                        Occasion / Interest
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className={field}
                      >
                        <option>Pre-Wedding Shoot Rental</option>
                        <option>Maternity Photoshoot Gown</option>
                        <option>Bridal / Reception Outfit</option>
                        <option>Ready-Made Direct Purchase</option>
                        <option>In-Studio Fitting Consultation</option>
                        <option>Other Enquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
                      Your Message or Fitting Notes
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Share your occasion date, preferred silhouette styles, or measurements…"
                      className={field}
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift hover:opacity-95 transition-opacity"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Inquiry to Boutique</span>
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

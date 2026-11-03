"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import SiteLayout, { EmptyState } from "@/components/site/SiteLayout";
import InvoiceDocument from "@/components/site/InvoiceDocument";
import { inr } from "@/data/catalog";
import { useStore } from "@/lib/store";
import {
  CheckCircle2,
  Printer,
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  Calendar,
  Mail,
  Loader2,
  FileText,
} from "lucide-react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const paymentId = searchParams.get("payment_id");
  const { orders, content } = useStore();
  const order = orders.find((o) => o.id === id);
  const activePaymentId = paymentId || order?.razorpayPaymentId;

  const [emailSending, setEmailSending] = useState(false);
  const [emailNotice, setEmailNotice] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleSendEmailInvoice = async () => {
    if (!order) return;
    setEmailSending(true);
    setEmailNotice("");
    try {
      const res = await fetch("/api/orders/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, order }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailNotice(`Invoice successfully sent to ${order.email || "your registered email"}.`);
      } else {
        setEmailNotice(data.error || "Could not dispatch email invoice.");
      }
    } catch {
      setEmailNotice("Failed to dispatch email invoice.");
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="container-lux py-16 md:py-24">
      {!order ? (
        <EmptyState
          title="Order Not Found"
          text="We could not locate that order reference in your current session records."
          action={
            <Link
              href="/shop"
              className="rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift"
            >
              Continue Shopping
            </Link>
          }
        />
      ) : (
        <>
          <div className="animate-fade-up mx-auto max-w-2xl rounded-3xl border border-border/80 bg-card p-8 md:p-14 text-center shadow-lift space-y-7 print:hidden">
            {/* Animated Gold Checkmark */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent to-gold text-accent-foreground shadow-gold">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>

            <div>
              <span className="eyebrow">Thank You For Your Patronage</span>
              <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-primary font-normal">
                Order Confirmed
              </h1>
              <div className="gold-rule mx-auto mt-4" />
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground font-light max-w-lg mx-auto">
              Your boutique order <strong className="font-semibold text-foreground">{order.id}</strong> has been registered. Our concierge will contact you on <strong className="font-semibold text-foreground">{order.phone}</strong> for fitting preferences and dispatch coordination.
            </p>

            {activePaymentId && (
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-800 shadow-2xs">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Razorpay Payment Verified: <strong className="font-mono text-emerald-950">{activePaymentId}</strong></span>
              </div>
            )}

            {/* Email Dispatch Notice */}
            <div className="rounded-2xl border border-border/80 bg-secondary/40 p-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block">Email Invoice Sent</span>
                  <span className="text-[11px] text-muted-foreground">
                    A digital tax invoice has been dispatched to <strong>{order.email || "your email"}</strong>.
                  </span>
                </div>
              </div>
              <button
                onClick={handleSendEmailInvoice}
                disabled={emailSending}
                className="rounded-full border border-border bg-white px-3.5 py-1.5 text-[11px] font-semibold text-primary hover:bg-muted transition-colors shrink-0 shadow-2xs disabled:opacity-50"
              >
                {emailSending ? "Sending..." : "Resend Invoice"}
              </button>
            </div>

            {emailNotice && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 animate-fade-in">
                {emailNotice}
              </div>
            )}

            {/* Delivery Timeline Card */}
            <div className="rounded-2xl border border-accent/40 bg-accent/10 p-5 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Truck className="h-4 w-4" />
                <span>Estimated Delivery: 4 to 6 Working Days</span>
              </div>
              <p className="text-muted-foreground font-light">
                Your garments are currently undergoing custom studio fitting, steam pressing, and premium satin-cover packaging.
              </p>
            </div>

            {/* Itemized Order Receipt */}
            <div className="rounded-2xl border border-border bg-secondary/50 p-6 space-y-3.5 text-left text-xs">
              <div className="flex items-center justify-between">
                <p className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px]">
                  Purchased Silhouettes
                </p>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                >
                  <FileText className="h-3.5 w-3.5 text-gold-500" />
                  <span>View Official Invoice →</span>
                </button>
              </div>

              <div className="divide-y divide-border/60">
                {order.items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                    <div>
                      <span className="font-medium text-foreground">{it.name}</span>
                      <span className="block text-[11px] text-muted-foreground font-light">
                        Size {it.size} · Qty {it.qty}
                      </span>
                    </div>
                    <span className="font-semibold text-primary">{inr(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
                <span className="font-semibold text-foreground uppercase tracking-wider text-xs">
                  Total Paid ({order.payment})
                </span>
                <span className="font-display text-2xl font-bold text-primary">
                  {inr(order.amount)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lift hover:opacity-95 transition-all"
              >
                <FileText className="h-4 w-4 text-gold-300" />
                <span>View Tax Invoice</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-blush transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>Print Invoice</span>
              </button>

              <button
                onClick={handleSendEmailInvoice}
                disabled={emailSending}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-blush transition-colors"
              >
                {emailSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                <span>Email Invoice</span>
              </button>

              <a
                href={`https://wa.me/919699620950?text=Hi%20Gadhinglaj%20Models%20Club,%20I%20have%20placed%20order%20${order.id}.%20Can%20you%20confirm%20dispatch%20status?`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-lift hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="pt-2">
              <Link
                href="/shop"
                className="text-xs text-muted-foreground hover:text-primary underline"
              >
                Continue Exploring Collection
              </Link>
            </div>
          </div>

          {/* Dedicated Printable Invoice Container (Visible only on print) */}
          <div className="hidden print:block">
            <InvoiceDocument order={order} isModal={false} />
          </div>

          {/* Interactive Invoice Modal */}
          {showInvoiceModal && (
            <InvoiceDocument
              order={order}
              isModal={true}
              onClose={() => setShowInvoiceModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <SiteLayout>
      <Suspense fallback={<div className="container-lux py-24 text-center">Loading confirmation...</div>}>
        <OrderConfirmationContent />
      </Suspense>
    </SiteLayout>
  );
}

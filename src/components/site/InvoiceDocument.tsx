"use client";

import React, { useRef } from "react";
import { inr, type Order } from "@/data/catalog";
import {
  Printer,
  Download,
  X,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Building2,
} from "lucide-react";

/**
 * Convert number to Indian English currency words
 */
function numberToWords(num: number): string {
  if (!num || isNaN(num) || num <= 0) return "Zero Rupees Only";

  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const inWords = (n: number): string => {
    let str = "";
    if (n >= 10000000) {
      str += inWords(Math.floor(n / 10000000)) + " Crore ";
      n %= 10000000;
    }
    if (n >= 100000) {
      str += inWords(Math.floor(n / 100000)) + " Lakh ";
      n %= 100000;
    }
    if (n >= 1000) {
      str += inWords(Math.floor(n / 1000)) + " Thousand ";
      n %= 1000;
    }
    if (n >= 100) {
      str += inWords(Math.floor(n / 100)) + " Hundred ";
      n %= 100;
    }
    if (n > 0) {
      if (str !== "") str += "and ";
      if (n < 20) str += a[n];
      else {
        str += b[Math.floor(n / 10)];
        if (n % 10 > 0) str += " " + a[n % 10];
      }
    }
    return str.trim();
  };

  const words = inWords(Math.floor(num));
  return `${words} Rupees Only`;
}

interface InvoiceDocumentProps {
  order: Order;
  onClose?: () => void;
  isModal?: boolean;
}

export default function InvoiceDocument({
  order,
  onClose,
  isModal = false,
}: InvoiceDocumentProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const formattedAddress = [
    order.shippingAddress?.street,
    order.shippingAddress?.city,
    order.shippingAddress?.state,
    order.shippingAddress?.pincode,
  ]
    .filter(Boolean)
    .join(", ") || "In-Studio Collection / Boutique Handover";

  const invoiceNo = `GMC-INV-${order.id.replace(/\D/g, "") || order.id}`;
  const invoiceDate = order.date || new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const invoiceContent = (
    <div
      ref={invoiceRef}
      id="printable-invoice"
      className="invoice-sheet mx-auto w-full max-w-4xl bg-white text-zinc-900 shadow-2xl print:shadow-none print:m-0 print:p-0 print:w-full print:max-w-none rounded-2xl overflow-hidden border border-amber-900/15"
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      {/* 1. Atelier Top Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#3B0A11] via-[#5C1A24] to-[#2B080D] p-6 sm:p-8 text-white border-b-4 border-[#D4AF37]">
        {/* Subtle decorative gold circle blur */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#D4AF37]/20 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-white/10 px-3.5 py-1 backdrop-blur-md mb-2">
              <Sparkles className="h-3 w-3 text-[#f5d77f]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#f5d77f]">
                Official Boutique Tax Invoice &amp; Cash Memo
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide text-white">
              GADHINGLAJ MODELS CLUB
            </h1>
            <p className="mt-1 text-xs text-amber-200/90 font-light tracking-widest uppercase">
              Haute Couture Atelier &amp; Luxury Dress Rental Studio · by Priyanka Desai
            </p>
          </div>

          <div className="text-left md:text-right text-[11px] text-zinc-200/90 space-y-1 font-light border-t md:border-t-0 border-white/20 pt-3 md:pt-0">
            <p className="font-medium text-white flex items-center md:justify-end gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />
              <span>Tilak Path, Near Shivaji Bank, Main Road,</span>
            </p>
            <p>Gadhinglaj, Kolhapur, Maharashtra — 416502</p>
            <p className="flex items-center md:justify-end gap-1.5">
              <Phone className="h-3 w-3 text-[#D4AF37]" />
              <span>+91 96996 20950</span>
              <span className="text-white/40">·</span>
              <Mail className="h-3 w-3 text-[#D4AF37]" />
              <span>gandhiglaj@gmail.com</span>
            </p>
            <p className="text-[10px] text-amber-300 font-mono">
              State: Maharashtra (Code: 27) · Retail Bill of Supply
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* 2. Metadata Bar: Invoice No, Date, Payment Status */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-zinc-200 bg-[#FAFAF8] p-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">
              Invoice Reference
            </span>
            <span className="font-mono font-bold text-zinc-900 text-sm">{invoiceNo}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">
              Issue Date
            </span>
            <span className="font-medium text-zinc-900 flex items-center gap-1 mt-0.5">
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
              <span>{invoiceDate}</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">
              Payment Method
            </span>
            <span className="font-medium text-zinc-900 flex items-center gap-1 mt-0.5">
              <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
              <span>{order.payment || "Online Payment"}</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">
              Payment Status
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-bold mt-0.5">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span>PAID &amp; CONFIRMED</span>
            </span>
          </div>
        </div>

        {order.razorpayPaymentId && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/70 px-4 py-2 text-xs text-emerald-900">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Verified Razorpay Transaction ID:</span>
              <strong className="font-mono text-emerald-950 font-bold">{order.razorpayPaymentId}</strong>
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold hidden sm:inline">100% Secure Payment</span>
          </div>
        )}

        {/* 3. Billed To & Delivered To Address Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
          <div className="rounded-xl border border-zinc-200/90 bg-[#FBF9F6] p-4.5 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#5C1A24] font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-zinc-200">
              <Building2 className="h-3.5 w-3.5" />
              <span>Billed To &amp; Client Details</span>
            </div>
            <p className="font-bold text-sm text-zinc-900 pt-1">{order.customer}</p>
            <p className="text-zinc-600 flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-zinc-400" />
              <span>{order.phone}</span>
            </p>
            {order.email && (
              <p className="text-zinc-600 flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-zinc-400" />
                <span>{order.email}</span>
              </p>
            )}
            <p className="text-zinc-700 font-medium leading-relaxed pt-1">
              <span className="text-zinc-400 font-normal">Delivery Destination: </span>
              {formattedAddress}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200/90 bg-[#FBF9F6] p-4.5 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#5C1A24] font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-zinc-200">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Studio Dispatch &amp; Fitting Terms</span>
            </div>
            <p className="font-bold text-sm text-zinc-900 pt-1">Gadhinglaj Models Club Atelier</p>
            <p className="text-zinc-600 leading-relaxed">
              Dispatched with sanitization seal, complimentary in-studio fitting adjustments, and protective garment packaging.
            </p>
            <div className="pt-2 text-[11px] text-zinc-500 flex flex-wrap gap-2">
              <span className="rounded bg-white px-2 py-0.5 border border-zinc-200 font-medium">
                Standard Alterations: Free
              </span>
              <span className="rounded bg-white px-2 py-0.5 border border-zinc-200 font-medium">
                Steam Sanitized
              </span>
            </div>
          </div>
        </div>

        {/* 4. Itemized Silhouettes Table */}
        <div className="rounded-xl border border-zinc-200 overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#5C1A24] text-white text-[11px] uppercase tracking-wider">
                <th className="p-3 w-12 text-center font-bold">#</th>
                <th className="p-3 font-bold">Silhouette / Item Description</th>
                <th className="p-3 w-20 text-center font-bold">Size</th>
                <th className="p-3 w-20 text-center font-bold">HSN</th>
                <th className="p-3 w-24 text-right font-bold">Rate</th>
                <th className="p-3 w-14 text-center font-bold">Qty</th>
                <th className="p-3 w-28 text-right font-bold">Net Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {order.items.map((item, idx) => {
                const itemTotal = item.price * item.qty;
                return (
                  <tr key={idx} className="hover:bg-amber-50/20 transition-colors">
                    <td className="p-3 text-center text-zinc-400 font-medium">{idx + 1}</td>
                    <td className="p-3">
                      <span className="font-serif font-bold text-zinc-900 text-sm block">
                        {item.name}
                      </span>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
                        {item.color && (
                          <span>
                            Shade: <strong>{item.color}</strong>
                          </span>
                        )}
                        <span>· Atelier Designer Edition</span>
                      </div>
                    </td>
                    <td className="p-3 text-center font-semibold text-zinc-800">
                      <span className="rounded bg-zinc-100 px-2 py-0.5 border border-zinc-200">
                        {item.size || "Free Size"}
                      </span>
                    </td>
                    <td className="p-3 text-center text-zinc-500 font-mono text-[11px]">
                      6204
                    </td>
                    <td className="p-3 text-right font-medium text-zinc-700">
                      {inr(item.price)}
                    </td>
                    <td className="p-3 text-center font-bold text-zinc-900">
                      {item.qty}
                    </td>
                    <td className="p-3 text-right font-bold text-[#5C1A24] text-sm">
                      {inr(itemTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 5. Calculations Summary & Amount in Words */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          {/* Amount in words & Bank / Payment Note */}
          <div className="md:col-span-7 rounded-xl border border-zinc-200/80 bg-[#FAFAF8] p-4 text-xs space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">
                Total Amount In Words
              </span>
              <p className="font-serif text-sm font-semibold text-[#5C1A24] italic mt-0.5">
                {numberToWords(order.amount)}
              </p>
            </div>

            <div className="border-t border-zinc-200 pt-2 text-[11px] text-zinc-600 space-y-1 leading-relaxed">
              <p className="font-semibold text-zinc-800">Payment &amp; Delivery Terms:</p>
              <ul className="list-disc list-inside space-y-0.5 text-zinc-500 font-light">
                <li>Payment confirmed in full via {order.payment || "Razorpay"}.</li>
                <li>Fitted according to measurements prior to studio dispatch.</li>
                <li>For rental orders: Standard 3-day window applies; refundable security deposit credited back upon intact handover.</li>
              </ul>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="md:col-span-5 rounded-xl border-2 border-amber-900/20 bg-white p-4 text-xs space-y-2">
            <div className="flex justify-between items-center text-zinc-600">
              <span>Items Gross Value:</span>
              <span className="font-semibold text-zinc-800">
                {inr(order.subtotal || order.amount)}
              </span>
            </div>

            {order.discount !== undefined && order.discount > 0 && (
              <div className="flex justify-between items-center text-rose-700">
                <span>Promotional Privilege / Discount:</span>
                <span className="font-semibold">- {inr(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-zinc-600">
              <span>Studio Alteration &amp; Fitting:</span>
              <span className="font-semibold text-emerald-700">Complimentary</span>
            </div>

            <div className="flex justify-between items-center text-zinc-600">
              <span>Insured Boutique Delivery:</span>
              <span className="font-semibold text-emerald-700">
                {order.delivery && order.delivery > 0 ? inr(order.delivery) : "Complimentary"}
              </span>
            </div>

            <div className="flex justify-between items-center text-zinc-600">
              <span>Applicable Taxes &amp; GST:</span>
              <span className="font-semibold text-zinc-700">
                {order.tax && order.tax > 0 ? inr(order.tax) : "Included in Price"}
              </span>
            </div>

            <div className="border-t-2 border-[#5C1A24] pt-2 mt-2 flex justify-between items-baseline">
              <span className="font-serif font-bold text-sm text-zinc-900 uppercase">
                Grand Total (INR):
              </span>
              <span className="font-serif text-2xl font-bold text-[#5C1A24]">
                {inr(order.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* 6. Authorized Signatory & Studio Seal */}
        <div className="border-t border-zinc-200/90 pt-6 mt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-[11px] text-zinc-500 space-y-0.5 text-center sm:text-left">
            <p className="font-bold text-zinc-700 uppercase tracking-wider">
              Gadhinglaj Models Club Atelier
            </p>
            <p>Tilak Path, Main Road, Gadhinglaj, Kolhapur 416502</p>
            <p className="text-[10px] text-zinc-400">
              Computer-generated official tax invoice. Certified true copy.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Digital Gold Studio Seal Stamp */}
            <div className="flex h-18 w-18 items-center justify-center rounded-full border-2 border-dashed border-[#D4AF37] p-1 text-center bg-amber-50/50 shadow-inner">
              <div className="h-full w-full rounded-full border border-[#D4AF37] flex flex-col items-center justify-center text-[7.5px] uppercase font-bold tracking-tight text-[#8B2635] p-1 leading-tight">
                <span>★ GMC ★</span>
                <span className="text-[6.5px] text-[#B8860B]">VERIFIED</span>
                <span>ATELIER</span>
              </div>
            </div>

            {/* Signature Block */}
            <div className="text-center sm:text-right">
              <div className="font-serif italic text-base font-bold text-[#5C1A24] tracking-wider font-signature">
                Priyanka Desai
              </div>
              <div className="h-0.5 w-32 bg-[#D4AF37] mx-auto sm:ml-auto mt-0.5 mb-1" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-700">
                Priyanka Desai
              </p>
              <p className="text-[9.5px] text-zinc-500 font-light">
                Founder &amp; Head Designer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isModal) {
    return invoiceContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto animate-fade-in print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="relative w-full max-w-4xl my-auto">
        {/* Floating Controls Bar (Hidden during print) */}
        <div className="mb-3 flex items-center justify-between rounded-full bg-stone-900/90 backdrop-blur-md px-5 py-2.5 text-white shadow-lift print:hidden">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-serif text-sm font-medium">Official Tax Invoice · {invoiceNo}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-950 shadow-gold hover:bg-gold-light transition-all active:scale-95"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/25 hover:text-white transition-colors"
                title="Close Invoice"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Invoice Body */}
        {invoiceContent}
      </div>
    </div>
  );
}

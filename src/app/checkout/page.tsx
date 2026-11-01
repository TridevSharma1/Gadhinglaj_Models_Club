"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SiteLayout, { EmptyState, PageHero } from "@/components/site/SiteLayout";
import { inr, type Order } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { useCartTotals } from "@/hooks/use-cart-totals";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";

const field =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs";

export default function CheckoutPage() {
  const router = useRouter();
  const { currentUser, placeOrder, updateUserProfile } = useStore();
  const { lines, subtotal, discount, delivery, tax, total } = useCartTotals();

  // Address & contact state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "Gadhinglaj",
    state: "Maharashtra",
    pincode: "416502",
  });
  const [saveToProfile, setSaveToProfile] = useState(true);

  // Checkout & payment status
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [errorNotice, setErrorNotice] = useState("");

  // Populate from currentUser if available
  useEffect(() => {
    if (currentUser) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || currentUser.name || "",
        email: prev.email || currentUser.email || "",
        phone: prev.phone || currentUser.phone || "",
        address: prev.address || currentUser.address?.street || "",
        city: prev.city || currentUser.address?.city || "Gadhinglaj",
        state: prev.state || currentUser.address?.state || "Maharashtra",
        pincode: prev.pincode || currentUser.address?.pincode || "416502",
      }));
    }
  }, [currentUser]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // Helper to load Razorpay checkout script
  const loadRazorpaySDK = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Submit Order & Trigger Razorpay
  const handlePlaceOrderWithRazorpay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice("");

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.address.trim()) {
      setErrorNotice("Please complete all shipping address fields.");
      return;
    }

    setIsProcessing(true);
    setProcessingStatus("Initializing 256-bit secure payment session...");

    try {
      // 1. Sync updated profile address if checked and user is logged in
      if (currentUser && saveToProfile) {
        try {
          await updateUserProfile({
            name: form.name.trim(),
            phone: form.phone.trim(),
            address: {
              street: form.address.trim(),
              city: form.city.trim(),
              state: form.state.trim(),
              pincode: form.pincode.trim(),
            },
          });
        } catch (profileErr) {
          console.warn("Could not sync profile address:", profileErr);
        }
      }

      // 2. Load Razorpay SDK
      const sdkLoaded = await loadRazorpaySDK();
      if (!sdkLoaded) {
        throw new Error("Unable to connect to Razorpay payment servers. Please check your internet connection.");
      }

      // 3. Generate client Order ID
      const orderId = `GMC-${Math.floor(1000 + Math.random() * 9000)}`;

      // 4. Create Razorpay order on server
      setProcessingStatus("Contacting Razorpay Gateway...");
      const createOrderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          receipt: `rcpt_${orderId}`,
          notes: {
            orderId,
            customerName: form.name,
            customerEmail: form.email,
            customerPhone: form.phone,
          },
        }),
      });

      const rzpOrderData = await createOrderRes.json();
      if (!createOrderRes.ok || !rzpOrderData.success) {
        throw new Error(rzpOrderData.error || "Failed to initialize payment gateway order.");
      }

      // 5. Open Razorpay Checkout modal
      setProcessingStatus("Opening Razorpay payment window...");

      const options = {
        key: rzpOrderData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: rzpOrderData.amount,
        currency: rzpOrderData.currency || "INR",
        name: "Gadhinglaj Models Club",
        description: `Boutique Order ${orderId} (${lines.length} items)`,
        image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=200&auto=format&fit=crop",
        order_id: rzpOrderData.orderId,
        prefill: {
          name: form.name.trim(),
          email: form.email.trim(),
          contact: form.phone.trim(),
        },
        theme: {
          color: "#722F37", // Atelier Regal Wine
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setProcessingStatus("");
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            setProcessingStatus("Verifying payment authenticity...");

            const orderPayload: Order = {
              id: orderId,
              userId: currentUser?.id || "",
              customer: form.name.trim(),
              phone: form.phone.trim(),
              email: form.email.trim(),
              date: new Date().toISOString().slice(0, 10),
              items: lines.map((l) => ({
                productId: l.productId,
                name: l.color ? `${l.product.name} [${l.color}]` : l.product.name,
                qty: l.qty,
                size: l.size,
                color: l.color,
                price: l.product.price,
                image: l.color
                  ? l.product.colors?.find((c) => c.name === l.color)?.image || l.product.image
                  : l.product.image,
              })),
              amount: total,
              subtotal,
              discount,
              delivery,
              tax,
              payment: "Razorpay (Online Payment)",
              paymentStatus: "Paid",
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              status: "Confirmed",
              shippingAddress: {
                street: form.address.trim(),
                city: form.city.trim(),
                state: form.state.trim(),
                pincode: form.pincode.trim(),
              },
            };

            // Verify signature on backend & save to MongoDB
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: orderPayload,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment signature verification failed.");
            }

            // Save in store & clear cart
            await placeOrder(verifyData.order || orderPayload);

            // Redirect to confirmation
            router.push(`/order-confirmation?id=${orderId}&payment_id=${response.razorpay_payment_id}`);
          } catch (verifyErr: any) {
            console.error("Verification error:", verifyErr);
            setErrorNotice(verifyErr.message || "Payment verification failed. Please contact boutique support.");
            setIsProcessing(false);
          }
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on("payment.failed", (failedRes: any) => {
        console.error("Razorpay payment failed:", failedRes);
        setErrorNotice(
          failedRes.error?.description || "Payment failed or was cancelled by user. Please try again."
        );
        setIsProcessing(false);
      });

      rzpInstance.open();
    } catch (err: any) {
      console.error("Checkout process error:", err);
      setErrorNotice(err.message || "An error occurred while launching payment. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!lines.length) {
    return (
      <SiteLayout>
        <PageHero eyebrow="Almost Ready" title="Checkout" />
        <div className="container-lux py-16">
          <EmptyState
            title="Nothing in Your Checkout Bag"
            text="Your shopping cart is currently empty. Explore our ready-made and rental collections."
            action={
              <Link
                href="/shop"
                className="rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift"
              >
                Browse Collection
              </Link>
            }
          />
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Final Step"
        title="Secure Checkout"
        subtitle="Complete your shipping address and pay securely with Razorpay. UPI, Cards, NetBanking, and Wallets accepted with instant verification."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      />

      <div className="container-lux py-16">
        {/* Error notification */}
        {errorNotice && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 shadow-sm animate-fade-in">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <span className="flex-1">{errorNotice}</span>
            <button
              onClick={() => setErrorNotice("")}
              className="text-rose-500 hover:text-rose-800 font-bold px-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Patron Account info banner if logged in */}
        {currentUser && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5 text-emerald-900 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Signed in as Patron
                </p>
                <p className="text-sm font-semibold text-emerald-950">
                  {currentUser.name || "Couture Member"} · <span className="font-normal opacity-90">{currentUser.email}</span>
                </p>
              </div>
            </div>
            <Link
              href="/account"
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
            >
              Manage Saved Profile →
            </Link>
          </div>
        )}

        <form onSubmit={handlePlaceOrderWithRazorpay}>
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Left Form: Address & Razorpay Method */}
            <div className="lg:col-span-7 space-y-8">
              {/* Delivery Address */}
              <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-8 shadow-soft space-y-6">
                <div>
                  <span className="eyebrow">Destination</span>
                  <h2 className="mt-1 font-display text-2xl text-primary font-medium">Shipping Address</h2>
                  <div className="gold-rule mt-2" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Recipient Full Name
                      </span>
                      <input
                        required
                        value={form.name}
                        onChange={set("name")}
                        placeholder="e.g. Radhika Sharma"
                        className={field}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Mobile Number
                      </span>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={set("phone")}
                        placeholder="+91 98765 43210"
                        className={field}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address
                      </span>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="radhika@example.com"
                        className={field}
                      />
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Street Address &amp; House / Flat No.
                      </span>
                      <input
                        required
                        value={form.address}
                        onChange={set("address")}
                        placeholder="Flat 402, Royal Residency, Tilak Path"
                        className={field}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        City / Town
                      </span>
                      <input
                        required
                        value={form.city}
                        onChange={set("city")}
                        className={field}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Pincode
                      </span>
                      <input
                        required
                        value={form.pincode}
                        onChange={set("pincode")}
                        className={field}
                      />
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        State
                      </span>
                      <input
                        required
                        value={form.state}
                        onChange={set("state")}
                        className={field}
                      />
                    </label>
                  </div>
                </div>

                {currentUser && (
                  <label className="flex items-center gap-2.5 pt-2 text-xs text-muted-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={saveToProfile}
                      onChange={(e) => setSaveToProfile(e.target.checked)}
                      className="rounded border-border accent-primary h-4 w-4"
                    />
                    <span>Save this delivery address to my patron profile for future orders</span>
                  </label>
                )}
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-5">
              <aside className="sticky top-28 space-y-6 rounded-3xl border border-border/80 bg-card p-5 sm:p-8 shadow-lift">
                <div>
                  <span className="eyebrow">Order Items</span>
                  <h3 className="mt-1 font-display text-2xl text-primary font-medium">Summary &amp; Total</h3>
                  <div className="gold-rule mt-2" />
                </div>

                <ul className="space-y-3 divide-y divide-border/60 max-h-72 overflow-y-auto pr-1">
                  {lines.map((l) => {
                    const colorVariant = l.product.colors?.find((c) => c.name === l.color);
                    const itemImg = colorVariant?.image || l.product.image;
                    return (
                      <li key={`${l.productId}-${l.size}-${l.color || "def"}`} className="flex gap-3 pt-3 first:pt-0">
                        <img
                          src={itemImg}
                          alt={l.product.name}
                          className="h-16 w-14 rounded-xl object-cover border border-border/60"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{l.product.name}</p>
                          <p className="text-xs text-muted-foreground font-light">
                            Size {l.size} {l.color && `· ${l.color}`} × {l.qty}
                          </p>
                          <p className="text-xs text-primary font-semibold mt-1">
                            {inr(l.product.price * l.qty)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <dl className="space-y-3 text-xs border-t border-border/60 pt-4">
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground font-light">Subtotal</dt>
                    <dd className="font-medium text-foreground">{inr(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground font-light">Promotional Discount</dt>
                    <dd className="font-semibold text-rose">− {inr(discount)}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground font-light">Shipping</dt>
                    <dd className="font-semibold text-foreground">
                      {delivery > 0 ? inr(delivery) : "Complimentary"}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground font-light">Taxes (GST)</dt>
                    <dd className="font-medium text-foreground">{inr(tax)}</dd>
                  </div>
                  <div className="flex justify-between items-center border-t border-border pt-4 text-sm">
                    <dt className="font-semibold text-foreground uppercase tracking-wider text-xs">
                      Grand Total
                    </dt>
                    <dd className="font-display text-2xl font-bold text-primary">
                      {inr(total)}
                    </dd>
                  </div>
                </dl>

                {/* Place Order CTA Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift hover:opacity-95 transition-all disabled:opacity-60"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{processingStatus || "Processing..."}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      <span>Pay &amp; Place Order with Razorpay ({inr(total)})</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-center text-[11px] text-muted-foreground font-light">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <span>Encrypted 256-Bit Razorpay Checkout · 100% Guaranteed</span>
                </div>
              </aside>
            </div>
          </div>
        </form>
      </div>
    </SiteLayout>
  );
}

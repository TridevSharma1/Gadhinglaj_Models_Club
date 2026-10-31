"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import SiteLayout from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { SparkleIcon } from "@/components/site/Icons";
import {
  User,
  ShoppingBag,
  Heart,
  Calendar,
  LogOut,
  Shield,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Save,
  Ruler,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { currentUser, logoutCustomer, updateUserProfile, cart, wishlist, hydrated } = useStore();

  const [activeTab, setActiveTab] = useState<"profile" | "wardrobe" | "rentals">("profile");

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Gadhinglaj");
  const [state, setState] = useState("Maharashtra");
  const [pincode, setPincode] = useState("");
  const [preferredSize, setPreferredSize] = useState("M");

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Sync form state when currentUser loads
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setPhone(currentUser.phone || "");
      setStreet(currentUser.address?.street || "");
      setCity(currentUser.address?.city || "Gadhinglaj");
      setState(currentUser.address?.state || "Maharashtra");
      setPincode(currentUser.address?.pincode || "");
      setPreferredSize(currentUser.preferredSize || "M");
    }
  }, [currentUser]);

  useEffect(() => {
    if (hydrated && !currentUser) {
      router.replace("/login");
    }
  }, [hydrated, currentUser, router]);

  // Profile completion calculation
  const completionPercentage = useMemo(() => {
    let score = 0;
    if (name.trim()) score += 25;
    if (phone.trim()) score += 25;
    if (street.trim() && pincode.trim()) score += 25;
    if (preferredSize) score += 25;
    return score;
  }, [name, phone, street, pincode, preferredSize]);

  if (!currentUser) {
    return (
      <SiteLayout>
        <div className="container-lux py-24 text-center">
          <p className="text-sm text-muted-foreground">Redirecting to login…</p>
        </div>
      </SiteLayout>
    );
  }

  const handleLogout = () => {
    logoutCustomer();
    router.push("/");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError("");

    try {
      const res = await updateUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        address: {
          street: street.trim(),
          city: city.trim() || "Gadhinglaj",
          state: state.trim() || "Maharashtra",
          pincode: pincode.trim(),
        },
        preferredSize,
      });

      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setSaveError(res.error || "Failed to update profile.");
      }
    } catch (err: any) {
      setSaveError(err.message || "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const initial = (name || currentUser.name || currentUser.email || "U").charAt(0).toUpperCase();

  return (
    <SiteLayout>
      <div className="container-lux py-12 sm:py-16">
        
        {/* 1. Profile Header Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-gold-300/40 bg-gradient-to-r from-card via-blush/30 to-card p-6 sm:p-10 shadow-soft">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-gold-300 font-serif text-3xl font-bold shadow-lift ring-2 ring-gold-300/60">
                {initial}
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-medium text-primary">
                    {name || currentUser.name || "Valued Patron"}
                  </h1>
                  <span className="rounded-full bg-gold-400/20 text-gold-800 border border-gold-300 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {currentUser.role === "admin" ? "Atelier Administrator" : "Couture Club Member"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-gold-500" />
                  <span>{currentUser.email}</span>
                </p>
                {phone && (
                  <p className="mt-0.5 text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-gold-500" />
                    <span>{phone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {currentUser.role === "admin" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-gold-300 border border-gold-300/40 px-3.5 py-2 text-xs font-semibold shadow-sm hover:opacity-95"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Admin Suite</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors shadow-2xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* 2. Profile Completion Progress Bar */}
          <div className="mt-8 pt-6 border-t border-border/60">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-gold-500" />
                Profile Completion Status
              </span>
              <span className="font-bold text-primary font-mono">{completionPercentage}%</span>
            </div>
            
            {/* Progress bar background */}
            <div className="h-2 w-full rounded-full bg-muted/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-400 via-amber-500 to-primary transition-all duration-700"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
              {completionPercentage === 100 ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Profile complete! Eligible for expedited boutique fitting &amp; instant dispatch.
                </span>
              ) : (
                <span>
                  Complete your name, mobile number, and delivery address below to unlock 1-click checkout and bespoke trial bookings.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Account Navigation Tabs */}
        <div className="mt-8 flex gap-3 border-b border-border/80 pb-3">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "profile"
                ? "bg-primary text-primary-foreground shadow-lift"
                : "bg-white border border-border text-muted-foreground hover:text-primary"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Complete My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("wardrobe")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "wardrobe"
                ? "bg-primary text-primary-foreground shadow-lift"
                : "bg-white border border-border text-muted-foreground hover:text-primary"
            }`}
          >
            <Heart className="h-3.5 w-3.5" />
            <span>My Wardrobe &amp; Bag</span>
          </button>

          <button
            onClick={() => setActiveTab("rentals")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "rentals"
                ? "bg-primary text-primary-foreground shadow-lift"
                : "bg-white border border-border text-muted-foreground hover:text-primary"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Rental Studio Fittings</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: COMPLETE MY PROFILE (Name, Mobile No, Email, Address, Preferred Size)
            ========================================================================= */}
        {activeTab === "profile" && (
          <div className="mt-8 max-w-4xl">
            <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-10 shadow-soft">
              
              <div className="border-b border-border/60 pb-4 mb-6">
                <h2 className="font-serif text-xl sm:text-2xl font-medium text-primary">
                  Personal &amp; Delivery Information
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Update your contact and address details to receive orders and boutique fittings seamlessly.
                </p>
              </div>

              {saveSuccess && (
                <div className="mb-6 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 flex items-center gap-2.5 animate-fade-in shadow-2xs">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>Your profile details and address have been saved successfully to the database!</span>
                </div>
              )}

              {saveError && (
                <div className="mb-6 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs font-medium text-rose-800 flex items-center gap-2.5 animate-fade-in shadow-2xs">
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                
                {/* Section A: Personal Details */}
                <div>
                  <h3 className="font-serif text-base font-medium text-foreground mb-4 flex items-center gap-2">
                    <User className="h-4 w-4 text-gold-600" />
                    <span>Personal Details</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priyanka Desai"
                        className="w-full rounded-xl border border-border/80 bg-background/50 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      />
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 96996 20950"
                          className="w-full rounded-xl border border-border/80 bg-background/50 pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        />
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        Used for dispatch updates &amp; fitting appointment confirmations.
                      </span>
                    </div>

                    {/* Email (Read-Only) */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Email Address (Account ID)
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          disabled
                          value={currentUser.email}
                          className="w-full rounded-xl border border-border/60 bg-muted/40 pl-10 pr-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed outline-none"
                        />
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified Account
                      </span>
                    </div>

                    {/* Preferred Fitting Size */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Preferred Garment Size
                      </label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {["XS", "S", "M", "L", "XL", "XXL", "Free Size"].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setPreferredSize(sz)}
                            className={`px-3 py-1.5 text-xs rounded-xl border font-medium transition-all ${
                              preferredSize === sz
                                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/70"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section B: Delivery & Fitting Address */}
                <div className="pt-4 border-t border-border/60">
                  <h3 className="font-serif text-base font-medium text-foreground mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gold-600" />
                    <span>Delivery &amp; Fitting Address</span>
                  </h3>

                  <div className="space-y-4">
                    {/* Street Address */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        Street Address / Landmark / House No. *
                      </label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="e.g. Shop No 1, Near Shivaji Bank, Main Road, Tilak Path"
                        className="w-full rounded-xl border border-border/80 bg-background/50 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      />
                    </div>

                    {/* City, State, Pincode */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Gadhinglaj"
                          className="w-full rounded-xl border border-border/80 bg-background/50 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          State
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="Maharashtra"
                          className="w-full rounded-xl border border-border/80 bg-background/50 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Postal Pincode *
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder="416502"
                          className="w-full rounded-xl border border-border/80 bg-background/50 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5 hover:opacity-95 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? "Saving Profile..." : "Save Profile Details"}</span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: MY WARDROBE & BAG
            ========================================================================= */}
        {activeTab === "wardrobe" && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            
            <div className="rounded-3xl border border-border/80 bg-white p-7 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground">Wishlist Vault</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  You have <span className="font-semibold text-primary">{wishlist.length}</span> pieces saved in your personal wishlist.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/wishlist"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-95"
                >
                  <span>Open Wishlist</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-border/80 bg-white p-7 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 mb-4">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground">Shopping Bag</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  You have <span className="font-semibold text-primary">{cart.reduce((s, i) => s + i.qty, 0)}</span> items ready in your shopping bag.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-95"
                >
                  <span>View Bag &amp; Checkout</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: RENTAL STUDIO FITTINGS
            ========================================================================= */}
        {activeTab === "rentals" && (
          <div className="mt-8 max-w-2xl">
            <div className="rounded-3xl border border-border/80 bg-white p-7 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground">
                In-Studio 3-Day Rental Fitting
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Experience high-end couture gowns, photoshoot trails and bridal drapes with custom alteration fitting at our Tilak Path boutique.
              </p>
              
              <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-4 text-xs space-y-2">
                <p className="font-semibold text-primary">Boutique &amp; Studio Address:</p>
                <p className="text-muted-foreground">
                  Shop No 1, Near Shivaji Bank, Main Road, Tilak Path, Gadhinglaj, Maharashtra 416502
                </p>
                <p className="text-muted-foreground font-medium">Concierge Hotline: +91 96996 20950</p>
              </div>

              <div className="mt-6">
                <Link
                  href="/rental-booking"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lift hover:opacity-95"
                >
                  <SparkleIcon className="h-4 w-4 text-gold-300" />
                  <span>Schedule Rental Appointment</span>
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </SiteLayout>
  );
}

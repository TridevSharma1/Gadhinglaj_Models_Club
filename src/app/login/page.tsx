"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import SiteLayout from "@/components/site/SiteLayout";
import { useStore } from "@/lib/store";
import { SparkleIcon, LockIcon } from "@/components/site/Icons";
import { Mail, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const { loginCustomer, currentUser } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, prompt to view account
  if (currentUser) {
    return (
      <div className="container-lux py-24 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-border/80 bg-white p-8 shadow-soft">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
          <h2 className="mt-4 font-serif text-2xl text-primary font-medium">Welcome Back</h2>
          <p className="mt-2 text-xs text-muted-foreground">
            You are signed in as <span className="font-semibold text-foreground">{currentUser.email}</span>.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href={redirectUrl}
              className="rounded-full bg-primary py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lift hover:opacity-95"
            >
              {redirectUrl === "/checkout" ? "Proceed to Checkout" : "Go to My Account"}
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-border py-2.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const result = await loginCustomer(email.trim(), password);
      if (result.success) {
        router.push(redirectUrl);
      } else {
        setError(result.error || "Invalid email or password.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-16 px-4 bg-gradient-to-b from-secondary/30 via-background to-secondary/20">
      {/* Glow backdrop */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-3xl border border-border/80 bg-white p-7 sm:p-10 shadow-lift animate-fade-up">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-[#4A0E17] to-primary font-serif text-lg font-bold text-gold-300 shadow-md">
            GMC
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-600">
            <SparkleIcon className="h-3 w-3" />
            Gadhinglaj Models Club
          </p>
          <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-primary">
            Sign In to Your Account
          </h1>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Access your saved couture outfits, rental appointments &amp; orders.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-7 space-y-4">
          {/* 1. Email Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-border/80 bg-background/50 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* 2. Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-border/80 bg-background/50 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 animate-fade-in">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-xl bg-primary py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5 hover:opacity-95 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-6 border-t border-border/60 pt-4 text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link
              href={redirectUrl !== "/account" ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"}
              className="font-semibold text-primary hover:underline"
            >
              Register here
            </Link>
          </p>
          <p className="text-[11px] text-muted-foreground/80">
            Atelier staff member?{" "}
            <Link href="/admin/login" className="text-primary hover:underline">
              Admin Portal →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <SiteLayout>
      <Suspense fallback={<div className="container-lux py-24 text-center text-xs text-muted-foreground">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </SiteLayout>
  );
}

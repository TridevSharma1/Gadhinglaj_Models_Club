"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { SparkleIcon, LockIcon } from "@/components/site/Icons";

export default function AdminLoginPage() {
  const { login, admin, hydrated, content } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && admin) router.replace("/admin");
  }, [hydrated, admin, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const ok = await login(email, password);
      if (ok) {
        router.replace("/admin");
      } else {
        setError("Invalid credentials. Please check your admin email and password.");
      }
    } catch {
      setError("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("gandhiglaj@gmail.com");
    setPassword("Gandhiglaj@123");
    setError("");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1A0B10] via-[#240F18] to-[#120508] px-4 py-16 text-white">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-rose-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] p-8 backdrop-blur-xl shadow-2xl md:p-10">
        {/* Monogram Crest */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300 via-gold-400 to-amber-600 font-serif text-lg font-bold text-zinc-950 shadow-lg">
            GMC
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gold-300">
            <SparkleIcon className="h-3 w-3" />
            Haute Couture Management Suite
          </p>
          <h1 className="mt-1 font-display text-2xl font-light text-white md:text-3xl">
            Atelier Portal
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Sign in to manage {content.businessName} catalog &amp; bookings.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Admin Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gandhiglaj@gmail.com"
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-gold-300 focus:ring-1 focus:ring-gold-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Secret Passphrase
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-gold-300 focus:ring-1 focus:ring-gold-300"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-center text-xs text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 py-3 text-xs font-semibold uppercase tracking-widest text-zinc-950 shadow-lg transition-transform hover:-translate-y-0.5 hover:opacity-95 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Authorize Atelier Access"}
          </button>
        </form>

        <div className="mt-6 border-t border-white/10 pt-4 text-center">
          <button
            type="button"
            onClick={fillDemo}
            className="text-xs text-gold-300/80 hover:text-gold-300 underline"
          >
            Auto-Fill Admin Credentials
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-[11px] text-zinc-400 hover:text-white transition-colors"
          >
            ← Return to Gadhinglaj Models Club Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

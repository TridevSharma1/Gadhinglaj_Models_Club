"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { CloseIcon, MenuIcon, SparkleIcon } from "@/components/site/Icons";

interface NavItem {
  to: string;
  label: string;
  icon: string;
  badgeKey?: "orders" | "rentals" | "lowStock" | "inquiries";
}

const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: "✦" },
  { to: "/admin/categories", label: "Category & Sub Category", icon: "🏷️" },
  { to: "/admin/products", label: "Product", icon: "👗" },
  { to: "/admin/low-stock", label: "Low Stock", icon: "⚠️", badgeKey: "lowStock" },
  { to: "/admin/inventory", label: "Inventory", icon: "📦" },
  { to: "/admin/users", label: "Users", icon: "👑" },
  { to: "/admin/orders", label: "Order", icon: "🛍️", badgeKey: "orders" },
  { to: "/admin/rentals", label: "Rental Studio", icon: "✨", badgeKey: "rentals" },
  { to: "/admin/offers", label: "Voucher And Offer", icon: "🎁" },
  { to: "/admin/reviews", label: "Testimonials", icon: "⭐" },
  { to: "/admin/inquiries", label: "Inquiry", icon: "📩", badgeKey: "inquiries" },
  { to: "/admin/banners", label: "Hero Showcase", icon: "🖼️" },
  { to: "/admin/headers", label: "Header Image", icon: "🌄" },
  { to: "/admin/top-bar", label: "Top Header Ad", icon: "📢" },
  { to: "/admin/settings", label: "Website Setting", icon: "⚙️" },
];

export default function AdminShell({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  const { admin, hydrated, logout, content, orders, bookings, products, inquiries } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !admin) router.replace("/admin/login");
  }, [hydrated, admin, router]);

  if (!hydrated || !admin)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-gold-300">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-300 border-t-transparent" />
        <p className="mt-4 font-display text-sm tracking-widest uppercase">Verifying Atelier Access…</p>
      </div>
    );

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const pendingRentals = bookings.filter((b) => b.status === "Pending").length;
  const lowStockCount = products.filter((p) => p.stock <= 3).length;
  const newInquiriesCount = inquiries ? inquiries.filter((i) => i.status === "New").length : 0;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] lg:flex-row">
      {/* Mobile Topbar */}
      <div className="flex items-center justify-between border-b border-border bg-[#1A0B10] px-4 py-3.5 lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 font-serif text-xs font-bold text-zinc-950">
            GMC
          </div>
          <div>
            <span className="font-display text-sm font-semibold tracking-wide text-white">
              GMC Atelier
            </span>
            <span className="block text-[9px] uppercase tracking-widest text-gold-300">
              Admin Suite
            </span>
          </div>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-gold-300 hover:bg-white/10"
          aria-label="Toggle Navigation"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Luxury Sidebar */}
      <aside
        className={`${
          open ? "block" : "hidden"
        } fixed inset-y-0 left-0 z-50 w-72 shrink-0 border-r border-gold-500/15 bg-gradient-to-b from-[#18090E] via-[#1F0C13] to-[#120508] px-5 py-6 text-white shadow-2xl lg:static lg:block lg:shadow-none overflow-y-auto max-h-screen`}
      >
        {/* Brand Crest */}
        <div className="flex items-center gap-3.5 border-b border-white/10 pb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 via-gold-400 to-amber-600 font-serif text-sm font-bold text-zinc-950 shadow-md">
            GMC
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-base font-semibold tracking-wide text-white truncate">
              {content.businessName}
            </h2>
            <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest text-gold-300">
              <SparkleIcon className="h-2.5 w-2.5" />
              Haute Atelier Studio
            </p>
          </div>
        </div>

        {/* Director Profile Badge */}
        <div className="mt-3.5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-400/20 font-serif text-xs font-bold text-gold-300">
            PD
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-white">{content.owner}</p>
            <p className="text-[10px] text-zinc-400">Boutique Director · Active</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 space-y-1">
          {nav.map((n) => {
            const isActive = n.to === "/admin" ? pathname === "/admin" : pathname.startsWith(n.to);
            const badgeCount =
              n.badgeKey === "orders"
                ? pendingOrders
                : n.badgeKey === "rentals"
                ? pendingRentals
                : n.badgeKey === "lowStock"
                ? lowStockCount
                : n.badgeKey === "inquiries"
                ? newInquiriesCount
                : 0;

            const badgeBg =
              n.badgeKey === "lowStock"
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                : n.badgeKey === "inquiries"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-gold-400/20 text-gold-300 border-gold-400/30";

            return (
              <Link
                key={n.to}
                href={n.to}
                onClick={() => setOpen(false)}
                className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? "border-l-2 border-gold-300 bg-white/10 text-white shadow-sm font-semibold"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-sm opacity-80 group-hover:scale-110 transition-transform">
                    {n.icon}
                  </span>
                  <span className="truncate">{n.label}</span>
                </div>
                {badgeCount > 0 && (
                  <span
                    className={`rounded-full border px-1.5 py-0.2 text-[9.5px] font-bold ${badgeBg}`}
                  >
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="mt-6 border-t border-white/10 pt-4 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl px-3 py-2 text-xs text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <span>Live Boutique View</span>
            <span className="text-xs">↗</span>
          </Link>
          <button
            onClick={() => {
              logout();
              router.replace("/");
            }}
            className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <span>Sign Out Session</span>
            <span>⏻</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="min-w-0 flex-1 px-4 py-8 md:px-10 lg:py-10">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <span>Admin Studio</span>
              <span>/</span>
              <span className="text-primary font-semibold">{title}</span>
            </div>
            <h1 className="mt-1 font-display text-3xl font-normal text-primary tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </header>

        {children}
      </main>
    </div>
  );
}

export const card =
  "rounded-2xl border border-border/80 bg-white p-6 shadow-soft transition-all duration-200 hover:border-gold-300/40";

export const input =
  "w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400";

export const btn =
  "inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lift transition-all hover:bg-primary/90 hover:-translate-y-0.5 disabled:opacity-50";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border/80 bg-background px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-muted hover:border-primary";

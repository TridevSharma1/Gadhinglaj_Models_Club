"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { CloseIcon, MenuIcon } from "@/components/site/Icons";

const nav = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/rentals", label: "Rental Bookings" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/offers", label: "Offers" },
  { to: "/admin/banners", label: "Hero Banners" },
  { to: "/admin/content", label: "Website Content" },
  { to: "/admin/settings", label: "Settings" },
] as const;

export default function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { admin, hydrated, logout, content } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !admin) router.replace("/admin/login");
  }, [hydrated, admin, router]);

  if (!hydrated || !admin)
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking admin session…
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col bg-muted/40 lg:flex-row">
      <div className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 lg:hidden">
        <span className="font-display text-lg text-sidebar-foreground">Admin Panel</span>
        <button onClick={() => setOpen((v) => !v)} className="text-sidebar-foreground">
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <aside
        className={`${open ? "block" : "hidden"} shrink-0 bg-sidebar px-4 py-6 lg:block lg:w-64`}
      >
        <div className="hidden px-2 lg:block">
          <p className="font-display text-xl text-sidebar-foreground">{content.businessName}</p>
          <p className="eyebrow mt-1 text-[9px]">Admin Panel</p>
        </div>
        <nav className="mt-6 space-y-1">
          {nav.map((n) => {
            const isActive = n.to === "/admin" ? pathname === "/admin" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                href={n.to}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent font-medium text-sidebar-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
          <button
            onClick={() => {
              logout();
              router.replace("/");
            }}
            className="mt-3 block w-full rounded-xl px-3 py-2.5 text-left text-sm text-sidebar-primary hover:bg-sidebar-accent"
          >
            Logout
          </button>
          <Link
            href="/"
            className="block rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent"
          >
            View Website
          </Link>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-8 md:px-8">
        <header className="mb-8">
          <h1 className="font-display text-3xl text-primary">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </header>
        {children}
      </main>
    </div>
  );
}

export const card = "rounded-2xl border border-border bg-card p-5 shadow-soft";
export const input =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-rose";
export const btn =
  "rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90";
export const btnGhost =
  "rounded-full border border-border px-4 py-2 text-sm text-primary transition-colors hover:bg-blush";

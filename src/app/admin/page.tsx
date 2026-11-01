"use client";

import Link from "next/link";
import AdminShell, { card, btn, btnGhost } from "@/components/admin/AdminShell";
import { inr } from "@/data/catalog";
import { useStore } from "@/lib/store";
import { isProductLowStock } from "@/lib/stock-utils";
import { SparkleIcon } from "@/components/site/Icons";

export default function AdminDashboardPage() {
  const { products, orders, bookings, customers, categories, subcategories, inquiries } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const rentalRevenue = bookings.reduce((sum, b) => sum + (b.rental || 0), 0);
  const totalValuation = products.reduce((sum, p) => sum + p.stock * p.price, 0);
  const lowStockCount = products.filter((p) => isProductLowStock(p, 3)).length;

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const pendingBookings = bookings.filter((b) => b.status === "Pending").length;
  const newInquiries = (inquiries || []).filter((i) => i.status === "New").length;

  const readymadeCount = products.filter((p) => p.type === "readymade").length;
  const rentalCount = products.filter((p) => p.type === "rental").length;

  const stats = [
    {
      label: "Total Sales Revenue",
      value: inr(totalRevenue),
      sub: `${orders.length} settled orders`,
      icon: "💎",
      trend: "+18% growth",
      href: "/admin/orders",
    },
    {
      label: "Rental Studio Revenue",
      value: inr(rentalRevenue),
      sub: `${bookings.length} reservations`,
      icon: "✨",
      trend: `${pendingBookings} pending trial`,
      href: "/admin/rentals",
    },
    {
      label: "Inventory Valuation",
      value: inr(totalValuation),
      sub: `${products.reduce((acc, p) => acc + p.stock, 0)} total units on hand`,
      icon: "📦",
      trend: `${readymadeCount} ready · ${rentalCount} rentals`,
      href: "/admin/inventory",
    },
    {
      label: "Low Stock Garments",
      value: lowStockCount,
      sub: "Items or sizes with ≤ 3 units",
      icon: "⚠️",
      trend: lowStockCount > 0 ? "Requires restock" : "Optimal",
      href: "/admin/low-stock",
      alert: lowStockCount > 0,
    },
  ];

  const quickLinks = [
    { title: "Category & Sub Category", desc: `${categories.length} Categories · ${(subcategories || []).length} Sub-Categories`, icon: "🏷️", href: "/admin/categories" },
    { title: "Product Catalog", desc: `${products.length} Masterpieces cataloged`, icon: "👗", href: "/admin/products" },
    { title: "Low Stock Alerts", desc: `${lowStockCount} Items need replenishing`, icon: "⚠️", href: "/admin/low-stock", badge: lowStockCount > 0 ? `${lowStockCount} Alert` : undefined },
    { title: "Inventory Ledger", desc: `${inr(totalValuation)} catalog asset value`, icon: "📦", href: "/admin/inventory" },
    { title: "Users & Patrons", desc: `${customers.length} Registered clients`, icon: "👑", href: "/admin/users" },
    { title: "Client Orders", desc: `${orders.length} Ready-to-wear orders`, icon: "🛍️", href: "/admin/orders", badge: pendingOrders > 0 ? `${pendingOrders} Pending` : undefined },
    { title: "Rental Studio", desc: `${bookings.length} Photoshoot & bridal bookings`, icon: "✨", href: "/admin/rentals", badge: pendingBookings > 0 ? `${pendingBookings} Pending` : undefined },
    { title: "Voucher And Offer", desc: "Seasonal privileges & promo codes", icon: "🎁", href: "/admin/offers" },
    { title: "Testimonials", desc: "Customer review moderation", icon: "⭐", href: "/admin/reviews" },
    { title: "Inquiry Desk", desc: `${(inquiries || []).length} Messages from clients`, icon: "📩", href: "/admin/inquiries", badge: newInquiries > 0 ? `${newInquiries} New` : undefined },
    { title: "Hero Showcase", desc: "Homepage slider carousel", icon: "🖼️", href: "/admin/banners" },
    { title: "Website Setting", desc: "Store parameters & branding copy", icon: "⚙️", href: "/admin/settings" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Confirmed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Shipped":
      case "Picked Up":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Delivered":
      case "Returned":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Cancelled":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <AdminShell
      title="Atelier Executive Dashboard"
      subtitle="Complete live overview of boutique operations, categories, low-stock alerts, orders, and inquiries."
      action={
        <div className="flex gap-2">
          <Link href="/admin/products" className={btn}>
            <span>+</span>
            <span>New Masterpiece</span>
          </Link>
        </div>
      }
    >
      {/* 4 Primary VIP Metric Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`${card} block hover:-translate-y-1 transition-transform cursor-pointer`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
                <p className={`mt-2 font-display text-3xl font-normal ${s.alert ? "text-rose-700" : "text-primary"}`}>
                  {s.value}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blush text-xl shadow-xs">
                {s.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
              <span className="text-muted-foreground">{s.sub}</span>
              <span className={`font-semibold ${s.alert ? "text-rose-600" : "text-emerald-700"}`}>
                {s.trend}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-primary">Atelier Management Sections</h2>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            {quickLinks.length} Modules Available
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {quickLinks.map((ql) => (
            <Link
              key={ql.title}
              href={ql.href}
              className={`${card} group flex flex-col justify-between p-4 hover:-translate-y-0.5 transition-transform`}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {ql.icon}
                </span>
                {ql.badge && (
                  <span className="rounded-full bg-rose-500/15 border border-rose-400/30 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                    {ql.badge}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                  {ql.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{ql.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pending Action Items Bar */}
      <div className="mt-8 rounded-2xl border border-gold-300/30 bg-gradient-to-r from-card via-blush/30 to-card p-5 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-gold-300">
            <SparkleIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base text-primary">Pending Atelier Action Items</h3>
            <p className="text-xs text-muted-foreground">
              {pendingOrders} client orders require dispatch verification · {pendingBookings} rental bookings await fitting · {newInquiries} new customer inquiries.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/orders" className={btnGhost}>
            Orders ({pendingOrders})
          </Link>
          <Link href="/admin/rentals" className={btn}>
            Rentals ({pendingBookings})
          </Link>
          <Link href="/admin/inquiries" className={btnGhost}>
            Inquiries ({newInquiries})
          </Link>
        </div>
      </div>

      {/* Recent Activity Grids */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className={card}>
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h2 className="font-display text-xl text-primary">Recent Client Orders</h2>
              <p className="text-xs text-muted-foreground">Latest ready-to-wear purchases</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline">
              View All →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-border/60">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground text-sm">{o.id}</span>
                    <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge(o.status)}`}>
                      {o.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {o.customer} · {o.phone}
                  </p>
                  <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                    {o.items.map((i) => `${i.name} (${i.size})`).join(", ")}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-medium text-primary text-sm">{inr(o.amount)}</p>
                  <p className="text-[10px] text-muted-foreground">{o.date}</p>
                </div>
              </div>
            ))}

            {!orders.length && (
              <p className="py-8 text-center text-xs text-muted-foreground">No orders recorded yet.</p>
            )}
          </div>
        </div>

        {/* Recent Rental Bookings */}
        <div className={card}>
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h2 className="font-display text-xl text-primary">Recent Rental Reservations</h2>
              <p className="text-xs text-muted-foreground">Photoshoot &amp; bridal outfit bookings</p>
            </div>
            <Link href="/admin/rentals" className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline">
              View All →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-border/60">
            {bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground text-sm">{b.id}</span>
                    <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge(b.status)}`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-primary mt-0.5 truncate">
                    {b.outfit} (Size {b.size})
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Client: {b.customer} · {b.phone}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-medium text-primary text-sm">{inr(b.rental)}</p>
                  <p className="text-[10px] text-muted-foreground">{b.start} → {b.end}</p>
                </div>
              </div>
            ))}

            {!bookings.length && (
              <p className="py-8 text-center text-xs text-muted-foreground">No rental reservations yet.</p>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

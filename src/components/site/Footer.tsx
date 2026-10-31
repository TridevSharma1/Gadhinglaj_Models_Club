import Link from "next/link";
import { useStore } from "@/lib/store";

const quick = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/rental", label: "Rental" },
  { href: "/categories", label: "Categories" },
  { href: "/offers", label: "Offers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const care = [
  { href: "/faq", label: "FAQ" },
  { href: "/terms", label: "Shipping Policy" },
  { href: "/terms", label: "Return Policy" },
  { href: "/terms", label: "Rental Policy" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
] as const;

export default function Footer() {
  const { content } = useStore();
  return (
    <footer className="mt-24 border-t border-border bg-secondary/60">
      <div className="container-lux grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl text-primary">{content.businessName}</h3>
          <div className="gold-rule my-4" />
          <p className="text-sm leading-relaxed text-muted-foreground">{content.footerText}</p>
          <p className="mt-4 text-xs text-muted-foreground">Managed by {content.owner}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2.5">
            {quick.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground">
            Customer Care
          </h4>
          <ul className="mt-4 space-y-2.5">
            {care.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground">Contact</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a href={`tel:${content.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                {content.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${content.email}`} className="break-all hover:text-primary">
                {content.email}
              </a>
            </li>
            <li className="leading-relaxed">{content.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container-lux flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 {content.businessName}. All Rights Reserved.</p>
          <Link href="/admin/login" className="text-[11px] text-muted-foreground/70 hover:text-primary">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}

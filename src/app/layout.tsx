import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Gadhinglaj Models Club — Designer Boutique & Dress Rental",
  description:
    "Premium designer outfits, ethnic wear and luxury dress rental in Gadhinglaj, Maharashtra.",
  authors: [{ name: "Gadhinglaj Models Club" }],
  openGraph: {
    type: "website",
    title: "Gadhinglaj Models Club — Designer Boutique & Dress Rental",
    description:
      "Premium designer outfits, ethnic wear and luxury dress rental in Gadhinglaj, Maharashtra.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500;600&display=swap"
        />
      </head>
      <body>
        <StoreProvider>
          {children}
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}

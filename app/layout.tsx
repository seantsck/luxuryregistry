import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: { default:"Luxury Registry — The Global Luxury Register", template:"%s — Luxury Registry" },
  description:"A curated marketplace for luxury, designer and streetwear objects.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <div className="footer-mark">LR</div>
          <div><strong>LUXURY REGISTRY</strong><p>A curated register of luxury, designer and streetwear objects.</p></div>
          <p className="footer-legal">Luxury Registry presents a continuously expanding selection of fashion, footwear and accessories available to order from our supplier network.</p>
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: { default:"Luxury Registry — The Global Luxury Register", template:"%s — Luxury Registry" },
  description:"A structured registry of luxury, designer and streetwear objects.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <div className="footer-mark">LR</div>
          <div><strong>LUXURY REGISTRY</strong><p>A structured register of luxury, designer and streetwear objects.</p></div>
          <p className="footer-legal">Catalog preview. Visible labels are supplier-presented and unverified unless documented otherwise. Branded items are not offered for sale until authorization and authenticity requirements are satisfied.</p>
        </footer>
      </body>
    </html>
  );
}

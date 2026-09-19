import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
import { products } from "@/lib/products";

export const metadata: Metadata = { title:"The Register", description:"Browse the Luxury Registry private catalog preview." };

export default function ShopPage() {
  return (
    <main className="shop-page">
      <div className="shop-intro">
        <p className="eyebrow">THE REGISTER · PRIVATE PREVIEW</p>
        <h1>Index of objects.</h1>
        <p>Twenty representative registrations are live in this first build. The reconciled master contains 625 products and will move into the database after the storefront shell is approved.</p>
      </div>
      <CatalogBrowser products={products} />
    </main>
  );
}

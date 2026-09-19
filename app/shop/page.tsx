import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
import { loadCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title:"The Register",
  description:"Browse all 625 cataloged Luxury Registry objects."
};

export default async function ShopPage() {
  const products = await loadCatalog();
  return (
    <main className="shop-page">
      <div className="shop-intro">
        <p className="eyebrow">THE REGISTER · 625 CATALOGED OBJECTS</p>
        <h1>Index of objects.</h1>
        <p>The reconciled master catalog is live. Commerce remains verification-gated: a listing becomes purchasable only after its documentation, product data, imagery and Shopify variant are cleared.</p>
      </div>
      <CatalogBrowser products={products} />
    </main>
  );
}

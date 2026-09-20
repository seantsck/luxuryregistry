import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
import { loadCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title:"The Register",
  description:"Browse the Luxury Registry collection."
};

export default async function ShopPage() {
  const products = await loadCatalog();
  return (
    <main className="shop-page">
      <div className="shop-intro">
        <p className="eyebrow">THE REGISTER · {products.length} OBJECTS</p>
        <h1>Index of objects.</h1>
        <p>Explore the full Luxury Registry collection. Every item shown in the register is available to order, with supplier production fulfilled on demand.</p>
      </div>
      <CatalogBrowser products={products} />
    </main>
  );
}

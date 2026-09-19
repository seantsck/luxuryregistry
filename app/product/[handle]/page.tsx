import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import { money } from "@/lib/format";
import { isChannelReady } from "@/lib/channels";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = getProduct(handle);
  return product ? { title: product.title, description: product.short } : {};
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();

  const index = products.findIndex((p) => p.handle === handle);
  const previous = products[index - 1];
  const next = products[index + 1];
  const commerceReady = isChannelReady(product);

  const structuredData = commerceReady ? {
    "@context": "https://schema.org",
    "@type": "Product",
    sku: product.id,
    name: product.title,
    description: product.short,
    image: product.image ? [product.image] : undefined,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      url: `${siteUrl()}/product/${product.handle}`,
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability:
        product.availability === "out of stock"
          ? "https://schema.org/OutOfStock"
          : product.availability === "preorder"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  } : null;

  const checkoutEnabled = commerceReady;

  return (
    <main className="product-page">
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      ) : null}

      <div className="product-breadcrumb">
        <Link href="/shop">THE REGISTER</Link><span>/</span><span>{product.id}</span>
      </div>

      <div className="product-layout">
        <div className={"product-detail-image dept-" + product.department.toLowerCase()}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              style={{ width:"100%", height:"100%", objectFit:"contain", display:"block" }}
            />
          ) : (
            <>
              <span>{product.id}</span><strong>LR</strong><small>{product.department}</small>
            </>
          )}
        </div>

        <div className="product-info">
          <p className="eyebrow">{product.brand} · {product.id}</p>
          <h1>{product.title}</h1>
          <div className="detail-price">
            <strong>{money(product.price)}</strong>
            {product.compareAt && product.compareAt > product.price ? <del>{money(product.compareAt)}</del> : null}
          </div>
          <p className="detail-intro">{product.short}</p>

          {commerceReady ? (
            <div className="verification-box">
              <span>VERIFICATION STATUS</span>
              <strong>VERIFIED FOR COMMERCE</strong>
              <p>Documentation, imagery, variant data and marketplace requirements have cleared the commerce gate.</p>
            </div>
          ) : (
            <div className="verification-box">
              <span>VERIFICATION STATUS</span>
              <strong>HOLD — DOCUMENTATION REQUIRED</strong>
              <p>Visible branding is cataloged from supplier imagery and does not establish authenticity or authorization. Checkout remains disabled until verification is complete.</p>
            </div>
          )}

          {checkoutEnabled ? (
            <form action="/api/checkout" method="GET">
              <input type="hidden" name="product" value={product.id} />
              {product.sizes?.length ? (
                <label style={{ display:"grid", gap:8, marginBottom:14 }}>
                  <span className="eyebrow">SIZE</span>
                  <select name="size" required defaultValue="">
                    <option value="" disabled>Select size</option>
                    {product.sizes.map((size) => <option key={size} value={size}>{size}</option>)}
                  </select>
                </label>
              ) : null}
              <button className="disabled-buy" type="submit">BUY NOW</button>
            </form>
          ) : (
            <button className="disabled-buy" disabled>NOT YET AVAILABLE FOR PURCHASE</button>
          )}

          <dl className="product-specs">
            <div><dt>Registry no.</dt><dd>{product.id}</dd></div>
            <div><dt>Type</dt><dd>{product.type}</dd></div>
            <div><dt>Colorways</dt><dd>{product.colors || "Supplier confirmation required"}</dd></div>
            <div><dt>Availability</dt><dd>{product.availability === "preorder" ? "Made to order" : product.availability ?? "Pending"}</dd></div>
            <div><dt>Catalog status</dt><dd>{commerceReady ? "Commerce enabled" : "Verification hold"}</dd></div>
          </dl>
        </div>
      </div>

      <div className="registry-pagination">
        {previous ? <Link href={"/product/" + previous.handle}>← {previous.id}</Link> : <span />}
        <span>{String(index + 1).padStart(3, "0")} / {products.length}</span>
        {next ? <Link href={"/product/" + next.handle}>{next.id} →</Link> : <span />}
      </div>
    </main>
  );
}

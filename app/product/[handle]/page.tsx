import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, money, products } from "@/lib/products";
import { isChannelReady } from "@/lib/channels";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = getProduct(handle);
  return product ? { title:product.title, description:product.short } : {};
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();
  const index = products.findIndex(p=>p.handle===handle);
  const previous = products[index-1];
  const next = products[index+1];
  const commerceReady = isChannelReady(product);

  const structuredData = commerceReady ? {
    "@context": "https://schema.org",
    "@type": "Product",
    sku: product.id,
    name: product.title,
    description: product.short,
    image: product.image ? [new URL(product.image, siteUrl()).toString()] : undefined,
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

  return (
    <main className="product-page">
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      ) : null}
      <div className="product-breadcrumb"><Link href="/shop">THE REGISTER</Link><span>/</span><span>{product.id}</span></div>
      <div className="product-layout">
        <div className={"product-detail-image dept-" + product.department.toLowerCase()}><span>{product.id}</span><strong>LR</strong><small>{product.department}</small></div>
        <div className="product-info">
          <p className="eyebrow">{product.brand} · {product.id}</p>
          <h1>{product.title}</h1>
          <div className="detail-price"><strong>{money(product.price)}</strong>{product.compareAt && product.compareAt > product.price ? <del>{money(product.compareAt)}</del> : null}</div>
          <p className="detail-intro">{product.short}</p>
          {commerceReady ? (
            <div className="verification-box"><span>VERIFICATION STATUS</span><strong>VERIFIED FOR SALES CHANNELS</strong><p>Required documentation, product data and commerce fields have cleared the channel gate.</p></div>
          ) : (
            <div className="verification-box"><span>VERIFICATION STATUS</span><strong>HOLD — DOCUMENTATION REQUIRED</strong><p>This object is cataloged from supplier imagery. Visible branding does not establish authenticity or authorization. Purchasing is disabled during verification.</p></div>
          )}
          {commerceReady && product.checkoutUrl ? (
            <Link className="disabled-buy" href={product.checkoutUrl}>BUY NOW</Link>
          ) : (
            <button className="disabled-buy" disabled>NOT YET AVAILABLE FOR PURCHASE</button>
          )}
          <dl className="product-specs">
            <div><dt>Registry no.</dt><dd>{product.id}</dd></div><div><dt>Type</dt><dd>{product.type}</dd></div><div><dt>Colorways</dt><dd>{product.colors}</dd></div><div><dt>Availability</dt><dd>{commerceReady ? product.availability ?? "In stock" : "Made to order"}</dd></div><div><dt>Catalog status</dt><dd>{commerceReady ? "Channel eligible" : "Private preview"}</dd></div>
          </dl>
        </div>
      </div>
      <div className="registry-pagination">{previous?<Link href={"/product/"+previous.handle}>← {previous.id}</Link>:<span/>}<span>{String(index+1).padStart(2,"0")} / {products.length}</span>{next?<Link href={"/product/"+next.handle}>{next.id} →</Link>:<span/>}</div>
    </main>
  );
}

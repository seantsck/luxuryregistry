import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCatalog } from "@/lib/catalog";
import { money } from "@/lib/format";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ handle: string }> };

async function existingProductImages(images: string[]) {
  if (images.length <= 1) return images;

  const checked = await Promise.all(
    images.map(async (image, index) => {
      if (index === 0) return image;

      try {
        const response = await fetch(image, {
          method: "HEAD",
          next: { revalidate: 300 },
        });
        return response.ok ? image : undefined;
      } catch {
        return undefined;
      }
    }),
  );

  return checked.filter((image): image is string => Boolean(image));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const products = await loadCatalog();
  const product = products.find((item) => item.handle === handle);
  return product ? { title: product.title, description: product.short } : {};
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const products = await loadCatalog();
  const product = products.find((item) => item.handle === handle);
  if (!product) notFound();

  const index = products.findIndex((p) => p.handle === handle);
  const previous = products[index - 1];
  const next = products[index + 1];
  const imageCandidates = product.images?.length ? product.images : product.image ? [product.image] : [];
  const productImages = await existingProductImages(imageCandidates);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    sku: product.id,
    name: product.title,
    description: product.short,
    image: productImages.length ? productImages : undefined,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      url: `${siteUrl()}/product/${product.handle}`,
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <main className="product-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="product-breadcrumb">
        <Link href="/shop">THE REGISTER</Link><span>/</span><span>{product.id}</span>
      </div>

      <div className="product-layout">
        <div className="product-detail-gallery">
          {productImages.length ? productImages.map((image, imageIndex) => (
            <div
              key={image}
              className={"product-detail-image dept-" + product.department.toLowerCase()}
            >
              <img
                src={image}
                alt={imageIndex === 0 ? product.title : `${product.title} — view ${imageIndex + 1}`}
                style={{ width:"100%", height:"100%", objectFit:"contain", display:"block", padding:"28px" }}
              />
            </div>
          )) : (
            <div className={"product-detail-image dept-" + product.department.toLowerCase()}>
              <span>{product.id}</span><strong>LR</strong><small>{product.department}</small>
            </div>
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

          <div className="availability-box">
            <span>AVAILABILITY</span>
            <strong>AVAILABLE TO ORDER</strong>
            <p>Select your options below to continue to secure checkout.</p>
          </div>

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
            <label style={{ display:"grid", gap:8, marginBottom:14 }}>
              <span className="eyebrow">QUANTITY</span>
              <select name="quantity" defaultValue="1">
                {[1,2,3,4,5,6,7,8,9,10].map((quantity) => (
                  <option key={quantity} value={quantity}>{quantity}</option>
                ))}
              </select>
            </label>
            <button className="buy-button" type="submit">BUY NOW</button>
          </form>

          <dl className="product-specs">
            <div><dt>Registry no.</dt><dd>{product.id}</dd></div>
            <div><dt>Type</dt><dd>{product.type}</dd></div>
            <div><dt>Colorways</dt><dd>{product.colors || "As shown"}</dd></div>
            <div><dt>Availability</dt><dd>Available to order</dd></div>
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

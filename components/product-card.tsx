import Link from "next/link";
import type { Product } from "@/lib/product-types";
import { money } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={"/product/" + product.handle} className={"product-card-image dept-" + product.department.toLowerCase()}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
          />
        ) : (
          <>
            <span className="registry-number">{product.id}</span>
            <strong>LR</strong>
            <small>{product.department}</small>
          </>
        )}
      </Link>
      <div className="product-card-copy">
        <p className="eyebrow">{product.brand}</p>
        <Link href={"/product/" + product.handle}><h3>{product.title}</h3></Link>
        <div className="price-line">
          <span>{money(product.price)}</span>
          {product.compareAt && product.compareAt > product.price ? <del>{money(product.compareAt)}</del> : null}
        </div>
      </div>
    </article>
  );
}

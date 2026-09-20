"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/product-types";
import { ProductCard } from "@/components/product-card";

export function CatalogBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [sort, setSort] = useState("registry");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => (!q || (p.title + " " + p.brand + " " + p.id).toLowerCase().includes(q)) && (department === "All" || p.department === department))
      .sort((a,b) => sort === "price-low" ? a.price-b.price : sort === "price-high" ? b.price-a.price : sort === "name" ? a.title.localeCompare(b.title) : a.id.localeCompare(b.id));
  }, [products, query, department, sort]);

  return (
    <>
      <div className="catalog-toolbar">
        <label><span>Search</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="BAPE, LR-0001, denim…" /></label>
        <label><span>Department</span><select value={department} onChange={e=>setDepartment(e.target.value)}>{["All","Tops","Outerwear","Denim","Footwear","Bags"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label><span>Order</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="registry">Registry no.</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></label>
      </div>
      <div className="catalog-meta"><span>{visible.length} objects</span><span>Available to order · supplier produced on demand</span></div>
      <div className="product-grid">{visible.map(p=><ProductCard key={p.id} product={p} />)}</div>
    </>
  );
}

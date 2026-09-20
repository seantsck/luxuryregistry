import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { loadCatalog } from "@/lib/catalog";

export default async function Home() {
  const products = await loadCatalog();
  return (
    <main>
      <section className="hero">
        <div className="hero-kicker">ISSUE 001 · THE GLOBAL REGISTER · 2026</div>
        <div className="hero-title-wrap">
          <h1>LUXURY<br/><em>REGISTRY</em></h1>
          <p className="hero-deck">A living marketplace of fashion objects—streetwear, designer denim, footwear and accessories—curated with the discipline of an archive and the attitude of a magazine.</p>
        </div>
        <div className="hero-actions"><Link href="/shop" className="primary-link">SHOP THE REGISTER <span>↗</span></Link><span className="hero-number">LR / {products.length}</span></div>
      </section>

      <section className="stats-band">
        <div><strong>{products.length}</strong><span>objects available</span></div>
        <div><strong>1,236</strong><span>source images mapped</span></div>
        <div><strong>05</strong><span>core departments</span></div>
        <div><strong>24/7</strong><span>ordering open</span></div>
      </section>

      <section className="editorial-section">
        <div className="section-heading"><div><span className="section-no">01</span><p>NEW REGISTRATIONS</p></div><h2>The edit.</h2><Link href="/shop">Shop the register →</Link></div>
        <div className="featured-grid">{products.slice(0,8).map(p=><ProductCard key={p.id} product={p} />)}</div>
      </section>

      <section className="manifesto" id="about">
        <div className="manifesto-index">REGISTRY / 001</div>
        <blockquote>“Luxury is not the logo. It is the object, the context, the provenance, and the record.”</blockquote>
        <div className="manifesto-copy"><p>Luxury Registry is a structured fashion marketplace: editorial enough to browse, rigorous enough to operate as product data.</p><p>Every object receives a registry number and is available to order through our supplier network, with production fulfilled on demand.</p></div>
      </section>

      <section className="departments">
        <div className="section-heading compact"><div><span className="section-no">02</span><p>DEPARTMENTS</p></div><h2>Browse the archive.</h2></div>
        <div className="department-grid">
          {[
            ["Tops","Graphic tees & jersey"],["Outerwear","Hoodies & layers"],["Denim","Designer denim"],["Footwear","Sneakers, boots & sandals"],["Bags","Totes, backpacks & pouches"]
          ].map(([name,desc],i)=><Link key={name} href="/shop" className="department-card"><span>0{i+1}</span><h3>{name}</h3><p>{desc}</p><b>↗</b></Link>)}
        </div>
      </section>
    </main>
  );
}

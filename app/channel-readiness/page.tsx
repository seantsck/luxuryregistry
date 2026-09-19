import Link from "next/link";
import { products } from "@/lib/products";
import { channelIssues, isChannelReady } from "@/lib/channels";

export const metadata = {
  title: "Sales Channel Readiness",
  description: "Luxury Registry marketplace feed and catalog readiness.",
};

export default function ChannelReadinessPage() {
  const eligible = products.filter(isChannelReady);
  const blocked = products.filter((product) => !isChannelReady(product));

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 24px 120px" }}>
      <p className="eyebrow">COMMERCE OPERATIONS</p>
      <h1 style={{ fontSize: "clamp(2.6rem,7vw,6rem)", margin: "0 0 20px", lineHeight: .94 }}>
        Sales Channel Readiness
      </h1>
      <p style={{ maxWidth: 760, fontSize: 18, lineHeight: 1.6, opacity: .72 }}>
        Feeds are live and automatically export only products that have cleared verification,
        checkout, imagery, size, and identifier requirements. This prevents marketplace accounts
        from ingesting guaranteed-disapproval listings.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12, margin: "42px 0" }}>
        {[
          ["Catalog products", products.length],
          ["Channel eligible", eligible.length],
          ["Blocked", blocked.length],
          ["Live feeds", 4],
        ].map(([label, value]) => (
          <div key={String(label)} style={{ border: "1px solid currentColor", padding: 20 }}>
            <div style={{ fontSize: 12, letterSpacing: ".12em", opacity: .6 }}>{label}</div>
            <strong style={{ display: "block", fontSize: 42, marginTop: 8 }}>{value}</strong>
          </div>
        ))}
      </div>

      <section style={{ marginTop: 56 }}>
        <h2>Live feed endpoints</h2>
        <div style={{ display: "grid", gap: 10 }}>
          <Link href="/feeds/google.xml">Google Merchant Center — /feeds/google.xml</Link>
          <Link href="/feeds/meta.csv">Meta Commerce — /feeds/meta.csv</Link>
          <Link href="/feeds/pinterest.csv">Pinterest Catalogs — /feeds/pinterest.csv</Link>
          <Link href="/feeds/microsoft.tsv">Microsoft Merchant Center — /feeds/microsoft.tsv</Link>
          <Link href="/api/channels/status">Machine-readable status — /api/channels/status</Link>
        </div>
      </section>

      <section style={{ marginTop: 56 }}>
        <h2>Current blockers</h2>
        <div style={{ overflowX: "auto", borderTop: "1px solid currentColor" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "14px 8px" }}>Registry</th>
                <th style={{ textAlign: "left", padding: "14px 8px" }}>Product</th>
                <th style={{ textAlign: "left", padding: "14px 8px" }}>Blocking requirements</th>
              </tr>
            </thead>
            <tbody>
              {blocked.map((product) => (
                <tr key={product.id} style={{ borderTop: "1px solid rgba(127,127,127,.3)" }}>
                  <td style={{ padding: "14px 8px", whiteSpace: "nowrap" }}>{product.id}</td>
                  <td style={{ padding: "14px 8px" }}>{product.title}</td>
                  <td style={{ padding: "14px 8px" }}>{channelIssues(product).join(" · ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

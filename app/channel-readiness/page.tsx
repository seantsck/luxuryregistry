import Link from "next/link";
import { loadCatalog } from "@/lib/catalog";
import { channelIssues, isChannelReady, type ChannelIssue } from "@/lib/channels";

export const metadata = {
  title: "Sales Channel Readiness",
  description: "Luxury Registry marketplace feed and catalog readiness.",
};

const ISSUE_LABELS: Record<ChannelIssue, string> = {
  "verification-pending": "Verification pending",
  "channel-disabled": "Publish switch off",
  "missing-image": "Missing image",
  "missing-price": "Missing price",
  "missing-color": "Missing color",
  "missing-size": "Missing size",
  "identifier-status-unknown": "Identifier status",
};

export default async function ChannelReadinessPage() {
  const products = await loadCatalog();
  const eligible = products.filter(isChannelReady);
  const blocked = products.filter((product) => !isChannelReady(product));

  const issueCounts = blocked.reduce<Record<string, number>>((counts, product) => {
    for (const issue of channelIssues(product)) counts[issue] = (counts[issue] ?? 0) + 1;
    return counts;
  }, {});

  const quality = [
    ["Supplier-approved products", products.filter((p) => p.verified).length],
    ["Products using standard size stock", products.filter((p) => p.department !== "Bags").length],
    ["$99 default-price products", products.filter((p) => p.price === 99 && !p.compareAt).length],
    ["Descriptions under 80 chars", products.filter((p) => p.short.trim().length < 80).length],
  ] as const;

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 24px 120px" }}>
      <p className="eyebrow">COMMERCE OPERATIONS</p>
      <h1 style={{ fontSize: "clamp(2.6rem,7vw,6rem)", margin: "0 0 20px", lineHeight: .94 }}>
        Sales Channel Readiness
      </h1>
      <p style={{ maxWidth: 780, fontSize: 18, lineHeight: 1.6, opacity: .72 }}>
        The supplier-approved catalog can publish once required imagery, pricing, color,
        identifier status, and the final channel switch are present. Standard size variants
        are generated automatically with five units available per size.
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
        <h2>Priority blockers</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12 }}>
          {(Object.keys(ISSUE_LABELS) as ChannelIssue[])
            .map((issue) => [issue, issueCounts[issue] ?? 0] as const)
            .filter(([, count]) => count > 0)
            .map(([issue, count]) => (
              <div key={issue} style={{ border: "1px solid rgba(127,127,127,.35)", padding: 18 }}>
                <strong style={{ display: "block", fontSize: 30 }}>{count}</strong>
                <span style={{ fontSize: 13, opacity: .72 }}>{ISSUE_LABELS[issue]}</span>
              </div>
            ))}
        </div>
      </section>

      <section style={{ marginTop: 56 }}>
        <h2>Catalog quality audit</h2>
        <div style={{ overflowX: "auto", borderTop: "1px solid currentColor" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <tbody>
              {quality.map(([label, count]) => (
                <tr key={label} style={{ borderBottom: "1px solid rgba(127,127,127,.3)" }}>
                  <td style={{ padding: "14px 8px" }}>{label}</td>
                  <td style={{ padding: "14px 8px", textAlign: "right", fontWeight: 700 }}>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ marginTop: 56 }}>
        <h2>Live feed endpoints</h2>
        <div style={{ display: "grid", gap: 10 }}>
          <Link href="/feeds/google.xml">Google Merchant Center — /feeds/google.xml</Link>
          <Link href="/feeds/meta.csv">Meta Commerce — /feeds/meta.csv</Link>
          <Link href="/feeds/pinterest.csv">Pinterest Catalogs — /feeds/pinterest.csv</Link>
          <Link href="/feeds/microsoft.tsv">Microsoft Merchant Center — /feeds/microsoft.tsv</Link>
          <Link href="/api/channels/status">Readiness summary — /api/channels/status</Link>
          <Link href="/api/channels/status?details=1">Full blocker detail — /api/channels/status?details=1</Link>
          <Link href="/api/channels/remediation.csv">Supplier remediation CSV — /api/channels/remediation.csv</Link>
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
                  <td style={{ padding: "14px 8px" }}>
                    {channelIssues(product).map((issue) => ISSUE_LABELS[issue]).join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

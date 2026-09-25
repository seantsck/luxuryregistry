import { loadCatalog } from "@/lib/catalog";
import { channelIssues, csvCell, needsBrandReview } from "@/lib/channels";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await loadCatalog();

  const header = [
    "registry_id",
    "title",
    "brand",
    "department",
    "product_type",
    "current_price",
    "current_compare_at",
    "colors",
    "current_sizes",
    "current_gtin",
    "current_mpn",
    "identifier_exists",
    "verified",
    "channel_ready",
    "brand_review_required",
    "current_blockers",
    "supplier_verified",
    "confirmed_sizes",
    "confirmed_gtin",
    "confirmed_mpn",
    "verification_evidence_or_invoice",
    "supplier_notes",
  ];

  const rows = products.map((product) => [
    product.id,
    product.title,
    product.brand,
    product.department,
    product.type,
    product.price.toFixed(2),
    product.compareAt?.toFixed(2) ?? "",
    product.colors,
    product.sizes?.join("|") ?? "",
    product.gtin ?? "",
    product.mpn ?? "",
    product.identifierExists === undefined ? "" : product.identifierExists ? "yes" : "no",
    product.verified ? "yes" : "no",
    product.channelReady ? "yes" : "no",
    needsBrandReview(product) ? "yes" : "no",
    channelIssues(product).join("|"),
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const body = [header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="luxury-registry-supplier-remediation.csv"',
      "Cache-Control": "no-store",
    },
  });
}

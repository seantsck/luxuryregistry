import { NextRequest } from "next/server";
import { loadCatalog } from "@/lib/catalog";
import { channelIssues, channelOffers, type ChannelIssue } from "@/lib/channels";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const products = await loadCatalog();
  const origin = request.nextUrl.origin;
  const offers = channelOffers(products, origin);
  const blocked = products
    .map((product) => ({ id: product.id, title: product.title, issues: channelIssues(product) }))
    .filter((product) => product.issues.length > 0);

  const issueCounts = blocked.reduce<Record<ChannelIssue, number>>((counts, product) => {
    for (const issue of product.issues) counts[issue] = (counts[issue] ?? 0) + 1;
    return counts;
  }, {} as Record<ChannelIssue, number>);

  const departmentCounts = products.reduce<Record<string, number>>((counts, product) => {
    counts[product.department] = (counts[product.department] ?? 0) + 1;
    return counts;
  }, {});

  const quality = {
    missingCompareAt: products.filter(
      (product) => !product.compareAt || product.compareAt <= product.price,
    ).length,
    defaultSizedProducts: products.filter(
      (product) => product.department !== "Bags",
    ).length,
    defaultPrice99: products.filter(
      (product) => product.price === 99 && !product.compareAt,
    ).length,
    descriptionsUnder80Characters: products.filter(
      (product) => product.short.trim().length < 80,
    ).length,
    supplierApproved: products.filter((product) => product.verified).length,
  };

  const includeDetails = request.nextUrl.searchParams.get("details") === "1";

  return Response.json({
    storefront: origin,
    totalProducts: products.length,
    eligibleProducts: products.length - blocked.length,
    eligibleOffers: offers.length,
    blockedProducts: blocked.length,
    issueCounts,
    departmentCounts,
    quality,
    feeds: {
      google: `${origin}/feeds/google.xml`,
      meta: `${origin}/feeds/meta.csv`,
      pinterest: `${origin}/feeds/pinterest.csv`,
      microsoft: `${origin}/feeds/microsoft.tsv`,
    },
    nextActions: [
      { key: "verification", count: issueCounts["verification-pending"] ?? 0 },
      { key: "publish-switch", count: issueCounts["channel-disabled"] ?? 0 },
      { key: "default-size-stock", count: products.filter((product) => product.department !== "Bags").length },
      { key: "default-price-99", count: products.filter((product) => product.price === 99 && !product.compareAt).length },
    ],
    ...(includeDetails ? { blocked } : {}),
  });
}

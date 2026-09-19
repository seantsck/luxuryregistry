import { NextRequest } from "next/server";
import { products } from "@/lib/products";
import { channelIssues, channelOffers } from "@/lib/channels";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const offers = channelOffers(products, origin);
  const blocked = products
    .map((product) => ({ id: product.id, title: product.title, issues: channelIssues(product) }))
    .filter((product) => product.issues.length > 0);

  return Response.json({
    storefront: origin,
    totalProducts: products.length,
    eligibleProducts: products.length - blocked.length,
    eligibleOffers: offers.length,
    blockedProducts: blocked.length,
    feeds: {
      google: `${origin}/feeds/google.xml`,
      meta: `${origin}/feeds/meta.csv`,
      pinterest: `${origin}/feeds/pinterest.csv`,
      microsoft: `${origin}/feeds/microsoft.tsv`,
    },
    blocked,
  });
}

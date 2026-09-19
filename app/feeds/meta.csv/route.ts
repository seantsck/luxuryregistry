import { NextRequest } from "next/server";
import { loadCatalog } from "@/lib/catalog";
import { channelOffers, csvCell } from "@/lib/channels";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const products = await loadCatalog();
  const offers = channelOffers(products, request.nextUrl.origin);
  const header = [
    "id","title","description","availability","condition","price","link",
    "image_link","brand","color","size","gender","age_group","item_group_id"
  ];
  const rows = offers.map((o) => [
    o.id,o.title,o.description,o.availability,o.condition,o.price,o.link,
    o.imageLink,o.brand,o.color,o.size ?? "",o.gender,o.ageGroup,o.itemGroupId ?? ""
  ]);

  const body = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="luxury-registry-meta.csv"',
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      "X-Luxury-Registry-Eligible-Offers": String(offers.length),
    },
  });
}

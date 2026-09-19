import { NextRequest } from "next/server";
import { loadCatalog } from "@/lib/catalog";
import { channelOffers } from "@/lib/channels";

export const dynamic = "force-dynamic";

function tsv(value: unknown) {
  return String(value ?? "").replace(/[\t\r\n]+/g, " ").trim();
}

export async function GET(request: NextRequest) {
  const products = await loadCatalog();
  const offers = channelOffers(products, request.nextUrl.origin);
  const header = [
    "id","title","description","link","image_link","price","availability",
    "condition","brand","color","size","gender","age_group","item_group_id",
    "gtin","mpn"
  ];
  const rows = offers.map((o) => [
    o.id,o.title,o.description,o.link,o.imageLink,o.price,o.availability,
    o.condition,o.brand,o.color,o.size ?? "",o.gender,o.ageGroup,o.itemGroupId ?? "",
    o.gtin ?? "",o.mpn ?? ""
  ]);

  const body = [header, ...rows].map((row) => row.map(tsv).join("\t")).join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/tab-separated-values; charset=utf-8",
      "Content-Disposition": 'inline; filename="luxury-registry-microsoft.tsv"',
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      "X-Luxury-Registry-Eligible-Offers": String(offers.length),
    },
  });
}

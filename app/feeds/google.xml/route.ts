import { NextRequest } from "next/server";
import { loadCatalog } from "@/lib/catalog";
import { channelOffers, xmlEscape } from "@/lib/channels";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const products = await loadCatalog();
  const origin = request.nextUrl.origin;
  const offers = channelOffers(products, origin);

  const items = offers.map((offer) => `
    <item>
      <g:id>${xmlEscape(offer.id)}</g:id>
      <title>${xmlEscape(offer.title)}</title>
      <description>${xmlEscape(offer.description)}</description>
      <link>${xmlEscape(offer.link)}</link>
      <g:image_link>${xmlEscape(offer.imageLink)}</g:image_link>
      ${offer.additionalImageLinks.map((image) => `<g:additional_image_link>${xmlEscape(image)}</g:additional_image_link>`).join("")}
      <g:condition>${offer.condition}</g:condition>
      <g:availability>${offer.availability}</g:availability>
      <g:price>${offer.price}</g:price>
      <g:brand>${xmlEscape(offer.brand)}</g:brand>
      <g:color>${xmlEscape(offer.color)}</g:color>
      ${offer.size ? `<g:size>${xmlEscape(offer.size)}</g:size>` : ""}
      <g:gender>${offer.gender}</g:gender>
      <g:age_group>${offer.ageGroup}</g:age_group>
      ${offer.itemGroupId ? `<g:item_group_id>${xmlEscape(offer.itemGroupId)}</g:item_group_id>` : ""}
      ${offer.gtin ? `<g:gtin>${xmlEscape(offer.gtin)}</g:gtin>` : ""}
      ${offer.mpn ? `<g:mpn>${xmlEscape(offer.mpn)}</g:mpn>` : ""}
      <g:identifier_exists>${offer.identifierExists ? "yes" : "no"}</g:identifier_exists>
      <g:product_type>${xmlEscape(offer.productType)}</g:product_type>
    </item>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Luxury Registry</title>
    <link>${xmlEscape(origin)}</link>
    <description>Luxury Registry verified sales catalog</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      "X-Luxury-Registry-Eligible-Offers": String(offers.length),
    },
  });
}

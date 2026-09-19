import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/products";
import { isChannelReady } from "@/lib/channels";
import { createShopifyCheckout } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const variantId = request.nextUrl.searchParams.get("variant");
  const quantity = Math.max(1, Math.min(10, Number(request.nextUrl.searchParams.get("quantity") || 1)));

  if (!variantId) {
    return NextResponse.json({ error: "Missing variant." }, { status: 400 });
  }

  const product = products.find(
    (item) => item.shopifyVariantId === variantId && isChannelReady(item)
  );

  if (!product) {
    return NextResponse.json(
      { error: "This product is not cleared for checkout." },
      { status: 403 }
    );
  }

  try {
    const checkoutUrl = await createShopifyCheckout(variantId, quantity);
    return NextResponse.redirect(checkoutUrl, 303);
  } catch (error) {
    console.error("Shopify checkout error", error);
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable." },
      { status: 502 }
    );
  }
}

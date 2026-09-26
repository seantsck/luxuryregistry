import { NextRequest, NextResponse } from "next/server";
import { loadCatalog } from "@/lib/catalog";
import { createStripeCheckoutSession } from "@/lib/stripe";
import { DEFAULT_STOCK_PER_SIZE, defaultSizesForProduct } from "@/lib/sizing";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("product");
  const size = request.nextUrl.searchParams.get("size")?.trim() || undefined;
  const quantity = Math.max(
    1,
    Math.min(10, Number(request.nextUrl.searchParams.get("quantity") || 1)),
  );

  if (!productId) {
    return NextResponse.json({ error: "Missing product." }, { status: 400 });
  }

  const products = await loadCatalog();
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return NextResponse.json(
      { error: "This product could not be found." },
      { status: 404 },
    );
  }

  if (!Number.isFinite(product.price) || product.price <= 0) {
    return NextResponse.json(
      { error: "This product does not have a valid price." },
      { status: 400 },
    );
  }

  const resolvedSizes = defaultSizesForProduct(product);
  if (resolvedSizes.length && (!size || !resolvedSizes.includes(size))) {
    return NextResponse.json(
      { error: "Choose a valid size before checkout." },
      { status: 400 },
    );
  }

  const stockPerSize = product.stockPerSize ?? DEFAULT_STOCK_PER_SIZE;
  if (resolvedSizes.length && quantity > stockPerSize) {
    return NextResponse.json(
      { error: `Maximum quantity for a size is ${stockPerSize}.` },
      { status: 400 },
    );
  }

  try {
    const checkoutUrl = await createStripeCheckoutSession(product, quantity, size);
    return NextResponse.redirect(checkoutUrl, 303);
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable." },
      { status: 502 },
    );
  }
}

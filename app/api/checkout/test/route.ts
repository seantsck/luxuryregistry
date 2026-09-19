import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.STRIPE_TEST_SECRET_KEY?.trim();
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://luxuryregistry.io").replace(/\/$/, "");

  if (!key) {
    return NextResponse.json({ error: "STRIPE_TEST_SECRET_KEY is not configured." }, { status: 503 });
  }

  const modeCheck = await fetch("https://api.stripe.com/v1/balance", {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });

  const modePayload = await modeCheck.json();

  if (!modeCheck.ok) {
    return NextResponse.json(
      { error: modePayload?.error?.message || "Stripe API key could not be verified." },
      { status: 502 },
    );
  }

  if (modePayload?.livemode !== false) {
    return NextResponse.json(
      { error: "Test checkout is disabled because Stripe is not in test mode." },
      { status: 403 },
    );
  }

  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}&mode=test`);
  body.set("cancel_url", `${site}/checkout/test`);
  body.set("customer_creation", "always");
  body.set("billing_address_collection", "auto");
  body.set("line_items[0][quantity]", "1");
  body.set("line_items[0][price_data][currency]", "usd");
  body.set("line_items[0][price_data][unit_amount]", "100");
  body.set("line_items[0][price_data][product_data][name]", "Luxury Registry Checkout Test");
  body.set("line_items[0][price_data][product_data][description]", "Test-mode checkout only — no merchandise is sold.");
  body.set("metadata[product_title]", "Luxury Registry Checkout Test");
  body.set("metadata[quantity]", "1");
  body.set("metadata[test_order]", "true");

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  const payload = await response.json();

  if (!response.ok || !payload?.url) {
    return NextResponse.json(
      { error: payload?.error?.message || "Stripe did not return a checkout URL." },
      { status: 502 },
    );
  }

  return NextResponse.redirect(payload.url, 303);
}

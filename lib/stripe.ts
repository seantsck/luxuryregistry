import type { Product } from "./product-types";

function stripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured.");
  return key;
}

export async function createStripeCheckoutSession(
  product: Product,
  quantity = 1,
  size?: string,
) {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://luxuryregistry.io").replace(/\/$/, "");
  const body = new URLSearchParams();

  body.set("mode", "payment");
  body.set("success_url", `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
  body.set("cancel_url", `${site}/product/${product.handle}`);
  body.set("client_reference_id", product.id);
  body.set("customer_creation", "always");
  body.set("billing_address_collection", "auto");
  body.set("shipping_address_collection[allowed_countries][0]", "US");
  body.set("allow_promotion_codes", "true");

  body.set("line_items[0][quantity]", String(quantity));
  body.set("line_items[0][price_data][currency]", "usd");
  body.set("line_items[0][price_data][unit_amount]", String(Math.round(product.price * 100)));
  body.set("line_items[0][price_data][product_data][name]", product.title);
  body.set(
    "line_items[0][price_data][product_data][description]",
    [product.id, product.brand, size ? `Size ${size}` : null].filter(Boolean).join(" · "),
  );
  body.set("metadata[registry_id]", product.id);
  body.set("metadata[handle]", product.handle);
  body.set("metadata[product_title]", product.title.slice(0, 500));
  body.set("metadata[quantity]", String(quantity));
  if (size) body.set("metadata[size]", size);

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || `Stripe returned ${response.status}.`);
  }

  if (!payload?.url) throw new Error("Stripe did not return a Checkout URL.");
  return payload.url as string;
}


export async function retrieveStripeCheckoutSession(sessionId: string) {
  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    {
      headers: { Authorization: `Bearer ${stripeSecretKey()}` },
      cache: "no-store",
    },
  );

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message || `Stripe returned ${response.status}.`);
  }
  return payload as {
    id: string;
    payment_status?: string;
    customer_details?: { email?: string | null; name?: string | null } | null;
    metadata?: Record<string, string>;
    amount_total?: number | null;
    currency?: string | null;
  };
}

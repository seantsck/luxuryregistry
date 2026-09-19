import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const parts = signatureHeader.split(",");
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));

  if (!timestamp || signatures.length === 0) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");

  return signatures.some((signature) => {
    try {
      const actualBuffer = Buffer.from(signature, "hex");
      return (
        actualBuffer.length === expectedBuffer.length &&
        timingSafeEqual(actualBuffer, expectedBuffer)
      );
    } catch {
      return false;
    }
  });
}

async function saveOrder(session: any) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();

  if (!supabaseUrl || !serviceKey) {
    console.warn("Supabase order persistence is not configured.");
    return;
  }

  const row = {
    stripe_session_id: session.id,
    registry_id: session.metadata?.registry_id || null,
    product_title: session.metadata?.product_title || null,
    size: session.metadata?.size || null,
    quantity: Number(session.metadata?.quantity || 1),
    amount_total: session.amount_total ?? null,
    currency: session.currency ?? null,
    payment_status: session.payment_status ?? null,
    customer_email: session.customer_details?.email ?? null,
    customer_name: session.customer_details?.name ?? null,
    shipping_name: session.shipping_details?.name ?? null,
    shipping_address: session.shipping_details?.address ?? null,
    updated_at: new Date().toISOString(),
  };

  const response = await fetch(
    `${supabaseUrl}/rest/v1/orders?on_conflict=stripe_session_id`,
    {
      method: "POST",
      headers: {
        apikey: serviceKey,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(row),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase order write failed: ${response.status} ${message}`);
  }
}

export async function POST(request: NextRequest) {
  const liveSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const testSecret = process.env.STRIPE_TEST_WEBHOOK_SECRET?.trim();
  const signature = request.headers.get("stripe-signature");

  if ((!liveSecret && !testSecret) || !signature) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  const payload = await request.text();
  const valid =
    (liveSecret ? verifyStripeSignature(payload, signature, liveSecret) : false) ||
    (testSecret ? verifyStripeSignature(payload, signature, testSecret) : false);

  if (!valid) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(payload);

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    await saveOrder(event.data.object);
  }

  return NextResponse.json({ received: true });
}

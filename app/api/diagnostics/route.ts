import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const imageBase = process.env.NEXT_PUBLIC_PRODUCT_IMAGE_BASE_URL?.replace(/\/$/, "");
  const secretKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();
  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  let stripeMode: "test" | "live" | "unknown" | null = stripeKey ? "unknown" : null;
  let stripeApiStatus: number | null = null;

  if (stripeKey) {
    try {
      const stripeResponse = await fetch("https://api.stripe.com/v1/balance", {
        headers: { Authorization: `Bearer ${stripeKey}` },
        cache: "no-store",
      });
      stripeApiStatus = stripeResponse.status;
      if (stripeResponse.ok) {
        const stripePayload = await stripeResponse.json();
        stripeMode = stripePayload?.livemode === true ? "live" : stripePayload?.livemode === false ? "test" : "unknown";
      }
    } catch {
      stripeApiStatus = -1;
    }
  }
  const stripeWebhook = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  let catalogStatus: number | null = null;
  let catalogCount: number | null = null;
  let catalogError: string | null = null;
  let sampleImageFile: string | null = null;
  let sampleImageUrl: string | null = null;
  let sampleImageStatus: number | null = null;
  let ordersApiStatus: number | null = null;

  if (supabaseUrl && secretKey) {
    try {
      const ordersResponse = await fetch(
        `${supabaseUrl}/rest/v1/orders?select=id&limit=1`,
        {
          headers: { apikey: secretKey },
          cache: "no-store",
        },
      );
      ordersApiStatus = ordersResponse.status;
    } catch {
      ordersApiStatus = -1;
    }
  }

  if (supabaseUrl && publishableKey) {
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/products?select=id,image_file,image_url&catalog_visible=eq.true&order=id.asc&limit=1000`,
        {
          headers: { apikey: publishableKey },
          cache: "no-store",
        },
      );
      catalogStatus = response.status;

      if (response.ok) {
        const rows = await response.json();
        catalogCount = Array.isArray(rows) ? rows.length : null;

        const first = Array.isArray(rows) ? rows[0] : null;
        sampleImageFile = first?.image_file || null;

        if (first?.image_url) {
          sampleImageUrl = first.image_url;
        } else if (imageBase && sampleImageFile) {
          sampleImageUrl = `${imageBase}/${encodeURIComponent(sampleImageFile)}`;
        }

        if (sampleImageUrl) {
          try {
            const imageResponse = await fetch(sampleImageUrl, {
              method: "HEAD",
              cache: "no-store",
            });
            sampleImageStatus = imageResponse.status;
          } catch {
            sampleImageStatus = -1;
          }
        }
      } else {
        catalogError = (await response.text()).slice(0, 500);
      }
    } catch (error) {
      catalogError = error instanceof Error ? error.message : "Unknown fetch error";
    }
  }

  return NextResponse.json({
    siteUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    supabaseUrlConfigured: Boolean(supabaseUrl),
    supabasePublishableKeyConfigured: Boolean(publishableKey),
    supabaseSecretKeyConfigured: Boolean(secretKey),
    imageBaseConfigured: Boolean(imageBase),
    stripeSecretConfigured: Boolean(stripeKey),
    stripeMode,
    stripeApiStatus,
    stripeWebhookConfigured: Boolean(stripeWebhook),
    supabaseHost: supabaseUrl ? new URL(supabaseUrl).host : null,
    imageHost: imageBase ? new URL(imageBase).host : null,
    catalogStatus,
    catalogCount,
    catalogError,
    sampleImageFile,
    sampleImageUrl,
    sampleImageStatus,
    ordersApiStatus,
  });
}

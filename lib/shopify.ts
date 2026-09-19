const API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION || "2026-07";

export function shopifyConfigured() {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN &&
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  );
}

export async function createShopifyCheckout(variantId: string, quantity = 1) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();

  if (!domain || !token) {
    throw new Error("Shopify checkout is not configured.");
  }

  const endpoint = `https://${domain.replace(/^https?:\/\//, "").replace(/\/$/, "")}/api/${API_VERSION}/graphql.json`;
  const query = `
    mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { id checkoutUrl }
        userErrors { field message }
        warnings { message }
      }
    }
  `;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query,
      variables: {
        input: {
          lines: [{ merchandiseId: variantId, quantity }],
          sourceName: "luxury-registry-vercel",
        },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront API returned ${response.status}.`);
  }

  const payload = await response.json();
  const errors = payload?.data?.cartCreate?.userErrors ?? [];

  if (errors.length) {
    throw new Error(errors.map((error: { message: string }) => error.message).join("; "));
  }

  const checkoutUrl = payload?.data?.cartCreate?.cart?.checkoutUrl;
  if (!checkoutUrl) throw new Error("Shopify did not return a checkout URL.");

  return checkoutUrl as string;
}

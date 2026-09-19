import type { Product } from "./products";

export type ChannelIssue =
  | "verification-pending"
  | "channel-disabled"
  | "checkout-disabled"\n  | "missing-checkout-url"\n  | "missing-image"
  | "missing-price"
  | "missing-color"
  | "missing-size"
  | "identifier-status-unknown";

export type ChannelOffer = {
  id: string;
  itemGroupId?: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  price: string;
  availability: "in stock" | "out of stock" | "preorder";
  condition: "new";
  brand: string;
  color: string;
  size?: string;
  gender: "unisex" | "male" | "female";
  ageGroup: "adult";
  gtin?: string;
  mpn?: string;
  identifierExists: boolean;
  productType: string;
};

export function channelIssues(product: Product): ChannelIssue[] {
  const issues: ChannelIssue[] = [];

  if (!product.verified) issues.push("verification-pending");
  if (!product.channelReady) issues.push("channel-disabled");
  if (!product.buyable) issues.push("checkout-disabled");\n  if (!product.checkoutUrl) issues.push("missing-checkout-url");\n  if (!product.image) issues.push("missing-image");
  if (!product.price || product.price <= 0) issues.push("missing-price");
  if (!product.colors?.trim()) issues.push("missing-color");

  if (product.department !== "Bags" && (!product.sizes || product.sizes.length === 0)) {
    issues.push("missing-size");
  }

  if (
    product.identifierExists === undefined &&
    !product.gtin &&
    !product.mpn
  ) {
    issues.push("identifier-status-unknown");
  }

  return issues;
}

export function isChannelReady(product: Product) {
  return channelIssues(product).length === 0;
}

function firstColor(colors: string) {
  return colors.split(/[·,/]/).map((v) => v.trim()).filter(Boolean)[0] || "Multicolor";
}

function sizeSlug(size: string) {
  return size.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function absoluteUrl(origin: string, value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  return new URL(value.startsWith("/") ? value : `/${value}`, origin).toString();
}

export function channelOffers(products: Product[], origin: string): ChannelOffer[] {
  return products.flatMap((product) => {
    if (!isChannelReady(product)) return [];

    const sizes = product.sizes?.length ? product.sizes : [undefined];
    const hasVariants = sizes.length > 1;

    return sizes.map((size) => ({
      id: size ? `${product.id}-${sizeSlug(size)}` : product.id,
      itemGroupId: hasVariants ? product.id : undefined,
      title: size ? `${product.title} — ${size}` : product.title,
      description: product.short,
      link: absoluteUrl(origin, `/product/${product.handle}`),
      imageLink: absoluteUrl(origin, product.image!),
      price: `${product.price.toFixed(2)} USD`,
      availability: product.availability ?? "in stock",
      condition: "new",
      brand: product.brand,
      color: firstColor(product.colors),
      size,
      gender: product.gender ?? "unisex",
      ageGroup: "adult",
      gtin: product.gtin,
      mpn: product.mpn,
      identifierExists:
        product.identifierExists ??
        Boolean(product.gtin || product.mpn),
      productType: product.type,
    }));
  });
}

export function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function xmlEscape(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

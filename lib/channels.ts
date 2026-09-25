import type { Product } from "./product-types";

export type ChannelIssue =
  | "verification-pending"
  | "channel-disabled"
  | "missing-image"
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
  additionalImageLinks: string[];
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
  if (!product.image) issues.push("missing-image");
  if (!product.price || product.price <= 0) issues.push("missing-price");
  if (!product.colors?.trim()) issues.push("missing-color");

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
  return colors.split(/[;·,/]/).map((v) => v.trim()).filter(Boolean)[0] || "Multicolor";
}

function sizeSlug(size: string) {
  return size.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function absoluteUrl(origin: string, value: string) {
  if (/^https?:\/\//i.test(value)) return value;
  return new URL(value.startsWith("/") ? value : `/${value}`, origin).toString();
}

function cleanText(value: string, maxLength: number) {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export function channelOffers(products: Product[], origin: string): ChannelOffer[] {
  return products.flatMap((product) => {
    if (!isChannelReady(product)) return [];

    const openSize = product.department !== "Bags" && (!product.sizes || product.sizes.length === 0);
    const sizes = product.sizes?.length ? product.sizes : openSize ? ["All Sizes"] : [undefined];
    const hasVariants = Boolean(product.sizes && product.sizes.length > 1);
    const imageCandidates = Array.from(
      new Set([product.image, ...(product.images ?? [])].filter((image): image is string => Boolean(image))),
    );
    const imageLink = absoluteUrl(origin, imageCandidates[0]!);
    const additionalImageLinks = imageCandidates
      .slice(1, 11)
      .map((image) => absoluteUrl(origin, image));

    return sizes.map((size) => ({
      id: size && !openSize ? `${product.id}-${sizeSlug(size)}` : product.id,
      itemGroupId: hasVariants ? product.id : undefined,
      title: cleanText(size && !openSize ? `${product.title} — ${size}` : product.title, 150),
      description: cleanText(product.short, 5000),
      link: absoluteUrl(origin, `/product/${product.handle}`),
      imageLink,
      additionalImageLinks,
      price: `${product.price.toFixed(2)} USD`,
      availability: product.availability ?? "in stock",
      condition: "new",
      brand: product.brand.trim(),
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

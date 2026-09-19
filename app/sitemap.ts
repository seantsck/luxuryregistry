import type { MetadataRoute } from "next";
import { loadCatalog } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await loadCatalog();
  const base = siteUrl();
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: "daily", priority: .9 },
    { url: `${base}/channel-readiness`, lastModified: now, changeFrequency: "daily", priority: .2 },
    ...products.map((product) => ({
      url: `${base}/product/${product.handle}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: .7,
    })),
  ];
}

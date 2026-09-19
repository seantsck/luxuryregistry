import type { Product } from "./product-types";
import { products as bundledProducts } from "./products";

type ProductRow = {
  id: string;
  handle: string;
  title: string;
  brand: string;
  product_type: string;
  department: Product["department"];
  price: number | string;
  compare_at: number | string | null;
  colors: string;
  short_description: string;
  image_file: string | null;
  image_url: string | null;
  sizes: string[] | null;
  availability: Product["availability"];
  verified: boolean;
  channel_ready: boolean;
  buyable: boolean;
  gtin: string | null;
  mpn: string | null;
  identifier_exists: boolean;
};

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    handle: row.handle,
    title: row.title,
    brand: row.brand,
    type: row.product_type,
    department: row.department,
    price: Number(row.price),
    compareAt: row.compare_at == null ? undefined : Number(row.compare_at),
    colors: row.colors,
    short: row.short_description,
    imageFile: row.image_file || undefined,
    image: row.image_url || undefined,
    sizes: row.sizes || undefined,
    availability: row.availability,
    verified: row.verified,
    channelReady: row.channel_ready,
    buyable: row.buyable,
    gtin: row.gtin || undefined,
    mpn: row.mpn || undefined,
    identifierExists: row.identifier_exists,
  };
}

export async function loadCatalog(): Promise<Product[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !key) return bundledProducts;

  try {
    const response = await fetch(
      `${url}/rest/v1/products?select=*&catalog_visible=eq.true&order=id.asc`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        next: { revalidate: 60 },
      },
    );

    if (!response.ok) {
      console.error("Supabase catalog read failed", response.status);
      return bundledProducts;
    }

    const rows = (await response.json()) as ProductRow[];
    return rows.length ? rows.map(rowToProduct) : bundledProducts;
  } catch (error) {
    console.error("Supabase catalog unavailable; using bundled catalog", error);
    return bundledProducts;
  }
}

import type { Product } from "./product-types";

export const DEFAULT_STOCK_PER_SIZE = 5;

export function defaultSizesForProduct(
  product: Pick<Product, "department" | "sizes">,
): string[] {
  if (product.sizes?.length) return product.sizes;

  switch (product.department) {
    case "Tops":
    case "Outerwear":
      return ["S", "M", "L", "XL", "XXL"];
    case "Denim":
      return ["28", "30", "32", "34", "36", "38", "40"];
    case "Footwear":
      return ["US 5", "US 6", "US 7", "US 8", "US 9", "US 10", "US 11", "US 12", "US 13"];
    case "Bags":
      return [];
  }
}

export function stockForSize() {
  return DEFAULT_STOCK_PER_SIZE;
}

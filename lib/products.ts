export type Product = {
  id: string;
  handle: string;
  title: string;
  brand: string;
  type: string;
  department: "Tops" | "Outerwear" | "Denim" | "Footwear" | "Bags";
  price: number;
  compareAt?: number;
  colors: string;
  short: string;

  // Sales-channel fields are intentionally optional. A product is exported
  // only when verification, checkout, imagery, identifiers, and size data
  // are complete enough for marketplace ingestion.
  image?: string;
  sizes?: string[];
  gender?: "unisex" | "male" | "female";
  availability?: "in stock" | "out of stock" | "preorder";
  verified?: boolean;
  channelReady?: boolean;
  buyable?: boolean;
  gtin?: string;
  mpn?: string;
  identifierExists?: boolean;
};

export const products: Product[] = [
  { id:"LR-0001", handle:"bape-college-tee-lr-0001", title:"BAPE College Tee", brand:"BAPE", type:"Graphic T-Shirt", department:"Tops", price:97.99, compareAt:125, colors:"White · Black · Beige · Red · Brown · Navy", short:"A classic College graphic built around the Ape Head and arched wordmark." },
  { id:"LR-0073", handle:"ugg-classic-ultra-mini-platform-boot-lr-0073", title:"UGG Classic Ultra Mini Platform Boot", brand:"UGG", type:"Platform Ankle Boot", department:"Footwear", price:101.99, compareAt:175, colors:"Chestnut", short:"A compact platform boot silhouette with plush cold-weather construction." },
  { id:"LR-0101", handle:"bape-wgm-monogram-shark-full-zip-hoodie-olive-lr-0101", title:"BAPE WGM Monogram Shark Full Zip Hoodie — Olive", brand:"BAPE", type:"Full-Zip Shark Hoodie", department:"Outerwear", price:322.99, compareAt:475, colors:"Olive · Cream", short:"Full-zip Shark construction with WGM detailing and monogram treatment." },
  { id:"LR-0141", handle:"chrome-hearts-multicolor-cross-graphic-tee-black-white-lr-0141", title:"Chrome Hearts Multicolor Cross Graphic Tee", brand:"Chrome Hearts", type:"Graphic T-Shirt", department:"Tops", price:399.99, colors:"White · Black · Blue · Gold", short:"Cross-driven graphic tee with a multicolor ornamental treatment." },
  { id:"LR-0187", handle:"hellstar-red-h-star-lightning-logo-tee-lr-0187", title:"Hellstar Red H-Star Lightning Logo Tee", brand:"Hellstar", type:"Graphic T-Shirt", department:"Tops", price:124.99, compareAt:250, colors:"Red · Black · White", short:"High-contrast H-Star lightning artwork on a streetwear graphic tee." },
  { id:"LR-0254", handle:"amiri-red-logo-grey-distressed-jeans-lr-0254", title:"AMIRI Red Logo Grey Distressed Jeans", brand:"AMIRI", type:"Denim Jeans", department:"Denim", price:427.99, compareAt:950, colors:"Grey · Red", short:"Grey distressed denim with bold red logo treatment and stacked proportions." },
  { id:"LR-0303", handle:"gallery-dept-olive-carpenter-jeans-lr-0303", title:"Gallery Dept Olive Carpenter Jeans", brand:"Gallery Dept", type:"Denim Jeans", department:"Denim", price:501.99, compareAt:1195, colors:"Olive · Khaki", short:"Painter-informed carpenter denim with a relaxed utilitarian silhouette." },
  { id:"LR-0415", handle:"louis-vuitton-x-murakami-multicolor-monogram-kitten-heel-mules-lr-0415", title:"Louis Vuitton x Murakami Multicolor Monogram Kitten-Heel Mules", brand:"Louis Vuitton / Murakami", type:"Kitten-Heel Mule Sandals", department:"Footwear", price:554.99, compareAt:1110, colors:"White · Black · Multicolor", short:"Multicolor monogram mule silhouette with a low kitten heel." },
  { id:"LR-0422", handle:"gucci-interlocking-g-toe-post-sandals-multi-color-lr-0422", title:"Gucci Interlocking G Toe-Post Sandals — Multi-Color", brand:"Gucci", type:"Toe-Post Sandals", department:"Footwear", price:444.99, compareAt:890, colors:"White · Pink · Red · Black · Green · Brown", short:"Minimal toe-post sandal profile finished with Interlocking G hardware." },
  { id:"LR-0481", handle:"balenciaga-technical-runner-sneakers-black-lr-0481", title:"Balenciaga Technical Runner Sneakers — Black", brand:"Balenciaga", type:"Technical Sneakers", department:"Footwear", price:594.99, compareAt:1190, colors:"Black", short:"Layered technical runner construction with an all-black finish." },
  { id:"LR-0487", handle:"goyard-chevron-v-appliqu-tote-black-lr-0487", title:"Goyard Chevron V-Appliqué Tote — Black", brand:"Goyard", type:"Tote Bag", department:"Bags", price:899.99, colors:"Black · Grey", short:"Structured tote profile with chevron patterning and contrasting V appliqué." },
  { id:"LR-0497", handle:"coach-mini-backpack-multi-color-display-lr-0497", title:"Coach Mini Backpack — Multi-Color Display", brand:"Coach", type:"Mini Backpack", department:"Bags", price:227.99, compareAt:350, colors:"Black · White · Pink · Beige", short:"Compact signature-canvas backpack family shown across multiple colorways." },
  { id:"LR-0530", handle:"nike-tech-fleece-full-zip-hoodie-multi-color-lr-0530", title:"Nike Tech Fleece Full-Zip Hoodie — Multi-Color", brand:"Nike", type:"Full-Zip Hoodie", department:"Outerwear", price:100.99, compareAt:155, colors:"Charcoal · Beige · Mint · Grey · Black", short:"Clean technical fleece full-zip hoodie offered across neutral and muted tones." },
  { id:"LR-0551", handle:"ugg-woven-tassel-platform-slipper-multi-color-lr-0551", title:"UGG Woven-Tassel Platform Slipper — Multi-Color", brand:"UGG", type:"Platform Shearling Slipper", department:"Footwear", price:89.99, compareAt:150, colors:"Grey · Sand · Chestnut", short:"Platform slipper with plush lining and a woven tassel strap detail." },
  { id:"LR-0576", handle:"amiri-light-wash-stacked-jeans-subtle-knee-distress-lr-0576", title:"AMIRI Light-Wash Stacked Jeans — Subtle Knee Distress", brand:"AMIRI", type:"Denim Jeans", department:"Denim", price:337.99, compareAt:750, colors:"Light Blue", short:"Light-wash stacked denim with restrained knee abrasion and vintage fading." },
  { id:"LR-0600", handle:"purple-brand-dripping-logo-jeans-black-white-lr-0600", title:"Purple Brand Dripping Logo Jeans — Black / White", brand:"Purple Brand", type:"Denim Jeans", department:"Denim", price:177.99, compareAt:395, colors:"Black · White", short:"Slim denim family with oversized dripping typographic leg graphics." },
  { id:"LR-0604", handle:"purple-brand-spray-logo-jeans-light-wash-lr-0604", title:"Purple Brand Spray Logo Jeans — Light Wash", brand:"Purple Brand", type:"Denim Jeans", department:"Denim", price:177.99, compareAt:395, colors:"Light Blue · Black", short:"Light-wash denim with a sprayed oversized logo treatment down the leg." },
  { id:"LR-0620", handle:"hellstar-war-ready-football-graphic-tee-cream-lr-0620", title:"Hellstar War Ready Football Graphic Tee — Cream", brand:"Hellstar", type:"Graphic T-Shirt", department:"Tops", price:124.99, compareAt:250, colors:"Cream · Red · Black · Green", short:"Football helmet graphics paired with War Ready and Path to Paradise typography." },
  { id:"LR-0622", handle:"gallery-dept-reconstructed-patchwork-flare-jeans-blue-lr-0622", title:"Gallery Dept Reconstructed Patchwork Flare Jeans — Blue", brand:"Gallery Dept-style", type:"Denim Jeans", department:"Denim", price:501.99, compareAt:1195, colors:"Light Blue · Indigo", short:"Reconstructed multi-panel denim with contrasting indigo patches and a flared leg." },
  { id:"LR-0625", handle:"gallery-dept-doodle-graphic-flare-jeans-light-blue-lr-0625", title:"Gallery Dept Doodle Graphic Flare Jeans — Light Blue", brand:"Gallery Dept-style", type:"Denim Jeans", department:"Denim", price:417.99, compareAt:995, colors:"Light Blue · Multicolor", short:"Light-blue flare denim with scattered multicolor doodle-style graphics." }
];

export function getProduct(handle: string) {
  return products.find((product) => product.handle === handle);
}

export function money(value?: number) {
  if (value == null) return "Price on request";
  return new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:0 }).format(value);
}

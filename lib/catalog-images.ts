const IMAGE_VERSION = "20260925b";

const TWO_IMAGE_IDS = new Set(
  "3,4,6,8,13,15,18,19,21,22,23,24,26,27,28,32,34,35,36,38,40,42,43,45,47,49,51,53,58,60,63,113,127,128,131,215,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,296,297,327,328,329,331,332,333,335,336,337,339,341,342,343,346,347,348,349,351,353,354,355,357,360,361,373,374,375,377,378,379,380,382,385,388,389,391,392,393,394,396,398,399,400,401,406,409,413,414,485,493,502,503,506,508,510,513,514,516,517,555,558,576,577,578,579,580,581,582,583,584,585,587,588,589,590,591,592,593,594,596,597,598,599,600,601,602,603,604,605,606,607,608,609,610,611,612,613,614,615,616,617,618,619,623,624"
    .split(",")
    .map(Number),
);

const SPECIAL_GALLERY_COUNTS: Record<number, number> = {
  92: 3,
  93: 3,
  95: 3,
  96: 3,
  98: 3,
  99: 3,
  100: 3,
  102: 3,
  104: 3,
  109: 5,
  121: 4,
  124: 3,
  126: 3,
  494: 4,
  497: 6,
  498: 5,
  552: 3,
  553: 3,
  561: 4,
};

function catalogNumber(id: string) {
  const match = /^LR-(\d{4})$/.exec(id);
  return match ? Number(match[1]) : undefined;
}

function hasCorrectedAssets(id: string) {
  const n = catalogNumber(id);
  return n !== undefined && ((n >= 1 && n <= 300) || (n >= 326 && n <= 625));
}

function galleryCount(id: string) {
  const n = catalogNumber(id);
  if (n === undefined) return 1;
  return SPECIAL_GALLERY_COUNTS[n] ?? (TWO_IMAGE_IDS.has(n) ? 2 : 1);
}

function publicImageUrl(imageFile?: string | null) {
  if (!imageFile) return undefined;
  const base = process.env.NEXT_PUBLIC_PRODUCT_IMAGE_BASE_URL?.replace(/\/$/, "");
  return base ? `${base}/${encodeURIComponent(imageFile)}` : undefined;
}

function versioned(url?: string) {
  if (!url) return undefined;
  return `${url}${url.includes("?") ? "&" : "?"}v=${IMAGE_VERSION}`;
}

export function catalogImageUrls(
  id: string,
  imageFile?: string | null,
  explicitImageUrl?: string | null,
): string[] {
  const corrected = hasCorrectedAssets(id);
  const publicPrimary = publicImageUrl(imageFile);
  const primary = corrected
    ? versioned(publicPrimary || explicitImageUrl || undefined)
    : explicitImageUrl || publicPrimary;

  if (!primary) return [];

  const images = [primary];
  const count = corrected ? galleryCount(id) : 1;

  for (let i = 2; i <= count; i += 1) {
    const suffix = String(i).padStart(2, "0");
    const gallery = publicImageUrl(`${id}_gallery_${suffix}.jpg`);
    if (gallery) images.push(versioned(gallery)!);
  }

  return images;
}

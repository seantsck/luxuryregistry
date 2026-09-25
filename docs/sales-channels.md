# Luxury Registry sales channels

Live application endpoints after deployment:

- `/feeds/google.xml` — Google Merchant Center RSS 2.0 product data
- `/feeds/meta.csv` — Meta Commerce catalog CSV
- `/feeds/pinterest.csv` — Pinterest Catalogs CSV
- `/feeds/microsoft.tsv` — Microsoft Merchant Center TSV
- `/api/channels/status` — compact machine-readable eligibility summary
- `/api/channels/status?details=1` — full per-product blocker detail
- `/channel-readiness` — human-readable readiness dashboard

Products are excluded from every sales feed until they have verified product documentation,
a resolved brand/authenticity status, a product image, required size/color data, pricing,
manufacturer identifier status, and `channel_ready=true`.

The storefront checkout is validated independently. The legacy `buyable` row flag is not
used as a feed blocker because the live checkout route accepts catalog products by product ID.

Do not mark a product `verified` or `channel_ready` based only on supplier imagery.
Verification should be supported by supplier documentation appropriate to the product and brand.

Google feed items include up to ten additional product/gallery images when available.

# Luxury Registry sales channels

Live application endpoints after deployment:

- `/feeds/google.xml` — Google Merchant Center RSS 2.0 product data
- `/feeds/meta.csv` — Meta Commerce catalog CSV
- `/feeds/pinterest.csv` — Pinterest Catalogs CSV
- `/feeds/microsoft.tsv` — Microsoft Merchant Center TSV
- `/api/channels/status` — machine-readable eligibility report
- `/channel-readiness` — human-readable readiness dashboard

Products are excluded from every sales feed until they have verified documentation,
a live checkout URL, a product image, required size/color data, pricing, and
manufacturer identifier status. This prevents premature marketplace ingestion.

# Luxury Registry

Editorial luxury/streetwear registry built with Next.js 16 and designed for Vercel.

## Preview build

- 625 products are reconciled in the master Luxury Registry catalog.
- 20 representative registrations are included in this first deploy for design/UX review.
- Search, department filters, sorting and dynamic product pages are implemented.
- Competitive pricing reflects the current $70 flat-cost model.
- Commerce is intentionally disabled while supplier authorization/authenticity remains unverified.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Import `seantsck/luxuryregistry` into Vercel. No environment variables are required for this preview.

## Next

Move the complete 625-product catalog and image library to Supabase/Object Storage, then enable only verified products for commerce.


## Sales channels

The storefront exposes channel feeds, but products are exported only after they clear the shared commerce gate:

- verified supplier authorization/authenticity
- channelReady=true
- buyable=true and Stripe checkout configured
- product image present
- valid price and color
- sizes for non-bag products
- GTIN/MPN present, or identifierExists explicitly set

Feed endpoints:

- Google Merchant Center: `/feeds/google.xml`
- Meta Commerce Manager: `/feeds/meta.csv`
- Pinterest Catalogs: `/feeds/pinterest.csv`
- Microsoft Merchant Center: `/feeds/microsoft.tsv`
- Readiness API: `/api/channels/status`
- Human dashboard: `/channel-readiness`

While all products remain unverified previews, the feeds intentionally contain zero offers. This avoids marketplace disapprovals before checkout, imagery, variant data and brand documentation are ready.

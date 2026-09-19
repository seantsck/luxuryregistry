# Supabase catalog setup

Luxury Registry uses Supabase as the catalog database and image origin, while Vercel serves the Next.js storefront.

## Database

Apply `supabase/migrations/0001_catalog.sql` to the dedicated Luxury Registry project.

The migration creates:

- `products` — public-readable catalog rows with verification and commerce gates
- `orders` — private Stripe order records
- RLS on both tables
- public SELECT access only for catalog-visible products
- no public write access

## Storage

Create one **public** Storage bucket named `product-images`.

Upload the 625 standardized hero images using their existing filenames, for example:

`LR-0001_6d400c8a_hero.jpg`

Then set:

`NEXT_PUBLIC_PRODUCT_IMAGE_BASE_URL=https://<project-ref>.supabase.co/storage/v1/object/public/product-images`

Public buckets are appropriate for storefront product imagery. Upload/delete operations still remain protected by Storage access controls.

## Vercel environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_PRODUCT_IMAGE_BASE_URL`
- `STRIPE_SECRET_KEY`

The site currently keeps a bundled 625-item fallback catalog, so an unavailable Supabase API will not take the storefront offline.

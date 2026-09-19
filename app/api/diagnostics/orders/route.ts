import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const secretKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();

  if (!supabaseUrl || !secretKey) {
    return NextResponse.json({ configured:false }, { status:503 });
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/orders?select=id,stripe_session_id,registry_id,product_title,payment_status,created_at&order=created_at.desc&limit=5`,
      {
        headers: { apikey: secretKey },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { configured:true, status:response.status },
        { status:502 },
      );
    }

    const rows = await response.json();
    const safe = Array.isArray(rows) ? rows.map((row:any) => ({
      id: row.id,
      stripeSession: typeof row.stripe_session_id === "string" ? row.stripe_session_id.slice(0,18) + "…" : null,
      registryId: row.registry_id,
      productTitle: row.product_title,
      paymentStatus: row.payment_status,
      createdAt: row.created_at,
    })) : [];

    return NextResponse.json({
      configured:true,
      count:safe.length,
      latest:safe,
    });
  } catch {
    return NextResponse.json({ configured:true, status:-1 }, { status:502 });
  }
}

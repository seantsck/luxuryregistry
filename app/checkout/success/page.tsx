import Link from "next/link";
import { retrieveStripeCheckoutSession } from "@/lib/stripe";

type Props = {
  searchParams: Promise<{ session_id?: string; mode?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id, mode } = await searchParams;

  if (!session_id) {
    return (
      <main style={{ maxWidth:760, margin:"0 auto", padding:"96px 24px" }}>
        <p className="eyebrow">CHECKOUT</p>
        <h1>Order status unavailable.</h1>
        <p>No Stripe session was supplied.</p>
        <Link href="/shop">Return to the register →</Link>
      </main>
    );
  }

  try {
    const stripeMode = mode === "test" ? "test" : "live";
    const session = await retrieveStripeCheckoutSession(session_id, stripeMode);
    const paid = session.payment_status === "paid";

    return (
      <main style={{ maxWidth:760, margin:"0 auto", padding:"96px 24px" }}>
        <p className="eyebrow">LUXURY REGISTRY · ORDER</p>
        <h1>{paid ? "Payment confirmed." : "Payment received for processing."}</h1>
        <p>
          Registry item: <strong>{session.metadata?.registry_id || "Order"}</strong>
          {session.metadata?.size ? <> · Size {session.metadata.size}</> : null}
        </p>
        {session.customer_details?.email ? <p>Confirmation: {session.customer_details.email}</p> : null}
        <p>Stripe session: {session.id}</p>
        <Link href="/shop">Continue browsing →</Link>
      </main>
    );
  } catch {
    return (
      <main style={{ maxWidth:760, margin:"0 auto", padding:"96px 24px" }}>
        <p className="eyebrow">CHECKOUT</p>
        <h1>We’re confirming your payment.</h1>
        <p>Your payment session exists, but the confirmation service could not be reached right now.</p>
        <Link href="/shop">Return to the register →</Link>
      </main>
    );
  }
}

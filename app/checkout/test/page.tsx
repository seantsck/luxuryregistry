import Link from "next/link";

export default function CheckoutTestPage() {
  return (
    <main style={{ maxWidth:760, margin:"0 auto", padding:"96px 24px" }}>
      <p className="eyebrow">COMMERCE TEST</p>
      <h1>Stripe test checkout.</h1>
      <p style={{ lineHeight:1.7, opacity:.72 }}>
        This creates a $1.00 Stripe test-mode Checkout Session. No Luxury Registry merchandise
        is sold and no real card is charged. The test is only enabled when the server is using
        a Stripe <code>sk_test_</code> secret key.
      </p>
      <a className="disabled-buy" href="/api/checkout/test">OPEN STRIPE TEST CHECKOUT</a>
      <p style={{ marginTop:24 }}><Link href="/shop">← Return to the register</Link></p>
    </main>
  );
}

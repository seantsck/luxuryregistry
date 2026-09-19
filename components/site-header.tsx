import Link from "next/link";

export function SiteHeader() {
  return (
    <>
      <div className="verification-strip">PRIVATE CATALOG PREVIEW · AUTHORIZATION VERIFICATION IN PROGRESS</div>
      <header className="site-header">
        <Link href="/" className="wordmark">LUXURY <span>REGISTRY</span></Link>
        <nav className="nav-links">
          <Link href="/shop">The Register</Link>
          <Link href="/#about">About</Link>
        </nav>
        <Link href="/shop" className="header-count">625 CATALOGED</Link>
      </header>
    </>
  );
}

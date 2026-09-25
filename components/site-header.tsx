import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="wordmark">LUXURY <span>REGISTRY</span></Link>
      <nav className="nav-links">
        <Link href="/shop">The Register</Link>
        <Link href="/#about">About</Link>
      </nav>
      <Link href="/shop" className="header-count">625 CATALOGED</Link>
    </header>
  );
}

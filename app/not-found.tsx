import Link from "next/link";

export default function NotFound() {
  return <main className="not-found"><span>404 / UNREGISTERED</span><h1>Object not found.</h1><Link href="/shop">Return to the register →</Link></main>;
}

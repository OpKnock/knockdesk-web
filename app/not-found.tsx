import Link from "next/link";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="kd-container" style={{ paddingTop: "128px", paddingBottom: "128px", textAlign: "center" }}>
        <p style={{ fontSize: "5rem", fontWeight: 200, color: "var(--kd-acc)", lineHeight: 1, marginBottom: "16px" }}>404</p>
        <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>Page not found</h1>
        <p style={{ marginBottom: "32px", marginInline: "auto" }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="kd-btn kd-btn-primary" style={{ textDecoration: "none" }}>
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}

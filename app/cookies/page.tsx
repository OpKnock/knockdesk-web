import type { Metadata } from "next";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { BackToTop } from "../components/BackToTop";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "KnockDesk cookie policy. This website sets no cookies and runs no third-party trackers.",
  alternates: { canonical: "/cookies" },
};

export default function Cookies() {
  return (
    <>
      <Nav />
      <main id="main" className="kd-container kd-legal" style={{ paddingTop: "96px", paddingBottom: "96px", maxWidth: "720px" }}>
        <Breadcrumbs trail={[{ label: "Cookie Policy" }]} />
        <h1 style={{ marginBottom: "8px", fontSize: "2.5rem" }}>Cookie Policy</h1>
        <p style={{ marginBottom: "48px", fontSize: "0.875rem", color: "var(--kd-faint)" }}>
          Effective: October 17, 2026. Contact: wagdemehul@gmail.com
        </p>

        <h2>No cookies are set</h2>
        <p>
          This website does not set cookies, does not use local storage for tracking, and does not embed
          third-party tracking scripts. There is no cookie banner because there is nothing to consent to.
        </p>

        <h2>Fonts</h2>
        <p>
          The Inter typeface is self-hosted at build time through Next.js. Font files are served from this
          website&apos;s own domain, so Google receives no request and learns nothing about your visit.
        </p>

        <h2>Outbound links</h2>
        <p>
          Download and source links point to GitHub. Following them is a normal navigation between sites;
          GitHub handles those pages under its own privacy policy.
        </p>

        <h2>If analytics is ever added</h2>
        <p>
          If this site later adds privacy-friendly, cookieless analytics, this page will be updated first
          and the change will be visible on this page with a new effective date.
        </p>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

import type { Metadata } from "next";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "KnockDesk cookie policy. This website sets no cookies and runs no third-party trackers.",
  alternates: { canonical: "/cookies" },
};

export default function Cookies() {
  return (
    <>
      <main id="main" className="kd-container kd-legal kd-page">
        <Breadcrumbs trail={[{ label: "Cookie Policy" }]} />
        <h1 data-reveal="split">Cookie Policy</h1>
        <p className="kd-meta">
          Effective: October 17, 2026. Contact: wagdemehul@gmail.com
        </p>

        <h2>No cookies are set</h2>
        <p>
          This website does not set cookies, does not use local storage for tracking, and does not embed
          third-party tracking scripts. The small notice at the bottom of the page only tells you this. Clicking
          &quot;Got it&quot; saves that choice, and the light or dark mode you pick, in your browser&apos;s local storage so they are remembered. Nothing is sent anywhere.
        </p>

        <h2>Fonts</h2>
        <p>
          The Inter and Space Grotesk typefaces are self-hosted and bundled with this website. Font files are served from this
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
    </>
  );
}

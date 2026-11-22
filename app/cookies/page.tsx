import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { EMAIL } from "../lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "KnockDesk cookie policy. No cookies, two local preferences, and optional cookieless analytics.",
  alternates: { canonical: "/cookies" },
};

export default function Cookies() {
  return (
    <>
      <main id="main" className="kd-container kd-legal kd-page">
        <Breadcrumbs trail={[{ label: "Cookie Policy" }]} />
        <h1 data-reveal="split">Cookie Policy</h1>
        <p className="kd-meta">
          Effective: October 20, 2026. Last updated: November 21, 2026.
          <br />
          Contact: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>

        <h2>Summary</h2>
        <p>
          This website sets no cookies. It keeps two preferences in your
          browser&apos;s local storage, loads its fonts and images from its own
          domain, and has no user accounts or advertising scripts. If the site
          is deployed with the optional Plausible integration, that analytics is
          cookieless and is described below.
        </p>

        <h2>No cookies are set</h2>
        <p>
          There is no cookie on this site, not for analytics, advertising, or
          session management. If you open your browser&apos;s developer tools
          and look at Application, then Storage, then Cookies, the list will be
          empty for this domain.
        </p>

        <h2>What is stored in your browser instead</h2>
        <p>
          Two small preferences are kept in your browser&apos;s local storage.
          Local storage is not a cookie: it is not sent with any request, it is
          not readable by any other site, and it expires only when you clear
          it.
        </p>
        <ul>
          <li>
            <strong><code>kd-theme</code></strong> &mdash; whether you chose
            the light or the dark theme. It stores one word, either
            <code>light</code> or <code>dark</code>, so the page loads in the
            colour you picked instead of flashing the other one first.
          </li>
          <li>
            <strong><code>kd-notice</code></strong> &mdash; that you have
            dismissed the notice at the bottom of the page. It stores a single
            <code>1</code> so the notice does not reappear on every page you
            visit.
          </li>
        </ul>
        <p>
          Neither value contains information about you, and neither leaves your
          browser.
        </p>

        <h2>Analytics</h2>
        <p>
          The site supports optional, cookieless analytics through Plausible.
          Analytics is active only when the deployment sets
          <code>NEXT_PUBLIC_PLAUSIBLE_DOMAIN</code>. When active, Plausible
          receives a page-view request without setting a cookie or building a
          cross-site profile. When the variable is unset, no analytics request
          is sent.
        </p>

        <h2>Fonts</h2>
        <p>
          The Inter and Space Grotesk typefaces are self-hosted and bundled with
          this website. Font files are served from this website&apos;s own
          domain, so no font provider receives a request about your visit.
        </p>

        <h2>Images and video</h2>
        <p>
          The screenshots on this site are stored on this site. Nothing is
          loaded from a third-party image host, so no third party sees when you
          looked at a page.
        </p>

        <h2>Outbound links</h2>
        <p>
          Download and source links point to GitHub. Following them is a normal
          navigation between sites; GitHub handles those pages under its own
          privacy policy, which is out of our control. We do not send you
          there with any identifier attached.
        </p>

        <h2>The contact form</h2>
        <p>
          The form has two modes. Without a configured endpoint it opens your
          own mail client with the message you wrote, addressed to{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. If the deployment sets
          <code>NEXT_PUBLIC_FORM_ENDPOINT</code>, the form posts your name,
          email, and message to that endpoint so we can reply. In either case,
          the message reaches us only because you chose to send it, and it is
          handled under the <Link href="/privacy">privacy policy</Link>.
        </p>

        <h2>The KnockDesk application</h2>
        <p>
          The desktop app is separate from this website and has its own storage.
          It keeps settings, chats, memories, and API keys in local files or
          protected storage on your own disk, and it sets no cookies. Connected
          features can send data to services you enable; details are in the{" "}
          <Link href="/privacy">privacy policy</Link>.
        </p>

        <h2>How to clear what is stored</h2>
        <p>
          Clearing site data for this domain in your browser settings removes
          the theme preference and the dismissed notice. No cookie is set, so
          there is nothing else to clear in your browser.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy write to{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      </main>
    </>
  );
}

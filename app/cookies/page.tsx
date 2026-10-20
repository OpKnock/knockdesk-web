import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { EMAIL } from "../lib/site";

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
          Effective: October 20, 2026. Last updated: October 20, 2026.
          <br />
          Contact: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>

        <h2>Summary</h2>
        <p>
          This website sets no cookies. It runs no third-party trackers, embeds
          no advertising or social scripts, and collects no analytics. Nothing
          about your visit is written to a server, because the site has no
          server-side application to write to.
        </p>

        <h2>No cookies are set</h2>
        <p>
          There is no cookie on this site, not for analytics, not for
          advertising, and not for session management. If you open your
          browser&apos;s developer tools and look at Application, then Storage,
          then Cookies, the list will be empty for this domain.
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

        <h2>Fonts</h2>
        <p>
          The Inter and Space Grotesk typefaces are self-hosted and bundled with
          this website. Font files are served from this website&apos;s own
          domain, so no font provider receives a request and learns nothing
          about your visit.
        </p>

        <h2>Images and video</h2>
        <p>
          The screenshots on this site are stored on this site. Nothing is
          loaded from a third-party image host, so no third party sees when
          you looked at a page.
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
          The form does not submit to a server. It opens your own mail client
          with the message you wrote, addressed to{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. The message reaches us only
          because you chose to send it, and it is handled under the{" "}
          <Link href="/privacy">privacy policy</Link>.
        </p>

        <h2>The KnockDesk application</h2>
        <p>
          The desktop app is a separate thing from this website and has its own
          storage. It keeps your settings, chats, memories, and API keys in
          plain files on your own disk, and it sets no cookies. It has no
          network connection to us at all. The{" "}
          <Link href="/privacy">privacy policy</Link> covers the app in full.
        </p>

        <h2>If analytics is ever added</h2>
        <p>
          If this site later adds privacy-friendly, cookieless analytics, this
          page will be updated first and the change will be visible on this
          page with a new effective date. Nothing that tracks you across
          websites will be added without saying so here first.
        </p>

        <h2>How to clear what is stored</h2>
        <p>
          Clearing site data for this domain in your browser settings removes
          the theme preference and the dismissed notice. Nothing else is
          stored, so there is nothing else to clear.
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

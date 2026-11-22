import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { EMAIL, GITHUB } from "../lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "KnockDesk terms of service. Free, open source, Apache-2.0 licensed.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <>
      <main id="main" className="kd-container kd-legal kd-page">
        <Breadcrumbs trail={[{ label: "Terms of Service" }]} />
        <h1 data-reveal="split">Terms of Service</h1>
        <p className="kd-meta">
          Effective: October 20, 2026. Last updated: October 20, 2026.
          <br />
          Contact: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>

        <h2>1. Acceptance</h2>
        <p>
          By downloading, installing, or using KnockDesk, you agree to these
          terms. If you do not agree with them, do not use the software. If you
          use KnockDesk on behalf of an organisation, you confirm you have the
          authority to accept these terms for that organisation.
        </p>

        <h2>2. The licence</h2>
        <p>
          KnockDesk is free and open source software licensed under the Apache
          License 2.0. You may use, study, modify, and distribute it under the
          terms of that licence. The full text is in the LICENSE file in the{" "}
          <a href={GITHUB} rel="noopener noreferrer">source repository</a>, and
          that licence governs your rights to the code. These terms add the
          rules for using the compiled application and this website.
        </p>
        <p>
          The KnockDesk name and logo are the property of OpKnock. The licence
          grants you rights to the code, not to the marks. You may use the
          marks to refer to the unmodified project. You may not use them in a
          way that suggests an endorsement or an official build of a modified
          version.
        </p>

        <h2>3. What KnockDesk is</h2>
        <p>
          KnockDesk is a desktop assistant that runs on your own computer. It
          connects to third-party AI providers that you configure with your own
          API keys. It is provided for personal and professional use, and it is
          not a hosted service: there is no account to create, no subscription,
          and no server operated by the project.
        </p>

        <h2>4. Your responsibilities</h2>
        <ul>
          <li>
            You are responsible for your own AI provider API keys, for keeping
            them confidential, and for the usage costs those keys incur.
          </li>
          <li>
            You are responsible for complying with your AI provider&apos;s
            terms of service and for the lawfulness of what you send to them.
          </li>
          <li>
            You are responsible for the content you generate with KnockDesk,
            for what you do with it, and for any claims made about it.
          </li>
          <li>
            You are responsible for keeping your own data backed up. The app
            does not sync your data anywhere.
          </li>
          <li>
            You are responsible for complying with the law that applies to you,
            including employment, privacy, and regulatory requirements for
            whatever you do with the output.
          </li>
          <li>
            You may not use KnockDesk to violate any law, to produce or
            distribute malicious software, or to infringe the rights of others.
          </li>
        </ul>

        <h2>5. Acceptable use</h2>
        <p>
          You may not use KnockDesk to break the law, to generate harmful
          content, to harass or deceive people, or to infringe intellectual
          property rights. You may not attempt to disable, bypass, or reverse
          engineer the integrity and encryption protections in the application,
          except where that restriction is prohibited by law. You may not
          redistribute a modified build under the KnockDesk name in a way that
          misrepresents its origin.
        </p>

        <h2>6. Third-party services</h2>
        <p>
          KnockDesk can connect to third-party AI providers, such as Google
          Gemini, OpenRouter, Groq, OpenAI, and Moonshot, using your own keys.
          Your use of those services is governed by their respective terms,
          privacy policies, and pricing. KnockDesk does not control those
          services, is not responsible for their availability, accuracy, or
          billing, and makes no warranty about them.
        </p>
        <p>
          Downloads are hosted on GitHub under GitHub&apos;s own terms. If you
          install a third-party build of KnockDesk rather than one published on
          the official releases page, these terms may not cover it.
        </p>

        <h2>7. No warranty</h2>
        <p>
          KnockDesk is provided &quot;as is&quot; and &quot;as available&quot;,
          without warranty of any kind, whether express or implied, including
          the implied warranties of merchantability, fitness for a particular
          purpose, and non-infringement. We do not warrant that the software
          will be uninterrupted, error-free, or free of harmful components, or
          that any output will be accurate, safe, or fit for any purpose.
        </p>
        <p>
          AI-generated responses may be inaccurate, biased, or incomplete, and
          should not be relied upon for medical, legal, financial, or safety
          decisions. Verify important information independently.
        </p>

        <h2>8. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, the authors and contributors
          shall not be liable for any indirect, incidental, special,
          consequential, exemplary, or punitive damages, or for any loss of
          data, profits, revenue, goodwill, or use, arising out of or related
          to your use of KnockDesk or this website, whether in contract, tort,
          negligence, strict liability, or otherwise, even if the possibility
          of such damages was known.
        </p>
        <p>
          Where liability cannot be excluded, it is limited to the greater of
          the amount you paid for the software, which is zero, or fifty United
          States dollars.
        </p>
        <p>
          Nothing in these terms excludes or limits liability for death or
          personal injury caused by negligence, for fraud, or for anything else
          that cannot lawfully be excluded.
        </p>

        <h2>9. Indemnity</h2>
        <p>
          You agree to indemnify and hold harmless the authors and contributors
          of KnockDesk against any claim, demand, loss, or expense, including
          reasonable legal fees, arising from your use of the software or your
          breach of these terms.
        </p>

        <h2>10. Security and local data</h2>
        <p>
          The application encrypts its protected data at rest and verifies the
          integrity of its shipped modules against a signed manifest before
          using them. These protections raise the cost of tampering; they do
          not make the software invulnerable. You remain responsible for the
          security of your own device, your operating system account, and your
          API keys. The{" "}
          <Link href="/privacy">privacy policy</Link> describes what the app
          stores and what it transmits.
        </p>

        <h2>11. Refunds and charges</h2>
        <p>
          KnockDesk is free software. There are no charges, subscriptions, or
          fees, so no refunds are applicable. Any cost you incur comes from the
          third-party AI provider you choose, is billed by them, and is not
          refundable by us.
        </p>

        <h2>12. Suspension and termination</h2>
        <p>
          These terms apply for as long as you use KnockDesk. You can stop at
          any time by uninstalling the software and deleting your data folders.
          We may suspend or terminate access to this website if you use it in a
          way that harms the project or its users.
        </p>

        <h2>13. Changes to these terms</h2>
        <p>
          If these terms change, the updated version will be published on this
          page with a new effective date. Continued use after a change
          constitutes acceptance of the revised terms. Because the application
          does not phone home, changes to the app&apos;s behaviour are
          announced in the release notes and in the source repository.
        </p>

        <h2>14. Severability and waiver</h2>
        <p>
          If any provision of these terms is held to be unenforceable, that
          provision is severed and the rest remains in force. A failure to
          enforce a provision is not a waiver of it.
        </p>

        <h2>15. Governing law and disputes</h2>
        <p>
          These terms are governed by the laws of India, and the courts of
          India have exclusive jurisdiction over any dispute arising from
          them. If you are a consumer in another country, this does not take
          away any protection you have under the mandatory consumer law of your
          own country.
        </p>

        <h2>16. Contact</h2>
        <p>
          Questions about these terms write to{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Source and issue tracker are
          on <a href={GITHUB} rel="noopener noreferrer">GitHub</a>.
        </p>
      </main>
    </>
  );
}

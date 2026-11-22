import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { EMAIL } from "../lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "KnockDesk privacy policy. Local-first by default; connected features send data only to services you choose.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <>
      <main id="main" className="kd-container kd-legal kd-page">
        <Breadcrumbs trail={[{ label: "Privacy Policy" }]} />
        <h1 data-reveal="split">Privacy Policy</h1>
        <p className="kd-meta">
          Effective: October 20, 2026. Last updated: November 21, 2026.
          <br />
          Contact: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>

        <h2>Summary</h2>
        <p>
          KnockDesk is local-first: your settings, memories, and chat history are
          stored on your PC, not in an account or database operated by us. When
          you enable a connected feature, the data that feature needs is sent to
          the service you chose. We do not operate a general cloud backend for
          the app, and we do not sell your data. This website is static, except
          for the optional contact form and privacy-friendly analytics described
          below.
        </p>

        <h2>Who we are</h2>
        <p>
          KnockDesk is published by OpKnock, a small independent project. The
          software is distributed as free and open source under the Apache
          License 2.0, and the source is public. We do not hold a copy of your
          local app data.
        </p>

        <h2>What is stored on your PC</h2>
        <ul>
          <li>
            <strong>Settings, chats, contacts, notes, tasks:</strong> stored in
            the app user-data folder on your PC. Persona and memory files are in
            <code>Documents\KnockDesk Data</code>.
          </li>
          <li>
            <strong>API keys:</strong> configured locally in Settings and used
            for requests to the providers you enable. They are protected with
            your operating system account and are redacted from logs and
            screenshots.
          </li>
          <li>
            <strong>Chat history and memories:</strong> local JSON and SQLite
            files you can read, edit, or delete at any time.
          </li>
          <li>
            <strong>Files you create with the app:</strong> screenshots and
            captures are saved to your Downloads folder.
          </li>
        </ul>

        <h2>What can leave your PC</h2>
        <p>
          KnockDesk does not send your data to us. Connected features can send
          only what they need to the services you enable:
        </p>
        <ul>
          <li>
            <strong>AI provider requests:</strong> prompts, and any context you
            attach, go to the provider you selected (for example OpenRouter,
            Groq, OpenAI, Google Gemini, or a local model). That provider handles
            the request under its own privacy policy and terms.
          </li>
          <li>
            <strong>Speech services:</strong> if you enable cloud transcription
            or speech synthesis, audio or text is sent to the provider you
            configured.
          </li>
          <li>
            <strong>Connected tools:</strong> news, maps, messaging integrations,
            monitoring sources, remote bridges, and similar features transmit
            data only when you turn them on and only to the services they use.
          </li>
          <li>
            <strong>Update checks:</strong> if automatic updates are enabled, the
            app checks a version feed. No personal data is sent.
          </li>
        </ul>
        <p>
          Local-first does not mean universally offline. Review the settings of
          each connected feature before enabling it, and read the privacy policy
          of the provider you choose.
        </p>

        <h2>Microphone, camera, and screen</h2>
        <p>
          These are used only when you explicitly start a feature that needs
          them, such as voice chat, screen capture, or computer automation.
          KnockDesk performs no background recording. Audio and screen content
          is processed locally, or sent to the provider you configured, only as
          part of the request you asked for. You can turn each of these off in
          Settings, and switching one off stops it immediately.
        </p>

        <h2>What we do not do</h2>
        <ul>
          <li>No advertising or cross-site tracking</li>
          <li>No sale, rental, or sharing of your data</li>
          <li>No mandatory cloud account or sign-in for the desktop app</li>
          <li>No background collection by KnockDesk itself</li>
          <li>No advertising SDKs embedded in the app</li>
        </ul>

        <h2>This website</h2>
        <p>
          This site is statically generated and has no user accounts or
          database. It sets no cookies. If the site is deployed with
          privacy-friendly Plausible analytics, that is disclosed on the{" "}
          <Link href="/cookies">cookie policy page</Link>.
        </p>
        <p>
          The contact form either opens your own mail client, or, when a form
          endpoint is configured by the site operator, submits your name, email,
          and message to that endpoint so we can reply. The current deployment
          determines which path is used. Fonts and images are served from this
          site&apos;s own domain. The full detail is on the{" "}
          <Link href="/cookies">cookie policy page</Link>.
        </p>

        <h2>Security</h2>
        <p>
          The application stores protected data encrypted at rest, using a key
          generated on your machine and bound to your operating system account.
          The shipped modules are recorded in a manifest and verified before the
          application uses them. A failed verification stops the affected
          feature rather than running unverified code.
        </p>
        <p>
          No system is perfectly secure. Keep your operating system updated, do
          not share your API keys, and review what you have granted microphone,
          camera, and screen access to.
        </p>

        <h2>Data retention and deletion</h2>
        <p>
          Local app data stays on your PC until you delete it. Uninstalling
          KnockDesk preserves your data folders. To erase everything, uninstall
          the app and then delete the folders
          <code>Documents\KnockDesk Data</code>,{" "}
          <code>Documents\KnockDesk_Vault</code>, and the app user-data folder.
          Data sent to a provider you enabled is retained under that
          provider&apos;s policy. If you used a configured contact endpoint, ask
          us to delete the submitted message by writing to{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>

        <h2>Children</h2>
        <p>
          KnockDesk is not directed at children under 13, or under the age of
          digital consent in your country. We do not knowingly collect personal
          information from children.
        </p>

        <h2>Your rights</h2>
        <p>
          You can read, export, edit, and delete local app data because it is on
          your machine. For anything you have sent us by email or through a
          configured form endpoint, you can ask for a copy or for deletion by
          writing to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Provider-side data
          is subject to the provider&apos;s own rights process.
        </p>

        <h2>Generative AI disclosure</h2>
        <p>
          Responses from KnockDesk are machine-generated and can be wrong. Model
          output can also reflect biases present in the training data of the
          provider you chose. Verify important information independently, and do
          not rely on the app for medical, legal, financial, or safety decisions.
          Report unsafe or abusive outputs via the contact page so provider
          settings can be adjusted.
        </p>

        <h2>International transfers</h2>
        <p>
          We do not transfer your local app data to ourselves. If you use an AI,
          speech, or other service based outside your country, that provider
          will process the data you send in the jurisdiction where it operates,
          under its own privacy policy. Read the policy of each service you
          enable.
        </p>

        <h2>India: DPDP Act disclosure</h2>
        <p>
          For users in India, KnockDesk is designed to keep personal data on the
          device unless a connected feature is enabled. This website does not
          write visit data to a server we operate; analytics, if enabled, is
          processed by Plausible as described on the cookie page. The contact
          form either opens your email client or submits to a configured
          endpoint. To exercise a right under the Digital Personal Data
          Protection Act, 2023, write to{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>

        <h2>Cookies</h2>
        <p>
          This website sets no cookies and runs no third-party trackers by
          default. Details are on the{" "}
          <Link href="/cookies">cookie policy page</Link>.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If this policy changes, the updated version will be published on this
          page with a new effective date. Changes to app behaviour are also
          visible in the release notes and source repository.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy, or a request relating to your data, write
          to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      </main>
    </>
  );
}

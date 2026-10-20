import type { Metadata } from "next";
import { Breadcrumbs } from "../components/Breadcrumbs";

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
          Effective: October 17, 2026. Contact: wagdemehul@gmail.com
        </p>

        <h2>Acceptance</h2>
        <p>
          By downloading, installing, or using KnockDesk, you agree to these terms. If you do not agree, do not use the software.
        </p>

        <h2>License</h2>
        <p>
          KnockDesk is free and open source software licensed under the Apache License 2.0. You may use, modify, and distribute it under the terms of that license. See the LICENSE file in the source repository for the full text.
        </p>

        <h2>Your responsibilities</h2>
        <ul>
          <li>You are responsible for your own AI provider API keys and their usage costs.</li>
          <li>You are responsible for complying with your AI provider&apos;s terms of service.</li>
          <li>You are responsible for content you generate using KnockDesk.</li>
          <li>You are responsible for keeping your own data backed up.</li>
        </ul>

        <h2>No warranty</h2>
        <p>
          KnockDesk is provided &quot;as is&quot; without warranty of any kind. The authors and contributors are not liable for any damages, data loss, or consequences arising from use of the software. AI-generated responses may be inaccurate and should not be relied upon for critical decisions.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, the authors and contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, profits, or use, arising from or related to your use of KnockDesk.
        </p>

        <h2>Third-party services</h2>
        <p>
          KnockDesk can connect to third-party AI providers (Google Gemini, OpenRouter, etc.) using your own keys. Your use of those services is governed by their respective terms and privacy policies. KnockDesk is not responsible for third-party service availability, accuracy, or billing.
        </p>

        <h2>Acceptable use</h2>
        <p>
          Do not use KnockDesk to violate any law, generate harmful content, or infringe on the rights of others. Do not attempt to disable, bypass, or reverse engineer security features.
        </p>

        <h2>Refunds</h2>
        <p>
          KnockDesk is free software. There are no charges, subscriptions, or fees, so no refunds are applicable.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          If these terms change, the updated version will be published on this page with a new effective date. Continued use after changes constitutes acceptance.
        </p>
      </main>
    </>
  );
}

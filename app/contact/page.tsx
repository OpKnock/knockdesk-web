"use client";

import { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { EMAIL } from "../lib/site";

type Errors = Partial<Record<"name" | "email" | "message" | "consent", string>>;
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    if (d.get("website")) return; // honeypot
    const name = String(d.get("name") || "").trim();
    const email = String(d.get("email") || "").trim();
    const message = String(d.get("message") || "").trim();
    const next: Errors = {};
    if (!name) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address, like jane@example.com.";
    if (message.length < 10) next.message = "Write at least a sentence so we can help.";
    if (!d.get("consent")) next.consent = "Tick this box so we can reply to you.";
    setErrors(next);
    if (Object.keys(next).length) { setStatus("idle"); return; }

    if (!ENDPOINT) {
      const subject = encodeURIComponent(`KnockDesk inquiry from ${name}`);
      const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      setStatus("mailto");
      form.reset();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ name, email, message }) });
      if (!res.ok) throw new Error("bad status");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const field = (id: keyof Errors) => ({ "aria-invalid": errors[id] ? true : undefined, "aria-describedby": errors[id] ? `${id}-err` : undefined } as const);

  return (
    <main id="main" className="kd-container kd-page" style={{ maxWidth: 680 }}>
      <Breadcrumbs trail={[{ label: "Contact" }]} />
      <h1>Contact</h1>
      <p className="kd-lead">Questions, bug reports, feature requests, or security disclosures. I read every message.</p>

      <div className="kd-card" style={{ marginBottom: 48 }}>
        <p style={{ marginBottom: 8 }}><strong>Email directly:</strong> <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
        <p style={{ fontSize: "0.9375rem" }}>Typically replies within 48 hours.</p>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className="kd-hp" aria-hidden="true"><label>Leave blank<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <div className="kd-field">
          <label htmlFor="name" className="kd-label">Your name</label>
          <input id="name" name="name" type="text" className="kd-input" placeholder="Jane Doe" autoComplete="name" {...field("name")} />
          {errors.name && <p id="name-err" className="kd-err">{errors.name}</p>}
        </div>
        <div className="kd-field">
          <label htmlFor="email" className="kd-label">Email address</label>
          <input id="email" name="email" type="email" className="kd-input" placeholder="jane@example.com" autoComplete="email" {...field("email")} />
          {errors.email && <p id="email-err" className="kd-err">{errors.email}</p>}
        </div>
        <div className="kd-field">
          <label htmlFor="message" className="kd-label">Message</label>
          <textarea id="message" name="message" className="kd-input" rows={6} placeholder="What can I help you with?" style={{ resize: "vertical" }} {...field("message")} />
          {errors.message && <p id="message-err" className="kd-err">{errors.message}</p>}
        </div>
        <div className="kd-field">
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <input id="consent" name="consent" type="checkbox" style={{ marginTop: 2, width: 24, height: 24, accentColor: "#c93a12", flexShrink: 0 }} {...field("consent")} />
            <label htmlFor="consent" style={{ fontSize: "0.9375rem", color: "var(--kd-muted)" }}>
              I agree that my name, email, and message may be used to respond to this inquiry, as described in the <Link href="/privacy">privacy policy</Link>.
            </label>
          </div>
          {errors.consent && <p id="consent-err" className="kd-err">{errors.consent}</p>}
        </div>
        <button type="submit" className="kd-btn kd-btn-primary" style={{ width: "100%" }} disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send message"}
        </button>

        <div aria-live="polite">
          {status === "sent" && <div className="kd-alert kd-alert-ok"><p><strong>Message sent.</strong> Thank you. You will get a reply at the email address you gave within 48 hours.</p></div>}
          {status === "mailto" && <div className="kd-alert kd-alert-ok"><p><strong>Almost done.</strong> Your email app should open with the message filled in. Press send there. If nothing opened, write to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p></div>}
          {status === "error" && <div className="kd-alert kd-alert-bad" role="alert"><p><strong>Message not sent.</strong> Check your connection and try again, or email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> directly.</p></div>}
        </div>
      </form>

      <p style={{ marginTop: 40, fontSize: "0.9375rem" }}>
        We only collect what you type in this form (name, email, message) to answer your inquiry.
      </p>
    </main>
  );
}

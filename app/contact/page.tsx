"use client";

import { useState } from "react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { BackToTop } from "../components/BackToTop";
import { Breadcrumbs } from "../components/Breadcrumbs";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get("name");
    const email = data.get("email");
    const message = data.get("message");
    const consent = data.get("consent");

    if (!name || !email || !message || !consent) {
      setStatus("error");
      return;
    }

    const subject = encodeURIComponent(`KnockDesk inquiry from ${name}`);
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
    window.location.href = `mailto:wagdemehul@gmail.com?subject=${subject}&body=${body}`;
    setStatus("sent");
    form.reset();
  };

  return (
    <>
      <Nav />
      <main id="main" className="kd-container" style={{ paddingTop: "96px", paddingBottom: "96px", maxWidth: "640px" }}>
        <Breadcrumbs trail={[{ label: "Contact" }]} />
        <h1 style={{ marginBottom: "16px" }}>Contact</h1>
        <p style={{ marginBottom: "48px" }}>
          Questions, bug reports, feature requests, or security disclosures. I read every message.
        </p>

        <div className="kd-card" style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "0.9375rem", marginBottom: "8px" }}>
            <strong>Email directly:</strong>{" "}
            <a href="mailto:wagdemehul@gmail.com" style={{ color: "var(--kd-acc)", textDecoration: "none" }}>
              wagdemehul@gmail.com
            </a>
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--kd-faint)" }}>
            Typically replies within 48 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="name" className="kd-label">Your name</label>
            <input id="name" name="name" type="text" required className="kd-input" placeholder="Jane Doe" autoComplete="name" />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="email" className="kd-label">Email address</label>
            <input id="email" name="email" type="email" required className="kd-input" placeholder="jane@example.com" autoComplete="email" />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label htmlFor="message" className="kd-label">Message</label>
            <textarea id="message" name="message" required className="kd-input" rows={5} placeholder="What can I help you with?" style={{ resize: "vertical" }} />
          </div>
          <div style={{ marginBottom: "24px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <input id="consent" name="consent" type="checkbox" required style={{ marginTop: "2px", width: "24px", height: "24px", accentColor: "#00e5ff", cursor: "pointer", flexShrink: 0 }} />
            <label htmlFor="consent" style={{ fontSize: "0.875rem", color: "var(--kd-muted)", cursor: "pointer" }}>
              I agree that my name, email, and message may be used to respond to this inquiry, as described in the{" "}
              <a href="/privacy" style={{ color: "var(--kd-acc)", textDecoration: "none" }}>privacy policy</a>.
            </label>
          </div>
          <button type="submit" className="kd-btn kd-btn-primary" style={{ width: "100%" }}>
            Send message
          </button>

          {status === "sent" && (
            <div role="status" style={{ marginTop: "16px", padding: "16px", background: "rgba(0,229,255,0.08)", borderRadius: "4px", border: "1px solid rgba(0,229,255,0.2)" }}>
              <p style={{ color: "var(--kd-acc)", fontSize: "0.9375rem" }}>
                Your email client should open with the message pre-filled. If not, copy the address above and send directly.
              </p>
            </div>
          )}

          {status === "error" && (
            <div role="alert" style={{ marginTop: "16px", padding: "16px", background: "rgba(255,46,46,0.08)", borderRadius: "4px", border: "1px solid rgba(255,46,46,0.2)" }}>
              <p style={{ color: "#ff6b6b", fontSize: "0.9375rem" }}>
                Please fill in all fields, including the consent checkbox, before sending.
              </p>
            </div>
          )}
        </form>

        <p style={{ marginTop: "32px", fontSize: "0.8125rem", color: "var(--kd-faint)" }}>
          We only collect the data you provide in this form (name, email, message) to respond to your inquiry. Nothing is stored on a server; the form opens your email client directly.
        </p>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

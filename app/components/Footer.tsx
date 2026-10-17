import Link from "next/link";

export function Footer() {
  return (
    <footer className="kd-footer">
      <div className="kd-container kd-footer-grid">
        <div>
          <p style={{ fontWeight: 500, color: "var(--kd-text)", marginBottom: "12px" }}>KnockDesk</p>
          <p style={{ fontSize: "0.875rem" }}>Your local-first AI assistant.</p>
          <p style={{ fontSize: "0.875rem" }}>Free and open source.</p>
        </div>
        <div>
          <p style={{ fontWeight: 500, color: "var(--kd-text)", marginBottom: "12px", fontSize: "0.875rem" }}>Product</p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><a href="/download">Download</a></li>
            <li><Link href="/#features">Features</Link></li>
            <li><Link href="/#faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <p style={{ fontWeight: 500, color: "var(--kd-text)", marginBottom: "12px", fontSize: "0.875rem" }}>Legal</p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/cookies">Cookie Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <p style={{ fontWeight: 500, color: "var(--kd-text)", marginBottom: "12px", fontSize: "0.875rem" }}>Support</p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><a href="/contact">Contact</a></li>
            <li><a href="mailto:wagdemehul@gmail.com">wagdemehul@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="kd-container" style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid var(--kd-border)" }}>
        <p style={{ fontSize: "0.8125rem", color: "var(--kd-faint)" }}>
          Copyright {new Date().getFullYear()} OpKnock. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

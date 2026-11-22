import Link from "next/link";
import { EMAIL, GITHUB } from "../lib/site";

export function Footer() {
  return (
    <footer className="kd-footer">
      <div className="kd-container kd-footer-grid">
        <div>
          <h4>KnockDesk</h4>
          <p>Your local-first AI assistant.</p>
          <p>Free and open source.</p>
        </div>
        <div>
          <h4>Product</h4>
          <ul>
            <li><Link href="/download">Get KnockDesk</Link></li>
            <li><Link href="/guide">Guide</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/#faq">FAQ</Link></li>
            <li><a href={GITHUB} rel="noopener noreferrer">Source on GitHub</a></li>
          </ul>
        </div>
        <div>
          <h4>Legal</h4>
          <ul>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/cookies">Cookie Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li><Link href="/contact">Contact</Link></li>
            <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
          </ul>
        </div>
      </div>
      <div className="kd-container kd-footer-base">
        <p>Copyright {new Date().getFullYear()} OpKnock. All rights reserved.</p>
        <p>Published by OpKnock. Licensed under Apache-2.0.</p>
      </div>
    </footer>
  );
}

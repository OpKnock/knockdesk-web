import Link from "next/link";
import { SITE_URL } from "../lib/site";

export function Breadcrumbs({ trail }: { trail: Array<{ label: string; href?: string }> }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      ...trail.map((t, i) => ({ "@type": "ListItem", position: i + 2, name: t.label, ...(t.href ? { item: `${SITE_URL}${t.href}` } : {}) })),
    ],
  };
  return (
    <nav aria-label="Breadcrumb" className="kd-crumbs">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol>
        <li><Link href="/">Home</Link></li>
        {trail.map((t, i) => (
          <li key={i} style={{ display: "flex", gap: 8 }}>
            <span aria-hidden="true" style={{ padding: "8px 0", color: "var(--kd-faint)" }}>/</span>
            {t.href ? <Link href={t.href}>{t.label}</Link> : <span aria-current="page" style={{ padding: "8px 0", color: "var(--kd-ink)", fontWeight: 600 }}>{t.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

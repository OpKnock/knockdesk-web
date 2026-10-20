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
        <li><Link href="/" className="kd-crumb-link">Home</Link></li>
        {trail.map((t, i) => (
          <li key={i}>
            <span aria-hidden="true" className="kd-crumbs-sep">/</span>
            {t.href ? (
              <Link href={t.href} className="kd-crumb-link">{t.label}</Link>
            ) : (
              <span aria-current="page" className="kd-crumb-current">{t.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

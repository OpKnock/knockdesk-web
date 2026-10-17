import Link from "next/link";

export function Breadcrumbs({ trail }: { trail: Array<{ label: string; href?: string }> }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://knockdesk.app/" },
      ...trail.map((t, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: t.label,
        ...(t.href ? { item: `https://knockdesk.app${t.href}` } : {}),
      })),
    ],
  };

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: "32px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ol style={{ listStyle: "none", display: "flex", flexWrap: "wrap", gap: "8px", padding: 0, fontSize: "0.875rem" }}>
        <li>
          <Link href="/" style={{ color: "var(--kd-muted)", textDecoration: "none", display: "inline-block", padding: "4px 0" }}>
            Home
          </Link>
        </li>
        {trail.map((t, i) => (
          <li key={i} style={{ display: "flex", gap: "8px" }}>
            <span aria-hidden="true" style={{ color: "var(--kd-faint)", padding: "4px 0" }}>/</span>
            {t.href ? (
              <Link href={t.href} style={{ color: "var(--kd-muted)", textDecoration: "none", display: "inline-block", padding: "4px 0" }}>
                {t.label}
              </Link>
            ) : (
              <span aria-current="page" style={{ color: "var(--kd-text)", padding: "4px 0" }}>
                {t.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

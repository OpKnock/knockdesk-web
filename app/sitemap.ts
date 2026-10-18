import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: Array<[string, number, "weekly" | "monthly"]> = [["", 1, "weekly"], ["/download", 0.9, "weekly"], ["/guide", 0.8, "monthly"], ["/about", 0.6, "monthly"], ["/contact", 0.7, "monthly"], ["/privacy", 0.5, "monthly"], ["/terms", 0.5, "monthly"], ["/cookies", 0.3, "monthly"]];
  return pages.map(([p, priority, changeFrequency]) => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency, priority }));
}

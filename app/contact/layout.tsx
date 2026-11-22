import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get help with KnockDesk. Report bugs, request features, or ask questions.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

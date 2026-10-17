"use client";

import { useEffect } from "react";

export function BackToTop() {
  useEffect(() => {
    const btn = document.querySelector(".kd-backtop");
    if (!btn) return;
    const onScroll = () => {
      if (window.scrollY > 400) btn.classList.add("visible");
      else btn.classList.remove("visible");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      className="kd-backtop"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

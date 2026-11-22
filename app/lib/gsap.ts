import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * One place to register GSAP plugins. Import `gsap`, `ScrollTrigger` and
 * `SplitText` from here, never from "gsap" directly, so registration happens
 * exactly once. Only client components import this file.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  // Mobile browsers resize the viewport as the URL bar collapses. Without this,
  // every trigger recalculates mid-scroll and the page visibly jumps.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText };

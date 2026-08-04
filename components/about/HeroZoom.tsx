"use client";

import { useEffect } from "react";

/* Scroll-linked zoom on the About hero photograph, built to the client
   reference (outtengolden.com): as the panel rises up the viewport it scales up
   and its colour deepens, so the image "arrives" rather than sitting static.

   Same idiom as HeroParallax — a null-rendering client effect that only writes
   CSS custom properties, so the animation lives in the stylesheet and the
   markup stays declarative.

   Motion-safe: the properties default to their settled values in CSS, so with
   no JS (or reduced-motion, where this bails out) the photograph is simply
   shown at full size and full colour — nothing is ever hidden or gated on the
   scroll handler. */
export function HeroZoom() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".ahero-media");
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;
      /* 0 when the panel's top sits at the viewport's bottom edge (just
         appearing), 1 once it has risen to the top of the viewport. */
      const p = Math.min(Math.max((vh - rect.top) / vh, 0), 1);
      el.style.setProperty("--ahero-zoom", (0.9 + 0.16 * p).toFixed(4)); // 0.90 → 1.06
      el.style.setProperty("--ahero-bold", (0.88 + 0.24 * p).toFixed(4)); // 0.88 → 1.12
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}

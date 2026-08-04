"use client";

import { useEffect } from "react";

/* Pointer-tracked light on the Our Story photograph. The section's motion thesis
   is light moving over glass, so the cursor is the light source: it drives the
   specular highlight's position and a few degrees of tilt, which is what makes
   the highlight travel across the face rather than sit on it.

   Same idiom as HeroZoom / HeroParallax — a null-rendering client effect that
   only writes CSS custom properties, so the animation itself lives in the
   stylesheet and the markup stays declarative.

   Motion-safe: every property it writes has a settled default in CSS (highlight
   centred and hidden, tilt zero), so with no JS, under reduced motion, or on a
   touch device — where this bails out before touching anything — the photograph
   is simply the flat, fully visible photograph. Nothing is gated on it.
   See au-motion-safety. */
export function StoryStage() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-story-stage]");
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* Coarse pointers have no hover to track, and a tilt that fires on tap reads
       as a glitch rather than as a material. */
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf = 0;
    let px = 0.5;
    let py = 0.5;

    const apply = () => {
      raf = 0;
      el.style.setProperty("--story-lx", `${(px * 100).toFixed(2)}%`);
      el.style.setProperty("--story-ly", `${(py * 100).toFixed(2)}%`);
      /* Deliberately small. The tilt exists to move the light, not to spin the
         photograph — past about 8deg the perspective starts fighting the square
         crop and the frame reads as a toy. */
      el.style.setProperty("--story-ry", `${((px - 0.5) * 7).toFixed(2)}deg`);
      el.style.setProperty("--story-rx", `${((0.5 - py) * 5).toFixed(2)}deg`);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
      py = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
      if (!raf) raf = requestAnimationFrame(apply);
    };

    /* On leave, hand the frame back to its resting values and let the CSS
       transition carry it there — the highlight parks at the top edge, where the
       system's static light already comes from. */
    const onLeave = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      el.style.setProperty("--story-lx", "50%");
      el.style.setProperty("--story-ly", "0%");
      el.style.setProperty("--story-ry", "0deg");
      el.style.setProperty("--story-rx", "0deg");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}

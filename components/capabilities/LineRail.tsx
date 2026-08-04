"use client";

import { useEffect } from "react";

/* ==========================================================================
   LineRail — the capabilities page's sticky contents rail, as a progress
   readout rather than a list of anchors.

   THE PROBLEM IT SOLVES. This page is long by necessity: four service lines,
   each needing a real explanation rather than a tagline. A plain anchor list
   answers "where can I go" and says nothing about "where am I" — and on a page
   where a reader arrives aimed at exactly one of four sections, where they are is
   the more useful of the two. So the rail does three things:

     · marks the line the reader is currently inside
     · fills a spine down its leading edge in proportion to how far through the
       four lines they have read
     · and nothing else. It is a readout, not a widget.

   THE SPINE IS MEASURED ACROSS THE WHOLE STACK, not per section. Per section it
   reset to zero four times and read as four unrelated progress bars; measured
   once from the top of line 01 to the bottom of line 04, it is one honest
   fraction of the page's argument.

   MOTION-SAFE BY CONSTRUCTION. Both custom properties fall back to their
   FINISHED value, so an unset property is a fully drawn spine and never a missing
   one — the same rule CountTally follows. Nothing here is ever hidden, nothing is
   gated on a callback, and the rest state is a complete, working anchor list with
   every link live. See au-motion-safety.
   ========================================================================== */

export function LineRail() {
  useEffect(() => {
    const rail = document.querySelector<HTMLElement>("[data-line-rail]");
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-line]"));
    if (!rail || !sections.length) return;

    const keys = Array.from(rail.querySelectorAll<HTMLElement>("[data-line-key]"));
    let raf = 0;

    /* A fifth of the viewport down: where a heading reads as "the section I am
       in" rather than "the section coming up". */
    const EYE = 0.24;

    const frame = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const line = vh * EYE;

      /* Current section: the last one whose top edge has passed the eye line. */
      let current = "";
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= line) current = s.dataset.line ?? "";
      }
      for (const k of keys) {
        k.toggleAttribute("data-current", k.dataset.lineKey === current && current !== "");
      }

      /* Progress across the whole stack, clamped. Anchored to the first
         section's top and the last section's bottom so it reaches 1 exactly as
         the fourth line ends, not as the footer does. */
      const first = sections[0].getBoundingClientRect();
      const last = sections[sections.length - 1].getBoundingClientRect();
      const span = last.bottom - first.top;
      const read = line - first.top;
      const p = span > 0 ? Math.min(Math.max(read / span, 0), 1) : 1;
      rail.style.setProperty("--rail-p", p.toFixed(4));
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(frame);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    raf = window.requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
      /* Hand the property back to the stylesheet: finished IS the CSS default,
         so the cleanest way to be finished is to have written nothing. */
      rail.style.removeProperty("--rail-p");
      keys.forEach((k) => k.removeAttribute("data-current"));
    };
  }, []);

  return null;
}

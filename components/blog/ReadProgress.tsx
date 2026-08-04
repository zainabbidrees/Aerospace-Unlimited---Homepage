"use client";

import { useEffect } from "react";

/* ==========================================================================
   ReadProgress — a hairline that fills as the article body is read.

   WHY IT EARNS ITS PLACE ON THIS ONE PAGE. The site has no other long-form
   surface. These articles run two to three thousand words with six to eight
   subheadings, and the single question a reader has that the page cannot
   otherwise answer is "how much of this is left". A scrollbar answers that for
   the document; this answers it for the ARTICLE, which is the part they care
   about — it is anchored to the body element, so it reads 0% at the first
   paragraph and 100% at the last, not at the footer.

   IT IS DECORATION AND IT KNOWS IT. 2px tall, hairline-quiet, `aria-hidden`, and
   it carries no number and no label. A reading-progress bar that demands
   attention is competing with the thing it is measuring.

   MOTION-SAFE. `--read-p` falls back to 1 in the stylesheet, so an unset property
   is a complete bar rather than an empty one, and no content anywhere is gated on
   it. Under reduced motion the element is hidden by CSS instead: a bar whose only
   behaviour is movement has nothing to offer a reader who asked for less of it.
   See au-motion-safety.
   ========================================================================== */

export function ReadProgress() {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>("[data-read-progress]");
    const body = document.querySelector<HTMLElement>("[data-read-body]");
    if (!bar || !body) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;

    const frame = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const r = body.getBoundingClientRect();
      /* 0 when the body's top edge reaches the top of the viewport; 1 when its
         bottom edge does. Measured against the body's own travel rather than the
         document's, so the figure is about the article. */
      const span = r.height - vh;
      const p = span > 0 ? Math.min(Math.max(-r.top / span, 0), 1) : 1;
      bar.style.setProperty("--read-p", p.toFixed(4));
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
      bar.style.removeProperty("--read-p");
    };
  }, []);

  return null;
}

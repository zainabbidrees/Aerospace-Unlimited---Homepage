"use client";

/* ==========================================================================
   Scroll-reveal — one shared observer that plays a fade/rise entrance on every
   section as it scrolls into view.

   MOTION-SAFE BY THE SAME CONSTRUCTION AS FeatureReveal / HotStock, and for the
   same hard reason: this project ships against a screenshot renderer that fires
   NO IntersectionObserver callbacks and advances NO animation, and an earlier
   scroll-reveal once left THIRTEEN OF FIFTEEN sections stranded at opacity 0.
   So nothing is ever hidden by the stylesheet at rest. Elements carry
   `data-reveal` and render fully visible on the server, with no JS, and under
   reduced-motion. Only after this component mounts on the client — proof that
   JS runs and motion is allowed — does it ARM the hidden state
   (`data-reveal-state="armed"`), then play it (`"in"`) when the element reaches
   the viewport. A failsafe timer reveals anything still armed, so a missed
   observer callback can never leave a band blank. See au-motion-safety.
   ========================================================================== */

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    /* Reduced motion: leave every element in its final, visible state. We never
       even arm, so there is nothing to play and nothing to fail open. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (!els.length) return;

    /* Arm now — after mount, while most of these are still below the fold. This
       is the only line that hides anything, and it lives in client JS by design
       so the no-JS / screenshot path can never reach it. */
    els.forEach((el) => {
      el.dataset.revealState = "armed";
    });

    const show = (el: HTMLElement) => {
      el.dataset.revealState = "in";
    };

    /* Failsafe: whatever the observer has not played within 2s, reveal anyway.
       A band is never left blank because a callback did not arrive. */
    const failsafe = window.setTimeout(() => {
      els.forEach((el) => {
        if (el.dataset.revealState === "armed") show(el);
      });
    }, 2000);

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              show(e.target as HTMLElement);
              io?.unobserve(e.target);
            }
          }
        },
        /* A touch of negative bottom margin so a band plays as it clears the
           lower edge rather than the instant its first pixel appears. */
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      els.forEach((el) => io!.observe(el));
    } else {
      /* No observer: reveal everything immediately and drop the failsafe. Bare
         clearTimeout, not window.clearTimeout — the `in window` check above
         narrows `window` to `never` in this branch, which is a type error. */
      els.forEach(show);
      clearTimeout(failsafe);
    }

    return () => {
      io?.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}

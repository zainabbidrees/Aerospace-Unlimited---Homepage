"use client";

/* ==========================================================================
   "The short version" reveal — the layered photo stack assembles as the band
   scrolls into view.

   Motion-safe by exactly the construction HotStock uses: the phase is null on
   the server and on first paint, so with no JS — or a renderer that never
   fires an observer — the section renders in its final, fully visible state and
   nothing is gated behind an event that might not arrive. The client ARMS the
   entrance (hides the pieces) only after mount, while the shell is still below
   the fold, then plays it when the shell scrolls into view. A timeout is the
   failsafe: if the observer never fires, the reveal happens anyway, so the band
   can never be left blank. See au-motion-safety and HotStock's copy of this.
   ========================================================================== */

import { useEffect } from "react";

export function FeatureReveal() {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(".feature-block");
    if (!shell) return;

    shell.dataset.phase = "armed";
    const show = () => {
      shell.dataset.phase = "in";
    };
    const failsafe = window.setTimeout(show, 1800);

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            show();
            io?.disconnect();
            window.clearTimeout(failsafe);
          }
        },
        { threshold: 0.16, rootMargin: "0px 0px -10% 0px" },
      );
      io.observe(shell);
    } else {
      show();
    }

    return () => {
      io?.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}

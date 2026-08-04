"use client";

import { useEffect } from "react";

/* ==========================================================================
   CueReveal — the entrance mechanism for the inner pages.

   WHY NOT THE SHARED ScrollReveal. That observer arms every [data-reveal]
   element on mount and then, 2s later, reveals whatever is still armed so no
   band can ship blank. On the homepage, where the tallest band is two viewports
   down, that is fine. On these pages it is not: the catalog hub, the
   capabilities page and the blog index each run six to nine bands deep, so the
   blanket failsafe fires while band five is still four screens away and every
   reader arrives to a section that finished animating without them. Exactly the
   bug EdgeReveal was written to fix on the about page — this generalises that
   fix so every inner page can use it, rather than each one growing its own
   bespoke observer.

   THE CUE IS PER ELEMENT AND COMES FROM THE ELEMENT'S OWN POSITION. An element
   opts in with `data-cue` and plays when IT crosses the trigger line. Two
   optional attributes tune it, and neither is required:

     data-cue="<name>"   the recipe ux.css should use (rise, lift, draw, …).
                         An empty value is the default rise.
     data-cue-vh="0.92"  the trigger line, as a fraction of viewport height,
                         measured against the element's top edge. Higher fires
                         later. Default 0.88 — the value EdgeReveal measured.
     data-cue-ms="1200"  the longest transition in the recipe, so the run knows
                         when to release its will-change hint. Default 1000.

   MOTION-SAFE BY CONSTRUCTION, and strictly safer than arming on mount:

     1. THE LANDED STATE IS THE STYLESHEET'S DEFAULT. Every rule that displaces,
        clips or hides anything sits behind [data-cue-state="armed"], and that
        attribute is only ever written by this file, from inside a real animation
        frame, and only once the element has reached its own trigger line. No JS,
        a thrown error, a renderer that never paints, reduced motion, a crawler
        or a screenshot pipeline all leave every band finished.
     2. NO BLANKET FAILSAFE IS NEEDED, because nothing is armed until it is
        nearly on screen. The 2s blanket reveal was itself the thing that
        pre-empted the entrance.
     3. ANYTHING ALREADY SCROLLED PAST IS WRITTEN OFF UNPLAYED. A deep link, a
        restored scroll position or an in-page jump lands on finished sections
        rather than watching them assemble under the reader.

   See au-motion-safety.
   ========================================================================== */

const DEFAULT_VH = 0.88;
const DEFAULT_MS = 1000;

export function CueReveal() {
  useEffect(() => {
    /* Reduced motion: every cued element is already landed in the DOM, because
       landed is the CSS default. Leave without touching anything. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cues = Array.from(document.querySelectorAll<HTMLElement>("[data-cue]"));
    if (!cues.length) return;

    let raf = 0;
    const timers = new Set<number>();
    /* An element leaves `pending` the moment it is cued or written off, so
       neither can happen to it twice. */
    const pending = new Set(cues);

    const finish = (el: HTMLElement) => {
      delete el.dataset.cueState;
    };

    /* Two frames, and they have to be two. Frame one places the element at its
       start offset; frame two flips to landed, and because the browser has now
       painted the displaced position the transition has something to move FROM.
       Set both in one frame and nothing animates at all. */
    const cue = (el: HTMLElement) => {
      pending.delete(el);
      el.dataset.cueState = "armed";
      const id = window.requestAnimationFrame(() => {
        el.dataset.cueState = "in";
        /* Ends the run and doubles as its failsafe: transitions do not complete
           in a background tab, and landing early only ever snaps to the final
           state — which is the state the element is meant to end in anyway. */
        const ms = Number(el.dataset.cueMs) || DEFAULT_MS;
        const t = window.setTimeout(() => finish(el), ms + 300);
        timers.add(t);
      });
      timers.add(id);
    };

    const check = () => {
      raf = 0;
      if (!pending.size) return;
      const vh = window.innerHeight || 1;
      for (const el of Array.from(pending)) {
        const r = el.getBoundingClientRect();
        /* Guarantee 3. */
        if (r.bottom < 0) {
          pending.delete(el);
          continue;
        }
        const line = Number(el.dataset.cueVh) || DEFAULT_VH;
        if (r.top <= vh * line) cue(el);
      }
      if (!pending.size) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };

    function onScroll() {
      if (!raf && pending.size) raf = window.requestAnimationFrame(check);
    }

    /* Guarantee 1: the first attribute this file writes happens inside a frame. */
    raf = window.requestAnimationFrame(check);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      /* Unmounting mid-run must never leave an element armed — that is the one
         state in which it is invisible. */
      cues.forEach(finish);
    };
  }, []);

  return null;
}

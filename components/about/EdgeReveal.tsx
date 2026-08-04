"use client";

import { useEffect } from "react";

/* ==========================================================================
   WHAT SETS US APART — the band's entrance, cued per element.

   THE CHOREOGRAPHY ITSELF IS NOT NEW and is not changed here: the two columns
   still converge on the photograph, the chips still flip in hinged away from it,
   each detail line still prints a beat after its own card, and the frame still
   holds still while the picture opens inside it. That sequence was already good.
   What it did not have was an audience.

   THE BUG THIS FILE EXISTS TO FIX. The band was driven by the shared
   ScrollReveal, which arms every [data-reveal] element on mount and then, 2s
   later, reveals anything still armed so no band can be stranded blank. This
   section sits FOUR VIEWPORT-HEIGHTS below the fold, so that blanket failsafe
   fired while it was four screens away: measured at ~2.4s after load the columns
   were already mid-converge and by ~3.2s fully landed. Every reader arrived to a
   band that had finished animating without them. The entrance was not too fast,
   it was over.

   So the cue is per element and comes from the element's own position:

     - Each of the six cards plays when IT crosses the trigger line, not when the
       band does. The three cards in a column are ~190px apart, so the reveal
       unfolds across the section's own scroll depth instead of firing as one
       burst — which is what makes it read as arriving slowly as you scroll,
       rather than as a single long animation you catch the end of.
     - The photograph is cued ~100px of scroll EARLIER than the first pair of
       cards, so the aperture is already opening when they start to converge. The
       picture leads; the claims follow it.

   MOTION-SAFE BY THE SAME CONSTRUCTION AS ValuesConverge, and note that it is
   strictly safer than arming on mount: the landed state is the stylesheet's
   default, and the only rules that displace or hide anything sit behind a
   `data-edge="armed"` attribute this file sets from inside a real animation
   frame, and only once that element has reached its own trigger. A renderer that
   never paints, a thrown error, no JS, or reduced motion all leave the whole band
   finished — cards, chips, lines and photograph included. Because nothing is
   armed until it is nearly on screen, there is no need for a blanket failsafe
   that could pre-empt the entrance the way the shared observer did.

   See au-motion-safety.
   ========================================================================== */

/* Trigger lines as fractions of viewport height, measured against each element's
   top edge. The media's is higher up the viewport — i.e. it fires sooner — which
   is what gives the aperture its lead over the cards beside it. */
const CARD_VH = 0.88;
const MEDIA_VH = 0.98;

/* Longest transition chain per element, plus headroom, after which the run is
   over and the will-change hint can come off. Cards: 0.30s print delay + 0.70s.
   Media: 1.75s clip-path. Kept in step with the .edge-* block in ux.css. */
const CARD_MS = 1000;
const MEDIA_MS = 1750;

export function EdgeReveal() {
  useEffect(() => {
    const band = document.querySelector<HTMLElement>("[data-edge-band]");
    if (!band) return;

    /* Reduced motion: the band is already landed in the DOM. Leave it. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cues = Array.from(
      band.querySelectorAll<HTMLElement>("[data-edge-cue]"),
    );
    if (!cues.length) return;

    let raf = 0;
    const timers = new Set<number>();
    /* An element leaves `pending` the moment it is cued or written off, so
       neither can ever happen to it twice. */
    const pending = new Set(cues);

    const finish = (el: HTMLElement) => {
      el.removeAttribute("data-edge");
    };

    /* Two frames, and they have to be two. Frame one places the element at its
       start offset; frame two flips to the landed state, and because the browser
       has now painted the displaced position the CSS transition has something to
       move FROM. Set both in one frame and nothing animates at all. */
    const cue = (el: HTMLElement) => {
      pending.delete(el);
      const isMedia = el.hasAttribute("data-edge-media");
      el.setAttribute("data-edge", "armed");
      const id = window.requestAnimationFrame(() => {
        el.setAttribute("data-edge", "in");
        /* Ends the run and doubles as its failsafe: transitions do not complete
           in a background tab, and landing early only ever snaps to the final
           state. Armed by the run, so a slow scroller is never pre-empted. */
        const t = window.setTimeout(
          () => finish(el),
          (isMedia ? MEDIA_MS : CARD_MS) + 260,
        );
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
        /* Already scrolled past — a deep link, a restored position, an in-page
           jump to #edge. Write it off unplayed; it is landed where it belongs. */
        if (r.bottom < 0) {
          pending.delete(el);
          continue;
        }
        const line = el.hasAttribute("data-edge-media") ? MEDIA_VH : CARD_VH;
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

    raf = window.requestAnimationFrame(check);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cues.forEach(finish);
    };
  }, []);

  return null;
}

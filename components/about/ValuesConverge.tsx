"use client";

import { useEffect } from "react";

/* ==========================================================================
   FOUR VALUES, ONE STANDARD — the values row's arrival.

   THE THESIS IS CONVERGENCE, NOT CASCADE. The four cards each start from their
   OWN offset — a different drop, drift and tilt per card — and are driven by ONE
   shared progress value, so they travel together and go level with each other at
   the same instant. The section's headline is "Four values. One standard."; four
   heterogeneous starts resolving into one exact row is that sentence performed
   instead of stated.

   This is deliberately NOT the site's shared [data-reveal="stagger"] entrance,
   and the values row no longer carries that attribute. A stagger fires the cards
   one after another, which reads as a sequence — and a connector rail was removed
   from this very section for asserting exactly that (see the .values-rail block
   in ux.css: these four values have no order and no progression). A cascade would
   have put the ordering straight back in through motion.

   SCROLL-TRIGGERED, NOT SCROLL-SCRUBBED, and that was measured rather than
   assumed. Scrubbing the arrival directly against scroll position was built
   first and had two faults a screenshot cannot show you. Sampling an ease-out
   exponential against scroll position reached 87% landed within 90px, so the
   whole move snapped shut in the first fifth of its window — that curve is for
   elapsed time. And a scrub has no way to finish: stop mid-window and the cards
   sit parked at a tilt, out of focus, until you scroll again. Crossing a trigger
   line and then playing a rehearsed 880ms entrance can only ever end landed.

   THE CHOREOGRAPHY IS ENTIRELY IN CSS — this file sets one attribute and the
   stylesheet's transitions do the rest, on the site's own --au-ease. No curve is
   sampled here and no property is written per frame.

   MOTION-SAFE BY CONSTRUCTION, and for this project's measured reason: it ships
   against a screenshot renderer that fires NO IntersectionObserver callbacks and
   advances NO animation, and an earlier reveal once stranded thirteen of fifteen
   sections at opacity 0. So:

     1. THE LANDED STATE IS THE STYLESHEET'S DEFAULT. Cards at transform: none,
        glyphs fully drawn. No JS, no reduced motion, a dead frame or a thrown
        error all leave the row finished. Nothing is gated on this file.
     2. NOTHING IS DISPLACED UNTIL A FRAME ACTUALLY FIRES, AND NOT ON MOUNT. This
        is the one line that can hide anything, and it is the exact line that
        stranded thirteen sections last time — so it is fired from inside a real
        animation frame, and only once the row has scrolled to its trigger. A
        renderer that never paints never reaches it. ScrollReveal arms on mount
        and needs a 2s blanket failsafe to survive that; arming at the trigger
        needs no such thing.
     3. A TIMER, NOT A FRAME, OWNS THE FINAL STATE. Transitions do not complete
        in a background tab, so a run that started and lost its frames would sit
        mid-air. A setTimeout — which does still fire — lands the row. It is armed
        BY THE RUN, never on mount: a timer from mount would have quietly
        cancelled the entrance for every reader who took longer than it to scroll
        this far down the page, which is most of them.
     4. OPACITY IS NEVER ANIMATED. The failure state of a transform is "sits a
        little low"; the failure state of an opacity fade is "gone". Nothing here
        can make a card invisible, at any point in the run.

   See au-motion-safety.
   ========================================================================== */

/* The row plays when its top edge crosses this fraction of viewport height —
   far enough inside the lower edge that the landing happens while the reader is
   looking at it, not after it has gone by. */
const TRIGGER_VH = 0.88;

/* Mirrors the transition timings in ux.css: cards 900ms, glyphs 760ms after a
   300ms delay. This constant only decides when the run is over and the
   compositing hints can come off — the durations themselves live in the
   stylesheet. Keep the two in step. */
const TOTAL_MS = 1060;

export function ValuesConverge() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-values-converge]");
    if (!el) return;

    /* Reduced motion: the row is already landed in the DOM. Leave it alone — we
       never displace anything, so there is nothing to play and nothing to fail
       open. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let started = false;
    let done = false;
    let failsafe = 0;

    /* The one exit. Dropping the attribute returns the row to the stylesheet's
       landed default and takes the blur and the will-change hint off with it. */
    const land = () => {
      if (done) return;
      done = true;
      el.removeAttribute("data-converge");
      window.clearTimeout(failsafe);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };

    /* Two frames, and they have to be two. Frame one places the cards at their
       start offsets; frame two flips to the landed state, and because the browser
       has now painted the displaced position there is something for the CSS
       transition to move FROM. Set both in one frame and the transition has no
       start value to interpolate from, so nothing animates at all. */
    const play = () => {
      if (started || done) return;
      started = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);

      el.setAttribute("data-converge", "armed");
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        if (done) return;
        el.setAttribute("data-converge", "in");
        /* This timer both ENDS the run — dropping the blur and the will-change
           hint once the transition is done — and is the failsafe for it. If
           frames stop arriving mid-entrance it lands the row rather than leaving
           it in the air, and landing early only ever snaps to the final state.
           Armed here rather than on mount, so a slow scroller never has their
           entrance cancelled before they reach it. */
        failsafe = window.setTimeout(land, TOTAL_MS + 260);
      });
    };

    const check = () => {
      raf = 0;
      if (started || done) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      /* Already scrolled past it — a deep link, a restored position, an in-page
         jump. Nothing to play; the row is landed where it belongs. */
      if (r.bottom < 0) return land();
      if (r.top <= vh * TRIGGER_VH) play();
    };

    function onScroll() {
      if (!raf && !started && !done) raf = window.requestAnimationFrame(check);
    }

    raf = window.requestAnimationFrame(check);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.removeAttribute("data-converge");
    };
  }, []);

  return null;
}

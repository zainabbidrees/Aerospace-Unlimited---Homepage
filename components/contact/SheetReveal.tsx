"use client";

/* ==========================================================================
   The enquiry sheet's arrival driver.

   WHY THIS EXISTS AND DOES NOT USE [data-reveal]. The shared ScrollReveal arms
   every `[data-reveal]` element after mount and then plays whatever the
   IntersectionObserver reports — with a BLANKET 2-SECOND FAILSAFE behind it that
   reveals anything still armed. That failsafe is right for what it was built for
   (a band must never be left blank because a callback did not arrive) and it is
   fatal for an entrance you are meant to watch: measured on /contact, this panel
   sits at y=940 in a 1000px viewport at scroll 0, so it is outside the observer's
   root at load, nothing intersects, and at exactly 2s the failsafe plays the whole
   sequence while the panel is still below the fold. Scroll down half a second
   later and it is already finished. Every band further down the page has the same
   problem; this one is the one the client asked to watch.

   SO THE PLAY CONDITION IS POSITION, NOT A TIMER. One rAF loop, running only
   while the sheet is still armed, plays it the moment the panel's top crosses the
   viewport's lower reading line — the same scroll + rAF mechanism FocusRail uses,
   which is the one thing this project's renderer is known to run (an
   IntersectionObserver here delivers no callbacks at all: see au-motion-safety).
   The loop stops on the first play and never re-arms: this is an entrance, not a
   state.

   EVERY FAILURE MODE LANDS ON "FULLY COMPOSED":

     · Nothing is hidden by the stylesheet at rest. The armed state exists only
       under `data-sheet-state`, which this file alone writes, after mount.
     · Reduced motion returns before arming anything.
     · A visitor who loads the page already scrolled to the band gets the
       sequence on the first frame rather than nothing.
     · The 15s backstop plays the sheet even if the loop never runs. By then the
       panel is either on screen — in which case the loop already played it — or
       far off screen, where revealing it costs nobody anything.

   The transitions themselves live in ux.css; this only publishes state.
   ========================================================================== */

import { useEffect } from "react";

/* Where the panel's top edge has to reach before the sheet lands. 0.88 rather
   than centre: a form is tall, and waiting for the middle of an 820px panel to
   reach the middle of the screen means the head has already scrolled past the
   point where anyone would watch it arrive. */
const PLAY_LINE = 0.88;

/* Last resort only — see the note above on why this is safe where a 2s blanket
   failsafe was not. */
const BACKSTOP_MS = 15000;

export function SheetReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const host = document.querySelector<HTMLElement>("[data-sheet]");
    if (!host) return;
    /* The panel is what gets measured; the host carries the state so the rail
       beside it can follow the same sequence. */
    const panel = host.querySelector<HTMLElement>(".enq-panel") ?? host;

    let frame = 0;
    let played = false;

    const play = () => {
      if (played) return;
      played = true;
      host.dataset.sheetState = "in";
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      window.clearTimeout(backstop);
    };

    /* Arm first, in client JS, exactly like the shared reveal does — this is the
       only line here that hides anything. */
    host.dataset.sheetState = "armed";

    const tick = () => {
      frame = 0;
      if (panel.getBoundingClientRect().top < window.innerHeight * PLAY_LINE) {
        play();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const backstop = window.setTimeout(play, BACKSTOP_MS);

    /* Two frames before the first measurement, so the armed state is painted
       once and the sequence transitions from it rather than jumping straight to
       the finished panel when the band is already on screen at load. */
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(tick);
    });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(backstop);
    };
  }, []);

  return null;
}

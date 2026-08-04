"use client";

/* ==========================================================================
   The reading-focus driver — one implementation, used by every focus rail.

   WHAT IT DOES. A "rail" is a vertical list of entries. As the rail travels up
   the viewport, the entry crossing the reading line becomes the focused one and
   the rail's own stylesheet marks it. Two bands on /contact use it: the routing
   fork (the row being read lights its spine) and the Direct details spine (the
   node being read fills, and each connector draws once its entry is read).

   BOTH RAILS ONCE RECEDED THE ENTRIES NOT BEING READ — blurred and dimmed — and
   that was removed at the client's direction on 2026-08-04. This file did not
   change: it publishes state, and what a state means belongs to each band's CSS.
   Emphasis is now added to the focused entry rather than subtracted from the
   others, so every entry stays legible at every scroll position.

   IT IS PARAMETERISED BY ATTRIBUTE NAMES rather than hard-coded to one band, so
   the two rails keep their own CSS vocabularies and share this logic. Duplicating
   the file was the alternative, and the guarantees below are exactly the part of
   this project that must not exist in two places.

   WHY IT IS A SCROLL LISTENER AND NOT AN OBSERVER. This project ships against
   a renderer that delivers NO IntersectionObserver callbacks and advances NO
   CSS animation — an earlier reveal built on one stranded thirteen of fifteen
   sections at opacity 0 (see au-motion-safety). Everything here is driven by
   `scroll` + `requestAnimationFrame`, both of which do run, and it is written
   so that every failure mode lands on "fully legible":

     · Nothing is hidden or restyled by the stylesheet at rest. The focus rules
       exist ONLY under `[data-<rail>-live="on"]`, an attribute that no
       server render, no-JS load, screenshot pass or reduced-motion visitor
       ever sees — this file is the only thing that writes it.
     · The attribute is removed again the moment the band leaves the viewport,
       so a capture taken anywhere else on the page finds the register sharp.
     · Reduced motion returns before arming anything at all.

   The transitions themselves live in ux.css; this only publishes state.
   ========================================================================== */

import { useEffect } from "react";

type Props = {
  /* Selector for the rail container, and for its entries. */
  rail: string;
  step: string;
  /* dataset keys — `dialLive` writes `data-dial-live`, and so on. Each rail owns
     its own pair so the two bands' CSS cannot collide. */
  liveKey: string;
  stateKey: string;
  /* Where down the viewport an entry counts as "the one being read", measured
     against its TOP edge. Deliberately above centre: the line sets the pace, and
     at 0.55 two entries had already gone past by the time a band's heading
     arrived. Rails with taller entries want a lower line. */
  line?: number;
};

export function FocusRail({ rail: railSel, step: stepSel, liveKey, stateKey, line: lineAt = 0.42 }: Props) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rail = document.querySelector<HTMLElement>(railSel);
    if (!rail) return;
    const steps = Array.from(rail.querySelectorAll<HTMLElement>(stepSel));
    if (steps.length < 2) return;

    let frame = 0;
    let live = false;

    /* Hand every entry back its resting state: no attribute, no marks, the
       whole spine drawn. This is what the band looks like with no JS. */
    const rest = () => {
      if (!live) return;
      live = false;
      delete rail.dataset[liveKey];
      steps.forEach((s) => {
        delete s.dataset[stateKey];
      });
    };

    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      const box = rail.getBoundingClientRect();

      /* Off screen in either direction — rest, don't just stop updating. A
         band left mid-sequence would hold a stale focus mark on whichever entry
         happened to be current for as long as it sat out of view. */
      if (box.bottom < vh * 0.08 || box.top > vh * 0.98) {
        rest();
        return;
      }

      if (!live) {
        live = true;
        rail.dataset[liveKey] = "on";
      }

      const line = vh * lineAt;

      /* The focused entry is the last one whose top edge has crossed the line.
         Before the first one gets there the first entry holds focus, so the
         band always arrives with something sharp to read. */
      let active = 0;
      steps.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= line) active = i;
      });

      steps.forEach((s, i) => {
        s.dataset[stateKey] = i < active ? "read" : i === active ? "on" : "ahead";
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      rest();
    };
  }, [railSel, stepSel, liveKey, stateKey, lineAt]);

  return null;
}

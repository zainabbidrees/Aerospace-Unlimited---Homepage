"use client";

import { useState } from "react";
import { AboutIcon } from "@/components/about/AboutIcon";

/* ==========================================================================
   Industries we serve — a register, not a mosaic

   WHAT THIS REPLACES, and why. The band was six photo cards in three sizes: a
   2×2 plate for Aerospace, four small tiles, and a full-width banner for OEMs &
   MROs, each numbered 01–06 inside an <ol>. Three separate mechanisms — size,
   numeral, list semantics — all encoded a ranking, and the data that fed them
   said in its own comment that the flags were "layout roles, not a ranking of
   the industries". The page argued with itself, and size won: Aerospace read as
   four times the concern of Defense.

   The six are peers with no per-industry copy — six words, total. Six
   photographs cannot differentiate six words, and here they actively failed to:
   Aerospace, Industrial and Energy are all turbofans, and industrial.jpg and
   energy.jpg are effectively the SAME photograph (a stripped engine on a
   maintenance stand, same three-quarter framing) sitting stacked in one column.
   ManufacturerStage.tsx already documents that hazard and designs around it —
   "no two look-alike scenes ever neighbour". This band was breaking a rule the
   codebase had already written down.

   So the photographs stop competing and take turns. One frame, one scene at a
   time, and the six industries carry themselves as type on equal hairline rows.
   Two look-alike scenes can no longer sit side by side, because only one is ever
   visible — the redundancy that was a defect in a grid is invisible in a stage.

   CONTENT IS NEVER GATED ON THE INTERACTION. The six names are plain text and
   the first scene is active on the server render, so the band is complete before
   any pointer, any JS, and in the screenshot path. See au-motion-safety.

   The scenes are TREATMENT, not evidence: generic aerospace stock that belongs
   to no named operator. alt="" is deliberate — the button's own label is the
   accessible name, and the old per-image alt text actively contradicted its
   label ("the fan and blades of a turbofan engine" under "Energy"). Same
   reasoning as ManufacturerStage. See au-stock-photography-scope.
   ========================================================================== */

export type Industry = { icon: string; name: string; img: string };

export function IndustryRegister({ items }: { items: Industry[] }) {
  /* Index, not a slug: the first row is active on load so the frame is filled
     before anyone points at anything. */
  const [active, setActive] = useState(0);

  return (
    <div className="ind-stage">
      {/* Every scene stays mounted and moves on opacity. Swapping `src` instead
          would blank the frame for a network round-trip on the first visit to
          each row — the one moment the effect has to be smooth. This loads the
          same six images the card grid did, so it is not a new cost. */}
      <div className="ind-media" aria-hidden="true">
        {items.map((it, i) => (
          <img
            key={it.icon}
            /* THE WHOLE MOTION IDEA, and it is one expression. Each scene rests
               on the side of the frame its row sits on relative to the active
               row: rows below rest low, rows above rest high. So moving DOWN the
               register lifts the next scene up from below, and moving UP drops it
               in from above — the photograph reads as a continuation of the
               list's geometry rather than a slideshow running beside it.

               It is derived from position, never from a remembered direction.
               A `dir` state was the obvious build and it was wrong: React commits
               the new direction and the new active row together, so the arriving
               scene still started from the offset the PREVIOUS move had left it
               at, and every entrance pointed one step behind. Here the value a
               scene is transitioning FROM is the one rendered against the old
               active index — which is exactly "the side it came from". No lag,
               and no state to keep in sync. */
            style={{ "--enter": i > active ? "8%" : "-8%" } as React.CSSProperties}
            className={`ind-shot${i === active ? " is-active" : ""}`}
            src={it.img}
            alt=""
            width={900}
            height={620}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>

      {/* <ul>, not <ol>: the order is editorial, not a rank, and the old <ol>
          told screen readers otherwise. */}
      <ul className="ind-list">
        {items.map((it, i) => (
          <li className="ind-row" key={it.icon}>
            {/* A real control, so the stage is drivable by keyboard and touch
                and not only by a hovering mouse. Pointer, focus and click all
                set it — hover for the mouse, focus for the keyboard, click for
                touch, where there is no hover to give. */}
            <button
              type="button"
              className={`ind-pick${i === active ? " is-active" : ""}`}
              aria-pressed={i === active}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <span className="ind-glyph" aria-hidden="true">
                <AboutIcon name={it.icon} />
              </span>
              <span className="ind-label">{it.name}</span>
              <span className="ind-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h15m-6-6 6 6-6 6" />
                </svg>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

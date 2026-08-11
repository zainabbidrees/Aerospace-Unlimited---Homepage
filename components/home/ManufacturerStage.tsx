"use client";

import { useState } from "react";
import Link from "next/link";
import type { Manufacturer } from "@/lib/data";

/* ==========================================================================
   Top manufacturers — expanding filmstrip

   Five cards share one row at equal width. HOVER (or keyboard focus) expands
   the card UNDER THE CURSOR in place — it widens where it sits and unfolds its
   detail (CAGE, name, part count, the Browse link); the others narrow to make
   room. Nothing relocates: the emphasised card never jumps to a fixed slot, so
   what grows is always the card you are pointing at. That is the whole
   correction over the previous swap-into-one-slot behaviour.

   Which card is expanded is client state, not a hover-only CSS effect, for two
   reasons: it must survive on touch (a tap sets it) and it must be correct
   without any pointer at all — the first card is expanded on load so the detail
   is visible before anyone hovers. Content is never gated on an interaction
   that may not fire.

   The photography is TREATMENT, not evidence. These are generic aerospace
   scenes shared with the NSN rail — not photographs of any named company's
   product. Every card is a uniform directory tile (same scenes, decorative
   alt), and the name/CAGE/count sit on the card's own label chrome, never as a
   caption presenting the photo as that company's product. Alt text is empty:
   the card's link text is its accessible name, so the scene is decoration.
   ========================================================================== */

/* Presentation only, so it lives here rather than in lib/data.ts — the catalog
   has no opinion about which photograph sits behind which name. */
/* Order matters: `engine-hangar` and `turbofan` are both head-on fan-face
   shots and read as the same photograph when adjacent. They sit at the two
   ends of the strip so no two look-alike scenes ever neighbour — the resting
   strip alternates fan / nozzle / propeller / flight-deck / fan. */
const SCENES = [
  { img: "engine-hangar" },
  { img: "nozzle" },
  { img: "turboprop" },
  { img: "flight-deck" },
  { img: "turbofan" },
] as const;

const nf = new Intl.NumberFormat("en-US");

export function ManufacturerStage({
  items,
  total,
}: {
  items: Manufacturer[];
  total: number;
}) {
  /* Keyed by CAGE, not position, so the scene stays glued to the company even
     though nothing reorders anymore — cheap insurance and consistent with the
     rest of the section. */
  const [scenes] = useState(() =>
    Object.fromEntries(items.map((m, i) => [m.cage, SCENES[i % SCENES.length]]))
  );

  /* First card open on load: the detail must read without a hover, because the
     hover is a live-browser nicety, not a precondition for seeing the content. */
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="mfr-stage" data-reveal="up">
        {items.map((m, i) => {
          const s = scenes[m.cage];
          const isActive = i === active;
          return (
            <Link
              key={m.cage}
              className={`mfr-card${isActive ? " is-active" : ""}`}
              href={`/manufacturers/${encodeURIComponent(m.cage)}`}
              aria-current={isActive ? "true" : undefined}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="mfr-card-media">
                {/* alt="" deliberately: the scene is decoration and the link's
                    text (name, CAGE, count) is the accessible name. Folding a
                    scene description in would bury the name. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/img/nsn/${s.img}.jpg`}
                  width={600}
                  height={800}
                  alt=""
                  decoding="async"
                />
              </span>

              <span className="mfr-card-panel">
                <span className="mfr-card-cage">
                  <span className="mfr-card-cage-label">CAGE</span>
                  <span className="mfr-card-cage-code">{m.cage}</span>
                </span>

                <span className="mfr-card-name">{m.name}</span>

                {/* The fold. grid-template-rows 0fr → 1fr on .is-active; the
                    detail is always in the DOM, only its height animates. */}
                <span className="mfr-card-extra">
                  <span className="mfr-card-extra-inner">
                    <span className="mfr-card-rule" aria-hidden="true" />
                    <span className="mfr-card-count">
                      <strong>{nf.format(m.count)}</strong> parts in the catalogue
                    </span>
                    <span className="mfr-card-link">
                      Browse this catalogue
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  </span>
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mfr-stage-foot">
        <Link className="btn btn-quiet" href="/manufacturers">
          All {total} manufacturers
        </Link>
      </div>
    </>
  );
}

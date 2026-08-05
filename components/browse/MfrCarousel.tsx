"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { num } from "@/lib/format";

/* ==========================================================================
   MfrCarousel — the "By manufacturer" card rail.

   A horizontal scroll-snap carousel of CAGE nameplates. The rail itself is a
   native scroll container, so it works with a trackpad, a touch swipe and no
   JS at all; this client island only adds the two overlay arrows and keeps
   them disabled at the ends. The entrance still comes from the shared CueReveal
   observer via `data-cue="stack"` on the rail — nothing here fights it.
   ========================================================================== */

export interface MfrItem {
  cage: string;
  name: string;
  count: number;
  /* share of the deepest catalogue, 0–100, computed on the server so the bar
     width is data rather than a client-side calculation. */
  share: number;
}

export function MfrCarousel({ items }: { items: MfrItem[] }) {
  const railRef = useRef<HTMLOListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setAtStart(rail.scrollLeft <= 2);
    setAtEnd(rail.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const step = useCallback((dir: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("li");
    const gap = 24;
    const by = card ? (card.getBoundingClientRect().width + gap) * 2 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * by, behavior: "smooth" });
  }, []);

  return (
    <div className="mfrcar" data-start={atStart} data-end={atEnd}>
      <ol
        ref={railRef}
        className="mfrcar-rail"
        data-cue="deal"
        data-cue-ms="1500"
        onScroll={sync}
      >
        {items.map((m, i) => (
          <li key={m.cage}>
            <Link className="mfrcard" href={`/browse/manufacturer/${m.cage}`}>
              {/* The code is labelled in place — a small "CAGE" caption directly
                  over the number — so the card reads as one field, not a tag
                  floating above a mystery figure. */}
              <span className="mfrcard-field">
                <span className="mfrcard-k">CAGE code</span>
                <span className="mfrcard-code u-mono">{m.cage}</span>
              </span>
              <span className="mfrcard-rule" aria-hidden="true" />
              <span className="mfrcard-name">{m.name}</span>
              <span className="mfrcard-foot">
                <span className="mfrcard-meta">
                  <span className="mfrcard-n-label">Parts on the shelf</span>
                  <span className="mfrcard-n">{num(m.count)}</span>
                </span>
                <span
                  className="mfrcard-bar"
                  aria-hidden="true"
                  style={{ ["--depth" as string]: `${m.share}%` }}
                >
                  <i />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {/* The arrows are progressive enhancement — the rail scrolls without them.
          Hidden from assistive tech because the list is already reachable by
          tab and the native scroll is keyboard-operable. */}
      <div className="mfrcar-nav" aria-hidden="true">
        <button
          type="button"
          className="mfrcar-btn"
          data-dir="prev"
          disabled={atStart}
          onClick={() => step(-1)}
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="mfrcar-btn"
          data-dir="next"
          disabled={atEnd}
          onClick={() => step(1)}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { num } from "@/lib/format";

/* ==========================================================================
   Top part categories — a pinned scroll-stepper (client brief, 2026-07-30)

   One stage that PINS while you scroll a fixed distance past it, cycling through
   five featured categories in place: the photograph cross-fades and the text
   swaps, and the section never grows past a single viewport of height on screen.
   This replaces a column of five full-height photo bands that spent five screens
   of the page saying what one pinned stage says in one.

   PROGRESSIVE ENHANCEMENT is the load-bearing decision, and it is here because
   of a specific renderer this project ships against: the screenshot renderer and
   any no-JS request run NO scroll listener and advance NO animation. So the
   component renders step 01 fully at rest, server-side, and only *adds* the tall
   scroll track and the sticky pin once it has mounted on the client (`enhanced`).
   With JS off you get a clean, legible hero of the deepest category and the
   "View all categories" button for the rest — never a blank frame, never a
   half-faded slide frozen mid-transition. The whole swap machinery is gated on
   `enhanced`, so nothing that needs a scroll frame can ship in the state that
   cannot run one. See au-motion-safety.
   ========================================================================== */

export interface CatStep {
  slug: string;
  name: string;
  fsc: string;
  count: number;
  img: string;
  alt: string;
}

/* Scroll distance, in viewport heights, spent advancing PER step after the
   first. The track is `100vh` (the pinned view) plus this for each further step.
   Lower is snappier and shorter; below ~0.5 the fades trip over each other. */
const VH_PER_STEP = 0.62;

export function CategoryScroller({ steps }: { steps: CatStep[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const n = steps.length;

  useEffect(() => setEnhanced(true), []);

  useEffect(() => {
    if (!enhanced) return;
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
      const dist = wrap.offsetHeight - stage.offsetHeight;
      const p = dist > 0 ? Math.min(1, Math.max(0, (stickyTop - rect.top) / dist)) : 0;
      setProgress(p);
      /* `* n` then floor buckets the run into n equal segments; the min clamps
         the p === 1 frame (floor gives n) back onto the last real slide. */
      setActive(Math.min(n - 1, Math.floor(p * n)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enhanced, n]);

  const jumpTo = useCallback(
    (i: number) => {
      const wrap = wrapRef.current;
      const stage = stageRef.current;
      if (!wrap || !stage) return;
      const dist = wrap.offsetHeight - stage.offsetHeight;
      const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
      /* Aim at the MIDDLE of step i's segment, so the target lands squarely on
         that slide rather than on the threshold between two. */
      const targetP = (i + 0.5) / n;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      /* Set the slide immediately so a tap feels instant, and so the control
         still works where there is no scroll track to derive it from — the
         mobile layout, where the rail is a tab bar rather than a progress
         readout. On desktop the scroll below re-derives the same index. */
      setActive(i);
      if (dist > 0) {
        window.scrollTo({
          top: wrap.offsetTop - stickyTop + targetP * dist,
          behavior: reduce ? "auto" : "smooth",
        });
      }
    },
    [n],
  );

  return (
    <div
      className="cat-scroll"
      ref={wrapRef}
      data-enhanced={enhanced || undefined}
      /* A custom property, not `height` — so the mobile media query can ignore
         the tall track (an inline `height` would win over any stylesheet). */
      style={
        enhanced
          ? ({ ["--cat-track-h" as string]: `calc(100vh + ${((n - 1) * VH_PER_STEP * 100).toFixed(2)}vh)` } as React.CSSProperties)
          : undefined
      }
    >
      <div
        className="cat-stage"
        ref={stageRef}
        style={{ ["--cat-progress" as string]: progress }}
      >
        {/* The rail: a numbered tick per step, doubling as the position readout
            and a jump control. The sequence is the ranking (01 is the deepest
            catalogue), so the numerals carry information rather than decorating. */}
        <nav className="cat-rail" aria-label="Featured categories">
          {steps.map((s, i) => (
            <button
              type="button"
              key={s.slug}
              className="cat-rail-tick"
              data-active={i === active || undefined}
              data-done={i < active || undefined}
              aria-current={i === active ? "true" : undefined}
              aria-label={`Show ${s.name}`}
              onClick={() => jumpTo(i)}
            >
              <span className="cat-rail-num">{String(i + 1).padStart(2, "0")}</span>
            </button>
          ))}
          <span className="cat-rail-track" aria-hidden="true">
            <span className="cat-rail-fill" />
          </span>
        </nav>

        {/* The text stack. The active slide is in flow and sizes the panel; the
            rest overlay it, faded out and pulled from the tab order. */}
        <div className="cat-stage-text">
          {steps.map((s, i) => (
            <Link
              className="cat-slide-text"
              key={s.slug}
              data-active={i === active || undefined}
              href={`/browse/categories/${s.slug}`}
              tabIndex={i === active ? undefined : -1}
              aria-hidden={i === active ? undefined : true}
            >
              <span className="cat-slide-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
                <i>&thinsp;/&thinsp;{String(n).padStart(2, "0")}</i>
              </span>
              <span className="cat-slide-name">{s.name}</span>
              <span className="cat-slide-meta">
                <span className="cat-fsc">
                  FSC <b>{s.fsc}</b>
                </span>
                <span className="cat-count">{num(s.count)} parts in stock</span>
              </span>
              <span className="cat-slide-cta">
                Browse this category
                <span aria-hidden="true">&rarr;</span>
              </span>
            </Link>
          ))}
        </div>

        {/* The image stack. All five overlap; the active one fades up over the
            outgoing. The photograph is TREATMENT — the library depicts no valve
            or fastener — so the active slide's alt names only the scene and the
            category's identity stays entirely in the text. See CAT_SCENES. */}
        <div className="cat-stage-media">
          {steps.map((s, i) => (
            <figure
              className="cat-slide-media"
              key={s.slug}
              data-active={i === active || undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/img/categories/${s.img}.jpg`}
                alt={i === active ? s.alt : ""}
                width={1400}
                height={933}
                decoding="async"
              />
            </figure>
          ))}
          <span className="cat-stage-scrim" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

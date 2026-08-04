"use client";

/* ==========================================================================
   THE DESCENT — the scroll-linked driver for the site locator.

   One progress value, taken from the panel's travel up the viewport, and the
   plate descends 100×: 50 km across the panel at the top of the run, 500 m at
   the bottom. The zoom is EXPONENTIAL, not linear, because that is what map
   zoom is — every equal push of the scroll multiplies the scale rather than
   adding to it, and a linear ramp reads as a growing drawing instead of an
   approach.

   Detail is traded for extent on the way down, the way a chart does it: three
   tiers, each a real cell size and a set of range rings, cross-fading so only
   one or two are ever legible at once. The scale bar is sized from the live
   zoom and labelled with the nearest whole 1 / 2 / 5 value, so it states the
   diagram's true scale at every point in the descent rather than decorating it.

   Same idiom as HeroZoom, MissionParallax and CountTally: a null-rendering
   client effect that writes custom properties and lets the stylesheet own every
   appearance. Same five guarantees as CountTally, for the same measured reason
   (a renderer that delivers no IntersectionObserver callbacks and advances no
   animation), and they are worth restating because they are what makes a
   scroll-driven panel safe to ship:

     1. THE ARRIVED STATE IS THE REST STATE. Every property falls back to its
        closest-zoom value, so an unset property is a finished locator.
     2. NOTHING IS WRITTEN UNTIL A FRAME FIRES. Arming happens inside the first
        requestAnimationFrame, so a renderer that never paints never zooms out.
     3. IT ONLY ARMS FROM BELOW THE FOLD. Already on screen — a refresh
        mid-page, the #location anchor — means the plate stays arrived.
     4. A TIMER, NOT A FRAME, OWNS THE FINAL STATE. A wall-clock backstop and a
        visibility handler both land the arrival.
     5. IT LANDS ON ARRIVAL WHEN SCROLLING STOPS, 380ms after the last event, so
        the reader is never left looking at a half-descended plate.

   See au-motion-safety.
   ========================================================================== */

import { useEffect } from "react";

/* The descent, in metres across the panel's long edge. */
const W_FAR = 50000;
const W_NEAR = 500;
/* The viewBox is 2 × HALF metres wide at zoom 1 — keep in step with SiteLocator. */
const VIEW = 500;

/* Tier cross-fades, as windows on the progress. Coarse leaves, mid arrives, fine
   arrives last; at progress 1 the values are 0 / 1 / 1, which is exactly what the
   stylesheet defaults to. */
const TIER_A_OUT: [number, number] = [0.42, 0.6];
const TIER_B_IN: [number, number] = [0.28, 0.46];
const TIER_C_IN: [number, number] = [0.68, 0.88];
/* The crosshair resolving from a dot to a locked mark. */
const MARK_IN: [number, number] = [0.4, 0.82];

/* Scale-bar steps. A real bar picks a whole distance and sizes itself to it,
   rather than taking a fixed width and reporting whatever it happens to span. */
const STEPS = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
const BAR_TARGET = 0.12; /* aim for ~12% of the panel's width */

const SETTLE_IDLE = 380;
const SETTLE_MS = 520;
const BACKSTOP_MS = 6000;

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3);
/* Linear for the descent itself: the plate should track the scroll that is
   driving it. The eased curves are for the things that arrive — the tiers, the
   mark, and the settle. */
const win = (p: number, [a, b]: [number, number], curve = outCubic) =>
  curve(clamp01((p - a) / (b - a)));

const label = (m: number) => (m >= 1000 ? `${m / 1000} km` : `${m} m`);

export function LocatorZoom() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const panel = document.querySelector<HTMLElement>("[data-loc]");
    if (!panel) return;
    const readout = panel.querySelector<HTMLElement>("[data-loc-scale]");

    let eligible = false;
    let armed = false;
    let done = false;
    let hi = 0;
    let raf = 0;
    let idleTimer = 0;
    let backstop = 0;
    let settleFrom = 0;
    let settleStart = 0;

    /* 0 as the panel's top edge appears near the bottom of the viewport, 1 once
       its centre has risen to just above the middle — so the descent finishes
       while the plate is the thing being looked at, not on its way out. */
    const measure = () => {
      const r = panel.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;
      const startTop = vh * 0.95;
      const endTop = vh * 0.45 - r.height / 2;
      const span = Math.min(Math.max(startTop - endTop, vh * 0.5), vh * 1.1);
      return clamp01((startTop - r.top) / span);
    };

    const render = (p: number) => {
      /* Exponential descent. */
      const w = W_FAR * Math.pow(W_NEAR / W_FAR, p);
      panel.style.setProperty("--loc-k", (VIEW / w).toFixed(5));
      panel.style.setProperty("--loc-a", (1 - win(p, TIER_A_OUT)).toFixed(4));
      panel.style.setProperty("--loc-b", win(p, TIER_B_IN).toFixed(4));
      panel.style.setProperty("--loc-c", win(p, TIER_C_IN).toFixed(4));
      panel.style.setProperty("--loc-mark", win(p, MARK_IN).toFixed(4));

      /* Size the bar to a whole distance, then say which one. The value is a
         unitless fraction of the panel width, which the stylesheet turns into
         `100cqw` — see `.loc-scale-bar` for why a percentage cannot work here. */
      const nice =
        STEPS.find((s) => s / w >= BAR_TARGET) ?? STEPS[STEPS.length - 1];
      panel.style.setProperty("--loc-bar", (nice / w).toFixed(4));
      if (readout) readout.textContent = label(nice);
    };

    function detach() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onHidden);
    }

    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(idleTimer);
      window.clearTimeout(backstop);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      detach();
      /* Hand every property back to the stylesheet: arrived IS the CSS default,
         so the cleanest way to be arrived is to have written nothing. */
      delete panel.dataset.locState;
      ["--loc-k", "--loc-a", "--loc-b", "--loc-c", "--loc-mark", "--loc-bar"].forEach(
        (prop) => panel.style.removeProperty(prop),
      );
      if (readout) readout.textContent = label(STEPS[2]); /* 50 m, the arrival */
    };

    const arm = () => {
      armed = true;
      panel.dataset.locState = "descending"; /* scopes will-change — see the CSS */
      backstop = window.setTimeout(finish, BACKSTOP_MS);
    };

    const settle = (now: number) => {
      raf = 0;
      if (done) return;
      if (!settleStart) settleStart = now;
      const t = clamp01((now - settleStart) / SETTLE_MS);
      hi = Math.max(hi, settleFrom + (1 - settleFrom) * outCubic(t));
      render(hi);
      if (t >= 1 || hi >= 1) {
        finish();
        return;
      }
      raf = requestAnimationFrame(settle);
    };

    const startSettle = () => {
      if (done || !armed || raf) return;
      settleFrom = hi;
      settleStart = 0;
      raf = requestAnimationFrame(settle);
    };

    const frame = () => {
      raf = 0;
      if (done) return;
      const p = measure();

      /* Guarantee 3, decided once on the first look. */
      if (!eligible && !armed) {
        if (p > 0.05) {
          done = true;
          detach();
          return;
        }
        eligible = true;
      }

      /* Waiting, and writing nothing: the descent starts when the panel does. */
      if (!armed) {
        if (p <= 0) return;
        arm();
      }

      hi = Math.max(hi, p);
      render(hi);

      if (hi >= 1) {
        finish();
        return;
      }
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(startSettle, SETTLE_IDLE);
    };

    const onScroll = () => {
      if (done || raf) return;
      raf = requestAnimationFrame(frame);
    };

    const onHidden = () => {
      if (document.visibilityState === "hidden") finish();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onHidden);
    raf = requestAnimationFrame(frame);

    return () => {
      finish();
      detach();
    };
  }, []);

  return null;
}

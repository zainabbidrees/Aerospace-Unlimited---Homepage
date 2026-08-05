"use client";

/* ==========================================================================
   THE MAP CAMERA — the arrival zoom, the cursor zoom, and the readout.

   THREE BEHAVIOURS, ONE DRIVER, and that is the point rather than a convenience:
   all three write the SAME transform on the map's zoom group, so they cannot fight
   each other. An earlier version ran the arrival as a scroll-driven CSS animation
   and the cursor zoom in JS; a CSS animation outranks an inline transform, so the
   cursor would have been ignored for as long as the arrival was on screen.

     1. ARRIVAL. When the band reaches the viewport the map plays once from 1.42×
        down to true scale, anchored on the site — a descent onto the address. It is
        a one-shot entrance on a clock, NOT tied to scroll position: the client
        asked for it to play on landing on the section rather than to scrub with the
        wheel (2026-08-05).
     2. CURSOR ZOOM. After that, moving the pointer zooms toward whatever it is
        over. The anchor is the map point under the cursor, so that point stays
        exactly under the cursor as the scale rises — the geometry you are pointing
        at does not slide away from you.
     3. READOUT. The coordinate under the cursor, and — once the pointer stops —
        the nearest named street and how far away it is.

   THE MATHS, because it is the part that silently breaks. `transform-origin: 0 0`
   on the group puts the scale origin at the SVG's own user (0,0) — which is the
   site. So p' = k·p + t, and a point u stays exactly under the cursor when

       t = u(1 − k)

   which is the `translate(...) scale(k)` written below. Everything is in metres,
   because the map is projected at one user unit per metre. This was wrong once: it
   assumed `transform-box: view-box` moved the origin to the viewBox corner, and the
   anchor slid by precisely the offset between the two origins. If the transform is
   ever rewritten, the check that matters is that the map point under the cursor is
   the SAME before and after a zoom.

   COORDINATES ARE COMPUTED, NOT LOOKED UP. A screen point inverted through the
   group's live CTM is a position in metres, and metres convert to degrees exactly —
   correct at any scale, mid-animation included, which is why the readout is read
   off the CTM rather than from the camera state.

   "WHERE YOU ARE POINTING" IS A NEAREST STREET, NOT AN ADDRESS. No reverse
   geocoder ships with this project and no request is made at runtime, so a house
   number under the cursor would be invented — the fiction this band was rebuilt to
   avoid. The nearest named way from the same OSM extract with its distance is the
   derivable form of the same answer, and the distance is always shown because
   "· 8 m" and "· 210 m" are very different claims.

   EVERY FAILURE MODE LANDS ON THE FINISHED MAP. Nothing here is declared in the
   stylesheet: no JS, reduced motion (which skips both zooms and keeps the readout),
   the screenshot renderer and every touch device get true scale, no crosshair, and
   the site's own coordinate stated. See au-motion-safety.
   ========================================================================== */

import { useEffect } from "react";
import { STREETS } from "./site-streets";

/* The projection constants the map was generated with. If these drift from
   SiteMap's, the readout lies. */
const LAT = 33.8149;
const LON = -117.8814;
const M_PER_DEG_LAT = 111320;
const M_PER_DEG_LON = 111320 * Math.cos((LAT * Math.PI) / 180);

/* THE SCALE ORIGIN IS THE SITE, at user (0,0) — measured, not assumed. The first
   version computed against the viewBox's top-left corner on the assumption that
   `transform-box: view-box` moves the origin there; Chrome does not do that for an
   SVG `<g>`, and the anchor slid by exactly (700,280)·(1−k)/k — the offset between
   the two candidate origins, which is how the wrong assumption was identified. The
   anchor test in the verification is the guarantee here, not the spec text. */

const ARRIVE_FROM = 1.42;      /* how close the descent starts */
const ARRIVE_MS = 1150;
const HOVER_K = 1.34;          /* how far the cursor pulls it in */
const EASE = 0.14;             /* per-frame approach for the cursor camera */
const SETTLE_MS = 180;         /* pointer-still delay before naming a street */
const PLAY_LINE = 0.9;         /* band top must cross this much of the viewport */

/* Exponential ease-out: fast off the mark, long settle. Same character as the
   site's --au-ease, in a form a JS clock can use. */
const easeOut = (t: number) => 1 - Math.pow(2, -10 * t);

const fmt = (lat: number, lon: number) =>
  `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"} · ` +
  `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}`;

function segDistSq(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  let x = ax, y = ay;
  const dx = bx - ax, dy = by - ay;
  if (dx || dy) {
    const t = ((px - x) * dx + (py - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) { x = bx; y = by; } else if (t > 0) { x += dx * t; y += dy * t; }
  }
  return (px - x) ** 2 + (py - y) ** 2;
}

function nearestStreet(x: number, y: number) {
  let best = Infinity;
  let name = "";
  for (const [n, lines] of STREETS) {
    for (const flat of lines) {
      for (let i = 2; i < flat.length; i += 2) {
        const d = segDistSq(x, y, flat[i - 2], flat[i - 1], flat[i], flat[i + 1]);
        if (d < best) { best = d; name = n; }
      }
    }
  }
  return name ? { name, m: Math.sqrt(best) } : null;
}

export function MapCamera() {
  useEffect(() => {
    const host = document.querySelector<HTMLElement>("[data-map-frame]");
    if (!host) return;
    const svg = host.querySelector<SVGSVGElement>("svg.smap-svg");
    const zoom = svg?.querySelector<SVGGElement>(".smap-zoom");
    const probe = svg?.querySelector<SVGGElement>(".smap-probe");
    const kEl = host.querySelector<HTMLElement>("[data-read-k]");
    const vEl = host.querySelector<HTMLElement>("[data-read-v]");
    const nEl = host.querySelector<HTMLElement>("[data-read-n]");
    if (!svg || !zoom || !probe || !kEl || !vEl || !nEl) return;

    const still = !window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const restK = kEl.textContent ?? "Site";
    const restV = vEl.textContent ?? "";

    /* Camera state, in map units. `k` is scale; `ax`/`ay` the anchor it scales
       about; the `t` pair is what actually gets written. */
    let k = still ? 1 : ARRIVE_FROM;
    let ax = 0, ay = 0;
    let targetK = 1, targetAx = 0, targetAy = 0;
    let arriving = false;
    let arriveStart = 0;
    let hovering = false;
    let raf = 0;
    let settle = 0;
    let ev: PointerEvent | null = null;

    /* The phase is published on the frame: it is a legitimate styling hook and it
       is the only way to see a state machine's state from outside. */
    const phase = (v: "arriving" | "cursor" | "rest") => { host.dataset.camera = v; };

    const write = () => {
      if (Math.abs(k - 1) < 0.0005) {
        zoom.style.removeProperty("transform");
        zoom.style.removeProperty("will-change");
        return;
      }
      /* Hold the anchor: with the origin at user (0,0), p' = k·p + t, so a point u
         stays put when t = u(1 − k). */
      const tx = ax * (1 - k);
      const ty = ay * (1 - k);
      zoom.style.willChange = "transform";
      zoom.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${k.toFixed(4)})`;
    };

    /* TWO MAPPINGS, AND USING THE WRONG ONE FEEDS BACK ON ITSELF.

       `base` inverts the ROOT svg's CTM, which does not include the camera's own
       transform: it answers "which map point is under this pixel at true scale".
       That is the anchor the camera must use — measuring the anchor through the
       transform the camera just wrote makes it chase itself, and the map slid a
       little further with every frame the pointer moved.

       `live` inverts the ZOOM group's CTM, so it answers "which map point is under
       this pixel right now". That is the readout's truth. With the anchor maths
       correct the two agree — the point under the cursor is the point that was there
       at true scale, at any zoom — which is a useful self-check rather than a
       redundancy. */
    const base = (e: PointerEvent) => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const m = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      return { x: m.x, y: m.y };
    };
    const live = (e: PointerEvent) => {
      const ctm = zoom.getScreenCTM();
      if (!ctm) return null;
      const m = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
      return { x: m.x, y: m.y };
    };

    const tick = (now: number) => {
      raf = 0;

      if (arriving) {
        const p = Math.min(1, (now - arriveStart) / ARRIVE_MS);
        /* easeOut is asymptotic — at p=1 it is 0.999, not 1 — so the end value is
           SET rather than eased into. Without this the map rests at 1.0007 forever,
           and (worse) `arriving` stayed true, which silently disabled the cursor
           zoom for the life of the page. */
        if (p >= 1) {
          arriving = false;
          k = 1; ax = 0; ay = 0;
          targetK = 1; targetAx = 0; targetAy = 0;
          write();
          phase("rest");
          /* Hand straight over if the pointer is already on the map. */
          if (hovering && ev) apply();
          return;
        }
        k = ARRIVE_FROM + (1 - ARRIVE_FROM) * easeOut(p);
        write();
        raf = requestAnimationFrame(tick);
        return;
      }

      /* The cursor camera: approach the target every frame, and stop the loop once
         there is nothing left to move. */
      k += (targetK - k) * EASE;
      ax += (targetAx - ax) * EASE;
      ay += (targetAy - ay) * EASE;
      const moving = Math.abs(targetK - k) > 0.0008 ||
        Math.abs(targetAx - ax) > 0.4 || Math.abs(targetAy - ay) > 0.4;
      if (!moving) { k = targetK; ax = targetAx; ay = targetAy; }
      write();
      phase(targetK > 1 ? "cursor" : "rest");
      if (moving) raf = requestAnimationFrame(tick);
    };

    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    /* ---- 2 · the cursor camera + 3 · the readout ------------------------ */
    const apply = () => {
      if (!ev) return;
      const at = live(ev);        /* what the reader is pointing at */
      const anchor = base(ev);    /* what the camera should hold still */
      if (!at || !anchor) return;

      const lat = LAT - at.y / M_PER_DEG_LAT;    /* y is south-positive */
      const lon = LON + at.x / M_PER_DEG_LON;
      host.dataset.probe = "live";
      kEl.textContent = "Cursor";
      vEl.textContent = fmt(lat, lon);

      /* The crosshair lives outside the camera, so it is placed in root space —
         which is the anchor we already have. */
      probe.setAttribute("transform", `translate(${anchor.x.toFixed(1)} ${anchor.y.toFixed(1)})`);

      /* Zoom toward the point being pointed at — but never while the descent is
         still playing, or the two would argue over the anchor. */
      if (!still && !arriving) {
        targetK = HOVER_K;
        targetAx = anchor.x;
        targetAy = anchor.y;
        kick();
      }

      window.clearTimeout(settle);
      nEl.textContent = "";
      settle = window.setTimeout(() => {
        const n = nearestStreet(at.x, at.y);
        nEl.textContent = n ? `${n.name} · ${Math.round(n.m)} m away` : "";
        host.dataset.probe = "settled";
      }, SETTLE_MS);
    };

    /* ---- 1 · the arrival ------------------------------------------------
       Position, not scroll progress: the descent plays ONCE, when the band has
       come far enough up the viewport to be looked at. A rAF poll runs only until
       it fires — the same construction as the enquiry sheet's entrance, and for
       the same reason (see SheetReveal: the shared reveal observer's blanket
       timeout plays below-fold entrances off-screen). */
    let watch = 0;
    const armArrival = () => {
      if (still) return;                        /* reduced motion: already at rest */
      arriving = false;
      k = ARRIVE_FROM;
      ax = 0; ay = 0;                            /* anchored on the site */
      write();
      phase("arriving");
      const look = () => {
        watch = 0;
        if (host.getBoundingClientRect().top < window.innerHeight * PLAY_LINE) {
          arriving = true;
          arriveStart = performance.now();
          phase("arriving");
          kick();
          return;
        }
        watch = requestAnimationFrame(look);
      };
      watch = requestAnimationFrame(look);
    };
    armArrival();

    let moveRaf = 0;
    const onMove = (e: PointerEvent) => {
      if (!fine || e.pointerType === "touch") return;
      hovering = true;
      ev = e;
      if (!moveRaf) moveRaf = requestAnimationFrame(() => { moveRaf = 0; apply(); });
    };

    const onLeave = () => {
      hovering = false;
      ev = null;
      window.clearTimeout(settle);
      if (moveRaf) cancelAnimationFrame(moveRaf);
      moveRaf = 0;
      delete host.dataset.probe;
      kEl.textContent = restK;
      vEl.textContent = restV;
      nEl.textContent = "";
      /* Pull back out to true scale rather than snapping — the map should look put
         down, not dropped. */
      targetK = 1;
      targetAx = ax; targetAy = ay;
      kick();
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      if (watch) cancelAnimationFrame(watch);
      if (moveRaf) cancelAnimationFrame(moveRaf);
      window.clearTimeout(settle);
      delete host.dataset.probe;
      delete host.dataset.camera;
      zoom.style.removeProperty("transform");
      zoom.style.removeProperty("will-change");
    };
  }, []);

  return null;
}

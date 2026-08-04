"use client";

/* ==========================================================================
   THE TRACKING RETICLE — the pointer-linked driver for the site locator.

   The reticle follows the cursor across the plate with a faint glow behind it,
   and reports its range from the site as it goes. The site mark itself does not
   move: it IS the address, the rings are measured from it and the readout states
   its coordinates, so putting it under the pointer would make the panel assert a
   position it cannot back. A fixed datum and a moving cursor is what a scope
   does. See the .loc-cursor block in ux.css.

   SMOOTHNESS IS EXPONENTIAL SMOOTHING, NOT A CSS TRANSITION, and the difference
   is the whole feel of this. A transition on the transform restarts on every
   frame's new value, so the reticle chases a target that keeps moving and the lag
   compounds into rubber-banding — and it cannot be tuned, because the duration
   applies to a distance that changes every frame. This integrates toward the
   pointer at a fixed time constant instead:

       alpha = 1 - exp(-dt / TAU)

   which is frame-rate independent (a 120Hz display and a janky 30fps frame get
   the same motion per millisecond, not the same motion per frame) and has one
   legible knob. TAU is the time to close ~63% of the remaining gap.

   THE LOOP ONLY RUNS WHEN THERE IS SOMETHING TO DO. It starts on pointer entry
   and stops once the reticle has caught up and the pointer has left — an idle
   rAF on a page nobody is touching is a battery cost for nothing.

   MOTION-SAFE, and the easy case: this is an affordance, not content. Every
   property defaults to absent in CSS, nothing is written until a pointer actually
   moves over the panel, and it bails out entirely under reduced motion or on a
   coarse pointer — where a reticle that appears on tap and sticks there reads as
   a rendering fault. No-JS, the screenshot renderer and touch all get the plate
   exactly as it is composed. See au-motion-safety.
   ========================================================================== */

import { useEffect } from "react";

/* 90ms closes most of the gap inside a tenth of a second — it reads as weight
   rather than as delay. At 40ms the smoothing stops being visible and the reticle
   is just pinned to the cursor; past ~160ms it starts to feel like it is being
   dragged on elastic. */
const TAU = 90;

/* Below this many user units of remaining distance the follow is finished, so the
   loop can stop instead of chasing a sub-pixel forever. */
const EPSILON = 0.15;

export function LocatorCursor() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* A coarse pointer has no hover to track: the reticle would land on tap and
       then sit there with nothing moving it. */
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const panel = document.querySelector<HTMLElement>("[data-loc]");
    if (!panel) return;
    const svg = panel.querySelector<SVGSVGElement>("svg.loc-plate");
    if (!svg) return;
    const range = panel.querySelector<HTMLElement>("[data-loc-range]");

    /* LISTEN ON THE PARENT, NOT THE PANEL. The glass address plate is a SIBLING of
       the panel that sits on top of it, so a pointer crossing the plate genuinely
       leaves the panel and fired `pointerleave` — the reticle dropped out halfway
       across its own diagram, which is the opposite of "follows wherever the mouse
       goes". Listening on the shared ancestor keeps the stream unbroken, and a
       hit-test against the panel's own rect below decides presence instead. */
    const host = panel.parentElement ?? panel;

    /* Current and target position, in the plate's own user units (metres at zoom
       1). Both start at the site, so the reticle's first appearance grows out of
       the datum rather than flying in from a corner. */
    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;
    let inside = false;
    let raf = 0;
    let last = 0;

    /* Client pixels to user units. `getScreenCTM()` on the <svg> already carries
       the viewBox transform, including whatever `preserveAspectRatio="slice"`
       resolved to at this panel ratio — which is why this is a matrix inverse and
       not arithmetic on the bounding rect. Hand-computing it would have to
       reproduce the slice's own scale-and-crop, and get it wrong on every resize. */
    const toUser = (clientX: number, clientY: number) => {
      const m = svg.getScreenCTM();
      if (!m) return null;
      const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
      return { x: p.x, y: p.y };
    };

    /* Metres from the site. The geometry is authored in metres and `.loc-field`
       is scaled by --loc-k, so a distance of d user units is d / k metres — which
       makes this a true reading at every point in the scroll descent rather than
       a number that only happens to be right at arrival. */
    const metres = (ux: number, uy: number) => {
      const k =
        parseFloat(getComputedStyle(panel).getPropertyValue("--loc-k")) || 1;
      return Math.hypot(ux, uy) / k;
    };

    const label = (m: number) =>
      m >= 1000 ? `${(m / 1000).toFixed(m >= 10000 ? 0 : 1)} km` : `${Math.round(m)} m`;

    const write = () => {
      panel.style.setProperty("--loc-cx", cx.toFixed(2));
      panel.style.setProperty("--loc-cy", cy.toFixed(2));
      if (range) range.textContent = `${label(metres(cx, cy))} from site`;
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;

      /* Frame-rate independent exponential approach. */
      const alpha = 1 - Math.exp(-dt / TAU);
      cx += (tx - cx) * alpha;
      cy += (ty - cy) * alpha;
      write();

      const settled = Math.hypot(tx - cx, ty - cy) < EPSILON;
      if (inside || !settled) {
        raf = requestAnimationFrame(frame);
      } else {
        /* Caught up and the pointer is gone: snap out the last fraction and let
           the loop end rather than idling. */
        cx = tx;
        cy = ty;
        write();
        last = 0;
        delete panel.dataset.locCursor;
      }
    };

    const start = () => {
      if (!raf) {
        last = 0;
        panel.dataset.locCursor = "live"; /* scopes will-change — see the CSS */
        raf = requestAnimationFrame(frame);
      }
    };

    /* Declared before `onMove` rather than hoisted below it: as a `function`
       declaration TypeScript stops narrowing `panel` from the null guard above,
       because a hoisted binding could in principle be called before it. */
    const onLeave = () => {
      if (!inside) return;
      inside = false;
      panel.style.setProperty("--loc-cursor", "0");
      /* The target stays where it was, so the reticle fades out in place instead
         of sliding back to the site while it disappears. */
      start();
    };

    const onMove = (e: PointerEvent) => {
      /* Presence is a hit-test on the panel's own box, not on what the pointer
         happens to be over — so the reticle keeps tracking under the address
         plate and only leaves when the pointer leaves the diagram. */
      const r = panel.getBoundingClientRect();
      const over =
        e.clientX >= r.left && e.clientX <= r.right &&
        e.clientY >= r.top && e.clientY <= r.bottom;

      if (!over) {
        if (inside) onLeave();
        return;
      }

      const p = toUser(e.clientX, e.clientY);
      if (!p) return;
      tx = p.x;
      ty = p.y;
      if (!inside) {
        inside = true;
        panel.style.setProperty("--loc-cursor", "1");
      }
      start();
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    /* A pointer that leaves the window without crossing the host's edge (out of
       the top of the viewport, into the devtools) never fires pointerleave. */
    document.addEventListener("pointerleave", onLeave);

    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      delete panel.dataset.locCursor;
      /* Hand every property back to the stylesheet: absent IS the CSS default. */
      ["--loc-cx", "--loc-cy", "--loc-cursor"].forEach((p) =>
        panel.style.removeProperty(p),
      );
      if (range) range.textContent = "";
    };
  }, []);

  return null;
}

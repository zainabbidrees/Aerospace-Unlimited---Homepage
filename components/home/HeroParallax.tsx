"use client";

/* ==========================================================================
   Hero pointer-parallax — the "living depth" of the landing.

   The copy floats a few pixels against the photograph as the pointer moves, so
   the hero reads as a lit scene with depth rather than a flat still. It is pure
   enhancement and can never strand content:

     · No JS, or a JS-less renderer → the custom properties are never set, so
       `translate3d(var(--hero-cx, 0px), …)` resolves to 0 and the copy sits
       exactly where the layout puts it.
     · Coarse pointers (touch) and reduced-motion visitors are opted out
       entirely — there is nothing to hover, and no motion to be surprised by.

   Nothing is animated here whose failure state is "gone": the only property
   touched is a small translate on already-visible copy. See au-motion-safety.
   ========================================================================== */

import { useEffect } from "react";

export function HeroParallax() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    const copy = hero?.querySelector<HTMLElement>(".hero-enter");
    if (!hero || !copy) return;

    // Depth is a pointer affordance: no fine pointer, or reduced-motion, and
    // there is nothing to do — the copy stays exactly in place.
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let raf = 0;
    let tx = 0;
    let ty = 0;

    const apply = () => {
      raf = 0;
      copy.style.setProperty("--hero-cx", `${tx.toFixed(2)}px`);
      copy.style.setProperty("--hero-cy", `${ty.toFixed(2)}px`);
    };

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      // −0.5 … 0.5 from the hero's centre, scaled to a gentle few-pixel drift.
      tx = ((e.clientX - r.left) / r.width - 0.5) * 20;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 13;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}

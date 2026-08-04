"use client";

import { useEffect } from "react";

/* ==========================================================================
   IndexFilter — filtering and letter-tracking for a server-rendered index.

   THE ARCHITECTURE DECISION, because it is the interesting part. The obvious
   build is a client component that owns the list and re-renders it as you type.
   This does the opposite: the ENTIRE index is rendered on the server, and this
   component only ever hides rows that do not match.

   Three things fall out of that, and all three matter here:

     1. THE INDEX IS REAL WITHOUT JS. Every manufacturer and every platform is in
        the served HTML, with a working link. A crawler, a screenshot renderer and
        a visitor with a failed bundle all get the complete directory — which for
        an A–Z index that exists largely to be found from a search engine is the
        whole point of the page.
     2. NOTHING IS EVER GATED ON THIS FILE. A row's default state is visible; the
        only thing written here is `hidden` on rows that failed a filter the user
        typed. If this never mounts, the page is a complete index rather than an
        empty one. Same rule as everything else on the site — see
        au-motion-safety.
     3. THE ENTRANCE ANIMATIONS STILL WORK. CueReveal walks the DOM once on
        mount; a client-rendered list would not exist yet when it looks, so every
        group would arrive unanimated. Server-rendered groups are there to be
        cued.

   WHAT IT DOES, on top of filtering: it tracks which letter group the reader is
   currently inside and marks that letter current in the A–Z rail, so the rail is
   a position indicator rather than only a set of jump links. That is the page's
   real motion — an index is an Operate surface, where knowing where you are
   outranks anything decorative.

   MARKUP CONTRACT. The page provides:
     [data-index-filter]  the search input
     [data-index-count]   a live region for the result count
     [data-index-empty]   the no-match block, hidden until it is needed
     [data-index-group]   one per letter, with data-letter
     [data-index-row]     one per entry, with data-terms (lowercased haystack)
     [data-index-letter]  one per rail letter, with data-letter
   ========================================================================== */

export function IndexFilter({
  /* What one row is called in the count — "manufacturer", "platform". Passed in
     rather than guessed, because the count is user-facing copy. */
  noun,
  nounPlural,
}: {
  noun: string;
  nounPlural: string;
}) {
  useEffect(() => {
    const input = document.querySelector<HTMLInputElement>("[data-index-filter]");
    const countEl = document.querySelector<HTMLElement>("[data-index-count]");
    const emptyEl = document.querySelector<HTMLElement>("[data-index-empty]");
    const groups = Array.from(document.querySelectorAll<HTMLElement>("[data-index-group]"));
    const rows = Array.from(document.querySelectorAll<HTMLElement>("[data-index-row]"));
    const letters = Array.from(document.querySelectorAll<HTMLElement>("[data-index-letter]"));
    if (!rows.length) return;

    const total = rows.length;

    /* ---- Filtering ----------------------------------------------------- */

    const apply = (raw: string) => {
      const q = raw.trim().toLowerCase();
      let shown = 0;

      for (const row of rows) {
        const hit = !q || (row.dataset.terms ?? "").includes(q);
        row.hidden = !hit;
        if (hit) shown++;
      }

      /* A letter group whose every row is hidden is hidden itself, so the reader
         never scrolls past a heading with nothing under it. */
      const present = new Set<string>();
      for (const g of groups) {
        const any = Array.from(g.querySelectorAll<HTMLElement>("[data-index-row]")).some(
          (r) => !r.hidden,
        );
        g.hidden = !any;
        if (any && g.dataset.letter) present.add(g.dataset.letter);
      }

      /* Rail letters with nothing behind them are shown but inert. A buyer
         learns the index is complete rather than wondering whether it failed to
         load — which is what removing them would suggest. */
      for (const l of letters) {
        const has = present.has(l.dataset.letter ?? "");
        l.toggleAttribute("data-empty", !has);
        if (has) l.removeAttribute("aria-disabled");
        else l.setAttribute("aria-disabled", "true");
      }

      if (countEl) {
        countEl.textContent =
          shown === total
            ? `${total} ${nounPlural}`
            : `${shown} of ${total} ${shown === 1 ? noun : nounPlural}`;
      }
      if (emptyEl) emptyEl.hidden = shown > 0;
    };

    const onInput = () => apply(input?.value ?? "");
    input?.addEventListener("input", onInput);

    /* ---- Letter tracking ----------------------------------------------- */

    /* The current group is the last one whose heading has passed the reader's
       eye line. A fifth of the viewport down is where a heading reads as "the
       section I am in" rather than "the section coming up". */
    const EYE = 0.22;
    let raf = 0;

    const track = () => {
      raf = 0;
      const line = (window.innerHeight || 1) * EYE;
      let current = "";
      for (const g of groups) {
        if (g.hidden) continue;
        if (g.getBoundingClientRect().top <= line) current = g.dataset.letter ?? "";
      }
      for (const l of letters) {
        l.toggleAttribute("data-current", l.dataset.letter === current && current !== "");
      }
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(track);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    raf = window.requestAnimationFrame(track);

    return () => {
      input?.removeEventListener("input", onInput);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
      /* Leave nothing hidden and no letter marked. The rest state of this page
         is the complete index. */
      rows.forEach((r) => {
        r.hidden = false;
      });
      groups.forEach((g) => {
        g.hidden = false;
      });
      letters.forEach((l) => {
        l.removeAttribute("data-current");
        l.removeAttribute("data-empty");
        l.removeAttribute("aria-disabled");
      });
      if (emptyEl) emptyEl.hidden = true;
    };
  }, [noun, nounPlural]);

  return null;
}

"use client";

import { useEffect } from "react";

/* ==========================================================================
   ListSort — keyword filter + a sort control for a flat, server-rendered list.

   Same progressive-enhancement contract as IndexFilter: the whole list is in the
   served HTML (complete without JS, in the default sort order the server chose),
   and this only ever reorders rows and hides the ones a filter rejects. If it
   never mounts, the page is the complete, sorted list.

   MARKUP CONTRACT — the page provides:
     [data-list]          the container that holds the rows
     [data-list-row]      one per entry, carrying:
        data-terms        lowercased keyword haystack
        data-name         the label, for name sorts
        data-count        a number, for size sorts
     [data-list-filter]   the keyword input
     [data-list-sort]     a <select> whose values are the sort keys below
     [data-list-count]    a live region for the result count
     [data-list-empty]    the no-match block, hidden until needed
   ========================================================================== */

type Cmp = (a: HTMLElement, b: HTMLElement) => number;

const name = (el: HTMLElement) => el.dataset.name ?? "";
const count = (el: HTMLElement) => Number(el.dataset.count) || 0;

const COMPARATORS: Record<string, Cmp> = {
  "count-desc": (a, b) => count(b) - count(a) || name(a).localeCompare(name(b)),
  "count-asc": (a, b) => count(a) - count(b) || name(a).localeCompare(name(b)),
  "name-asc": (a, b) => name(a).localeCompare(name(b)),
  "name-desc": (a, b) => name(b).localeCompare(name(a)),
};

export function ListSort({
  noun,
  nounPlural,
}: {
  noun: string;
  nounPlural: string;
}) {
  useEffect(() => {
    const list = document.querySelector<HTMLElement>("[data-list]");
    const input = document.querySelector<HTMLInputElement>("[data-list-filter]");
    const select = document.querySelector<HTMLSelectElement>("[data-list-sort]");
    const countEl = document.querySelector<HTMLElement>("[data-list-count]");
    const emptyEl = document.querySelector<HTMLElement>("[data-list-empty]");
    if (!list) return;
    const rows = Array.from(list.querySelectorAll<HTMLElement>("[data-list-row]"));
    if (!rows.length) return;

    const total = rows.length;
    const docOrder = rows.slice();

    const sort = (key: string) => {
      const cmp = COMPARATORS[key] ?? COMPARATORS["count-desc"];
      for (const r of docOrder.slice().sort(cmp)) list.appendChild(r);
    };

    const filter = () => {
      const q = (input?.value ?? "").trim().toLowerCase();
      let shown = 0;
      for (const r of rows) {
        const hit = !q || (r.dataset.terms ?? "").includes(q);
        r.hidden = !hit;
        if (hit) shown++;
      }
      if (countEl) {
        countEl.textContent =
          shown === total ? `${total} ${nounPlural}` : `${shown} of ${total} ${nounPlural}`;
      }
      if (emptyEl) emptyEl.hidden = shown > 0;
    };

    const onSort = () => sort(select?.value ?? "count-desc");
    const onInput = () => filter();
    select?.addEventListener("change", onSort);
    input?.addEventListener("input", onInput);

    /* Match whatever the control is set to on load (the server already renders
       the default order, but this keeps the two in step after a bfcache restore). */
    sort(select?.value ?? "count-desc");

    return () => {
      select?.removeEventListener("change", onSort);
      input?.removeEventListener("input", onInput);
      for (const r of docOrder) list.appendChild(r);
      rows.forEach((r) => {
        r.hidden = false;
      });
      if (emptyEl) emptyEl.hidden = true;
    };
  }, [noun, nounPlural]);

  return null;
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ==========================================================================
   FacetFilter — a multi-facet filter panel that enhances a server-rendered
   parts table in place.

   Same architecture as IndexFilter (see that file): the ENTIRE table is rendered
   on the server and this only ever hides the rows that fail a filter. Three
   consequences, all deliberate:

     1. The table is real without JS — every part, every link, in the served HTML.
     2. Nothing is gated on this file. A row's default state is visible; only a
        row that fails an active filter gets `hidden`. If this never mounts, the
        page is the complete listing. Same rule as everything else — au-motion-safety.
     3. CueReveal still cues the server-rendered rows on mount.

   It reuses the existing filter design (`.filters` / `.card.resfilter` /
   `.resopt`) — this adds facets and interactivity, it does not restyle the bar.

   MARKUP CONTRACT — the page provides:
     #<targetId>            wraps the rows
     [data-facet-row]       one per part row, carrying:
        data-f-<key>="a|b"  a pipe-joined value list per facet key
        data-terms          lowercased keyword haystack (optional; falls back to
                            the row's text)
     [data-facet-status]    optional live region for the shown/total count
     [data-facet-empty]     optional no-match block, hidden until needed
   ========================================================================== */

export interface FacetSpec {
  /* Reads `data-f-<key>` off each row. */
  key: string;
  /* The card heading — user-facing copy. */
  label: string;
  /* A fixed value order (e.g. stock: in → limited → quote). Unlisted values sort
     after, by count then alpha. */
  order?: string[];
  /* Value → display label, when the stored value is a code (stock). */
  labels?: Record<string, string>;
  /* Draw the availability status dot before the label, coloured by the value. */
  dot?: boolean;
}

type Options = { value: string; label: string; count: number }[];

const Check = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true">
    <path d="M2.5 6.2 5 8.6l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function FacetFilter({
  targetId,
  facets,
  noun = "line",
  nounPlural = "lines",
  search = true,
}: {
  targetId: string;
  facets: FacetSpec[];
  noun?: string;
  nounPlural?: string;
  search?: boolean;
}) {
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  const [query, setQuery] = useState("");
  const rowsRef = useRef<HTMLElement[]>([]);
  const [facetOptions, setFacetOptions] = useState<Record<string, Options>>({});
  const [total, setTotal] = useState(0);

  /* ---- Read the server-rendered rows once, build the facet option lists ---- */
  useEffect(() => {
    const root = document.getElementById(targetId);
    if (!root) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-facet-row]"));
    if (!rows.length) return;
    rowsRef.current = rows;
    setTotal(rows.length);

    const opts: Record<string, Options> = {};
    for (const f of facets) {
      const counts = new Map<string, number>();
      for (const row of rows) {
        const raw = row.getAttribute(`data-f-${f.key}`) ?? "";
        for (const v of raw.split("|").map((s) => s.trim()).filter(Boolean)) {
          counts.set(v, (counts.get(v) ?? 0) + 1);
        }
      }
      /* A facet with fewer than two distinct values can't narrow anything —
         drop it rather than show a one-option panel. */
      if (counts.size < 2) continue;

      const list: Options = [...counts.entries()].map(([value, count]) => ({
        value,
        label: f.labels?.[value] ?? value,
        count,
      }));
      list.sort((a, b) => {
        if (f.order) {
          const ia = f.order.indexOf(a.value);
          const ib = f.order.indexOf(b.value);
          if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        }
        return b.count - a.count || a.label.localeCompare(b.label);
      });
      opts[f.key] = list;
    }
    setFacetOptions(opts);
    setReady(true);
  }, [targetId, facets]);

  /* ---- Apply the current selection to the rows ---- */
  useEffect(() => {
    if (!ready) return;
    const rows = rowsRef.current;
    const q = query.trim().toLowerCase();
    const activeKeys = Object.keys(selected).filter((k) => selected[k]?.size);

    let shown = 0;
    for (const row of rows) {
      let hit = true;

      if (q) {
        const hay = row.getAttribute("data-terms") ?? row.textContent ?? "";
        if (!hay.toLowerCase().includes(q)) hit = false;
      }

      if (hit) {
        for (const key of activeKeys) {
          const want = selected[key];
          const have = (row.getAttribute(`data-f-${key}`) ?? "")
            .split("|")
            .map((s) => s.trim());
          if (![...want].some((v) => have.includes(v))) {
            hit = false;
            break;
          }
        }
      }

      row.hidden = !hit;
      if (hit) shown++;
    }

    /* On a grouped listing (e.g. NSNs by leading digit), a group whose every row
       is now hidden is hidden itself, so the reader never meets a heading with
       nothing under it. No-op on flat tables, which have no groups. */
    const root = document.getElementById(targetId);
    if (root) {
      for (const g of Array.from(root.querySelectorAll<HTMLElement>("[data-facet-group]"))) {
        const any = Array.from(g.querySelectorAll<HTMLElement>("[data-facet-row]")).some(
          (r) => !r.hidden,
        );
        g.hidden = !any;
      }
    }

    const total = rows.length;
    const statusEl = document.querySelector<HTMLElement>("[data-facet-status]");
    if (statusEl) {
      statusEl.innerHTML =
        shown === total
          ? `<b>${total}</b> ${total === 1 ? noun : nounPlural} shown`
          : `<b>${shown}</b> of ${total} ${nounPlural}`;
    }
    const emptyEl = document.querySelector<HTMLElement>("[data-facet-empty]");
    if (emptyEl) emptyEl.hidden = shown > 0;

    return () => {
      /* Rest state is the complete listing. */
      rows.forEach((r) => (r.hidden = false));
      if (root) {
        for (const g of Array.from(root.querySelectorAll<HTMLElement>("[data-facet-group]"))) {
          g.hidden = false;
        }
      }
      if (emptyEl) emptyEl.hidden = true;
    };
  }, [ready, selected, query, noun, nounPlural]);

  const toggle = (key: string, value: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      const set = new Set(next[key] ?? []);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      next[key] = set;
      return next;
    });
  };

  const activeCount = useMemo(
    () => Object.values(selected).reduce((n, s) => n + (s?.size ?? 0), 0) + (query ? 1 : 0),
    [selected, query],
  );

  const clearAll = () => {
    setSelected({});
    setQuery("");
  };

  const shownFacets = facets.filter((f) => facetOptions[f.key]?.length);
  /* Only worth showing when a facet can actually narrow the list, or the list is
     long enough that a keyword box earns its place. Otherwise the aside is left
     empty and CSS collapses the layout back to a single column — so a short
     table never gets a dead sidebar gutter. */
  const showSearch = search && total >= 6;
  const useful = shownFacets.length > 0 || showSearch;

  return (
    <aside className="filters" aria-label="Filter results">
      {ready && useful ? (
        <div className="card resfilter facetbar" data-cue>
          <div className="facetbar-head">
            <p className="u-caption u-body-strong">Filters</p>
            {activeCount ? (
              <button type="button" className="facet-clear" onClick={clearAll}>
                Clear{activeCount > 1 ? ` (${activeCount})` : ""}
              </button>
            ) : null}
          </div>

          {showSearch ? (
            <div className="field facet-search">
              <label className="u-visually-hidden" htmlFor={`${targetId}-kw`}>
                Filter these results by keyword
              </label>
              <input
                id={`${targetId}-kw`}
                type="search"
                placeholder="Keyword — part no, item…"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          ) : null}

          {shownFacets.map((f) => {
            const options = facetOptions[f.key];
            const sel = selected[f.key];
            return (
              <div className="facetgroup" key={f.key}>
                <p className="facetgroup-h u-caption u-body-strong">{f.label}</p>
                <ul className={`resfilter-list${options.length > 7 ? " resfilter-list--scroll" : ""}`}>
                  {options.map((o) => {
                    const on = sel?.has(o.value) ?? false;
                    return (
                      <li key={o.value}>
                        <button
                          type="button"
                          className="resopt"
                          data-on={on ? "" : undefined}
                          aria-pressed={on}
                          onClick={() => toggle(f.key, o.value)}
                        >
                          <span className="resopt-t">
                            <span className="resopt-check" aria-hidden="true">
                              <Check />
                            </span>
                            {f.dot ? (
                              <i className="stock resopt-dot" data-stock={o.value} aria-hidden="true" />
                            ) : null}
                            {o.label}
                          </span>
                          <span className="resopt-n">{o.count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      ) : null}
    </aside>
  );
}

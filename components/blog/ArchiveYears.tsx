"use client";

/* ==========================================================================
   Archive years — each year is a click-to-expand dropdown. Collapsed to just
   the year bar, it opens on click with a height animation to reveal that
   year's articles.

   MOTION-SAFE by the same construction as ScrollReveal / HotStock: on the
   server and on first paint EVERY year is open, so with no JS — or in a
   screenshot renderer that never hydrates — the whole archive is present and
   readable. Only after this component mounts (proof JS runs) do the years
   collapse to "just years" and the toggle come alive. The collapse is the
   enhancement; it never gates access to the content.
   ========================================================================== */

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDateShort } from "@/lib/blog";

type Row = { slug: string; title: string; date: string; category: string };
type YearGroup = { year: string; posts: Row[] };

export function ArchiveYears({ years }: { years: YearGroup[] }) {
  // Start with every year open so the server render and first paint show the
  // full archive (see the no-JS note above).
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(years.map((g) => g.year)),
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Collapse the moment JS is proven to run...
    setOpen(new Set());
    // ...then arm the transitions one painted frame later, so this first
    // collapse snaps shut instead of animating down the whole list on load.
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setReady(true)),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = (year: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });

  return (
    <>
      {years.map((g) => {
        const isOpen = open.has(g.year);
        const panelId = `barch-panel-${g.year}`;
        return (
          <section
            className="barch"
            data-open={isOpen ? "true" : "false"}
            data-ready={ready ? "true" : undefined}
            key={g.year}
          >
            <h3 className="barch-yh">
              <button
                type="button"
                className="barch-year"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(g.year)}
              >
                <span className="barch-year-n">{g.year}</span>
                <i className="barch-rule" aria-hidden="true" />
                <em>
                  {g.posts.length} {g.posts.length === 1 ? "article" : "articles"}
                </em>
                <svg
                  className="barch-chev"
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>

            <div className="barch-panel" id={panelId} role="region">
              <div className="barch-panel-inner">
                <ol className="barch-list">
                  {g.posts.map((p) => (
                    <li key={p.slug}>
                      <Link className="barch-row" href={`/blog/${p.slug}`}>
                        <span className="barch-date u-mono">
                          {formatDateShort(p.date)}
                        </span>
                        <span className="barch-title">{p.title}</span>
                        <span className="barch-cat">{p.category}</span>
                        <span className="barch-go" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

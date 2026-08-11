"use client";

/* ==========================================================================
   Hot stock — four featured ready-to-ship parts around a central photograph.

   Built to a supplied reference: a centered heading, then two cards, a tall
   image, and two more cards. "Ready to ship" means in stock, so the pool is
   in-stock parts only, and the four shown are the deepest-shelf lines — the
   cards open on real quantity rather than whatever happened to sort first. A
   buyer can start an RFQ for any of them straight from the homepage; the rest
   of the shelf is one click away at "Full catalog".

   The earlier airframe tabs are dropped with this composition, which has room
   for four parts, not a per-platform list — see the section head above and the
   full catalog link below for the routes that carried that browsing.
   ========================================================================== */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PARTS } from "@/lib/data";
import { num } from "@/lib/format";
import { STOCK_LABEL } from "@/lib/stock";
import { AddToQuoteButton } from "@/components/PartRow";

// The deepest four in-stock lines. Sorted on a COPY: `sort` mutates and PARTS
// is a shared module-level export the rest of the site reads in source order.
const FEATURED = [...PARTS]
  .filter((p) => p.stock === "in")
  .sort((a, b) => b.qty - a.qty)
  .slice(0, 4);

export function HotStock() {
  /* Scroll-reveal, staggered. Motion-safe by construction: the phase is null on
     the server and on first paint, so with no JS — or a renderer that never
     fires an observer — the section renders in its final, fully visible state
     and nothing is gated behind an event that might not arrive. The client ARMS
     the entrance (hides the pieces) after mount while the section is still below
     the fold, then plays it when it scrolls into view. A timeout is the failsafe.
     See au-motion-safety. */
  const rootRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"armed" | "in" | null>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setPhase("armed");
    const show = () => setPhase("in");
    const failsafe = window.setTimeout(show, 1800);
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            show();
            io?.disconnect();
            window.clearTimeout(failsafe);
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(el);
    } else {
      show();
    }
    return () => {
      io?.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <div className="hot" ref={rootRef} data-phase={phase ?? undefined}>
      <div className="hot-grid">
        {FEATURED.map((p) => (
          <article className="hot-card" key={p.pn}>
            {/* The reference's cards lead with a small mark. A part-type icon
                would be a guess, so the slot carries the stock state instead —
                real information, and the one fact a "ready to ship" card must
                make good on. */}
            <span className="stock hot-card-stock" data-stock={p.stock}>
              {STOCK_LABEL[p.stock]}
              {p.stock !== "quote" ? ` · ${num(p.qty)} ea` : ""}
            </span>
            <Link className="hot-card-pn" href={`/part/${encodeURIComponent(p.pn)}`}>
              {p.pn}
            </Link>
            <p className="hot-card-desc">{p.desc}</p>
            <div className="hot-card-actions">
              <AddToQuoteButton part={p} />
              <Link
                className="btn btn-primary btn-sm"
                href={`/rfq?pn=${encodeURIComponent(p.pn)}&instant=1`}
              >
                Request a Quote
              </Link>
            </div>
          </article>
        ))}

        {/* The composition's anchor — treatment, not evidence: a ramp scene that
            carries the section's mood without claiming to picture any listed
            part, so it takes no caption. */}
        <figure className="hot-figure">
          <img
            src="/img/nsn/bizjet-dusk.jpg"
            alt="A business jet on the ramp at dusk, seen head-on against the last light"
            width={600}
            height={800}
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>

      {/* Four parts is a thin slice of the shelf; the full catalog is the route
          to everything else. */}
      <p className="hot-more">
        <Link className="btn btn-secondary" href="/part-types">
          Full catalog
        </Link>
      </p>
    </div>
  );
}

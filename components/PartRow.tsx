"use client";

/* ==========================================================================
   Part row rendering — one shape, used everywhere.
   ========================================================================== */

import Link from "next/link";
import type { Part } from "@/lib/data";
import { STOCK_LABEL } from "@/lib/stock";
import { num } from "@/lib/format";
import { useQuote } from "./QuoteProvider";
import { Highlight } from "./Highlight";

export function AddToQuoteButton({ part }: { part: Part }) {
  const { has, toggle, ready } = useQuote();
  const inList = ready && has(part.pn);

  /* Both states stay quiet. This used to promote the added state to
     `btn-secondary` — a filled navy slab — so confirming the *secondary*
     action made it heavier than the Instant RFQ primary sitting beside it,
     and the row's hierarchy inverted the moment the buyer used it. */
  return (
    <button
      className={`btn btn-text btn-sm${inList ? " is-added" : ""}`}
      type="button"
      onClick={() => toggle(part)}
    >
      {inList ? "✓ In quote list" : "Add to quote"}
    </button>
  );
}

export function PartRow({ part: p, query = "" }: { part: Part; query?: string }) {
  return (
    <li>
      <div className="part-row">
        <div className="part-id">
          <Link className="pn" href={`/part/${encodeURIComponent(p.pn)}`}>
            <Highlight text={p.pn} query={query} />
          </Link>
          <div className="desc" title={p.desc}>
            <Highlight text={p.desc} query={query} />
          </div>
          <div
            style={{
              marginTop: "var(--au-s-2)",
              display: "flex",
              gap: "var(--au-s-2)",
              flexWrap: "wrap",
            }}
          >
            <span className="stock" data-stock={p.stock}>
              {STOCK_LABEL[p.stock]}
              {p.stock !== "quote" ? ` · ${num(p.qty)} ea` : ""}
            </span>
            <span className="badge">{p.lead}</span>
          </div>
        </div>
        <div className="part-meta">
          <div className="row">
            <span className="k">NSN</span>
            <span className="v">{p.nsn}</span>
          </div>
          <div className="row">
            <span className="k">CAGE</span>
            <span className="v">{p.cage}</span>
          </div>
          <div className="row">
            <span className="k">Mfr</span>
            <span style={{ color: "var(--au-ink)" }}>{p.mfr}</span>
          </div>
        </div>
        <div className="part-actions">
          <AddToQuoteButton part={p} />
          <Link
            className="btn btn-primary btn-sm"
            href={`/rfq?pn=${encodeURIComponent(p.pn)}&instant=1`}
          >
            Instant RFQ
          </Link>
        </div>
      </div>
    </li>
  );
}

export function PartList({
  parts,
  query = "",
  className = "part-list",
}: {
  parts: Part[];
  query?: string;
  className?: string;
}) {
  return (
    <ul className={className}>
      {parts.map((p) => (
        <PartRow key={p.pn} part={p} query={query} />
      ))}
    </ul>
  );
}

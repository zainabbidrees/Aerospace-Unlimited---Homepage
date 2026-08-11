import Link from "next/link";
import type { Axis } from "@/lib/axis";
import type { Stock } from "@/lib/data";
import { num } from "@/lib/format";
import { STOCK_LABEL } from "@/lib/stock";
import { PartList } from "@/components/PartRow";
import { QuoteAllShown } from "@/components/browse/QuoteAllShown";
import { CueReveal } from "@/components/inner/CueReveal";

/*
  RESULTS — the shared view every lookup axis renders into.

  The five flat lookup routes each resolve their own Axis (see lib/axis.ts) and
  hand it here, so scanability and consistency are guaranteed across all of them:
  the part row is the shared `.part-row` every other screen uses, deliberately, so
  a buyer who learned it on the homepage already knows this page.

  FILTERS ARE LINKS, NOT STATE. Stock filtering happens on the server from a
  search parameter, so every filtered view is a real URL that can be shared,
  bookmarked and crawled, and the panel works with no JS at all.

  MODE: Operate. No photographic masthead — a results page is somewhere the buyer
  is working, and a full-bleed band would push the first row below the fold for
  nothing. The identifier is set in mono at display scale because on this page it
  is the fact.
*/

const STOCK_ORDER: Stock[] = ["in", "limited", "quote"];

export function ResultsView({
  axis,
  base,
  stock,
}: {
  axis: Axis;
  /* The route this results view lives at, e.g. `/manufacturers/99193`. The
     filter links append `?stock=` to it. */
  base: string;
  stock?: string;
}) {
  /* The filter is applied after the axis, so the counts beside each option
     describe THIS axis and not the whole catalog. */
  const facet = (s: Stock) => axis.parts.filter((p) => p.stock === s).length;
  const active = STOCK_ORDER.includes(stock as Stock) ? (stock as Stock) : null;
  const rows = active ? axis.parts.filter((p) => p.stock === active) : axis.parts;

  return (
    <>
      <CueReveal />

      <section className="reshead">
        <div className="u-page">
          <ol className="breadcrumb">
            {axis.crumbs.map((c) => (
              <li key={c.label}>{c.href ? <Link href={c.href}>{c.label}</Link> : c.label}</li>
            ))}
          </ol>

          <div className="reshead-top">
            <div className="reshead-lead">
              <p className="eyebrow">{axis.kind}</p>
              <h1 className="reshead-title">{axis.title}</h1>
              <p className="reshead-lede">{axis.lede}</p>
            </div>

            {axis.code ? (
              <div className="reshead-plate">
                <span className="reshead-plate-k">{axis.codeLabel}</span>
                <span className="reshead-plate-v u-mono">{axis.code}</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="u-page">
          <div className="results-layout">
            <aside className="filters" aria-label="Filter results">
              <div className="card resfilter" data-cue>
                <p className="u-caption u-body-strong">Availability</p>
                <ul className="resfilter-list">
                  <li>
                    <Link className="resopt" href={base} data-on={active === null ? "" : undefined}>
                      <span className="resopt-t">Everything</span>
                      <span className="resopt-n">{axis.parts.length}</span>
                    </Link>
                  </li>
                  {STOCK_ORDER.map((s) => {
                    const n = facet(s);
                    return (
                      <li key={s}>
                        {n === 0 ? (
                          <span className="resopt" data-off="">
                            <span className="resopt-t">{STOCK_LABEL[s]}</span>
                            <span className="resopt-n">0</span>
                          </span>
                        ) : (
                          <Link
                            className="resopt"
                            href={`${base}?stock=${s}`}
                            data-on={active === s ? "" : undefined}
                          >
                            <span className="resopt-t">
                              <i className="stock resopt-dot" data-stock={s} aria-hidden="true" />
                              {STOCK_LABEL[s]}
                            </span>
                            <span className="resopt-n">{n}</span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="card resask" data-cue>
                <p className="u-small u-body-strong">Not on the shelf?</p>
                <p className="u-caption" style={{ marginTop: "var(--au-s-2)" }}>
                  The listing is a sample of what we hold. Paste the full parts list
                  and every line comes back priced and lead-timed.
                </p>
                <Link className="btn btn-primary btn-block" style={{ marginTop: "var(--au-s-4)" }} href="/rfq?mode=list">
                  Send a parts list
                </Link>
                <p className="u-caption u-center" style={{ marginTop: "var(--au-s-3)" }}>
                  <a href="tel:+17147054780">+1-714-705-4780</a> · 24/7
                </p>
              </div>
            </aside>

            <div>
              <div className="results-bar" data-cue>
                <p className="results-count" role="status" aria-live="polite">
                  <b>{rows.length}</b> {rows.length === 1 ? "line" : "lines"} shown
                  {active ? ` · ${STOCK_LABEL[active].toLowerCase()}` : ""}
                  {axis.claimed ? (
                    <span className="results-of"> of {num(axis.claimed)} in the catalogue</span>
                  ) : null}
                </p>
                <div className="results-actions">
                  {active ? (
                    <Link className="btn btn-text btn-sm" href={base}>
                      Clear filter
                    </Link>
                  ) : null}
                  <QuoteAllShown parts={rows} />
                </div>
              </div>

              {rows.length ? (
                <div data-cue="rows" data-cue-ms="1300">
                  <PartList parts={rows} />
                </div>
              ) : (
                <div className="empty-state">
                  <h2>
                    {active
                      ? `Nothing here is ${STOCK_LABEL[active].toLowerCase()} right now.`
                      : "No lines listed against this yet."}
                  </h2>
                  <p>
                    {active
                      ? "Clear the filter to see everything listed, or send us the numbers and we will quote from the wider network."
                      : "The catalog listing is a sample. Send the part numbers and we will quote every line within 15 minutes."}
                  </p>
                  <div className="actions">
                    {active ? (
                      <Link className="btn btn-primary btn-lg" href={base}>
                        Show everything
                      </Link>
                    ) : null}
                    <Link className="btn btn-primary btn-lg" href="/rfq?mode=list">
                      Send us a parts list
                    </Link>
                  </div>
                </div>
              )}

              {/* Neighbours, so the page is never a dead end — peers on the same
                  axis, the number lookup, and a direct quote. */}
              <div className="resnext" data-cue>
                <p className="eyebrow">Keep looking</p>
                <div className="chip-row">
                  <Link className="chip" href={axis.backHref}>
                    {axis.backLabel}
                  </Link>
                  <Link className="chip" href="/nsn">
                    By NSN
                  </Link>
                  <Link className="chip" href="/rfq">
                    Not a part number
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

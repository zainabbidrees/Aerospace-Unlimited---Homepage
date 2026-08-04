import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  AIRCRAFT,
  CATEGORIES,
  MANUFACTURERS,
  PARTS,
  type Part,
  type Stock,
} from "@/lib/data";
import { num } from "@/lib/format";
import { STOCK_LABEL } from "@/lib/stock";
import { PartList } from "@/components/PartRow";
import { CueReveal } from "@/components/inner/CueReveal";

/*
  RESULTS — one page for every browse axis.

  FIVE AXES, ONE FILE, because they are one page: a filtered view of the same
  part rows with a different sentence at the top. Separate routes per axis would
  have duplicated the results layout, the filter behaviour and the empty state
  five times over.

    /browse/category/<slug>        part category    ← live /part-types/
    /browse/manufacturer/<cage>    OEM, by CAGE     ← live /manufacturers/
    /browse/platform/<slug>        aircraft model   ← live "Parts by Aircraft"
    /browse/fsc/<code>             Federal Supply Class ← live /fscs/
    /browse/niin/<9 digits>        one item         ← live /niin-parts-inner/

  The static segments `manufacturers` and `aircraft` are sibling routes and win
  over this dynamic one, which is why the axes here are singular. That is load
  bearing: renaming `/browse/manufacturer` to the plural would shadow the A–Z
  index.

  MODE: Operate. This is the page a buyer is working IN, so scanability and
  consistency outrank expression — no photographic masthead, no accent band, and
  the one authored motion is the results printing as they arrive. The part row is
  the shared `.part-row` every other screen uses, deliberately: a buyer who
  learned it on the homepage already knows this page.

  FILTERS ARE LINKS, NOT STATE. Stock filtering happens on the server from a
  search parameter, so every filtered view is a real URL that can be shared,
  bookmarked and crawled, and the panel works with no JS at all. A client-side
  filter would have been less code and strictly worse.
*/

interface Axis {
  /* What the axis is called in the breadcrumb and the eyebrow. */
  kind: string;
  /* The heading. */
  title: string;
  /* An identifier to set in mono beside the heading, where one exists. */
  code?: string;
  codeLabel?: string;
  lede: string;
  /* The catalogue count this axis claims, which is NOT the number of rows below:
     lib/data.ts is a working sample of sixteen lines against a catalogue of
     hundreds of thousands. Saying so is the difference between a sample and a
     broken page. */
  claimed?: number;
  parts: Part[];
  /* Where "see the rest of this axis" goes. */
  backHref: string;
  backLabel: string;
}

function resolve(axis: string, id: string): Axis | null {
  const key = decodeURIComponent(id);

  if (axis === "category") {
    const c = CATEGORIES.find((x) => x.slug === key);
    if (!c) return null;
    return {
      kind: "Part category",
      title: c.name,
      code: c.fsc,
      codeLabel: "FSC",
      lede: `Grouped by what the part does. Everything in this category shares Federal Supply Class ${c.fsc}, which is the first four digits of its NSN.`,
      claimed: c.count,
      parts: PARTS.filter((p) => p.category === c.slug),
      backHref: "/browse#categories",
      backLabel: "All categories",
    };
  }

  if (axis === "manufacturer") {
    const m = MANUFACTURERS.find((x) => x.cage.toUpperCase() === key.toUpperCase());
    if (!m) return null;
    return {
      kind: "Manufacturer",
      title: m.name,
      code: m.cage,
      codeLabel: "CAGE",
      lede: `Parts we hold against this entity. The CAGE code is the reliable half of the pair — confirm it against the nameplate rather than the brand on the box.`,
      claimed: m.count,
      parts: PARTS.filter((p) => p.mfr === m.name),
      backHref: "/browse/manufacturers",
      backLabel: "Manufacturers A–Z",
    };
  }

  if (axis === "platform") {
    const a = AIRCRAFT.find((x) => x.slug === key);
    if (!a) return null;
    return {
      kind: "Aircraft platform",
      title: a.name,
      lede: `Parts listed against this platform. Confirm applicability against the illustrated parts catalogue for your series and effectivity — a number that fits one block does not always fit the next.`,
      claimed: a.count,
      parts: PARTS.filter((p) => p.aircraft.includes(a.slug)),
      backHref: "/browse/aircraft",
      backLabel: "All platforms",
    };
  }

  if (axis === "fsc") {
    if (!/^\d{4}$/.test(key)) return null;
    const parts = PARTS.filter((p) => p.fsc === key);
    /* A category may name this FSC, in which case the page can say what the
       class actually covers instead of only printing the digits. */
    const named = CATEGORIES.find((c) => c.fsc === key);
    return {
      kind: "Federal Supply Class",
      title: named ? named.name : `Federal Supply Class ${key}`,
      code: key,
      codeLabel: "FSC",
      lede: `Every NSN beginning ${key} belongs to this class. It is the widest of the government identifiers — it says what kind of item you are looking at, not which item.`,
      claimed: named?.count,
      parts,
      backHref: "/browse#identifiers",
      backLabel: "All identifier routes",
    };
  }

  if (axis === "niin") {
    const digits = key.replace(/\D/g, "");
    if (digits.length !== 9) return null;
    const parts = PARTS.filter((p) => p.niin === digits);
    return {
      kind: "National Item Identification Number",
      title: parts[0]?.desc ?? `NIIN ${digits}`,
      code: digits,
      codeLabel: "NIIN",
      lede: `A NIIN identifies one item, so this is a single line rather than a list. Its NSN is the same nine digits with the Federal Supply Class in front.`,
      parts,
      backHref: "/browse#identifiers",
      backLabel: "All identifier routes",
    };
  }

  return null;
}

const STOCK_ORDER: Stock[] = ["in", "limited", "quote"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ axis: string; id: string }>;
}): Promise<Metadata> {
  const { axis, id } = await params;
  const a = resolve(axis, id);
  if (!a) return { title: "Not found" };
  return {
    title: a.code ? `${a.title} · ${a.codeLabel} ${a.code}` : a.title,
    description: a.lede,
  };
}

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ axis: string; id: string }>;
  searchParams: Promise<{ stock?: string }>;
}) {
  const { axis, id } = await params;
  const { stock } = await searchParams;
  const a = resolve(axis, id);
  if (!a) notFound();

  /* The filter is applied after the axis, so the counts beside each filter
     option describe THIS axis and not the whole catalog. A facet count that
     ignores the current view is the classic way a filter panel lies. */
  const facet = (s: Stock) => a.parts.filter((p) => p.stock === s).length;
  const active = STOCK_ORDER.includes(stock as Stock) ? (stock as Stock) : null;
  const rows = active ? a.parts.filter((p) => p.stock === active) : a.parts;

  const base = `/browse/${axis}/${encodeURIComponent(id)}`;

  return (
    <>
      <CueReveal />

      {/* ====================================================================
           HEADER — on the page ground, not a photographic band.

           A results page is somewhere the buyer is working, and a full-bleed
           photographic masthead pushes the first row of results below the fold
           for nothing. The identifier is set in mono at display scale because on
           this page it is the fact: a buyer arriving with a CAGE code in hand
           wants to see that code confirmed back at them.
           ==================================================================== */}
      <section className="reshead">
        <div className="u-page">
          <ol className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/browse">Catalog</Link>
            </li>
            <li>
              <Link href={a.backHref}>{a.backLabel}</Link>
            </li>
            <li>{a.code ?? a.title}</li>
          </ol>

          <div className="reshead-top">
            <div className="reshead-lead">
              <p className="eyebrow">{a.kind}</p>
              <h1 className="reshead-title">{a.title}</h1>
              <p className="reshead-lede">{a.lede}</p>
            </div>

            {a.code ? (
              <div className="reshead-plate">
                <span className="reshead-plate-k">{a.codeLabel}</span>
                <span className="reshead-plate-v u-mono">{a.code}</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="u-page">
          <div className="results-layout">
            {/* ============================================================
                 THE FILTER PANEL

                 Three options, each a link, each carrying its count within this
                 axis. An option with nothing behind it renders as an inert row
                 rather than disappearing — a filter that vanishes reads as a
                 page that failed to load, and the zero is itself the answer to
                 "do you have any in stock?".
                 ============================================================ */}
            <aside className="filters" aria-label="Filter results">
              <div className="card resfilter" data-cue>
                <p className="u-caption u-body-strong">Availability</p>
                <ul className="resfilter-list">
                  <li>
                    <Link className="resopt" href={base} data-on={active === null ? "" : undefined}>
                      <span className="resopt-t">Everything</span>
                      <span className="resopt-n">{a.parts.length}</span>
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
                  {/* The claimed figure and the shown figure are different
                      numbers and the page says so out loud. lib/data.ts is a
                      sixteen-line working sample; printing "184,320 parts" over
                      four rows would read as a broken query. */}
                  {a.claimed ? (
                    <span className="results-of"> of {num(a.claimed)} in the catalogue</span>
                  ) : null}
                </p>
                {active ? (
                  <Link className="btn btn-text btn-sm" href={base}>
                    Clear filter
                  </Link>
                ) : null}
              </div>

              {rows.length ? (
                /* MOTION: the rows print as the list arrives — each one rising a
                   few pixels into place, staggered down the column. `.part-row`
                   repeats often enough that it deliberately carries no
                   backdrop-filter (see design.md); the entrance is transform and
                   opacity only, and opacity is armed by JS, so the rest state is
                   a fully visible list. */
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

              {/* Neighbours, so the page is never a dead end. Peers on the same
                  axis, which is the move a buyer who did not find it here
                  actually wants. */}
              <div className="resnext" data-cue>
                <p className="eyebrow">Keep looking</p>
                <div className="chip-row">
                  <Link className="chip" href={a.backHref}>
                    {a.backLabel}
                  </Link>
                  <Link className="chip" href="/browse#identifiers">
                    By NSN, NIIN, CAGE or FSC
                  </Link>
                  <Link className="chip" href="/capabilities">
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

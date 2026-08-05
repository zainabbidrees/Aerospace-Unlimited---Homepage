import Link from "next/link";
import type { Metadata } from "next";
import { MANUFACTURERS } from "@/lib/data";
import { num } from "@/lib/format";
import { CueReveal } from "@/components/inner/CueReveal";
import { CatMast } from "@/components/inner/CatMast";
import { IndexFilter } from "@/components/browse/IndexFilter";

/*
  MANUFACTURERS A–Z — the live site's /manufacturers/ page.

  WHAT THE LIVE PAGE DOES AND WHAT IS KEPT. It is an alphabetical wall of link
  text under a 0–9/A–Z rail, with no CAGE code and no count against any name. The
  rail and the alphabetical grouping are kept, because for an index that is
  largely found from a search engine they are the right shape. Two things are
  added, and both are facts the catalog already holds rather than new content:

    · THE CAGE CODE, against every name. OEM naming is genuinely ambiguous after
      three decades of acquisitions — Collins, Rockwell Collins, UTC Aerospace and
      Goodrich overlap in a buyer's paperwork in ways the code never does. A buyer
      holding a nameplate is reading five characters, so those five characters are
      what the row leads with in the filter and carries in mono.
    · THE COUNT, so a buyer can see where the catalogue is actually deep before
      opening a list.

  AND ONE THING IS FIXED. An A–Z index is only useful if you can skip to a letter
  AND filter as you type; without both it is simply a very long page. The rail
  also tracks which letter group you are inside, so it says where you are and not
  only where you can go. See IndexFilter.tsx for why the whole index is
  server-rendered and the filter only hides rows.

  Names, codes and counts are lib/data.ts — the prototype catalog. See the header
  of that file: they are illustrative, not live inventory.
*/

export const metadata: Metadata = {
  title: "Manufacturers A–Z",
  description:
    "Browse aviation and aerospace parts by manufacturer. Every OEM listed with " +
    "its CAGE code and the depth of catalogue we hold against it.",
};

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/* Grouped by initial. Sorted on a copy — MANUFACTURERS is a shared export and
   `sort` mutates. Numbers and symbols would land in a "#" group; nothing in the
   current set starts with one, so the group is derived rather than assumed. */
const SORTED = [...MANUFACTURERS].sort((a, b) => a.name.localeCompare(b.name));

const GROUPS = (() => {
  const map = new Map<string, typeof SORTED>();
  for (const m of SORTED) {
    const initial = m.name[0].toUpperCase();
    const key = /[A-Z]/.test(initial) ? initial : "#";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
})();

const PRESENT = new Set(GROUPS.map(([l]) => l));

export default function ManufacturersPage() {
  return (
    <>
      <CueReveal />
      {/* Filtering and letter-tracking over the server-rendered index. */}
      <IndexFilter noun="manufacturer" nounPlural="manufacturers" />

      {/* The light CatMast, shared with the Catalog hub — see CatMast.tsx. The
          dark PageMast that opened this page read as a second homepage hero. The
          former `record` strip is dropped: the counts are the index directly
          below, and a big figure strip up top is landing-page furniture. */}
      <CatMast
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/browse", label: "Catalog" },
          { label: "Manufacturers" },
        ]}
        eyebrow="Route 02 · You know who made it"
        title={["The name is ambiguous.", "The CAGE code is not."]}
        lede={
          <>
            Every OEM we list, with the five-character code that identifies the
            entity rather than the brand on the box. Filter by either — and if the
            manufacturer you need is not here, we can still source the part.
          </>
        }
        actions={
          <Link className="btn btn-primary btn-lg" href="/rfq?mode=list">
            Send us a parts list
          </Link>
        }
        img="/img/catalog/assembly-hall.jpg"
        imgSm="/img/catalog/assembly-hall-sm.jpg"
        alt="An aircraft engine mounted on a rail in an industrial assembly hall, its casing and pipework exposed alongside blue shop machinery"
        imgPosition="50% 45%"
      />

      {/* ====================================================================
           THE CONTROLS — filter and rail, in one sticky bar.

           They belong together and they belong pinned. On a page this long the
           reader is always mid-index, and a rail that scrolls away with the top
           of the page is a rail you have to go back for. Sticky, it is a
           permanent position readout: the current letter is marked as you pass
           through its group.
           ==================================================================== */}
      <div className="idxbar">
        <div className="u-page idxbar-inner">
          <div className="field idxbar-field">
            <label className="u-visually-hidden" htmlFor="mfr-filter">
              Filter manufacturers by name or CAGE code
            </label>
            <input
              id="mfr-filter"
              type="search"
              placeholder="Filter by name or CAGE code — Honeywell, 99193…"
              autoComplete="off"
              data-index-filter
            />
          </div>

          <nav className="azrail" aria-label="Jump to letter">
            {LETTERS.map((L) => {
              const has = PRESENT.has(L);
              return has ? (
                <a className="azkey" href={`#letter-${L}`} data-index-letter data-letter={L} key={L}>
                  {L}
                </a>
              ) : (
                <span className="azkey" data-index-letter data-letter={L} data-empty key={L}>
                  {L}
                </span>
              );
            })}
          </nav>

          {/* The count is the page's live region: it is the only thing that can
              tell a filtering user whether they typed a query with no matches or
              simply a query with three. */}
          <p className="results-count idxbar-count" role="status" aria-live="polite" data-index-count>
            {MANUFACTURERS.length} manufacturers
          </p>
        </div>
      </div>

      {/* ====================================================================
           THE INDEX

           A hairline register rather than cards: these are peers in a list, and
           a card per manufacturer would put fourteen boxes on screen where
           fourteen rows read faster. Columns are CSS columns, so a long letter
           group flows into two or three tracks instead of running a single
           1,600px-wide line per name.

           MOTION: each letter group is cued as it reaches the reader — the
           letter lifts, its rule draws across, and the rows print under it. The
           rows are real links at rest; the entrance only ever displaces them.
           ==================================================================== */}
      <section className="section-tight">
        <div className="u-page">
          {GROUPS.map(([letter, items]) => (
            <section
              className="idxgroup"
              id={`letter-${letter}`}
              data-index-group
              data-letter={letter}
              data-cue="group"
              data-cue-ms="1100"
              key={letter}
            >
              <h2 className="idxgroup-letter" aria-label={`Manufacturers starting with ${letter}`}>
                <span>{letter}</span>
                <i className="idxgroup-rule" aria-hidden="true" />
                <em className="idxgroup-n">{items.length}</em>
              </h2>

              <ul className="idxlist">
                {items.map((m) => (
                  <li
                    data-index-row
                    /* One lowercased haystack per row, built on the server, so
                       the filter never has to read the DOM's text or normalise
                       anything at keystroke time. */
                    data-terms={`${m.name} ${m.cage}`.toLowerCase()}
                    key={m.cage}
                  >
                    <Link className="idxrow" href={`/browse/manufacturer/${m.cage}`}>
                      <span className="idxrow-name">{m.name}</span>
                      <span className="idxrow-cage u-mono">{m.cage}</span>
                      <span className="idxrow-n">{num(m.count)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* Hidden until the filter empties the index. Not rendered
              conditionally — it has to exist in the DOM for the client to be
              able to show it without a re-render. */}
          <div className="empty-state" data-index-empty hidden>
            <h2>No manufacturer matches that.</h2>
            <p>
              We can still source parts from manufacturers outside this index — the
              supplier network reaches well past it.
            </p>
            <div className="actions">
              <Link className="btn btn-primary btn-lg" href="/rfq">
                Request a quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
           CLOSING — the page's one accent ground, as a notice rather than a
           full band. The index is the page; a full-height CTA under it would
           compete with the thing the reader came for.
           ==================================================================== */}
      <section className="section-tight">
        <div className="u-page">
          <div className="notice" data-cue>
            <p className="u-body-strong">Cannot see your manufacturer?</p>
            <p className="u-small u-muted" style={{ marginTop: "var(--au-s-2)" }}>
              This index lists the OEMs we hold catalogue against. The supplier
              network reaches a long way past it — send the part number and the
              manufacturer name and we will come back in writing within 15 minutes.
            </p>
            <div className="chip-row" style={{ marginTop: "var(--au-s-5)" }}>
              <Link className="btn btn-primary" href="/rfq">
                Request a quote
              </Link>
              <Link className="btn btn-text" href="/browse">
                Back to the catalog <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

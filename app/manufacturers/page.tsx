import Link from "next/link";
import type { Metadata } from "next";
import { MANUFACTURERS } from "@/lib/data";
import { num } from "@/lib/format";
import { CueReveal } from "@/components/inner/CueReveal";
import { CatMast } from "@/components/inner/CatMast";
import { ListSort } from "@/components/browse/ListSort";

/*
  MANUFACTURERS — the live site's /manufacturers/ page, as a top-level route.

  The live page is an alphabetical wall under an A–Z rail. Here the list is a flat,
  sortable directory instead: a keyword filter and a Sort control (catalogue depth
  or name) over one grid of names. Each name carries two facts the catalog already
  holds — its CAGE code (OEM naming is ambiguous after decades of acquisitions; the
  code is not) and the depth of catalogue we hold against it. The server renders
  the list largest-catalogue-first, so it is complete and sorted without JS.

  Names, codes and counts are lib/data.ts — the prototype catalog. See that file's
  header: illustrative, not live inventory.
*/

export const metadata: Metadata = {
  title: "Manufacturers",
  description:
    "Browse aviation and aerospace parts by manufacturer. Every OEM listed with " +
    "its CAGE code and the depth of catalogue we hold against it — sort by catalogue " +
    "depth or by name.",
};

/* The served order is the default sort: deepest catalogue first. */
const BY_SIZE = [...MANUFACTURERS].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

export default function ManufacturersPage() {
  return (
    <>
      <CueReveal />
      <ListSort noun="manufacturer" nounPlural="manufacturers" />

      <CatMast
        crumbs={[{ href: "/", label: "Home" }, { label: "Manufacturers" }]}
        eyebrow="Browse by manufacturer"
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
              data-list-filter
            />
          </div>

          <div className="idxsort-field">
            <span className="idxsort-k" aria-hidden="true">Sort</span>
            <select id="mfr-sort" aria-label="Sort manufacturers" data-list-sort defaultValue="count-desc">
              <option value="count-desc">Largest catalogue</option>
              <option value="count-asc">Smallest catalogue</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
            </select>
          </div>

          <p className="results-count idxbar-count" role="status" aria-live="polite" data-list-count>
            {MANUFACTURERS.length} manufacturers
          </p>
        </div>
      </div>

      <section className="section-tight">
        <div className="u-page">
          <ul className="idxlist" data-list data-cue>
            {BY_SIZE.map((m) => (
              <li
                data-list-row
                data-terms={`${m.name} ${m.cage}`.toLowerCase()}
                data-name={m.name}
                data-count={m.count}
                key={m.cage}
              >
                <Link className="idxrow" href={`/manufacturers/${m.cage}`}>
                  <span className="idxrow-name">{m.name}</span>
                  <span className="idxrow-cage u-mono">{m.cage}</span>
                  <span className="idxrow-n">{num(m.count)}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="empty-state" data-list-empty hidden>
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
              <Link className="btn btn-text" href="/cage-codes">
                Search by CAGE code <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

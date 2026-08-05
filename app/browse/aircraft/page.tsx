import Link from "next/link";
import type { Metadata } from "next";
import { AIRCRAFT, PARTS } from "@/lib/data";
import { num } from "@/lib/format";
import { CueReveal } from "@/components/inner/CueReveal";
import { CatMast } from "@/components/inner/CatMast";
import { IndexFilter } from "@/components/browse/IndexFilter";

/*
  PARTS BY AIRCRAFT MODEL — the live site's "Parts by Aircraft / Helicopter
  Model" resource, as a first-class route.

  WHY IT IS PROMOTED. On the live site this sits inside an "Other Resource"
  dropdown, which means a buyer has to already know we do it in order to find out
  that we do. Yet it matches how maintenance organisations actually think: they
  work a tail number, not a Federal Supply Class. Starting from the one fact they
  are certain of is the shortest path to a quote.

  THE TWO GROUPS ARE THE LIVE SITE'S OWN AXIS. "Aircraft / Helicopter" is how the
  resource is named in the navigation, so fixed wing and rotorcraft is the split,
  not a taxonomy invented here. Which of the eight platforms is a helicopter is a
  fact about the aircraft rather than a claim about our inventory. See
  au-no-invented-content.

  DELIBERATELY TYPOGRAPHIC — NO PHOTOGRAPHY PER PLATFORM. The image library holds
  generic aviation scenes and not one of them is a photograph of a 737, a CRJ or a
  Black Hawk. A generic airliner under "Sikorsky UH-60" is not ambient treatment,
  it is a false claim about what the picture shows. The masthead carries one wide
  flightline scene for the page as a whole, which claims nothing about any single
  row. See au-stock-photography-scope.
*/

export const metadata: Metadata = {
  title: "Parts by aircraft model",
  description:
    "Find aviation parts by airframe or helicopter model — commercial airframes, " +
    "regional jets, rotorcraft and military platforms.",
};

/* Presentation only, so it lives here rather than in lib/data.ts: which of the
   eight platforms is a rotorcraft. Keyed by slug so a reorder in lib/data.ts can
   never move a platform into the wrong group. Anything not listed falls to fixed
   wing, which is the safe default — a new airliner slug lands in the right group
   without an edit, and a new helicopter slug lands in the wrong one visibly. */
const ROTORCRAFT = new Set(["uh60", "ch47", "bell206"]);

/* MAKER AND DESIGNATION, SPLIT OUT OF THE NAME lib/data.ts already holds — not
   new content. "Boeing 737 (all series)" contains both facts; this only separates
   them so each can be set at its own weight, the way the FSC chip and the CAGE
   plate do elsewhere in the catalog.

   THE DESIGNATION IS THE PLATE'S ANCHOR, and that is the same reasoning design.md
   records for the category tiles: the code is real, unique per row, and it is what
   a buyer scans for. Nobody reads eight full aircraft names looking for theirs —
   they look for "737". Keyed by slug so a reorder in lib/data.ts cannot move a
   designation onto the wrong platform, and the full name is still printed in
   full underneath, because that is the identification. */
const PLATFORM: Record<string, { maker: string; desig: string }> = {
  b737:    { maker: "Boeing",     desig: "737" },
  a320:    { maker: "Airbus",     desig: "A320" },
  b777:    { maker: "Boeing",     desig: "777" },
  crj:     { maker: "Bombardier", desig: "CRJ" },
  c130:    { maker: "Lockheed",   desig: "C-130" },
  uh60:    { maker: "Sikorsky",   desig: "UH-60" },
  ch47:    { maker: "Boeing",     desig: "CH-47" },
  bell206: { maker: "Bell",       desig: "206" },
};

const GROUPS = [
  {
    id: "fixed-wing",
    label: "Fixed wing",
    note: "Commercial airframes, regional jets and military transport.",
    items: AIRCRAFT.filter((a) => !ROTORCRAFT.has(a.slug)).sort((a, b) => b.count - a.count),
  },
  {
    id: "rotorcraft",
    label: "Rotorcraft",
    note: "Utility, medium-lift and light single-engine helicopters.",
    items: AIRCRAFT.filter((a) => ROTORCRAFT.has(a.slug)).sort((a, b) => b.count - a.count),
  },
];

/* Bars are proportional to the deepest platform across BOTH groups, not within
   each group. Scoped per group, the single C-130 row and the deepest airliner
   would both read as full and the comparison would be a lie. */
const AC_MAX = Math.max(...AIRCRAFT.map((a) => a.count));

export default function AircraftPage() {
  return (
    <>
      <CueReveal />
      <IndexFilter noun="platform" nounPlural="platforms" />

      {/* The light CatMast, shared with the Catalog hub — see CatMast.tsx. One
          action, matching the section; the salvage path for out-of-production
          platforms is carried by the page's own sections below. The flightline
          scene is the documented image for this route (design.md) — treatment,
          not a claim about any listed platform. */}
      <CatMast
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/browse", label: "Catalog" },
          { label: "By aircraft" },
        ]}
        eyebrow="Route 03 · You know the aircraft"
        title={["You work a tail number,", "not a supply class."]}
        lede={
          <>
            Start from the platform in the hangar. Always confirm applicability
            against the illustrated parts catalogue for your specific series and
            effectivity before ordering — a part number that fits one block does not
            always fit the next.
          </>
        }
        actions={
          <Link className="btn btn-primary btn-lg" href="/rfq?mode=list">
            Send us a parts list
          </Link>
        }
        img="/img/catalog/flightline.jpg"
        alt="A row of parked military jets seen from behind along a flightline, their exhaust nozzles and tailplanes receding into haze"
        imgPosition="38% 50%"
      />

      {/* ====================================================================
           THE CONTROLS. Same sticky bar as the manufacturer index, with group
           jumps instead of an A–Z rail — eight platforms do not need twenty-six
           letters, and two named groups is the real structure here.
           ==================================================================== */}
      <div className="idxbar">
        <div className="u-page idxbar-inner">
          <div className="field idxbar-field">
            <label className="u-visually-hidden" htmlFor="ac-filter">
              Filter aircraft platforms by model
            </label>
            <input
              id="ac-filter"
              type="search"
              placeholder="Filter by model — 737, UH-60, CRJ…"
              autoComplete="off"
              data-index-filter
            />
          </div>

          <nav className="azrail azrail-wide" aria-label="Jump to group">
            {GROUPS.map((g) => (
              <a className="azkey azkey-wide" href={`#${g.id}`} data-index-letter data-letter={g.id} key={g.id}>
                {g.label}
              </a>
            ))}
          </nav>

          <p className="results-count idxbar-count" role="status" aria-live="polite" data-index-count>
            {AIRCRAFT.length} platforms
          </p>
        </div>
      </div>

      {/* ====================================================================
           THE PLATFORMS

           A plate per platform: the name at h3 scale, the count, and a bar
           proportional to the deepest platform in the catalog. The bar is
           decoration — the figure is printed beside it — so its failure state is
           "full", never "gone".

           MOTION: each group is cued as the reader reaches it; the group label's
           rule draws across and the plates rise in sequence, then each bar
           sweeps out to its own width. The bars run last, so the row is readable
           before the comparison arrives rather than the other way round.
           ==================================================================== */}
      <section className="section-tight">
        <div className="u-page">
          {GROUPS.map((g) => (
            <section
              className="idxgroup"
              id={g.id}
              data-index-group
              data-letter={g.id}
              data-cue="group"
              data-cue-ms="1400"
              key={g.id}
            >
              <h2 className="idxgroup-letter idxgroup-letter-wide">
                <span>{g.label}</span>
                <i className="idxgroup-rule" aria-hidden="true" />
                <em className="idxgroup-n">{g.items.length}</em>
              </h2>
              <p className="idxgroup-note">{g.note}</p>

              {/* EVERY PLATE IS THE SAME SIZE and the last row is allowed to be
                  short. Widening the deepest plate to span two columns was tried
                  twice and abandoned both times — see the note in ux.css. */}
              <ol className="acgrid acgrid-page">
                {g.items.map((a) => {
                  const meta = PLATFORM[a.slug];
                  return (
                    <li data-index-row data-terms={a.name.toLowerCase()} key={a.slug}>
                      <Link
                        className="acplate"
                        href={`/browse/platform/${a.slug}`}
                      >
                        <span className="ac-top">
                          {/* The designation, stamped. Mono because it is an
                              identifier a buyer matches character by character —
                              the one use design.md sanctions for the mono face. */}
                          <span className="ac-desig u-mono">{meta?.desig ?? a.name}</span>
                          <span className="ac-maker">{meta?.maker}</span>
                        </span>

                        <span className="ac-name">{a.name}</span>

                        <span className="ac-foot">
                          <span className="ac-figure">
                            <b className="u-mono">{num(a.count)}</b>
                            <em>parts listed</em>
                          </span>
                          {/* THE SCALE, not a progress pill. A hairline the full
                              width of the plate with a solid segment and a tick at
                              this platform's share of the deepest one — the same
                              ruler idiom as the data plate's identifier tracks, so
                              the catalog measures things one way. Decorative: the
                              figure above states it in text. */}
                          <span
                            className="ac-scale"
                            aria-hidden="true"
                            style={{ ["--depth" as string]: `${Math.round((a.count / AC_MAX) * 100)}%` }}
                          >
                            <i />
                          </span>
                        </span>

                        <span className="ac-go">
                          Browse parts <span aria-hidden="true">→</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}

          <div className="empty-state" data-index-empty hidden>
            <h2>No platform matches that.</h2>
            <p>
              We supply legacy and out-of-production airframes too, including through
              salvaged inventory — send us the part numbers.
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
           CLOSING. The one objection this page actually raises: the platform in
           front of the reader may not be on it. That is a routing problem rather
           than a dead end, so it routes.
           ==================================================================== */}
      <section className="section-tight">
        <div className="u-page">
          <div className="notice" data-cue>
            <p className="u-body-strong">Working on a platform not listed here?</p>
            <p className="u-small u-muted" style={{ marginTop: "var(--au-s-2)" }}>
              {AIRCRAFT.length} platforms are listed; {num(PARTS.length)} lines sit
              behind them as a working sample. We supply out-of-production and legacy
              airframes as well, including through traceable teardown inventory.
            </p>
            <div className="chip-row" style={{ marginTop: "var(--au-s-5)" }}>
              <Link className="btn btn-primary" href="/capabilities#salvage">
                See salvage capabilities
              </Link>
              <Link className="btn btn-text" href="/rfq">
                Send us the part numbers <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

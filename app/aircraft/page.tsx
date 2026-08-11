import Link from "next/link";
import type { Metadata } from "next";
import { AIRCRAFT, PARTS } from "@/lib/data";
import { num } from "@/lib/format";
import { CueReveal } from "@/components/inner/CueReveal";
import { CatMast } from "@/components/inner/CatMast";
import { IndexFilter } from "@/components/browse/IndexFilter";
import { rfqHref } from "@/lib/rfq";

/*
  PARTS BY AIRCRAFT MODEL — the live site's "Parts by Aircraft / Helicopter
  Model" resource, as a first-class route.

  It matches how maintenance organisations actually think: they work a tail
  number, not a Federal Supply Class. Starting from the one fact they are certain
  of is the shortest path to a quote.

  THE TWO GROUPS ARE THE LIVE SITE'S OWN AXIS. "Aircraft / Helicopter" is how the
  resource is named, so fixed wing and rotorcraft is the split, not a taxonomy
  invented here. See au-no-invented-content.

  DELIBERATELY TYPOGRAPHIC — NO PHOTOGRAPHY PER PLATFORM. A generic airliner shot
  under "Sikorsky UH-60" is a false claim about what the picture shows. The
  masthead carries one wide flightline scene for the page as a whole. See
  au-stock-photography-scope.
*/

export const metadata: Metadata = {
  title: "Parts by aircraft model",
  description:
    "Find aviation parts by airframe or helicopter model — commercial airframes, " +
    "regional jets, rotorcraft and military platforms.",
};

const ROTORCRAFT = new Set(["uh60", "ch47", "bell206"]);

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

const AC_MAX = Math.max(...AIRCRAFT.map((a) => a.count));

export default function AircraftPage() {
  return (
    <>
      <CueReveal />
      <IndexFilter noun="platform" nounPlural="platforms" />

      <CatMast
        crumbs={[{ href: "/", label: "Home" }, { label: "By aircraft" }]}
        eyebrow="Parts by aircraft model"
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

              <ol className="acgrid acgrid-page">
                {g.items.map((a) => {
                  const meta = PLATFORM[a.slug];
                  return (
                    <li data-index-row data-terms={a.name.toLowerCase()} key={a.slug}>
                      <div className="acplate">
                        <span className="ac-top">
                          <span className="ac-desig u-mono">{meta?.desig ?? a.name}</span>
                          <span className="ac-maker">{meta?.maker}</span>
                        </span>

                        <span className="ac-name">{a.name}</span>

                        <span className="ac-foot">
                          <span className="ac-figure">
                            <b className="u-mono">{num(a.count)}</b>
                            <em>parts listed</em>
                          </span>
                          <span
                            className="ac-scale"
                            aria-hidden="true"
                            style={{ ["--depth" as string]: `${Math.round((a.count / AC_MAX) * 100)}%` }}
                          >
                            <i />
                          </span>
                        </span>

                        <span className="ac-go">
                          <Link className="ac-go-browse" href={`/aircraft/${a.slug}`}>
                            Browse parts <span aria-hidden="true">→</span>
                          </Link>
                          <Link
                            className="ac-go-quote"
                            href={rfqHref({ aircraft: a.slug, for: a.name })}
                          >
                            request a quote
                          </Link>
                        </span>
                      </div>
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
              <Link className="btn btn-primary" href="/salvaged-aircraft-parts">
                See salvaged aircraft parts
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

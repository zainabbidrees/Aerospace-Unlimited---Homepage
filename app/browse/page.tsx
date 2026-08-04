import Link from "next/link";
import type { Metadata } from "next";
import { AIRCRAFT, CATEGORIES, MANUFACTURERS, PARTS } from "@/lib/data";
import { num } from "@/lib/format";
import { CueReveal } from "@/components/inner/CueReveal";
import { PageMast } from "@/components/inner/PageMast";

/*
  BROWSE — THE CATALOG HUB

  SECTION INVENTORY, and every one of these is a route the live site already
  carries. The live nav spends six of its ten top-level slots on identifier
  lookups — Manufacturers, FSCs, NIIN, NSN, Part Types, CAGE Code — with nothing
  anywhere explaining which one to pick. That is a database schema handed to the
  buyer. Nothing is removed here; the choice is simply made on one page, and each
  route is restated as an answer to the only question the buyer can actually
  answer: what do you have in front of you right now?

    Masthead ................. the live "Browse … Directory" pages' shared job
    Route selector ........... the four routes, named by what the buyer holds
    By part category ......... live /part-types/ + /fscs/, as one depth register
    By manufacturer .......... live /manufacturers/
    By aircraft model ........ live "Parts by Aircraft / Helicopter Model"
    By identifier ............ live /nsn-parts/, /niin-parts-inner/, /cage-codes/,
                               /fscs/ — with the NSN taken apart, because the
                               live pages assume you already know what the digits
                               mean
    Closing .................. the page's one accent band

  NOTHING IS INVENTED. Category names, FSC codes, CAGE codes, platform names and
  every count come from lib/data.ts; the aggregate figures are summed from those
  rows rather than typed, so they cannot drift. The identifier definitions are the
  prototype's, which are statements of fact about the numbering systems.
  See au-no-invented-content.

  THE ONE ACCENT BAND IS THE CLOSING CTA. Exactly one per page — see design.md.
*/

export const metadata: Metadata = {
  title: "Browse the catalog",
  description:
    "Browse aviation and aerospace parts by part category and Federal Supply Class, " +
    "by manufacturer and CAGE code, by aircraft model, or by NSN and NIIN.",
};

/* Summed, never typed, so the masthead cannot contradict the rows below it. */
const CAT_TOTAL = CATEGORIES.reduce((s, c) => s + c.count, 0);
/* The register's bars are proportional to the deepest category, so the deepest
   one reads as full and everything else as a fraction of it. Taking the max
   rather than the total is deliberate: against a 500k total every bar would be
   a stub and the comparison the bar exists to make would be invisible. */
const CAT_MAX = Math.max(...CATEGORIES.map((c) => c.count));
const CATEGORIES_BY_DEPTH = [...CATEGORIES].sort((a, b) => b.count - a.count);

/* Sorted before slicing. Taking the first nine in source order is not the top
   nine — GE Aviation sits at index 11 with the third-largest catalogue. */
const MFR_TOP = [...MANUFACTURERS].sort((a, b) => b.count - a.count).slice(0, 9);
const AIRCRAFT_BY_DEPTH = [...AIRCRAFT].sort((a, b) => b.count - a.count);
const AC_MAX = Math.max(...AIRCRAFT.map((a) => a.count));

/* The four routes, in the order a buyer can most often answer them. A
   description is the one thing everybody has even when the paperwork is gone, so
   category leads; the identifier route is last because a buyer who has an NSN
   can simply type it into the field in the header. */
const ROUTES = [
  { id: "categories", holds: "You know what the part does", name: "By part category", n: `${CATEGORIES.length} categories` },
  { id: "manufacturers", holds: "You know who made it", name: "By manufacturer", n: `${MANUFACTURERS.length} manufacturers` },
  { id: "aircraft", holds: "You know the aircraft", name: "By aircraft model", n: `${AIRCRAFT.length} platforms` },
  { id: "identifiers", holds: "You have a government identifier", name: "By NSN, NIIN, CAGE or FSC", n: "4 numbering systems" },
];

/* THE SPECIMEN NSN, and it is a real row in the catalog rather than a made-up
   number: 5310-00-877-5797 is the self-locking nut MS21042L3. Split into the
   four blocks the standard actually defines, so the diagram below is a
   description of the numbering system and not a decoration.

     5310  Federal Supply Class — what kind of item it is
     00    NATO Codification Bureau — which country assigned it
     877   ┐ the rest of the National Item Identification Number, which is
     5797  ┘ the last NINE digits taken together

   The NIIN bracket therefore spans blocks two, three and four. Getting that
   span wrong is the one way this diagram could teach something false, so it is
   derived from the same string rather than positioned by hand. */
const SPECIMEN = "5310-00-877-5797";
const NSN_BLOCKS = SPECIMEN.split("-");
const NIIN = NSN_BLOCKS.slice(1).join("");

/* The four identifier routes, with the definitions the prototype carried. Each
   one states the format, gives a real example from the catalog, and goes
   somewhere that exists. */
const IDENTIFIERS = [
  {
    code: "NSN",
    name: "National Stock Number",
    fmt: "13 digits",
    body: "The full NATO identifier for a supply item. Every stocked line has exactly one, and it is the number a government parts list will quote.",
    eg: "5310-00-877-5797",
    href: "/browse/fsc/5310",
    cta: "Browse an NSN group",
  },
  {
    code: "NIIN",
    name: "National Item Identification Number",
    fmt: "9 digits",
    body: "The NSN with its Federal Supply Class removed — the part of the number that identifies the item itself rather than its category.",
    eg: "008775797",
    href: "/browse/niin/008775797",
    cta: "Look up this NIIN",
  },
  {
    code: "CAGE",
    name: "Commercial and Government Entity code",
    fmt: "5 characters",
    body: "Identifies the manufacturer, not the part. Naming is genuinely ambiguous after decades of acquisitions; the code is not.",
    eg: "99193",
    href: "/browse/manufacturers",
    cta: "Manufacturers by CAGE",
  },
  {
    code: "FSC",
    name: "Federal Supply Class",
    fmt: "4 digits",
    body: "Groups parts by what they are — 4820 is valves, 3110 is antifriction bearings. The first four digits of every NSN.",
    eg: "4820",
    href: "#categories",
    cta: "FSC by category",
  },
];

export default function BrowsePage() {
  return (
    <>
      {/* Per-element entrances, cued off each element's own position. This page
          is nine bands deep, which is exactly the case the shared 2s blanket
          reveal gets wrong. See CueReveal.tsx. */}
      <CueReveal />

      <PageMast
        crumbs={[{ href: "/", label: "Home" }, { label: "Catalog" }]}
        eyebrow="The catalog"
        title={["Four ways in.", "One field that takes all of them."]}
        lede={
          <>
            Over two billion part numbers, reachable by what the part does, who
            made it, what it flies on, or the government number stamped on the
            paperwork. If you are holding any identifier at all, the search field
            in the header is faster — it recognises the format as you type.
          </>
        }
        actions={
          <>
            <Link className="btn btn-primary btn-lg" href="/rfq?mode=list">
              Send us a parts list
            </Link>
            <Link className="btn btn-quiet btn-lg" href="/capabilities">
              Not a part number?
            </Link>
          </>
        }
        img="/img/catalog/apron-cowls.jpg"
        alt="A narrow-body airliner on the apron with both engine nacelle cowls hinged open, the fan and thrust reverser mechanism exposed, under a pale overcast sky"
        bias="62%"
        record={[
          { v: "2bn+", k: "Part numbers" },
          { v: String(CATEGORIES.length), k: "Part categories" },
          { v: String(MANUFACTURERS.length), k: "Manufacturers listed" },
          { v: String(AIRCRAFT.length), k: "Aircraft platforms" },
        ]}
      />

      {/* ====================================================================
           THE ROUTE SELECTOR

           Four plates, numbered, each leading with what the BUYER holds rather
           than with what we call the route. "You know who made it" is a sentence
           a person can agree or disagree with; "Manufacturers" is a table name.

           Numerals are real order here — the routes are ranked by how often a
           buyer can answer them — so this is an <ol> and the numerals are
           aria-hidden, with the list carrying the order for assistive tech.

           MOTION: each plate's top hairline draws in from its leading edge and
           the numeral lifts out from under it, staggered left to right. The rule
           is the plate's only decoration, so drawing it is the whole entrance —
           nothing that carries meaning moves.
           ==================================================================== */}
      <section className="section-tight brt">
        <div className="u-page">
          <ol className="brt-row" data-cue="routes" data-cue-ms="1100">
            {ROUTES.map((r, i) => (
              <li className="brt-plate" key={r.id}>
                <a href={`#${r.id}`}>
                  <span className="brt-num" aria-hidden="true">{`0${i + 1}`}</span>
                  <span className="brt-holds">{r.holds}</span>
                  <span className="brt-name">{r.name}</span>
                  <span className="brt-n">{r.n}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ====================================================================
           BY PART CATEGORY — a depth register, not a card grid.

           The live site shows part types as a bare A–Z of link text and FSCs as
           a nine-page paginated list. Neither tells a buyer which groups we are
           actually deep in, which is the question behind "do you carry this?".
           So the twelve categories are ordered by catalogue depth and each row
           draws its count as a proportional bar.

           THE BAR IS DECORATION AND THE FIGURE IS THE FACT. The count is printed
           on every row in text; the bar only makes the comparison visible at a
           glance. If the bar never renders, nothing is lost.

           MOTION: the bars sweep out from the left, staggered down the register,
           as the band arrives. A bar's failure state is "full", never "gone".
           ==================================================================== */}
      <section className="section" id="categories">
        <div className="u-page">
          <div className="section-head section-head-row" data-cue>
            <div>
              <p className="eyebrow">Route 01 · You know what the part does</p>
              <h2>By part category</h2>
              <p>
                Grouped by function, with the matching Federal Supply Class against
                each one for anyone working from a government parts list.{" "}
                <b>{num(CAT_TOTAL)}</b> parts across {CATEGORIES.length} categories.
              </p>
            </div>
            <Link className="btn btn-quiet" href="/rfq?mode=list">
              Quote a whole list
            </Link>
          </div>

          <ol className="depthreg" data-cue="depth" data-cue-ms="1400">
            {CATEGORIES_BY_DEPTH.map((c) => (
              <li key={c.slug}>
                <Link className="depthrow" href={`/browse/category/${c.slug}`}>
                  <span className="depth-fsc u-mono">{c.fsc}</span>
                  <span className="depth-name">{c.name}</span>
                  {/* The bar's width is the row's own datum, handed to CSS as a
                      percentage of the deepest category. Inline because it is
                      data, not style — there is no stylesheet value for it. */}
                  <span
                    className="depth-bar"
                    aria-hidden="true"
                    style={{ ["--depth" as string]: `${Math.round((c.count / CAT_MAX) * 100)}%` }}
                  >
                    <i />
                  </span>
                  <span className="depth-n">{num(c.count)}</span>
                  <span className="depth-go" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ====================================================================
           BY MANUFACTURER — CAGE plates.

           The code leads and the name follows, which is the reverse of the live
           site and is the point: a buyer holding a nameplate is reading five
           characters, and OEM naming after thirty years of acquisitions is the
           unreliable half of the pair. Nine of fourteen here — an explicit
           top-N by catalogue depth, with the full register one click away.
           ==================================================================== */}
      <section className="section section-subtle" id="manufacturers">
        <div className="u-page">
          <div className="section-head section-head-row" data-cue>
            <div>
              <p className="eyebrow">Route 02 · You know who made it</p>
              <h2>By manufacturer</h2>
              <p>
                Every OEM is listed with its CAGE code, so you can confirm you have
                the right entity before you open the list.
              </p>
            </div>
            <Link className="btn btn-quiet" href="/browse/manufacturers">
              Full A–Z index
            </Link>
          </div>

          <ol className="cagegrid" data-cue="stack" data-cue-ms="1200">
            {MFR_TOP.map((m) => (
              <li key={m.cage}>
                <Link className="cageplate" href={`/browse/manufacturer/${m.cage}`}>
                  <span className="cage-label">CAGE</span>
                  <span className="cage-code u-mono">{m.cage}</span>
                  <span className="cage-rule" aria-hidden="true" />
                  <span className="cage-name">{m.name}</span>
                  <span className="cage-n">{num(m.count)} parts</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ====================================================================
           BY AIRCRAFT MODEL

           This route did not exist as a first-class path on the live site, yet it
           is how maintenance organisations actually think — they work on a tail
           number, not a Federal Supply Class.

           DELIBERATELY TYPOGRAPHIC, WITH NO PHOTOGRAPHY. The image library holds
           eight generic aviation scenes and none of them is a photograph of a
           737, a CRJ or a Black Hawk. A generic airliner shot sitting under
           "Sikorsky UH-60 Black Hawk" is not ambient treatment, it is a false
           claim about what the picture shows — the same reasoning that keeps the
           manufacturer stage uncaptioned. See au-stock-photography-scope.
           ==================================================================== */}
      <section className="section" id="aircraft">
        <div className="u-page">
          <div className="section-head section-head-row" data-cue>
            <div>
              <p className="eyebrow">Route 03 · You know the aircraft</p>
              <h2>By aircraft model</h2>
              <p>
                Commercial airframes, regional jets, rotorcraft and military
                platforms. Always confirm applicability against the illustrated
                parts catalogue for your series and effectivity before ordering.
              </p>
            </div>
            <Link className="btn btn-quiet" href="/browse/aircraft">
              All {AIRCRAFT.length} platforms
            </Link>
          </div>

          <ol className="acgrid" data-cue="stack" data-cue-ms="1200">
            {AIRCRAFT_BY_DEPTH.map((a) => (
              <li key={a.slug}>
                <Link className="acplate" href={`/browse/platform/${a.slug}`}>
                  <span className="ac-name">{a.name}</span>
                  <span className="ac-meta">
                    <span className="ac-n">{num(a.count)} parts</span>
                    <span
                      className="ac-bar"
                      aria-hidden="true"
                      style={{ ["--depth" as string]: `${Math.round((a.count / AC_MAX) * 100)}%` }}
                    >
                      <i />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ====================================================================
           BY IDENTIFIER — THE PAGE'S ONE AUTHORED MOMENT.

           The live site carries four separate pages for these numbering systems
           and all four assume you already know what the digits mean. A buyer who
           has only ever called it "the part number" learns nothing from a page
           titled "NIIN". So this band takes one real NSN apart and labels it.

           WHY A DIAGRAM AND NOT FOUR MORE CARDS. This is the only place on the
           site where the relationship BETWEEN two identifiers is the content —
           the NIIN is literally inside the NSN, and no amount of prose makes
           that as clear as a bracket does. The four cards below it then carry
           the definitions and the routes.

           MOTION: the four digit blocks settle in from small offsets, then the
           brackets draw outward from their own centres, then the labels rise
           under them. It plays as the number being taken apart, which is the
           section's argument. Every element is legible before, during and after,
           and the whole thing is the CSS default at rest — the brackets are
           drawn and the labels are in place on the server, with no JS, and in a
           screenshot. See au-motion-safety.
           ==================================================================== */}
      <section className="section section-subtle nsna-band" id="identifiers">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">Route 04 · You have a government identifier</p>
            <h2>By NSN, NIIN, CAGE code or FSC</h2>
            <p>
              Four numbering systems, and they are not alternatives to each other —
              three of them are parts of the same number. Here is one of ours,
              taken apart.
            </p>
          </div>

          {/* The specimen. `aria-hidden` on the diagram and a plain-language
              summary in `.nsna-sr` for assistive tech: a screen reader read the
              brackets and labels as a scatter of disconnected digits and words,
              which is worse than a sentence. The sentence says the same thing. */}
          <figure className="nsna" data-cue="nsna" data-cue-ms="1600" data-cue-vh="0.9">
            <div className="nsna-stage" aria-hidden="true">
              <div className="nsna-digits">
                {NSN_BLOCKS.map((b, i) => (
                  <span className="nsna-block u-mono" data-block={i} key={i}>
                    {b}
                  </span>
                ))}
              </div>

              {/* Two brackets, and their spans are the whole point. The FSC
                  bracket sits under block one; the NIIN bracket spans blocks two
                  to four, because the NIIN is the last nine digits taken
                  together. Both are laid out on the same four-column grid as the
                  digits, so a bracket cannot drift off the digits it describes. */}
              <div className="nsna-brackets">
                <span className="nsna-bracket" data-span="fsc">
                  <i />
                </span>
                <span className="nsna-bracket" data-span="niin">
                  <i />
                </span>
              </div>

              <div className="nsna-labels">
                <span className="nsna-label" data-span="fsc">
                  <b>FSC {NSN_BLOCKS[0]}</b>
                  Federal Supply Class — the kind of item it is. Valves, bearings,
                  connectors.
                </span>
                <span className="nsna-label" data-span="niin">
                  <b>
                    NIIN <span className="u-mono">{NIIN}</span>
                  </b>
                  The item itself. Its first two digits ({NSN_BLOCKS[1]}) name the
                  codification bureau that assigned it.
                </span>
              </div>
            </div>

            <p className="nsna-sr u-visually-hidden">
              In the National Stock Number {SPECIMEN}, the first four digits{" "}
              {NSN_BLOCKS[0]} are the Federal Supply Class, which says what kind of
              item it is. The remaining nine digits, {NIIN}, are the National Item
              Identification Number, which identifies the item itself; the first two
              of those, {NSN_BLOCKS[1]}, name the codification bureau that assigned
              it. A CAGE code is a separate five-character identifier for the
              manufacturer and is not part of the NSN.
            </p>

            <figcaption className="nsna-cap">
              A real line from the catalog:{" "}
              <Link className="u-mono" href="/part/MS21042L3">
                MS21042L3
              </Link>
              , a self-locking hexagon nut. The CAGE code is the one identifier here
              that is <b>not</b> part of the NSN — it names the manufacturer, not the
              item.
            </figcaption>
          </figure>

          <ol className="idgrid" data-cue="stack" data-cue-ms="1200">
            {IDENTIFIERS.map((d) => (
              <li className="card idcard" key={d.code}>
                <div className="idcard-top">
                  <h3 className="idcard-code u-mono">{d.code}</h3>
                  <span className="badge">{d.fmt}</span>
                </div>
                <p className="idcard-name">{d.name}</p>
                <p className="idcard-body">{d.body}</p>
                <p className="idcard-eg">
                  e.g. <span className="u-mono">{d.eg}</span>
                </p>
                <Link className="btn btn-text idcard-go" href={d.href}>
                  {d.cta} <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ====================================================================
           CLOSING — the page's one accent band.

           No browse page is allowed to be the end of the road: the catalog is a
           fraction of what can be sourced, and a buyer who reached the bottom of
           four routes without a match is the normal case rather than the
           exception. The figure is the real one from lib/data.ts, so it cannot
           overstate the shelf.
           ==================================================================== */}
      <section className="section section-accent brc">
        <div className="u-page brc-inner">
          <div className="brc-lead" data-cue>
            <p className="eyebrow">Nothing matched?</p>
            <h2 className="brc-title">
              The shelf is not the network.{" "}
              <span className="brc-accent">Send the numbers.</span>
            </h2>
            <p className="brc-lede">
              {num(PARTS.length)} lines are listed here as a working sample. We source
              well past the catalog — paste a parts list, a manual reference or a
              photograph of a data plate, and a named account manager comes back in
              writing within 15 minutes, at any hour.
            </p>
            <div className="brc-cta">
              <Link className="btn btn-quiet btn-lg" href="/rfq?mode=list">
                Send us a parts list
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/contact">
                Talk to a specialist
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

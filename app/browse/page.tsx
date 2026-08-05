import Link from "next/link";
import type { Metadata } from "next";
import { AIRCRAFT, CATEGORIES, MANUFACTURERS, PARTS } from "@/lib/data";
import { num } from "@/lib/format";
import { CueReveal } from "@/components/inner/CueReveal";
import { CatMast } from "@/components/inner/CatMast";
import { MfrCarousel } from "@/components/browse/MfrCarousel";

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

/* Sorted by catalogue depth, then handed to the carousel whole — the rail
   scrolls, so there is no reason to slice to a top-N the way a fixed grid had
   to. The full A–Z index is still one click away in the section head. */
const MFR_SORTED = [...MANUFACTURERS].sort((a, b) => b.count - a.count);
const MFR_MAX = Math.max(...MANUFACTURERS.map((m) => m.count));
const MFR_CARDS = MFR_SORTED.map((m) => ({
  cage: m.cage,
  name: m.name,
  count: m.count,
  share: Math.round((m.count / MFR_MAX) * 100),
}));
const AIRCRAFT_BY_DEPTH = [...AIRCRAFT].sort((a, b) => b.count - a.count);
const AC_MAX = Math.max(...AIRCRAFT.map((a) => a.count));
/* Maker + short designation per platform — the same map the /browse/aircraft
   page carries. The designation is the card's anchor ("737", not the full
   name); it is the real designation, keyed to the slug so it can never land on
   the wrong platform. Kept in sync with app/browse/aircraft/page.tsx. */
const PLATFORM: Record<string, { maker: string; desig: string }> = {
  b737: { maker: "Boeing", desig: "737" },
  a320: { maker: "Airbus", desig: "A320" },
  b777: { maker: "Boeing", desig: "777" },
  crj: { maker: "Bombardier", desig: "CRJ" },
  c130: { maker: "Lockheed", desig: "C-130" },
  uh60: { maker: "Sikorsky", desig: "UH-60" },
  ch47: { maker: "Boeing", desig: "CH-47" },
  bell206: { maker: "Bell", desig: "206" },
};

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
   somewhere that exists.

   `span` is a slice of the 13-digit NSN, [start, length], 1-indexed — the same
   fact the data plate's brackets carry, reused here to draw each tile's scale
   track. NSN is the whole 13; FSC is the first 4; NIIN is the last 9. CAGE has
   no span because it is NOT part of the NSN — that absence is the point, and it
   is why CAGE alone shows no track. Nothing is invented: these are statements
   about the numbering system, derived against NSN_LEN below so a bar can never
   claim a width the number does not have. */
const NSN_LEN = 13;
const IDENTIFIERS: {
  code: string;
  name: string;
  fmt: string;
  body: string;
  eg: string;
  href: string;
  cta: string;
  span: [number, number] | null;
}[] = [
  {
    code: "NSN",
    name: "National Stock Number",
    fmt: "13 digits",
    body: "The full NATO identifier for a supply item. Every stocked line has exactly one, and it is the number a government parts list will quote.",
    eg: "5310-00-877-5797",
    href: "/browse/fsc/5310",
    cta: "Browse an NSN group",
    span: [1, 13],
  },
  {
    code: "NIIN",
    name: "National Item Identification Number",
    fmt: "9 digits",
    body: "The NSN with its Federal Supply Class removed — the part of the number that identifies the item itself rather than its category.",
    eg: "008775797",
    href: "/browse/niin/008775797",
    cta: "Look up this NIIN",
    span: [5, 9],
  },
  {
    code: "CAGE",
    name: "Commercial and Government Entity code",
    fmt: "5 characters",
    body: "Identifies the manufacturer, not the part. Naming is genuinely ambiguous after decades of acquisitions; the code is not.",
    eg: "99193",
    href: "/browse/manufacturers",
    cta: "Manufacturers by CAGE",
    span: null,
  },
  {
    code: "FSC",
    name: "Federal Supply Class",
    fmt: "4 digits",
    body: "Groups parts by what they are — 4820 is valves, 3110 is antifriction bearings. The first four digits of every NSN.",
    eg: "4820",
    href: "#categories",
    cta: "FSC by category",
    span: [1, 4],
  },
];

/* The FSC | NIIN seam as a fraction of the whole, so every tile's boundary tick
   lands on the same line and the three tracks read as one ruler. */
const NSN_SEAM = `${(4 / NSN_LEN) * 100}%`;

export default function BrowsePage() {
  return (
    <>
      {/* Per-element entrances, cued off each element's own position. This page
          is nine bands deep, which is exactly the case the shared 2s blanket
          reveal gets wrong. See CueReveal.tsx. */}
      <CueReveal />

      {/* THE CATALOG HEADER — the light CatMast, shared with the two index
          sub-pages, and NOT the dark PageMast the rest of the site opens on. The
          dark version measured the same height and 52px headline as the homepage
          hero and so read as a second landing page; see CatMast.tsx / ux.css §1b.
          One action only — "Send us a parts list" is the catalog's contextual CTA
          and does not duplicate the header's standing "Request a Quote". */}
      <CatMast
        crumbs={[{ href: "/", label: "Home" }, { label: "Catalog" }]}
        eyebrow="The catalog"
        title={["Four ways in.", "One field that takes all of them."]}
        lede={
          <>
            Over two billion part numbers, reachable by what the part does, who
            made it, what it flies on, or the government number stamped on the
            paperwork.
          </>
        }
        actions={
          <Link className="btn btn-primary btn-lg" href="/rfq?mode=list">
            Send us a parts list
          </Link>
        }
        img="/img/catalog/mro-engine-bay.jpg"
        imgSm="/img/catalog/mro-engine-bay-sm.jpg"
        alt="A large turbofan engine mounted on a wheeled cradle in a maintenance hangar, its fan blades and accessory plumbing exposed under the shop's overhead structure"
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
      <section className="section section-dark" id="manufacturers">
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

          {/* A horizontal carousel of CAGE nameplates, ranked by catalogue
              depth. Cards rather than a register because the CAGE code wants to
              be a held object — a nameplate — and the rail keeps fourteen of
              them from turning into a wall. The rail scrolls natively; the
              arrows are enhancement. See MfrCarousel.tsx. */}
          <MfrCarousel items={MFR_CARDS} />
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

          {/* A card grid: each plate is anchored by its stamped designation,
              then the full name, then the part count with a depth scale showing
              its share of the deepest catalogue. Same plate the /browse/aircraft
              page uses, so the two read as one system. */}
          <ol className="acgrid" data-cue="stack" data-cue-ms="1200">
            {AIRCRAFT_BY_DEPTH.map((a) => {
              const meta = PLATFORM[a.slug];
              return (
                <li key={a.slug}>
                  <Link className="acplate" href={`/browse/platform/${a.slug}`}>
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
                      Browse parts <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </li>
              );
            })}
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

          {/* ==============================================================
               THE DATA PLATE

               WHY A PLATE, AND NOT THE WHITE CARD THIS WAS. Every component in
               this catalog carries a stamped data plate, and a buyer who "has a
               government identifier" is almost always reading one — off a
               nameplate, a removal tag or a line of paperwork. So the section is
               built as the object it is about: a machined plate on the light
               section ground, the number ENGRAVED rather than printed, and the
               CAGE code physically detached from it because it is not part of
               that number. The old version explained the separation in a caption
               sentence; this one shows it in the layout, which is the whole
               reason to spend a bespoke band here rather than four more cards.

               It is also the only dark object on this page, which is what makes
               it the centrepiece. Note it is an OBJECT on a light band, not a
               dark band: the page's band count and its one-accent-band rule are
               unchanged, and the plate reads as a thing on a bench rather than as
               another full-bleed section.

               ACCESSIBILITY. The diagram is aria-hidden and `.dp-sr` carries the
               same content as one plain sentence — read aloud, brackets and
               spans came out as a scatter of disconnected digits and words, which
               is strictly worse than prose. The interactive highlight is a
               hover/focus affordance over that diagram, so it adds nothing a
               screen reader needs and takes nothing away.
               ============================================================== */}
          <figure className="dp" data-cue="plate" data-cue-ms="1950" data-cue-vh="0.9">
            <div className="dp-plate" aria-hidden="true">
              {/* The brushed grain and the bevel. Both are gradients rather than
                  images — see ux.css. */}
              <span className="dp-grain" />
              {/* THE MEASURING PASS. One narrow band of light that crosses the
                  plate once, during the entrance. It is also the specular that
                  makes the surface read as metal rather than as a dark rectangle,
                  which is why it is a real element and not a keyframe on the
                  plate itself. */}
              <span className="dp-pass" />

              {/* The plate's own stamped header, the way a real one is labelled:
                  what the number is, and what it is stamped on. */}
              <div className="dp-head">
                <span className="dp-head-k">National Stock Number</span>
                <span className="dp-head-v u-mono">MS21042L3</span>
              </div>

              {/* THE NUMBER. Four blocks on a 4·2·3·4 grid, proportional to the
                  digits each holds, so the brackets below land under equal
                  densities of type rather than under equal boxes.

                  `data-of` maps a block to the span it belongs to, and it is what
                  the hover interrogation reads: pointing at any digit lights the
                  bracket and label that own it and recedes the other. That is the
                  containment relationship made operable — the one thing a static
                  diagram of this cannot do. */}
              <div className="dp-digits">
                {NSN_BLOCKS.map((b, i) => (
                  <span
                    className="dp-block u-mono"
                    data-block={i}
                    data-of={i === 0 ? "fsc" : "niin"}
                    tabIndex={0}
                    key={i}
                  >
                    {b}
                  </span>
                ))}
              </div>

              {/* The spans, and getting them wrong is the one way this diagram
                  could teach something false: the FSC bracket sits under block
                  one, and the NIIN bracket spans blocks two to four because the
                  NIIN is the last NINE digits taken together. Both ride the same
                  grid as the digits, so a bracket cannot drift off what it
                  describes. */}
              <div className="dp-brackets">
                <span className="dp-bracket" data-span="fsc">
                  <i />
                </span>
                <span className="dp-bracket" data-span="niin">
                  <i />
                </span>
              </div>

              <div className="dp-labels">
                <span className="dp-label" data-span="fsc">
                  <b>
                    FSC <span className="u-mono">{NSN_BLOCKS[0]}</span>
                  </b>
                  <em>Federal Supply Class</em>
                  The kind of item it is — valves, bearings, connectors. Four digits,
                  and every NSN starts with them.
                </span>
                <span className="dp-label" data-span="niin">
                  <b>
                    NIIN <span className="u-mono">{NIIN}</span>
                  </b>
                  <em>National Item Identification Number</em>
                  The item itself, and the same nine digits whichever way you write
                  them. Its first two ({NSN_BLOCKS[1]}) name the codification bureau
                  that assigned it.
                </span>
              </div>

              <p className="dp-hint">Point at any block to see which number owns it.</p>
            </div>

            <div className="dp-foot">
              <figcaption className="dp-cap">
                Stamped from a real line in the catalog —{" "}
                <Link className="u-mono" href="/part/MS21042L3">
                  MS21042L3
                </Link>
                , a self-locking hexagon nut.
              </figcaption>

              {/* THE COUNTERPOINT, and it is a separate object on purpose. CAGE is
                  the identifier buyers most often assume is part of the stock
                  number, and it is the only one here that is not. A detached plate
                  with its own hairline says that before the sentence does. */}
              <div className="dp-aside">
                <div className="dp-aside-plate" aria-hidden="true">
                  <span className="dp-aside-k">CAGE</span>
                  <span className="dp-aside-v u-mono">99193</span>
                </div>
                <p className="dp-aside-t">
                  <b>Not part of the number above.</b> A CAGE code names the
                  manufacturer, not the item — five characters, issued to the company.
                  The plate carries both because a buyer needs both, but they are two
                  separate systems.
                </p>
              </div>
            </div>

            <p className="dp-sr u-visually-hidden">
              In the National Stock Number {SPECIMEN}, the first four digits{" "}
              {NSN_BLOCKS[0]} are the Federal Supply Class, which says what kind of
              item it is. The remaining nine digits, {NIIN}, are the National Item
              Identification Number, which identifies the item itself; the first two
              of those, {NSN_BLOCKS[1]}, name the codification bureau that assigned
              it. A CAGE code is a separate five-character identifier for the
              manufacturer and is not part of the NSN.
            </p>

          </figure>

          {/* THE ROUTES, AND THE LAYOUT CARRIES THE ARGUMENT. Three of these are
              parts of one number and the fourth is a different system, so they do
              not get four identical cells — NSN, NIIN and FSC sit together as the
              number's own three scales, and CAGE sits after a divider. Four
              equal cards said the opposite of what the band spends its whole
              height establishing. */}
          <div className="dp-routes">
            <ol className="dp-route-set" data-cue="stack" data-cue-ms="1200">
              {IDENTIFIERS.filter((d) => d.code !== "CAGE").map((d) => (
                <li className="dp-route" data-key={d.code} key={d.code}>
                  <Link href={d.href}>
                    <span className="dp-route-top">
                      <span className="dp-route-code u-mono">{d.code}</span>
                      <span className="dp-route-fmt">{d.fmt}</span>
                    </span>
                    {/* The scale track: this identifier drawn as its slice of the
                        13-digit NSN, on a ruler every tile shares. Read down the
                        three — FSC (left) + NIIN (right) = NSN (whole). The seam
                        tick marks the FSC|NIIN boundary at the same fraction on
                        each. Decorative: the digit count states the same fact in
                        text, so this is aria-hidden. */}
                    {d.span ? (
                      <span
                        className="dp-route-scale"
                        aria-hidden="true"
                        style={{
                          ["--from" as string]: `${((d.span[0] - 1) / NSN_LEN) * 100}%`,
                          ["--width" as string]: `${(d.span[1] / NSN_LEN) * 100}%`,
                          ["--seam" as string]: NSN_SEAM,
                        }}
                      >
                        <i />
                      </span>
                    ) : null}
                    <span className="dp-route-name">{d.name}</span>
                    <span className="dp-route-body">{d.body}</span>
                    <span className="dp-route-eg u-mono">{d.eg}</span>
                    <span className="dp-route-go">
                      {d.cta} <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            {IDENTIFIERS.filter((d) => d.code === "CAGE").map((d) => (
              <div className="dp-route-apart" data-cue key={d.code}>
                <p className="dp-route-apart-k">A different system</p>
                <ol className="dp-route-set dp-route-set-one">
                  <li className="dp-route" data-key={d.code}>
                    <Link href={d.href}>
                      <span className="dp-route-top">
                        <span className="dp-route-code u-mono">{d.code}</span>
                        <span className="dp-route-fmt">{d.fmt}</span>
                      </span>
                      {/* No scale track: CAGE is not a slice of the NSN, and the
                          missing ruler is exactly what says so. */}
                      <span className="dp-route-name">{d.name}</span>
                      <span className="dp-route-body">{d.body}</span>
                      <span className="dp-route-eg u-mono">{d.eg}</span>
                      <span className="dp-route-go">
                        {d.cta} <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  </li>
                </ol>
              </div>
            ))}
          </div>
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

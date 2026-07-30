import Link from "next/link";
import { CATEGORIES, MANUFACTURERS, RESOURCES } from "@/lib/data";
import { num } from "@/lib/format";
import { CategoryScroller } from "@/components/home/CategoryScroller";
import { CertMarquee } from "@/components/home/CertMarquee";
import { FeatureReveal } from "@/components/home/FeatureReveal";
import { HeroParallax } from "@/components/home/HeroParallax";
import { HeroSearch } from "@/components/home/HeroSearch";
import { HotStock } from "@/components/home/HotStock";
import { ManufacturerStage } from "@/components/home/ManufacturerStage";
import { NsnMarquee } from "@/components/home/NsnMarquee";

/*
  SECTION INVENTORY — every section maps to one that exists on
  aerospaceunlimited.com today. Nothing invented. Order changed so the search
  leads, because that is the path to an RFQ.

    Hero + search ............ existing hero + existing search bar
    Four feature points ...... existing: Same Day Shipping / Quotes /
                               AOG Service 24/7 x 365 / Competitive Prices
    Certifications ........... existing value-prop badge row
    Hot Stock Items .......... existing section, tabbed by airframe using the
                               existing "Parts by Aircraft / Helicopter Model"
                               axis — same rows, no new content
    Top NSN .................. existing section, as a card marquee — same
                               eight NSNs, ambient client photography
    Top Manufacturers ........ existing section
    Top Part Categories ...... existing section, merged with the separate
                               15-tile grid further down the live page
    Other Resources .......... existing section (5 items + PMA Parts)
    Certifications & Memberships ... existing section

  "A leading supplier" (the accent band + its four promises) was REMOVED at the
  client's request (2026-07-30). It was the page's one accent band; the palette
  keeps `.section-accent` for `.empty-state` elsewhere, so no tokens changed.

  VISUAL SYSTEM — Mona Sans at weight 400 throughout, glass and light
  skeuomorphism (translucent panes over an ambient ground, lit from above),
  rounded corners graded 8–28px, a 180px section rhythm from
  fleet-template.webflow.io, and exactly ONE accent band on the page.
  Full-bleed bands stay square-edged. See design.md.
*/

/* The category directory.

   Ordered by catalogue depth, so the block reads as a ranking rather than an
   arrangement — the featured panel is the deepest category and the list
   descends. Sorted on a COPY: `sort` mutates, and CATEGORIES is a shared
   module-level export that /browse and the nav both read in source order. */
const CATEGORIES_BY_DEPTH = [...CATEGORIES].sort((a, b) => b.count - a.count);

/* The five deepest categories are featured in the pinned scroll-stepper; the
   other seven are reached by the "View all categories" button, not shown inline.
   Derived from the sort rather than named, so adding a deeper category to
   lib/data.ts promotes it into the stage instead of stranding it mid-list.

   Five, not twelve. The stepper spends a fraction of a viewport of scroll per
   step while pinned, so five is a comfortable run; twelve would pin the section
   for most of a page. It is an explicit top-N by catalogue depth, and every one
   of the twelve destinations is one click away at the button. */
const CAT_STEPS = CATEGORIES_BY_DEPTH.slice(0, 5);

/* Summed, not written down, so it cannot drift from the twelve figures the rows
   below it state individually. */
const CAT_TOTAL = CATEGORIES.reduce((sum, c) => sum + c.count, 0);

/* Presentation only, so it lives here rather than in lib/data.ts. One ambient
   aviation scene per featured category — and these are TREATMENT, not evidence.
   The library holds no photograph of a valve, a bearing or a fastener, so no
   image here depicts the category beside it: each `alt` describes the SCENE and
   never the part, and the category's identity stays entirely in the text. Keyed
   by slug, so a reorder in lib/data.ts can never slide a caption onto the wrong
   photograph. Same rule as the manufacturer stage — see au-stock-photography-scope.

   The `img` basenames are NOT descriptive — `flight-deck.jpg` is a propeller,
   `nacelle.jpg` is a cockpit on approach (the source files were named loosely).
   The `alt` is the authoritative description of what each file actually shows;
   trust it over the filename, and if you swap a file, rewrite the alt to the new
   pixels rather than to its name. */
const CAT_SCENES: Record<string, { img: string; alt: string }> = {
  fasteners:  { img: "apron-jet", alt: "A narrow-body airliner taxiing on the apron, its wing and red-cowled engine nearest the camera" },
  bearings:   { img: "turbofan-face", alt: "The fan blades of a turbofan engine seen head-on" },
  electrical: { img: "flight-deck",   alt: "The four-bladed propeller and polished spinner of a parked turboprop, hangar behind" },
  seals:      { img: "jet-nozzle",    alt: "The exhaust nozzle of a military jet seen from behind, its petals feathered" },
  valves:     { img: "nacelle",       alt: "The view from an airliner flight deck on final approach, runway lights ahead" },
};
/* If a deeper category ever displaces one of the five above, it inherits this
   rather than rendering a broken image. */
const CAT_SCENE_FALLBACK = CAT_SCENES.fasteners;

/* Sorted, then sliced — and that order matters. This section reads
   `.slice(0, 8)`, and taking the first eight in SOURCE order is not the top
   eight: GE Aviation sits at index 11 with 118,640 parts, third largest in the
   list, and was being dropped from a section titled "Top manufacturers" while
   Crane Aerospace showed at 39,640. Sorting first fixes that. Copy again,
   because `sort` mutates and MANUFACTURERS is a shared export. */
const MANUFACTURERS_BY_STOCK = [...MANUFACTURERS].sort((a, b) => b.count - a.count);

export default function HomePage() {
  return (
    <>
      {/* ====================================================================
           HERO

           Full-bleed photograph with the copy sitting on it and the search bar
           as a white slab across the bottom — the reference's opening move.
           The old live headline spends the most valuable line on the page
           welcoming the visitor; this one names the offer, and the field a buyer
           actually came for sits directly under it.
           ==================================================================== */}
      <section className="hero">
        {/* Image is set in CSS so the responsive swap and the crop bias live in
            one place with the scrim they are tuned against. */}
        <div
          className="hero-media"
          role="img"
          aria-label="An Airbus A320 taxiing at dusk, airport control tower and terminal lights behind"
        />
        <div className="hero-scrim" aria-hidden="true" />

        {/* The one place an entrance animation is safe: always above the fold,
            so it plays on load rather than waiting for a scroll event. */}
        <HeroParallax />
        <div className="u-page hero-enter">
          <span className="u-label">Aviation &amp; aerospace parts distributor</span>
          {/* Two sentences, each its own line so the headline arrives line by
              line on load. The lines are block spans rather than a `<br>`, which
              lets each carry its own entrance delay; the measure holds both
              sentences on one line apiece down to the mobile breakpoint, where
              they simply stack — the same shape the old explicit break gave. */}
          <h1>
            <span className="hero-line">Find the part.</span>
            <span className="hero-line">Get a quote in 15 minutes.</span>
          </h1>
          <p className="lede">
            Unlimited access to all your aviation supply needs — over 2 billion part numbers,
            searchable by any identifier you already have.
          </p>

          <HeroSearch />
        </div>
      </section>

      {/* ====================================================================
           THE FOUR FEATURE POINTS — the live site's own hero icons.

           Rebuilt to the second supplied reference, which is a different
           composition from the first: the whole section is one white card on the
           page ground, media holds the LEFT column as overlapping shots floating
           in a recessed well, and the copy plus a 2x2 grid of icon chips holds
           the right. The chips are horizontal — tile, then two lines of text —
           not the icon-over-value cards this section used before.

           Every word here already exists on the site. The eyebrow, headline and
           paragraph are lifted verbatim from the about page, and the four facts
           are the ones this section already carried. Nothing was written for it,
           and the photographs are the client's own, already in /img/nsn.

           The four chips are now equal. The reference's grid gets its strength
           from being even, and the quote promise it used to single out is the
           hero headline one screen above — it does not need saying twice.
           ==================================================================== */}
      <section className="section">
        <div className="u-page">
        <div className="feature-block">
        <FeatureReveal />
        <div className="feature-shell">
        <div className="feature-split">
          <div className="feature-intro">
            <p className="eyebrow">The short version</p>
            <h2>An accredited independent distributor, based in Anaheim, California.</h2>
            <p className="feature-lede">
              Aerospace Unlimited supplies aviation, aerospace and defence parts to operators,
              MROs, repair stations and government contractors.
            </p>
            {/* CTAs added in this redesign to anchor the left column, both to
                routes that already exist — the quote flow and the about page.
                No new copy or claims; labels are the site's own. */}
            <div className="feature-actions">
              <Link className="btn btn-primary btn-lg" href="/rfq">
                Request a quote <span aria-hidden="true">→</span>
              </Link>
              <Link className="btn btn-quiet btn-lg" href="/about">
                About us
              </Link>
            </div>
          </div>

          {/* One large photograph anchors the composition — treatment, not
              evidence: an airliner being loaded with cargo, carrying the
              section's mood without claiming to picture a specific job, so it
              takes no caption. */}
          <figure className="feature-portrait">
            <img
              src="/img/feature-cargo.jpg"
              alt="A wide-body airliner on the ramp being loaded with air cargo, a shrink-wrapped freight pallet rising on a loader to the forward cargo door"
              width={1600}
              height={1066}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
        </div>

        {/* The four service facts, restated as a record beneath the card — the
            reference's stat row. Same four facts the section always carried,
            value over label. */}
        <ul className="feature-stats">
          <li>
            <span className="fs-value">Same day</span>
            <span className="fs-label">Shipping</span>
          </li>
          <li>
            <span className="fs-value">15 min</span>
            <span className="fs-label">Quote turnaround</span>
          </li>
          <li>
            <span className="fs-value">24/7</span>
            <span className="fs-label">AOG service · 365 days</span>
          </li>
          <li>
            <span className="fs-value">Competitive</span>
            <span className="fs-label">Pricing</span>
          </li>
        </ul>
        </div>
        </div>
      </section>

      {/* ====================================================================
           HOT STOCK ITEMS

           The live page lists these as bare text links. As real part rows a
           visitor can start an RFQ straight from the homepage, and it teaches
           the row pattern they meet on every later screen.
           ==================================================================== */}
      <section className="section">
        <div className="u-page">
          <div className="section-head section-head-center">
            <p className="eyebrow">Ready to ship</p>
            <h2>Hot stock items</h2>
            <p>
              On our shelves in Anaheim, California. Ordered before 3pm PT, shipped the same day.
            </p>
          </div>

          {/* Four featured ready-to-ship parts around a central photograph; the
              "Full catalog" link beneath the grid is the route to the rest of
              the shelf. */}
          <HotStock />
        </div>
      </section>

      {/* ====================================================================
           TOP NSN — existing section.
           ==================================================================== */}
      <section className="section">
        <div className="u-page">
          <div className="section-head section-head-row">
            <div>
              <h2>Top NSN</h2>
              <p>The National Stock Numbers most often requested from us.</p>
            </div>
            <Link className="btn btn-quiet" href="/browse#identifiers">
              NSN / NIIN / CAGE routes
            </Link>
          </div>
        </div>

        {/* Full bleed, outside .u-page. The reference's marquee runs off both
            edges of the frame; contained inside the page gutter it reads as a row
            of cards that happens to be cropped, which is a different thing.

            Each card is a real NSN and a real link — the photography is the
            treatment, the section's content is unchanged. */}
        <NsnMarquee />
      </section>

      {/* ====================================================================
           TOP MANUFACTURERS — existing section, with the CAGE code against each
           name so a buyer holding a nameplate can confirm the entity.

           Redesigned to the client's reference: a featured stage rather than a
           directory. The head is centred here, which the reference's symmetry
           requires and which the rest of the page does not do — so "View more"
           lost its inline slot and reappears, named, at the lower right of the
           stage. See ManufacturerStage.tsx for the composition.
           ==================================================================== */}
      <section className="section section-subtle">
        <div className="u-page">
          <div className="section-head section-head-center">
            <h2>Top manufacturers</h2>
            <p>Naming is ambiguous after decades of acquisitions. The CAGE code is not.</p>
          </div>
          {/* Five, not the eight the old two-column directory listed. This is
              a top-N sample and the full register is one click away; five is
              what the reference's composition holds at a thumb width where the
              company name is still readable. */}
          <ManufacturerStage
            items={MANUFACTURERS_BY_STOCK.slice(0, 5)}
            total={MANUFACTURERS.length}
          />
        </div>
      </section>

      {/* ====================================================================
           TOP PART CATEGORIES — existing section.

           The live page carries this AND a separate 15-tile grid lower down,
           both pointing at the same places. Merged: same destinations, once.

           A PINNED-IMAGE STAGE, to the client's brief (2026-07-29): one
           photograph held still on the left while the text moves past it on the
           right, the image never changing between steps.

           The five deepest categories get a step each; the other seven sit as
           compact rows below. Sequence carries the ranking, as it did before —
           nothing else encodes depth, because every step and row states its own
           count.

           TWO THINGS THIS DELIBERATELY DOES NOT DO, both because of the same
           renderer limitation — no IntersectionObserver callbacks, no advancing
           CSS animations:

             1. No panel fades or slides in on entry. All five are legible at
                rest. A scroll-reveal here would have shipped the section blank,
                which is exactly how thirteen of fifteen sections once ended up
                at opacity 0.
             2. The image does not swap per step. That is also what the brief
                asked for ("pic stays same"), and it happens to be the only
                version of this pattern that needs no JS at all: `position:
                sticky` does the whole job.

           On the photograph: the featured slot here previously held a category
           GLYPH, not a photo, on the reasoning that one of the site's eight
           aerospace shots sitting under the words "Fasteners & Hardware" stops
           being ambient treatment and starts claiming to be a photograph of
           fasteners. A single image held across all five steps does not make
           that claim about any one of them — it reads as the section's ground.
           Which is why the aggregate figure sits below the frame and not across
           it.

           Nothing was invented. Same twelve categories, same name / FSC / count
           on each, same destinations; the total is summed from those twelve.
           ==================================================================== */}
      <section className="section">
        <div className="u-page">
          {/* Left-aligned head; the standfirst carries the aggregate the old
              pinned photo used to caption. Summed from the twelve, never typed —
              so it cannot drift from the counts the steps state individually. */}
          <div className="section-head cat-head">
            <h2>Top part categories</h2>
            <p>
              Grouped by function, with the matching Federal Supply Class for anyone
              working from a government parts list. <b>{num(CAT_TOTAL)}</b> parts across{" "}
              {CATEGORIES.length} categories.
            </p>
          </div>
        </div>

        {/* The five deepest, as a pinned scroll-stepper. Breaks out of `.u-page`
            because the stage runs edge to edge; the component re-establishes its
            own gutter. Only five are featured — the sequence is a top-N by
            catalogue depth, and the full twelve are one click away at the button
            below. See CategoryScroller. */}
        <CategoryScroller
          steps={CAT_STEPS.map((c) => {
            const scene = CAT_SCENES[c.slug] ?? CAT_SCENE_FALLBACK;
            return { slug: c.slug, name: c.name, fsc: c.fsc, count: c.count, img: scene.img, alt: scene.alt };
          })}
        />

        <div className="u-page">
          {/* The escape hatch the user asked for: five are shown, the rest live
              one click away rather than stacked down the page. */}
          <div className="cat-viewall">
            <Link className="btn btn-quiet" href="/browse#categories">
              View all {CATEGORIES.length} categories
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
           OTHER RESOURCES — existing section and nav dropdown, same items.
           ==================================================================== */}
      <section className="section">
        <div className="u-page">
          <div className="section-head">
            <h2>Other resources</h2>
            <p>Requirements that are not a stock part number.</p>
          </div>
          {/* An expanding strip, built to the supplied reference: narrow slats
              in a row, one of them open. Hovering or focusing a slat opens it
              and the others close.

              These six are the only items on the page a buyer *reads* rather
              than scans for a match, which is what makes an accordion the right
              affordance here and the wrong one for the category tiles — you
              read one of these at a time. The numerals are kept from the card
              version and now do double duty: they are the one thing visible on
              every slat in both states, so the set still reads as a fixed,
              complete list of capabilities rather than a truncated top-six.

              The name appears twice on purpose. `.res-spine` is the vertical
              copy on the closed slat and is aria-hidden; the copy inside
              `.res-panel` is the one assistive tech announces. Two elements
              rather than one because `writing-mode` cannot be transitioned —
              a single element would snap from vertical to horizontal mid-slide.

              Keyed by index, not by `id`: two of these six share the id "pma"
              deliberately. See lib/data.ts → RESOURCES. */}
          <div className="res-strip">
            {RESOURCES.map((r, i) => (
              <Link
                className="res-slat"
                href={r.href ?? `/capabilities#${r.id}`}
                key={`${r.id}-${i}`}
              >
                {/* Decorative, and revealed by the slat's own expansion rather
                    than a fade — it lives to the right of the text panel and is
                    simply clipped away while the slat is closed. aria-hidden and
                    uncaptioned: ambient treatment, not evidence of the capability.
                    See au-stock-photography-scope. */}
                {r.img ? (
                  <span className="res-media" aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/img/resources/${r.img}.jpg`} alt="" loading="lazy" decoding="async" />
                  </span>
                ) : null}
                <span className="res-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="res-spine" aria-hidden="true">
                  {r.name}
                </span>
                <span className="res-panel">
                  <span className="res-name">{r.name}</span>
                  <span className="res-note">{r.note}</span>
                  <span className="res-go" aria-hidden="true">
                    Explore &rarr;
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
           ASAP SEMICONDUCTOR'S CERTIFICATIONS AND MEMBERSHIPS — existing
           section. Set on dark as the page's closing statement before the
           footer, which is also dark, so the two read as one grounded base.
           ==================================================================== */}
      <section className="section section-dark">
        <div className="u-page">
          <div className="section-head">
            <h2>ASAP Semiconductor&rsquo;s certifications and memberships</h2>
            <p>The accreditations a vendor-approval file normally asks for.</p>
          </div>
        </div>

        {/* Full-bleed: the carousel runs edge to edge and fades at both margins,
            so a card leaving frame dissolves instead of being cut. Every mark the
            company actually holds, each on its own card — replacing the five text
            pills this section used to carry. */}
        <CertMarquee />

        <div className="u-page">
          <p className="u-caption" style={{ marginTop: "var(--au-s-6)" }}>
            Certificate copies are available on request &mdash;{" "}
            {/* No inline colour. This link sits in a .section-dark, and ux.css gives
                links on a dark ground --au-link-inverse. The inline
                `color:var(--au-accent)` this replaces beat every stylesheet rule and
                was left over from the amber palette, where the accent was light; the
                accent is now Steel Blue and measured 2.38:1 here. */}
            <Link href="/quality">see quality &amp; certifications</Link>.
          </p>
        </div>
      </section>
    </>
  );
}

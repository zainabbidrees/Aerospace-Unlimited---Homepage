import Link from "next/link";
import { CATEGORIES, MANUFACTURERS, PARTS, RESOURCES } from "@/lib/data";
import { num } from "@/lib/format";
import { CategoryScroller } from "@/components/home/CategoryScroller";
import { CertMarquee } from "@/components/home/CertMarquee";
import { AboutStats } from "@/components/home/AboutStats";
import { HeroRfq } from "@/components/home/HeroRfq";
import { HotStock } from "@/components/home/HotStock";
import { ManufacturerStage } from "@/components/home/ManufacturerStage";
import { NsnMarquee } from "@/components/home/NsnMarquee";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { Testimonials } from "@/components/home/Testimonials";

/*
  SECTION INVENTORY — every section maps to one that exists on
  aerospaceunlimited.com today. Nothing invented. The hero opens with the quote
  request itself, because that is the destination the whole funnel points at.

    Hero + quote ............. existing hero, opening with a compact RFQ form
                               (part number, qty, email, AOG). Replaces the
                               hero search bar — that was redundant with the
                               header's catalogue search, which stays. See
                               HeroRfq.tsx.
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
    Testimonials ............. existing section on the network flagship
                               (asapsemi.com/testimonials), as a centre-stage
                               carousel. Its content is that page's own
                               placeholder set — see Testimonials.tsx for why
                               it must stay placeholder until real quotes
                               arrive.
    Partner with ASAP ........ closing CTA to a supplied reference (2026-08-07);
                               both routes (RFQ, contact) already exist.

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
      {/* Mounts one shared IntersectionObserver that plays the [data-reveal]
          entrances. Renders nothing and only arms after mount, so the no-JS /
          screenshot path keeps every band visible. See ScrollReveal.tsx. */}
      <ScrollReveal />

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
          aria-label="The rear quarter of a Gulfstream business jet — its turbofan engine, winglet and mirror-polished fuselage against a cloudy sky"
        />
        <div className="hero-scrim" aria-hidden="true" />

        {/* The one place an entrance animation is safe: always above the fold,
            so it plays on load rather than waiting for a scroll event. */}
        {/* Two columns: the copy on the left, the quote console on the right —
            the classic hero split. Each is one grid cell so they size
            independently; see `.hero > .u-page` in ux.css. */}
        <div className="u-page hero-enter">
          <div className="hero-copy">
            <span className="eyebrow">Aviation &amp; aerospace parts distributor</span>
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
          </div>

          <HeroRfq />
        </div>
      </section>

      {/* ====================================================================
           ABOUT ASAP — the live site's "short version" section, rebuilt to a
           supplied Figma design (node 3209:596).

           Two columns on the page ground, no card: a left column of eyebrow +
           display headline (with "distributor" set in the accent) + lede + one
           wide photograph, and a right column of the four service facts stacked
           and hairline-divided, each with a short vertical accent tick. The four
           facts are the ones this section has always carried; the copy is the
           design's, trimmed to it. See the .about block in ux.css.

           The photograph is TREATMENT, not evidence — a flight-deck-on-approach
           scene carrying the section's mood, so it takes a scene-only alt and no
           caption. See au-stock-photography-scope.

           MOTION — none, at the client's direction (2026-08-07): this band
           renders static, with no entrance of any kind. An authored "landing"
           arrival (clip-path wipe + push-in + specular pass) was built and
           then REMOVED on the client's explicit instruction — do not re-add an
           entrance here, including the generic [data-reveal] rise. The stat
           row keeps its count-up (values never hidden); that is the section's
           only motion. See au-about-band-static.
           ==================================================================== */}
      <section className="section">
        <div className="u-page">
          <div className="about">
            {/* Left column: the whole story — pill eyebrow, headline, lede, the
                two calls to action, a divider, and the four service facts as a
                horizontal stat row. Same copy and facts the section has always
                carried; only the composition is the reference's. */}
            <div className="about-body">
              <p className="about-eyebrow">About ASAP</p>
              <h2 className="about-title">
                An accredited{" "}
                <span className="about-title-accent">distributor</span>, based in
                California.
              </h2>
              <p className="about-lede">
                Aerospace Unlimited supplies aviation, aerospace and defence parts
                to operators, MROs, repair stations and government contractors.
                Unlimited access to all your aviation supplies.
              </p>

              <div className="about-actions">
                <Link className="btn btn-primary" href="/rfq">
                  Request a Quote <span aria-hidden="true">&rarr;</span>
                </Link>
                <Link className="btn btn-quiet" href="/about">
                  About us
                </Link>
              </div>

              <hr className="about-divider" />

              {/* The four service facts as an animated stat row — a short accent
                  rule, a count-up on the numeric values, and a staggered rise on
                  scroll-in. Same four facts the section has always carried. */}
              <AboutStats />
            </div>

            {/* Right column: the photograph as a tall card. TREATMENT, not
                evidence — a flight-deck-on-approach scene, scene-only alt, no
                caption, and deliberately not a portrait of a person (which would
                read as "ASAP's team"). See au-stock-photography-scope. */}
            <figure className="about-media">
              <img
                src="/img/feature-flightdeck.jpg"
                alt="The view from an airliner flight deck on final approach, runway lights ahead and the instrument panel glowing"
                width={1600}
                height={906}
                loading="lazy"
                decoding="async"
              />
            </figure>
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
          <div className="section-head section-head-center" data-reveal="up">
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
          <div className="section-head section-head-row" data-reveal="up">
            <div>
              <h2>Top NSN</h2>
              <p>The National Stock Numbers most often requested from us.</p>
            </div>
            <Link className="btn btn-quiet" href="/nsn">
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
          <div className="section-head section-head-center" data-reveal="up">
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
          <div className="section-head cat-head" data-reveal="up">
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
            /* The "e.g." line is real rows from the sample catalog — two at
               most, and empty is fine (the line simply doesn't render). Never
               a hand-written part number. See au-no-invented-content. */
            const egs = PARTS.filter((p) => p.category === c.slug)
              .slice(0, 2)
              .map((p) => p.pn);
            return { slug: c.slug, name: c.name, fsc: c.fsc, count: c.count, img: scene.img, alt: scene.alt, egs };
          })}
        />

        <div className="u-page">
          {/* The escape hatch the user asked for: five are shown, the rest live
              one click away rather than stacked down the page. */}
          <div className="cat-viewall">
            <Link className="btn btn-quiet" href="/part-types">
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
          <div className="section-head" data-reveal="up">
            <h2>Other resources</h2>
            <p>Requirements that are not a stock part number.</p>
          </div>
          {/* An expanding strip, built to the supplied reference: narrow slats
              in a row, one of them open. Hovering or focusing a slat opens it
              and the others close.

              These four are the only items on the page a buyer *reads* rather
              than scans for a match, which is what makes an accordion the right
              affordance here and the wrong one for the category tiles — you
              read one of these at a time. The numerals are kept from the card
              version and now do double duty: they are the one thing visible on
              every slat in both states, so the set still reads as a fixed,
              complete list of resources rather than a truncated subset.

              The name appears twice on purpose. `.res-spine` is the vertical
              copy on the closed slat and is aria-hidden; the copy inside
              `.res-panel` is the one assistive tech announces. Two elements
              rather than one because `writing-mode` cannot be transitioned —
              a single element would snap from vertical to horizontal mid-slide.

              Each resource now has a unique id and its own standalone page. See
              lib/data.ts → RESOURCES. */}
          <div className="res-strip" data-reveal="up">
            {RESOURCES.map((r, i) => (
              <Link
                className="res-slat"
                href={r.href ?? "/rfq"}
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
          <div className="section-head" data-reveal="up">
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
            <a href="https://www.asapsemi.com/quality/" target="_blank" rel="noopener noreferrer">see quality &amp; certifications</a>.
          </p>
        </div>
      </section>

      {/* ====================================================================
           WHAT OUR CLIENTS SAY — the testimonials carousel the client's
           network site carries (asapsemi.com/testimonials), rebuilt to a
           supplied reference: a rounded light panel, a quote-mark watermark,
           and a card rail with the centre card emphasised.

           An editorial split on the section ground — a featured pull-quote
           beside a roster of the other voices — carrying real, sourced
           customer reviews of ASAP Semiconductor (see Testimonials.tsx).
           ==================================================================== */}
      <section className="section section-subtle">
        <div className="u-page">
          <Testimonials />
        </div>
      </section>

      {/* ====================================================================
           PARTNER WITH ASAP — the closing call-to-action, built to a supplied
           reference: a dark band ruled like graph paper, a centred display
           headline with the offer's object set in light steel, the two routes
           a buyer can take, and one reassurance line under them.

           The last of the three dark bands, so the base runs unbroken into
           the footer. Both buttons are routes that already exist — the RFQ
           and the contact desk; the copy is the reference's own.
           ==================================================================== */}
      <section className="section section-dark homecta">
        <div className="u-page">
          <div className="homecta-inner" data-reveal="up">
            <div className="section-head section-head-center">
              <p className="eyebrow">Partner with ASAP</p>
              <h2 className="homecta-title">
                Let&rsquo;s get your{" "}
                <span className="homecta-accent">parts moving</span>.
              </h2>
              <p>
                You get more than parts, a team that answers, delivers on time,
                and stands behind every certificate it ships.
              </p>
            </div>
            <div className="homecta-actions">
              <Link className="btn btn-primary btn-lg" href="/rfq">
                Request a Quote <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link className="btn btn-quiet btn-lg" href="/contact">
                Contact Us
              </Link>
            </div>
            <p className="homecta-note">
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path
                  d="m3 8.5 3.5 3.5L13 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              No pressure, no placeholder pricing, a real quote, on your timeline.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

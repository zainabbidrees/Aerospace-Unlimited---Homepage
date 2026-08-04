import Link from "next/link";
import type { Metadata } from "next";
import { AboutIcon } from "@/components/about/AboutIcon";
import { CountTally } from "@/components/about/CountTally";
import { EdgeReveal } from "@/components/about/EdgeReveal";
import { HeroZoom } from "@/components/about/HeroZoom";
import { IndustryRegister } from "@/components/about/IndustryRegister";
import { StoryStage } from "@/components/about/StoryStage";
import { ValuesConverge } from "@/components/about/ValuesConverge";
import { CertMarquee } from "@/components/home/CertMarquee";
import { ScrollReveal } from "@/components/home/ScrollReveal";

/*
  ABOUT US — built to the client's "About Us Blueprint": a hero, then ten
  bands (Story, Mission, Values, What Sets Us Apart, By the Numbers, Industries,
  Team, Quality & Compliance, Facility, Partner). Each band is a main column
  with a short editorial note in a right-hand rail — the blueprint's recurring
  shape, carried here on one `.a-band` primitive rather than ten bespoke ones.

  VISUAL SYSTEM — the same as the homepage, by the client's instruction: Mona
  Sans at weight 400, glass and light skeuomorphism, the section rhythm and the
  `.about` two-column idiom, and the shared [data-reveal] entrance observer.
  Nothing here gates content on an animation — the au-rise keyframes translate
  only, never fade, so the no-JS / screenshot path keeps every band visible.
  See au-motion-safety.

  COPY — the blueprint's, with two deliberate departures. (1) The company is
  named "Aerospace Unlimited" throughout, matching the rest of the site rather
  than the blueprint's "ASAP" shorthand. (2) "By the Numbers" uses figures the
  site already states (2bn+ part numbers, same-day shipping, 15-minute quotes,
  24/7 AOG) instead of the blueprint's unverified 20+/5,000+/15MN+ — no claim
  ships that the site cannot stand behind. The blueprint's "Why It Matters"
  note is design annotation, not customer copy, so it is not on the page.

  PHOTOGRAPHY — treatment, not evidence. Every image is a generic aerospace
  scene carrying a section's mood; each `alt` describes the SCENE and never the
  company, the team or a part, and none is captioned. See au-stock-photography-scope.
*/

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Aerospace Unlimited connects aerospace, defense, industrial and commercial " +
    "industries with the parts they need — fast, reliably and without compromise.",
};

/* Our values — the four the client states, in their stated order. The numbering
   is positional, so it is generated from the array rather than written in. */
const VALUES = [
  { icon: "integrity", name: "Integrity", note: "We do what’s right. Always." },
  { icon: "reliability", name: "Reliability", note: "Count on us. Every time." },
  { icon: "passion", name: "Passion", note: "We care about your mission as much as you do." },
  { icon: "continuous-improvement", name: "Continuous improvement", note: "We learn, adapt, and get better every day." },
];

/* Our story — the six promises the client states, in their stated order. An
   array so each one can carry its own confirming check mark and its own slot in
   the section's arrival sequence; the copy is unchanged. */
const STORY_CHECKS = [
  "We listen first",
  "We solve hard problems",
  "We deliver on time",
  "We stand by our word",
  "Deep industry expertise",
  "A partner for the long term",
];

/* What sets us apart — six points. */
const EDGE = [
  { icon: "extensive-network", name: "Extensive network", note: "Global sourcing for hard-to-find parts." },
  { icon: "fast-responsive", name: "Fast & responsive", note: "Quick turnarounds and real-time communication." },
  { icon: "quality-assured", name: "Quality assured", note: "Rigorous vetting and quality standards." },
  { icon: "customer-focused", name: "Customer focused", note: "Solutions tailored to your unique needs." },
  { icon: "competitive-pricing", name: "Competitive pricing", note: "Value-driven pricing without compromise." },
  { icon: "experienced-team", name: "Experienced team", note: "Industry experts with deep technical know-how." },
];

/* By the numbers — the client's four figures, split by what they actually are.

   THREE OF THEM ARE COUNTS: quantities that accumulate, and the only reason to
   state them is the total. They read as one ledger — a divided record, largest
   type on the page, counting itself up as the band arrives.

   THE FOURTH IS NOT A COUNT. "24/7/365" is a state, not a total; it says we
   answer now, where the others say we have done this much. So it does not sit
   in the ledger's rhythm — it is the lit plate at the end of the panel, keeping
   the header's live red dot. That dot is also why the plate has to invert to a
   light surface: Stock-out red measures 1.03:1 on Steel Blue, effectively
   invisible, so the live indicator needs a light ground under it.

   `n` is the value the tally counts to; the trailing "+" is a separate span so
   it stays put while the digits run, and stays tinted so the figure reads as
   "at least this many". */
const COUNTS = [
  { n: 17, k: "Years in business" },
  { n: 60000, k: "Organizations served" },
  { n: 5100, k: "Manufacturers network" },
];

const AOG = { v: "24/7/365", k: "AOG support" };

/* The industries served — labels only, as the blueprint sets them. Six peers in
   editorial order; nothing here ranks them, and nothing in the layout may claim
   otherwise. The old `featured` / `wide` flags are gone with the mosaic they
   drove, and so is the per-image `alt`: the scenes are decorative now and the
   row's own label is the accessible name. See IndustryRegister.tsx. */
const INDUSTRIES = [
  { icon: "aerospace", name: "Aerospace", img: "/img/industries/aerospace.jpg" },
  { icon: "defense", name: "Defense", img: "/img/industries/defense.jpg" },
  { icon: "industrial", name: "Industrial", img: "/img/industries/industrial.jpg" },
  { icon: "commercial", name: "Commercial", img: "/img/industries/commercial.jpg" },
  { icon: "energy", name: "Energy", img: "/img/industries/energy.jpg" },
  { icon: "oem-mro", name: "OEMs & MROs", img: "/img/industries/oem-mro.jpg" },
];

/* What we do — six disciplines, ported verbatim from the client's prototype
   (copy + icons). The featured card is image-backed with a checklist; the rest
   pair a glyph with a small scene thumbnail. Content is client-supplied. */
const WHATWEDO = [
  {
    title: "Solutions-Driven Purchasing",
    desc: "Every RFQ gets a named account manager and a real, priced, lead-timed quote.",
    featured: true,
    pill: "Priced & Lead-Timed",
    bg: "/img/services/featured.jpg",
    list: [
      "Named account manager per RFQ",
      "Priced & lead-timed responses",
      "Hard-to-find, obsolete & long-lead sourcing",
    ],
    icon: <path d="M3 12h3.5l2.2-7 4.6 14 2.2-7H21" />,
  },
  {
    title: "24/7 Customer Service",
    desc: "A live RFQ desk around the clock. 15-minute response SLA, AOG or not.",
    thumb: "/img/services/t-service.jpg",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3.2 2.2" />
      </>
    ),
  },
  {
    title: "Quality & Traceability",
    desc: "AS9120, ISO 9001 and FAA-accredited, with lot certification on every line.",
    thumb: "/img/services/t-quality.jpg",
    icon: (
      <>
        <path d="M12 3 19 5.5V11c0 4.8-3 8-7 9.5C8 19 5 15.8 5 11V5.5Z" />
        <path d="m8.5 11.7 2.3 2.3L15.5 9" />
      </>
    ),
  },
  {
    title: "AOG & Critical Logistics",
    desc: "Aircraft-on-ground requests jump the queue: same-day expedite and hand-carry.",
    thumb: "/img/services/t-aog.jpg",
    icon: (
      <>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
        <path d="M4 7.5 12 12l8-4.5" />
        <path d="M12 12v9" />
      </>
    ),
  },
  {
    title: "BOM & Kitting",
    desc: "Upload a full BOM, get it quoted line-by-line and kitted into one shipment.",
    thumb: "/img/services/t-bom.jpg",
    icon: (
      <>
        <rect x="3.5" y="4" width="7" height="7" rx="1.2" />
        <rect x="13.5" y="4" width="7" height="7" rx="1.2" />
        <rect x="3.5" y="13" width="7" height="7" rx="1.2" />
        <rect x="13.5" y="13" width="7" height="7" rx="1.2" />
      </>
    ),
  },
  {
    title: "Defense & NSN Supply",
    desc: "NSN, CAGE and NIIN procurement with full FAR/DFARS flow-down compliance.",
    thumb: "/img/services/t-defense.jpg",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5l1 2.8 3 .3-2.3 1.9.7 2.9L12 13.8l-2.4 1.6.7-2.9L8 10.6l3-.3Z" />
      </>
    ),
  },
];

/* Our leadership — the prototype's expanding portrait gallery. Names, roles and
   photos are the prototype's placeholders (stock portraits). */
const LEADERSHIP = [
  { name: "Joe Faruqui", role: "Founder & CEO", bio: "Sets the long-term direction and keeps the company accountable to every customer promise.", img: "/img/leadership/joe.jpg" },
  { name: "Elena Ruiz", role: "President", bio: "Runs day-to-day operations across sourcing, quality, and fulfillment.", img: "/img/leadership/elena.jpg" },
  { name: "David Chen", role: "VP, Operations", bio: "Owns the warehouse and logistics network that gets parts out the door on time.", img: "/img/leadership/david.jpg" },
  { name: "Rohan Mehta", role: "VP, Quality & Compliance", bio: "Holds every certificate and traceability record to the same strict standard.", img: "/img/leadership/rohan.jpg" },
  { name: "James Alden", role: "VP, Sales & Business Development", bio: "Builds the customer relationships that turn a quote into a lasting partnership.", img: "/img/leadership/james.jpg" },
  { name: "Arun Nair", role: "Director, Supply Chain", bio: "Manages supplier vetting and inventory strategy across the global network.", img: "/img/leadership/arun.jpg" },
];

export default function AboutPage() {
  return (
    <>
      {/* One shared IntersectionObserver plays the [data-reveal] entrances and
          only arms after mount, so no-JS and screenshot renders stay visible. */}
      <ScrollReveal />

      {/* Pointer-tracked light and tilt on the Our Story photograph. Writes CSS
          custom properties only; bails out entirely off a fine pointer. */}
      <StoryStage />

      {/* Scroll progress for the values row's convergence. Writes two custom
          properties that both default to "landed" in CSS, and latches once the
          row arrives so scrolling back up cannot pull it apart. */}
      <ValuesConverge />

      {/* Cues the What-sets-us-apart band per element, on each one's own trigger
          line. The shared observer's 2s blanket reveal used to play this whole
          entrance four screens before the reader reached it. */}
      <EdgeReveal />

      {/* ====================================================================
           HERO — a centred, text-first opening on the page ground, built to a
           client reference (outtengolden.com): kicker, a large centred headline,
           then one wide rounded photograph that resolves in beneath it.

           The photograph is the real headquarters at 1341 S. Sinclaire St.,
           Anaheim — evidence, not ambient treatment, so it is named in an
           address plate. The headline rises in line by line on load (translate
           only, so no line is ever hidden); the photograph uses the shared
           [data-reveal] observer. See the .ahero block in ux.css.
           ==================================================================== */}
      <section className="ahero">
        <div className="u-page ahero-inner">
          <p className="eyebrow eyebrow-center">Aerospace · Defense · Industrial parts distributor</p>
          <h1 className="ahero-title">
            <span className="ahero-line">Built to support the mission.</span>
            <span className="ahero-line">Committed to deliver.</span>
          </h1>
          <p className="ahero-lede">
            From major air carriers to the U.S. Department of Defense, operators
            source over two billion quality-assured parts from Aerospace Unlimited
            — vetted hard, and shipped the same day.
          </p>
          <div className="a-cta-row ahero-cta">
            <Link className="btn btn-primary btn-lg" href="/rfq">
              Request a Quote
            </Link>
            <Link className="btn btn-quiet btn-lg" href="/capabilities">
              Our capabilities
            </Link>
          </div>
        </div>

        {/* The scroll-linked zoom that scales and deepens the photograph as it
            rises up the viewport. Renders nothing. */}
        <HeroZoom />
        <div className="u-page">
          <figure className="ahero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/hq-anaheim.jpg"
              alt="The Aerospace Unlimited headquarters at dusk — a modern two-storey distribution facility with a lit sign above two charcoal loading-bay doors, warm uplighting on the planting, a palm tree and deep blue evening sky behind"
              width={1535}
              height={1024}
              decoding="async"
              fetchPriority="high"
            />
            <figcaption className="ahero-cap">
              1341 S. Sinclaire St. · Anaheim, California
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ====================================================================
           OUR STORY — built to a client reference: a square photograph on the
           left, and on the right a pill badge, the headline, a paragraph, and a
           two-column checklist with filled accent check marks. The photograph is
           a real ASAP operations shot, so it is evidence, not ambient treatment.
           Typography stays the page's own — the pill matches the eyebrow scale,
           the headline is a standard section h2.

           MOTION — this band carries the page's one authored sequence, and its
           thesis is light moving over glass, the same thing --au-inner-top says
           statically. The photograph wipes open top-to-bottom while the image
           settles out of a push-in and a single specular pass crosses the frame;
           on a fine pointer the frame tilts and the highlight tracks the cursor.
           The column then plays as the argument in order — rule, headline out
           from under its own baseline, lede, then the six promises confirming
           one at a time as each check draws itself.

           Every part of that is armed-then-played by the shared ScrollReveal, so
           at rest — server render, no JS, the screenshot renderer, reduced
           motion — this section is exactly its static self. See au-motion-safety.
           ==================================================================== */}
      <section className="section">
        <div className="u-page">
          <div className="story">
            <figure className="story-media" data-reveal="story-media" data-story-stage>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/story.jpg"
                alt="An Aerospace Unlimited team member in a company polo pulling a part from the blue stock bins, the company logo on the warehouse wall behind"
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
              />
              {/* The cursor-tracked specular. Purely a light layer — it holds no
                  content and never intercepts the pointer. */}
              <span className="story-gloss" aria-hidden="true" />
            </figure>

            <div className="story-body" data-reveal="story">
              <span className="eyebrow">Our story</span>
              <h2 className="story-title">More than parts — a partner you can count on</h2>
              <p className="story-lede">
                Aerospace Unlimited began with a simple belief: our customers deserve
                more than parts — they deserve a partner they can count on. What
                started as a small, customer-focused operation has grown into a
                trusted global supplier for aerospace, defense, industrial, and
                commercial programs — known for solving the hardest sourcing
                challenges with speed, precision, and integrity.
              </p>
              <ul className="story-checks">
                {STORY_CHECKS.map((c) => (
                  <li key={c}>
                    <span className="story-check" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5l4.5 4.5L19 7" />
                      </svg>
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
           MISSION & VISION — one section, built to a client reference: a header
           (eyebrow, headline, paragraph, CTA), then a tall photo card on the
           left and two stacked cards (Mission, Vision) on the right. The
           reference's third "Our Story" card is replaced with "Our Promise",
           since Our Story is its own section above. The reference's green maps
           to this site's palette — a light Wash card and a Navy card — not the
           mock's colour.

           MOTION — the band assembles once, as you reach it, and then holds
           still. Its character is focus and light, which is the section's own
           argument: the photograph settles out of a slight overscale, Mission
           lands and Vision follows a beat later, each card's accent spine draws
           down its leading edge, and the corner glow comes up last.

           An earlier version drove all of this from scroll position instead —
           the photo panning and the two cards lagging the scrollbar. It was
           rejected for the right reason: coupled to scroll, the cards were
           moving the entire time the band was on screen and never settled while
           they were being read. This runs on the shared [data-reveal] observer,
           so it plays once and stops. See the .mv arrival block in ux.css.
           ==================================================================== */}
      <section className="section section-subtle">
        <div className="u-page">
          <div className="mv-head">
            <div className="mv-head-lead" data-reveal="up">
              <p className="eyebrow">Mission &amp; vision</p>
              <h2>Guided by mission. Driven by vision.</h2>
              <Link className="btn btn-primary btn-lg" href="/rfq">
                Request a Quote
              </Link>
            </div>
            <p className="mv-head-text" data-reveal="up">
              Everything we do is anchored in a clear purpose: to make sourcing
              dependable for the teams that keep aircraft, vehicles, and systems
              operational — and to build the relationships that make it last.
            </p>
          </div>

          <div className="mv-grid">
            <figure className="mv-feature" data-reveal="up">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/mv-feature.jpg"
                alt="An Aerospace Unlimited team gathered for a briefing on the warehouse floor, the company sign on the wall behind them"
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="mv-feature-cap">
                <span className="mv-feature-title">Our promise</span>
                <p>We&rsquo;re not just a supplier — we&rsquo;re your long-term sourcing partner.</p>
              </figcaption>
            </figure>

            {/* The label is the kicker and the sentence is the display line —
                see .mv-card. The trailing clause is spanned so it can take the
                second tone: one sentence, two weights of attention. Both tones
                are measured against the worst-case pixel on their own card,
                glow included — a qualifier is half the message, so it does not
                get to be the unreadable half. */}
            <div className="mv-cards" data-reveal="stagger">
              <article className="mv-card mv-card-light">
                <h3 className="mv-card-kicker">Our mission</h3>
                <p className="mv-card-line">
                  To deliver the right parts, at the right time, with the right
                  quality
                  <span className="mv-card-tail">
                    {" "}
                    — so our customers can operate with confidence.
                  </span>
                </p>
              </article>
              <article className="mv-card mv-card-dark">
                <h3 className="mv-card-kicker">Our vision</h3>
                <p className="mv-card-line">
                  To be the most trusted single source for aerospace, defense,
                  and industrial parts
                  <span className="mv-card-tail">
                    {" "}
                    — wherever the mission takes you.
                  </span>
                </p>
              </article>
            </div>
          </div>
        </div>

      </section>

      {/* ====================================================================
           OUR VALUES — the client reference's centred eyebrow and two-tone
           headline, then the four values as banded plates: a tinted head band
           carrying the icon chip and the plate number, a hairline, then the value
           and its line in the body. The band is what holds a one-line value to
           its card; before it, the content sat in the top third of an undivided
           box and the rest read as unfinished. Same padded-head-over-a-hairline
           idiom as .rfq-panel-head and .drawer-head — see the .value-card block
           in ux.css. The headline is a standard section h2 (sentence case,
           --au-text-h2), so it sits at the same scale as every other head on the
           page; the accent carries the second sentence.

           These cards used to hang off a connector rail with ringed nodes and
           drop stems. It is gone: it read as wiring laid over the row, and a
           rail draws a SEQUENCE, which four values with no order are not. See
           the .values-rail block in ux.css.
           ==================================================================== */}
      <section className="section">
        <div className="u-page">
          <div className="values-head" data-reveal="up">
            <span className="eyebrow eyebrow-center">What we stand for</span>
            <h2 className="values-title">
              Four values.{" "}
              <span className="values-title-accent">One standard.</span>
            </h2>
          </div>

          {/* An ordered list: the numbering is real order, not decoration, so
              the numerals are aria-hidden and the <ol> carries it instead.

              This row does NOT take the shared [data-reveal="stagger"] entrance.
              A stagger fires the cards one after another, which is a sequence —
              the same claim the removed rail was making. It gets the authored
              convergence instead: all four driven off one progress value, from
              four different offsets, landing level together. The choreography is
              in ux.css and the scroll progress comes from ValuesConverge; both
              default to landed, so this row is never gated on either. */}
          <ol className="values-rail" data-values-converge>
            {VALUES.map((v, i) => (
              <li className="value-step" key={v.icon}>
                <article className="card value-card">
                  <div className="value-card-top">
                    <span className="value-ico">
                      <AboutIcon name={v.icon} />
                    </span>
                    <span className="value-num" aria-hidden="true">
                      {`0${i + 1}`}
                    </span>
                  </div>
                  <div className="value-card-body">
                    <h3>{v.name}</h3>
                    <p>{v.note}</p>
                  </div>
                </article>
              </li>
            ))}
          </ol>

          <div className="values-cta" data-reveal="up">
            <Link className="btn btn-primary btn-lg" href="/contact">
              Talk to our team
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
           WHAT SETS US APART — built to a client reference: a centred head, then
           feature cards flanking a central photograph. The reference shows four
           cards; we carry six differentiators, so they run three per side around
           the image. Each card is a navy icon chip and a title-then-detail line.

           `data-side` is what lets the entrance CONVERGE: each column arrives
           from its own outer edge toward the photograph, so the direction of the
           motion has to be known per column. See the .edge-* motion block in
           ux.css — deliberately a different mechanism from the industries band.

           THE CARDS AND THE PHOTOGRAPH ARE CUED INDIVIDUALLY, by EdgeReveal, and
           deliberately not by the shared [data-reveal] observer. That observer
           arms on mount and blanket-reveals 2s later; this band sits four
           viewport-heights down, so the whole entrance used to play out while the
           reader was still four screens above it. `data-edge-cue` hands each
           element its own trigger, so the band unfolds as you scroll into it.
           ==================================================================== */}
      <section className="section section-subtle" id="edge" data-edge-band>
        <div className="u-page">
          <div className="section-head section-head-center" data-reveal="up">
            <h2>What sets us apart from the competition</h2>
            <p>
              The capabilities behind faster sourcing, harder vetting, and parts
              you can stand behind — order after order.
            </p>
          </div>

          <div className="edge-grid">
            <div className="edge-col" data-side="left">
              {EDGE.slice(0, 3).map((e) => (
                <article className="card edge-card" key={e.icon} data-edge-cue>
                  <span className="edge-ico">
                    <AboutIcon name={e.icon} />
                  </span>
                  <p className="edge-text">
                    <strong>{e.name}</strong> {e.note}
                  </p>
                </article>
              ))}
            </div>

            <figure className="edge-media" data-edge-cue data-edge-media>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/edge.jpg"
                alt="An Aerospace Unlimited team member in a company polo loading a branded stock bin into a delivery truck"
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
              />
            </figure>

            <div className="edge-col" data-side="right">
              {EDGE.slice(3, 6).map((e) => (
                <article className="card edge-card" key={e.icon} data-edge-cue>
                  <span className="edge-ico">
                    <AboutIcon name={e.icon} />
                  </span>
                  <p className="edge-text">
                    <strong>{e.name}</strong> {e.note}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
           WHAT WE DO — ported from the client's prototype: a two-line heading and
           intro, then a bento of six disciplines. The featured card is image-
           backed with a checklist; the rest pair a glyph with a scene thumbnail.
           Copy and icons are the prototype's (client-supplied content).
           ==================================================================== */}
      <section className="section svc">
        <div className="u-page">
          <div className="svc-head" data-reveal="up">
            <div>
              <p className="eyebrow">What we do</p>
              <h2 className="svc-title">
                Six Disciplines, One Standard{" "}
                <span className="svc-accent">Of Ownership.</span>
              </h2>
            </div>
            <p className="svc-intro">
              The catalogue is only the surface. What sets ASAP apart is how every
              request is handled after it lands, with the same accountability on one
              connector or a full program.
            </p>
          </div>

          <ol className="svc-grid" data-reveal="stagger">
            {WHATWEDO.map((s) => (
              <li className={`svc-card${s.featured ? " is-featured" : ""}`} key={s.title}>
                {s.featured && s.bg && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img className="svc-bg" src={s.bg} alt="" aria-hidden="true" width={1100} height={800} loading="lazy" />
                )}
                <span className="svc-ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {s.icon}
                  </svg>
                </span>
                {s.featured && s.pill && (
                  <span className="svc-pill">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 12 5 5 11-11" /></svg>
                    {s.pill}
                  </span>
                )}
                {!s.featured && s.thumb && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img className="svc-thumb" src={s.thumb} alt="" aria-hidden="true" width={120} height={120} loading="lazy" />
                )}
                <div className="svc-body">
                  <h3 className="svc-name">{s.title}</h3>
                  <p className="svc-desc">{s.desc}</p>
                  {s.list && (
                    <ul className="svc-list">
                      {s.list.map((li) => (
                        <li key={li}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 12 5 5 11-11" /></svg>
                          {li}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ====================================================================
           BY THE NUMBERS — THIS PAGE'S ONE ACCENT BAND.

           It was four equal white cards sitting between two other card grids —
           the third card grid in a row and the weakest of the three, which is
           the whole reason it read flat. The figures were not competing with the
           page; they had opted out of it. Nothing here is a new device: the
           full-bleed accent band, the divided record and the blueprint lattice
           are all moves this site already owns. The band just stops declining
           them. Exactly one accent band per page — About had none. See
           au-visual-system.

           The structure carries the argument on its own, with the copy stripped
           out: three accumulated counts as ONE divided ledger, then the live
           state set apart on a lit plate. Cards are gone — a card per figure
           made four separate objects out of one record, and the four-equal-cards
           /big-number/small-label shape is the stat-band default this section
           was stuck in.

           MOTION. One authored moment, and the scroll is its clock: THE LEDGER
           WRITES ITSELF as the band travels up the viewport. One progress value
           (CountTally) draws the shelf rule left to right behind a bright pen
           tip, drops each column hairline in after it, and runs the three
           figures up toward their totals — while the live plate, which is a
           state rather than an accumulation, only drifts onto its own plane.
           Progress never moves backwards, and 380ms after the reader stops
           scrolling the run lands itself, so a partial figure is never what
           anyone reads. Everything else stays quiet: the shared [data-reveal]
           stagger for the entrance, the live dot's pulse because it means
           something, and a hairline that brightens under the cursor. Nothing is
           gated on any of it — the true figures and a fully drawn ledger are
           what the server renders and what a dead frame leaves on screen. See
           au-motion-safety.

           Figures are the ones the client supplied, unchanged.
           ==================================================================== */}
      <section className="section section-accent a-numbers">
        <div className="u-page nums-inner">
          {/* The head and the live plate share the top line, so the plate holds
              the space the headline leaves and the band has no dead half. */}
          <div className="nums-top">
            <div className="section-head nums-head" data-reveal="up">
              <p className="eyebrow">By the numbers</p>
              <h2>
                The proof is <span className="nums-accent">in the numbers.</span>
              </h2>
              <p>Numbers reflect our experience. Relationships reflect our success.</p>
            </div>

            {/* Two elements, and the split is load-bearing: `.nums-live` carries
                the [data-reveal] entrance, `.nums-plate` carries the hover. A
                hover transition on the revealed element itself wins on cascade
                order and eats the entrance. */}
            <div className="nums-live" data-reveal="up">
              <div className="nums-plate">
                <span className="nums-v nums-v-plate">{AOG.v}</span>
                <span className="nums-k nums-k-plate">
                  <span className="nums-dot" aria-hidden="true" />
                  {AOG.k}
                </span>
              </div>
            </div>
          </div>

          {/* NO [data-reveal] on this row, deliberately. The shared stagger was
              fading the cells in at the same moment the ledger was writing them,
              so the figures counted up at partial opacity — two arrivals for one
              event. This row authors its own, which is exactly the exemption the
              stagger containers already have in the reveal rules. */}
          <ol className="nums-panel">
            {COUNTS.map((n) => (
              <li className="nums-cell" key={n.k}>
                <span className="nums-v">
                  {/* The server renders the final figure. CountTally only ever
                      rewrites it after a frame has actually fired. */}
                  <span className="nums-d" data-count={n.n}>
                    {n.n.toLocaleString("en-US")}
                  </span>
                  <span className="nums-plus">+</span>
                </span>
                <span className="nums-k">{n.k}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Drives the whole band off one scroll-linked progress value — the rule,
            the hairlines, the three figures and the plate's plane. Renders
            nothing. */}
        <CountTally />
      </section>

      {/* ====================================================================
           INDUSTRIES WE SERVE — a register, not a mosaic.

           The header sets the band across the full measure (eyebrow, heading and
           lede at the left, the quote CTA out at the right edge on the heading's
           baseline). Under it the stage: one photographic frame at the left, the
           six industries as hairline rows at the right, all six at one size.

           This replaced a six-card mosaic in three tile sizes with 01–06 index
           numerals. The sizes and numerals asserted a ranking the data's own
           comment disclaimed, and six near-identical engine photographs
           differentiated nothing — two of them were the same scene, adjacent.
           IndustryRegister.tsx carries the full reasoning.

           Copy is unchanged and entirely the section's own — six labels, the
           heading, the lede, and a CTA pointing at the existing /rfq. Nothing
           invented. See au-no-invented-content and au-stock-photography-scope.
           ==================================================================== */}
      <section className="section section-subtle a-industries">
        <div className="u-page">
          <div className="ind-head" data-reveal="up">
            {/* The lede sits with the heading it belongs to. Held out in the
                right column it read as a stray line floating above the CTA. */}
            <div className="ind-head-lead">
              <p className="eyebrow">Where we work</p>
              <h2 className="ind-title">Industries we serve</h2>
              <p className="ind-lede">
                One partner. Multiple industries. Infinite possibilities.
              </p>
            </div>
            <div className="ind-head-side">
              <Link className="btn btn-primary btn-lg ind-cta" href="/rfq">
                Request a Quote
                <span className="ind-arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div data-reveal="up">
            <IndustryRegister items={INDUSTRIES} />
          </div>
        </div>
      </section>

      {/* ====================================================================
           OUR LEADERSHIP — ported from the client's prototype: an expanding
           gallery of grayscale portraits that colour and widen on hover/focus,
           revealing role, name and a line of bio. Names/photos are the
           prototype's placeholders (stock portraits).
           ==================================================================== */}
      <section className="section lead">
        <div className="u-page">
          <div className="lead-head" data-reveal="up">
            <p className="eyebrow eyebrow-center">Our leadership</p>
            <h2 className="lead-title">
              The People Behind <span className="lead-accent">Every Delivery.</span>
            </h2>
            <p className="lead-intro">
              Real accountability starts with real people. Hover a card to meet the
              team setting the standard for every part that ships.
            </p>
          </div>

          <ol className="lead-grid" data-reveal="up">
            {LEADERSHIP.map((p) => (
              <li className="lead-card" key={p.name} tabIndex={0}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="lead-photo" src={p.img} alt={p.name} width={700} height={1000} loading="lazy" />
                <span className="lead-spine">{p.name}</span>
                <div className="lead-meta">
                  <span className="lead-role">{p.role}</span>
                  <span className="lead-name">{p.name}</span>
                  <span className="lead-bio">{p.bio}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ====================================================================
           QUALITY & COMPLIANCE — one centred head over the full register of real
           accreditations, which runs full-bleed below as the CertMarquee.

           The five glass pills the blueprint named are GONE, and so is the
           "Quality you can trust" rail note. The pills restated in words what
           the marquee shows as the actual marks, which made the band say the
           same thing twice and put a weaker version first. With both removed the
           head has nothing asymmetric to sit beside, so it takes the centred
           variant and the logos carry the section on their own.
           ==================================================================== */}
      <section className="section section-subtle">
        <div className="u-page">
          <div className="section-head section-head-center" data-reveal="up">
            <p className="eyebrow">Quality &amp; compliance</p>
            <h2>Held to the standards you audit against</h2>
            <p>We are committed to delivering only the highest-quality parts and services.</p>
          </div>
        </div>

        {/* Full-bleed: every accreditation and membership the company actually
            holds, each on its own card, the rail scrolling itself. The same
            component the homepage closes on. */}
        <CertMarquee />

        {/* Closes the band on the centre line the head and the logo rail already
            sit on — left-aligned it read as a stray footnote rather than the
            section's last word. */}
        <div className="u-page">
          <p className="u-caption u-center" style={{ marginTop: "var(--au-s-6)" }}>
            Certificate copies are available on request &mdash;{" "}
            <Link href="/quality">see quality &amp; certifications</Link>.
          </p>
        </div>
      </section>

      {/* ====================================================================
           PARTNER WITH ASAP — ported closing CTA from the client's prototype: a
           dark band with a two-line heading, an intro, two actions and a
           reassurance line. Replaces the previous closing band.
           ==================================================================== */}
      <section className="section ptnr">
        <div className="u-page">
          <div className="ptnr-inner" data-reveal="up">
            <p className="eyebrow eyebrow-center">Partner with ASAP</p>
            <h2 className="ptnr-title">
              Let&rsquo;s Get Your <span className="ptnr-accent">Parts Moving.</span>
            </h2>
            <p className="ptnr-intro">
              You get more than parts, a team that answers, delivers on time, and
              stands behind every certificate it ships.
            </p>
            <div className="ptnr-cta">
              <Link className="ptnr-btn ptnr-btn-primary" href="/rfq">
                Request a Quote <span aria-hidden="true">→</span>
              </Link>
              <Link className="ptnr-btn ptnr-btn-ghost" href="/contact">
                Contact Us
              </Link>
            </div>
            <p className="ptnr-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 12 5 5 11-11" /></svg>
              No pressure, no placeholder pricing, a real quote, on your timeline.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

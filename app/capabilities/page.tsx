import Link from "next/link";
import type { Metadata } from "next";
import { CueReveal } from "@/components/inner/CueReveal";
import { PageMast } from "@/components/inner/PageMast";
import { LineRail } from "@/components/capabilities/LineRail";

/*
  CAPABILITIES — the live site's "Other Resource" dropdown, as a page.

  WHAT IT GATHERS. GSE Tooling, PMA Supplements, PMA Parts and Salvaged Aircraft
  Parts are four separate live pages reached only from a dropdown labelled "Other
  Resource" — which means a buyer has to already know we do these things in order
  to find out that we do. Repair & Overhaul is the fourth line here and is the
  live site's own "Aircraft Repair Capabilities" resource. Grouped, they have one
  honest promise in common, and the h1 states it: these are the requests that are
  not a part number in a search box.

  COPY. The four sections are the prototype's, which were written against the live
  pages' own content (what each line covers, who asks for it, what to send). The
  live PMA page's three headings — "What Are PMA Parts?", "How to Request PMA
  Parts", "Reliable Aviation Supply Partner" — are folded into line 02's
  eligibility notice and its send-list rather than repeated as a second voice.

  THE BANNED SOURCING PHRASE APPEARS ON THE LIVE SALVAGE PAGE and is nowhere
  here. The underlying story is expressed as documented provenance and stated
  eligibility instead, which is the part a buyer can actually audit. See
  au-banned-phrase.

  STRUCTURE, and why each line looks different. Four identical two-card sections
  would read as one section repeated four times. So the shape follows what the
  buyer's real question is on each line:

    01 GSE          "can you get it at all" → what it covers, who asks, what to send
    02 PMA          "am I ALLOWED to fit it" → the eligibility notice leads
    03 Repair       "what happens to my unit" → a three-step sequence, drawn
    04 Salvage      "can I trust the paperwork" → the documentation plate leads

  MODE: Read, then Persuade at the close. The reader is deciding whether we can
  help, so comprehension outranks expression until the last band.

  PHOTOGRAPHY is treatment. One scene per line, each describing the SCENE in its
  alt and never claiming to show that line's own equipment or inventory. See
  au-stock-photography-scope.
*/

export const metadata: Metadata = {
  title: "Capabilities — GSE & tooling, PMA, repair & overhaul, salvaged parts",
  description:
    "Four service lines for the requests a catalog search cannot answer: ground " +
    "support equipment and tooling, FAA-PMA parts and supplements, repair and " +
    "overhaul through our repair-station network, and traceable salvaged aircraft " +
    "parts. Quoted within 15 minutes.",
};

/* The rail's contents. `id` is both the anchor and the key the rail tracks, so
   the two cannot drift apart. */
const LINES = [
  { id: "gse", n: "01", label: "GSE & tooling", short: "Ground support equipment" },
  { id: "pma", n: "02", label: "PMA parts & supplements", short: "Approved alternatives" },
  { id: "repair", n: "03", label: "Repair & overhaul", short: "Send us the unit" },
  { id: "salvage", n: "04", label: "Salvaged aircraft parts", short: "Out-of-production material" },
];

/* Each line's "what to send us" list. Held as data because the shape is
   identical across all four and the entrance staggers them — five bespoke
   markup blocks would have drifted apart within one edit. */
const SEND: Record<string, { b: string; t: string }[]> = {
  gse: [
    { b: "Tool part number and the manual reference", t: "the AMM, CMM or SRM chapter and task is often enough on its own if you do not have the number." },
    { b: "Aircraft type and effectivity", t: "model, series and MSN range, since tooling frequently changes between blocks." },
    { b: "Whether an approved equivalent is acceptable", t: "it is usually the difference between weeks and months." },
    { b: "Calibration or certification you need", t: "proof-load test certificates, calibration due dates, and to whose standard." },
    { b: "Quantity, need-by date and ship-to", t: "oversized and hazmat items are freight-quoted with the tool, not after." },
  ],
  pma: [
    { b: "The OEM part number you are replacing", t: "plus any alternate or superseded numbers you already know about." },
    { b: "Aircraft or engine type and effectivity", t: "eligibility is granted against specific models, not against a part in the abstract." },
    { b: "Whether PMA is already accepted on your AVL", t: "and whether a lease or maintenance agreement restricts it." },
    { b: "Quantity, condition and documentation required", t: "new, overhauled or serviceable, and whether you need 8130-3." },
    { b: "Need-by date", t: "tell us if you are grounded; it changes which suppliers we go to first." },
  ],
  repair: [
    { b: "Part number and serial number", t: "plus the modification or software standard if the unit carries one." },
    { b: "Aircraft type and position", t: "and the reason for removal, described as your technician described it." },
    { b: "Fault description and any fault codes", t: "a vague “u/s” tag adds days at evaluation." },
    { b: "The outcome you want", t: "repair, full overhaul, exchange, or outright replacement, if you already know." },
    { b: "Turn-time requirement", t: "routine, expedited or AOG, and any last shop-visit paperwork you hold." },
  ],
  salvage: [
    { b: "Part number, plus alternates and superseded numbers", t: "legacy numbering changed hands often, and the alternates widen the search." },
    { b: "Aircraft type, series and effectivity", t: "including MSN range where the part is block-specific." },
    { b: "Condition codes you can accept", t: "telling us as-removed is acceptable can turn a six-week hunt into a same-week answer." },
    { b: "Documentation you must have", t: "serviceable tag, 8130-3, back-to-birth trace, or teardown report only." },
    { b: "Quantity and need-by date", t: "and whether you would take a partial shipment to get flying sooner." },
  ],
};

/* One small presentational helper, so the five-item send-lists are identical in
   markup across four sections and the entrance choreography has one target. */
function SendList({ line, cta, aside }: { line: string; cta: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="card capsend" data-cue="send" data-cue-ms="1300">
      <h3 className="capsend-h">What to send us</h3>
      <ol className="capsend-list">
        {SEND[line].map((s, i) => (
          <li key={s.b}>
            <span className="capsend-n" aria-hidden="true">{`0${i + 1}`}</span>
            <span className="capsend-t">
              <b>{s.b}</b> — {s.t}
            </span>
          </li>
        ))}
      </ol>
      <div className="capsend-cta">
        {cta}
        {aside ? <span className="u-caption">{aside}</span> : null}
      </div>
    </div>
  );
}

export default function CapabilitiesPage() {
  return (
    <>
      <CueReveal />
      {/* Marks the line the reader is in and fills the rail's spine as they read
          down the stack. Renders nothing. */}
      <LineRail />

      <PageMast
        crumbs={[{ href: "/", label: "Home" }, { label: "Capabilities" }]}
        eyebrow="Beyond the catalog"
        title={["When what you need", "isn’t a part number in a box."]}
        lede={
          <>
            Four service lines for the requests our catalog search cannot answer on
            its own — ground support equipment, approved alternatives, repair and
            overhaul, and salvaged material for airframes nobody builds parts for any
            more.
          </>
        }
        actions={
          <>
            <Link className="btn btn-primary btn-lg" href="/rfq">
              Send us the requirement
            </Link>
            <a className="btn btn-quiet btn-lg" href="tel:+17147054780">
              AOG? Call +1-714-705-4780
            </a>
          </>
        }
        note="Every line below is quoted by the same desk, on the same 15-minute commitment, 24/7."
        img="/img/capabilities/test-stand.jpg"
        alt="A gas turbine mounted on a steel test frame inside a bright industrial hall, instrumentation and pipework running along its casing"
        bias="46%"
        record={[
          { v: "04", k: "Service lines" },
          { v: "15 min", k: "Written quote" },
          { v: "8130-3", k: "Release paperwork", mono: true },
          { v: "24/7/365", k: "Same desk" },
        ]}
      />

      <section className="section">
        <div className="u-page">
          <div className="results-layout caplayout">
            {/* ============================================================
                 THE RAIL

                 A buyer arriving from the homepage's resource strip is aimed at
                 exactly one of the four and should never scroll past the other
                 three to reach it. Pinned, it also keeps the quote route one
                 click away from whichever section they stop reading in.
                 ============================================================ */}
            <aside className="filters caprail" aria-label="On this page" data-line-rail>
              <div className="card caprail-card">
                <p className="u-caption u-body-strong caprail-h">The four lines</p>
                {/* The spine and its fill. Decorative — the list beneath it is
                    the navigation, and the fill only says how far through it
                    the reader is. */}
                <span className="caprail-spine" aria-hidden="true">
                  <i />
                </span>
                <ol className="caprail-list">
                  {LINES.map((l) => (
                    <li key={l.id}>
                      <a className="caprail-key" href={`#${l.id}`} data-line-key={l.id}>
                        <span className="caprail-n u-mono">{l.n}</span>
                        <span className="caprail-label">
                          {l.label}
                          <em>{l.short}</em>
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="card caprail-ask">
                <p className="u-small u-body-strong">Not sure which one you need?</p>
                <p className="u-caption" style={{ marginTop: "var(--au-s-2)" }}>
                  Describe the problem instead of the category. We will work out which
                  line it belongs to and quote it.
                </p>
                <Link className="btn btn-primary btn-block" style={{ marginTop: "var(--au-s-4)" }} href="/rfq">
                  Request a quote
                </Link>
                <p className="u-caption u-center" style={{ marginTop: "var(--au-s-3)" }}>
                  <a href="tel:+17147054780">+1-714-705-4780</a> · 24/7
                </p>
              </div>
            </aside>

            <div className="capstack">
              {/* ==========================================================
                   01 · GSE & TOOLING

                   A tooling request almost always starts from a manual rather
                   than a catalog — the buyer is reading an AMM task that names a
                   tool they do not own. So the section is written around what is
                   actually in front of them: a chapter reference and an aircraft
                   type.

                   MOTION: the photograph settles out of a slight overscale while
                   the two claim cards arrive from beneath it, then the send-list
                   prints its five items one at a time. Every element is legible
                   at rest.
                   ========================================================== */}
              <section className="capline" id="gse" data-line="gse">
                <div className="capline-head" data-cue="head">
                  <p className="eyebrow">Service line 01</p>
                  <h2>Ground support equipment &amp; tooling</h2>
                  <p>
                    The equipment that never appears on an illustrated parts catalog,
                    and the aircraft-specific special tooling a maintenance task calls
                    out by name.
                  </p>
                </div>

                <figure className="capmedia" data-cue="media" data-cue-ms="1500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/img/capabilities/gse.jpg"
                    alt="A pair of hands working a long spanner onto a fastener on the top of a grimy piece of machinery, the background falling away out of focus"
                    width={1100}
                    height={733}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>

                <div className="capgrid" data-cue="pair" data-cue-ms="1100">
                  <div className="card capcard">
                    <h3>What this covers</h3>
                    <p>
                      Towbars and tow heads, axle and tripod jacks, ground power and
                      air start units, hydraulic and pneumatic test stands, engine
                      stands, slings and lifting gear, wheel and brake handling
                      equipment, servicing carts, and the aircraft-specific special
                      tooling named in AMM, CMM and SRM procedures. New, refurbished
                      and approved-equivalent options are quoted side by side where
                      they exist.
                    </p>
                  </div>
                  <div className="card capcard">
                    <h3>Who asks for it</h3>
                    <p>
                      Line and base maintenance teams hitting a task that needs a tool
                      they do not hold. MROs adding a new type rating and building the
                      tool list from scratch. Defence units and FBOs re-equipping a
                      hangar. Anyone who has been quoted a nine-month lead time by the
                      airframer and needs an alternative.
                    </p>
                  </div>
                </div>

                <SendList
                  line="gse"
                  cta={
                    <Link className="btn btn-primary" href="/rfq?mode=gse">
                      Quote GSE or tooling
                    </Link>
                  }
                  aside="Written quote back within 15 minutes."
                />
              </section>

              {/* ==========================================================
                   02 · PMA

                   The one line where the buyer's real question is not "can you
                   get it" but "am I allowed to fit it". Selling past that
                   question wastes both sides' time, so the eligibility notice
                   comes FIRST here — before the two claim cards — and states what
                   the quote will say, which is what their engineering team will
                   actually be assessing.
                   ========================================================== */}
              <section className="capline" id="pma" data-line="pma">
                <div className="capline-head" data-cue="head">
                  <p className="eyebrow">Service line 02</p>
                  <h2>PMA parts &amp; supplements</h2>
                  <p>
                    Approved alternatives to the OEM part, for when the OEM line is
                    long, the price is unworkable, or the part number has been
                    discontinued outright.
                  </p>
                </div>

                {/* The lead element on this line, and it is a notice rather than
                    a card: it is the objection, answered, and it needs to read as
                    the section speaking plainly rather than as one panel of
                    three. The accent spine is the same correction idiom
                    `.enq-nudge` uses. */}
                <div className="capnote" data-cue="note" data-cue-ms="1100">
                  <div className="capnote-body">
                    <p className="capnote-h">
                      Eligibility is your decision, and we give you what you need to
                      make it.
                    </p>
                    <p>
                      PMA acceptance rests with the operator, and lease agreements or
                      maintenance contracts can restrict it. Our quote states the
                      approval basis, the OEM part number superseded, and the
                      eligibility applicable to your type — before you commit, not
                      after the box arrives.
                    </p>
                  </div>
                  <figure className="capnote-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/img/capabilities/pma.jpg"
                      alt="A cast-aluminium alternator with a ribbed housing and belt pulley, photographed in isolation against a plain grey ground"
                      width={1100}
                      height={860}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                </div>

                <div className="capgrid" data-cue="pair" data-cue-ms="1100">
                  <div className="card capcard">
                    <h3>What this covers</h3>
                    <p>
                      Parts produced under an FAA Parts Manufacturer Approval — a
                      replacement or modification article approved for installation on
                      a type-certificated product. We source across the PMA supplier
                      base for structural hardware, consumables, interiors, seals and
                      bearings, electrical components and rotable alternatives, and we
                      identify the OEM number each one supersedes.
                    </p>
                  </div>
                  <div className="card capcard">
                    <h3>Who asks for it</h3>
                    <p>
                      Operators and MROs holding an AOG against an OEM lead time
                      measured in months. Fleet engineering teams with PMA already
                      accepted on their approved parts list and a cost target to hit.
                      Support programmes for aircraft where the original supplier has
                      exited the part number entirely.
                    </p>
                  </div>
                </div>

                <SendList
                  line="pma"
                  cta={
                    <Link className="btn btn-primary" href="/rfq?mode=pma">
                      Quote a PMA alternative
                    </Link>
                  }
                  aside="We will also quote the OEM line alongside it, so you can compare."
                />
              </section>

              {/* ==========================================================
                   03 · REPAIR & OVERHAUL

                   Unlike the other three, this line has the customer's own
                   hardware sitting on a bench, which makes uncertainty
                   expensive. So it is built around the sequence and its decision
                   points — especially the beyond-economic-repair outcome, which
                   is the fear that stops people sending a unit in the first
                   place.

                   MOTION: the three steps are the one place on this page where a
                   connector is drawn. It is a genuine sequence, so a line that
                   advances between the numerals is describing the content rather
                   than decorating it.
                   ========================================================== */}
              <section className="capline" id="repair" data-line="repair">
                <div className="capline-head" data-cue="head">
                  <p className="eyebrow">Service line 03</p>
                  <h2>Repair &amp; overhaul</h2>
                  <p>
                    Send us a removed unit and we route it through our repair-station
                    network for evaluation, repair or full overhaul — and return it
                    with the release paperwork.
                  </p>
                </div>

                <ol className="capsteps" data-cue="steps" data-cue-ms="1700">
                  <li>
                    <span className="capstep-n u-mono">01</span>
                    <h3>Send the details, get shipping instructions</h3>
                    <p>
                      Raise the request with part and serial number and the fault. We
                      return the routing, an RMA reference and the address to ship to —
                      usually the same day.
                    </p>
                  </li>
                  <li>
                    <span className="capstep-n u-mono">02</span>
                    <h3>Evaluation and a firm quote</h3>
                    <p>
                      The shop evaluates the unit and issues a findings report with a
                      fixed price and turn time. If it is beyond economic repair you are
                      told then, with the replacement or exchange price alongside, and
                      nothing further is spent.
                    </p>
                  </li>
                  <li>
                    <span className="capstep-n u-mono">03</span>
                    <h3>Repair, then return with paperwork</h3>
                    <p>
                      On your approval the work proceeds and the unit comes back with
                      its release certificate — 8130-3, or dual release where your
                      register requires it — and the shop report attached to the order
                      record.
                    </p>
                  </li>
                </ol>

                <div className="capgrid capgrid-media" data-cue="pair" data-cue-ms="1300">
                  <div className="card capcard">
                    <h3>What this covers</h3>
                    <p>
                      Component repair and overhaul through certificated repair
                      stations: avionics and instruments, hydraulics and actuation,
                      pneumatics and valves, electrical and power generation, wheels
                      and brakes, fuel components and accessories. Where a repair is
                      not the fastest route, we quote exchange or outright replacement
                      against the same request so you can choose on cost and turn time.
                    </p>
                  </div>
                  <figure className="capmedia capmedia-inline">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/img/capabilities/repair.jpg"
                      alt="A turbojet engine resting on a wheeled tubular stand indoors, its compressor face and accessory pipework fully exposed"
                      width={1100}
                      height={733}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                </div>

                <SendList
                  line="repair"
                  cta={
                    <>
                      <Link className="btn btn-primary" href="/rfq?mode=repair">
                        Start a repair request
                      </Link>
                      <a className="btn btn-quiet" href="tel:+17147054780">
                        Unit is grounding an aircraft — call us
                      </a>
                    </>
                  }
                />
              </section>

              {/* ==========================================================
                   04 · SALVAGED PARTS

                   Buyers approach used material warily, and rightly so — the
                   objection is never price, it is provenance. So this section
                   leads with the documentation rather than the inventory: a buyer
                   who trusts the paperwork will consider the part, and one who
                   does not will not read the rest.
                   ========================================================== */}
              <section className="capline" id="salvage" data-line="salvage">
                <div className="capline-head" data-cue="head">
                  <p className="eyebrow">Service line 04</p>
                  <h2>Salvaged aircraft parts</h2>
                  <p>
                    Teardown inventory with documented provenance — often the only
                    remaining source for airframes and systems that are out of
                    production.
                  </p>
                </div>

                <div className="capdoc" data-cue="doc" data-cue-ms="1500">
                  <div className="capdoc-body">
                    <p className="eyebrow">The paperwork that comes with it</p>
                    <p className="capdoc-lede">
                      Every salvaged line is offered with a teardown report and removal
                      tag, trace back to the donor airframe, and a non-incident and
                      non-accident statement covering that aircraft.
                    </p>
                    <ul className="capdoc-list">
                      <li>Teardown report and removal tag</li>
                      <li>Trace to the donor airframe</li>
                      <li>Non-incident, non-accident statement</li>
                      <li>Back-to-birth records where the part is life-limited</li>
                    </ul>
                    <p className="capdoc-note">
                      Where those birth records are not available we say so plainly
                      rather than quoting around it — a buyer discovering that at
                      receiving inspection is worse than not quoting at all.{" "}
                      <Link href="/quality">See our documentation policy →</Link>
                    </p>
                  </div>
                  <figure className="capdoc-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/img/capabilities/salvage.jpg"
                      alt="A military turbofan on an open-air display stand, its afterburner casing and external pipe runs weathered and unpainted"
                      width={1100}
                      height={733}
                      loading="lazy"
                      decoding="async"
                    />
                  </figure>
                </div>

                <div className="capgrid" data-cue="pair" data-cue-ms="1100">
                  <div className="card capcard">
                    <h3>What this covers</h3>
                    <p>
                      Material recovered from retired and parted-out aircraft: structure
                      and skin panels, interiors and seating, avionics and instruments,
                      actuators and valves, wiring harnesses, landing gear components
                      and engine accessories. Quoted with a condition code — new
                      surplus, overhauled, serviceable or as-removed — never as a single
                      vague “used”.
                    </p>
                  </div>
                  <div className="card capcard">
                    <h3>Who asks for it</h3>
                    <p>
                      Operators of legacy and out-of-production types where the OEM part
                      number is closed. Military and government support programmes with
                      platforms that have outlived their supply chain. Restoration and
                      heritage programmes. Anyone facing a lead time longer than the
                      aircraft can stay on the ground.
                    </p>
                  </div>
                </div>

                <SendList
                  line="salvage"
                  cta={
                    <>
                      <Link className="btn btn-primary" href="/rfq?mode=salvage">
                        Quote salvaged material
                      </Link>
                      <Link className="btn btn-quiet" href="/browse/aircraft">
                        Browse by aircraft type
                      </Link>
                    </>
                  }
                />
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
           CLOSING — the page's one accent band.

           A buyer who has read this far has a requirement that did not fit any of
           the four headings cleanly, and that is the normal case rather than the
           exception. The last block removes the need to categorise it correctly,
           which is our job rather than theirs.
           ==================================================================== */}
      <section className="section section-accent capclose">
        <div className="u-page">
          <div className="capclose-inner" data-cue>
            <p className="eyebrow eyebrow-center">One form, four lines</p>
            <h2 className="capclose-title">
              Describe the requirement.{" "}
              <span className="capclose-accent">We will work out the rest.</span>
            </h2>
            <p className="capclose-lede">
              Send a part number, a manual reference, a fault description or a
              photograph of a data plate — whatever you actually have. A named account
              manager comes back in writing within 15 minutes, at any hour.
            </p>
            <div className="capclose-cta">
              <Link className="btn btn-quiet btn-lg" href="/rfq">
                Request a quote
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/rfq?mode=list">
                Paste a parts list
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/contact">
                Other ways to reach us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

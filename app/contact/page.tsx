import Link from "next/link";
import type { Metadata } from "next";
import { ContactIcon } from "@/components/contact/ContactIcon";
import { DeskClock } from "@/components/contact/DeskClock";
import { FocusRail } from "@/components/contact/FocusRail";
import { SheetReveal } from "@/components/contact/SheetReveal";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { SiteLocator } from "@/components/contact/SiteLocator";
import { CopyButton } from "@/components/CopyButton";
import { ScrollReveal } from "@/components/home/ScrollReveal";

/*
  CONTACT US — built to the Contact Us Blueprint (prototype/contact-blueprint.html),
  which is the client's About Us Blueprint format applied to this page. It was ten
  bands in the blueprint's order; on the client's instruction (2026-08-04) three
  were cut — "Which desk", "Before you write" and the quality & compliance
  register — leaving seven: header, the enquiry form, direct details, the routing
  fork, response times, where we are, and the closing CTA.

  THE PAGE'S ONE ARGUMENT is routing. Most people who click "Contact" on a
  distributor site do not want a conversation, they want a price — and every one
  of them who types a part number into a general enquiry box waits a day for an
  answer they could have had in fifteen minutes. So every band is built to move a
  visitor toward the route that matches their question. The enquiry form was the
  last band for that reason; on the client's instruction (2026-08-04) it is now the
  first band after the header, and the correction it used to get from its position
  is carried by its own standfirst and topic selector instead — see the band's own
  comment.

  COPY AND CONTACT VALUES are prototype/contact.html's, unchanged: the phone
  number, both inboxes, the Anaheim address, the 24/7/365 coverage, the 15-minute
  quote, the one-business-day enquiry reply and the 3pm Pacific same-day cutoff.
  Nothing is invented and no new figure is introduced — see au-no-invented-content.

  DESIGN — each band takes a different device, because seven variations of "head
  over a card grid" is what makes a long page read as one long section:
  In page order:
    · header      — a contact card, response-time chips and an on-page nav strip
    · enq         — the form panel with a stepped "what happens next" rail
    · dial        — a read-down spine: sticky photograph beside a focused rail
    · fork        — a register of three routes, the one at the reading line in focus
    · sla         — THE page's one accent band: a divided ledger of four figures
    · where       — a photograph with a glass address plate laid into its corner
    · close       — dark, split, the details repeated as the last thing on screen

  MOTION is entrance-and-interaction only, and nothing is gated on it: the shared
  [data-reveal] observer arms itself after mount, so the server render, the
  screenshot renderer, reduced motion and no-JS all get the page fully composed.
  The page's two focus rails (the routing fork and the Direct details spine) mark
  the entry at the reading line and leave every other entry fully legible — the
  blur both once carried was removed at the client's direction on 2026-08-04. The one live element
  (DeskClock) adds a line to a plate that already reads correctly without it.
  See au-motion-safety.
*/

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Call +1-714-705-4780 or email sales@aerospaceunlimited.com. Quoting and AOG " +
    "desks staffed 24/7 from 1341 South Sunkist Street, Anaheim, CA 92806. Part " +
    "requests are answered fastest through the quote form — in writing, within 15 minutes.",
};

/* The routing fork — FOUR ELEMENTS PER CARD and one line of copy each.

   These carried a header band, a tag, a mechanism line, an index numeral, a
   paragraph, a caution well and a secondary link. Every part was defensible on its
   own and together they buried the only thing the card is for: how long this route
   takes, and what it is for.

   That trim was originally made on the grounds that everything cut from the cards
   was still on the page — what to have ready in "Before you write", who owns what
   in "Which desk", the certificate route in the compliance band. Those three bands
   were cut on the client's instruction (2026-08-04), so that is no longer true:
   this page no longer names which desk owns which question, no longer lists what
   to have ready before writing, and no longer states the accreditations. The
   routing fork is now the only place any of it is implied. If any of it needs to
   come back, it needs a home — not a longer card.

   `tone` picks the slab treatment: the fast path is the inverted one, because the
   page's whole job is to make it the obvious choice. */
const ROUTES = [
  {
    tone: "fast" as const,
    icon: "quote",
    time: "15 min",
    timeNote: "in writing, any hour",
    title: "A price or a lead time",
    body: "Part number, NSN or a whole list — straight to the quoting desk.",
    cta: { href: "/rfq", label: "Request a quote", kind: "primary" as const },
  },
  {
    tone: "aog" as const,
    icon: "aog",
    time: "24/7",
    timeNote: "answered by a person",
    title: "An aircraft on the ground",
    body: "Call, don’t write. Worked immediately, at any hour.",
    cta: { href: "tel:+17147054780", label: "Call +1-714-705-4780", kind: "quiet" as const },
  },
  {
    tone: "slow" as const,
    icon: "mail",
    time: "1 day",
    timeNote: "read by the office",
    title: "Everything else",
    body: "Orders, invoices, vendor set-up, certificates, careers.",
    cta: { href: "#enquiry", label: "Go to the enquiry form", kind: "quiet" as const },
  },
];

/* The four figures on the accent band. Every one is already stated elsewhere on
   the site — this band restates them together, it does not add a claim.

   `meter` IS THE POINT OF THIS ARRAY, and it is not decoration. These four figures
   look like one kind of thing — a number and a unit — and they are four different
   kinds of time. A single shared entrance treats them as a list of four numbers,
   which is exactly the reading the band is trying to correct. So each one drives a
   meter whose BEHAVIOUR is what its figure means:

     sprint  15 min  — a short wait. Fills and finishes almost at once.
     always  24/7    — not a wait at all. Full on arrival, and it never moves.
     long    1 day   — a whole business day. Fills slowly and is still running as
                       the band scrolls away, which is the felt difference between
                       this cell and the first one.
     cutoff  3pm PT  — a deadline, not a duration. Fills to a marked tick and stops.

   Keyed on the datum rather than on :nth-child so the behaviour travels with the
   figure if the order ever changes. The meters carry no label and no percentage:
   they encode figures already printed beside them and assert nothing new. */
const SLA = [
  { v: "15", unit: "min", k: "Written quote", meter: "sprint", note: "Pricing, availability, condition and lead time, at any hour." },
  { v: "24/7", unit: "all year", k: "Desk staffed", meter: "always", note: "Quoting and AOG, through nights, weekends and holidays." },
  { v: "1", unit: "day", k: "Enquiry reply", meter: "long", note: "General enquiries, answered within one business day." },
  { v: "3pm", unit: "PT", k: "Same-day cutoff", meter: "cutoff", note: "In-stock items ordered before the cutoff ship the same day." },
];

export default function ContactPage() {
  return (
    <>
      {/* One shared IntersectionObserver plays the [data-reveal] entrances and
          only arms after mount, so no-JS and screenshot renders stay visible. */}
      <ScrollReveal />
      {/* The reading focus on Direct details. Scroll-driven, armed after mount,
          and it rests the whole rail when the band leaves the viewport. */}
      {/* The two reading-focus rails, both on one driver. The routing fork gets a
          lower reading line because its entries are twice the height of the
          register's — the line is what sets the pace, and one tuned for five short
          rows makes three tall ones flick past. */}
      <FocusRail rail="[data-route-rail]" step="[data-route-step]" liveKey="routeLive" stateKey="routeState" line={0.52} />
      <FocusRail rail="[data-dial-rail]" step="[data-dial-step]" liveKey="dialLive" stateKey="dialState" />
      {/* The enquiry sheet's arrival. Not [data-reveal]: the shared observer's 2s
          failsafe plays every band still armed, and this one sits below the fold at
          load, so the sequence finished off-screen before anyone scrolled to it.
          See components/contact/SheetReveal. */}
      <SheetReveal />

      {/* ====================================================================
           THE HERO — a collage, built to the client's reference (2026-08-04).

           TWO EARLIER VERSIONS FAILED, in the two ways an interior header can:
             1. TOO MUCH — the flight deck full-bleed behind a display headline, two
                large actions and a floating glass panel of the three routes. All of
                that is the HOMEPAGE's vocabulary, so Contact opened looking like a
                landing page, and the panel restated the fork band 200px below it.
             2. TOO LITTLE — a flat dark band with three hairline rows: the right
                information with no presence.

           WHAT THE REFERENCE CONTRIBUTES is a composition, not a new palette — the
           asymmetric split, the display line, a stat card with a smaller plate
           nested inside it, a portrait laid over a caption plate, a filled circular
           badge crossing the photograph's corner, a hairline thread drawn between
           the loose pieces, and a micro-stat hung in the far corner on a descending
           rule. The reference does all of it in cream with an orange badge; this
           does it in Warm Paper with Steel Blue, because the palette is cool by
           client instruction and there is no warm accent to spend.

           IT AVOIDS FAILURE 1 by carrying contact material only. Every figure in the
           collage is one the site already publishes, the three routes are NOT
           restated — they are one scroll below, stated once — and the phone number
           sits ~340px down as the second action rather than ~950px down behind a
           photograph. The three response-time chips this band used to carry were
           precisely the fork band's content repeated, so they are gone.

           IT AVOIDS FAILURE 2 by being light. The site header is white glass, so the
           old Midnight band opened with a hard seam 1px beneath it; on --au-bg the
           header and the hero are one surface and the collage floats on it.

           THE PHOTOGRAPHS ARE TREATMENT, NOT EVIDENCE. Both are stock portraits from
           the project's library, and neither carries a caption naming a person, a
           role or a desk — the alt text describes the scene, and every claim on this
           band lives in type beside them. See au-stock-photography-scope.
           ==================================================================== */}
      <section className="chero">
        {/* A blueprint lattice, masked to the collage's quarter: the site already
            owns this device (the About numbers band), it carries texture without
            introducing a subject, and it echoes the reference's drawn-line motif for
            the price of two gradients rather than an image. */}
        <span className="chero-grid" aria-hidden="true" />

        <div className="u-page">
          <div className="chero-top hero-enter">
            <div className="chero-head">
              <h1 className="chero-title">
                <span className="hero-line">Three ways in.</span>
                <span className="hero-line">Pick the one that fits.</span>
              </h1>
              <p className="chero-lede">
                Which route you take decides whether you hear back in fifteen
                minutes or one business day.
              </p>
            </div>
            <Link className="btn btn-primary btn-lg chero-cta" href="/rfq">
              Request a quote
            </Link>
          </div>

          {/* THE BANNER — the client's own contact photograph, supplied 2026-08-04
              and dropped in over the crop of `story.jpg` that stood in for it.

              IT IS THE RIGHT PICTURE FOR THIS BAND for the reason the stand-in never
              was: the page is about reaching a person, and this frame is two people
              at the desk that answers — one reading a printed document, one working
              a tablet beside them. The previous note here recorded a long argument
              about which 800 x 800 square survived a shallow horizontal slice; that
              argument is over, because this source is 1696 x 667 and already a
              banner. The crop now takes ~130px off the frame's height rather than
              two thirds of a square, so `object-position` only has to protect the
              faces from the plate that overlays the lower edge.

              The alt describes the scene and names nobody: no caption on this band
              attributes a role, a desk or a company to a face. The polos in frame
              carry a mark, which is what the picture happens to show — the ownership
              it belongs to is stated as text in the Direct details band, not claimed
              off the back of a photograph.

              The plate stays light glass: the photograph is bright and the desk clock
              inside it is calibrated for a light ground. */}
          <figure className="chero-banner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/contact-hero.jpg"
              alt="Two staff at a desk in a bright office — one seated holding a printed document, one standing beside them working a tablet — with monitors, paperwork trays and shipping cartons around them"
              width={1696}
              height={667}
              decoding="async"
              fetchPriority="high"
            />
            <figcaption className="chero-plate">
              <div className="chero-plate-txt">
                <span className="chero-plate-k">Quoting desk</span>
                <p className="chero-plate-t">
                  Somebody is on the desk at every hour of every day.
                </p>
                <div className="chero-plate-d">
                  <DeskClock />
                </div>
              </div>
              <a
                className="chero-plate-go"
                href="tel:+17147054780"
                aria-label="Call the desk on +1-714-705-4780"
              >
                <ContactIcon name="arrow-br" />
              </a>
            </figcaption>
          </figure>

        </div>

        {/* THREE BLOCKS WERE REMOVED FROM BELOW THE BANNER at the client's
            instruction (2026-08-04), and the note matters because each one is easy to
            re-add on the argument that the hero "needs" it:

              · the stat row — "15 min", "24/7/365" and a filled card carrying the
                phone number. Every figure in it is published again in the routing
                fork and in the accent response-times band.
              · the detail strip — the two inboxes and the Anaheim address with their
                copy controls. All three, with the same copy controls, are in the
                Direct details band, and the inboxes are in Which desk as well.
              · the on-page nav — a strip of anchors to the four bands below.

            So nothing was deleted from the PAGE, only from this band: the hero is now
            the headline, the one action and the photograph, and the reader meets each
            of those figures once, where it is explained. See au-no-invented-content —
            the rule cuts both ways, and re-adding any of this would restate a band
            rather than say something new.

            The ONE thing this band no longer shows in type is the phone number; it
            survives here only as the plate's icon-only tel link, and is set in full
            in the header, the fork's AOG route, Direct details and the closing card. */}
      </section>

      {/* ====================================================================
           THE ENQUIRY FORM — FIRST BAND AFTER THE HEADER, by the client's
           instruction (2026-08-04). It previously sat last, below the fork and the
           direct details, so that it was the route offered rather than the one
           pushed.

           THE TRADE THIS MAKES, recorded because it is a real one: the fastest
           route on the page is the quote form (fifteen minutes, in writing) and the
           slowest is this one (one business day). Opening on the slow lane means a
           visitor holding a part number now meets it before they meet the fast lane,
           which is the exact mis-routing the rest of the page is built to prevent.
           Three things carry the correction instead of the running order — the
           standfirst names the quote form in its second sentence, the form's topic
           selector reveals the faster route the moment "pricing or availability" is
           chosen, and the header's own chips publish the 15-minute route above this
           band. See au-redesign-decisions for why routing is the page's argument.

           The rail beside the form answers the question a contact form always leaves
           open — what actually happens after I press send — and holds the AOG escape
           hatch for anyone whose situation turns urgent while they type.
           ==================================================================== */}
      <section className="section enq" id="enquiry">
        <div className="u-page">
          <div className="enq-grid" data-sheet>
            {/* MOTION — `sheet` is this band's own arrival, not the shared
                fade: the panel settles like paper onto a desk, its head lands,
                the divider draws across and the field rows arrive in the order
                they have to be filled, ending on the Send button. A form's
                entrance may as well teach the order of work. Nothing is gated on
                it — the fields are interactive from the first frame and the whole
                sequence lives behind ScrollReveal's after-mount armed state, so
                no-JS, reduced motion and the screenshot renderer get the finished
                panel. See the "sheet" block in ux.css and au-motion-safety. */}
            <div className="enq-panel">
              {/* "Send us a question." named nothing: every form on every site is
                  a question being sent, and this one's whole job is to say which
                  questions belong here and which belong on the faster route. The
                  heading now does that, and the standfirst carries the routing. */}
              <div className="enq-panel-head">
                <p className="eyebrow">General enquiries</p>
                <h2>Not a part request? Send it here.</h2>
                <p>
                  Orders, invoices, vendor set-up, certificates and careers —
                  answered within one business day. For pricing or availability, the{" "}
                  <Link href="/rfq">quote form</Link> is roughly fifty times faster.
                </p>
              </div>
              <EnquiryForm />
            </div>

            {/* THE "WHAT HAPPENS AFTER YOU SEND IT" CARD IS GONE (client, 2026-08-04).
                It was three numbered steps explaining that an enquiry is received,
                routed and answered — which is what any inbox does, so it spent a
                card and a screen of height narrating the obvious. The one fact in it
                worth keeping, the one-business-day reply, is in the standfirst. */}
            <aside className="enq-rail">
              <div className="enq-rail-card enq-urgent">
                <h3 className="enq-rail-h">
                  <span className="enq-urgent-dot" aria-hidden="true" />
                  If it becomes urgent
                </h3>
                <p>
                  Don&rsquo;t wait on an inbox. The desk is staffed continuously
                  and an AOG request is worked immediately.
                </p>
                <a className="btn btn-quiet btn-block" href="tel:+17147054780">
                  Call +1-714-705-4780
                </a>
              </div>

              <p className="enq-rail-note">
                We reply from a named address, never a no-reply. Nothing you send
                here is used for marketing.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* ====================================================================
           DIRECT DETAILS — A SPINE YOU READ DOWN, NOT A TWO-COLUMN SLAB.

           WHAT THIS REPLACED (and why): the band was one glass slab split into
           an inverted switchboard column and a five-row register. Both halves
           were correct and the object was wrong. The register set the height, so
           the navy panel had a hand of dead space above and below its number;
           the rows were four different heights because their notes are four
           different lengths, which put the icon chips on an uneven rhythm; and
           each row's copy control sat hard against the far right edge, a third of
           a screen from the value it copies.

           IT IS NOW A SPINE. The claim, the standfirst and a photograph of the
           desk sit in a sticky left column, and the values run down a rail beside
           it — the phone first, then the two inboxes, the address, the hours and
           the company — one node per entry, the copy control directly under the
           value it writes. Reading order is the rail; the left column is what you
           keep in view while you read it.

           THE SWITCHBOARD PANEL IS GONE and its number is now a rail entry. The
           panel was the band's strongest object and it was built entirely from the
           page's most repeated content: the header, the hero, the fork's AOG route
           and the closing card all publish that number, and its coverage and cutoff
           figures are in the Hours entry's own note. Nothing was dropped.

           MOTION IS THE SPINE, and only the spine. The rail draws itself between
           nodes as they are read, the node being read fills and haloes, the ones
           behind it keep the accent softened and the ones ahead are empty rings.
           The text is never touched: entries ahead of the reader used to sit
           blurred and dimmed behind the spine, and the client asked for that off
           (2026-08-04). Still gated on an attribute client JS writes, so the server
           render, no-JS, reduced motion and the screenshot renderer all get six
           sharp entries and a fully drawn rail. See components/contact/FocusRail.
           ==================================================================== */}
      <section className="section section-subtle dial" id="details">
        <div className="u-page dial-wrap">
          <div className="dial-aside" data-reveal="up">
            <p className="eyebrow">Direct details</p>
            <h2 className="dial-title">Phone, email, and where we physically are.</h2>
            <p className="dial-head-note">
              Every value here is paste-ready — the copy controls write straight to
              your clipboard, so nothing reaches your purchase order retyped.
            </p>

            {/* THE PHOTOGRAPH REPLACED AN INVERTED SWITCHBOARD PANEL that carried
                the phone number at display scale, the 24/7 note, a copy control and
                the coverage / cutoff pair. Every one of those already appears two or
                three times on this page — the header, the hero's switchboard, the
                fork's AOG route and the closing card all publish the number, and
                the coverage and cutoff are in the Hours entry's own note — so the
                strongest object in the band was its most repeated content. The
                number moved into the rail, where it is one value among five, and the
                space it held now shows the desk it rings.

                No caption. The scene is the company's own facility, but nothing
                factual is claimed off the back of it — the alt describes what is in
                frame and the band's claims all live in the rail. */}
            <figure className="dial-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/desk-review.jpg"
                alt="Two staff standing in a parts warehouse reading a printed document together, racking and a lift behind them"
                width={800}
                height={800}
                decoding="async"
              />
            </figure>
          </div>

          {/* The rail. Still a description list — these are label / value pairs,
              not steps, so the nodes carry the existing icon set rather than
              numerals: nothing here happens in an order. */}
          <dl className="dial-rail" data-dial-rail>
            {/* The phone leads the rail — the band's heading promises it first and it
                is the highest-intent value on the page. Mono, because a phone number
                is data to be transcribed, and that is the one job this site reserves
                mono for. The 24/7 line is the same sentence the retired panel
                carried; the coverage and cutoff figures it also held are in the
                Hours entry below. */}
            <div className="dial-step" data-dial-step>
              <dt className="dial-k">
                <span className="dial-node" aria-hidden="true"><ContactIcon name="phone" /></span>
                <span className="dial-k-t">Quoting &amp; AOG desk</span>
              </dt>
              <dd className="dial-v">
                <a className="dial-val u-mono" href="tel:+17147054780">
                  +1-714-705-4780
                </a>
                <span className="dial-note">
                  Answered by a person 24 hours a day, every day of the year. For a
                  grounded aircraft this is the fastest route on the page.
                </span>
                <CopyButton className="btn btn-quiet btn-sm dial-copy" value="+1-714-705-4780">
                  Copy number
                </CopyButton>
              </dd>
            </div>

            <div className="dial-step" data-dial-step>
              <dt className="dial-k">
                <span className="dial-node" aria-hidden="true"><ContactIcon name="mail" /></span>
                <span className="dial-k-t">Sales &amp; quotes</span>
              </dt>
              <dd className="dial-v">
                {/* `<wbr>` after the @, so the one width where this address cannot
                    fit on a line breaks it at the domain boundary instead of
                    mid-word. It contributes no character, so the address is still
                    one string to a reader, a screen reader and the clipboard. */}
                <a className="dial-val u-mono" href="mailto:sales@aerospaceunlimited.com">
                  sales@<wbr />aerospaceunlimited.com
                </a>
                <span className="dial-note">
                  Quotes, orders, order status, certificate copies and vendor set-up.
                </span>
                <CopyButton
                  className="btn btn-quiet btn-sm dial-copy"
                  value="sales@aerospaceunlimited.com"
                >
                  Copy email
                </CopyButton>
              </dd>
            </div>

            <div className="dial-step" data-dial-step>
              <dt className="dial-k">
                <span className="dial-node" aria-hidden="true"><ContactIcon name="truck" /></span>
                <span className="dial-k-t">Purchasing</span>
              </dt>
              <dd className="dial-v">
                <a className="dial-val u-mono" href="mailto:purchase@aerospaceunlimited.com">
                  purchase@<wbr />aerospaceunlimited.com
                </a>
                <span className="dial-note">
                  Offering us inventory, supplier applications, quality-system and
                  audit enquiries.
                </span>
                <CopyButton
                  className="btn btn-quiet btn-sm dial-copy"
                  value="purchase@aerospaceunlimited.com"
                >
                  Copy email
                </CopyButton>
              </dd>
            </div>

            <div className="dial-step" data-dial-step>
              <dt className="dial-k">
                <span className="dial-node" aria-hidden="true"><ContactIcon name="pin" /></span>
                <span className="dial-k-t">Address</span>
              </dt>
              <dd className="dial-v">
                <span className="dial-val">
                  1341 South Sunkist Street, Anaheim, CA 92806, United States
                </span>
                <span className="dial-note">
                  Shipping, receiving and inspection all happen here. Deliveries
                  should reference the purchase order number on the outer packaging.
                </span>
                <CopyButton
                  className="btn btn-quiet btn-sm dial-copy"
                  value="1341 South Sunkist Street, Anaheim, CA 92806, United States"
                >
                  Copy address
                </CopyButton>
              </dd>
            </div>

            <div className="dial-step" data-dial-step>
              <dt className="dial-k">
                <span className="dial-node" aria-hidden="true"><ContactIcon name="clock" /></span>
                <span className="dial-k-t">Hours</span>
              </dt>
              <dd className="dial-v">
                <span className="dial-val">24 hours · 7 days · 365 days a year</span>
                <span className="dial-note">
                  Quoting and AOG are staffed continuously. Same-day shipping on
                  in-stock items ordered before 3pm Pacific.
                </span>
              </dd>
            </div>

            <div className="dial-step" data-dial-step>
              <dt className="dial-k">
                <span className="dial-node" aria-hidden="true"><ContactIcon name="standard" /></span>
                <span className="dial-k-t">Company</span>
              </dt>
              <dd className="dial-v">
                <span className="dial-val">Aerospace Unlimited, owned by ASAP Semiconductor LLC</span>
                <span className="dial-note">
                  <Link href="/about">About us</Link> ·{" "}
                  <Link href="/quality">Quality &amp; certifications</Link>
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ====================================================================
           THE ROUTING FORK — the single most important block on the page.

           Quote-intent traffic landing in a general inbox is the expensive
           failure here: it is triaged by hand, answered in a day rather than
           fifteen minutes, and frequently lost. Publishing the response time
           against each route makes the fast path self-selecting — the buyer
           chooses the quote form because it is obviously better for them, not
           because the alternative was hidden.

           IT IS A REGISTER READ DOWNWARD, NOT THREE CARDS SIDE BY SIDE, and that
           is a correction rather than a preference. As three equal columns — each
           with a big figure on top, a short line under it, a full-width button at
           the bottom, and one column inverted as the "recommended" one — it read as
           a PRICING TABLE. That is the exact shape of a subscription tier grid, and
           a reader who has seen ten of those arrives expecting to compare prices
           and pick a plan. These are not plans; they are three doors, and only one
           of them is right for any given visitor. A register says that: the times
           sit in one column so they can be compared at a glance, and each row is a
           single sentence about who should use it, ending in one action.

           No card chrome, no repeated block buttons, no highlighted middle column.
           The fast route is marked by its accent spine and the one filled button on
           the band, which is emphasis without a tier.

           MOTION — the route at the reading line takes the band's marks: its spine
           lights to full strength and the faintest tint comes up behind it. The
           other two rows are left exactly as they are. It used to put them behind
           glass — blur(4px) at 0.4 opacity, depth of field — and the client asked
           for that off (2026-08-04); nothing replaced it in kind, so all three rows
           are readable at every scroll position. Still gated: the rules live only
           under `[data-route-live="on"]`, which FocusRail writes after mount and
           removes when the band leaves the viewport.
           See au-motion-safety and components/contact/FocusRail.
           ==================================================================== */}
      <section className="section fork" id="routes">
        <div className="u-page">
          {/* THE HEAD SPANS THE REGISTER, it does not sit in a column beside it.
              Left-aligned at h2 size it filled 491px of the register's 1,180 and
              opened the band on 690px of nothing. The claim now runs at display
              scale over the time and route columns and the standfirst crosses to
              the right edge, above the action column, where it reads as a note in
              the register's own margin. Same two sentences, no new copy. */}
          <div className="section-head section-head-row fork-head" data-reveal="up">
            <div className="fork-head-t">
              <p className="eyebrow">How to reach us</p>
              <h2>Three routes in, and the time each one takes.</h2>
            </div>
            <p className="fork-head-note">
              All three are staffed. They are not equally fast.
            </p>
          </div>

          <ol className="routes" data-route-rail>
            {ROUTES.map((r, i) => (
              <li className={`route route-${r.tone}`} key={r.tone} data-route-step>
                <span className="route-idx" aria-hidden="true">{`0${i + 1}`}</span>

                <p className="route-time">
                  <span className="route-time-v">{r.time}</span>
                  <span className="route-time-k">{r.timeNote}</span>
                </p>

                <div className="route-t">
                  <h3 className="route-title">
                    <span className="route-ico"><ContactIcon name={r.icon} /></span>
                    {r.title}
                  </h3>
                  <p className="route-body">{r.body}</p>
                </div>

                <div className="route-act">
                  {r.cta.href.startsWith("tel:") || r.cta.href.startsWith("#") ? (
                    <a
                      className={`btn ${r.cta.kind === "primary" ? "btn-primary" : "btn-quiet"}`}
                      href={r.cta.href}
                    >
                      {r.cta.label} <span className="route-arrow" aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <Link
                      className={`btn ${r.cta.kind === "primary" ? "btn-primary" : "btn-quiet"}`}
                      href={r.cta.href}
                    >
                      {r.cta.label} <span className="route-arrow" aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ====================================================================
           RESPONSE TIMES — THIS PAGE'S ONE ACCENT BAND. (au-visual-system: never
           two.)

           Four figures the site already publishes, set as one divided ledger
           rather than four cards — a card per figure would make four separate
           objects out of a single promise. The band earns the accent because the
           response time IS the page's claim; everything else here is contact
           detail.

           No new number is introduced. Each of these appears elsewhere on the
           site; this is the one place they are stated together.
           ==================================================================== */}
      <section className="section section-accent sla">
        <div className="u-page">
          <div className="sla-top">
            <div className="section-head sla-head" data-reveal="up">
              <p className="eyebrow">What you can expect</p>
              <h2>Times we publish, and are held to.</h2>
            </div>
            <p className="sla-note" data-reveal="up">
              A response time you can plan around is worth more than a promise
              that we care. These are the four we state.
            </p>
          </div>

          <ol className="sla-strip" data-reveal="ledger">
            {SLA.map((s) => (
              <li className="sla-cell" key={s.k} data-meter={s.meter}>
                <p className="sla-v">
                  <span className="sla-v-num">{s.v}</span>
                  <span className="sla-v-unit">{s.unit}</span>
                </p>

                {/* THE METER. Scroll-driven, so the reader's own scroll is the clock:
                    the four fills run at four rates set by what each figure measures,
                    and the difference between "15 min" and "1 day" is something you
                    feel in the wheel rather than read off a label.

                    aria-hidden, and it has to be: the figure, its unit and its name
                    are all printed beside it, so to a screen reader this is a second
                    telling of a value already spoken. It is a graph of the datum, not
                    the datum.

                    MOTION-SAFE BY CONSTRUCTION — every rule that moves it lives
                    inside `@supports (animation-timeline: view())` and the resting
                    state is each meter at its FINAL value. A browser without view
                    timelines, and anyone with reduced motion, gets four filled
                    meters and the same four-kinds-of-time reading, statically. The
                    figures never depend on it. See au-motion-safety. */}
                <span className="sla-meter" aria-hidden="true">
                  <span className="sla-meter-fill" />
                </span>

                <p className="sla-k">{s.k}</p>
                <p className="sla-d">{s.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ====================================================================
           WHERE WE ARE — a locator that descends to the site, with the address
           plate laid into its corner rather than set beside it. Buyers vetting a
           new supplier check that the shipping address and the inspection address
           are the same site; the band's job is to make that one address concrete.

           IT WAS A PHOTOGRAPH OF THE BUILDING until the client asked for a map
           animation that zooms in. What replaced it is a schematic approach plate
           — range rings, a graticule and a scale bar, no streets — because this
           project carries no map dependency and no tile key, and a drawn street
           grid for a real address would be fiction on the one panel a buyer uses
           to route a shipment. Everything it states is declared or verified; see
           SiteLocator.tsx for exactly what, and for the geocode's provenance.
           ==================================================================== */}
      <section className="section where" id="location">
        <div className="u-page">
          <div className="where-grid">
            <figure className="where-media" data-reveal="up">
              <SiteLocator />
              {/* THE PLATE NAMES THE CITY, NOT THE STREET. It used to do that to
                  avoid printing "1341 South Sunkist Street" over a photograph
                  whose facade plaque read "1341 S. Sinclaire St." — a visible
                  contradiction on the page's one piece of evidence. The
                  photograph is gone, so that particular collision is too, but the
                  line stays as it is: both are real Anaheim 92806 addresses about
                  a kilometre apart, and which one is the shipping address is
                  still the client's to confirm. The locator is pinned to the one
                  this site publishes, which is also the value the copy control
                  and the Directions link below already carry. */}
              <figcaption className="where-plate">
                <span className="where-plate-k">
                  <ContactIcon name="pin" />
                  Headquarters, shipping and inspection
                </span>
                <span className="where-plate-v">
                  Anaheim, California 92806, United States
                </span>
                <span className="where-plate-act">
                  <CopyButton
                    className="btn btn-quiet btn-sm"
                    value="1341 South Sunkist Street, Anaheim, CA 92806, United States"
                  >
                    Copy full address
                  </CopyButton>
                  <a
                    className="btn btn-text btn-sm"
                    href="https://www.google.com/maps/search/?api=1&query=1341+South+Sunkist+Street+Anaheim+CA+92806"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Directions →
                  </a>
                </span>
              </figcaption>
            </figure>

            <div className="where-side" data-reveal="up">
              <p className="eyebrow">Where we are</p>
              <h2 className="where-title">One site. The dock, the bench and the desk.</h2>
              <p className="where-lede">
                Shipping, receiving and inspection all happen at this address, so a
                part is never in transit between our own buildings.
              </p>
              <dl className="where-facts">
                <div>
                  <dt>Deliveries to us</dt>
                  <dd>Reference the purchase order number on the outer packaging.</dd>
                </div>
                <div>
                  <dt>Same-day dispatch</dt>
                  <dd>In-stock items ordered before 3pm Pacific ship the same day.</dd>
                </div>
                <div>
                  <dt>Out of hours</dt>
                  <dd>The quoting and AOG desks are staffed continuously, including holidays.</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
           CLOSING — a visitor who reached the bottom of Contact without using any
           of the three routes is undecided rather than uninterested, so the exit
           is the cheapest possible commitment: a part number, no account, no
           sales call.

           The details are repeated on the right, deliberately. This is the last
           screen of the page, and someone who scrolled the whole way down should
           not have to scroll back up to find the number.
           ==================================================================== */}
      <section className="section-dark close">
        <div className="u-page close-grid">
          <div className="close-lead" data-reveal="up">
            <p className="eyebrow">Still here?</p>
            <h2 className="close-title">
              If it was a part you were after{" "}
              <span className="close-accent">all along.</span>
            </h2>
            <p className="close-lede">
              Skip the inbox. Send the part numbers and get pricing, availability,
              condition and lead time in writing within 15 minutes — no account, no
              sign-up, no sales call first.
            </p>
            <div className="close-cta">
              <Link className="btn btn-primary btn-lg" href="/rfq">
                Request a quote <span aria-hidden="true">→</span>
              </Link>
              <Link className="btn btn-quiet btn-lg" href="/browse">
                Browse the catalog
              </Link>
            </div>
          </div>

          <div className="close-card" data-reveal="up">
            <p className="close-card-h">Everything on one card</p>
            <ul className="close-list">
              <li>
                <span className="close-k">
                  <ContactIcon name="phone" />
                  Phone, 24/7
                </span>
                <a className="close-v u-mono" href="tel:+17147054780">
                  +1-714-705-4780
                </a>
              </li>
              <li>
                <span className="close-k">
                  <ContactIcon name="mail" />
                  Sales &amp; quotes
                </span>
                <a className="close-v u-mono" href="mailto:sales@aerospaceunlimited.com">
                  sales@aerospaceunlimited.com
                </a>
              </li>
              <li>
                <span className="close-k">
                  <ContactIcon name="pin" />
                  Anaheim, California
                </span>
                <span className="close-v">1341 South Sunkist Street, CA 92806</span>
              </li>
              <li>
                <span className="close-k">
                  <ContactIcon name="clock" />
                  Same-day cutoff
                </span>
                <span className="close-v">3pm Pacific, on in-stock items</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

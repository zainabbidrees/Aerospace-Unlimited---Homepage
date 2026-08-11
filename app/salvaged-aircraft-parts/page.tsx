import Link from "next/link";
import type { Metadata } from "next";
import { MANUFACTURERS, CATEGORIES } from "@/lib/data";
import { CueReveal } from "@/components/inner/CueReveal";
import { PageMast } from "@/components/inner/PageMast";

/*
  SALVAGED AIRCRAFT PARTS — a faithful rebuild of the live
  /salvaged-aircraft-parts/ "Salvage Aircraft Models and Parts List".

  Reproduces the live page's order and shape: the intro paragraph, then the two
  bulleted lists — "Top Commercial Aircraft Manufacturers" and "Top Part
  Categories", each with a View All link. The redesign's documentation block,
  cards, donor-airframe table and send-list are removed.

  THE BANNED SOURCING PHRASE IS ON THE LIVE SALVAGE PAGE AND IS NOWHERE HERE, and
  the live page's "[Top5AircraftModel]" placeholder is filled with real donor
  models. See au-banned-phrase, au-no-invented-content.
*/

export const metadata: Metadata = {
  title: "Salvage Aircraft Models and Parts List",
  description:
    "Salvaged aircraft parts from an industry-leading inventory — sourced from trusted " +
    "manufacturers, FAA AC 00-56B accredited and ISO 9001:2015 certified, with some of " +
    "the industry's quickest lead-times.",
};

const TOP_MANUFACTURERS = MANUFACTURERS.slice(0, 10);
const TOP_CATEGORIES = CATEGORIES.slice(0, 10);

export default function SalvagedAircraftPartsPage() {
  return (
    <>
      <CueReveal />

      <PageMast
        crumbs={[{ href: "/", label: "Home" }, { label: "Salvaged Aircraft Parts" }]}
        eyebrow="Aerospace Components List"
        title={["Salvage Aircraft Models", "and Parts List"]}
        lede={
          <>
            If you have been searching for salvaged aircraft parts — for airframes such
            as the Boeing 737 Classic, McDonnell Douglas MD-80, Airbus A300/A310 and
            Lockheed L-1011 — then look no further. Aerospace Unlimited is a website
            owned and operated by ASAP Semiconductor, and we boast an industry-leading
            inventory that can fulfill your sourcing needs. We believe in the quality of
            our parts, and we only source from manufacturers that we trust. Our business
            operates with FAA AC 00-56B accreditation and ISO 9001:2015 certification,
            and our dedicated account managers are on hand to assist you with your order
            as needed.
          </>
        }
        actions={
          <>
            <Link className="btn btn-primary btn-lg" href="/rfq?mode=salvage">
              Submit an Instant RFQ
            </Link>
            <Link className="btn btn-quiet btn-lg" href="/aircraft">
              Browse by aircraft type
            </Link>
          </>
        }
        note="Guaranteed quotes back within 15 minutes, 24/7 x 365."
        img="/img/capabilities/salvage.jpg"
        alt="A military turbofan on an open-air display stand, its afterburner casing and external pipe runs weathered and unpainted"
        bias="50%"
      />

      {/* THE TWO LISTS — the live page's own "Top Manufacturers" + "Top Part Categories". */}
      <section className="section">
        <div className="u-page">
          <div className="twinlist" data-cue="pair" data-cue-ms="1100">
            <div className="twincol">
              <div className="twincol-head">
                <h2>Top commercial aircraft manufacturers</h2>
                <Link className="btn btn-text btn-sm" href="/manufacturers">View all</Link>
              </div>
              <ul className="linklist">
                {TOP_MANUFACTURERS.map((m) => (
                  <li key={m.cage}>
                    <Link href={`/manufacturers/${m.cage}`}>{m.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="twincol">
              <div className="twincol-head">
                <h2>Top part categories</h2>
                <Link className="btn btn-text btn-sm" href="/part-types">View all</Link>
              </div>
              <ul className="linklist">
                {TOP_CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/part-types/${c.slug}`}>{c.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

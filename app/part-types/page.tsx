import Link from "next/link";
import type { Metadata } from "next";
import { PART_TYPES } from "@/lib/data";
import { rfqHref } from "@/lib/rfq";
import { CueReveal } from "@/components/inner/CueReveal";
import { CatMast } from "@/components/inner/CatMast";
import { FacetFilter } from "@/components/browse/FacetFilter";

/*
  PART TYPES — a faithful rebuild of the live /part-types/ "Aircraft Part Type
  Listing".

  Reproduces the live page's order: intro, an "Aircraft Parts Sourcing and
  Quality Assurance" block, then the alphabetical A–Z item-name wall. The
  redesign's twelve-category depth register is removed — it is not on the live
  page. Each item name opens a pre-seeded quote, because a name with no number is
  exactly the request the quote desk exists to answer. See au-no-invented-content.
*/

export const metadata: Metadata = {
  title: "Aircraft Part Type Listing",
  description:
    "Browse high-quality aircraft parts by type — an alphabetical listing of " +
    "aviation-grade components for aerospace, defense, and industrial applications.",
};

const PT_GROUPS = (() => {
  const map = new Map<string, string[]>();
  for (const name of [...PART_TYPES].sort((a, b) => a.localeCompare(b))) {
    const initial = name[0].toUpperCase();
    const key = /[A-Z]/.test(initial) ? initial : "#";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(name);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
})();

export default function PartTypesPage() {
  return (
    <>
      <CueReveal />

      <CatMast
        crumbs={[{ href: "/", label: "Home" }, { label: "Part Types" }]}
        eyebrow="Browse by part type"
        title={["Aircraft Part Type", "Listing"]}
        lede={
          <>
            At Aerospace Unlimited, we supply high-quality aircraft parts including
            actuators, couplings, connectors, indicators, seals, switches and a wide
            range of aviation-grade components designed to meet the demands of
            aerospace, defense, and industrial applications. All parts are sourced from
            certified and trusted manufacturers to ensure consistent reliability,
            safety, and performance in critical operational environments.
          </>
        }
        actions={
          <Link className="btn btn-primary btn-lg" href="/rfq?mode=list">
            Submit an RFQ
          </Link>
        }
        img="/img/catalog/mro-engine-bay.jpg"
        imgSm="/img/catalog/mro-engine-bay-sm.jpg"
        alt="A large turbofan engine mounted on a wheeled cradle in a maintenance hangar, its fan blades and accessory plumbing exposed under the shop's overhead structure"
      />

      {/* AIRCRAFT PARTS SOURCING AND QUALITY ASSURANCE — the live support block. */}
      <section className="section-tight">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">Aircraft parts sourcing and quality assurance</p>
            <h2>How we source and verify part types</h2>
          </div>

          <dl className="deflist" data-cue="depth" data-cue-ms="1100">
            <div className="def">
              <dt>Certified manufacturing standards</dt>
              <dd>
                As an ISO 9001:2015 certified and FAA AC 00-56B accredited distributor,
                we ensure all aircraft parts comply with strict aviation quality and
                regulatory requirements for safe and reliable use.
              </dd>
            </div>
            <div className="def">
              <dt>Verified component quality</dt>
              <dd>
                Every item in our supply chain undergoes detailed inspection,
                cross-referencing, and verification to ensure authenticity, performance,
                and full compliance with industry standards.
              </dd>
            </div>
            <div className="def">
              <dt>Fast procurement support</dt>
              <dd>
                Once you identify the required aircraft part type, you can request a
                quote through our procurement team. We provide fast response times and
                competitive pricing tailored to your sourcing needs.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* THE A–Z ITEM WALL — the live page's own alphabetical listing. */}
      <section className="section-tight">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">Part type listing</p>
            <h2>Browse item types A–Z</h2>
            <p>Select the name of the item you are looking at to start a quote for it — no part number needed.</p>
          </div>

          <div className="results-layout">
            <FacetFilter targetId="pt-types" facets={[]} noun="type" nounPlural="types" />

            <div>
              <div className="results-bar">
                <p className="results-count" role="status" aria-live="polite" data-facet-status>
                  <b>{PART_TYPES.length}</b> types shown
                </p>
              </div>

              <div id="pt-types">
                {PT_GROUPS.map(([letter, items]) => (
                  <section className="idxgroup" data-facet-group data-cue="group" data-cue-ms="1000" key={letter}>
                    <h2 className="idxgroup-letter" aria-label={`Item types starting with ${letter}`}>
                      <span>{letter}</span>
                      <i className="idxgroup-rule" aria-hidden="true" />
                      <em className="idxgroup-n">{items.length}</em>
                    </h2>

                    <ul className="idxlist">
                      {items.map((name) => (
                        <li key={name} data-facet-row data-terms={name.toLowerCase()}>
                          <Link className="idxrow" href={rfqHref({ q: name, for: name })}>
                            <span className="idxrow-name">{name}</span>
                            <span className="idxrow-n" aria-hidden="true">→</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <div className="empty-state" data-facet-empty hidden>
                <h2>No item type matches that.</h2>
                <p>Tell us what you need in plain words and we&rsquo;ll quote it — no part number required.</p>
                <div className="actions">
                  <Link className="btn btn-primary btn-lg" href="/rfq">Request a quote</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { PARTS } from "@/lib/data";
import { CueReveal } from "@/components/inner/CueReveal";
import { CatMast } from "@/components/inner/CatMast";
import { FacetFilter } from "@/components/browse/FacetFilter";

/*
  NIIN — a faithful rebuild of the live /niin-parts/ "NIIN Lookup – National Item
  Identification Number Parts".

  Reproduces the live page's order: intro, a "Reliable NIIN Parts Sourcing"
  block with the procurement-needs list, then NIINs grouped by their leading
  digit ("NIIN start by 0", …) as number-only links. The redesigned flat table
  with description/NSN columns is removed; the live page lists the NIIN alone.
  See au-no-invented-content.
*/

export const metadata: Metadata = {
  title: "NIIN Lookup – National Item Identification Number Parts",
  description:
    "Explore a comprehensive NIIN lookup database to identify and source aviation, " +
    "aerospace, defense, and industrial components by National Item Identification " +
    "Number (NIIN).",
};

const BY_LEADING = (() => {
  const map = new Map<string, string[]>();
  for (const p of [...PARTS].sort((a, b) => a.niin.localeCompare(b.niin))) {
    const d = p.niin[0];
    if (!map.has(d)) map.set(d, []);
    map.get(d)!.push(p.niin);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
})();

export default function NiinPage() {
  return (
    <>
      <CueReveal />

      <CatMast
        crumbs={[{ href: "/", label: "Home" }, { label: "NIIN" }]}
        eyebrow="National Item Identification Number"
        title={["NIIN Lookup —", "National Item Identification Number Parts"]}
        lede={
          <>
            At Aerospace Unlimited, customers can explore a comprehensive NIIN lookup
            database to identify and source aviation, aerospace, defense, and industrial
            components by National Item Identification Number (NIIN). Search for items
            such as 011365772, 011066040, 014989193, 011794054, 013725313, 005589127,
            012415705 and other NSN-related parts through an easy-to-use platform
            designed to simplify procurement and improve sourcing efficiency.
          </>
        }
        actions={
          <Link className="btn btn-primary btn-lg" href="/rfq?mode=list">
            Submit an Instant RFQ
          </Link>
        }
        img="/img/catalog/mro-engine-bay.jpg"
        imgSm="/img/catalog/mro-engine-bay-sm.jpg"
        alt="A large turbofan engine mounted on a wheeled cradle in a maintenance hangar, its fan blades and accessory plumbing exposed under the shop's overhead structure"
      />

      {/* RELIABLE NIIN PARTS SOURCING — the live page's support block. */}
      <section className="section-tight">
        <div className="u-page">
          <div className="cx-split" data-cue>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <p className="eyebrow">Reliable NIIN parts sourcing</p>
              <h2>Sourced, inspected and verified</h2>
              <p>
                Aerospace Unlimited, owned and operated by ASAP Semiconductor, is an FAA
                AC 00-56B accredited and ISO 9001:2015 certified distributor with access
                to over 6 billion new, used, obsolete, and hard-to-find parts. Every
                component is sourced from trusted manufacturers and undergoes thorough
                inspection and verification to ensure quality and compliance.
              </p>
            </div>

            <div className="prosecard">
              <p className="u-body-strong">
                Our NIIN database supports a wide range of procurement needs, including:
              </p>
              <ul className="ticklist">
                <li>Aerospace and aviation components</li>
                <li>Defense and military parts</li>
                <li>Electrical and electronic assemblies</li>
                <li>Hardware, fasteners, and fittings</li>
                <li>Obsolete and difficult-to-source items</li>
              </ul>
              <p className="u-small u-muted">
                Submit an Instant RFQ today to receive competitive pricing and rapid lead
                times tailored to your operational requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE LOOKUP — NIINs grouped by leading digit, number only. */}
      <section className="section-tight">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">The lookup</p>
            <h2>NIIN parts by leading digit</h2>
            <p>Select a NIIN to open its part record — its NSN, Federal Supply Class, manufacturer and CAGE code.</p>
          </div>

          <div className="results-layout">
            <FacetFilter targetId="niin-codes" facets={[]} noun="NIIN" nounPlural="NIINs" />

            <div>
              <div className="results-bar">
                <p className="results-count" role="status" aria-live="polite" data-facet-status>
                  <b>{BY_LEADING.reduce((n, [, a]) => n + a.length, 0)}</b> NIINs shown
                </p>
              </div>

              <div id="niin-codes">
                {BY_LEADING.map(([digit, niins]) => (
                  <section className="idxgroup" data-facet-group data-cue="group" data-cue-ms="1100" key={digit}>
                    <h2 className="idxgroup-letter" aria-label={`NIINs beginning with ${digit}`}>
                      <span>NIIN start by {digit}</span>
                      <i className="idxgroup-rule" aria-hidden="true" />
                      <em className="idxgroup-n">{niins.length}</em>
                    </h2>

                    <ul className="codewall">
                      {niins.map((niin) => (
                        <li key={niin} data-facet-row data-terms={niin}>
                          <Link className="codechip u-mono" href={`/niin/${niin}`}>
                            {niin}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <div className="empty-state" data-facet-empty hidden>
                <h2>No NIIN matches that.</h2>
                <p>Try fewer digits, or send us the numbers and we&rsquo;ll quote every line.</p>
                <div className="actions">
                  <Link className="btn btn-primary btn-lg" href="/rfq?mode=list">Send us a parts list</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

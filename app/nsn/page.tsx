import Link from "next/link";
import type { Metadata } from "next";
import { PARTS } from "@/lib/data";
import { CueReveal } from "@/components/inner/CueReveal";
import { CatMast } from "@/components/inner/CatMast";
import { FacetFilter } from "@/components/browse/FacetFilter";
import { AVAILABILITY, MANUFACTURER, PART_TYPE, catName, partTerms } from "@/lib/facets";

/*
  NSN — a faithful rebuild of the live /nsn-parts/ "National Stock Number (NSN)
  Lookup Table".

  Reproduces the live page's order: intro, an "NSN Lookup and Procurement
  Support" block, then the lookup table grouped by leading digit ("NSN start by
  1", …) with each stock number shown formatted and unformatted, as the live
  page renders it. The redesign's "anatomy of an NSN" diagram and related-lookup
  rail are removed — they are not on the live page. See au-no-invented-content.
*/

export const metadata: Metadata = {
  title: "National Stock Number (NSN) Lookup Table",
  description:
    "Look up National Stock Number parts. Our extensive NSN catalog features new, " +
    "used, and obsolete components sourced from certified and reliable manufacturers " +
    "across the global aerospace and defense supply chain.",
};

const unformat = (nsn: string) => nsn.replace(/\D/g, "");

const BY_LEADING = (() => {
  const map = new Map<string, typeof PARTS>();
  for (const p of [...PARTS].sort((a, b) => a.nsn.localeCompare(b.nsn))) {
    const d = p.nsn[0];
    if (!map.has(d)) map.set(d, []);
    map.get(d)!.push(p);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
})();

export default function NsnPage() {
  return (
    <>
      <CueReveal />

      <CatMast
        crumbs={[{ href: "/", label: "Home" }, { label: "NSN" }]}
        eyebrow="National Stock Number lookup"
        title={["National Stock Number", "(NSN) Lookup Table"]}
        lede={
          <>
            At Aerospace Unlimited, we support the sourcing and procurement of any NSN
            parts you require, including 1560011794054, 1680011030724, 1650000220220,
            1560016701110 and a wide range of additional National Stock Number
            components. Our extensive NSN catalog features over 6 billion parts, sourced
            from certified and reliable manufacturers across the global aerospace and
            defense supply chain.
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

      {/* NSN LOOKUP AND PROCUREMENT SUPPORT — the live page's support block. */}
      <section className="section-tight">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">NSN lookup and procurement support</p>
            <h2>What the lookup gives you</h2>
          </div>

          <dl className="deflist" data-cue="depth" data-cue-ms="1100">
            <div className="def">
              <dt>Wide NSN coverage</dt>
              <dd>
                Access millions of National Stock Number parts through our advanced
                lookup system, designed to simplify identification and sourcing across
                aerospace, aviation, and defense industries.
              </dd>
            </div>
            <div className="def">
              <dt>Fast RFQ processing</dt>
              <dd>
                Once you identify the required NSN part, submit an Instant RFQ with your
                details. Our procurement team reviews each request promptly and typically
                responds within 15 minutes with a tailored quotation.
              </dd>
            </div>
            <div className="def">
              <dt>Reliable supply chain support</dt>
              <dd>
                We maintain strict quality control and sourcing standards, working only
                with trusted and certified manufacturers to ensure part reliability and
                compliance for mission-critical operations.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* THE LOOKUP TABLE — grouped by leading digit, formatted + unformatted. */}
      <section className="section-tight">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">The lookup table</p>
            <h2>NSN parts by leading digit</h2>
            <p>Select a stock number to open its full record — Item Name, FSG, FSC, NIIN, NCB, manufacturer, CAGE code and part number.</p>
          </div>

          <div className="results-layout">
            <FacetFilter targetId="nsn-parts" facets={[AVAILABILITY, MANUFACTURER, PART_TYPE]} />

            <div>
              <div className="results-bar">
                <p className="results-count" role="status" aria-live="polite" data-facet-status>
                  <b>{PARTS.length}</b> {PARTS.length === 1 ? "line" : "lines"} shown
                </p>
              </div>

              <div id="nsn-parts">
                {BY_LEADING.map(([digit, rows]) => (
                  <section className="idxgroup" data-facet-group data-cue="group" data-cue-ms="1100" key={digit}>
                    <h2 className="idxgroup-letter" aria-label={`NSNs beginning with ${digit}`}>
                      <span>NSN start by {digit}</span>
                      <i className="idxgroup-rule" aria-hidden="true" />
                      <em className="idxgroup-n">{rows.length}</em>
                    </h2>

                    <ul className="idxlist look">
                      {rows.map((p) => (
                        <li
                          key={p.pn}
                          data-facet-row
                          data-f-stock={p.stock}
                          data-f-mfr={p.mfr}
                          data-f-cat={catName(p.category)}
                          data-terms={partTerms(p)}
                        >
                          <Link className="idxrow" href={`/part/${encodeURIComponent(p.pn)}`}>
                            <span className="idxrow-cage u-mono">{p.nsn}</span>
                            <span className="idxrow-name u-mono u-muted">({unformat(p.nsn)})</span>
                            <span className="idxrow-n" aria-hidden="true">→</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <div className="empty-state" data-facet-empty hidden>
                <h2>No stock number matches those filters.</h2>
                <p>Clear a filter to widen the list, or send us the numbers and we&rsquo;ll quote every line.</p>
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

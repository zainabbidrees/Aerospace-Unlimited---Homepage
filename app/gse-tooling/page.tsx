import Link from "next/link";
import type { Metadata } from "next";
import { GSE_PARTS } from "@/lib/data";
import { rfqHref } from "@/lib/rfq";
import { CueReveal } from "@/components/inner/CueReveal";
import { PageMast } from "@/components/inner/PageMast";
import { FacetFilter } from "@/components/browse/FacetFilter";

/*
  GSE TOOLING — a faithful rebuild of the live /gse-tooling/ "GSE Tooling Part
  Listing – Aircraft Ground Support Equipment Parts".

  Reproduces the live page's order: intro, a "Ground Support Equipment (GSE)
  Tooling Parts Support" block, then the parts table with the live columns —
  Part No, Description, Aircraft Application, QTY, RFQ. The redesign's
  "what this covers / who asks" cards and send-list are removed. The live page's
  banned sourcing phrase is nowhere here. See au-banned-phrase, au-no-invented-content.
*/

export const metadata: Metadata = {
  title: "GSE Tooling Part Listing – Aircraft Ground Support Equipment Parts",
  description:
    "A comprehensive selection of high-quality GSE (Ground Support Equipment) tooling " +
    "parts trusted across aviation maintenance, airport operations, and aircraft " +
    "servicing environments. Guaranteed quotes back within 15 minutes.",
};

export default function GseToolingPage() {
  return (
    <>
      <CueReveal />

      <PageMast
        crumbs={[{ href: "/", label: "Home" }, { label: "GSE Tooling" }]}
        eyebrow="Aircraft GSE Tooling"
        title={["GSE Tooling Part Listing —", "Aircraft Ground Support Equipment Parts"]}
        lede={
          <>
            At Aerospace Unlimited, we provide a comprehensive selection of high-quality
            GSE (Ground Support Equipment) tooling parts trusted across aviation
            maintenance, airport operations, and aircraft servicing environments. Our
            extensive inventory includes commonly requested items such as OMP2505-3,
            MS3191-20, 460004941-2, J47027, CL-25-LTP-B along with a wide range of
            related ground support components.
          </>
        }
        actions={
          <>
            <Link className="btn btn-primary btn-lg" href="/rfq?mode=gse">
              Get instant RFQ
            </Link>
            <a className="btn btn-quiet btn-lg" href="tel:+17147054780">
              AOG? Call +1-714-705-4780
            </a>
          </>
        }
        note="Guaranteed quotes back within 15 minutes, 24/7 x 365."
        img="/img/capabilities/gse.jpg"
        alt="A pair of hands working a long spanner onto a fastener on the top of a grimy piece of machinery, the background falling away out of focus"
        bias="50%"
      />

      {/* GROUND SUPPORT EQUIPMENT (GSE) TOOLING PARTS SUPPORT — live support block. */}
      <section className="section">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">Ground support equipment (GSE) tooling parts support</p>
            <h2>Sourcing, fulfillment and procurement</h2>
          </div>

          <dl className="deflist" data-cue="depth" data-cue-ms="1100">
            <div className="def">
              <dt>Extensive GSE inventory access</dt>
              <dd>
                Browse a wide selection of aircraft ground support tooling and equipment
                parts designed to support maintenance, repair, and operational efficiency
                across aviation environments.
              </dd>
            </div>
            <div className="def">
              <dt>Fast nationwide fulfillment network</dt>
              <dd>
                Our U.S.-based supply chain network enables rapid sourcing and delivery
                of GSE components, helping reduce downtime and keep aircraft operations
                running smoothly.
              </dd>
            </div>
            <div className="def">
              <dt>Reliable procurement assistance</dt>
              <dd>
                Whether sourcing standard tooling or specialized GSE components such as
                coupling half - bulkhead, clip, adaptor, body and locking T-pin assembly,
                our team provides responsive support and streamlined procurement
                solutions tailored to your operational needs.
              </dd>
            </div>
          </dl>

          {/* THE PART LISTING — live columns: Part No, Description, Aircraft Application, QTY, RFQ. */}
          <div className="section-head" data-cue style={{ marginTop: "var(--au-s-8)" }}>
            <p className="eyebrow">GSE tooling part listing</p>
            <h2>Aircraft ground support equipment parts</h2>
          </div>

          <div className="results-layout">
            <FacetFilter
              targetId="gse-parts"
              facets={[{ key: "ac", label: "Aircraft application" }]}
              noun="part"
              nounPlural="parts"
            />

            <div>
              <div className="results-bar">
                <p className="results-count" role="status" aria-live="polite" data-facet-status>
                  <b>{GSE_PARTS.length}</b> parts shown
                </p>
              </div>

              <div id="gse-parts" className="restable-wrap" data-cue="rows" data-cue-ms="1200">
                <table className="restable">
                  <thead>
                    <tr>
                      <th scope="col">Part No</th>
                      <th scope="col">Description</th>
                      <th scope="col">Aircraft application</th>
                      <th scope="col">QTY</th>
                      <th scope="col" className="restable-rfq">RFQ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GSE_PARTS.map((p) => (
                      <tr
                        key={p.pn}
                        data-facet-row
                        data-f-ac={p.aircraft}
                        data-terms={`${p.pn} ${p.desc} ${p.aircraft}`.toLowerCase()}
                      >
                        <td className="mono">{p.pn}</td>
                        <td>{p.desc}</td>
                        <td>{p.aircraft}</td>
                        <td className="mono">Avl</td>
                        <td className="restable-rfq">
                          <Link className="btn btn-text btn-sm" href={rfqHref({ q: p.pn, mode: "gse", for: `${p.pn} — ${p.desc}` })}>
                            RFQ
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="empty-state" data-facet-empty hidden>
                <h2>No parts match those filters.</h2>
                <p>Clear a filter to widen the list, or send us the numbers and we&rsquo;ll quote every line.</p>
                <div className="actions">
                  <Link className="btn btn-primary btn-lg" href="/rfq?mode=list">Send us a parts list</Link>
                </div>
              </div>

              <p className="restable-note">Part numbers and applications are illustrative sample data, not live inventory records.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

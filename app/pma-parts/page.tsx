import Link from "next/link";
import type { Metadata } from "next";
import { PMA_PARTS } from "@/lib/data";
import { rfqHref } from "@/lib/rfq";
import { CueReveal } from "@/components/inner/CueReveal";
import { PageMast } from "@/components/inner/PageMast";
import { FacetFilter } from "@/components/browse/FacetFilter";

/*
  PMA PARTS — a faithful rebuild of the live /pma-parts/ "Explore FAA PMA Parts
  Catalog on Aerospace Unlimited".

  Reproduces the live page's order: intro, an "FAA PMA Parts Overview and
  Procurement Support" block with its three subsections (What Are PMA Parts? /
  How to Request PMA Parts / Reliable Aviation Supply Partner), then the catalog
  with the live columns — Part No, Part Name, Holder Name, Holder Number,
  Make/Model, RFQ. The redesign's eligibility notice, cards, send-list and
  cross-link notice are removed. See au-no-invented-content.
*/

export const metadata: Metadata = {
  title: "Explore FAA PMA Parts Catalog on Aerospace Unlimited",
  description:
    "A comprehensive catalog of FAA-approved PMA (Parts Manufacturer Approval) " +
    "components sourced from certified and reliable manufacturers, with product name, " +
    "PMA holder information, approval references, and applicable aircraft models.",
};

export default function PmaPartsPage() {
  return (
    <>
      <CueReveal />

      <PageMast
        crumbs={[{ href: "/", label: "Home" }, { label: "PMA Parts" }]}
        eyebrow="Parts Manufacturer Approval"
        title={["Explore FAA PMA Parts Catalog", "on Aerospace Unlimited"]}
        lede={
          <>
            Aerospace Unlimited is a trusted source for FAA-approved PMA (Parts
            Manufacturer Approval) components sourced from certified and reliable
            manufacturers. You are currently viewing our comprehensive PMA catalog,
            which includes a wide selection of approved part numbers actively supplied
            for aviation, aerospace, and defense applications. Each listing provides key
            details such as product name, PMA holder information, approval references,
            and applicable aircraft models.
          </>
        }
        actions={
          <>
            <Link className="btn btn-primary btn-lg" href="/rfq?mode=pma">
              Get instant RFQ
            </Link>
            <a className="btn btn-quiet btn-lg" href="tel:+17147054780">
              AOG? Call +1-714-705-4780
            </a>
          </>
        }
        note="Guaranteed quotes back within 15 minutes, 24/7 x 365."
        img="/img/capabilities/pma.jpg"
        alt="A cast-aluminium alternator with a ribbed housing and belt pulley, photographed in isolation against a plain grey ground"
        bias="50%"
      />

      {/* FAA PMA PARTS OVERVIEW AND PROCUREMENT SUPPORT — the live subsections. */}
      <section className="section">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">FAA PMA parts overview and procurement support</p>
            <h2>What PMA parts are, and how to request them</h2>
          </div>

          <dl className="deflist" data-cue="depth" data-cue-ms="1100">
            <div className="def">
              <dt>What are PMA parts?</dt>
              <dd>
                Parts Manufacturer Approval (PMA) components are FAA-approved
                alternatives to OEM parts, designed and manufactured to meet strict
                safety, performance, and airworthiness standards. Each part undergoes
                engineering evaluation, testing, and FAA certification to ensure
                compliance and reliable use in aviation applications.
              </dd>
            </div>
            <div className="def">
              <dt>How to request PMA parts</dt>
              <dd>
                Once you identify the required component, you can submit an RFQ directly
                through the listing to receive a tailored quotation. Alternatively, our
                team is available via phone or email to assist with sourcing, technical
                guidance, and procurement support.
              </dd>
            </div>
            <div className="def">
              <dt>Reliable aviation supply partner</dt>
              <dd>
                Aerospace Unlimited remains committed to quality assurance, regulatory
                compliance, and customer satisfaction, making us a dependable partner for
                FAA-approved PMA parts procurement across the aviation industry.
              </dd>
            </div>
          </dl>

          {/* THE CATALOG — live columns: Part No, Part Name, Holder Name, Holder Number, Make/Model, RFQ. */}
          <div className="section-head" data-cue style={{ marginTop: "var(--au-s-8)" }}>
            <p className="eyebrow">FAA PMA parts catalog</p>
            <h2>Approved part numbers</h2>
          </div>

          <div className="results-layout">
            <FacetFilter
              targetId="pma-parts"
              facets={[
                { key: "holder", label: "PMA holder" },
                { key: "ac", label: "Make / model" },
              ]}
              noun="part"
              nounPlural="parts"
            />

            <div>
              <div className="results-bar">
                <p className="results-count" role="status" aria-live="polite" data-facet-status>
                  <b>{PMA_PARTS.length}</b> parts shown
                </p>
              </div>

              <div id="pma-parts" className="restable-wrap" data-cue="rows" data-cue-ms="1200">
                <table className="restable">
                  <thead>
                    <tr>
                      <th scope="col">Part No</th>
                      <th scope="col">Part name</th>
                      <th scope="col">Holder name</th>
                      <th scope="col">Holder number</th>
                      <th scope="col">Make/Model</th>
                      <th scope="col" className="restable-rfq">RFQ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PMA_PARTS.map((p) => (
                      <tr
                        key={p.pn}
                        data-facet-row
                        data-f-holder={p.holder}
                        data-f-ac={p.aircraft}
                        data-terms={`${p.pn} ${p.name} ${p.holder} ${p.holderNo} ${p.aircraft}`.toLowerCase()}
                      >
                        <td className="mono">{p.pn}</td>
                        <td>{p.name}</td>
                        <td>{p.holder}</td>
                        <td className="mono">{p.holderNo}</td>
                        <td>{p.aircraft}</td>
                        <td className="restable-rfq">
                          <Link className="btn btn-text btn-sm" href={rfqHref({ q: p.pn, mode: "pma", for: `${p.pn} — ${p.name}` })}>
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

              <p className="restable-note">Part numbers, holders and holder numbers are illustrative sample data, not live inventory records.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

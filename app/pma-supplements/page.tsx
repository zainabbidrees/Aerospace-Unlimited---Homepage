import Link from "next/link";
import type { Metadata } from "next";
import { PMA_SUPPLEMENTS } from "@/lib/data";
import { rfqHref } from "@/lib/rfq";
import { CueReveal } from "@/components/inner/CueReveal";
import { PageMast } from "@/components/inner/PageMast";

/*
  PMA SUPPLEMENTS — a faithful rebuild of the live /pma-supplements/ "PMA
  Supplements Parts Catalog for Aircraft".

  Reproduces the live page's order: intro, a "PMA Parts Sourcing and Quality
  Assurance" block, then the listing with the live columns — Part No,
  Manufacturer, Description, RFQ. The redesign's cards, send-list and cross-link
  notice are removed. See au-no-invented-content.
*/

export const metadata: Metadata = {
  title: "PMA Supplements Parts Catalog for Aircraft",
  description:
    "A comprehensive PMA (Parts Manufacturer Approval) supplements catalog for " +
    "aircraft — cylinders, cartridges, rupture discs, gaskets and discharge valves. " +
    "Guaranteed quotes back within 15 minutes.",
};

export default function PmaSupplementsPage() {
  return (
    <>
      <CueReveal />

      <PageMast
        crumbs={[{ href: "/", label: "Home" }, { label: "PMA Supplements" }]}
        eyebrow="Aircraft PMA Supplements List"
        title={["PMA Supplements Parts", "Catalog for Aircraft"]}
        lede={
          <>
            Are you in search of 6555-00, 65334-23, 65334-17, 630122-1, 630124-03,
            630120-1 from Air Cruisers, Goodrich, Pacsci/Htl, Scott? At Aerospace
            Unlimited, we maintain a comprehensive PMA (Parts Manufacturer Approval)
            supplements catalog featuring over 6 billion new, used, and obsolete
            aerospace components. Our platform is built to help aviation professionals,
            maintenance teams, and procurement specialists quickly locate required PMA
            parts and move forward with sourcing efficiently and reliably.
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
        img="/img/capabilities/test-stand.jpg"
        alt="A gas turbine mounted on a steel test frame inside a bright industrial hall, instrumentation and pipework running along its casing"
        bias="46%"
      />

      {/* PMA PARTS SOURCING AND QUALITY ASSURANCE — the live support block. */}
      <section className="section">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">PMA parts sourcing and quality assurance</p>
            <h2>Inventory, inspection and RFQ support</h2>
          </div>

          <dl className="deflist" data-cue="depth" data-cue-ms="1100">
            <div className="def">
              <dt>Extensive PMA inventory access</dt>
              <dd>
                Browse a wide selection of PMA supplement parts, including components
                such as cylinder, cartridge, rupture disc, gasket and discharge valve,
                supporting aircraft maintenance, repair, and operational requirements
                across multiple aviation applications.
              </dd>
            </div>
            <div className="def">
              <dt>Strict quality inspection process</dt>
              <dd>
                All PMA parts undergo thorough inspection, testing, and verification to
                ensure compliance with airworthiness and industry performance standards
                before approval for distribution.
              </dd>
            </div>
            <div className="def">
              <dt>Fast RFQ and procurement support</dt>
              <dd>
                Submit an Instant RFQ to receive a competitive quotation tailored to
                your requirements. Our procurement team ensures fast response times and
                reliable sourcing support for urgent and routine needs.
              </dd>
            </div>
          </dl>

          {/* THE PART LISTING — live columns: Part No, Manufacturer, Description, RFQ. */}
          <div className="section-head" data-cue style={{ marginTop: "var(--au-s-8)" }}>
            <p className="eyebrow">PMA supplements part listing</p>
            <h2>Supplement parts for aircraft</h2>
          </div>

          <div className="restable-wrap" data-cue="rows" data-cue-ms="1200">
            <table className="restable">
              <thead>
                <tr>
                  <th scope="col">Part No</th>
                  <th scope="col">Manufacturer</th>
                  <th scope="col">Description</th>
                  <th scope="col" className="restable-rfq">RFQ</th>
                </tr>
              </thead>
              <tbody>
                {PMA_SUPPLEMENTS.map((p) => (
                  <tr key={p.pn}>
                    <td className="mono">{p.pn}</td>
                    <td>{p.mfr}</td>
                    <td>{p.desc}</td>
                    <td className="restable-rfq">
                      <Link className="btn btn-text btn-sm" href={rfqHref({ q: p.pn, mode: "pma", for: `${p.pn} — ${p.desc}` })}>
                        RFQ
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="restable-note">Part numbers and manufacturers are illustrative sample data, not live inventory records.</p>
        </div>
      </section>
    </>
  );
}

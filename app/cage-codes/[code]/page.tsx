import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PARTS, MANUFACTURERS } from "@/lib/data";
import { rfqHref } from "@/lib/rfq";
import { CueReveal } from "@/components/inner/CueReveal";
import { FacetFilter } from "@/components/browse/FacetFilter";
import { AVAILABILITY, PART_TYPE, MANUFACTURER, catName, partTerms } from "@/lib/facets";

/*
  CAGE DETAIL — a faithful rebuild of the live /cage-codes/<code>/ "CAGE Code X –
  Company Parts Catalog" page: intro, Parts Sourcing and RFQ Support bullets, the
  Additional Data block, and the Parts Catalog table. Fields we do not hold in
  the sample are shown as "—", exactly as the live page shows "-". See
  au-no-invented-content, au-legacy-faithful-lookups.
*/

const unformat = (nsn: string) => nsn.replace(/\D/g, "");

function resolve(code: string) {
  const key = code.toUpperCase();
  const m = MANUFACTURERS.find((x) => x.cage.toUpperCase() === key);
  if (!m) return null;
  return { code: m.cage, company: m.name, parts: PARTS.filter((p) => p.cage.toUpperCase() === key) };
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const a = resolve(decodeURIComponent(code));
  if (!a) return { title: "Not found" };
  return {
    title: `CAGE Code ${a.code} – ${a.company} Parts Catalog`,
    description: `Parts supplied under CAGE Code ${a.code} by ${a.company} — part numbers, NSNs and item names, with a quote back within 15 minutes.`,
  };
}

export default async function CageDetail({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const a = resolve(decodeURIComponent(code));
  if (!a) notFound();

  const pns = a.parts.slice(0, 5).map((p) => p.pn).join(", ");
  const nsns = a.parts.slice(0, 5).map((p) => unformat(p.nsn)).join(", ");

  return (
    <>
      <CueReveal />

      <section className="section">
        <div className="u-page">
          <ol className="breadcrumb" data-cue>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/cage-codes">CAGE Codes</Link></li>
            <li>{a.code}</li>
          </ol>

          <div className="dmast" data-cue>
            <p className="eyebrow">CAGE {a.code}</p>
            <h1 className="dmast-title">CAGE Code {a.code} &ndash; {a.company} Parts Catalog</h1>
          </div>

          <div className="dprose" data-cue>
            <p>
              Parts supplied under CAGE Code <b>{a.code}</b> by <b>{a.company}</b> are listed
              below for your reference and procurement needs. A CAGE Code (Commercial and
              Government Entity Code) is a unique 5-character alphanumeric identifier assigned
              by the Defense Logistics Agency (DLA) to manufacturers and suppliers supporting
              U.S. government, military, and aerospace procurement systems. This standardized
              identification system helps streamline logistics, contracting, and supplier
              verification across defense supply chains. It also ensures traceability and
              consistency when sourcing approved aerospace components.
            </p>
            <div className="dprose-cta">
              <Link className="btn btn-primary btn-lg" href={rfqHref({ cage: a.code, mode: "list", for: `${a.company} (CAGE ${a.code})` })}>
                Submit an Instant RFQ
              </Link>
            </div>
          </div>

          {/* PARTS SOURCING AND RFQ SUPPORT */}
          <div className="dsection" data-cue>
            <h2 className="dsection-h">CAGE Code {a.code} Parts Sourcing and RFQ Support</h2>
            <dl className="deflist">
              <div className="def">
                <dt>Verified manufacturer components</dt>
                <dd>
                  Access high-quality parts manufactured by {a.company} under CAGE Code {a.code}
                  {pns ? <>, including components such as <b>{pns}</b></> : null}
                  {nsns ? <> and related NSNs like <b>{nsns}</b></> : null}, ensuring reliable
                  sourcing for aerospace and defense applications.
                </dd>
              </div>
              <div className="def">
                <dt>Streamlined procurement process</dt>
                <dd>Our platform is designed to simplify part identification and procurement, allowing users to quickly locate CAGE Code-based inventory and submit sourcing requests with ease.</dd>
              </div>
              <div className="def">
                <dt>Trusted distribution network</dt>
                <dd>Aerospace Unlimited, owned and operated by ASAP Semiconductor, provides access to verified components through a global supply chain. We ensure quality assurance, traceability, and fast response support for all procurement requirements.</dd>
              </div>
            </dl>
          </div>

          {/* ADDITIONAL DATA */}
          <div className="dsection" data-cue>
            <h2 className="dsection-h">Additional Data for CAGE Code {a.code}</h2>
            <table className="spec-table">
              <tbody>
                <tr><th scope="row">Address</th><td data-plain>&mdash;</td></tr>
                <tr><th scope="row">Status</th><td data-plain>&mdash;</td></tr>
                <tr><th scope="row">Type</th><td data-plain>&mdash;</td></tr>
                <tr><th scope="row">Woman Owned</th><td data-plain>&mdash;</td></tr>
                <tr><th scope="row">Business Type</th><td data-plain>&mdash;</td></tr>
                <tr><th scope="row">Business Size</th><td data-plain>&mdash;</td></tr>
                <tr><th scope="row">Primary Business</th><td data-plain>&mdash;</td></tr>
                <tr><th scope="row">CAO Code</th><td data-plain>&mdash;</td></tr>
                <tr><th scope="row">ADP Code</th><td data-plain>&mdash;</td></tr>
                <tr><th scope="row">Manufacturer</th><td data-plain><Link href={`/manufacturers/${a.code}`}>{a.company}</Link></td></tr>
              </tbody>
            </table>
          </div>

          {/* PARTS CATALOG */}
          <div className="dsection" data-cue>
            <h2 className="dsection-h">CAGE Code {a.code} Parts Catalog</h2>
            <div className="results-layout">
              <FacetFilter targetId="cage-parts" facets={[AVAILABILITY, PART_TYPE, MANUFACTURER]} />

              <div>
                <div className="results-bar">
                  <p className="results-count" role="status" aria-live="polite" data-facet-status>
                    <b>{a.parts.length}</b> {a.parts.length === 1 ? "line" : "lines"} shown
                  </p>
                </div>

                <div id="cage-parts" className="restable-wrap">
                  <table className="restable">
                    <thead>
                      <tr>
                        <th scope="col">Part Number</th>
                        <th scope="col">Item Name</th>
                        <th scope="col">NSN</th>
                        <th scope="col">QTY</th>
                        <th scope="col" className="restable-rfq">RFQ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.parts.map((p) => (
                        <tr key={p.pn} data-facet-row data-f-stock={p.stock} data-f-cat={catName(p.category)} data-f-mfr={p.mfr} data-terms={partTerms(p)}>
                          <td className="mono">{p.pn}</td>
                          <td>{p.desc}</td>
                          <td className="mono">
                            <Link href={`/part/${encodeURIComponent(p.pn)}`}>{p.nsn}</Link>{" "}
                            <span className="u-muted">({unformat(p.nsn)})</span>
                          </td>
                          <td className="mono">Avl</td>
                          <td className="restable-rfq">
                            <Link className="btn btn-text btn-sm" href={rfqHref({ pn: p.pn, cage: a.code, mode: "instant", for: `${p.pn} — ${p.desc}` })}>RFQ</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="empty-state" data-facet-empty hidden>
                  <h2>No lines match those filters.</h2>
                  <p>Clear a filter to widen the list, or send us the numbers and we&rsquo;ll quote every line.</p>
                  <div className="actions">
                    <Link className="btn btn-primary btn-lg" href="/rfq?mode=list">Send us a parts list</Link>
                  </div>
                </div>

                <p className="restable-note">Part numbers and NSNs are an illustrative working sample, not live inventory records.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

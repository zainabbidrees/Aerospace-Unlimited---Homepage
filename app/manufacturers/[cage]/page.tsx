import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PARTS, MANUFACTURERS } from "@/lib/data";
import { rfqHref } from "@/lib/rfq";
import { CueReveal } from "@/components/inner/CueReveal";
import { FacetFilter } from "@/components/browse/FacetFilter";
import { AVAILABILITY, PART_TYPE, catName, partTerms } from "@/lib/facets";

/*
  MANUFACTURER DETAIL — a faithful rebuild of the live /manufacturers/<slug>/
  "Company (CAGE Code X) - Aerospace Parts Catalog" page: the intro paragraphs,
  the CAGE Code line, and the part table (Part No, NSN, Item Name, QTY, RFQ).
  Rows come from the illustrative sample in lib/data.ts. See au-no-invented-content,
  au-legacy-faithful-lookups.
*/

const unformat = (nsn: string) => nsn.replace(/\D/g, "");

function resolve(cage: string) {
  const key = cage.toUpperCase();
  const m = MANUFACTURERS.find((x) => x.cage.toUpperCase() === key);
  if (!m) return null;
  return { company: m.name, code: m.cage, parts: PARTS.filter((p) => p.mfr === m.name) };
}

export async function generateMetadata({ params }: { params: Promise<{ cage: string }> }): Promise<Metadata> {
  const { cage } = await params;
  const a = resolve(decodeURIComponent(cage));
  if (!a) return { title: "Not found" };
  return {
    title: `${a.company} (CAGE Code ${a.code}) - Aerospace Parts Catalog`,
    description: `Browse ${a.company} part numbers and NSNs available for procurement, with a quote back within 15 minutes.`,
  };
}

export default async function ManufacturerDetail({ params }: { params: Promise<{ cage: string }> }) {
  const { cage } = await params;
  const a = resolve(decodeURIComponent(cage));
  if (!a) notFound();

  const pns = a.parts.slice(0, 5).map((p) => p.pn).join(", ");
  const items = [...new Set(a.parts.map((p) => p.desc))].slice(0, 5).join(", ");
  const nsns = a.parts.slice(0, 5).map((p) => unformat(p.nsn)).join(", ");

  return (
    <>
      <CueReveal />

      <section className="section">
        <div className="u-page">
          <ol className="breadcrumb" data-cue>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/manufacturers">Manufacturers</Link></li>
            <li>{a.company}</li>
          </ol>

          <div className="dmast" data-cue>
            <p className="eyebrow">Manufacturer</p>
            <h1 className="dmast-title">{a.company} (CAGE Code {a.code}) - Aerospace Parts Catalog</h1>
          </div>

          <div className="dprose" data-cue>
            <p>
              Welcome to our {a.company} product catalog, where we present a curated
              selection of quality-assured aviation components sourced from this
              manufacturer. This page features a range of {a.company} part numbers that are
              readily available for procurement, along with detailed information to help you
              identify the most suitable options for your operational requirements. If any
              listed items match your needs, you can easily submit a Request for Quote (RFQ)
              through our platform to receive tailored pricing and availability from our team.
            </p>
            <p>
              Current solutions we feature from {a.company} (CAGE Code {a.code}) include a
              variety of in-demand components designed to support aerospace and defense
              applications. In-demand {a.company} part numbers such as <b>{pns}</b> and other
              related items are available for immediate sourcing. We also provide access to
              highly requested components like <b>{items}</b>, ensuring broad procurement
              coverage across multiple categories.
            </p>
            <p>
              Featured National Stock Numbers (NSNs) on this page include classifications such
              as <b>{nsns}</b> and additional related listings, helping streamline
              identification and procurement across standardized aerospace supply chains.
            </p>
            <p className="u-body-strong">
              {a.company} CAGE Code(s): <Link className="u-mono" href={`/cage-codes/${a.code.toLowerCase()}`}>{a.code}</Link>
            </p>
            <div className="dprose-cta">
              <Link className="btn btn-primary btn-lg" href={rfqHref({ cage: a.code, mode: "list", for: `${a.company} (CAGE ${a.code})` })}>
                Submit an Instant RFQ
              </Link>
            </div>
          </div>

          {/* PART LISTING */}
          <div className="dsection" data-cue>
            <h2 className="dsection-h">{a.company} Part Numbers</h2>
            <div className="results-layout">
              <FacetFilter targetId="mfr-parts" facets={[AVAILABILITY, PART_TYPE]} />

              <div>
                <div className="results-bar">
                  <p className="results-count" role="status" aria-live="polite" data-facet-status>
                    <b>{a.parts.length}</b> {a.parts.length === 1 ? "line" : "lines"} shown
                  </p>
                </div>

                <div id="mfr-parts" className="restable-wrap">
                  <table className="restable">
                    <thead>
                      <tr>
                        <th scope="col">Part No</th>
                        <th scope="col">NSN</th>
                        <th scope="col">Item Name</th>
                        <th scope="col">QTY</th>
                        <th scope="col" className="restable-rfq">RFQ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.parts.map((p) => (
                        <tr key={p.pn} data-facet-row data-f-stock={p.stock} data-f-cat={catName(p.category)} data-terms={partTerms(p)}>
                          <td className="mono">{p.pn}</td>
                          <td className="mono">
                            <Link href={`/part/${encodeURIComponent(p.pn)}`}>{p.nsn}</Link>{" "}
                            <span className="u-muted">({unformat(p.nsn)})</span>
                          </td>
                          <td>{p.desc}</td>
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

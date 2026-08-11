import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PARTS, CATEGORIES } from "@/lib/data";
import { rfqHref } from "@/lib/rfq";
import { CueReveal } from "@/components/inner/CueReveal";
import { FacetFilter } from "@/components/browse/FacetFilter";
import { AVAILABILITY, MANUFACTURER, partTerms } from "@/lib/facets";

/*
  PART-TYPE DETAIL — a faithful rebuild of the live /part-types/<slug>/ "Type –
  Aerospace Parts Catalog" page: intro, Reliable Sourcing bullets, the
  Manufacturer's List, and the Part Number's List table.

  The live page's banned "No China Sourcing" line is nowhere here. See
  au-banned-phrase, au-no-invented-content, au-legacy-faithful-lookups.
*/

const unformat = (nsn: string) => nsn.replace(/\D/g, "");

function resolve(slug: string) {
  const c = CATEGORIES.find((x) => x.slug === slug);
  if (!c) return null;
  const parts = PARTS.filter((p) => p.category === slug);
  return {
    type: c.name,
    parts,
    mfrs: [...new Map(parts.map((p) => [p.cage, { name: p.mfr, cage: p.cage }])).values()],
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = resolve(decodeURIComponent(slug));
  if (!a) return { title: "Not found" };
  return {
    title: `${a.type} – Aerospace Parts Catalog`,
    description: `Source ${a.type} components from certified manufacturers — part numbers, NSNs and a quote back within 15 minutes.`,
  };
}

export default async function PartTypeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = resolve(decodeURIComponent(slug));
  if (!a) notFound();

  const pns = a.parts.slice(0, 5).map((p) => p.pn).join(", ");
  const mfrNames = a.mfrs.slice(0, 5).map((m) => m.name).join(", ");

  return (
    <>
      <CueReveal />

      <section className="section">
        <div className="u-page">
          <ol className="breadcrumb" data-cue>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/part-types">Part Types</Link></li>
            <li>{a.type}</li>
          </ol>

          <div className="dmast" data-cue>
            <p className="eyebrow">Part type</p>
            <h1 className="dmast-title">{a.type} &ndash; Aerospace Parts Catalog</h1>
          </div>

          <div className="dprose" data-cue>
            <p>
              If you are searching for quality aviation parts such as <b>{a.type}</b>,
              Aerospace Unlimited is your trusted sourcing platform for reliable aerospace,
              aviation, and defense components. Parts like <b>{pns}</b> are included within
              our extensive {a.type} inventory, supported by a global procurement network
              with access to over 6 billion new, used, and obsolete components. Our platform
              is designed to simplify sourcing, reduce procurement delays, and ensure fast
              availability of mission-critical parts for operational requirements.
            </p>
            <div className="dprose-cta">
              <Link className="btn btn-primary btn-lg" href={rfqHref({ category: slug, mode: "list", for: a.type })}>
                Submit an Instant RFQ
              </Link>
            </div>
          </div>

          {/* RELIABLE SOURCING */}
          <div className="dsection" data-cue>
            <h2 className="dsection-h">Reliable Sourcing for {a.type} Components</h2>
            <dl className="deflist">
              <div className="def">
                <dt>Extensive global inventory access</dt>
                <dd>We maintain a vast selection of {a.type} parts sourced through a global network, allowing customers to quickly locate new, used, and obsolete components for a wide range of aerospace applications.</dd>
              </div>
              <div className="def">
                <dt>Certified manufacturer network</dt>
                <dd>All components are sourced exclusively from approved and certified manufacturers{mfrNames ? <> such as <b>{mfrNames}</b></> : null}, ensuring consistent quality, reliability, and compliance with industry standards.</dd>
              </div>
              <div className="def">
                <dt>Trusted independent distribution</dt>
                <dd>Aerospace Unlimited is a trusted independent distributor, reinforcing our commitment to supply chain integrity, transparency, and dependable procurement solutions.</dd>
              </div>
            </dl>
          </div>

          {/* MANUFACTURER'S LIST */}
          {a.mfrs.length ? (
            <div className="dsection" data-cue>
              <h2 className="dsection-h">Manufacturer&rsquo;s List for {a.type}</h2>
              <ul className="mfrgrid">
                {a.mfrs.map((m) => (
                  <li key={m.cage}><Link href={`/manufacturers/${m.cage}`}>{m.name}</Link></li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* PART NUMBER'S LIST */}
          <div className="dsection" data-cue>
            <h2 className="dsection-h">Part Number&rsquo;s List for {a.type}</h2>
            <div className="results-layout">
              <FacetFilter targetId="pt-parts" facets={[AVAILABILITY, MANUFACTURER]} />

              <div>
                <div className="results-bar">
                  <p className="results-count" role="status" aria-live="polite" data-facet-status>
                    <b>{a.parts.length}</b> {a.parts.length === 1 ? "line" : "lines"} shown
                  </p>
                </div>

                <div id="pt-parts" className="restable-wrap">
                  <table className="restable">
                    <thead>
                      <tr>
                        <th scope="col">Part Number</th>
                        <th scope="col">Manufacturer</th>
                        <th scope="col">NSN</th>
                        <th scope="col">QTY</th>
                        <th scope="col" className="restable-rfq">RFQ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.parts.map((p) => (
                        <tr key={p.pn} data-facet-row data-f-stock={p.stock} data-f-mfr={p.mfr} data-terms={partTerms(p)}>
                          <td className="mono">{p.pn}</td>
                          <td>{p.mfr}</td>
                          <td className="mono">
                            <Link href={`/part/${encodeURIComponent(p.pn)}`}>{p.nsn}</Link>{" "}
                            <span className="u-muted">({unformat(p.nsn)})</span>
                          </td>
                          <td className="mono">Avl</td>
                          <td className="restable-rfq">
                            <Link className="btn btn-text btn-sm" href={rfqHref({ pn: p.pn, mode: "instant", for: `${p.pn} — ${p.desc}` })}>RFQ</Link>
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

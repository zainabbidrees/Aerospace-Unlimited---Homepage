import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PARTS, FSCS } from "@/lib/data";
import { rfqHref } from "@/lib/rfq";
import { CueReveal } from "@/components/inner/CueReveal";
import { CatMast } from "@/components/inner/CatMast";
import { FacetFilter } from "@/components/browse/FacetFilter";
import { AVAILABILITY, MANUFACTURER, partTerms } from "@/lib/facets";

/*
  FSC DETAIL — the live /fscs/<code>/ "List of FSC X Parts" page, legacy copy and
  columns intact (au-legacy-faithful-lookups), given the premium catalog UI: the
  shared light CatMast inner-page header (matching the /fscs index and its sibling
  lookups — the dark full-bleed stage read as a second homepage), then the
  Manufacturer's List and the Part Number List in an elevated table. See
  au-lookup-ui-register.
*/

const unformat = (nsn: string) => nsn.replace(/\D/g, "");

function resolve(code: string) {
  const rec = FSCS.find((f) => f.fsc === code);
  if (!rec) return null;
  const parts = PARTS.filter((p) => p.fsc === code);
  const mfrs = [...new Map(parts.map((p) => [p.cage, { name: p.mfr, cage: p.cage }])).values()];
  return { code, name: rec.name, fsg: rec.fsg, parts, mfrs };
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const a = resolve(decodeURIComponent(code));
  if (!a) return { title: "Not found" };
  return {
    title: `List of FSC ${a.code} ${a.name} Parts`,
    description: `Source FSC ${a.code} ${a.name} components — part numbers, NSNs and manufacturers, with a quote back within 15 minutes.`,
  };
}

export default async function FscDetail({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const a = resolve(decodeURIComponent(code));
  if (!a) notFound();

  const heading = `FSC ${a.code} ${a.name}`;
  const samplePns = a.parts.slice(0, 5).map((p) => p.pn).join(", ");
  const sampleMfrs = a.mfrs.slice(0, 5).map((m) => m.name).join(", ");

  return (
    <>
      <CueReveal />

      <CatMast
        className="catmast--wide"
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/fscs", label: "FSCs" },
          { label: a.code },
        ]}
        eyebrow="Federal Supply Class"
        title={[`List of FSC ${a.code}`, `${a.name} Parts`]}
        lede={
          <>
            A comprehensive sourcing platform for {heading} components
            {samplePns ? <>, including items such as <b>{samplePns}</b></> : null}
            {sampleMfrs ? <>, from trusted manufacturers such as <b>{sampleMfrs}</b></> : null}. Every
            part is inspected, verified and cross-referenced prior to shipment.
          </>
        }
        actions={
          <>
            <Link className="btn btn-primary btn-lg" href={rfqHref({ fsc: a.code, mode: "list", for: heading })}>
              Submit an Instant RFQ
            </Link>
            <a className="btn btn-ghost btn-lg" href="#parts">View part numbers ↓</a>
          </>
        }
      />

      {/* ── MANUFACTURER'S LIST ──────────────────────────────────────────── */}
      {a.mfrs.length ? (
        <section className="section-tight">
          <div className="u-page">
            <div className="section-head" data-cue>
              <p className="eyebrow">Manufacturers</p>
              <h2>{heading} Manufacturer&rsquo;s List</h2>
            </div>
            <ul className="mfrgrid" data-cue>
              {a.mfrs.map((m) => (
                <li key={m.cage}><Link href={`/manufacturers/${m.cage}`}>{m.name}</Link></li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ── PART NUMBER LIST ─────────────────────────────────────────────── */}
      <section className="section-tight" id="parts">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">The catalog</p>
            <h2>Part Number List for {heading}</h2>
            <p>Select a part number to open its full NSN record, or request a quote on any line.</p>
          </div>

          <div className="results-layout">
            <FacetFilter targetId="fsc-parts" facets={[AVAILABILITY, MANUFACTURER]} />

            <div>
              <div className="results-bar" data-cue>
                <p className="results-count" role="status" aria-live="polite" data-facet-status>
                  <b>{a.parts.length}</b> {a.parts.length === 1 ? "line" : "lines"} shown
                </p>
              </div>

              <div id="fsc-parts" className="cx-tablewrap" data-cue="rows" data-cue-ms="1100">
                <table className="cx-table">
                  <thead>
                    <tr>
                      <th scope="col">Part Number</th>
                      <th scope="col">NSN</th>
                      <th scope="col">Item Name</th>
                      <th scope="col">Manufacturer</th>
                      <th scope="col">QTY</th>
                      <th scope="col" className="cx-rfq">RFQ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.parts.map((p) => (
                      <tr key={p.pn} data-facet-row data-f-stock={p.stock} data-f-mfr={p.mfr} data-terms={partTerms(p)}>
                        <td className="mono"><Link href={`/part/${encodeURIComponent(p.pn)}`}>{p.pn}</Link></td>
                        <td className="mono">
                          <Link href={`/part/${encodeURIComponent(p.pn)}`}>{p.nsn}</Link>{" "}
                          <span className="u-muted">({unformat(p.nsn)})</span>
                        </td>
                        <td>{p.desc}</td>
                        <td>{p.mfr}</td>
                        <td className="mono cx-avl">Avl</td>
                        <td className="cx-rfq">
                          <Link className="btn btn-primary btn-sm" href={rfqHref({ pn: p.pn, mode: "instant", for: `${p.pn} — ${p.desc}` })}>RFQ</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="empty-state" data-facet-empty hidden>
                <h2>No lines match those filters.</h2>
                <p>Clear a filter to widen the list, or send us the numbers and we&rsquo;ll quote from the wider network.</p>
                <div className="actions">
                  <Link className="btn btn-primary btn-lg" href="/rfq?mode=list">Send us a parts list</Link>
                </div>
              </div>

              <p className="restable-note">Part numbers, NSNs and manufacturers are an illustrative working sample, not live inventory records — send your list for a full quote.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── REQUIREMENTS ─────────────────────────────────────────────────── */}
      <section className="section-tight">
        <div className="u-page">
          <div className="cx-split" data-cue>
            <div className="dprose">
              <p className="u-body-strong">Our experienced team supports sourcing across a wide range of requirements, including:</p>
              <ul className="ticklist">
                <li>New, obsolete, and hard-to-find {heading} components</li>
                <li>Critical aerospace and NSN part requirements</li>
                <li>Time-sensitive procurement and AOG support cases</li>
                <li>Cross-referenced and fully verified part sourcing</li>
              </ul>
            </div>
            <aside className="cx-note">
              <p>
                As an FAA AC 00-56B accredited and ISO 9001:2015 certified organization, we
                maintain strict quality assurance practices, ensuring that every part is
                thoroughly inspected, verified, and cross-referenced prior to shipment.
              </p>
              <p>
                If you require assistance at any stage of procurement, a dedicated account
                manager is available to support your needs — submit an Instant RFQ today for
                a competitive quote tailored to your requirements.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

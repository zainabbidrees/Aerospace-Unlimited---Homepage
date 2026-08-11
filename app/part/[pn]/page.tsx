import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PARTS, findPart, fscName, fsgOf, ncbOf } from "@/lib/data";
import { rfqHref } from "@/lib/rfq";
import { CueReveal } from "@/components/inner/CueReveal";
import { AddToQuoteButton } from "@/components/PartRow";

/*
  NSN / PART DETAIL — a faithful rebuild of the live /nsn-parts/<nsn>/ "NSN …
  Part Sourcing" page: the Information spec block, the "assigned to" paragraph,
  the Procurement Overview bullets, the Part Number's List table, the
  Characteristics Data table and the Relevant NATO Stock Number list. Values are
  derived from the part's own record / NSN string; nothing is invented. See
  au-no-invented-content, au-legacy-faithful-lookups.
*/

const unformat = (nsn: string) => nsn.replace(/\D/g, "");

export async function generateMetadata({ params }: { params: Promise<{ pn: string }> }): Promise<Metadata> {
  const { pn } = await params;
  const part = findPart(decodeURIComponent(pn));
  if (!part) return { title: "Part not found" };
  return {
    title: `NSN ${part.nsn} (${unformat(part.nsn)}) Part Sourcing`,
    description: `${part.desc} — NSN ${part.nsn}, NIIN ${part.niin}, CAGE ${part.cage}. Request a quote back within 15 minutes.`,
  };
}

export default async function PartPage({ params }: { params: Promise<{ pn: string }> }) {
  const { pn } = await params;
  const part = findPart(decodeURIComponent(pn));
  if (!part) notFound();

  const fmt = part.nsn;
  const unfmt = unformat(part.nsn);
  const fsg = fsgOf(part.fsc);
  const ncb = ncbOf(part.niin);
  const className = fscName(part.fsc);

  const siblings = PARTS.filter((p) => unformat(p.nsn) === unfmt);
  const cages = [...new Set(siblings.map((p) => p.cage))];
  const mfrs = [...new Set(siblings.map((p) => p.mfr))];
  const related = [...new Map(
    PARTS.filter((p) => p.fsc === part.fsc && unformat(p.nsn) !== unfmt).map((p) => [p.nsn, p]),
  ).values()].slice(0, 18);

  return (
    <>
      <CueReveal />

      <section className="section">
        <div className="u-page">
          <ol className="breadcrumb" data-cue>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/nsn">NSN Parts</Link></li>
            <li>{unfmt}</li>
          </ol>

          <div className="dmast" data-cue>
            <p className="eyebrow">NSN {unfmt}</p>
            <h1 className="dmast-title">NSN {fmt} ({unfmt}) Part Sourcing</h1>
          </div>

          {/* INFORMATION SPEC BLOCK */}
          <div className="dsection" data-cue>
            <h2 className="dsection-h">Information for NSN {unfmt}, {fmt}</h2>
            <table className="spec-table">
              <tbody>
                <tr><th scope="row">Item Name</th><td data-plain>{part.desc}</td></tr>
                <tr><th scope="row">FSG</th><td data-plain><span className="u-mono">{fsg.code}</span> {fsg.name}</td></tr>
                <tr>
                  <th scope="row">FSC Name</th>
                  <td data-plain>
                    <Link className="u-mono" href={`/fscs/${part.fsc}`}>{part.fsc}</Link>{className ? ` ${className}` : ""}
                  </td>
                </tr>
                <tr><th scope="row">CAGE Code</th><td><span className="u-mono">{cages.join(", ")}</span></td></tr>
                <tr>
                  <th scope="row">NIIN</th>
                  <td><Link className="u-mono" href={`/niin/${part.niin}`}>{part.niin}</Link></td>
                </tr>
                <tr><th scope="row">NCB Code</th><td data-plain><span className="u-mono">{ncb.code === "00" || ncb.code === "01" ? "USA" : ncb.name} ({ncb.code})</span></td></tr>
                <tr><th scope="row">Manufacturers</th><td data-plain>{mfrs.join(", ")}</td></tr>
              </tbody>
            </table>

            <p className="dprose" style={{ marginTop: "var(--au-s-5)" }}>
              NSN <b>{fmt}</b> is assigned to <b>{part.desc}</b>, manufactured by {mfrs.join(", ")}.
              This NSN listing provides access to available components and related part
              numbers for procurement reference. Each item is organized to help streamline
              identification and support efficient sourcing decisions across aerospace,
              aviation, and defense applications.
            </p>

            <div className="dprose-cta">
              <Link className="btn btn-primary btn-lg" href={rfqHref({ pn: part.pn, nsn: fmt, mode: "instant", for: `${fmt} — ${part.desc}` })}>
                Instant RFQ for {part.pn}
              </Link>
              <AddToQuoteButton part={part} />
              <a className="btn btn-quiet btn-lg" href="tel:+17147054780">+1-714-705-4780 · AOG 24/7</a>
            </div>
          </div>

          {/* PROCUREMENT OVERVIEW */}
          <div className="dsection" data-cue>
            <h2 className="dsection-h">NSN {fmt} Procurement Overview</h2>
            <dl className="deflist">
              <div className="def">
                <dt>Available component listings</dt>
                <dd>Browse components associated with NSN {fmt}, including related part numbers and sourcing options. This structure helps simplify comparison and selection based on your operational requirements.</dd>
              </div>
              <div className="def">
                <dt>Fast quote support</dt>
                <dd>Once you identify the required part, submit a request with your details to receive a competitive quote within 15 minutes. Our team ensures quick turnaround for urgent aerospace and defense procurement needs.</dd>
              </div>
              <div className="def">
                <dt>Reliable sourcing assistance</dt>
                <dd>We work with a global network of certified manufacturers to support dependable sourcing for NSN-related components, ensuring quality, compliance, and timely delivery for mission-critical operations.</dd>
              </div>
            </dl>
          </div>

          {/* PART NUMBER'S LIST */}
          <div className="dsection" data-cue>
            <h2 className="dsection-h">Part Number&rsquo;s List for NSN {unfmt}, {fmt}</h2>
            <div className="restable-wrap">
              <table className="restable">
                <thead>
                  <tr>
                    <th scope="col">Part No</th>
                    <th scope="col">Manufacturer</th>
                    <th scope="col">Item Name</th>
                    <th scope="col">QTY</th>
                    <th scope="col" className="restable-rfq">RFQ</th>
                  </tr>
                </thead>
                <tbody>
                  {siblings.map((p) => (
                    <tr key={p.pn + p.cage}>
                      <td className="mono">{p.pn}</td>
                      <td>{p.mfr}</td>
                      <td>{p.desc}</td>
                      <td className="mono">Avl</td>
                      <td className="restable-rfq">
                        <Link className="btn btn-text btn-sm" href={rfqHref({ pn: p.pn, nsn: fmt, mode: "instant", for: `${p.pn} — ${p.desc}` })}>RFQ</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CHARACTERISTICS DATA */}
          <div className="dsection" data-cue>
            <h2 className="dsection-h">{fmt} Characteristics Data</h2>
            <div className="restable-wrap">
              <table className="restable">
                <thead>
                  <tr>
                    <th scope="col">MRC</th>
                    <th scope="col">Criteria</th>
                    <th scope="col">Characteristic</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="mono">AGAV</td><td>End item identification</td><td>{part.aircraft.length ? "See applicable aircraft on request" : "Multiple applications"}</td></tr>
                  <tr><td className="mono">TEXT</td><td>General characteristics item description</td><td>{part.desc}</td></tr>
                  <tr><td className="mono">CXCY</td><td>Federal supply class</td><td>{part.fsc}{className ? ` — ${className}` : ""}</td></tr>
                </tbody>
              </table>
            </div>
            <p className="restable-note">Full MRC characteristics data for this NSN is provided with the quotation.</p>
          </div>

          {/* RELEVANT NSN LIST */}
          {related.length ? (
            <div className="dsection" data-cue>
              <h2 className="dsection-h">Relevant NATO Stock Number List for {fmt}, {unfmt}</h2>
              <ul className="codewall">
                {related.map((p) => (
                  <li key={p.nsn}>
                    <Link className="codechip u-mono" href={`/part/${encodeURIComponent(p.pn)}`}>{p.nsn}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}

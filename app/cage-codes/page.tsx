import Link from "next/link";
import type { Metadata } from "next";
import { MANUFACTURERS } from "@/lib/data";
import { CueReveal } from "@/components/inner/CueReveal";
import { CatMast } from "@/components/inner/CatMast";
import { FacetFilter } from "@/components/browse/FacetFilter";

/*
  CAGE CODES — a faithful rebuild of the live /cage-codes/ "CAGE Code Lookup
  Tool – Search Now".

  Reproduces the live page's order: two intro paragraphs, a "CAGE Code Lookup and
  Procurement Support" block, then the wall of CAGE code links. The redesign's
  filter bar, A–Z rail and company/count columns are removed — the live page
  lists the code alone. The live page's banned sourcing-pledge line is nowhere here.
  See au-banned-phrase, au-no-invented-content.
*/

export const metadata: Metadata = {
  title: "CAGE Code Lookup Tool – Search Now",
  description:
    "Look up Commercial and Government Entity (CAGE) codes — five-character " +
    "identifiers assigned to organizations doing business with the U.S. Government — " +
    "and cross-reference aerospace and defense components.",
};

const CODES = [...MANUFACTURERS].sort((a, b) => a.cage.localeCompare(b.cage));

export default function CageCodesPage() {
  return (
    <>
      <CueReveal />

      <CatMast
        crumbs={[{ href: "/", label: "Home" }, { label: "CAGE Code" }]}
        eyebrow="Commercial and Government Entity"
        title={["CAGE Code Lookup Tool", "— Search Now"]}
        lede={
          <>
            CAGE Codes, or Commercial and Government Entity codes, are unique
            five-character alphanumeric identifiers assigned to organizations doing
            business with the U.S. Government. This system is used to streamline
            identification and tracking of suppliers working with agencies such as the
            Department of Defense (DoD), NASA, and NATO partners. Military contractors,
            OEMs, and approved suppliers are often required to maintain valid CAGE Code
            registration to meet strict compliance and procurement standards.
          </>
        }
        actions={
          <Link className="btn btn-primary btn-lg" href="/rfq?mode=list">
            Submit an RFQ
          </Link>
        }
        img="/img/catalog/assembly-hall.jpg"
        imgSm="/img/catalog/assembly-hall-sm.jpg"
        alt="An aircraft engine mounted on a rail in an industrial assembly hall, its casing and pipework exposed alongside blue shop machinery"
        imgPosition="50% 45%"
      />

      {/* CAGE CODE LOOKUP AND PROCUREMENT SUPPORT — the live support block. */}
      <section className="section-tight">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">CAGE code lookup and procurement support</p>
            <h2>How CAGE codes work here</h2>
            <p>
              These codes are stored within official government databases and follow a
              standardized format where the first and last characters are letters, while
              the middle characters may include a combination of letters and numbers. At
              Aerospace Unlimited, CAGE Codes also help organize large inventories,
              enabling customers to quickly locate and cross-reference aerospace and
              defense components using our lookup tools.
            </p>
          </div>

          <dl className="deflist" data-cue="depth" data-cue-ms="1100">
            <div className="def">
              <dt>Efficient CAGE code search</dt>
              <dd>
                Use our CAGE Code lookup tool to quickly identify organizations and
                related aerospace parts. This helps simplify sourcing across complex
                supply chains.
              </dd>
            </div>
            <div className="def">
              <dt>Verified global inventory access</dt>
              <dd>
                We provide access to over 2 billion new, used, and obsolete components
                supporting aerospace, defense, and civil aviation industries through a
                reliable global sourcing network.
              </dd>
            </div>
            <div className="def">
              <dt>Certified distribution network</dt>
              <dd>
                Aerospace Unlimited, owned and operated by ASAP Semiconductor, operates
                under FAA AC 00-56B accreditation and ISO 9001:2015 certification,
                ensuring quality, traceability, and compliance across the sourcing
                network.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* THE WALL — CAGE code links, code only, as the live page renders them. */}
      <section className="section-tight">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">The lookup</p>
            <h2>Browse CAGE codes</h2>
            <p>Select a CAGE code to open the parts we hold against that entity.</p>
          </div>

          <div className="results-layout">
            <FacetFilter targetId="cage-codes-wall" facets={[]} noun="code" nounPlural="codes" />

            <div>
              <div className="results-bar">
                <p className="results-count" role="status" aria-live="polite" data-facet-status>
                  <b>{CODES.length}</b> codes shown
                </p>
              </div>

              <ul className="codewall" id="cage-codes-wall" data-cue="group" data-cue-ms="1100">
                {CODES.map((m) => (
                  <li key={m.cage} data-facet-row data-terms={`${m.cage} ${m.name}`.toLowerCase()}>
                    <Link className="codechip u-mono" href={`/cage-codes/${m.cage.toLowerCase()}`} aria-label={`CAGE code ${m.cage} — ${m.name}`}>
                      {m.cage}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="empty-state" data-facet-empty hidden>
                <h2>No CAGE code matches that.</h2>
                <p>We can still source parts from entities outside this index — send the code or company and we&rsquo;ll quote.</p>
                <div className="actions">
                  <Link className="btn btn-primary btn-lg" href="/rfq">Request a quote</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

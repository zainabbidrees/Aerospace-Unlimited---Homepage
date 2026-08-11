import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PARTS, MANUFACTURERS, CATEGORIES } from "@/lib/data";
import { rfqHref } from "@/lib/rfq";
import { CueReveal } from "@/components/inner/CueReveal";
import { CatMast } from "@/components/inner/CatMast";
import { FacetFilter } from "@/components/browse/FacetFilter";
import { AVAILABILITY, MANUFACTURER, partTerms } from "@/lib/facets";

/*
  NIIN DETAIL — the live /niin-parts/<niin>/ page (intro, Manufacturer's List,
  CAGE Code List, Part Number's List, FAQ, and the Leading Manufacturers /
  Trending Part Categories lists), given the same premium inner-page UI as the
  FSC detail: a copy-only CatMast header, section-head eyebrows for rhythm, and
  the elevated cx-table for the parts listing.

  THE BANNED SOURCING PLEDGE IS ON THE LIVE NIIN PAGE AND IS NOWHERE HERE. See
  au-banned-phrase, au-no-invented-content, au-legacy-faithful-lookups.
*/

function resolve(id: string) {
  const digits = id.replace(/\D/g, "");
  if (digits.length !== 9) return null;
  const parts = PARTS.filter((p) => p.niin === digits);
  if (!parts.length) return null;
  return {
    niin: digits,
    parts,
    mfrs: [...new Map(parts.map((p) => [p.cage, { name: p.mfr, cage: p.cage }])).values()],
    cages: [...new Set(parts.map((p) => p.cage))],
    item: parts[0].desc,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ niin: string }> }): Promise<Metadata> {
  const { niin } = await params;
  const a = resolve(decodeURIComponent(niin));
  if (!a) return { title: "Not found" };
  return {
    title: `NIIN ${a.niin} — ${a.item} Parts`,
    description: `Source parts under NIIN ${a.niin} (${a.item}) — manufacturers, CAGE codes and part numbers, with a quote back within 15 minutes.`,
  };
}

export default async function NiinDetail({ params }: { params: Promise<{ niin: string }> }) {
  const { niin } = await params;
  const a = resolve(decodeURIComponent(niin));
  if (!a) notFound();

  const pns = a.parts.slice(0, 5).map((p) => p.pn).join(", ");

  return (
    <>
      <CueReveal />

      <CatMast
        className="catmast--wide"
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/niin", label: "NIIN Parts" },
          { label: a.niin },
        ]}
        eyebrow={`NIIN ${a.niin}`}
        title={["Find the Parts You Need", "with Our NIIN Lookup Tool"]}
        lede={
          <>
            <p>
              At Aerospace Unlimited, we make it easy to locate high-quality components
              through our advanced NIIN lookup tool. Whether you&rsquo;re sourcing standard
              or hard-to-find parts, our intuitive platform helps you search quickly and
              efficiently.
            </p>
            <p>
              Every part we distribute undergoes rigorous quality control to ensure
              complete supply chain transparency. Use our NIIN lookup tool to browse our
              inventory with confidence, and rely on our team for fast quotes and
              dependable service. Discover how the NIIN lookup tool can simplify your
              procurement process today &mdash; only at Aerospace Unlimited.
            </p>
          </>
        }
        actions={
          <>
            <Link className="btn btn-primary btn-lg" href={rfqHref({ niin: a.niin, mode: "instant", for: `NIIN ${a.niin} — ${a.item}` })}>
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
              <h2>Manufacturer&rsquo;s List for NIIN {a.niin}</h2>
            </div>
            <ul className="mfrgrid" data-cue>
              {a.mfrs.map((m) => (
                <li key={m.cage}><Link href={`/manufacturers/${m.cage}`}>{m.name}</Link></li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ── CAGE CODE LIST ───────────────────────────────────────────────── */}
      <section className="section-tight">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">CAGE codes</p>
            <h2>CAGE Code List for NIIN {a.niin}</h2>
          </div>
          <ul className="codewall" data-cue>
            {a.cages.map((c) => (
              <li key={c}><Link className="codechip u-mono" href={`/cage-codes/${c.toLowerCase()}`}>{c}</Link></li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── PART NUMBER'S LIST ───────────────────────────────────────────── */}
      <section className="section-tight" id="parts">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">The catalog</p>
            <h2>Part Number&rsquo;s List for NIIN {a.niin}</h2>
            <p>Select a part number to open its full NSN record, or request a quote on any line.</p>
          </div>

          <div className="results-layout">
            <FacetFilter targetId="niin-parts" facets={[AVAILABILITY, MANUFACTURER]} />

            <div>
              <div className="results-bar">
                <p className="results-count" role="status" aria-live="polite" data-facet-status>
                  <b>{a.parts.length}</b> {a.parts.length === 1 ? "line" : "lines"} shown
                </p>
              </div>

              <div id="niin-parts" className="cx-tablewrap" data-cue="rows" data-cue-ms="1100">
                <table className="cx-table">
                  <thead>
                    <tr>
                      <th scope="col">Part Number</th>
                      <th scope="col">Item Name</th>
                      <th scope="col">NSN</th>
                      <th scope="col">QTY</th>
                      <th scope="col" className="cx-rfq">RFQ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.parts.map((p) => (
                      <tr key={p.pn + p.cage} data-facet-row data-f-stock={p.stock} data-f-mfr={p.mfr} data-terms={partTerms(p)}>
                        <td className="mono"><Link href={`/part/${encodeURIComponent(p.pn)}`}>{p.pn}</Link></td>
                        <td>{p.desc}</td>
                        <td className="mono"><Link href={`/part/${encodeURIComponent(p.pn)}`}>{p.nsn}</Link></td>
                        <td className="mono cx-avl">Avl</td>
                        <td className="cx-rfq">
                          <Link className="btn btn-primary btn-sm" href={rfqHref({ pn: p.pn, niin: a.niin, mode: "instant", for: `${p.pn} — ${p.desc}` })}>RFQ</Link>
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

              <p className="restable-note">Part numbers, NSNs and manufacturers are an illustrative working sample, not live inventory records — send your list for a full quote.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="section-tight">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">Good to know</p>
            <h2>Frequently Asked Questions for NIIN {a.niin}</h2>
          </div>
          <dl className="faqlist" data-cue>
            <div className="faq">
              <dt>What does the NIIN {a.niin} represent?</dt>
              <dd>A National Item Identification Number (NIIN) is the final nine digits of an NSN that provides a specific identifier for items of supply, providing a simplified means of tracking, managing, and categorizing them. NIIN {a.niin}, which is featured on this page, specifically covers {a.item} parts.</dd>
            </div>
            <div className="faq">
              <dt>What manufacturers produce items with the NIIN {a.niin}?</dt>
              <dd>On our website, you will be able to find NIIN {a.niin} parts from manufacturers like {a.mfrs.map((m) => m.name).join(", ")}, and others.</dd>
            </div>
            <div className="faq">
              <dt>What CAGE codes are associated with NIIN {a.niin}?</dt>
              <dd>Manufacturers whose NIIN {a.niin} offerings are featured on our website specifically operate under CAGE Codes like {a.cages.join(", ")}, and others.</dd>
            </div>
            <div className="faq">
              <dt>What part numbers are associated with NIIN {a.niin}?</dt>
              <dd>NIIN {a.niin} offerings that we carry on this website include popular part numbers like {pns}, and others, ensuring a rounded selection.</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── LEADING MANUFACTURERS / TRENDING PART CATEGORIES ─────────────── */}
      <section className="section-tight">
        <div className="u-page">
          <div className="twinlist" data-cue="pair" data-cue-ms="1100">
            <div className="twincol">
              <div className="twincol-head">
                <h2>Leading Manufacturers</h2>
                <Link className="btn btn-text btn-sm" href="/manufacturers">View all</Link>
              </div>
              <ul className="linklist">
                {MANUFACTURERS.slice(0, 10).map((m) => (
                  <li key={m.cage}><Link href={`/manufacturers/${m.cage}`}>{m.name}</Link></li>
                ))}
              </ul>
            </div>
            <div className="twincol">
              <div className="twincol-head">
                <h2>Trending Part Categories</h2>
                <Link className="btn btn-text btn-sm" href="/part-types">View all</Link>
              </div>
              <ul className="linklist">
                {CATEGORIES.slice(0, 10).map((c) => (
                  <li key={c.slug}><Link href={`/part-types/${c.slug}`}>{c.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

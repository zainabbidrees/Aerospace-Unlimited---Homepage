import Link from "next/link";
import type { Metadata } from "next";
import { FSCS, FSG_NAMES, type Fsc } from "@/lib/data";
import { CueReveal } from "@/components/inner/CueReveal";
import { CatMast } from "@/components/inner/CatMast";
import { IndexFilter } from "@/components/browse/IndexFilter";

/*
  FSCs — the live /fscs/ "Federal Supply Groups and Classes (FSG/FSC) Lookup
  Catalog", carrying the live site's copy and structure (au-legacy-faithful-lookups)
  with a premium, non-template UI: the shared light CatMast inner-page header
  (its siblings /nsn, /niin, /cage-codes wear the same one — the dark full-bleed
  hero read as a second homepage), an engineered three-step process, and a
  "register" of elevated FSG group panels — each stamped with a large ghosted FSG
  numeral and a sticky jump-rail beside them. See au-lookup-ui-register, au-visual-system.
*/

export const metadata: Metadata = {
  title: "Federal Supply Groups and Classes (FSG/FSC) Lookup Catalog",
  description:
    "A structured Federal Supply Group (FSG) and Federal Supply Class (FSC) " +
    "lookup catalog to simplify the identification and sourcing of aerospace and " +
    "NSN components.",
};

const FSG_GROUPS = (() => {
  const map = new Map<string, Fsc[]>();
  for (const f of [...FSCS].sort((a, b) => a.fsc.localeCompare(b.fsc))) {
    if (!map.has(f.fsg)) map.set(f.fsg, []);
    map.get(f.fsg)!.push(f);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
})();

export default function FscsPage() {
  return (
    <>
      <CueReveal />
      <IndexFilter noun="class" nounPlural="classes" />

      <CatMast
        className="catmast--wide"
        crumbs={[{ href: "/", label: "Home" }, { label: "FSCs" }]}
        eyebrow="Federal Supply Groups & Classes"
        title={["Federal Supply Groups and Classes", "(FSG/FSC) Lookup Catalog"]}
        lede={
          <>
            A structured Federal Supply Group (FSG) and Federal Supply Class (FSC)
            lookup catalog designed to simplify the identification and sourcing of
            aerospace and NSN components — organized under the standardized military
            classification system for faster, more accurate procurement.
          </>
        }
        actions={
          <>
            <Link className="btn btn-primary btn-lg" href="/rfq?mode=list">
              Submit an RFQ
            </Link>
            <a className="btn btn-ghost btn-lg" href="#index">Browse the classes ↓</a>
          </>
        }
        img="/img/catalog/gear-axle.jpg"
        alt="A close-up of a machined gear and axle assembly on shop machinery"
        imgPosition="50% 50%"
      />

      {/* ── HOW TO USE ───────────────────────────────────────────────────── */}
      <section className="section-tight">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">Getting started</p>
            <h2>How to use the FSG/FSC catalog</h2>
            <p>To find and procure the components you need, follow these steps.</p>
          </div>

          <ol className="fscx-steps" data-cue="steps" data-cue-ms="1100">
            <li className="fscx-step">
              <span className="fscx-step-n u-mono" aria-hidden="true">01</span>
              <h3 className="fscx-step-b">Select an FSC category</h3>
              <p className="fscx-step-t">Browse the list below and select a Federal Supply Class (FSC) to access a curated catalog of available part numbers and related inventory.</p>
            </li>
            <li className="fscx-step">
              <span className="fscx-step-n u-mono" aria-hidden="true">02</span>
              <h3 className="fscx-step-b">Submit an RFQ request</h3>
              <p className="fscx-step-t">Use our online Request for Quote (RFQ) forms to submit your specific requirements, including part numbers, quantities, and delivery needs.</p>
            </li>
            <li className="fscx-step">
              <span className="fscx-step-n u-mono" aria-hidden="true">03</span>
              <h3 className="fscx-step-b">Receive a tailored quote</h3>
              <p className="fscx-step-t">Once your request is reviewed, our procurement team will respond promptly with customized sourcing solutions and competitive pricing options.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* ── THE REGISTER ─────────────────────────────────────────────────── */}
      <section className="section-tight" id="index">
        <div className="u-page">
          <div className="section-head" data-cue>
            <p className="eyebrow">The catalog</p>
            <h2>Browse by Federal Supply Class</h2>
            <p>Each class sits under its Federal Supply Group. Select a class to see the part numbers and inventory we hold in it.</p>
          </div>

          <div className="fscx-filterbar" data-cue>
            <div className="field fscx-filterfield">
              <label className="u-visually-hidden" htmlFor="fsc-filter">Filter classes by name or FSC code</label>
              <input
                id="fsc-filter"
                type="search"
                placeholder="Filter classes — valve, 4820…"
                autoComplete="off"
                data-index-filter
              />
            </div>
            <p className="results-count" role="status" aria-live="polite" data-index-count>
              {FSCS.length} classes
            </p>
          </div>

          <div className="fscx-reg">
            <nav className="fscx-rail" aria-label="Jump to supply group">
              {FSG_GROUPS.map(([code]) => (
                <a className="fscx-railkey u-mono" href={`#fsg-${code}`} data-index-letter data-letter={code} key={code}>{code}</a>
              ))}
            </nav>

            <div className="fscx-groups">
              {FSG_GROUPS.map(([code, items]) => (
                <section className="fscx-group" id={`fsg-${code}`} data-index-group data-letter={code} data-cue="group" data-cue-ms="1000" key={code}>
                  <header className="fscx-grouphead">
                    <span className="fscx-fsg u-mono" aria-hidden="true">{code}</span>
                    <span className="fscx-groupmeta">
                      <span className="fscx-grouplabel u-mono">FSG {code}</span>
                      <span className="fscx-groupname">{FSG_NAMES[code] ?? `Federal Supply Group ${code}`}</span>
                    </span>
                    <span className="fscx-groupn">{items.length} {items.length === 1 ? "class" : "classes"}</span>
                  </header>

                  <ul className="fscx-classes">
                    {items.map((f) => (
                      <li key={f.fsc} data-index-row data-terms={`fsc ${f.fsc} ${f.name}`.toLowerCase()}>
                        <Link className="fscx-class" href={`/fscs/${f.fsc}`}>
                          <span className="fscx-code u-mono">FSC {f.fsc}</span>
                          <span className="fscx-name">{f.name}</span>
                          <span className="fscx-go" aria-hidden="true">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>

          <div className="empty-state" data-index-empty hidden>
            <h2>No class matches that.</h2>
            <p>Try the item name or the four-digit FSC, or send us the part and we&rsquo;ll place it.</p>
            <div className="actions">
              <Link className="btn btn-primary btn-lg" href="/rfq?mode=list">Send us a parts list</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

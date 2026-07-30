/* ==========================================================================
   Certifications & memberships — an auto-scrolling logo carousel

   The section used to carry five text pills (AS9120B, ISO 9001, FAA, ITAR, ESD).
   This shows the real thing: every accreditation and membership the company
   actually holds, as its own mark on a small white card, the rail scrolling
   itself. Each card is calm and monochrome at rest and returns to full colour —
   "bolder" — as it lifts under the pointer.

   The scroll mechanism, the pause-on-hover, and the reduced-motion fallback are
   the site's existing `.marquee` set (see NsnMarquee) — reused, not reinvented,
   so a browser that honours `prefers-reduced-motion` or a renderer that never
   advances a CSS animation both degrade to a static, readable, hand-scrollable
   row rather than a blank or frozen strip. See au-motion-safety.

   Nothing here is invented — these are the marks on aerospaceunlimited.com's own
   certifications page. Each `alt` names the accreditation, so the strip reads as
   a list of certifications to a screen reader, not sixteen unlabelled images.
   ========================================================================== */

interface Cert {
  img: string;
  label: string;
}

/* Ordered for rhythm, not ranking: the round badges and the wordmarks are
   interleaved so the rail never runs several near-identical seals in a row. */
const CERTS: Cert[] = [
  { img: "asa", label: "Aviation Suppliers Association member" },
  { img: "as9120b", label: "AS9120B and ISO 9001:2015 certified" },
  { img: "faa", label: "FAA AC 00-56B certified company" },
  { img: "itar", label: "ITAR registered" },
  { img: "nbaa", label: "National Business Aviation Association member" },
  { img: "as6081", label: "AS6081 certified supplier" },
  { img: "dla", label: "Defense Logistics Agency — CAGE code 6RE77" },
  { img: "nist", label: "NIST 800-171 compliant" },
  { img: "duns", label: "D-U-N-S registered" },
  { img: "esd", label: "ANSI/ESD S20.20 facility" },
  { img: "inc500", label: "Inc. 500 fastest-growing private company" },
  { img: "visual-compliance", label: "Visual Compliance (eCustoms) export screening" },
  { img: "top-2026", label: "Top Distributor 2026" },
  { img: "top-2025", label: "Top Distributor 2025" },
  { img: "top-2020", label: "Top Distributor 2020" },
  { img: "top-2018", label: "Top Distributor 2018" },
];

function CertCard({ c, clone }: { c: Cert; clone: boolean }) {
  return (
    <div className="cert-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/img/certs/${c.img}.png`}
        alt={clone ? "" : c.label}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export function CertMarquee() {
  return (
    <div className="marquee cert-marquee">
      <div className="marquee-track">
        <div className="marquee-group">
          {CERTS.map((c) => (
            <CertCard c={c} clone={false} key={c.img} />
          ))}
        </div>
        {/* The seam-hiding duplicate. aria-hidden and dropped from the tab order
            and from the reduced-motion scroller, so a reader never meets the
            sixteen certifications twice. */}
        <div className="marquee-group" aria-hidden="true">
          {CERTS.map((c) => (
            <CertCard c={c} clone key={c.img} />
          ))}
        </div>
      </div>
    </div>
  );
}

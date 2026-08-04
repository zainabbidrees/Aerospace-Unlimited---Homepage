/* One monoline glyph per About-page concept, keyed by a plain slug.

   Same drawing convention as CategoryIcon and the homepage's four feature
   points: a 24×24 box, no fill, 1.5 stroke, round caps and joins. That is the
   site's only icon idiom and these have to sit in it — a second style would
   read as a second design system.

   The About page carries four icon sets — the four values, the six "what sets
   us apart" points, the six industries, and the five compliance marks. Each
   glyph draws the idea plainly (a heart for passion, a globe for reach, a lock
   for ITAR) so a reader can name the cell before reading its label.

   aria-hidden: every glyph sits beside its own text label, so a screen reader
   is given the label, not a description of a drawing of it. */

/* The four value glyphs carry `pathLength={1}`, and they are the only ones that
   do. It re-bases each shape's own geometry onto a 0→1 scale, which is what lets
   the values row draw them in with ONE `stroke-dasharray: 1` rule — a shield
   outline and a two-stroke tick are wildly different real lengths, and without
   this they would draw at wildly different speeds from the same progress value.
   The attribute is inert wherever no dash is applied, so the other twenty-odd
   glyphs and every other use of these four are unaffected.
   See .value-ico in ux.css and ValuesConverge.tsx. */
const GLYPHS: Record<string, React.ReactNode> = {
  /* ---- Our values ------------------------------------------------------- */

  /* Shield with a check — doing right, always. */
  integrity: (
    <>
      <path pathLength={1} d="M12 3 5 5.6v5.2c0 4.3 3 7.4 7 9.2 4-1.8 7-4.9 7-9.2V5.6Z" />
      <path pathLength={1} d="M8.8 11.9 11 14.1l4.2-4.4" />
    </>
  ),

  /* A clock — count on us, every time. */
  reliability: (
    <>
      <circle pathLength={1} cx="12" cy="12" r="8.4" />
      <path pathLength={1} d="M12 7v5l3.4 2" />
    </>
  ),

  /* A heart — we care about the mission. */
  passion: (
    <path pathLength={1} d="M12 20.3 4.4 12.9a4.6 4.6 0 0 1 0-6.6 4.6 4.6 0 0 1 6.5 0l1.1 1.1 1.1-1.1a4.6 4.6 0 0 1 6.5 0 4.6 4.6 0 0 1 0 6.6Z" />
  ),

  /* A rising trend line with an arrowhead — learn, adapt, improve. */
  "continuous-improvement": (
    <>
      <path pathLength={1} d="M3.5 15.5 9 10l3.5 3.5L20.5 6" />
      <path pathLength={1} d="M15.5 6h5v5" />
    </>
  ),

  /* ---- What sets us apart ----------------------------------------------- */

  /* A globe — global sourcing reach. */
  "extensive-network": (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M3.4 12h17.2" />
      <path d="M12 3.4c2.4 2.3 3.8 5.4 3.8 8.6S14.4 18.3 12 20.6C9.6 18.3 8.2 15.2 8.2 12S9.6 5.7 12 3.4Z" />
    </>
  ),

  /* A speed gauge — quick turnarounds, real-time response. */
  "fast-responsive": (
    <>
      <path d="M4 16a8 8 0 0 1 16 0" />
      <path d="M12 16l4.4-3.6" />
      <circle cx="12" cy="16" r="1" />
    </>
  ),

  /* An official seal with a check — rigorous vetting and quality standards. */
  "quality-assured": (
    <>
      <path d="M12 3.2 14 5l2.6-.3.9 2.4 2.4.9-.3 2.6L21 12l-1.4 2.4.3 2.6-2.4.9-.9 2.4L14 20l-2 1.8L10 20l-2.6.3-.9-2.4L4.1 17l.3-2.6L3 12l1.4-2.4L4.1 7l2.4-.9L7.4 4.7 10 5Z" />
      <path d="M9.3 11.9 11.3 14l3.5-3.8" />
    </>
  ),

  /* A single person — solutions tailored to the customer. */
  "customer-focused": (
    <>
      <circle cx="12" cy="8.6" r="3.4" />
      <path d="M5.8 19.4a6.2 6.2 0 0 1 12.4 0" />
    </>
  ),

  /* A price tag — value-driven pricing. */
  "competitive-pricing": (
    <>
      <path d="M12.7 3.4H19a1.6 1.6 0 0 1 1.6 1.6v6.3L11.1 21 3 12.9l9.7-9.5Z" />
      <circle cx="16.4" cy="7.6" r="1.3" />
    </>
  ),

  /* Two people — an experienced team. */
  "experienced-team": (
    <>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.5 19.2a5.5 5.5 0 0 1 11 0" />
      <path d="M16 6.4a3 3 0 0 1 0 5.5" />
      <path d="M17.2 14.3a5.5 5.5 0 0 1 3.3 4.9" />
    </>
  ),

  /* ---- Industries we serve ---------------------------------------------- */

  /* Airliner, planform — aerospace. */
  aerospace: (
    <path d="M12 2.6c1 0 1.6 1.4 1.6 3.4v3l6.8 3.9v2.1l-6.8-1.9v3.7l1.9 1.4v1.7L12 22.2l-3.5-1.3v-1.7l1.9-1.4v-3.7l-6.8 1.9v-2.1L10.4 9V6c0-2 .6-3.4 1.6-3.4Z" />
  ),

  /* Shield — defense. */
  defense: (
    <path d="M12 3 5 5.6v5.2c0 4.3 3 7.4 7 9.2 4-1.8 7-4.9 7-9.2V5.6Z" />
  ),

  /* Sawtooth factory roofline — industrial. */
  industrial: (
    <>
      <path d="M3.5 20.5V11l5 3v-3l5 3V7l7 4v9.5Z" />
      <path d="M3 20.5h18" />
    </>
  ),

  /* Office tower — commercial. */
  commercial: (
    <>
      <path d="M5.5 20.5V4.6a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v15.9" />
      <path d="M14.5 20.5V9.6h3a1 1 0 0 1 1 1v9.9" />
      <path d="M8 7.2h3M8 10.7h3M8 14.2h3" />
      <path d="M3 20.5h18" />
    </>
  ),

  /* Lightning bolt — energy. */
  energy: (
    <path d="M13 2.6 5 13.4h6l-2 8 8-11h-6Z" />
  ),

  /* A wrench — OEMs & MROs, maintenance and overhaul. */
  "oem-mro": (
    <path d="M15.4 3.6a4.5 4.5 0 0 0-5.8 5.8L3 16l2 2 6.6-6.6a4.5 4.5 0 0 0 5.8-5.8l-2.6 2.6-2.4-.6-.6-2.4Z" />
  ),

  /* ---- Quality & compliance --------------------------------------------- */

  /* A certificate with a check — AS9120. */
  as9120: (
    <>
      <path d="M6 3.5h8l4 4v13H6Z" />
      <path d="M14 3.5v4h4" />
      <path d="M8.6 13l1.9 1.9 4-4.2" />
    </>
  ),

  /* A medal on a ribbon — ISO 9001. */
  "iso-9001": (
    <>
      <circle cx="12" cy="9.4" r="5.1" />
      <path d="M9.8 9.3 11.5 11l3-3.2" />
      <path d="M9 14 7.4 20.5 12 18.2l4.6 2.3L15 14" />
    </>
  ),

  /* A padlock — ITAR registered. */
  itar: (
    <>
      <rect x="5.5" y="10.5" width="13" height="9" rx="1.6" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
      <path d="M12 14v2" />
    </>
  ),

  /* Connected nodes — end-to-end traceability. */
  traceability: (
    <>
      <circle cx="5" cy="6.6" r="2" />
      <circle cx="19" cy="12" r="2" />
      <circle cx="7" cy="18.4" r="2" />
      <path d="M6.8 7.7 17.3 11" />
      <path d="M17.3 13.3 8.5 17.1" />
    </>
  ),

  /* A clipboard with a check — risk & quality management. */
  "risk-quality": (
    <>
      <rect x="5.5" y="4.6" width="13" height="15.9" rx="1.6" />
      <path d="M9 4.6V3.6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M8.8 12l1.9 1.9 4-4.2" />
    </>
  ),
};

export function AboutIcon({ name }: { name: string }) {
  /* A missing slug renders nothing rather than an empty box, so a mistyped or
     newly added name loses its mark and keeps its layout instead of shipping a
     blank chip. */
  const glyph = GLYPHS[name];
  if (!glyph) return null;
  return (
    <span className="a-ico" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        {glyph}
      </svg>
    </span>
  );
}

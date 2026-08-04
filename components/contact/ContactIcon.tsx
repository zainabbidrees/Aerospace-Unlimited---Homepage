/* One monoline glyph per Contact-page concept, keyed by a plain slug.

   Same drawing convention as AboutIcon and CategoryIcon — a 24×24 box, no fill,
   1.5 stroke, round caps and joins. That is the site's only icon idiom; a second
   style would read as a second design system.

   Unlike AboutIcon this returns the bare <svg>, because the Contact page sizes
   its glyphs very differently per band (a 40px routing chip, a 26px desk chip, an
   18px checklist tick) and a fixed wrapper span would have to be overridden three
   times. The call site owns the chip; this owns the drawing.

   aria-hidden: every glyph sits beside its own text label, so a screen reader is
   given the label rather than a description of a drawing of it. */

const GLYPHS: Record<string, React.ReactNode> = {
  /* ---- The three routes -------------------------------------------------- */

  /* A price tag with its hole — pricing, availability, lead time. */
  quote: (
    <>
      <path d="M12.6 3.4H20v7.4l-9.2 9.2a1.6 1.6 0 0 1-2.3 0l-5.1-5.1a1.6 1.6 0 0 1 0-2.3Z" />
      <circle cx="16.3" cy="7.1" r="1.5" />
    </>
  ),

  /* An aircraft on a runway line with a descent path — AOG. */
  aog: (
    <>
      <path d="M3 20.5h18" />
      <path d="M4.2 9.1l1.7-.4 3.3 2.4 4.6-1.2-3.5-4.3 1.8-.5 5.2 4.1 3.4-.9a1.4 1.4 0 0 1 .7 2.7L6.6 15.6a1.4 1.4 0 0 1-1.5-.5L2.4 11.6Z" />
    </>
  ),

  /* An envelope — everything else. */
  mail: (
    <>
      <rect x="3" y="5.4" width="18" height="13.2" rx="2.2" />
      <path d="M3.6 6.6l7.5 5.6a1.5 1.5 0 0 0 1.8 0l7.5-5.6" />
    </>
  ),

  /* ---- Direct details --------------------------------------------------- */

  /* A handset. */
  phone: (
    <path d="M6.3 3.6h2.6l1.5 4-2 1.4a11.4 11.4 0 0 0 6.6 6.6l1.4-2 4 1.5v2.6a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.3 5.8a2 2 0 0 1 2-2.2Z" />
  ),

  /* A map pin. */
  pin: (
    <>
      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),

  /* A clock. */
  clock: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7v5l3.4 2" />
    </>
  ),

  /* ---- The desks -------------------------------------------------------- */

  /* A headset — the quoting desk. */
  desk: (
    <>
      <path d="M4.6 13.4v-1.2a7.4 7.4 0 0 1 14.8 0v1.2" />
      <rect x="2.8" y="13" width="3.6" height="5.6" rx="1.6" />
      <rect x="17.6" y="13" width="3.6" height="5.6" rx="1.6" />
      <path d="M19.4 18.6v.6a2.2 2.2 0 0 1-2.2 2.2H13" />
    </>
  ),

  /* A delivery truck — purchasing and inbound stock. */
  truck: (
    <>
      <path d="M2.8 6.6h10.6v9.2H2.8Z" />
      <path d="M13.4 9.8h3.9l2.9 3.1v2.9h-6.8Z" />
      <circle cx="7.2" cy="18" r="2.1" />
      <circle cx="16.8" cy="18" r="2.1" />
      <path d="M9.3 18h5.4" />
    </>
  ),

  /* A certificate with a seal — vendor set-up and certificate copies. */
  cert: (
    <>
      <path d="M6.4 3.4h7.2l4 4v6.2H6.4Z" />
      <path d="M13.4 3.4v4h4" />
      <circle cx="12" cy="17.6" r="3" />
      <path d="M10.3 20.1 9.6 22l2.4-1 2.4 1-.7-1.9" />
    </>
  ),

  /* ---- Before you write ------------------------------------------------- */

  /* A tagged label with a hash — a part number or NSN. */
  hash: (
    <>
      <rect x="3.6" y="4.6" width="16.8" height="14.8" rx="2.2" />
      <path d="M9.6 8.2 8.4 15.8M15.6 8.2l-1.2 7.6M7.4 10.6h9.2M6.9 13.4h9.2" />
    </>
  ),

  /* Stacked plates — quantity. */
  stack: (
    <>
      <path d="M12 3.4 20 7.4 12 11.4 4 7.4Z" />
      <path d="M4 12.1l8 4 8-4" />
      <path d="M4 16.6l8 4 8-4" />
    </>
  ),

  /* A shield with a tick — condition and certification. */
  condition: (
    <>
      <path d="M12 3.4 5.2 5.9v5c0 4.1 2.9 7.1 6.8 8.8 3.9-1.7 6.8-4.7 6.8-8.8v-5Z" />
      <path d="M9 11.7 11.2 14l3.9-4.2" />
    </>
  ),

  /* A calendar — the need-by date. */
  calendar: (
    <>
      <rect x="3.6" y="5.4" width="16.8" height="15" rx="2.2" />
      <path d="M3.6 10.2h16.8M8.4 3.4v4M15.6 3.4v4" />
    </>
  ),

  /* An airframe in plan — aircraft type, tail or MSN. */
  aircraft: (
    <path d="M12 2.6c.9 0 1.5 1.1 1.5 2.6v3.4l6.9 4.1v2.2l-6.9-2.1v3.6l2.4 1.8v1.6L12 18.8l-3.9 1.6v-1.6l2.4-1.8v-3.6l-6.9 2.1v-2.2l6.9-4.1V5.2c0-1.5.6-2.6 1.5-2.6Z" />
  ),

  /* ---- Compliance and closing ------------------------------------------ */

  /* A padlock — ITAR / export control. */
  lock: (
    <>
      <rect x="4.6" y="10.4" width="14.8" height="10.2" rx="2.2" />
      <path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.6 0v2.6" />
      <path d="M12 14.4v2.4" />
    </>
  ),

  /* A document trail — traceability back to source. */
  trace: (
    <>
      <path d="M7.4 3.6h6.2l3.6 3.6v9.4a1.8 1.8 0 0 1-1.8 1.8H7.4a1.8 1.8 0 0 1-1.8-1.8V5.4a1.8 1.8 0 0 1 1.8-1.8Z" />
      <path d="M13.2 3.6v3.8h3.8" />
      <path d="M8.8 11.4h6M8.8 14.4h4" />
    </>
  ),

  /* A ring binder of standards — the quality system. */
  standard: (
    <>
      <circle cx="12" cy="9.4" r="5.4" />
      <path d="M9 14.2 8 21l4-2.2L16 21l-1-6.8" />
    </>
  ),

  /* A closed loop of arrows — a certified management SYSTEM rather than a single
     mark. Exists so AS9120B and ISO 9001 do not carry the same glyph twice in the
     compliance register, which read as a rendering fault. */
  system: (
    <>
      <path d="M5.2 9.4a7.4 7.4 0 0 1 12.4-2.6l1.8 1.8" />
      <path d="M18.8 14.6a7.4 7.4 0 0 1-12.4 2.6l-1.8-1.8" />
      <path d="M19.8 4.6v4.4h-4.4M4.2 19.4V15h4.4" />
    </>
  ),

  /* A globe with a tick — export screening, which is about where a part may go. */
  globe: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M3.8 12h16.4M12 3.6c2.2 2.4 3.4 5.3 3.4 8.4S14.2 18 12 20.4c-2.2-2.4-3.4-5.3-3.4-8.4S9.8 6 12 3.6Z" />
    </>
  ),

  /* A tick, drawn heavier — used inside checklists. */
  check: <path d="M4.6 12.4 9.4 17.2 19.4 6.8" />,

  /* An exclamation in a circle — the caution line on each route slab. A tick was
     doing that job, which said "confirmed" above a sentence that says "do not". */
  alert: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.6v5.2M12 16.2v.2" />
    </>
  ),

  /* An arrow — the closing actions. */
  arrow: (
    <>
      <path d="M4 12h15.4" />
      <path d="M14.4 6.8 19.6 12l-5.2 5.2" />
    </>
  ),

  /* A diagonal arrow, down and to the right — the hero's accent badge, which sends
     the reader down into the page rather than off it. Diagonal rather than straight
     down because the badge sits on the portrait's top-left corner and the stroke
     reads as pointing into the composition, which is what the reference does with
     the same mark. */
  "arrow-br": (
    <>
      <path d="M7.4 7.4 16.6 16.6" />
      <path d="M16.6 9.6v7h-7" />
    </>
  ),

  /* A straight arrow down — the node sitting on the hero's connector thread. It is
     the same "keep going" gesture as `arrow-br` at a smaller size, and a diagonal
     at 14px reads as a scribble. */
  "arrow-down": (
    <>
      <path d="M12 4.6v14.8" />
      <path d="M6.8 14.2 12 19.4l5.2-5.2" />
    </>
  ),
};

export function ContactIcon({ name }: { name: string }) {
  /* A missing slug renders nothing rather than an empty box, so a mistyped or
     newly added name loses its mark and keeps its layout. */
  const glyph = GLYPHS[name];
  if (!glyph) return null;
  return (
    <svg
      className="c-glyph"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}

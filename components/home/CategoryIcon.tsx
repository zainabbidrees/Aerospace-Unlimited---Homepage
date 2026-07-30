/* One monoline glyph per part category, keyed by the category's own slug.

   Same drawing convention as the four feature points on the homepage: a 24×24
   box, no fill, 1.5 stroke, round caps and joins. That is the site's only icon
   idiom and these have to sit in it — a second style would read as a second
   design system.

   Every glyph is the part itself, drawn the way the trade draws it: a hex nut,
   a ball race, a mating connector pair, an O-ring, the ISO valve bowtie and
   pump circle-and-triangle, a toggle, a cylinder with its rod out, a dial, a
   strut and wheel, a funnel, broadcast arcs. Nothing here is decoration
   standing in for a category — a buyer scanning the bento should be able to
   name the cell before reading it.

   No content is added by any of this. The twelve categories, their names, FSC
   codes and counts are unchanged; the glyph is a second way to read the label
   that is already there. Hence aria-hidden — a screen reader gets the name,
   not a description of a drawing of it. */

const GLYPHS: Record<string, React.ReactNode> = {
  /* Hex nut, face on. */
  fasteners: (
    <>
      <path d="M12 3.2 19.6 7.6v8.8L12 20.8 4.4 16.4V7.6Z" />
      <circle cx="12" cy="12" r="3.1" />
    </>
  ),

  /* Ball race: outer land, inner land, four balls in the gap. The balls have to
     clear BOTH lands with daylight — drawn any larger they bridge the gap and
     the whole thing resolves into a life ring. */
  bearings: (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="7.5" cy="7.5" r="1.35" />
      <circle cx="16.5" cy="7.5" r="1.35" />
      <circle cx="16.5" cy="16.5" r="1.35" />
      <circle cx="7.5" cy="16.5" r="1.35" />
    </>
  ),

  /* Plug and socket with three pins bridging them. */
  electrical: (
    <>
      <path d="M2.6 8.2A1.6 1.6 0 0 1 4.2 6.6h4.4v10.8H4.2a1.6 1.6 0 0 1-1.6-1.6Z" />
      <path d="M21.4 8.2a1.6 1.6 0 0 0-1.6-1.6h-4.4v10.8h4.4a1.6 1.6 0 0 0 1.6-1.6Z" />
      <path d="M8.6 9.2h6.8M8.6 12h6.8M8.6 14.8h6.8" />
    </>
  ),

  /* O-ring: section through a torus, nothing inside it. */
  seals: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <circle cx="12" cy="12" r="5.2" />
    </>
  ),

  /* The ISO valve: two cones on a common seat, stem and handwheel above. */
  valves: (
    <>
      <path d="M4 9.4v9.2L12 14Zm16 0v9.2L12 14Z" />
      <path d="M12 14V7.4" />
      <path d="M8.2 5.6h7.6" />
    </>
  ),

  /* The ISO pump: circle with the impeller triangle, piped in and out. The
     pipes are not decoration — circle-plus-triangle on its own is the universal
     play button, and it read as one until the flow was drawn through it. */
  pumps: (
    <>
      <circle cx="12" cy="12" r="7.2" />
      <path d="M9.6 8.2v7.6L15.8 12Z" />
      <path d="M1.8 12h3M19.2 12h3" />
    </>
  ),

  /* Toggle, shown open — the lever off its seat is what makes it a switch. */
  switches: (
    <>
      <circle cx="4.6" cy="16.6" r="1.7" />
      <circle cx="19.4" cy="16.6" r="1.7" />
      <path d="M6 15.4 17.4 8.2" />
      <path d="M19.4 14.9V12" />
    </>
  ),

  /* Cylinder with the piston inside, the rod extended, and a rod-end bearing on
     the tip. The bearing eye is doing real work: body-plus-stub alone read as a
     camera at 21px. */
  hydraulics: (
    <>
      <rect x="2.4" y="7.8" width="11.6" height="8.4" rx="1.8" />
      <path d="M10.6 7.8v8.4" />
      <path d="M14 12h4" />
      <circle cx="19.8" cy="12" r="1.9" />
    </>
  ),

  /* Dial with a needle and two graduation ticks. */
  instruments: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M12 12 16.4 8.4" />
      <path d="M12 3.2v2.2M20.8 12h-2.2M12 20.8v-2.2M3.2 12h2.2" />
      <circle cx="12" cy="12" r="1.1" />
    </>
  ),

  /* Oleo strut on its trunnion, drag brace, wheel. The hub is what makes the
     bottom circle a wheel; without it the glyph reads as a lollipop. */
  "landing-gear": (
    <>
      <path d="M8.4 3.4h7.2" />
      <path d="M12 3.4v8.8" />
      <path d="M12 7.4 16.6 3.4" />
      <circle cx="12" cy="16.4" r="4.2" />
      <circle cx="12" cy="16.4" r="1.2" />
    </>
  ),

  /* Funnel — flow narrowed through an element. */
  filters: (
    <>
      <path d="M3.2 5.4h17.6l-6.6 7.6v5.8l-4.4 2.2V13Z" />
    </>
  ),

  /* Broadcast arcs off a single source. */
  avionics: (
    <>
      <circle cx="12" cy="12" r="1.6" />
      <path d="M15.2 8.7a4.6 4.6 0 0 1 0 6.6" />
      <path d="M8.8 15.3a4.6 4.6 0 0 1 0-6.6" />
      <path d="M18.1 5.9a8.7 8.7 0 0 1 0 12.2" />
      <path d="M5.9 18.1a8.7 8.7 0 0 1 0-12.2" />
    </>
  ),
};

export function CategoryIcon({ slug }: { slug: string }) {
  const glyph = GLYPHS[slug];
  /* A missing slug renders nothing rather than an empty box. If a category is
     ever added to lib/data.ts without a glyph here, the tile loses its mark
     and keeps its layout — it does not ship a blank chip. */
  if (!glyph) return null;
  return (
    <span className="cat-icon" aria-hidden="true">
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

/* The same glyph again, very large and very faint, cropped by the right edge of
   the tile. Only the two lead cells get it, and only because they have the room:
   a half-width cell holds a name, a 320px bar and a footer across 830px, and the
   right two thirds of it were empty air. Filling that with more words would mean
   inventing copy the site does not have; filling it with the mark already on the
   tile costs nothing and is the same information at another size.

   Stroke is 0.5, not 1.5 — the box scales up roughly tenfold and a 1.5 stroke
   comes out as a 15px slab. At 0.5 it lands near 5px, which is what makes this
   read as embossed texture rather than a second, enormous icon. */
export function CategoryWatermark({ slug }: { slug: string }) {
  const glyph = GLYPHS[slug];
  if (!glyph) return null;
  return (
    <svg
      className="cat-watermark"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}

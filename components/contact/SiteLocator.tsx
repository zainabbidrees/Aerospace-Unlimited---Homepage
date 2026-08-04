import { LocatorCursor } from "./LocatorCursor";
import { LocatorZoom } from "./LocatorZoom";

/* ==========================================================================
   THE SITE LOCATOR — an approach plate for one address, that descends as you
   scroll.

   WHY NOT A MAP. This replaced the headquarters photograph at the client's
   direction ("a mapping animation that zooms in"). It draws NO STREETS, and
   that is the whole design constraint rather than a shortcut: this project
   carries no map dependency and no tile key, and inventing a street grid for a
   real address would put fiction on the one panel whose job is to tell a buyer
   where to send a part. So it asserts nothing it cannot back:

     · range rings at declared radii — 20 km, 5 km, 1 km, 200 m, 50 m
     · a graticule whose cells are declared in metres, subdividing as it descends
     · a scale bar that reads the diagram's own scale, which is true by
       construction because the geometry below is defined in metres
     · the city, state and ZIP the page already states

   The one external fact is the coordinate readout: 33.8149° N, 117.8814° W is
   the house-level geocode of 1341 South Sunkist Street, Anaheim CA 92806 — the
   address this site publishes in Direct details, in the copy control on this
   very plate, and in its Directions link. Verified against OpenStreetMap's
   Nominatim on 2026-08-04, which returned an exact `house` match. No OSM
   geometry is used or reproduced here, so nothing is attributable.

   (Worth knowing: the photograph this replaces had a documented conflict — the
   facade plaque in it reads "1341 S. Sinclaire St." while the page states
   "1341 South Sunkist Street". Both are real Anaheim 92806 addresses about a
   kilometre apart. Removing the photograph removes the visible contradiction,
   and this plate is pinned to the address the site actually publishes; the
   underlying question is still the client's to settle.)

   WHY AN APPROACH PLATE and not a street map look: this is an aerospace parts
   distributor, and range rings, bearings and a scale bar are the drafting
   language of the business. The site's blueprint lattice already exists on its
   accent bands — this is that device doing real work rather than decoration,
   which is also the one use a grid overlay is legitimately for.

   MOTION-SAFE, by the same construction as CountTally. THE REST STATE IS THE
   ARRIVED STATE: every custom property falls back to its closest-zoom value, so
   with no JS, under reduced motion, or in the screenshot renderer this is a
   finished locator at site scale with the crosshair locked — never an empty
   panel. The scroll only ever plays the approach INTO that state. See
   au-motion-safety.
   ========================================================================== */

/* The diagram is defined in metres, centred on the site at (0,0). HALF is the
   viewBox half-extent, so at zoom 1 the panel's long edge spans 2 × HALF metres
   — 500 m across, the arrival scale. */
const HALF = 250;

/* Graticule tiers. Each is a real cell size in metres and a span far enough to
   cover the widest zoom it is visible at; only one or two are ever on at once,
   which is how a map trades detail for extent. */
/* Each span must still cover the viewport at the zoom where its tier reaches
   FULL opacity, or the grid's own edge shows in the corners. The fine tier is
   fully on from progress 0.88, where the visible half-extent is 435 m — hence
   700 and not the 350 that "50 m cells, 500 m arrival" would suggest. */
const TIERS = [
  { key: "a", cell: 5000, span: 30000 },
  { key: "b", cell: 500, span: 3500 },
  { key: "c", cell: 50, span: 700 },
] as const;

/* Range rings, grouped onto the same three tiers. A ring too LARGE for the
   panel simply clips, so only the too-small case needs hiding — which is what
   the tier fade already does. */
const RINGS: Record<string, number[]> = { a: [20000, 5000], b: [1000, 200], c: [50] };

/* A tier's grid as one path: every vertical then every horizontal line. */
function grid(cell: number, span: number) {
  const d: string[] = [];
  for (let v = -span; v <= span; v += cell) {
    d.push(`M${v} ${-span}V${span}`);
    d.push(`M${-span} ${v}H${span}`);
  }
  return d.join("");
}

export function SiteLocator() {
  return (
    <div className="loc" data-loc>
      <svg
        className="loc-plate"
        viewBox={`${-HALF} ${-HALF} ${HALF * 2} ${HALF * 2}`}
        /* `slice` is SVG's `cover`: the square fills the panel and the short
           axis crops, so the rings stay circular at every panel ratio. */
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Schematic locator diagram centred on the Anaheim, California site, with range rings and a scale bar."
      >
        {/* THE FIELD scales; everything in it carries a non-scaling stroke, so a
            hairline stays a hairline across a 100× descent. */}
        <g className="loc-field">
          {TIERS.map((t) => (
            <g className="loc-tier" data-tier={t.key} key={t.key}>
              <path className="loc-grid" d={grid(t.cell, t.span)} vectorEffect="non-scaling-stroke" />
              {RINGS[t.key].map((r) => (
                <circle className="loc-ring" cx="0" cy="0" r={r} key={r} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
          ))}
        </g>

        {/* THE MARK does not scale — it is the instrument, not the terrain. It
            resolves from a dot to a locked crosshair as the plate descends. */}
        <g className="loc-mark">
          <circle className="loc-mark-ring" cx="0" cy="0" r="26" vectorEffect="non-scaling-stroke" />
          <path
            className="loc-mark-cross"
            d="M0 -44V-12M0 12V44M-44 0H-12M12 0H44"
            vectorEffect="non-scaling-stroke"
          />
          <circle className="loc-mark-dot" cx="0" cy="0" r="5" />
        </g>

        <defs>
          {/* The reticle's glow. Two inner stops before the falloff so it reads as
              a soft pool rather than a hard-edged disc — a single stop to
              transparent shows its own circumference as a ring. */}
          <radialGradient id="loc-cursor-glow">
            <stop offset="0%" stopColor="rgb(169, 200, 240)" stopOpacity="0.30" />
            <stop offset="38%" stopColor="rgb(169, 200, 240)" stopOpacity="0.13" />
            <stop offset="100%" stopColor="rgb(169, 200, 240)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* THE TRACKING RETICLE. Drawn after the site mark so it passes over it,
            and unscaled for the same reason the mark is: it is the instrument.
            Larger and fainter than the mark, and with a gap at the centre, so the
            two never read as the same object. Position and presence both come from
            LocatorCursor — see the .loc-cursor block in ux.css for why the site
            mark itself does not move. */}
        <g className="loc-cursor" aria-hidden="true">
          <circle className="loc-cursor-glow" cx="0" cy="0" r="120" />
          <circle className="loc-cursor-ring" cx="0" cy="0" r="34" vectorEffect="non-scaling-stroke" />
          <path
            className="loc-cursor-cross"
            d="M0 -56V-24M0 24V56M-56 0H-24M24 0H56"
            vectorEffect="non-scaling-stroke"
          />
          <circle className="loc-cursor-dot" cx="0" cy="0" r="2.5" />
        </g>
      </svg>

      {/* ---- The instrument overlay. Crisp at every zoom, because none of it
              lives inside the scaled field. ---- */}
      <div className="loc-readout" aria-hidden="true">
        <span className="loc-readout-k">Site</span>
        <span className="loc-readout-v">Anaheim, CA 92806</span>
        <span className="loc-readout-c">33.8149° N · 117.8814° W</span>
        {/* The reticle's range from the site. Rendered always so the block holds
            its height, and empty until a pointer is actually tracking — at rest
            there is no reticle, so there is no distance to state. */}
        <span className="loc-readout-r" data-loc-range />
      </div>

      <div className="loc-north" aria-hidden="true">
        <svg viewBox="0 0 24 34" className="loc-north-glyph">
          <path d="M12 2 L17 13 H12 Z" className="loc-north-fill" />
          <path d="M12 2 L7 13 H12 Z" className="loc-north-hollow" />
          <path d="M12 13 V30" vectorEffect="non-scaling-stroke" className="loc-north-stem" />
        </svg>
        <span className="loc-north-k">N</span>
      </div>

      {/* The scale bar. Its label is the one thing the driver rewrites as text,
          and the value it settles on — 50 m — is what the markup already says,
          so a dead frame leaves a true reading rather than a blank one. */}
      <div className="loc-scale" aria-hidden="true">
        <span className="loc-scale-bar">
          <span className="loc-scale-tick" />
          <span className="loc-scale-tick" />
        </span>
        <span className="loc-scale-v" data-loc-scale>
          50 m
        </span>
      </div>

      {/* Drives the descent off one scroll-linked progress value. Renders
          nothing. */}
      <LocatorZoom />
      {/* Tracks the pointer with the reticle and reports its range. Renders
          nothing, and never arms on touch or under reduced motion. */}
      <LocatorCursor />
    </div>
  );
}

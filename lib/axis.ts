/* ==========================================================================
   Catalog axes — one resolver for every "list of parts filtered by X" page.

   FIVE AXES, ONE RESOLVER, because they are one page: a filtered view of the
   same part rows with a different sentence at the top and a different breadcrumb.
   Each flat lookup route (/manufacturers/<cage>, /fscs/<code>, /part-types/<slug>,
   /niin/<niin>, /aircraft/<slug>) resolves its axis here and hands it to
   <ResultsView>, so the results layout, the filter behaviour and the empty state
   live in exactly one place.

   These map 1:1 onto the live site's separate lookup pages:

     category    ← live /part-types/       → /part-types/<slug>
     manufacturer← live /manufacturers/     → /manufacturers/<cage>
     platform    ← live "Parts by Aircraft" → /aircraft/<slug>
     fsc         ← live /fscs/              → /fscs/<code>
     niin        ← live /niin-parts-inner/  → /niin/<niin>

   NOTHING IS INVENTED. Titles, counts and definitions come from lib/data.ts and
   from the numbering-system facts. See au-no-invented-content.
   ========================================================================== */

import {
  AIRCRAFT,
  CATEGORIES,
  MANUFACTURERS,
  PARTS,
  fscName,
  type Part,
} from "./data";
import type { Crumb } from "@/components/inner/PageMast";

export type AxisKind = "category" | "manufacturer" | "platform" | "fsc" | "niin";

export interface Axis {
  /* What the axis is called in the breadcrumb and the eyebrow. */
  kind: string;
  /* The heading. */
  title: string;
  /* An identifier to set in mono beside the heading, where one exists. */
  code?: string;
  codeLabel?: string;
  lede: string;
  /* The catalogue count this axis claims, which is NOT the number of rows below:
     lib/data.ts is a working sample of sixteen lines against a catalogue of
     hundreds of thousands. Saying so is the difference between a sample and a
     broken page. */
  claimed?: number;
  parts: Part[];
  /* Where "see the rest of this axis" goes, and the breadcrumb trail. */
  backHref: string;
  backLabel: string;
  crumbs: Crumb[];
}

export function resolveAxis(axis: string, id: string): Axis | null {
  const key = decodeURIComponent(id);

  if (axis === "category") {
    const c = CATEGORIES.find((x) => x.slug === key);
    if (!c) return null;
    return {
      kind: "Part type",
      title: c.name,
      code: c.fsc,
      codeLabel: "FSC",
      lede: `Grouped by what the part does. Everything in this type shares Federal Supply Class ${c.fsc}, which is the first four digits of its NSN.`,
      claimed: c.count,
      parts: PARTS.filter((p) => p.category === c.slug),
      backHref: "/part-types",
      backLabel: "All part types",
      crumbs: [
        { href: "/", label: "Home" },
        { href: "/part-types", label: "Part Types" },
        { label: c.name },
      ],
    };
  }

  if (axis === "manufacturer") {
    const m = MANUFACTURERS.find((x) => x.cage.toUpperCase() === key.toUpperCase());
    if (!m) return null;
    return {
      kind: "Manufacturer",
      title: m.name,
      code: m.cage,
      codeLabel: "CAGE",
      lede: `Parts we hold against this entity. The CAGE code is the reliable half of the pair — confirm it against the nameplate rather than the brand on the box.`,
      claimed: m.count,
      parts: PARTS.filter((p) => p.mfr === m.name),
      backHref: "/manufacturers",
      backLabel: "Manufacturers A–Z",
      crumbs: [
        { href: "/", label: "Home" },
        { href: "/manufacturers", label: "Manufacturers" },
        { label: m.cage },
      ],
    };
  }

  if (axis === "platform") {
    const a = AIRCRAFT.find((x) => x.slug === key);
    if (!a) return null;
    return {
      kind: "Aircraft platform",
      title: a.name,
      lede: `Parts listed against this platform. Confirm applicability against the illustrated parts catalogue for your series and effectivity — a number that fits one block does not always fit the next.`,
      claimed: a.count,
      parts: PARTS.filter((p) => p.aircraft.includes(a.slug)),
      backHref: "/aircraft",
      backLabel: "All platforms",
      crumbs: [
        { href: "/", label: "Home" },
        { href: "/aircraft", label: "By aircraft" },
        { label: a.name },
      ],
    };
  }

  if (axis === "fsc") {
    if (!/^\d{4}$/.test(key)) return null;
    const parts = PARTS.filter((p) => p.fsc === key);
    /* Prefer the FSC register's own name, then a category that names it, so the
       page can say what the class actually covers instead of only printing the
       digits. */
    const named = fscName(key) ?? CATEGORIES.find((c) => c.fsc === key)?.name;
    const claimed = CATEGORIES.find((c) => c.fsc === key)?.count;
    return {
      kind: "Federal Supply Class",
      title: named ?? `Federal Supply Class ${key}`,
      code: key,
      codeLabel: "FSC",
      lede: `Every NSN beginning ${key} belongs to this class. It is the widest of the government identifiers — it says what kind of item you are looking at, not which item.`,
      claimed,
      parts,
      backHref: "/fscs",
      backLabel: "All supply classes",
      crumbs: [
        { href: "/", label: "Home" },
        { href: "/fscs", label: "FSCs" },
        { label: key },
      ],
    };
  }

  if (axis === "niin") {
    const digits = key.replace(/\D/g, "");
    if (digits.length !== 9) return null;
    const parts = PARTS.filter((p) => p.niin === digits);
    return {
      kind: "National Item Identification Number",
      title: parts[0]?.desc ?? `NIIN ${digits}`,
      code: digits,
      codeLabel: "NIIN",
      lede: `A NIIN identifies one item, so this is a single line rather than a list. Its NSN is the same nine digits with the Federal Supply Class in front.`,
      parts,
      backHref: "/niin",
      backLabel: "NIIN lookup",
      crumbs: [
        { href: "/", label: "Home" },
        { href: "/niin", label: "NIIN" },
        { label: digits },
      ],
    };
  }

  return null;
}

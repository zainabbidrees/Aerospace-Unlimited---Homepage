/* ==========================================================================
   Search suggestions — the grouped answer behind the single field.

   The field is the site's front door: a buyer holds ONE of six identifiers, or
   a half-remembered part name, and every second on a wrong page is lost time. So
   the dropdown answers in the buyer's own terms, grouped by what the site can
   actually take them to — a part record, a manufacturer's inventory, a category,
   an aircraft platform, or a pre-seeded quote when the name is all they have.

   PREFIX BEFORE SUBSTRING, always. Someone typing "hon" means Honeywell before
   they mean a part whose description merely contains those letters. Ranking a
   start-of-string hit above a mid-string one is the difference between the answer
   landing on the first row and the buyer scanning for it.

   EVERY href RESOLVES. Parts → /part/<pn>, manufacturers → /manufacturers/<cage>,
   categories → /part-types/<slug>, platforms → /aircraft/<slug>, and part-type
   names → a pre-seeded /rfq (the item name is what a buyer holds when they have
   no number, exactly as the live /part-types page treats them). Nothing here
   points at a route that does not exist. See au-no-invented-content.
   ========================================================================== */

import {
  AIRCRAFT,
  CATEGORIES,
  MANUFACTURERS,
  PART_TYPES,
  PARTS,
  type Part,
} from "./data";
import { norm, searchParts } from "./search";

export type SuggestKind = "part" | "mfr" | "category" | "aircraft" | "type";

export interface Suggestion {
  kind: SuggestKind;
  href: string;
  /* The line the buyer reads first — a part number, a company, a category. */
  primary: string;
  /* The supporting line — a description, a CAGE code, an FSC. */
  secondary?: string;
  /* A right-aligned tag — stock state for a part, a catalogue count otherwise. */
  meta?: string;
  /* Carried for parts so the row can render the real stock colour. */
  part?: Part;
}

export interface SuggestGroup {
  kind: SuggestKind;
  label: string;
  items: Suggestion[];
}

/* Rank a text field against the query: exact start beats prefix beats anywhere;
   0 means no match. Punctuation-insensitive, like the rest of search. */
function rank(text: string, q: string): number {
  const t = norm(text);
  if (!t) return 0;
  if (t === q) return 3;
  if (t.startsWith(q)) return 2;
  if (t.includes(q)) return 1;
  return 0;
}

const nf = new Intl.NumberFormat("en-US");

export function suggest(
  query: string,
  caps: Partial<Record<SuggestKind, number>> = {}
): SuggestGroup[] {
  const q = norm(query);
  if (!q) return [];

  const cap = { part: 6, mfr: 3, category: 3, aircraft: 2, type: 4, ...caps };
  const groups: SuggestGroup[] = [];

  /* Parts ride the existing scorer — it already handles pn / nsn / niin / cage /
     fsc / description and stock weighting, which is exactly the ranking a part
     row wants. */
  const parts = searchParts(query, cap.part);
  if (parts.length) {
    groups.push({
      kind: "part",
      label: "Parts",
      items: parts.map((p) => ({
        kind: "part",
        href: `/part/${encodeURIComponent(p.pn)}`,
        primary: p.pn,
        secondary: p.desc,
        part: p,
      })),
    });
  }

  const mfrs = MANUFACTURERS.map((m) => ({ m, r: Math.max(rank(m.name, q), rank(m.cage, q)) }))
    .filter((x) => x.r > 0)
    .sort((a, b) => b.r - a.r || b.m.count - a.m.count)
    .slice(0, cap.mfr);
  if (mfrs.length) {
    groups.push({
      kind: "mfr",
      label: "Manufacturers",
      items: mfrs.map(({ m }) => ({
        kind: "mfr",
        href: `/manufacturers/${encodeURIComponent(m.cage)}`,
        primary: m.name,
        secondary: `CAGE ${m.cage}`,
        meta: `${nf.format(m.count)} parts`,
      })),
    });
  }

  const cats = CATEGORIES.map((c) => ({ c, r: Math.max(rank(c.name, q), rank(c.fsc, q)) }))
    .filter((x) => x.r > 0)
    .sort((a, b) => b.r - a.r || b.c.count - a.c.count)
    .slice(0, cap.category);
  if (cats.length) {
    groups.push({
      kind: "category",
      label: "Categories",
      items: cats.map(({ c }) => ({
        kind: "category",
        href: `/part-types/${encodeURIComponent(c.slug)}`,
        primary: c.name,
        secondary: `FSC ${c.fsc}`,
        meta: `${nf.format(c.count)} parts`,
      })),
    });
  }

  const acft = AIRCRAFT.map((a) => ({ a, r: rank(a.name, q) }))
    .filter((x) => x.r > 0)
    .sort((a, b) => b.r - a.r || b.a.count - a.a.count)
    .slice(0, cap.aircraft);
  if (acft.length) {
    groups.push({
      kind: "aircraft",
      label: "Aircraft & platforms",
      items: acft.map(({ a }) => ({
        kind: "aircraft",
        href: `/aircraft/${encodeURIComponent(a.slug)}`,
        primary: a.name,
        meta: `${nf.format(a.count)} parts`,
      })),
    });
  }

  /* Part-type NAMES — "Valve, Check", "Nut, Self-Locking". What a buyer holds
     when they have the item but not a number. Prefix-ranked and routed to a
     pre-seeded quote, the live site's own behaviour for this list. */
  const types = PART_TYPES.map((name) => ({ name, r: rank(name, q) }))
    .filter((x) => x.r > 0)
    .sort((a, b) => b.r - a.r || a.name.localeCompare(b.name))
    .slice(0, cap.type);
  if (types.length) {
    groups.push({
      kind: "type",
      label: "Part types",
      items: types.map(({ name }) => ({
        kind: "type",
        href: `/rfq?q=${encodeURIComponent(name)}`,
        primary: name,
      })),
    });
  }

  return groups;
}

/* ---- Empty-state content (shown the moment the field is focused) ---------- */

/* "Popular" without analytics is a claim we cannot make honestly, so this is
   what we CAN stand behind: the deepest in-stock lines, most-stocked first —
   the parts most likely to ship today. Deterministic, derived from the data. */
export const POPULAR_PARTS: Part[] = PARTS.filter((p) => p.stock === "in")
  .sort((a, b) => b.qty - a.qty)
  .slice(0, 5);

/* The catalogue's own top axes, for "browse instead of search". */
export const BROWSE_CATEGORIES = CATEGORIES.slice()
  .sort((a, b) => b.count - a.count)
  .slice(0, 6);

export const TOP_MANUFACTURERS = MANUFACTURERS.slice()
  .sort((a, b) => b.count - a.count)
  .slice(0, 5);

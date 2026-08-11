/* ==========================================================================
   RFQ deep-linking — one place that builds /rfq URLs and resolves the context
   params back to catalog rows.

   Every "request a quote" affordance added across the site routes through
   `rfqHref`, so the query-param surface the form has to understand stays in one
   list rather than being reinvented per call site. `partsForContext` is the
   read side: given an entity context (a platform, an OEM, a category, an NSN),
   it returns the matching sample rows so the RFQ can arrive pre-seeded. When the
   sample holds no match, the caller falls back to the `for` label as a plain
   note — honest context, never a fabricated part line. See au-no-invented-content.
   ========================================================================== */

import { PARTS, type Part } from "./data";

export interface RfqContext {
  /* Existing, part-level. */
  pn?: string;
  q?: string;
  mode?: string;
  /* Entity context, resolved against PARTS below. */
  aircraft?: string; // platform slug
  cage?: string; // manufacturer CAGE
  category?: string; // category slug
  fsc?: string; // Federal Supply Class
  nsn?: string;
  niin?: string;
  /* A human label for the thing being quoted, e.g. "Boeing 737 (all series)".
     Drives the form's title and — when nothing else matches — its notes. */
  for?: string;
}

/* Order is fixed so the same context always produces the same URL. */
export function rfqHref(opts: RfqContext = {}): string {
  const p = new URLSearchParams();
  const keys: (keyof RfqContext)[] = [
    "pn",
    "q",
    "mode",
    "aircraft",
    "cage",
    "category",
    "fsc",
    "nsn",
    "niin",
    "for",
  ];
  for (const k of keys) {
    const v = opts[k];
    if (v) p.set(k, v);
  }
  const qs = p.toString();
  return qs ? `/rfq?${qs}` : "/rfq";
}

const strip = (s: string) => s.toUpperCase().replace(/[\s\-_./]/g, "");

/* The catalog rows an entity context points at, most specific first. Empty when
   the sample carries no match — the caller then leans on the `for` note. */
export function partsForContext(ctx: RfqContext): Part[] {
  if (ctx.nsn) {
    const t = strip(ctx.nsn);
    return PARTS.filter((p) => strip(p.nsn) === t);
  }
  if (ctx.niin) {
    const t = strip(ctx.niin);
    return PARTS.filter((p) => strip(p.niin) === t);
  }
  if (ctx.aircraft) return PARTS.filter((p) => p.aircraft.includes(ctx.aircraft!));
  if (ctx.cage) {
    const t = ctx.cage.toUpperCase();
    return PARTS.filter((p) => p.cage.toUpperCase() === t);
  }
  if (ctx.category) return PARTS.filter((p) => p.category === ctx.category);
  if (ctx.fsc) return PARTS.filter((p) => p.fsc === ctx.fsc);
  return [];
}

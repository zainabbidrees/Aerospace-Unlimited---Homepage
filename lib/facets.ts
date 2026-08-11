import type { FacetSpec } from "@/components/browse/FacetFilter";
import { STOCK_LABEL } from "./stock";
import { CATEGORIES, type Part } from "./data";

/* Shared facet specs for the product tables' FacetFilter, so every product page
   offers the same dimensions with the same copy. A facet is auto-pruned by
   FacetFilter when the rows on a given page hold fewer than two distinct values
   for it, so a page can pass the whole set and only the useful ones appear. */

export const AVAILABILITY: FacetSpec = {
  key: "stock",
  label: "Availability",
  order: ["in", "limited", "quote"],
  labels: STOCK_LABEL,
  dot: true,
};

export const MANUFACTURER: FacetSpec = { key: "mfr", label: "Manufacturer" };

export const PART_TYPE: FacetSpec = { key: "cat", label: "Part type" };

const CAT = new Map(CATEGORIES.map((c) => [c.slug, c.name]));
export const catName = (slug: string) => CAT.get(slug) ?? slug;

/* The lowercased keyword haystack for a part row. */
export const partTerms = (p: Part) =>
  `${p.pn} ${p.desc} ${p.mfr} ${p.nsn} ${p.niin} ${p.cage}`.toLowerCase();

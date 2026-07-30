/* ==========================================================================
   Identifier detection

   A buyer holds ONE of six identifiers and rarely knows what the industry
   calls it. The old site made them pick the right nav item first. Here the
   single field works it out and says so, out loud, as they type — which
   also quietly teaches the vocabulary.
   ========================================================================== */

import { MANUFACTURERS } from "./data";

export type IdentifierKind = "NSN" | "NIIN" | "FSC" | "CAGE" | "MFR" | "PN" | "KEYWORD";

export interface Identifier {
  kind: IdentifierKind;
  label: string;
  normalized: string;
}

export function formatNSN(d: string): string {
  return d.length === 13
    ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 9)}-${d.slice(9)}`
    : d;
}

export function detectIdentifier(raw: string): Identifier | null {
  const q = (raw || "").trim();
  if (!q) return null;
  const digits = q.replace(/[^0-9]/g, "");
  const compact = q.replace(/[\s-]/g, "").toUpperCase();

  if (/^\d{4}-?\d{2}-?\d{3}-?\d{4}$/.test(q.replace(/\s/g, "")) || digits.length === 13) {
    return { kind: "NSN", label: "National Stock Number", normalized: formatNSN(digits) };
  }
  if (/^\d{9}$/.test(compact)) {
    return { kind: "NIIN", label: "National Item Identification Number", normalized: compact };
  }
  if (/^\d{4}$/.test(compact)) {
    return { kind: "FSC", label: "Federal Supply Class", normalized: compact };
  }
  // A CAGE code is 5 alphanumeric characters and always contains at least one
  // digit. Without the digit test, ordinary five-letter words like "valve"
  // and "pumps" get announced as CAGE codes, which makes the whole detection
  // feature look broken at exactly the moment it is meant to build trust.
  if (/^[A-Z0-9]{5}$/.test(compact) && /[0-9]/.test(compact)) {
    return { kind: "CAGE", label: "CAGE code", normalized: compact };
  }
  const mfr = MANUFACTURERS.find(
    (m) => m.name.toLowerCase().includes(q.toLowerCase()) && q.length >= 3
  );
  if (mfr) return { kind: "MFR", label: "Manufacturer", normalized: mfr.name };
  if (/[A-Z]/i.test(q) && /\d/.test(q)) {
    return { kind: "PN", label: "Part number", normalized: q.toUpperCase() };
  }
  return { kind: "KEYWORD", label: "Description keyword", normalized: q };
}

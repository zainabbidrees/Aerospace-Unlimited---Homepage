/* ==========================================================================
   Search

   Ranked, forgiving, and punctuation-insensitive. A buyer typing
   "MS21042-L3" must find "MS21042L3" — dash conventions vary by paperwork
   and a literal match would strand them on a zero-result page.
   ========================================================================== */

import { PARTS, type Part } from "./data";

export const norm = (s: string | undefined | null): string =>
  String(s ?? "").toUpperCase().replace(/[\s\-_./]/g, "");

export function searchParts(query: string, limit?: number): Part[] {
  const q = norm(query);
  if (!q) return [];
  const scored: { part: Part; score: number }[] = [];

  PARTS.forEach((p) => {
    const pn = norm(p.pn);
    let score = 0;
    if (pn === q) score = 100;
    else if (pn.startsWith(q)) score = 80;
    else if (pn.includes(q)) score = 60;
    else if (norm(p.nsn) === q || norm(p.nsn).includes(q)) score = 70;
    else if (norm(p.niin).includes(q)) score = 68;
    else if (norm(p.cage) === q) score = 55;
    else if (norm(p.fsc) === q) score = 50;
    else if (norm(p.mfr).includes(q)) score = 40;
    else if (norm(p.desc).includes(q)) score = 30;
    else {
      // Every word must appear somewhere — handles "fuel pump", "check valve".
      const words = String(query).trim().toUpperCase().split(/\s+/).filter(Boolean);
      const hay = `${p.desc} ${p.mfr} ${p.pn}`.toUpperCase();
      if (words.length > 1 && words.every((w) => hay.includes(w))) score = 25;
    }
    if (score) {
      // In-stock ranks above quote-only. A buyer under time pressure should
      // see what can actually ship first.
      if (p.stock === "in") score += 4;
      else if (p.stock === "limited") score += 2;
      scored.push({ part: p, score });
    }
  });

  scored.sort((a, b) => b.score - a.score || a.part.pn.localeCompare(b.part.pn));
  return (limit ? scored.slice(0, limit) : scored).map((s) => s.part);
}

/* The prototype's `highlight()` returned an HTML string with <mark> in it.
   Returning segments instead keeps the match logic identical but lets the
   caller render React nodes — so nothing on the site needs
   dangerouslySetInnerHTML to show a search hit. */
export interface Segment {
  text: string;
  mark: boolean;
}

export function highlightSegments(text: string, query: string): Segment[] {
  const whole = [{ text, mark: false }];
  const q = String(query || "").trim();
  if (!q) return whole;
  const i = norm(text).indexOf(norm(q));
  if (i < 0) return whole;

  // Map the normalized index back onto the original string.
  let seen = 0;
  let start = -1;
  let end = -1;
  for (let c = 0; c < text.length; c++) {
    if (!/[\s\-_./]/.test(text[c])) {
      if (seen === i && start < 0) start = c;
      seen++;
      if (seen === i + norm(q).length) {
        end = c + 1;
        break;
      }
    }
  }
  if (start < 0 || end < 0) return whole;

  return [
    { text: text.slice(0, start), mark: false },
    { text: text.slice(start, end), mark: true },
    { text: text.slice(end), mark: false },
  ].filter((s) => s.text.length > 0);
}

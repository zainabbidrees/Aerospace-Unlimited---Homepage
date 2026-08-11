/* ==========================================================================
   Recent searches — a small, honest memory of what this buyer typed.

   No backend and no account in this phase, so recents live in localStorage on
   the buyer's own device. They are search TERMS, not results: picking one refills
   the field and re-runs it, which is what "recent search" means to a buyer
   working the same handful of part numbers across a week.

   Everything here is guarded for the server render — the module is imported by a
   client component, but its functions only ever touch `window`/`localStorage`
   inside event handlers and effects, never during render.
   ========================================================================== */

const KEY = "au:recent-searches";
const MAX = 6;

export function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.filter((s) => typeof s === "string").slice(0, MAX) : [];
  } catch {
    /* Private mode, quota, or corrupt JSON — recents are a convenience, never a
       dependency, so a failure is silent and the panel simply omits the section. */
    return [];
  }
}

export function addRecent(term: string): string[] {
  const t = term.trim();
  if (typeof window === "undefined" || t.length < 2) return getRecent();
  try {
    /* Case-insensitive dedupe, newest first, capped. Re-searching an existing
       term moves it to the top rather than stacking a duplicate. */
    const existing = getRecent().filter((s) => s.toLowerCase() !== t.toLowerCase());
    const next = [t, ...existing].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return getRecent();
  }
}

export function clearRecent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* Nothing to recover — the caller resets its own state regardless. */
  }
}

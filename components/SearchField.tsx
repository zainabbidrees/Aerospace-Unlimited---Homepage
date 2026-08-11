"use client";

/* ==========================================================================
   The single search field

   One field, six identifiers, and now a dropdown that answers the moment the
   buyer touches it. Two states, one panel:

   · FOCUSED, EMPTY — recent searches, the parts most likely to ship today, and
     shortcuts to browse by category or manufacturer. A buyer who does not yet
     know what to type is handed the fastest routes instead of a blank box.

   · TYPING — live, grouped matches from the first keystroke: parts,
     manufacturers, categories, aircraft platforms and part-type names, each
     ranked prefix-before-substring so the obvious answer lands on the first row.
     "Quote it anyway" is always the last option, because a perfect result set
     can still miss the part in someone's hand and the catalog is a fraction of
     what can be sourced.

   Everything the dropdown offers points at a route that exists; recent searches
   live on the buyer's own device (see lib/recent). See lib/suggest for the
   ranking and the empty-state content.
   ========================================================================== */

import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { detectIdentifier } from "@/lib/identify";
import { STOCK_LABEL } from "@/lib/stock";
import type { Part } from "@/lib/data";
import {
  BROWSE_CATEGORIES,
  POPULAR_PARTS,
  TOP_MANUFACTURERS,
  suggest,
  type SuggestKind,
} from "@/lib/suggest";
import { addRecent, clearRecent, getRecent } from "@/lib/recent";
import { Highlight } from "./Highlight";

interface Props {
  id?: string;
  compact?: boolean;
  defaultValue?: string;
  autoFocus?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

/* One navigable entry. `recent` refills the field and re-runs; the rest
   navigate. Keeping them in one flat list is what lets the arrow keys move
   through parts, chips and recents without caring which section they sit in. */
type Item =
  | { t: "recent"; label: string }
  | { t: "part"; part: Part }
  | { t: "nav"; kind: SuggestKind; href: string; primary: string; secondary?: string; meta?: string; hl?: boolean }
  | { t: "fallback" };

type Variant = "parts" | "rows" | "chips" | "fallback";
interface Section {
  id: string;
  label?: string;
  clearable?: boolean;
  variant: Variant;
  items: { item: Item; index: number }[];
}

/* Small, consistent kind icons — a dropdown is scanned, not read, and a glyph
   per category is faster to parse than a word. Stroked to match the site's
   1.6px hairline language. */
function KindIcon({ kind }: { kind: Item["t"] | SuggestKind }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "recent":
      return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
    case "mfr":
      return <svg {...common}><path d="M4 20V6l7-2v16M11 20V9l7 2v9M4 20h16M8 8v0M8 12v0M8 16v0M15 13v0M15 17v0" /></svg>;
    case "category":
      return <svg {...common}><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></svg>;
    case "aircraft":
      return <svg {...common}><path d="M12 3c1 0 1.6 1 1.6 2.4v4.2l6.4 3.6v1.8l-6.4-1.8v3.6l1.8 1.3v1.4L12 19l-3.4 1.1v-1.4l1.8-1.3v-3.6L4 15.8V14l6.4-3.6V5.4C10.4 4 11 3 12 3Z" /></svg>;
    case "type":
      return <svg {...common}><path d="M4 7h16M4 12h16M4 17h10" /></svg>;
    case "part":
    default:
      return <svg {...common}><path d="M12 3 20 7v10l-8 4-8-4V7l8-4Z" /><path d="M4 7l8 4 8-4M12 11v10" /></svg>;
  }
}

export function SearchField({
  id,
  compact = false,
  defaultValue = "",
  autoFocus,
  value: controlledValue,
  onValueChange,
  inputRef: externalInputRef,
}: Props) {
  const generated = useId();
  const fieldId = id ?? `search-${generated}`;
  const suggestId = `${fieldId}-suggest`;
  const detectId = `${fieldId}-detect`;
  const optId = (i: number) => `${fieldId}-opt-${i}`;

  const router = useRouter();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlledValue ?? uncontrolled;
  const setValue = (next: string) => {
    if (controlledValue === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [recents, setRecents] = useState<string[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const ownInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef ?? ownInputRef;

  const q = value.trim();
  const identifier = detectIdentifier(q);

  /* Recents load on the client only, after mount — the server render carries no
     device state, so this can never cause a hydration mismatch. */
  useEffect(() => {
    setRecents(getRecent());
  }, []);

  /* Build the sections and the flat option list together, so the visible order
     and the keyboard order are the same list by construction. */
  const { sections, flat } = useMemo(() => {
    const flat: Item[] = [];
    const sections: Section[] = [];
    const take = (items: Item[]) =>
      items.map((item) => {
        flat.push(item);
        return { item, index: flat.length - 1 };
      });

    if (!q) {
      if (recents.length) {
        sections.push({
          id: "recent",
          label: "Recent searches",
          clearable: true,
          variant: "rows",
          items: take(recents.map((label) => ({ t: "recent", label }))),
        });
      }
      if (POPULAR_PARTS.length) {
        sections.push({
          id: "popular",
          label: "Popular parts",
          variant: "parts",
          items: take(POPULAR_PARTS.map((part) => ({ t: "part", part }))),
        });
      }
      sections.push({
        id: "cats",
        label: "Browse by category",
        variant: "chips",
        items: take(
          BROWSE_CATEGORIES.map((c) => ({
            t: "nav",
            kind: "category",
            href: `/part-types/${encodeURIComponent(c.slug)}`,
            primary: c.name,
          }))
        ),
      });
      sections.push({
        id: "mfrs",
        label: "Top manufacturers",
        variant: "chips",
        items: take(
          TOP_MANUFACTURERS.map((m) => ({
            t: "nav",
            kind: "mfr",
            href: `/manufacturers/${encodeURIComponent(m.cage)}`,
            primary: m.name,
          }))
        ),
      });
    } else {
      for (const g of suggest(q)) {
        sections.push({
          id: g.kind,
          label: g.label,
          variant: g.kind === "part" ? "parts" : g.kind === "type" ? "chips" : "rows",
          items: take(
            g.items.map((s) =>
              s.kind === "part" && s.part
                ? ({ t: "part", part: s.part } as Item)
                : ({ t: "nav", kind: s.kind, href: s.href, primary: s.primary, secondary: s.secondary, meta: s.meta, hl: true } as Item)
            )
          ),
        });
      }
      sections.push({ id: "fallback", variant: "fallback", items: take([{ t: "fallback" }]) });
    }

    return { sections, flat };
  }, [q, recents]);

  const showPanel = open && sections.length > 0;

  /* Close on a click outside the field. Gated on `open` so the listener only
     exists while the panel is up. */
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  /* Keep the active option in view when the arrow keys walk past the fold. */
  useEffect(() => {
    if (active < 0) return;
    listRef.current?.querySelector(`#${CSS.escape(optId(active))}`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  /* "/" jumps to search from anywhere — header field only. */
  useEffect(() => {
    if (id !== "header-search") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [id]);

  function go(href: string) {
    setOpen(false);
    setActive(-1);
    router.push(href);
  }

  /* Committing a real search term is what earns a recents entry — refilling from
     a recent, or browsing a chip with an empty box, does not. */
  function commit(href: string) {
    if (q.length >= 2) setRecents(addRecent(q));
    go(href);
  }

  function activate(item: Item) {
    if (item.t === "recent") {
      setValue(item.label);
      setActive(-1);
      setOpen(true);
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }
    if (item.t === "part") return commit(`/part/${encodeURIComponent(item.part.pn)}`);
    if (item.t === "nav") return commit(item.href);
    commit(`/rfq?q=${encodeURIComponent(q)}`); // fallback
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showPanel) {
      if (e.key === "ArrowDown") setOpen(true);
      return;
    }
    const count = flat.length;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      setActive((prev) => (prev < 0 ? (dir > 0 ? 0 : count - 1) : (prev + dir + count) % count));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      activate(flat[active]);
    }
  }

  /* Plain Enter, nothing highlighted: take the buyer to the best available
     destination rather than a results page that does not exist yet — the top
     match if there is one, otherwise straight to a pre-filled quote. */
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!q) return;
    if (active >= 0) return activate(flat[active]);
    const first = flat.find((it) => it.t === "part" || it.t === "nav");
    if (first?.t === "part") return commit(`/part/${encodeURIComponent(first.part.pn)}`);
    if (first?.t === "nav") return commit(first.href);
    commit(`/rfq?q=${encodeURIComponent(q)}`);
  }

  function onClear() {
    clearRecent();
    setRecents([]);
    inputRef.current?.focus();
  }

  const detectNode = identifier ? (
    <>
      Recognised as <strong>{identifier.label}</strong>
      {identifier.normalized !== q && (
        <>
          {" "}
          — searching <strong>{identifier.normalized}</strong>
        </>
      )}
    </>
  ) : null;

  /* One option renderer for every row/chip so the active + click behaviour is
     identical wherever it appears. */
  function Option({ item, index }: { item: Item; index: number }) {
    const selected = index === active;
    const shared = {
      id: optId(index),
      role: "option" as const,
      "aria-selected": selected,
      onMouseEnter: () => setActive(index),
      onMouseDown: (e: React.MouseEvent) => e.preventDefault(), // keep focus in the input
      onClick: () => activate(item),
    };

    if (item.t === "fallback") {
      return (
        <div {...shared} className="suggest-opt s-fallback">
          <span className="suggest-ic" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
          <span className="s-secondary">
            <strong>Looking for &ldquo;{q}&rdquo;?</strong> Request a quote — we source far beyond the catalog shown here.
          </span>
        </div>
      );
    }

    if (item.t === "recent") {
      return (
        <div {...shared} className="suggest-opt">
          <span className="suggest-ic" aria-hidden="true"><KindIcon kind="recent" /></span>
          <span className="suggest-name">{item.label}</span>
          <span className="suggest-meta suggest-recall" aria-hidden="true">Search</span>
        </div>
      );
    }

    if (item.t === "part") {
      const p = item.part;
      return (
        <div {...shared} className="suggest-opt suggest-opt-part">
          <span className="suggest-ic" aria-hidden="true"><KindIcon kind="part" /></span>
          <span className="s-primary">{q ? <Highlight text={p.pn} query={q} /> : p.pn}</span>
          <span className="s-secondary">{p.desc}</span>
          <span className="s-stock" data-stock={p.stock}>{STOCK_LABEL[p.stock]}</span>
        </div>
      );
    }

    // nav (also rendered as a chip when the section is a chip variant)
    return (
      <div {...shared} className="suggest-opt">
        <span className="suggest-ic" aria-hidden="true"><KindIcon kind={item.kind} /></span>
        <span className="suggest-name">{item.hl && q ? <Highlight text={item.primary} query={q} /> : item.primary}</span>
        {item.secondary && <span className="suggest-sub">{item.secondary}</span>}
        {item.meta && <span className="suggest-meta">{item.meta}</span>}
      </div>
    );
  }

  function Chip({ item, index }: { item: Item; index: number }) {
    if (item.t !== "nav") return null;
    const selected = index === active;
    return (
      <button
        type="button"
        id={optId(index)}
        role="option"
        aria-selected={selected}
        className="suggest-chip"
        onMouseEnter={() => setActive(index)}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => activate(item)}
      >
        {item.primary}
      </button>
    );
  }

  return (
    <div className={compact ? "search" : "search search-hero"} ref={rootRef} data-search>
      <form
        className="search-form"
        role="search"
        action="/search"
        method="get"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <label className="u-visually-hidden" htmlFor={fieldId}>
          Search by part number, NSN, NIIN, CAGE code, manufacturer or description
        </label>
        <div className="search-field">
          <input
            id={fieldId}
            ref={inputRef}
            name="q"
            type="search"
            spellCheck={false}
            autoFocus={autoFocus}
            placeholder={
              compact
                ? "Part number, NSN, NIIN, CAGE code…"
                : "Part number, NSN, NIIN or CAGE code…"
            }
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            aria-describedby={detectId}
            aria-expanded={showPanel}
            aria-controls={suggestId}
            aria-activedescendant={showPanel && active >= 0 ? optId(active) : undefined}
            role="combobox"
          />
          {compact && <kbd className="search-kbd">/</kbd>}
          <button
            className={`btn btn-primary search-submit${compact ? " btn-sm" : ""}`}
            type="submit"
          >
            Search
          </button>
        </div>

        <div
          className="search-suggest"
          id={suggestId}
          role="listbox"
          aria-label="Suggestions"
          hidden={!showPanel}
          ref={listRef}
        >
          {showPanel &&
            sections.map((sec) => (
              <Fragment key={sec.id}>
                {sec.label && (
                  <div className="suggest-head">
                    <span className="suggest-head-label">{sec.label}</span>
                    {sec.clearable && (
                      <button
                        type="button"
                        className="suggest-clear"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={onClear}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}
                {sec.variant === "chips" ? (
                  <div className="suggest-chips">
                    {sec.items.map(({ item, index }) => (
                      <Chip key={index} item={item} index={index} />
                    ))}
                  </div>
                ) : (
                  sec.items.map(({ item, index }) => (
                    <Option key={index} item={item} index={index} />
                  ))
                )}
              </Fragment>
            ))}
        </div>
      </form>
      {compact ? (
        <span className="u-visually-hidden" id={detectId} role="status" aria-live="polite">
          {detectNode}
        </span>
      ) : (
        <p className="search-detect" id={detectId} role="status" aria-live="polite">
          {detectNode}
        </p>
      )}
    </div>
  );
}

"use client";

/* ==========================================================================
   The single search field

   One field, six identifiers. It announces what it thinks the buyer is
   holding as they type, suggests matches, and always keeps "quote it anyway"
   one click away — because a perfect result set can still miss the part in
   someone's hand, and the catalog is a fraction of what can be sourced.
   ========================================================================== */

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { detectIdentifier } from "@/lib/identify";
import { searchParts } from "@/lib/search";
import { STOCK_LABEL } from "@/lib/stock";
import { Highlight } from "./Highlight";

interface Props {
  /* The header field is the one "/" focuses, so it takes a stable id rather
     than a generated one. */
  id?: string;
  compact?: boolean;
  defaultValue?: string;
  autoFocus?: boolean;
  /* Optional controlled mode. The homepage drives the hero field from its
     example chips, which have to be able to put a value *into* the field and
     let the detection line react to it — so that page owns the value and this
     component defers. Everywhere else the field owns its own state. */
  value?: string;
  onValueChange?: (value: string) => void;
  /* Lets a controlling page move focus into the field — the example chips put
     the caret back where the buyer can keep typing. */
  inputRef?: React.RefObject<HTMLInputElement | null>;
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

  const router = useRouter();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlledValue ?? uncontrolled;
  const setValue = (next: string) => {
    if (controlledValue === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const ownInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef ?? ownInputRef;

  const q = value.trim();
  const identifier = detectIdentifier(q);
  const matches = q.length >= 2 ? searchParts(q, 6) : [];
  // The fallback option is always present, so the option count is matches + 1.
  const optionCount = matches.length + 1;
  const showSuggest = open && q.length >= 2;

  useEffect(() => {
    if (!showSuggest) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [showSuggest]);

  /* "/" jumps to search from anywhere. Costs nothing to those who don't know
     it; saves a mouse trip for the buyers who use this site daily. Only the
     header field claims the shortcut, so a page with two fields doesn't
     fight itself. */
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
    router.push(href);
  }

  function activate(index: number) {
    if (index < matches.length) go(`/part/${encodeURIComponent(matches[index].pn)}`);
    else go(`/rfq?q=${encodeURIComponent(q)}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSuggest) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      // Wraps in both directions: ArrowDown past the end returns to the first,
      // ArrowUp from the first goes to the last.
      setActive((prev) =>
        prev < 0 ? (dir > 0 ? 0 : optionCount - 1) : (prev + dir + optionCount) % optionCount
      );
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      activate(active);
    }
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

  return (
    <div className={compact ? "search" : "search search-hero"} ref={rootRef} data-search>
      <form
        className="search-form"
        role="search"
        action="/search"
        method="get"
        autoComplete="off"
        onSubmit={(e) => {
          if (!q) return;
          // Intercepted so the results arrive as a client transition; the plain
          // GET action above is what runs if JS never loads.
          e.preventDefault();
          go(`/search?q=${encodeURIComponent(q)}`);
        }}
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
            onFocus={() => {
              if (value.trim().length >= 2) setOpen(true);
            }}
            onKeyDown={onKeyDown}
            aria-describedby={detectId}
            aria-expanded={showSuggest}
            aria-controls={suggestId}
            aria-activedescendant={
              showSuggest && active >= 0 ? `${fieldId}-opt-${active}` : undefined
            }
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
        <ul
          className="search-suggest"
          id={suggestId}
          role="listbox"
          aria-label="Suggestions"
          hidden={!showSuggest}
        >
          {showSuggest &&
            matches.map((p, i) => (
              <li
                key={p.pn}
                role="option"
                id={`${fieldId}-opt-${i}`}
                aria-selected={i === active}
              >
                <button type="button" onClick={() => activate(i)}>
                  <span className="s-primary">
                    <Highlight text={p.pn} query={q} />
                  </span>
                  <span className="s-secondary">{p.desc}</span>
                  <span className="s-kind">{STOCK_LABEL[p.stock]}</span>
                </button>
              </li>
            ))}
          {/* The last option is always an escape hatch. Even a perfect result
              set can miss the part a buyer is actually holding, and the catalog
              is a fraction of what can be sourced — so "quote it anyway" is
              never more than one click away. */}
          {showSuggest && (
            <li
              role="option"
              id={`${fieldId}-opt-${matches.length}`}
              aria-selected={active === matches.length}
              className="s-fallback"
            >
              <button type="button" onClick={() => activate(matches.length)}>
                <span className="s-secondary">
                  <strong>Can&rsquo;t see it?</strong> Request a quote for &ldquo;{q}&rdquo; — we
                  source beyond the listed catalog.
                </span>
              </button>
            </li>
          )}
        </ul>
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

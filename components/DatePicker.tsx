"use client";

/* ==========================================================================
   DatePicker — a small custom calendar in place of the native date control,
   which renders differently (and datedly) in every browser.

   A field-styled trigger ("Pick a date" + a padded chevron) opens a calendar
   popover: month nav, a Su–Sa grid, today marked, the selection filled in the
   accent. The chosen date is written, ISO-formatted, into a hidden input so the
   surrounding form submits exactly as it did with `<input type="date">` — the
   field name and value contract is unchanged.

   Closes on outside-click and Escape. SSR-safe: with no selection and closed,
   the trigger shows the placeholder and the hidden input is empty, identical on
   server and client, so there is no hydration mismatch.
   ========================================================================== */

import { useEffect, useRef, useState } from "react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const pretty = (d: Date) =>
  d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const firstOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export function DatePicker({
  id,
  name,
  placeholder = "Pick a date",
}: {
  id?: string;
  name: string;
  placeholder?: string;
}) {
  const [value, setValue] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Date>(() => firstOfMonth(new Date()));
  const rootRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* 6 weeks × 7 days, starting on the Sunday on or before the 1st. */
  const first = firstOfMonth(view);
  const gridStart = new Date(first);
  gridStart.setDate(1 - first.getDay());
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });

  const shift = (by: number) => setView(new Date(view.getFullYear(), view.getMonth() + by, 1));
  const pick = (d: Date) => {
    setValue(d);
    setView(firstOfMonth(d));
    setOpen(false);
  };

  return (
    <div className="datepick" ref={rootRef}>
      <input type="hidden" name={name} value={value ? iso(value) : ""} />

      <button
        type="button"
        id={id}
        className="datepick-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`datepick-val${value ? "" : " is-placeholder"}`}>
          {value ? pretty(value) : placeholder}
        </span>
        <svg
          className={`datepick-caret${open ? " is-open" : ""}`}
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div className="datepick-pop" role="dialog" aria-label="Choose a date">
          <div className="datepick-head">
            <button type="button" className="datepick-nav" aria-label="Previous month" onClick={() => shift(-1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <span className="datepick-title">
              {MONTHS[view.getMonth()]} {view.getFullYear()}
            </span>
            <button type="button" className="datepick-nav" aria-label="Next month" onClick={() => shift(1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>

          <div className="datepick-grid datepick-weekdays" aria-hidden="true">
            {WEEKDAYS.map((w) => (
              <span key={w} className="datepick-wd">{w}</span>
            ))}
          </div>

          <div className="datepick-grid">
            {days.map((d, i) => {
              const outside = d.getMonth() !== view.getMonth();
              const isSel = value != null && sameDay(d, value);
              const isToday = sameDay(d, today);
              return (
                <button
                  key={i}
                  type="button"
                  className={`datepick-day${outside ? " is-out" : ""}${isToday ? " is-today" : ""}${isSel ? " is-sel" : ""}`}
                  aria-pressed={isSel}
                  onClick={() => pick(d)}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          <div className="datepick-foot">
            <button type="button" className="datepick-link" onClick={() => { setValue(null); setOpen(false); }}>
              Clear
            </button>
            <button type="button" className="datepick-link" onClick={() => pick(new Date())}>
              Today
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

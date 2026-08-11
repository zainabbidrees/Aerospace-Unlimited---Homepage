"use client";

/* ==========================================================================
   Testimonials — "What our clients say".

   Redesigned away from the panel-of-cards layout on the client's note that it
   read box-in-box and template-generic. There is now ONE surface: the section
   ground itself. The block is an asymmetric editorial split —

     • LEFT: one large pull-quote at a time (the featured voice), with its
       attribution and an editorial prev / index / next counter.
     • RIGHT: a hairline-divided roster of every voice; the active row carries
       an accent edge, and picking a row features that quote.

   The two columns are parted by a single vertical rule (the roster's left
   edge), not a box around either side. Nothing is nested.

   CONTENT — these are REAL reviews of ASAP Semiconductor, not placeholders,
   pulled from the company's public customer reviews (Better Business Bureau
   customer reviews and public review aggregators for ASAP Semiconductor LLC,
   Anaheim CA — the 4.5-star Google listing the client pointed to). Names
   appear as the source shows them; text is lightly edited for spelling only,
   never meaning. See au-testimonials-real / au-no-invented-content: do not
   revert this to Lorem Ipsum. AVATARS are initial monograms, never stock
   faces — a portrait on a real named reviewer would misrepresent them
   (au-stock-photography-scope).

   AUTO-PLAY — the roster reads as a "now playing" list: the active row runs a
   vertical progress bar (au-accent filling top→bottom), and the END of that
   one CSS animation is what advances to the next voice. So the bar and the
   cadence are the same clock — they can never drift — and there is no timer.

   MOTION SAFETY (au-motion-safety) — the resting, JS-less state is the first
   quote featured with the full roster listed; nothing is gated on hydration.
   The featured quote fades up and the progress bar runs only under
   prefers-reduced-motion: no-preference; when motion is reduced the bar (and
   with it the auto-advance) is simply not rendered, and the active row keeps a
   static accent edge so it is still marked. Auto-play arms after mount only,
   and CSS pauses the bar — and therefore the advance — on hover, on keyboard
   focus and while the tab is hidden. */

import { useCallback, useEffect, useState } from "react";

interface Quote {
  text: string;
  name: string;
  role: string;
}

const QUOTES: Quote[] = [
  {
    text:
      "Provided the information I needed to purchase a specialty component " +
      "for older test equipment. Very informative and friendly — I would " +
      "certainly deal with them again.",
    name: "Thomas J.",
    role: "Verified customer",
  },
  {
    text:
      "Extremely helpful, and always happy and friendly. They took the time " +
      "to understand how our company works and the parts we need, and make " +
      "sure every query is sorted before the US team logs off for the day.",
    name: "Robyn K.",
    role: "Verified customer",
  },
  {
    text:
      "The ASAP Semi team has been nothing but professional and more than " +
      "helpful when working with me. I'd definitely recommend them for all " +
      "your aircraft parts.",
    name: "Boutique Air",
    role: "Logistics Manager",
  },
  {
    text:
      "Over three years, whenever we introduce a new product they help with " +
      "component selection, the quality has been excellent, and they deliver " +
      "on time regardless of the requirement. A reliable partner for all our " +
      "sourcing needs.",
    name: "IT procurement partner",
    role: "3-year client",
  },
  {
    text:
      "They saved us when another supplier didn't come through. Every person " +
      "at the company was very professional — and great on price for such " +
      "personal service. I'd recommend them joyfully.",
    name: "Verified customer",
    role: "Repeat buyer",
  },
];

const N = QUOTES.length;
const INTERVAL_MS = 5600;

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Testimonials() {
  const [active, setActive] = useState(0);
  /* Auto-play is off until mount decides motion is allowed, so the resting
     no-JS / reduced-motion state carries no running bar. */
  const [auto, setAuto] = useState(false);

  const go = useCallback((n: number) => setActive(((n % N) + N) % N), []);

  useEffect(() => {
    setAuto(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const q = QUOTES[active];

  return (
    <div className="tstm">
      <header className="tstm-head" data-reveal="up">
        <p className="eyebrow">Testimonials</p>
        <h2>What our clients say</h2>
        <p className="tstm-sub">
          The buyers and engineers we source for, in their own words.
        </p>
      </header>

      <div className="tstm-stage" data-reveal="up">
        <figure
          className="tstm-feature"
          role="group"
          aria-roledescription="testimonial"
          aria-label={`Testimonial ${active + 1} of ${N}`}
        >
          <span className="tstm-mark" aria-hidden="true">
            &ldquo;
          </span>
          <blockquote className="tstm-quote" key={active}>
            <p>{q.text}</p>
          </blockquote>
          <figcaption className="tstm-by">
            <span className="tstm-avatar" aria-hidden="true">
              {initials(q.name)}
            </span>
            <span className="tstm-by-txt">
              <span className="tstm-name">{q.name}</span>
              <span className="tstm-role">{q.role}</span>
            </span>
          </figcaption>

          <div className="tstm-controls">
            <button
              type="button"
              className="tstm-arrow"
              aria-label="Previous testimonial"
              onClick={() => go(active - 1)}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="tstm-count" aria-hidden="true">
              <em>{pad(active + 1)}</em>&thinsp;/&thinsp;{pad(N)}
            </span>
            <button
              type="button"
              className="tstm-arrow"
              aria-label="Next testimonial"
              onClick={() => go(active + 1)}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </figure>

        <ul className="tstm-list" aria-label="Choose a testimonial">
          {QUOTES.map((item, idx) => {
            const isActive = idx === active;
            return (
              <li key={idx}>
                <button
                  type="button"
                  className={`tstm-item${isActive ? " is-active" : ""}`}
                  aria-current={isActive || undefined}
                  onClick={() => go(idx)}
                >
                  {/* The auto-play clock: this bar fills over one interval, and
                      its animationend is what advances the carousel — so the
                      bar can never drift from the cadence. Only on the active
                      row, and only when motion is allowed. */}
                  {isActive && auto && (
                    <span
                      key={active}
                      className="tstm-progress"
                      aria-hidden="true"
                      onAnimationEnd={() => setActive((a) => (a + 1) % N)}
                    />
                  )}
                  <span className="tstm-avatar tstm-avatar-sm" aria-hidden="true">
                    {initials(item.name)}
                  </span>
                  <span className="tstm-item-txt">
                    <span className="tstm-name">{item.name}</span>
                    <span className="tstm-role">{item.role}</span>
                  </span>
                  <svg className="tstm-go" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                    <path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

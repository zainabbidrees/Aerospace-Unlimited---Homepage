"use client";

/* ==========================================================================
   About ASAP — the four service facts as a stat row with a count-up.

   NO ENTRANCE, at the client's direction (2026-08-07): this band renders
   static and nothing in it is ever hidden — the hide-then-rise this row once
   had was removed with the band's other entrances. See au-about-band-static.
   The one motion kept is the count-up: on scroll into view, any leading
   number runs 0 → target. The values render final on the server, so SSR,
   no-JS and reduced-motion always show the finished figures.
   ========================================================================== */

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: string;
  label: string;
}

/* Same four facts the section has always carried. */
const STATS: Stat[] = [
  { value: "Same Day", label: "Shipping" },
  { value: "15 Min", label: "Quote turnaround" },
  { value: "24/7", label: "AOG service" },
  { value: "Competitive", label: "Pricing" },
];

/* A leading integer counts up; the rest of the string is a static suffix. No
   leading integer (e.g. "Same Day") → nothing to count, rendered as-is. */
function splitValue(value: string): { count: number | null; suffix: string } {
  const m = value.match(/^(\d+)(.*)$/);
  return m ? { count: parseInt(m[1], 10), suffix: m[2] } : { count: null, suffix: value };
}

export function AboutStats() {
  const ref = useRef<HTMLUListElement>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return; // never count
    }

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    /* Failsafe: if the observer never fires (background tab, odd renderer),
       reveal anyway so the row is never stranded hidden. */
    const t = setTimeout(() => setInView(true), 2400);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  const run = inView && !reduced;

  return (
    <ul ref={ref} className="about-stats">
      {STATS.map((s, i) => {
        const { count, suffix } = splitValue(s.value);
        return (
          <li key={s.label} style={{ ["--i" as string]: i } as React.CSSProperties}>
            <span className="about-stat-value">
              {count != null ? <CountUp target={count} suffix={suffix} run={run} /> : s.value}
            </span>
            <span className="about-stat-label">{s.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

/* Counts 0 → target on `run`, easing out. Before running (SSR and first paint)
   it renders the final target, so the value is correct with or without JS. */
function CountUp({ target, suffix, run }: { target: number; suffix: string; run: boolean }) {
  const [n, setN] = useState(target);

  useEffect(() => {
    if (!run) return;
    let raf = 0;
    let start: number | null = null;
    const duration = 900;
    setN(0);
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
}

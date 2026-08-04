"use client";

/* ==========================================================================
   The desk clock — the hero's live status plate.

   The desk is staffed 24/7/365, so "open" is not news and is never the thing
   this computes. What a buyer three time zones away actually cannot work out is
   what time it is AT the desk, and therefore how long is left on the 3pm Pacific
   same-day shipping cutoff the site publishes. That is all this does.

   MOTION- AND SSR-SAFE BY CONSTRUCTION. The server renders the two facts the
   page can always state — the desk is open, the cutoff is 3pm Pacific — and this
   only ever ADDS the live line after mount, once it knows a clock is running.
   Nothing is hidden at rest, so the screenshot renderer, a no-JS visitor and a
   crawler all get a complete, true plate. See au-motion-safety.

   Only two figures are derived, both from values already on the site: the local
   Pacific time, and the distance to 15:00 Pacific. No claim is invented here.
   ========================================================================== */

import { useEffect, useState } from "react";

/* Pacific wall-clock parts for an instant, via the IANA zone so DST is the
   platform's problem rather than ours. */
function pacific(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(now);

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const hour = Number(get("hour")) % 24;
  const minute = Number(get("minute"));

  /* Minutes until 15:00 Pacific. Negative once the cutoff has passed, which the
     caller reads as "tomorrow" rather than trying to name a date — the site
     states a cutoff, not a shipping calendar. */
  const toCutoff = (15 * 60) - (hour * 60 + minute);

  return {
    label: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    weekday: get("weekday"),
    toCutoff,
  };
}

export function DeskClock() {
  const [t, setT] = useState<ReturnType<typeof pacific> | null>(null);

  useEffect(() => {
    const tick = () => setT(pacific(new Date()));
    tick();
    /* 30s, not 1s. The plate shows minutes, and a per-second interval on a
       marketing page is a wake-up call the battery does not need. */
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const cutoff = (() => {
    if (!t) return null;
    if (t.toCutoff <= 0) return "today’s cutoff has passed";
    const h = Math.floor(t.toCutoff / 60);
    const m = t.toCutoff % 60;
    return `${h ? `${h}h ` : ""}${m}m to cutoff`;
  })();

  return (
    <div className="clock">
      <span className="clock-live">
        <span className="clock-dot" aria-hidden="true" />
        Desk open now
      </span>

      {/* ONE LINE, and the fallback is a complete sentence rather than a gap: with
          no clock running this reads "Desk open now · staffed 24/7/365, same-day
          shipping before 3pm Pacific", which is true and needs no JS. The live
          version swaps in the two things only a clock can know. */}
      <span className="clock-body">
        {t ? (
          <>
            <span className="clock-time">{t.label} Pacific</span>
            <span className="clock-cut">{cutoff}</span>
          </>
        ) : (
          <span className="clock-cut">
            Staffed 24/7/365 · same-day shipping before 3pm Pacific
          </span>
        )}
      </span>
    </div>
  );
}

"use client";

/* ==========================================================================
   The ledger writes itself as you scroll.

   THE THESIS. This band is a record: three accumulated counts on one shelf, with
   the live state set apart on a lit plate. So scrolling through it is the act of
   the record being totalled — one progress value, taken from the band's travel
   through the viewport, drives every part of it:

     · the shelf rule draws left to right, with a bright tip at the pen point
     · the column hairlines drop in behind it, one per figure, left to right
     · the three figures climb toward their true totals, staggered the same way
     · the live plate DOESN'T get written — it drifts down onto its own plane,
       because 24/7/365 is a state, not something that accumulated

   It replaces a one-shot tally that fired at 60% visibility and was over before
   the band had settled. The scroll is the better clock here: the reader owns it,
   so the figures arrive at the speed they chose to read.

   PROGRESS ONLY EVER MOVES FORWARD (`hi`, a high-water mark). A ledger that
   counted back down as you scrolled up would be displaying figures that are not
   true, on a band whose entire job is figures that are.

   AND IT ALWAYS LANDS ON THE TRUTH. 380ms after the last scroll event, whatever
   is left of the run finishes itself over 460ms. So a partial figure is only ever
   on screen while the reader is actively scrolling; the moment they stop to read,
   the true total is what they read.

   ---

   MOTION-SAFE BY CONSTRUCTION, and the constraints are measured, not stylistic:
   this project ships against a screenshot renderer that delivers NO
   IntersectionObserver callbacks and advances NO animation, and an earlier reveal
   once stranded thirteen of fifteen sections at opacity 0. So:

     1. THE TRUE FIGURES ARE THE REST STATE. They are what the server renders,
        what sits in the DOM, and what no-JS / reduced-motion / a dead frame
        leaves on screen. Same for the CSS: every custom property written here
        falls back to its FINISHED value (`var(--nums-rule, 1)`), so an unset
        property is a fully drawn ledger, never a missing one.
     2. NOTHING IS TOUCHED UNTIL A FRAME ACTUALLY FIRES — not the digits, and not
        the properties either. Arming happens inside the first
        requestAnimationFrame, so a renderer that never paints never reaches the
        code that would blank anything.
     3. IT ONLY ARMS FROM BELOW THE FOLD. If the band is already on screen when
        this mounts (a refresh mid-page, a jump link), the record has already been
        read: it stays finished and the listeners come straight back off. Watching
        a ledger you are already looking at redraw itself is not an entrance.
     4. A TIMER, NOT A FRAME, OWNS THE FINAL VALUE. requestAnimationFrame does not
        tick in a background tab, so a run that started and then lost its frames
        would sit at a partial figure. A wall-clock backstop and a visibility
        handler both land the true totals.
     5. THE WIDTH IS LOCKED BEFORE THE FIRST DIGIT CHANGES, measured at the true
        value, so "0" → "60,000" cannot shift the row. Released when the run ends,
        so a later resize re-flows normally.

   See au-motion-safety.
   ========================================================================== */

import { useEffect } from "react";

/* Windows on the shared progress, in the order the eye should meet them. The
   rule leads because it is the shelf everything else hangs off; each hairline
   opens as the pen passes its column (a third and two thirds of the way across a
   rule that draws over 0 → 0.52, so at 0.17 and 0.35); the plate settles last. */
const RULE_WINDOW: [number, number] = [0, 0.52];
const DIVIDER_WINDOWS: [number, number][] = [
  [0.18, 0.62], /* between figures 1 and 2 */
  [0.35, 0.79], /* between figures 2 and 3 */
];
const PLATE_WINDOW: [number, number] = [0, 0.72];
/* How far below its place the plate sits at the start of the band's travel.
   Small on purpose: it should read as a different plane, not a second entrance. */
const PLATE_DRIFT = 14;

/* Each figure starts a beat after the one before, so the row lands left to right
   like a readout settling rather than three numbers twitching at once. */
const DIGIT_SPAN = 0.62;
const DIGIT_STEP = 0.1;

const SETTLE_IDLE = 380; /* ms of scroll silence before the run lands itself */
const SETTLE_MS = 460; /* and how long it takes to land */
const BACKSTOP_MS = 6000; /* frames or no frames, the totals are true by here */

/* THREE CURVES, because three different things are happening, and one curve for
   all of them was measurably wrong: on exponential ease-out the rule was 94%
   drawn by 21% of the band's travel, so the pen jumped to the far end and then
   crept. Scrubbed motion has to stay coupled to the input that drives it.

   · linear     — the RULE. A pen moves at the speed you push it. Anything eased
                  decouples the line from the scroll that is drawing it.
   · cubic-out  — the HAIRLINES and the PLATE. These are arrivals: they drop into
                  a place and settle, so they decelerate.
   · expo-out   — the FIGURES. A tally races and then eases into its total; this
                  is the site's own arrival curve (`--au-ease`), and it is what
                  the one-shot tally this replaces used. */
const linear = (t: number) => t;
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const outExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);

/* A window on the shared progress, eased. Returns exactly 1 at and past its end,
   which is what makes every finished state exact rather than asymptotic. */
const win = (
  p: number,
  [a, b]: [number, number],
  curve: (t: number) => number,
) => curve(clamp01((p - a) / (b - a)));

const format = (n: number) => n.toLocaleString("en-US");

export function CountTally() {
  useEffect(() => {
    /* Reduced motion: the figures are already correct in the DOM and every
       property already falls back to finished. Leave without touching a thing. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const band = document.querySelector<HTMLElement>(".a-numbers");
    if (!band) return;
    /* The ledger row drives the progress; the band only carries the properties,
       because the plate and the head read them too. */
    const panel = band.querySelector<HTMLElement>(".nums-panel");
    if (!panel) return;

    const digits = Array.from(
      band.querySelectorAll<HTMLElement>("[data-count]"),
    ).filter((el) => Number.isFinite(Number(el.dataset.count)));
    if (!digits.length) return;

    let eligible = false; /* the band was below the fold when we first looked */
    let armed = false;
    let done = false;
    let hi = 0; /* the high-water mark: progress never goes back */
    let raf = 0;
    let idleTimer = 0;
    let backstop = 0;
    let settleFrom = 0;
    let settleStart = 0;
    const locked: HTMLElement[] = [];

    /* THE LEDGER'S OWN TRAVEL, not the band's — and this was measured, not
       assumed. Anchored to the band's top edge (the first version) the write was
       97% finished by the time the row itself cleared the fold: the row sits
       ~400px inside a band that starts animating as its top edge appears, so the
       reader arrived to a ledger that had already written itself 400px ago.

       Anchored here, 0 is the row's first pixels appearing at the bottom of the
       viewport and 1 is the row sitting 40% down it — so the whole write happens
       while the thing being written is on screen, which was the point. */
    const measure = () => {
      const vh =
        window.innerHeight || document.documentElement.clientHeight || 800;
      const startTop = vh * 0.94;
      const endTop = vh * 0.4;
      return clamp01((startTop - panel.getBoundingClientRect().top) / (startTop - endTop));
    };

    const render = (p: number) => {
      band.style.setProperty("--nums-rule", win(p, RULE_WINDOW, linear).toFixed(4));
      band.style.setProperty("--nums-d2", win(p, DIVIDER_WINDOWS[0], outCubic).toFixed(4));
      band.style.setProperty("--nums-d3", win(p, DIVIDER_WINDOWS[1], outCubic).toFixed(4));
      band.style.setProperty(
        "--nums-plate-y",
        `${(PLATE_DRIFT * (1 - win(p, PLATE_WINDOW, outCubic))).toFixed(2)}px`,
      );
      digits.forEach((el, i) => {
        const start = i * DIGIT_STEP;
        const t = win(p, [start, start + DIGIT_SPAN], outExpo);
        el.textContent = format(Math.round(Number(el.dataset.count) * t));
      });
    };

    function detach() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onHidden);
    }

    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(idleTimer);
      window.clearTimeout(backstop);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      detach();
      /* Hand every property back to the stylesheet rather than pinning it at 1
         inline: the finished state IS the CSS default, so the cleanest way to be
         finished is to have written nothing. */
      delete band.dataset.ledger;
      ["--nums-rule", "--nums-d2", "--nums-d3", "--nums-plate-y"].forEach((p) =>
        band.style.removeProperty(p),
      );
      digits.forEach((el) => {
        el.textContent = format(Number(el.dataset.count));
      });
      /* Released so a later resize re-flows normally. */
      locked.forEach((el) => {
        el.style.minWidth = "";
      });
      locked.length = 0;
    };

    /* Guarantees 1 and 5 live here: this is the first code that writes anything,
       it only ever runs inside a frame, and it measures every width at the TRUE
       value before a single digit is allowed to change.

       THE LOCK GOES ON `.nums-v`, NOT ON THE DIGITS. Locking the digit span held
       the row still but stranded the tinted "+" at the far edge of the reserved
       width, so at "0" the qualifier floated half a column away from its figure —
       the exact "stray superscript" the stylesheet warns about, in the other axis.
       `.nums-v` is a flex row: reserving width there keeps the row rigid while the
       digits and the "+" stay packed together at its start. */
    const arm = () => {
      armed = true;
      /* Scoped will-change, on for the run only — see the stylesheet. */
      band.dataset.ledger = "writing";
      digits.forEach((el) => {
        const figure = el.closest<HTMLElement>(".nums-v");
        if (!figure) return;
        figure.style.minWidth = `${figure.getBoundingClientRect().width}px`;
        locked.push(figure);
      });
      backstop = window.setTimeout(finish, BACKSTOP_MS);
    };

    /* The run lands itself when the reader stops scrolling — see the header. */
    const settle = (now: number) => {
      raf = 0;
      if (done) return;
      if (!settleStart) settleStart = now;
      const t = clamp01((now - settleStart) / SETTLE_MS);
      /* The settle is an arrival, so it decelerates: the reader stopped, and the
         record catches up and lands rather than sliding to a halt. */
      hi = Math.max(hi, settleFrom + (1 - settleFrom) * outCubic(t));
      render(hi);
      if (t >= 1 || hi >= 1) {
        finish();
        return;
      }
      raf = requestAnimationFrame(settle);
    };

    const startSettle = () => {
      if (done || !armed || raf) return;
      settleFrom = hi;
      settleStart = 0;
      raf = requestAnimationFrame(settle);
    };

    const frame = () => {
      raf = 0;
      if (done) return;

      const p = measure();

      /* Guarantee 3, and it is decided once, on the first look: if the band is
         already up the viewport then the record has been read and this never
         participates at all. */
      if (!eligible && !armed) {
        if (p > 0.05) {
          done = true;
          detach();
          return;
        }
        eligible = true;
      }

      /* WAITING, and writing nothing. Arming here instead — on the first frame,
         while the band is still whole viewports away — is what the first version
         did, and the settle timer then landed the entire ledger 380ms after load,
         off screen, so the reader scrolled down to a record that had already
         written itself. Nothing starts until the band's own top edge appears. */
      if (!armed) {
        if (p <= 0) return;
        arm();
      }

      hi = Math.max(hi, p);
      render(hi);

      if (hi >= 1) {
        finish();
        return;
      }
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(startSettle, SETTLE_IDLE);
    };

    const onScroll = () => {
      if (done || raf) return;
      raf = requestAnimationFrame(frame);
    };

    /* Guarantee 4: a hidden tab stops delivering frames, and a nonessential run
       has no business continuing there anyway. Land it and be done. */
    const onHidden = () => {
      if (document.visibilityState === "hidden") finish();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onHidden);
    /* Guarantee 2: the first write of any kind happens inside this frame. */
    raf = requestAnimationFrame(frame);

    return () => {
      /* Unmounting mid-run must not leave a partial figure or a stray property. */
      finish();
      detach();
    };
  }, []);

  return null;
}

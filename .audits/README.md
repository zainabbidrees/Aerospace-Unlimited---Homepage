# Audits

Two checks that each caught a real, shipped defect. Both drive headless Chromium against the
running prototype, so they measure what a browser actually paints rather than what the CSS says.

```bash
# Serve the prototype first (from the project root)
python3 .claude/serve.py &

# Then, from this directory
npm install playwright --no-save
node concentric.js index search part rfq browse about quality contact
node contrast.js    index search part rfq browse about quality contact
```

Both take a list of page names (without `.html`) and print a count per page. Zero is the
expected result; anything else is a defect, not a warning.

## `concentric.js`

Finds rounded boxes nested inside rounded boxes whose corners disagree. **When one rounded box
sits inside another, the inner radius must equal the outer radius minus the inset** — too small
and the inner corner cuts across the outer arc, too large and it bulges past it.

It exists because the hero search field shipped with a 12px-radius button inset 7px inside a
28px-radius field. The correct value was 21px, so the button's corner was 9px too tight and its
straight edge sliced through the field's curve — the most visible flaw on the homepage.

Three conditions have to hold before a comparison means anything, and the first version of this
script got all three wrong and reported eleven false positives:

1. **Per corner.** A right-aligned submit button shares its container's *right* corners.
   Measuring its left inset compares two corners that never touch.
2. **Only inside the corner's zone.** If the inset exceeds the outer radius, the inner box is
   clear of the curve entirely and may use any radius it likes.
3. **Skip pills.** A fully-rounded child of a fully-rounded parent is correct by construction,
   and `999px` is clamped to half the height — comparing the literal values invents a mismatch.

Tolerance is 2px, below which the mismatch is not perceptible.

## `contrast.js`

Walks every rendered text node and measures it against the nearest opaque ancestor background,
compositing alpha as it goes. Applies the WCAG AA floor: 4.5:1, or 3:1 for large text
(≥24px, or ≥18.66px bold).

It exists because a rule that recoloured `.btn-quiet` for dark grounds repainted only the text,
leaving a **white label on a white pill — 1.00:1** — in the footer, on the accent band, and in
every empty state. Reasoning about the cascade had missed it; measuring found it immediately.

Two limits worth knowing:

- **Pseudo-element backgrounds are invisible to it.** The NSN rail's labels sit on an `::after`
  scrim, so the walk finds the page ground behind them and reports a false failure. The script
  skips `.nsn-card` for that reason; anything else placed over a pseudo-element scrim needs the
  same treatment or a manual check.
- **Text over photography is not computable** from styles alone. Those are reported separately
  and have to be judged by eye.

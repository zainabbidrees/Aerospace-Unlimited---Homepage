// Finds rounded boxes nested inside rounded boxes whose corners disagree.
//
// The rule: for an inner box to follow an outer curve, its radius must equal the
// outer radius minus the inset. Too small and the inner corner cuts across the
// outer arc; too large and it bulges past it.
//
// Three conditions have to hold before a comparison means anything, and the
// first version of this script got all three wrong:
//   1. Per corner. A right-aligned submit button shares the outer box's RIGHT
//      corners; measuring its left inset compares corners that never touch.
//   2. Only inside the corner's zone. If the inset exceeds the outer radius the
//      inner box is clear of the curve entirely and may use any radius.
//   3. Skip pills. A fully-rounded child of a fully-rounded parent is correct by
//      construction, and 999px is clamped to half the height, so comparing the
//      literal values reports a mismatch that does not exist.
const { chromium } = require('playwright');

(async () => {
  const pages = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  let total = 0;

  for (const name of pages) {
    await page.goto(`http://localhost:4173/prototype/${name}.html`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);

    const bad = await page.evaluate(() => {
      const TOL = 2;
      const corners = [
        ['TL', 'borderTopLeftRadius'], ['TR', 'borderTopRightRadius'],
        ['BR', 'borderBottomRightRadius'], ['BL', 'borderBottomLeftRadius'],
      ];
      const isPill = (el, prop) => {
        const b = el.getBoundingClientRect();
        return parseFloat(getComputedStyle(el)[prop]) >= Math.min(b.width, b.height) / 2 - 0.5;
      };
      const out = [];
      document.querySelectorAll('*').forEach(inner => {
        const ib = inner.getBoundingClientRect();
        if (ib.width < 16 || ib.height < 16) return;
        const ics = getComputedStyle(inner);
        if (corners.every(([, p]) => parseFloat(ics[p]) === 0)) return;

        let outer = inner.parentElement;
        while (outer && outer !== document.body) {
          const ocs = getComputedStyle(outer);
          if (corners.some(([, p]) => parseFloat(ocs[p]) > 0)) {
            const ob = outer.getBoundingClientRect();
            if (ib.width > ob.width || ib.height > ob.height) break;
            const inset = {
              L: ib.left - ob.left, R: ob.right - ib.right,
              T: ib.top - ob.top, B: ob.bottom - ib.bottom,
            };
            corners.forEach(([c, prop]) => {
              const or = parseFloat(ocs[prop]);
              const ir = parseFloat(ics[prop]);
              if (or === 0) return;
              if (isPill(outer, prop) && isPill(inner, prop)) return;   // (3)
              const gap = Math.min(inset[c[0]], inset[c[1]]);            // (1)
              if (gap < 0 || gap >= or) return;                          // (2)
              const want = or - gap;
              if (Math.abs(want - ir) > TOL) {
                out.push({
                  inner: (inner.className || inner.tagName).toString().trim().slice(0, 30),
                  outer: (outer.className || outer.tagName).toString().trim().slice(0, 30),
                  c, outerR: Math.round(or), gap: Math.round(gap),
                  want: Math.round(want), innerR: Math.round(ir),
                });
              }
            });
            break;
          }
          outer = outer.parentElement;
        }
      });
      const seen = new Set();
      return out.filter(o => {
        const k = [o.inner, o.outer, o.c, o.outerR, o.gap, o.innerR].join('|');
        if (seen.has(k)) return false; seen.add(k); return true;
      });
    });

    console.log(`\n=== ${name} === mismatches: ${bad.length}`);
    bad.slice(0, 12).forEach(b => console.log(
      `  [${b.c}] ${b.inner} in ${b.outer}: outer ${b.outerR}px, inset ${b.gap}px → want ${b.want}px, has ${b.innerR}px`));
    total += bad.length;
  }
  console.log(`\nTOTAL: ${total}`);
  await browser.close();
})();

// Walks every rendered text node and measures it against the nearest opaque
// ancestor background. Elements sitting over photography are reported separately
// rather than guessed at — a computed style cannot tell you the luminance of a
// JPEG behind a scrim.
const { chromium } = require('playwright');

(async () => {
  const pages = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  for (const name of pages) {
    await page.goto(`http://localhost:4173/prototype/${name}.html`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);

    const out = await page.evaluate(() => {
      const parse = (c) => {
        const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
        if (!m) return null;
        return [ +m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4] ];
      };
      const lum = (rgb) => {
        const v = rgb.slice(0, 3).map(c => c / 255).map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
        return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
      };
      const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
      const over = (fg, bg) => fg.slice(0, 3).map((c, i) => c * fg[3] + bg[i] * (1 - fg[3]));

      // Walk up for an effective background; report if we cross an image.
      const bgOf = (el) => {
        let n = el, overImage = false;
        while (n && n !== document.documentElement) {
          const c = getComputedStyle(n);
          if (c.backgroundImage && c.backgroundImage !== 'none') overImage = true;
          const bc = parse(c.backgroundColor);
          if (bc && bc[3] >= 0.999) return { bg: bc.slice(0, 3), overImage };
          if (bc && bc[3] > 0) { const p = bgOf(n.parentElement); if (p) return { bg: over(bc, p.bg), overImage: overImage || p.overImage }; }
          n = n.parentElement;
        }
        return { bg: [248, 245, 240], overImage };
      };

      const fails = [], imageBacked = [];
      document.querySelectorAll('*').forEach(el => {
        const txt = Array.from(el.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim())
          .map(n => n.textContent.trim()).join(' ');
        if (!txt) return;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return;
        const c = getComputedStyle(el);
        if (c.visibility === 'hidden' || c.opacity === '0') return;
        const fg = parse(c.color); if (!fg) return;
        const { bg, overImage } = bgOf(el);
        const eff = fg[3] < 1 ? over(fg, bg) : fg.slice(0, 3);
        const cr = ratio(eff, bg);
        const px = parseFloat(c.fontSize);
        const bold = parseInt(c.fontWeight, 10) >= 700;
        const large = px >= 24 || (px >= 18.66 && bold);
        const need = large ? 3 : 4.5;
        const rec = {
          sel: (el.className || el.tagName).toString().trim().slice(0, 34),
          text: txt.slice(0, 30), px: Math.round(px), ratio: +cr.toFixed(2), need
        };
        if (el.closest('.nsn-card')) return;
        if (overImage) { if (cr < need) imageBacked.push(rec); return; }
        if (cr < need) fails.push(rec);
      });
      return { fails, imageBacked };
    });

    console.log(`\n=== ${name} ===`);
    console.log(`solid-background failures: ${out.fails.length}`);
    out.fails.slice(0, 14).forEach(f => console.log(`  ${f.ratio} (need ${f.need}) ${f.px}px  ${f.sel}  "${f.text}"`));
    if (out.imageBacked.length) {
      console.log(`over photography (measure by eye, not computable): ${out.imageBacked.length}`);
      out.imageBacked.slice(0, 6).forEach(f => console.log(`  ~${f.ratio} ${f.px}px ${f.sel} "${f.text}"`));
    }
  }
  await browser.close();
})();

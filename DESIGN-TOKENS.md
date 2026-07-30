# Aerospace Unlimited — Design Tokens

**Status:** Draft 1 · Phase A of the redesign plan
**Reference studied:** [agentwork.com](https://agentwork.com/) — extracted 2026-07-27
**Content rule:** the phrase "No China Sourcing" must never appear in any copy, label, or mockup.

---

## Part 1 — What was extracted from agentwork.com

Extraction was done in two passes: the `extract-design-system` tool (which only surfaced the font name and a spacing scale), then a direct Playwright probe of computed styles, which is where the real system came from.

The site is built on **Tailwind v4 + Radix UI color scales**, set in **Mona Sans**.

### The three things that actually create the "neatness"

**1. Optical letter-spacing that scales with type size.**
This is the single biggest contributor. Tracking tightens as text gets larger and opens slightly at small sizes:

| Size | Letter-spacing | In em |
|---|---|---|
| 48px | −1.44px | −0.030em |
| 32px | −0.96px | −0.030em |
| 24px | −0.72px | −0.030em |
| 24px (alt) | −0.48px | −0.020em |
| 20px | −0.40px | −0.020em |
| 16px | +0.08px | +0.005em |
| 14px | +0.08px | +0.005em |

**2. Intermediate variable font weights.** Not 400/600/700 — the site uses **425, 450, 500, 550, 650**. Body text is 425 (fractionally lighter than regular, which reads cleaner at 16px), and "semibold" is 550, not 600. Mona Sans is a variable font, so these are real instances, not synthetic.

**3. Hairline borders + a 0.5px ring instead of heavy shadows.** Elevation is almost entirely `0 0 0 0.5px <border-color>` combined with a very soft `0 2px 8px -2px rgba(0,0,0,0.08)`. Nothing floats; everything is crisply outlined.

### Extracted values

```
Type ramp      48 / 32 / 24 / 20 / 16 / 14 px
Line heights   1.15 (display) · 1.35 (mid) · 1.5 (body) · 1.43 (small)
Font           Mona Sans (variable) — SIL OFL, free to use
Mono           ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas

Neutrals       Radix "sand" — a warm grey, not a blue-grey
  page bg      #FDFDFC        text          #21201C
  surface      #FFFFFF        muted text    #63635E
  subtle bg    #F9F9F8        faint text    #82827C
  border       #E2E1DE        border strong #CFCEC A

Accent         #FF6A00 (orange) — used sparingly, one accent only
Semantic       jade #29A383 · yellow #FFE629 · tomato #E54D2E

Spacing        4px base → 4 8 12 16 24 32 40 48 64 80 120
               (most-used: 8, 12, 24, 4)
Radius         10px dominant · 6px small · 16px large · pill
Containers     1200px page · 720px prose · 588px narrow
```

---

## Part 2 — Adapted token set for Aerospace Unlimited

The reference site's *system* is being adopted; its *identity* is not. Three deliberate departures:

- **Accent shifted** from `#FF6A00` to `#E05A00` — deeper and less consumer-tech, reading as industrial hi-vis. It stays the **only** accent hue.
- **A monospace role added.** The reference site barely needs mono; this catalog is built on part numbers, NSNs, NIINs, and CAGE codes. Mono with tabular figures is a first-class role here, not an afterthought.
- **Stock-status semantics added** — in-stock / limited / unavailable — which a marketing site doesn't need but a parts catalog does.

The warm sand neutral ramp is kept as-is. It is what makes the reference feel calm rather than clinical, and it suits a page dense with technical data.

### Color

| Token | Value | Use |
|---|---|---|
| `--au-bg` | `#FDFDFC` | Page ground |
| `--au-surface` | `#FFFFFF` | Cards, part rows, table surface |
| `--au-surface-subtle` | `#F9F9F8` | Table header, alternating rows |
| `--au-surface-sunken` | `#F1F0EF` | Wells, disabled fields |
| `--au-border` | `#E2E1DE` | Default hairline |
| `--au-border-strong` | `#CFCECA` | Emphasis, focused input |
| `--au-ink` | `#21201C` | Primary text |
| `--au-ink-muted` | `#63635E` | Secondary text, labels |
| `--au-ink-faint` | `#82827C` | Metadata, placeholder |
| `--au-accent` | `#E05A00` | Primary CTA, Instant RFQ |
| `--au-accent-hover` | `#C44E00` | Hover/active |
| `--au-accent-surface` | `#FFF0E6` | Accent-tinted background |
| `--au-accent-border` | `#FFD0B0` | Accent-tinted border |
| `--au-stock-in` | `#208368` | In stock |
| `--au-stock-limited` | `#9E6C00` | Limited availability |
| `--au-stock-out` | `#D13415` | Unavailable / quote-only |

**Accent discipline:** one hue. "Request Quote" and "Instant RFQ" are separated by *weight* (solid vs. outline), never by a second colour. AOG urgency is communicated with a pill/badge, not a competing hue.

### Typography

Two faces, three roles:

- **Mona Sans** (variable, SIL OFL) — display and body. Weights 425 / 550 / 650.
- **Geist Mono** (SIL OFL) — part numbers, NSN/NIIN/CAGE codes, quantities. Must be set with `font-variant-numeric: tabular-nums` so digits align in columns.

| Role | Size | Weight | Line-height | Tracking |
|---|---|---|---|---|
| Display | 48px | 650 | 1.15 | −0.030em |
| H1 | 32px | 650 | 1.15 | −0.030em |
| H2 | 24px | 550 | 1.35 | −0.020em |
| H3 | 20px | 550 | 1.50 | −0.020em |
| Body | 16px | 425 | 1.50 | +0.005em |
| Body strong | 16px | 550 | 1.50 | +0.005em |
| Small / UI | 14px | 550 | 1.43 | +0.005em |
| Caption | 13px | 450 | 1.40 | +0.01em |
| **Part number** | 15px | 500 | 1.40 | 0 · mono, tabular |

### Spacing, radius, elevation

```
Spacing (4px base)   4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 120
Radius               sm 6px · md 10px · lg 16px · pill 999px
Border               1px hairline
Ring (elevation 1)   0 0 0 0.5px var(--au-border-strong)
Elevation 2          ring + 0 2px 8px -2px rgba(0,0,0,0.08)
Containers           page 1200px · prose 720px · narrow 588px
Motion               150ms cubic-bezier(0, 0, 0.2, 1)
```

Motion is intentionally minimal — the brand promise is a quote in 15 minutes, so the interface should feel instant, not animated.

---

## Files

- `design-system/tokens.css` — CSS custom properties, ready to import
- `design-system/tokens.json` — same values, machine-readable
- `.extract-design-system/` — raw extraction artifacts from the reference site

## Open items

- **Confirm the accent.** `#E05A00` is a proposal. If Aerospace Unlimited has an existing brand colour that must be honoured, it replaces this and the ramp is rebuilt around it.
- **Confirm font licensing route.** Mona Sans and Geist Mono are both SIL OFL (free, self-hostable). Self-hosting is assumed; no CDN dependency.
- **Dark mode** is not yet defined. The sand ramp inverts to a warm dark ramp cleanly, but it should be a deliberate pass, not an inversion.

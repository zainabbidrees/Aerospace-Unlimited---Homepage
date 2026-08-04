# Aerospace Unlimited — Design System

**Reference:** [fleet-template.webflow.io](https://fleet-template.webflow.io/) · probed 2026-07-27
**Supersedes:** the agentwork.com-derived Phase A tokens (backed up in `.backup-phase-a/`)
**Status:** implemented across the prototype

---

## How this was extracted

Two passes, and only one of them was useful — worth recording so nobody repeats the dead end.

`npx extract-design-system` returned almost nothing: **one** palette colour
(`rgba(255,255,255,0.15)`), the font name `Geist`, an unlabelled spacing list, and empty
radius and shadow scales. It missed the accent, both ink values, every border colour, the
type scale, the mono face, and the section rhythm.

Everything below came from a **direct computed-style probe** of the live page — walking every
rendered element and tallying actual `fontSize` / `fontWeight` / `lineHeight` /
`letterSpacing` / `color` / `backgroundColor` / `padding` / `gap` / `borderWidth`. Treat the
tool as a smoke test, not a source of truth.

---

## What actually creates the reference's character

Four things, in order of how much they matter. Miss these and matching the colours will not
save you.

> **Rules 2 and 3 were replaced at the client's direction.** The reference is flat and
> square; the client asked for Mona Sans, rounded corners and glass / light skeuomorphism.
> What survives from Fleet is the weight-400 type discipline and the enormous vertical
> rhythm. Both original rules are recorded below, struck through, because they explain what
> the reference looked like and therefore what we deliberately gave up.

**1. Everything is weight 400.** An 80px display heading is regular weight. So is a 14px
label. There is no bold anywhere in the type system. Emphasis comes from *size* and *case*,
never from weight. This is the single biggest departure from a conventional design system and
the fastest way to get the feel wrong. *Still in force* — the only exception is the homepage
feature headline and its lead card value, at 600/700.

**2. ~~No shadows. Anywhere.~~ → Glass and light skeuomorphism.** *(replaced)* The reference
had zero `box-shadow` values; elevation was 1px hairlines and flat background changes.
Surfaces are now translucent panes over an ambient ground, lit from above: a 1px white inner
highlight on the top edge plus a layered shadow beneath. Two constraints came out of this and
are load-bearing:

- **`backdrop-filter` is expensive.** It forces a compositing layer and re-filters every
  scroll frame. It goes on *bounded* surfaces only — header, dropdowns, cards, panels,
  drawer. Never on `.part-row`, which repeats 50+ times on a results page; those get the
  gradient and the shadow without the blur.
- **The ground exists so the glass has something to blur.** `--au-ground` lays three very
  low-opacity radial washes behind the page via `body::before`. Over a flat fill a
  translucent pane is just a lighter flat fill, and the whole device is wasted.

**3. ~~Corners are effectively square.~~ → Rounded, graded by surface size.** *(replaced)*
The reference's dominant radius was `1.6px`. The scale is now `xs 8 · sm 12 · md 16 · lg 22 ·
xl 28`, plus pill and circle, chosen so a badge and a panel read as the same family instead
of one uniform rounding everywhere. Full-bleed bands (`.hero`, `.page-header`,
`.section-dark`, `.site-footer`) stay square — a rounded corner on an edge-to-edge band has
no outer edge to sit against.

**4. ~~180px~~ → 116px of vertical section padding.** *(trimmed)* Sections still breathe —
116px is more than double what a conventional system would use — but Fleet is a marketing
template with four short bands, and this homepage has ten. At 180px top and bottom the page ran
9,456px tall with roughly 400px of content floating in the middle of most sections, which reads
as unfinished rather than spacious. The homepage is now **7,680px** with the same content, and
the bands compose as a page instead of drifting apart.

---

## Every homepage section gets its own treatment

The brief was that no two bands should look alike. Where sections shared a component they read
as the same section twice, so the shared ones were split:

| Band | Treatment | Why it differs |
|---|---|---|
| Hero | Full-bleed photo, glass search slab | The only photographic full-height band |
| The short version | Copy + CTAs beside one tall photo, stat record below | Only band pairing a display headline with a full-height image |
| Trust bar | Hairline-divided text, no pills | Compressed micro-band; a record, not chrome |
| Hot stock | Four featured part cards flanking a central photo | Only band with Instant RFQ on the homepage |
| Top NSN | Auto-scrolling photo rail, labels on scrim | Only band that moves |
| Top manufacturers | Featured stage: enlarged card + filmstrip | Only band with a selectable featured item |
| Top part categories | 4×3 tile grid, FSC chip, growing underline | Only tile grid |
| A leading supplier | Full-bleed accent band, divided list | Only coloured band |
| Other resources | Numbered 3×2 editorial cards | Only numbered set; cards are read, not scanned |
| Certifications | Dark closing band, pills | Only dark band before the footer |

Three of these were rebuilds rather than restyles:

**The NSN rail had rotated cards** (−2deg / +1.5deg / −1deg on alternating children). On screen
it read as a scrapbook of stickers — corners at three angles, captions stepping up and down the
baseline — and looked like a rendering fault. It is uniform and precise now, with the label on
the image behind a scrim so each card is one silhouette, and the rail is the only thing on the
page that moves. `.nsn-card` needs `position: relative`: the label is a *sibling* of the media,
so without it every card's label escaped to an ancestor and stacked in one spot.

**Manufacturers and Other resources both used the shared `ruleRow`.** At full width a single
column left the CAGE code stranded mid-line with the count a third of a screen from the name.
Resources became numbered cards — the numerals are earned, it is a complete set of capabilities
rather than a top-N sample. Manufacturers became a two-column directory, and then, at the
client's direction (2026-07-29), a **featured stage** built to a supplied reference: five
portrait cards on one shared bottom edge, the selected company enlarged upward, and its CAGE
code, name and part count set in the air the four short cards leave beside it. Selecting swaps
rather than reflows — the picked company trades places with the outgoing one, so two cards
change and three never move. Five, not the directory's eight: it is a top-N sample and the full
register is one click away at the lower right.

Two things about that band are load-bearing and easy to undo. Its geometry is **five `fr`
columns and two `aspect-ratio` values**, never a custom `--unit` length — a percentage inside a
custom property means the inline size in `grid-template-columns` and the block size in
`grid-template-rows`, and the block size there is indefinite, so the first build rendered
correct columns over collapsed rows. And the photography is **treatment, not evidence**: the
scenes are shared with the NSN rail and belong to no named company, so the enlarged card carries
no label at all and every factual element is catalog text. Do not add a caption to it.

**Categories used `auto-fit`,** which resolved to five columns and stranded a final row of two
beside three empty cells. Explicitly four columns divides twelve exactly.

**The trust bar was three white pills on a white band** — the least confident element on the
page, directly under the hero. Hairline-divided text reads as a statement of record.

---

## Colour

The palette is **sampled from the client hero photograph**, so the page and the picture are
one scene: cool navies for structure, hazy neutrals for surfaces. The page ground is
**`#F8F5F0`** (Warm Paper), a warm off-white echoing the light glow in the shot — the previous
system used a chroma-0 grey `#F2F2F2`.

**The palette is entirely cool, at the client's direction (2026-07-28).** An earlier version
of this system spent a warm amber — the runway lights — as its accent and CTA colour. There is
now no warm accent at all: the accent is **Steel Blue**, the most common colour in the
photograph, so buttons are drawn *from* the hero rather than set against it. Do not
reintroduce a warm accent to "lift" the page; the answer is depth (Deep Navy, Midnight), not
heat. The only warm hues that survive are the stock-status signals below.

### The palette by name

| Name | Value | Sampled from |
|---|---|---|
| Deep Navy | `#22406E` | Primary brand — nav, headings, dark bands |
| Midnight | `#14171F` | Foreground near-black — hero scrim, footer |
| Steel Blue | `#2F558B` | A third of the image — accent, links, secondary buttons |
| Silver Mist | `#B9BFCD` | The airframe — dividers, muted text on dark |
| Sky Steel | `#858BAB` | The haze — control borders |
| Warm Paper | `#F8F5F0` | The light glow — page ground |
| Horizon | `#A9C8F0` | The pale band of dusk sky — links on dark |
| Wash | `#D8E5F5` | Horizon at low strength — hover washes |

### Roles, with measured contrast

| Token | Value | Role | Ratio |
|---|---|---|---|
| `--au-bg` | Warm Paper | Page ground | — |
| `--au-surface` | `#FFFFFF` | Cards, rows, inputs | — |
| `--au-surface-alt` | `#EFEAE2` | Table headers, wells | — |
| `--au-surface-dark` | Midnight | Footer, hero scrim | — |
| `--au-surface-dark-alt` | Deep Navy | Dark bands, cards on dark | — |
| `--au-border` | Silver Mist | Decorative hairlines | 1.84:1 — decorative only |
| `--au-border-strong` | Sky Steel | **Control** outlines | 3.34:1 on white |
| `--au-ink` | Midnight | Body, UI text | 16.48:1 on bg |
| `--au-ink-heading` | Deep Navy | Display and headings | 9.53:1 on bg |
| `--au-ink-body` | `#333A45` | Body copy | 11.6:1 on bg |
| `--au-ink-muted` | `#5F6880` | Secondary, placeholder | 5.11:1 on bg |
| `--au-ink-inverse-muted` | Silver Mist | Secondary on dark | 9.72 Midnight / 5.62 Navy |
| `--au-link` | Steel Blue | Inline links on light | 6.91:1 on bg |
| `--au-link-inverse` | Horizon | Links on **dark** | 10.41 Midnight / 6.02 Navy |
| `--au-accent` | Steel Blue | Primary CTA, one band per page | — |
| `--au-accent-ink` | `#FFFFFF` | Text on accent | 7.52:1 |

### Three constraints that are easy to break by accident

**The accent is dark, so it takes white ink.** This is the reverse of the amber system it
replaced, where the accent was light and always took dark ink. Any rule painting dark text on
the accent band is a leftover from that system and is broken — `.empty-state` and
`.section-accent` are both accent grounds and both invert their buttons.

**Steel Blue on Midnight is 2.38:1 — it fails.** A link on a dark ground takes
`--au-link-inverse` (Horizon), never the accent. `.site-footer` counts as a dark ground and is
listed in the dark-context rules in `ux.css` alongside `.hero`, `.page-header` and
`.section-dark`.

**Silver Mist is not a text colour on light, and not a control border.** At 1.69:1 on the page
ground it is a decorative hairline only. Boundaries a user has to find — inputs, selects,
checkboxes — use `--au-border-strong` (Sky Steel, 3.34:1), which clears the 3:1 that
WCAG 1.4.11 asks of UI components.

### Stock-status semantics

A logistics marketing template has no need for in-stock / limited / quote-only; a parts
catalog does. These are the **one place warm hues survive**, and deliberately so: red / amber
/ green is a learned convention for stock state, and recolouring "Limited" to a blue would say
nothing to a buyer scanning a results page. Each is always paired with its word rather than
carrying the meaning alone.

| Token | Value | On `#F8F5F0` |
|---|---|---|
| `--au-stock-in` | `#1F6F4A` | 5.63:1 |
| `--au-stock-limited` | `#7A5200` | 6.36:1 |
| `--au-stock-out` | `#A32B12` | 6.63:1 |

### Colour strategy

**Committed.** One colour carries a whole section plus the primary button — the Fleet
reference drenches an entire full-bleed band for its differentiator moment and uses it nowhere
else but the CTA. That structure is kept; only the hue changed. Steel Blue appears on the
primary button and on **one** section per page, maximum. Everything else is navy, neutral and
photography.

Verified with a scripted audit over all fifteen pages, comparing every text element's computed
colour against its effective background: **zero WCAG AA failures**.

---

## Typography

**Mona Sans** + **Fragment Mono**. A real contrast pair — grotesque against mono, not two
similar sans faces. Both are SIL OFL and on Google Fonts.

Mona Sans replaces the reference's Geist at the client's request. It is a variable font
imported across its full `200..900` range, so the 600/700 used by the feature headline are
real cuts rather than synthesised bolds — faux-bolding a grotesque at display size smears the
terminals. It also sits slightly wider and rounder than Geist, which suits the rounded, glassy
direction.

### Type and button metrics come from eleken.co

Probed 2026-07-28 at the client's request: *"I want the typography and the button
styles to be as they are in this website."* Their faces are **Regolapro** (display) and
**Inter** (body). Regolapro is a commercial licence and the client has separately required Mona
Sans, so what was adopted is the **metrics**, applied to Mona Sans — sizes, weights,
line-heights and tracking, not the letterforms.

| | eleken.co (measured) | Ours |
|---|---|---|
| h1 | 52px / 500 / −1.5px / lh 57.98 | `--au-text-h1` 52px / 500 / −0.029em / 1.115 |
| h2 | 32px / 500 / −0.64px | 32px / 500 / −0.02em |
| h3 | 22px / 500 / −0.44px | 22px / 500 / −0.02em |
| h4 | 18px / 500 / −0.18px | 18px / 500 / −0.01em |
| Body | 15px / 400 / normal / lh 25px | 15px / 400 / normal / **1.667** |
| Small | 14px / 400 / lh 20px | 14px |
| Button | 13px / 500 | `--au-text-btn` 13px / 500 |

Two of these mattered more than the sizes. **Headings are weight 500, never 700** — this
replaces Fleet's weight-400-everywhere rule, which in Mona Sans came out thin and unresolved at
display size, especially over the hero photograph. And **body is 15px at lh 1.667**: small text
with generous leading. The old 18px/1.45 was the opposite trade and read heavier for less
comfort. Nothing on the page now exceeds **52px**, because nothing on eleken's does; the old
ceiling was 80px.

**Buttons, measured:** 36px tall (40px large), **10px** radius, 13px at weight 500, sentence
case, `letter-spacing: normal`, **16px** horizontal padding, and **no shadow**. Filled is a flat
colour block — the accent sheen gradient is gone from buttons. Outline pairs a light fill with a
1px hairline, exactly as eleken pairs `#F9F7F3` with `1px #E4E4E4`.

The no-shadow part is a deliberate departure from this system's own skeuomorphism, and the line
is: **glass and lift stay on surfaces, controls are flat.** If a raised pill sits next to a
raised card next to a raised badge, all three flatten — when everything lifts, nothing reads as
lifted. eleken's buttons are flat and they are the crispest thing on their page.

### The radius scale, and the concentric rule

eleken's radii are far tighter than what was here: **10px on 77 elements and 6px on 55** are
effectively the whole system, with 14px and 16px used once each and **nothing above 16px
anywhere**. Ours ran to 22px on cards and 28px on the hero slab, which is what read as
over-rounded. The scale is now `xs 6 · sm 10 · md 12 · lg 16`, with 16px as a hard ceiling.

**When one rounded box sits inside another, the inner radius must equal the outer radius minus
the inset.** Break it and the inner corner cuts visibly across the outer arc.

This was the page's most conspicuous defect. The hero search field was **70px tall with a 28px
radius, holding a 12px-radius submit button inset 7px**. The concentric requirement was
28 − 7 = **21px**; at 12px the button's corner was 9px too tight and its straight edge sliced
clean through the field's curve at both right-hand corners. The header's compact field had the
identical fault at a smaller scale — a 10px button inset 4px inside a 10px field, where 6px was
required.

Both are now derived rather than guessed:

```
hero field   66px tall, radius 16px   (the scale ceiling)
hero button  52px tall, radius 10px   (eleken's button radius)
inset         6px  →  16 − 6 = 10 ✓

header field radius 10px
header button radius  6px  →  10 − 4 = 6 ✓
```

Change any one of the three values and the other two have to move with it. There is a check for
this in the prototype's audits — see *Verification* below.

### The category coverflow

Built to a supplied reference (a tinted panel, a focused centre card, neighbours
falling back and dimming, circular prev/next beneath). Two things in that reference
were deliberately **not** taken:

- **Its cards are photographs.** We hold eight generic aviation images for twelve
  categories, so every mapping would be arbitrary — a flight-deck photo on "Seals,
  Gaskets & O-Rings" asserts the picture shows that category's parts. **The FSC code
  is the visual anchor instead**: real, unique per category, and genuinely how a buyer
  working from a government parts list navigates. Icons are schematics of the part
  type, which is a claim we can actually make.
- **Its floating avatar pills** ("Own anywhere 💙") are that product's consumer-social
  voice. On a distributor selling export-controlled parts to MROs they read as pasted in.

**Four numbers are derived, not chosen.** Break one and the others must move:

```
card width 246 · rank-1 scale 0.9 · card padding 18 · GAP 232
  rank-1 text starts at  GAP − (246×0.9/2) + (18×0.9)  =  GAP − 94.5
  must clear focused half-width 123  →  GAP > 217.5
```
At GAP 168 the neighbour's text sat under the focused card and rendered as
"ydraulic Actuators / I650" — partial occlusion reads as broken text, not as depth.
The reference gets away with it because a cropped photo still reads as a photo.

**Rank 2 is depth, not content.** At 0.3 opacity and 1.5px blur its headings stayed
legible, and since each rank overlaps the one in front, two sets of category names
crossed each other. It runs at 0.14 with a 3px blur so it reads as a receding edge.

**Three bugs here only reproduce with a real pointer** — all three passed under
synthetic events, and they are the ones to re-check after any change:

1. **Native link drag.** The cards are `<a>` elements, and Chromium starts a link
   drag on mousedown-plus-move over an anchor. That pre-empts the pointer stream:
   exactly one `pointermove` arrives, then `pointercancel`, and the swipe silently
   does nothing. Fixed with `draggable="false"` plus a `dragstart` preventDefault.
2. **Focus beats click.** A real click focuses the anchor *before* firing `click`, so
   the `focusin` handler had already advanced the index — the guard then saw
   "already active" and let a 30%-opacity card navigate. Fixed by comparing against
   the index snapshotted at `pointerdown` (`pressIndex`).
3. **A gesture is not a click.** `click` fires whenever down and up land on the same
   element, however far the pointer travelled — so a vertical swipe to scroll the
   page that started on a card navigated away. Any press that moves >8px in either
   axis is swallowed (`movedSincePress`).

**Motion safety.** No card starts at `opacity: 0` or `display: none` waiting for a
script, a transition, or an observer. Before `[data-ready]` the track is a real
horizontal scroller and the controls are hidden because they would do nothing. That
covers the pre-upgrade frame and a controller that throws after render — it does
**not** survive JS being disabled, because the cards come from `AU_DATA`, as does
every other section on this page.

### Mono is for data, Mona Sans is for everything else

**This is the dividing line, and it was drawn in the wrong place at first.** Fragment Mono had
spread to 135 elements — nav links, buttons, eyebrows, breadcrumbs, badges, section labels,
footer headings. The page read as a terminal, and the client's note was blunt: the font *has*
to be Mona Sans. Mono is now scoped to **32 fewer rules** and appears only where a buyer
compares characters or aligns figures:

| Mono | Mona Sans |
|---|---|
| Part numbers (`MS21042L3`) | Buttons, nav, links |
| NSN / NIIN / CAGE / FSC codes | Eyebrows, labels, badges |
| Quantities in a column (`4,820 EA`) | Section heads, captions, body |
| The phone number | Table headers, footer headings |

Two judgement calls inside that: **counts are not identifiers.** A "184,320 parts" figure is a
quantity, so it takes Mona Sans with `tabular-nums` — the column still aligns, and Fragment
Mono's full-width comma had been rendering `184,320` visibly gapped. And **the search input
stays mono**, because what a buyer types into it is a part number.

### Buttons are sentence case, not uppercase

Uppercase at `0.06em` tracking made a two-word label roughly 40% wider than it needed to be,
and 48px tall. Two of them side by side in a part row out-shouted the part number the row
exists to show. Now: sentence case, weight 500, **38px** default (32 small, 46 large), tracking
`−0.005em`. `.btn-lg` came down from 58px.

There is also a new `.btn-text` — a link-weight button for *secondary* actions. A part row
previously carried two filled slabs, so it read as two competing decisions; now "Instant RFQ"
is the only filled control and "Add to quote" sits beside it as quiet text. Its confirmed state
changes colour and gains a tick rather than gaining weight, because promoting the secondary
action to a filled button inverted the row's hierarchy the moment the buyer used it.

Mono is not decorative here: it carries uppercase labels, eyebrows, part numbers, NSN/NIIN/
CAGE codes and quantities, and must be set with `tabular-nums` so digits align in columns.

### Scale

Measured from the reference, normalised to rem at a 16px base.

| Role | Size | Weight | Line-height | Tracking | Case |
|---|---|---|---|---|---|
| Display | `clamp(2.75rem, 6vw, 5rem)` | 400 | 1.05 | −0.035em | — |
| H1 | `clamp(2.25rem, 4.5vw, 3.5rem)` | 400 | 1.1 | −0.03em | — |
| H2 | `clamp(1.75rem, 3vw, 2.5rem)` | 400 | 1.15 | −0.025em | — |
| H3 | `1.5rem` | 400 | 1.3 | −0.02em | — |
| H4 | `1.125rem` | 500 | 1.3 | −0.015em | — |
| Body | `1.125rem` | 400 | 1.45 | −0.01em | — |
| Body small | `1rem` | 400 | 1.45 | −0.01em | — |
| Label (mono) | `0.9rem` | 400 | 1.3 | `0.06em` | uppercase |
| Caption | `0.8125rem` | 400 | 1.35 | 0 | — |
| Code / part no. | `0.9375rem` | 400 | 1.35 | 0 | mono, tabular |

### Three deliberate departures

**Tracking floored at −0.035em.** The reference runs −0.05em on display (−4px at 80px). At
that value adjacent letters touch. −0.035em is visually indistinguishable at a glance and
keeps the counters open.

**Body line-height raised 1.3 → 1.45.** The reference sets body at 1.3, which is fine for
its short marketing blocks but too tight for the spec tables, quality documentation and
capability copy this site carries. UI text stays at 1.3.

**One weight-500 role added.** Weight 400 everywhere is right for a marketing template with
almost no interface. This site has forms, tables and part rows where a label must separate
from its value — H4 and form labels use 500. Display and headings stay at 400.

---

## The feature-card section

This *was* the site's one sanctioned exception: soft 24px cards, a raised and shadowed lead
card, and a heavy headline, against a site that was otherwise flat and square. The move to
rounded corners and glass dissolved most of that exception — those are now the shared system.

What is left, and still worth protecting:

1. **The raised/flat contrast is the device.** Only the lead card gets the strong pane and the
   deep shadow; the other three sit nearly flat. Give all four a shadow and the emphasis
   disappears. Note that "flat" can no longer mean *transparent* — with glass as the default,
   three transparent cards next to one glass card read as unstyled, so they carry the faintest
   pane instead.
2. **The heavy headline.** 600/700 here is the only place the weight-400 rule bends.
   `--au-weight-semibold` and `--au-weight-bold` exist for this block; using them elsewhere is
   how the type discipline erodes.
3. **The weights are real cuts.** The Mona Sans import in `ux.css` requests the variable
   `200..900` range. Synthesised bold smears the terminals of a grotesque at display size — if
   the import is ever narrowed, the headline degrades silently rather than failing loudly.
4. **`--au-radius-card` / `--au-radius-card-sm` are now aliases** onto the shared `lg` / `md`
   steps. They are kept only so this block's declarations still read by intent; they no longer
   mark anything exceptional.

Copy note: the section's eyebrow, headline and paragraph are lifted verbatim from the about
page, and its four facts are the ones the section already carried. Nothing was written for
it, per the no-invented-content rule.

---

## Spacing

A **9px base**, taken straight from the reference's tallied padding and gap values
(4.5 / 9 / 13.5 / 18 / 27 / 36 / 54 / 90 / 144 / 180).

```
--au-s-1: 4.5px     --au-s-6:  36px
--au-s-2: 9px       --au-s-7:  54px
--au-s-3: 13.5px    --au-s-8:  90px
--au-s-4: 18px      --au-s-9:  144px
--au-s-5: 27px      --au-s-10: 180px
```

Most-used: **27px** (dominant gap), 18px, 9px, 54px.

**Section rhythm** is the signature. Desktop sections are `180px` top and bottom; that cannot
hold on a phone, so it is fluid:

```
--au-section-y: clamp(72px, 11vw, 180px);
```

Full-bleed photography sections take **zero** padding and run edge to edge.

---

## Form, border, elevation, motion

```
Radius        xs 8px   badges, kbd hints, tiny inputs
              sm 12px  buttons, inputs, controls
              md 16px  dropdowns, checks, notices, part rows, icon tiles
              lg 22px  cards, panels, media, drawer
              xl 28px  hero search slab
              pill 999px · circle 50%
              (full-bleed bands stay square — no outer edge to sit against)

Glass         --au-glass-fill / -strong            translucent pane, gradient not flat alpha
              --au-glass-fill-dark                 0.07 max — a CONTRAST CEILING, see below
              --au-glass-blur   blur(20px) saturate(180%)
              --au-glass-blur-sm blur(12px) saturate(160%)
              --au-ground                          the ambient wash the glass blurs

Elevation     --au-inner-top                       1px white top edge = light from above
              --au-shadow-xs…xl                    layered: contact + wide, navy-tinted
              --au-raised / -md / -lg / -xl        highlight + shadow as a matched set
              --au-recessed                        inputs — a well, not a raised surface
              --au-pressed / -soft                 :active — loses shadow, takes inset shade
              --au-accent-sheen                    darkens DOWN the face, see below

Container     1600px page · 900px prose · 620px narrow   (page gutter max(27px, 2.5vw))
Motion        180ms / 420ms · cubic-bezier(0.16, 1, 0.3, 1)   (ease-out-expo)
Z-index       dropdown 100 · sticky 200 · backdrop 300 · modal 400 · toast 500 · tooltip 600
```

### The glass border is a navy hairline, not white

`--au-glass-border` was `rgba(255,255,255,0.78)`. A white border on a 0.88-white pane sitting on
`#F8F5F0` has nothing to contrast against, so **every card on the page was edgeless** — they
read as pale ghosts with no containment, which is most of why the homepage looked washed out.
It is now `rgba(var(--au-tint-rgb), 0.14)`, a faint navy hairline. The *lit top edge* is what
wants to be white, and that is `--au-inner-top`'s job. Keep the two separate: one says where
the light is, the other says where the card stops.

### Any rule that recolours a button must also clear its fill

`.btn-quiet` and `.btn-aog` carry a solid `--au-surface` fill on light grounds. The dark-ground
and accent-ground overrides repainted only the *text*, which produced a white label on a white
pill — **1.00:1, completely invisible** — in the footer, on the accent band, and in every
`.empty-state`. It had been latent: the fill used to be a gradient, which left `backgroundColor`
transparent and let the band show through. Both override blocks now set `background:
transparent`. If a light-ground fill is ever added to these classes, it has to be cleared in
both places too.

### Two values that are contrast ceilings, not preferences

Both were measured, both failed at their first value, and both are easy to "improve" straight
back into a WCAG failure.

**`--au-accent-sheen` darkens toward the bottom instead of lightening the top.** Accent is
Steel Blue and takes *white* ink. A conventional white top sheen destroys legibility exactly
where the label sits: on `#2f558b` a 0.42 white overlay drops white-on-accent to **2.80:1**,
and even 0.24 only reaches 4.16:1 — both fail AA. Shading the lower half instead moves
contrast the safe way (**8.13:1**) and still reads as lit from above, since an overhead light
is what puts the bottom edge in shade. The 0.10 white at the very top is the safe ceiling
(5.84:1). If the accent ever becomes a *light* colour taking dark ink, this inverts —
re-measure before touching either stop.

**`--au-glass-fill-dark` is capped at 0.07.** A dark pane lightens the band beneath it, which
eats the muted-text headroom the palette guarantees. Silver Mist on Deep Navy is 5.62:1 bare;
over this fill it falls to 4.63:1 at 0.07 and **3.85:1 at 0.13**, which fails AA for small
text. Deep Navy is the binding case because it is the lightest dark surface — Midnight has
room to spare. Raise it and the muted captions on every dark card and hero chip go under.

Motion is ease-out exponential, no bounce or elastic, with a `prefers-reduced-motion: reduce`
alternative throughout.

**There are deliberately no scroll-triggered section reveals**, and the reason is measured
rather than stylistic. An IntersectionObserver was built, shipped, and then removed after
testing showed **its callbacks are never delivered in this project's renderer at all** — a
fresh observer on an off-screen element produced no entries. Every one of the 15 revealed
sections was left permanently at `opacity: 0`. CSS animations were then found not to advance
either, which means `animation-fill-mode: both` holds its `from` keyframe indefinitely.

Two rules came out of that and both are load-bearing:

1. **Never gate content visibility on an event.** Anything that starts hidden and waits for
   JS or a scroll ships blank to crawlers, screenshot pipelines, background tabs and
   no-JS visitors.
2. **Never animate a property whose failure state is "gone."** The hero entrance animates
   `transform` only. If it never runs, the copy sits 12px lower than intended — fully legible.
   Had `from` included `opacity: 0`, the hero would have shipped invisible.

Motion therefore lives where it cannot strand anything: the hero's load entrance, and
interaction — hover, focus, nav panels, toasts, field states, row and card hovers.

---

## Imagery

Photography is a primary material, not decoration — the reference opens on a full-bleed
aerial of a freight yard and returns to full-bleed imagery between content bands.

Direction for this site: aircraft on stands, hangar and MRO interiors, parts stores, and
close shallow-depth shots of assemblies (turbines, landing gear, actuators). Industrial and
documentary, never stock-photo-cheerful, never people-shaking-hands.

### Hero — client-supplied

`prototype/assets/img/hero.jpg` — an A320 taxiing at dusk with motion blur, control tower and
terminal lights behind. Source `shutterstock_2082279061.jpg` at 4600×3067, resampled to
**2400×1600 (316 KB)** with a **1200×800 (96 KB)** variant swapped in under 760px.

Two things about this image drove real CSS decisions, and both are worth knowing before
replacing it:

- **The crop is biased to 58% across** (66% on mobile), not centred. The frame is wider than
  the 3:2 source, so `cover` crops horizontally; centring parked the empty mid-fuselage in the
  middle of the composition and pushed the nose and tower out of view.
- **The scrim is a single diagonal**, bottom-left to top-right. The photograph's brightest
  region — the white fuselage — runs straight through where the hero copy sits, so white text
  needed a guaranteed floor there. Crossing a horizontal and a vertical scrim (the first
  attempt) multiplies opacity in the shared corner, drove the bottom-left to ~0.96 black, and
  flattened the photo into a box. Hero body copy also runs at 0.88 white rather than the
  0.66 used on flat dark surfaces.

Mid-page media band is still an Unsplash placeholder. Swapping either is a URL change.

**Licensing:** the hero is a Shutterstock asset. Confirm the licence covers web/commercial use
at this resolution before launch — the file arrived unwatermarked, which suggests a licensed
download, but that is an assumption rather than something verified here.

---

## Files

- `design-system/tokens.css` — CSS custom properties (regenerated from this doc)
- `design-system/tokens.json` — machine-readable
- `prototype/assets/ux.css` — the implementation
- `.backup-phase-a/` — the superseded agentwork-derived token set
- `.extract-design-system/` — raw tool artifacts (low value, see above)

## Open items

- **Fonts load from Google Fonts** in the prototype for immediate fidelity. Both faces are
  SIL OFL, so self-hosting is the production path — no licensing blocker either way.
- **Dark sections** use Midnight `#14171F`, with Deep Navy `#22406E` for raised surfaces on
  dark. A full dark-mode pass is not defined and should be a deliberate exercise, not an
  inversion.
- ~~Confirm the client is happy inheriting a **yellow** accent from the reference~~ —
  **resolved 2026-07-28.** The palette is now sampled from the client's own hero photograph and
  is entirely cool; the accent is Steel Blue. See **Colour** above.

---

## The inner pages (2026-08-04)

Six routes, scraped from the live site and rebuilt on this visual system.

| Route | Live source | Mode |
|---|---|---|
| `/browse` | `/part-types/`, `/fscs/`, `/manufacturers/`, `/nsn-parts/`, `/niin-parts-inner/`, `/cage-codes/` | Persuade → Operate |
| `/browse/manufacturers` | `/manufacturers/` | Operate |
| `/browse/aircraft` | "Parts by Aircraft / Helicopter Model" | Operate |
| `/browse/<axis>/<id>` | the listing tables behind all of the above | Operate |
| `/capabilities` | `/gse-tooling/`, `/pma-parts/`, `/pma-supplements/`, `/salvaged-aircraft-parts/`, "Aircraft Repair Capabilities" | Read → Persuade |
| `/blog`, `/blog/<slug>` | `/blog/` and its 5 pages of posts | Read |

### What the live IA got wrong, and what was kept

Six of the live site's ten top-level nav slots are identifier lookups with nothing
anywhere explaining which to pick — a database schema handed to the buyer. Nothing
was removed; the choice is made on one page instead, and each route is restated as
an answer to the only question the buyer can answer: **what do you have in front
of you right now?** The four routes lead with "You know what the part does", not
with "Part Types".

Three live devices were replaced rather than restyled:

**The identifier pages assume you already know what the digits mean.** A buyer who
has only ever called it "the part number" learns nothing from a page titled NIIN.
So `/browse` takes one real NSN apart — `5310-00-877-5797`, the self-locking nut
`MS21042L3` — with brackets under the FSC and the NIIN. It is the site's only
diagram, and it earns that because the relationship *between* two identifiers is
the content: the NIIN is literally inside the NSN, and no prose makes that as clear
as a bracket does. **The digits, both brackets and both labels sit on one shared
four-column grid**, so a bracket physically cannot drift off the digits it
describes; getting that span wrong is the one way this diagram could teach
something false. The whole thing is `aria-hidden` with a plain sentence beside it —
read aloud, the brackets came out as a scatter of disconnected digits.

**Part types and FSCs were an A–Z of link text and nine pages of pagination.**
Neither says which groups we are actually deep in, which is the question behind
"do you carry this?". They are one register now, ordered by catalogue depth, each
row drawing its count as a bar proportional to the deepest category. The bar is
decoration and the figure is printed beside it in text.

**The blog was five pages of twenty identical rows.** "Showing 1 of 5" tells a
reader nothing about pages 2–5, so nobody goes. It is three registers instead: one
featured lead (always the newest — a rule, not an editorial pick), cards for the
articles held in full, and a dated archive register grouped by year for the rest.

### Two things the pages refuse to do

**No photography per aircraft platform.** The library holds generic aviation
scenes and not one is a photograph of a 737, a CRJ or a Black Hawk. A generic
airliner under "Sikorsky UH-60" is not ambient treatment, it is a false claim
about what the picture shows. `/browse/aircraft` is typographic; one wide
flightline scene carries the page and claims nothing about any row.

**The results page states the sample against the catalogue.** `lib/data.ts` is
sixteen lines; a category claims 94,210. Printing the big number over four rows
reads as a broken query, so the bar says "2 lines shown of 94,210 in the
catalogue" and the sidebar says the listing is a sample.

### The banned phrase

It appears verbatim on the live `/salvaged-aircraft-parts/` page, the
`/cage-codes/` page, and inside the closing promo paragraph of the aluminium
forming article. It is nowhere here. The underlying story is expressed as
documented provenance and stated eligibility — the part a buyer can audit. Every
article's closing promo paragraph was dropped (the page carries a designed CTA
instead), which removes it structurally rather than by hand-editing prose. See
au-banned-phrase.

### Motion: `CueReveal`, not `ScrollReveal`

`ScrollReveal` arms every `[data-reveal]` on mount and blanket-reveals 2s later so
no band can ship blank. On the homepage that is fine. These pages run six to nine
bands deep, so the failsafe fires while band five is four screens away and every
reader arrives to a section that finished animating without them — the bug
`EdgeReveal` was written to fix on the about page. `CueReveal` generalises that
fix: an element carries `data-cue` and plays when **it** crosses its own trigger
line, with `data-cue-vh` and `data-cue-ms` to tune it. No blanket failsafe is
needed, because nothing is armed until it is nearly on screen.

The same contract holds throughout and is the reason any of this is safe: **the
landed state is the stylesheet's default.** Every rule that displaces, clips or
fades sits behind `[data-cue-state="armed"]`, written only by client JS from inside
a real frame. Both scroll-linked properties (`--rail-p`, `--read-p`) fall back to
their *finished* value, so an unset property is a drawn spine and never a missing
one. Bars and brackets `scaleX`; they never animate `width`.

**Verified running, and one bug that only measurement found.** The transitions were
first declared on the base `[data-cue]` selector, which breaks the two-frame
arm-then-play flip the whole mechanism rests on: arming an element whose transition
is already live does not *snap* it to the start offset, it begins animating toward
that offset — and one frame later the flip to `"in"` reverses it. Measured on the
NSN diagram, the bracket read `matrix(1,0,0,1,0,0)` at the instant of arming and was
fully drawn 540ms later, so the entrance was a wobble rather than an arrival. Every
transition is now scoped to `[data-cue-state="in"]`; armed has none and snaps.

With that fixed and measured against `next start`: the NSN band arms, snaps its
brackets to `scaleX(0)`, plays 34 concurrent transitions and clears its own
attribute; `LineRail` writes `--rail-p` and marks the current line; `ReadProgress`
writes `--read-p`; `IndexFilter` filters, recounts and shows its empty state. After
every run finishes, nothing anywhere is left below full opacity or clipped, in
either motion mode.

**A note on how not to diagnose this.** An earlier pass concluded this renderer
delivers no IntersectionObserver callbacks and advances no CSS animation. That was
wrong on both counts, and the cause is worth more than the claim: `next dev`
compiles a route on first request, and a page measured during that compile has no
client JS yet — every probe reads as a dead environment. Add a stale `.next` from a
production build run against the same directory and it is indistinguishable from a
hydration failure. Measure against `next start`, or warm the route and re-probe. See
au-motion-safety and au-dev-compile-race.

### Three defects found by measuring, not by looking

**`.imast` was not registered as a dark ground.** The stylesheet's own comment says
adding a dark surface means adding it to the `:is()` groups once rather than
hunting for fifteen scattered overrides — and that had not been done, so the
masthead's eyebrow took Steel Blue (2.2–3.4:1) and the breadcrumb took
`--au-ink-muted` (1.6–3.5:1). `.breadcrumb` paints its own colour and was in no
group at all, which is a fault `.page-header` shares latently; the fix went in the
group.

**The scrim's angle was wrong for the copy it protects.** At 38deg the darkest
region sat bottom-left while the breadcrumb and eyebrow sit **top**-left. A pass
that hides each text element and samples the brightest rendered pixel behind it
found real failures on both. At 78deg the ramp is near-horizontal, so the whole
left column sits on the plateau and the right side keeps the photograph — still one
gradient, because crossing two multiplies opacity in the shared corner.
Re-measure with the same pass before touching any stop.

**The eyebrow was a 1,368px-wide box.** `.eyebrow`'s `align-self: flex-start` is
inert in a block container, so the element reached across the bright side of the
photograph. Sloppy geometry, and it is what a contrast pass measures:
`width: fit-content`.

Verified over all twelve new URLs at 1440/768/390: **zero WCAG AA text failures,
zero JS errors, no horizontal overflow.** Masthead type over photography measures
9.7–16.1:1.

### Still dead links

`/rfq`, `/quality`, `/part/<pn>` and `/search` are linked from these pages and from
the homepage, about and contact, and do not exist yet. `prototype/rfq.html`,
`quality.html`, `part.html` and `search.html` hold their UX.

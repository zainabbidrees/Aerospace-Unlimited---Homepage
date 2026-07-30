# Aerospace Unlimited — Prototype

**Stage:** Phase C · UX complete, visual system applied
**Built on:** the Draft 2 IA (Structure & Flows) and the visual system in [`../design.md`](../design.md)
**Visual reference:** [fleet-template.webflow.io](https://fleet-template.webflow.io/) — layout and
rhythm only; surfaces and palette have since been redirected by the client
**Date:** 2026-07-28

> **The visual layer is no longer neutral.** Mona Sans + Fragment Mono at weight 400, glass and
> light skeuomorphism (translucent panes over an ambient ground, lit from above), corners graded
> 8–28px, a 9px spacing base with a fluid 180px section rhythm, full-bleed photography, and
> exactly one accent band per page. Read `../design.md` before changing any of it — several of
> those choices look arbitrary and are not.
>
> **The palette is sampled from the hero photograph and is entirely cool** (client direction,
> 2026-07-28): Deep Navy `#22406E`, Midnight `#14171F`, Steel Blue `#2F558B`, Silver Mist,
> Sky Steel, Warm Paper `#F8F5F0` ground. **The accent is Steel Blue and takes white ink** — an
> earlier version of this system used a warm amber accent that took dark ink, so treat any
> comment mentioning "amber" or "dark ink on the accent" as stale. The only warm hues left are
> the stock-status signals. Three traps are documented in `../design.md`: Steel Blue on Midnight
> fails (links on dark use Horizon), Silver Mist is not a control border (use Sky Steel), and
> `.site-footer` counts as a dark ground in the `ux.css` context rules.
>
> Verified by a scripted contrast audit over all fifteen pages — every text element's computed
> colour against its effective background — with **zero WCAG AA failures**.
>
> The **hero is client photography** — `assets/img/hero.jpg` and `hero-sm.jpg`, built from
> `assets/img/hero-source-original.png` in its **original orientation** (not mirrored: a flipped
> airframe puts doors, engine and gear on the wrong side). **The hero copy sits in a left-hand
> column**, so the crop is biased to 58% to carry the aircraft and tower into the right half, and
> the scrim ramps to the bottom-left to match. Those three things — crop bias, copy column, scrim direction — are one
> decision; changing any one means changing all three. See the `.hero-media`, `.hero-scrim` and
> `.hero > .u-page` comments in `assets/ux.css`. Remaining imagery (the mid-page band) is still an
> **Unsplash placeholder**, replaced by URL swap.

---

## How to run it

```bash
cd "/Users/zainab.idrees/Documents/Structure- Aerospace Unlimited" && python3 -m http.server 4173
```

Then open <http://localhost:4173/prototype/index.html>.

Serve from the **project root**, not from `prototype/` — the stylesheet imports
`design-system/tokens.css` from one level up, so the tokens are a single source of truth
rather than a copy that drifts.

---

## What this is, and what it deliberately is not

Every page is real and clickable: search actually searches, filters actually filter, the
quote list actually persists across pages and tabs, forms actually validate. The flows can
be walked end to end and tested with a real buyer.

The **visual design is no longer bare.** That was true of the Phase B build, which used the
tokens for spacing and hierarchy only and made no identity decisions. The agreed sequence —
settle the UX, then apply UI from your references — has now run its second half: glass
surfaces, graded radii, client hero photography and a palette sampled from that photograph.
Phase A's flat token set is archived in `../.backup-phase-a/`.

> **Content rule observed throughout:** the banned sourcing phrase carried by the current
> live site's footer badge appears nowhere in this build. The underlying sourcing story is
> expressed instead as US-based fulfilment under full export-control compliance (ITAR/EAR).

---

## The four decisions this build encodes

| Decision | Chosen | Consequence in the build |
|---|---|---|
| RFQ model | Persistent quote list **plus** 1-click instant RFQ | Header tray with live count; every part row has both actions |
| Accounts | Anonymous only, no login anywhere | Email is the only required contact field; stated explicitly on every form |
| AOG | Persistent header entry point **plus** urgency flag | `AOG 24/7` phone link in header and mobile bar; AOG checkbox on every RFQ. No standalone AOG page |
| Deliverable | Clickable prototype, full visual system applied | This directory |

---

## Pages

| File | Role | Priority |
|---|---|---|
| `index.html` | Home — search-first, routes to search or browse in one move | P0 |
| `search.html` | Results, filters, and the zero-result recovery state | P0 |
| `part.html` | Part detail — the convergence point every path leads to | P0 |
| `rfq.html` | The RFQ form — single part, multi-line, or paste-a-list | P0 |
| `confirmation.html` | Receipt, reference number, concrete ETA, next actions | P0 |
| `quote.html` | Full-page quote list review | P0 |
| `browse.html` | Catalog hub — the six identifier routes, in plain language | P0 |
| `browse-category.html` | Generated list template (category / manufacturer / aircraft / FSC) | P0 |
| `browse-manufacturers.html` | A–Z manufacturer index with CAGE codes | P0 |
| `browse-aircraft.html` | Aircraft platform index | P0 |
| `quality.html` | Quality & certifications — serves the vetting buyer | P1 |
| `capabilities.html` | Other Resources — GSE, PMA, repair, salvage | P1 |
| `about.html` | Company | P1 |
| `contact.html` | Contact, with quote-intent routed to the RFQ | P1 |
| `blog.html` | Blog index — stub, kept because it is in the live nav | P1 |

---

## Fidelity to the existing site

**Rule: every section here exists on aerospaceunlimited.com today.** Nothing is invented.
What changes is order, grouping and labelling — not the content inventory.

### Homepage section mapping

| This build | On the live site |
|---|---|
| Hero + search | Existing hero + existing search bar |
| Four feature points | Existing: Same Day Shipping · Quotes · AOG Service 24/7 x 365 · Competitive Prices |
| Certifications strip | Existing value-prop badge row |
| Hot stock items | Existing section, **crossed** with the live site's "Parts by Aircraft / Helicopter Model" — the rows are the same in-stock parts, tabbed by airframe rather than listed flat. Both are live sections; no new content |
| Top NSN | Existing section — same eight NSNs, presented as a drifting marquee of cards instead of a text list. The photography is client-supplied ambient imagery paired to each NSN's system; it does not depict the parts |
| Top manufacturers | Existing section |
| Top part categories | Existing section, **merged** with the separate 15-tile category grid lower down the live page — same destinations, shown once |
| Other resources | Existing section and nav dropdown, same items |
| A leading supplier… | Existing section, including its four bullet points |
| Certifications & memberships | Existing section |

### Footer

Carries the live site's own sections verbatim: Get in Touch · Company Information ·
Policies · Terms & Conditions · Quick Links · Follow Us · We Accept, plus the Intrepid
Fallen Heroes Fund block and the customer satisfaction survey.

### Navigation

The live nav has ten top-level items. Six of them — Manufacturers, FSCs, NIIN, NSN, Part
Types, CAGE Code — are the same task, so they collapse into one **Catalog** hub that still
contains every one of them. Quality moves to the footer, which is where the live site keeps
it too.

| Live nav | Here |
|---|---|
| Manufacturers · FSCs · NIIN · NSN · Part Types · CAGE Code | **Catalog** |
| Other Resource | **Other Resources** |
| Blog | **Blog** |
| About Us | **About Us** |
| Contact Us | **Contact Us** |

Nothing is lost — the choice is made on one page instead of in the nav bar.

### Removed from an earlier draft of this prototype

These were invented rather than taken from the live site, and have been deleted:
a three-step "how it works" section; a "why procurement teams keep us on the AVL" benefit
block that had displaced the site's own four feature points; a "paste a parts list" closing
CTA; and a standalone `aog.html` page.

`assets/ux.css` · `assets/app.js` · `assets/data.js` are shared. The header, footer, quote
drawer and mobile bar are injected by `app.js`, which guarantees the persistent elements are
byte-identical on every page.

---

## The twelve UX decisions that matter

### 1. One search field, six identifier types, automatic detection
The old site made the buyer route themselves — `FSCs`, `NIIN`, `NSN`, `Part Types`,
`Cage Code` and `Manufacturers` were six separate nav items with nothing explaining which to
use. That pushes a database schema onto a person holding a greasy nameplate. Here one field
accepts all of them and says what it recognised as you type. The detection line doubles as
teaching: a buyer who did not know what a NIIN was now does.

### 2. Nothing ever dead-ends
Zero results is the highest-risk screen on the site — a buyer who found nothing is one click
from a competitor. So the empty state does not apologise; it leads with an RFQ carrying the
exact string they typed. The same rule holds inside browse lists, on filtered lists that go
empty, and on a part page reached by a stale link. **Every terminal state on this site is a
conversion opportunity, and every one is built as one.**

### 3. The escape hatch is always the last search suggestion
Even a perfect result set can miss the part in the buyer's hand. The final item in the
autocomplete is always "Can't see it? Request a quote for …", so the RFQ is never more than
one keystroke away, even mid-search.

### 4. Add-to-quote never costs you your place
Adding a part confirms in place with a toast and an undo. No navigation, no page load, no
lost scroll position. Losing your place after adding an item is a classic B2B funnel leak.

### 5. The quote list persists across tabs
A buyer sourcing a work package opens six parts in six tabs — that is normal behaviour. The
list is stored locally so those six become one RFQ, not six.

### 6. The RFQ form is one screen with two required fields
Part number and email. Everything else — name, company, phone, ship-to country — is optional
and collapsed behind a disclosure. Multi-step wizards are where B2B quote requests die, and
a buyer who has reached this form has already decided; the form's only job is to get out of
the way. Company and phone can be asked for once there is a live quote and the buyer is
invested.

### 7. "Where should we send the quote?" not "Your email"
The first reads as a delivery address. The second reads as a marketing capture. Same field,
materially different completion rate.

### 8. Paste-a-list, because that is where these lists actually live
Buyers keep requirements in spreadsheets. The paste mode accepts comma, tab, semicolon or
space between the part number and quantity, so a pasted column works without reformatting.

### 9. The promise is restated at the point of commitment
"Quote back within 15 minutes" appears on the submit button itself, not only in the hero.
Reassurance belongs where the anxiety is. On the confirmation page it becomes a wall-clock
time — a promise you cannot check is a promise that cannot build trust.

### 10. Trust sits next to action, never on its own page
Accreditation marks appear directly under the homepage search and inside the RFQ rail. A
first-time visitor decides whether we are a real supplier in the same glance in which they
decide whether to type.

### 11. AOG is a header entry point, not a page
An always-visible AOG action sits in the header and in the mobile bottom bar, and it is a
phone link — the live site sells AOG as a 24/7 *service*, and for a grounded aircraft the
phone is the mechanism, not a form. Every RFQ also carries an "Aircraft on ground" flag that
changes routing. There is deliberately no standalone AOG page.

### 12. The part detail page is designed once, carefully
Search, all four browse routes, and inbound Google traffic all converge here. It answers "is
this the right part?" (every identifier, individually copyable — hand-transcribing a 13-digit
NSN is where errors happen) and "how do I get a price?" (a sticky panel that never leaves
the screen).

---

## Accessibility

Built in, not retrofitted:

- Skip link; one `<h1>` per page; correct heading order
- Visible focus ring on everything, never removed
- Search autocomplete is a proper `combobox` with arrow-key navigation and `aria-activedescendant`
- Result counts, detection messages and toasts announce via `aria-live`
- Stock status carries a **text label as well as a colour** — colour alone fails colour-blind buyers and print
- Form errors are announced, described in plain language, tied to their field, and focus jumps to the first one
- Validation fires on submit and on blur-after-error — never mid-word
- `app.js` applies `novalidate` to every `[data-validate]` form when wiring it. Without that the browser's native validation short-circuits everything above and the buyer gets an unstyled native bubble instead. It is set in JS rather than in markup so no page can forget it
- Quote drawer is a real modal: focus moves in, `Esc` closes, focus returns
- `prefers-reduced-motion` respected
- 44px minimum touch targets on form controls

## Responsive

- Below 1180px the header search drops to its own full-width row rather than shrinking — it is the most-used control and must never be what gives way
- Below 760px the header stops being sticky (four stacked rows would eat the viewport) and a **fixed bottom bar** carries AOG, quote list and RFQ into the thumb zone
- On a part page the bottom-bar CTA carries the part number with it
- Spec tables stack so a 13-digit NSN gets full width
- Every grid track is `minmax(0, 1fr)` or `minmax(min(<px>, 100%), 1fr)`, never `minmax(<px>, 1fr)` — a px floor stops a track shrinking and pushes the document into horizontal scroll on a phone. Full-width buttons opt out of the global `white-space: nowrap` so sentence-length labels wrap instead of overflowing
- Verified: zero horizontal overflow across all 18 page states at 375px, and clean at 320px

---

## Known scope boundaries

- `assets/data.js` holds 16 illustrative parts. Part numbers, NSNs and CAGE codes are **stand-ins, not real inventory records.**
- Forms navigate to `confirmation.html` by GET. There is no backend.
- Blog and legal/policy pages are stubs — P2, and correctly not redesigned first.
- Dark mode is not defined. The warm sand ramp inverts cleanly but deserves a deliberate pass, not an inversion.

## Open questions for the UI phase

1. **Confirm the accent.** `#E05A00` is still a proposal from Phase A. A real brand colour replaces it and the ramp rebuilds around it.
2. **Fonts.** Mona Sans and Geist Mono are both SIL OFL and self-hostable; nothing is self-hosted in this prototype yet, so you are currently seeing system fallbacks.
3. **Photography.** No imagery is used anywhere. Worth deciding whether the part detail page carries product photography, since that changes its layout materially.

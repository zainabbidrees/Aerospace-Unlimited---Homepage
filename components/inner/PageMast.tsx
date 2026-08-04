import Link from "next/link";
import type { ReactNode } from "react";

/* ==========================================================================
   PageMast — the one masthead every inner page opens on.

   WHAT IT REPLACES. `.page-header` is a flat Midnight band: correct, plain, and
   the same on every page. Six new inner pages opening on six identical dark
   slabs would make the site's interior read as one long template, which is the
   opposite of the rule the homepage bands are built to ("no two bands look
   alike"). So this is one primitive with a small number of deliberate knobs,
   and each page turns them differently:

     img / alt   the photographic ground. ALWAYS TREATMENT, NEVER EVIDENCE —
                 every alt describes the SCENE and no masthead is captioned with
                 a company, a part or an aircraft type. See
                 au-stock-photography-scope.
     bias        the horizontal crop bias, because these are wide crops of
                 3:2 sources and centring parks the empty middle of the frame
                 in the middle of the composition. Same lesson as `.hero-media`.
     record      an optional strip of figures along the bottom edge. Present on
                 the pages where a count is genuinely the reader's next
                 question (how deep is this catalog?), absent where it is not.

   THE SCRIM IS A SINGLE DIAGONAL, bottom-left to top-right, for the reason the
   hero documents: crossing a horizontal and a vertical scrim multiplies opacity
   in the shared corner, drives it to near-black and flattens the photograph into
   a box. One ramp, tuned once, reused here.

   FULL-BLEED AND SQUARE-EDGED. A rounded corner on an edge-to-edge band has no
   outer edge to sit against — see design.md.

   MOTION. The title rises in line by line on load, and it TRANSLATES ONLY: if
   the animation never runs, the lines sit a few pixels low and remain perfectly
   legible. Nothing here is gated on an observer, so the masthead is never the
   thing that ships blank. See au-motion-safety.
   ========================================================================== */

export interface Crumb {
  href?: string;
  label: string;
}

export interface MastRecord {
  /* The figure. Mono where it is an identifier or a quantity in a column,
     which is the caller's decision via `mono`. */
  v: string;
  k: string;
  mono?: boolean;
}

export function PageMast({
  crumbs,
  eyebrow,
  /* An array, not a string, so each line can carry its own entrance delay. A
     `<br>` cannot. */
  title,
  lede,
  actions,
  note,
  img,
  alt,
  bias = "50%",
  record,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: string[];
  lede: ReactNode;
  actions?: ReactNode;
  note?: ReactNode;
  img: string;
  alt: string;
  bias?: string;
  record?: MastRecord[];
}) {
  return (
    <section className="imast">
      {/* The photograph is a real <img> rather than a CSS background so it can
          be sized, priority-hinted and given an accessible description. The
          crop bias rides on a custom property because `object-position` is the
          only part of the treatment that changes per page. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="imast-media"
        style={{ ["--imast-bias" as string]: bias }}
        src={img}
        alt={alt}
        width={2000}
        height={1200}
        decoding="async"
        fetchPriority="high"
      />
      <div className="imast-scrim" aria-hidden="true" />

      <div className="u-page imast-inner">
        <ol className="breadcrumb imast-crumbs">
          {crumbs.map((c) => (
            <li key={c.label}>{c.href ? <Link href={c.href}>{c.label}</Link> : c.label}</li>
          ))}
        </ol>

        <p className="eyebrow imast-eyebrow">{eyebrow}</p>
        <h1 className="imast-title">
          {title.map((line) => (
            <span className="imast-line" key={line}>
              {line}
            </span>
          ))}
        </h1>
        <p className="imast-lede">{lede}</p>
        {actions ? <div className="imast-cta">{actions}</div> : null}
        {note ? <p className="imast-note">{note}</p> : null}
      </div>

      {/* The record sits on the band's bottom edge as a hairline-divided strip —
          the trust-bar idiom, not pills. It is a statement of record, so it is
          divided text rather than chrome. */}
      {record?.length ? (
        <div className="u-page">
          <dl className="imast-record">
            {record.map((r) => (
              <div className="imast-rec" key={r.k}>
                <dt className={`imast-rec-v${r.mono ? " u-mono" : ""}`}>{r.v}</dt>
                <dd className="imast-rec-k">{r.k}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </section>
  );
}

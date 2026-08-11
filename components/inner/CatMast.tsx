import Link from "next/link";
import type { ReactNode } from "react";

/* ==========================================================================
   CatMast — the Catalog section's LIGHT page header.

   Worn by the Catalog hub and its index sub-pages (/browse, /browse/manufacturers,
   /browse/aircraft). It is the deliberate opposite of PageMast, the dark
   photographic stage that opens the rest of the site's inner pages.

   WHY A SEPARATE PRIMITIVE. PageMast and the homepage hero collided: at desktop
   `--au-text-display` and `--au-text-h1` both cap at 3.25rem, so a dark full-bleed
   masthead carried the same 52px headline over the same composition as the hero,
   and the catalog pages read as second landing pages. The fix was to stop being a
   dark band at all — the homepage owns the only dark photographic hero on the
   site, so a light-ground header is the loudest possible "inner page" signal.

   THE SHAPE, and every page turns the same knobs:
     · copy on the page's own light ground — eyebrow, display-scale title in ink,
       one-sentence lede;
     · one or two actions set to the RIGHT of the copy, baseline-aligned to it;
     · a BOUNDED, ROUNDED banner photograph BELOW the copy. Bounded-and-rounded is
       the interior's idiom; full-bleed-square is the hero's (design.md). The
       radius is doing real work — it is what stops the banner reading as a hero
       plate.

   THE PHOTOGRAPH IS TREATMENT, NEVER EVIDENCE. Scene-only alt, no caption naming
   a company, part or aircraft type. See au-stock-photography-scope. All styling
   is on `.catmast` in ux.css §1b.
   ========================================================================== */

export interface Crumb {
  href?: string;
  label: string;
}

export function CatMast({
  crumbs,
  eyebrow,
  /* An array so each line is its own block; a two-line title is the section's
     shape and a `<br>` cannot carry the responsive stack. */
  title,
  lede,
  actions,
  img,
  imgSm,
  alt,
  /* object-position for the wide letterbox crop — these are ~3:2 sources cropped
     to a banner, so the caller biases toward the subject. */
  imgPosition = "50% 42%",
  /* Optional page-scoped modifier — e.g. a longer title that needs a wider
     measure to keep its two-line break. Appended to `.catmast`. */
  className,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string[];
  lede: ReactNode;
  actions?: ReactNode;
  /* The banner is optional: omit `img` for a copy-only header that lets the
     page's first content section follow straight after the lede. */
  img?: string;
  imgSm?: string;
  alt?: string;
  imgPosition?: string;
  className?: string;
}) {
  return (
    <header className={`catmast${className ? ` ${className}` : ""}`} data-cue>
      <div className="u-page">
        <ol className="breadcrumb catmast-crumbs">
          {crumbs.map((c) => (
            <li key={c.label}>{c.href ? <Link href={c.href}>{c.label}</Link> : c.label}</li>
          ))}
        </ol>

        <div className="catmast-head">
          <div className="catmast-lead">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1 className="catmast-title">
              {title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <div className="catmast-lede">{lede}</div>
          </div>
          {actions ? <div className="catmast-actions">{actions}</div> : null}
        </div>

        {img ? (
          <figure className="catmast-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              srcSet={imgSm ? `${imgSm} 1200w, ${img} 2400w` : undefined}
              sizes={imgSm ? "(max-width: 760px) 100vw, 1200px" : undefined}
              alt={alt ?? ""}
              width={2400}
              height={1600}
              style={{ ["--catmast-pos" as string]: imgPosition }}
              decoding="async"
              fetchPriority="high"
            />
          </figure>
        ) : null}
      </div>
    </header>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import {
  ARCHIVE,
  FEATURED,
  POSTS,
  READABLE,
  archiveByYear,
  archiveSpanYears,
  categoryCounts,
  formatDate,
  formatDateShort,
  readingMinutes,
} from "@/lib/blog";
import { CueReveal } from "@/components/inner/CueReveal";
import { ArchiveYears } from "@/components/blog/ArchiveYears";

/*
  BLOG INDEX

  WHAT THE LIVE PAGE IS. A five-page paginated list of twenty-per-page link text,
  each row a title, a date, an author and one line of excerpt, with a sidebar of
  fourteen categories. Every post here is one of those posts — see lib/blog.ts.

  WHAT CHANGED, AND WHY. Pagination is the wrong instrument for an archive whose
  newest post and oldest post are four years apart. "Showing 1 of 5" tells the
  reader nothing about what is behind pages 2–5, so nobody goes. This page is
  therefore built as three registers instead of one list:

    · ONE FEATURED LEAD, at full width, because the newest article is the only one
      a returning reader is looking for and it was previously the first of twenty
      identical rows.
    · CARDS for the articles we hold in full — they have a cover and a body, so a
      card is a promise the page can keep.
    · A DATED ARCHIVE REGISTER for the rest, grouped by year. Fourteen titles and
      fourteen dates in one scannable block beats four more pages of the same
      thing, and the years are a property of the real post dates rather than
      chosen headings.

  THE ONE UX RULE THIS PAGE OBSERVES, carried from the prototype: an article index
  is an entry point FROM A SEARCH ENGINE, which means most visitors land here
  having never seen the homepage. So the page routes into the catalog rather than
  ending at a list of links. That is what the closing band is for.

  TOPIC FILTERING IS A SERVER-SIDE SEARCH PARAMETER, not client state, so every
  filtered view is a real shareable URL and the control works with no JS. Only
  categories that actually carry a post are offered — the live sidebar lists
  fourteen and twelve of them have nothing recent behind them, which is a sidebar
  of dead ends.

  MODE: Read. Structure for comprehension first, then make the reading experience
  worth staying in.
*/

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Reference material and sourcing guidance for procurement and maintenance " +
    "teams — aircraft systems, Federal Supply Classes, GSE and part selection.",
};

const TOPICS = categoryCounts();

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const active = TOPICS.some((t) => t.name === topic) ? (topic as string) : null;

  /* The featured lead is only ever the newest post overall. Filtering the grid
     and the archive but not the lead is deliberate: the lead is the page's
     masthead content, and swapping it per filter would make the top of the page
     move for what is meant to be a narrowing of the list below it. */
  const cards = READABLE.filter((p) => p.slug !== FEATURED.slug).filter(
    (p) => !active || p.category === active,
  );
  const years = archiveByYear()
    .map((g) => ({ ...g, posts: g.posts.filter((p) => !active || p.category === active) }))
    .filter((g) => g.posts.length);

  const shown = cards.length + years.reduce((s, g) => s + g.posts.length, 0) + (active ? 0 : 1);

  return (
    <>
      <CueReveal />

      {/* ====================================================================
           MASTHEAD — light and editorial, deliberately NOT the photographic
           dark band the catalog and capabilities pages open on.

           Those pages are selling a capability; this one is offering something to
           read, and a heavy scrim over a jet engine is the wrong register for it.
           So the blog opens on the page ground with the type doing the work, in
           the same idiom as the about page's `.ahero`, and the photograph arrives
           as the featured article's own cover rather than as decoration behind a
           heading.

           The headline rises line by line on load and TRANSLATES ONLY — if the
           animation never runs, the lines sit a few pixels low and stay legible.
           ==================================================================== */}
      <section className="bmast">
        <div className="u-page">
          <ol className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>Blog</li>
          </ol>

          <div className="bmast-top">
            <div className="bmast-lead">
              <p className="eyebrow">Complete aerospace solution</p>
              <h1 className="bmast-title">
                <span className="bmast-line">Reference material for</span>
                <span className="bmast-line">people who have to be right.</span>
              </h1>
              <p className="bmast-lede">
                Sourcing guidance and systems reference for procurement and
                maintenance teams — aircraft systems, Federal Supply Classes, ground
                support equipment and how to specify a part so the quote comes back
                right the first time.
              </p>
            </div>

            {/* A record, not chrome: what the archive actually holds. Counts are
                derived from the post list, so they cannot overstate it. */}
            <dl className="bmast-record">
              <div>
                <dt>{POSTS.length}</dt>
                <dd>Articles</dd>
              </div>
              <div>
                <dt>{READABLE.length}</dt>
                <dd>Available to read</dd>
              </div>
              <div>
                <dt>{archiveSpanYears()}</dt>
                <dd>Years of archive</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ====================================================================
           THE FEATURED LEAD

           One article at full width: the cover, then the meta, title, dek and the
           route in. It is the newest post, always, which is a rule rather than an
           editorial choice — nothing on this site curates a "pick".

           MOTION: the cover wipes open top-to-bottom while the image settles out
           of a push-in and one specular pass crosses the frame — the same thesis
           as the about page's story photograph, which is light moving over glass.
           The column then prints in order: rule, title out from under its own
           baseline, dek, meta.
           ==================================================================== */}
      <section className="section-tight">
        <div className="u-page">
          <article className="blead">
            <Link className="blead-media" href={`/blog/${FEATURED.slug}`} data-cue="lead-media" data-cue-ms="1700" tabIndex={-1} aria-hidden="true">
              {FEATURED.cover ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={FEATURED.cover} alt="" width={1400} height={900} decoding="async" fetchPriority="high" />
              ) : null}
              <span className="blead-gloss" aria-hidden="true" />
            </Link>

            <div className="blead-body" data-cue="lead-body" data-cue-ms="1400">
              <p className="eyebrow">Latest · {FEATURED.category}</p>
              <h2 className="blead-title">
                <Link href={`/blog/${FEATURED.slug}`}>{FEATURED.title}</Link>
              </h2>
              <p className="blead-dek">{FEATURED.dek}</p>
              <p className="blead-meta">
                <span>{formatDate(FEATURED.date)}</span>
                <i aria-hidden="true" />
                <span>{FEATURED.author}</span>
                <i aria-hidden="true" />
                <span>{readingMinutes(FEATURED)} min read</span>
              </p>
              <Link className="btn btn-primary btn-lg blead-cta" href={`/blog/${FEATURED.slug}`}>
                Read the article
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* ====================================================================
           THE TOPIC BAR

           The live sidebar lists fourteen categories; twelve of them have nothing
           recent behind them. A filter that leads to an empty page is worse than
           no filter, so only the categories carrying a post are offered, each with
           its real count. Links rather than buttons: shareable, crawlable, and
           working before any JavaScript arrives.
           ==================================================================== */}
      <div className="btopics">
        <div className="u-page btopics-inner">
          <p className="btopics-label">Topics</p>
          <nav className="chip-row btopics-row" aria-label="Filter by topic">
            <Link className="chip btopic" href="/blog" data-on={active === null ? "" : undefined}>
              Everything <em>{POSTS.length}</em>
            </Link>
            {TOPICS.map((t) => (
              <Link
                className="chip btopic"
                href={`/blog?topic=${encodeURIComponent(t.name)}`}
                data-on={active === t.name ? "" : undefined}
                key={t.name}
              >
                {t.name} <em>{t.n}</em>
              </Link>
            ))}
          </nav>
          <p className="results-count btopics-count" role="status" aria-live="polite">
            {active ? (
              <>
                <b>{shown}</b> in {active}
              </>
            ) : (
              <>
                <b>{POSTS.length}</b> articles
              </>
            )}
          </p>
        </div>
      </div>

      {/* ====================================================================
           THE CARDS — the articles we hold in full.

           A card carries a cover, a category, a date and a read time, which is a
           set of promises about what is behind it. The fourteen posts still on the
           current site get the archive register below instead, because a card with
           no cover and no body is a promise this page cannot keep.
           ==================================================================== */}
      {cards.length ? (
        <section className="section-tight">
          <div className="u-page">
            <div className="section-head section-head-row" data-cue>
              <div>
                <h2>{active ? `In ${active}` : "Available to read"}</h2>
                <p>
                  Full articles, with the systems reference and the part-selection
                  detail intact.
                </p>
              </div>
            </div>

            <ol className="bgrid" data-cue="stack" data-cue-ms="1300">
              {cards.map((p) => (
                <li key={p.slug}>
                  <Link className="bcard" href={`/blog/${p.slug}`}>
                    <span className="bcard-media">
                      {p.cover ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={p.cover} alt="" width={1400} height={900} loading="lazy" decoding="async" />
                      ) : null}
                      <span className="bcard-cat">{p.category}</span>
                    </span>
                    <span className="bcard-body">
                      <span className="bcard-date">{formatDateShort(p.date)}</span>
                      <span className="bcard-title">{p.title}</span>
                      <span className="bcard-dek">{p.dek}</span>
                      <span className="bcard-foot">
                        <span className="bcard-min">{readingMinutes(p)} min read</span>
                        <span className="bcard-go" aria-hidden="true">
                          →
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* ====================================================================
           THE ARCHIVE REGISTER

           Fourteen real posts, grouped by the year they were published, as
           hairline rows. This replaces pages 2–5 of the live pagination: the same
           content, in one block a reader can actually scan, with the year set
           large in the left gutter so the depth of the archive is visible rather
           than implied by a page number.

           MOTION: each year group is cued as it arrives — the numeral lifts, its
           rule draws across, and the rows print under it one at a time. The rows
           are working links at rest.
           ==================================================================== */}
      {years.length ? (
        <section className="section section-subtle">
          <div className="u-page">
            <div className="section-head section-head-row" data-cue>
              <div>
                <h2>Archive</h2>
                <p>
                  {ARCHIVE.length} earlier articles, by year. These are still being
                  migrated from the current site — each one keeps its title, date and
                  topic here, and its full text is on aerospaceunlimited.com in the
                  meantime.
                </p>
              </div>
            </div>

            {/* Each year is a click-to-expand dropdown; see ArchiveYears. */}
            <ArchiveYears years={years} />
          </div>
        </section>
      ) : null}

      {/* ====================================================================
           CLOSING — the page's one accent band, and the reason the index is not
           allowed to end at a list of links.

           Most people who reach this page arrive from a search engine and have
           never seen the homepage. An article index that ends is a visit that
           ends; this one hands them the field they actually came to the site for.
           ==================================================================== */}
      <section className="section section-accent brc">
        <div className="u-page brc-inner">
          <div className="brc-lead" data-cue>
            <p className="eyebrow">Reading this because you need a part</p>
            <h2 className="brc-title">
              Have the number in front of you?{" "}
              <span className="brc-accent">Skip the reading.</span>
            </h2>
            <p className="brc-lede">
              Search by part number, NSN, NIIN or CAGE code — the field in the header
              recognises the format as you type. Or send us the numbers and we will
              quote every line within 15 minutes, at any hour.
            </p>
            <div className="brc-cta">
              <Link className="btn btn-quiet btn-lg" href="/rfq">
                Request a quote
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/browse">
                Browse the catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

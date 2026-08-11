import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  POSTS,
  findPost,
  formatDate,
  hasBody,
  readingMinutes,
  relatedPosts,
  type Block,
} from "@/lib/blog";
import { CueReveal } from "@/components/inner/CueReveal";
import { ReadProgress } from "@/components/blog/ReadProgress";

/*
  ARTICLE READER

  MODE: Read, and the whole page is arranged around one measure. Everything that
  is not the article — the related rail, the quote CTA — sits BELOW it rather than
  beside it, because a sidebar next to two thousand words of systems reference is
  a competing column, and the reader is here for the words.

  TYPOGRAPHY. The body runs in `.u-prose` (900px) and the paragraphs sit narrower
  still at 68ch, which is where a 15px/1.667 body reads comfortably. That measure
  is the one real typographic decision on this page; everything else is the site's
  existing scale.

  TWO KINDS OF POST, and the page is honest about which one it is showing. Six
  articles are transcribed in full. The other fourteen carry their real title,
  date, topic and dek, and this page says plainly that the full text is still on
  the current site rather than padding the space with prose nobody wrote. A stub
  that admits it is a stub is a better page than a stub that pretends.

  MOTION. The cover settles as the page opens, the prose blocks print as they come
  into view, and a hairline under the header fills as the body is read. All three
  are decoration over content that is fully present at rest — see
  au-motion-safety. The read bar in particular is anchored to the ARTICLE BODY, so
  it reads 100% at the last paragraph rather than at the footer.
*/

/* Pre-rendered at build: the set is fixed and small, so every article is static. */
export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = findPost(slug);
  if (!p) return { title: "Not found" };
  return { title: p.title, description: p.dek };
}

/* One block renderer. `ul` items carry an optional lead phrase, which is set in
   the body ink at weight 500 while the explanation stays muted — the same
   label/value separation `.about-stats` and `.edge-text` use, so a five-item list
   reads as five statements rather than five paragraphs. */
function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.k === "h2")
          return (
            <h2 className="prose-h2" data-cue="prose" key={i}>
              {b.t}
            </h2>
          );
        if (b.k === "h3")
          return (
            <h3 className="prose-h3" data-cue="prose" key={i}>
              {b.t}
            </h3>
          );
        if (b.k === "ul")
          return (
            <ul className="prose-list" data-cue="prose" key={i}>
              {b.items.map((it) => (
                <li key={it.t}>
                  {it.b ? (
                    <>
                      <b>{it.b}</b> — {it.t}
                    </>
                  ) : (
                    it.t
                  )}
                </li>
              ))}
            </ul>
          );
        return (
          <p className="prose-p" data-cue="prose" key={i}>
            {b.t}
          </p>
        );
      })}
    </>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const full = hasBody(post);
  const minutes = readingMinutes(post);
  const related = relatedPosts(slug);

  return (
    <>
      <CueReveal />
      {full ? <ReadProgress /> : null}

      {/* ====================================================================
           HEADER — on the page ground, centred, with the cover arriving beneath
           it. Same shape as the about page's `.ahero`: the type establishes the
           article and the photograph resolves in under it, rather than the
           reader having to find a headline on top of a picture.
           ==================================================================== */}
      <article className="art">
        <header className="art-head">
          <div className="u-page">
            <ol className="breadcrumb">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>{post.category}</li>
            </ol>
          </div>

          <div className="u-prose art-head-inner">
            <p className="eyebrow eyebrow-center">{post.category}</p>
            <h1 className="art-title">{post.title}</h1>
            <p className="art-dek">{post.dek}</p>
            <p className="art-meta">
              <span>{formatDate(post.date)}</span>
              <i aria-hidden="true" />
              <span>{post.author}</span>
              {minutes ? (
                <>
                  <i aria-hidden="true" />
                  <span>{minutes} min read</span>
                </>
              ) : null}
            </p>
          </div>

          {post.cover ? (
            <div className="u-page">
              <figure className="art-cover" data-cue="cover" data-cue-ms="1500">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover}
                  alt={post.coverAlt ?? ""}
                  width={1400}
                  height={900}
                  decoding="async"
                  fetchPriority="high"
                />
              </figure>
            </div>
          ) : null}

          {/* The read bar sits on the boundary between the header and the body,
              which is exactly where 0% belongs. Purely decorative. */}
          {full ? (
            <div className="u-page">
              <div className="art-progress" data-read-progress aria-hidden="true">
                <i />
              </div>
            </div>
          ) : null}
        </header>

        {/* ==================================================================
             BODY
             ================================================================== */}
        {full ? (
          <div className="art-body" data-read-body>
            <div className="u-prose">
              <Blocks blocks={post.body!} />
            </div>
          </div>
        ) : (
          <div className="art-body">
            <div className="u-prose">
              {/* No invented prose. The dek is real, the notice is accurate, and
                  the routes out are the ones a reader who wanted this article
                  actually needs. */}
              <p className="prose-p prose-lede">{post.dek}</p>
              <div className="notice art-stub">
                <p className="u-body-strong">This article is still being migrated.</p>
                <p className="u-small u-muted" style={{ marginTop: "var(--au-s-2)" }}>
                  It was published on {formatDate(post.date)} and its full text is on
                  the current Aerospace Unlimited site. The title, date and topic are
                  carried here so the archive is complete and nothing is lost from the
                  index while the migration runs.
                </p>
                <div className="chip-row" style={{ marginTop: "var(--au-s-5)" }}>
                  <a
                    className="btn btn-primary"
                    href={`https://www.aerospaceunlimited.com/blog/${post.slug}/`}
                    rel="noopener"
                  >
                    Read it on the current site
                  </a>
                  <Link className="btn btn-text" href="/blog">
                    Back to the blog <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
             THE FOOT OF THE ARTICLE

             Author, topic and the one thing a reader of a systems article
             actually wants next: the catalog route for the part type they have
             just read about. Sharing links sit here rather than floating beside
             the prose — the live post carries Facebook, Twitter and LinkedIn, and
             a floating rail of three social icons beside a maintenance reference
             is the wrong voice for this audience.
             ================================================================== */}
        <footer className="art-foot">
          <div className="u-prose">
            <div className="art-foot-row" data-cue>
              <div>
                <p className="u-caption u-muted">Filed under</p>
                <p className="art-foot-cat">{post.category}</p>
              </div>
              <div className="art-foot-actions">
                <Link className="btn btn-quiet" href="/blog">
                  All articles
                </Link>
                <Link className="btn btn-primary" href="/rfq">
                  Request a quote
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </article>

      {/* ====================================================================
           RELATED — three siblings, preferring the same topic.

           Only ever articles we hold in full: a related link into a stub is a
           dead end, and offering one at the end of a good article is the worst
           moment to do it. See relatedPosts() in lib/blog.ts.
           ==================================================================== */}
      {related.length ? (
        <section className="section section-subtle">
          <div className="u-page">
            <div className="section-head" data-cue>
              <p className="eyebrow">Keep reading</p>
              <h2>Related articles</h2>
            </div>

            <ol className="bgrid" data-cue="stack" data-cue-ms="1200">
              {related.map((p) => (
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
           CLOSING — the page's one accent band. Same reasoning as the index:
           almost everyone reading this arrived from a search engine and has never
           seen the homepage, so the article is not allowed to be the end of the
           visit.
           ==================================================================== */}
      <section className="section section-accent brc">
        <div className="u-page brc-inner">
          <div className="brc-lead" data-cue>
            <p className="eyebrow">Sourcing what you just read about</p>
            <h2 className="brc-title">
              Send the numbers.{" "}
              <span className="brc-accent">Quote back in 15 minutes.</span>
            </h2>
            <p className="brc-lede">
              Part number, NSN, NIIN, CAGE code, a manual reference or a photograph of
              a data plate — whatever you actually have. A named account manager comes
              back in writing, at any hour.
            </p>
            <div className="brc-cta">
              <Link className="btn btn-quiet btn-lg" href="/rfq">
                Request a quote
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/part-types">
                Browse the catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { TOP_NSN, type TopNsn } from "@/lib/data";

/* ==========================================================================
   Top NSN marquee

   The track holds the eight cards TWICE. The animation runs to exactly -50%,
   so the moment the first copy has left the frame the second copy is sitting
   where the first started and the loop is invisible. The second copy is
   `aria-hidden` and its links are removed from the tab order — it is the same
   eight NSNs, and a screen reader or a Tab key finding sixteen would be
   reporting inventory that does not exist.

   Both copies are real markup rather than animation-dependent, so if the
   animation never runs the section still reads as a row of NSN cards.
   ========================================================================== */

function NsnCard({ n, clone }: { n: TopNsn; clone: boolean }) {
  return (
    <Link
      className="nsn-card"
      href={`/search?q=${encodeURIComponent(n.nsn)}`}
      tabIndex={clone ? -1 : undefined}
    >
      <span className="nsn-card-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/img/nsn/${n.img}.jpg`}
          width={600}
          height={800}
          decoding="async"
          alt={clone ? "" : n.alt}
        />
      </span>
      <span className="nsn-card-body">
        <span className="nsn">{n.nsn}</span>
        <span className="desc">{n.desc}</span>
      </span>
    </Link>
  );
}

export function NsnMarquee() {
  return (
    <div className="marquee">
      <div className="marquee-track">
        <div className="marquee-group">
          {TOP_NSN.map((n) => (
            <NsnCard n={n} clone={false} key={n.nsn} />
          ))}
        </div>
        <div className="marquee-group" aria-hidden="true">
          {TOP_NSN.map((n) => (
            <NsnCard n={n} clone key={n.nsn} />
          ))}
        </div>
      </div>
    </div>
  );
}

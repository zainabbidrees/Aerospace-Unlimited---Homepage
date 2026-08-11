import type { ReactNode } from "react";

/* ==========================================================================
   SendList — the "what to send us" checklist shared by the four resource pages.

   Held as one component because the shape is identical across GSE, PMA parts,
   PMA supplements and salvage, and the entrance staggers its items — four bespoke
   markup blocks would have drifted apart within one edit. Rides the .capsend
   primitive in ux.css, which the resource sections already use.
   ========================================================================== */

export interface SendItem {
  b: string;
  t: string;
}

export function SendList({
  items,
  cta,
  aside,
}: {
  items: SendItem[];
  cta: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="card capsend" data-cue="send" data-cue-ms="1300">
      <h3 className="capsend-h">What to send us</h3>
      <ol className="capsend-list">
        {items.map((s, i) => (
          <li key={s.b}>
            <span className="capsend-n" aria-hidden="true">{`0${i + 1}`}</span>
            <span className="capsend-t">
              <b>{s.b}</b> — {s.t}
            </span>
          </li>
        ))}
      </ol>
      <div className="capsend-cta">
        {cta}
        {aside ? <span className="u-caption">{aside}</span> : null}
      </div>
    </div>
  );
}

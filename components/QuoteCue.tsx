import Link from "next/link";
import type { ReactNode } from "react";
import { rfqHref, type RfqContext } from "@/lib/rfq";

/* ==========================================================================
   QuoteCue — the quiet, contextual "start a quote" prompt.

   The site's indirect conversion primitive: a recessed line or slab that names
   the visitor's next step in the language of the section it sits in, and hands
   off to a pre-contextualised RFQ. It is deliberately secondary — it never
   competes with a section's primary action, and its copy is written per call
   site so no two read as the same stamped widget. Three shapes:

     line   one muted sentence + arrow link, for the foot of a trust/showcase
            section on the light ground.
     inline a slim bordered slab, for dropping inside article prose.
     plate  the same idea tuned for a dark band (the identifier data-plate).

   Always rendered (never display:none) and keyboard-focusable, so it works on
   touch and for screen readers — "quiet" is a matter of weight, not of hiding.
   ========================================================================== */

export function QuoteCue({
  variant = "line",
  to = {},
  cta = "Request a quote",
  children,
}: {
  variant?: "line" | "inline" | "plate";
  to?: RfqContext;
  cta?: string;
  children: ReactNode;
}) {
  return (
    <div className={`qcue qcue-${variant}`}>
      <p className="qcue-text">{children}</p>
      <Link className="qcue-link" href={rfqHref(to)}>
        {cta} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

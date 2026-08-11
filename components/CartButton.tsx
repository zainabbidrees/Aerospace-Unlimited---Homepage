"use client";

import { useRouter } from "next/navigation";
import { useQuote } from "./QuoteProvider";

/* The quote cart's own control, split out from "Request a Quote" so no single
   button does two jobs (see QuoteButton.tsx).

   PERSISTENT — it is always in the header, like any shopping cart, so a buyer
   can always see it and reach their staged parts. The count pill shows only
   when something is staged; empty, it is just the cart glyph. Either way a click
   goes STRAIGHT to the RFQ form — which prefills from the saved list — with no
   review drawer in between. Quantities are set there, per line, before sending;
   a line can also be removed there, so nothing the old drawer did is lost.

   The count is unknowable before the localStorage read, so both the server and
   the first client render show the empty glyph (no pill); the pill fills in on
   mount. The button element itself is always present, so nothing reflows in — no
   hydration mismatch, and the header never shifts a control into place. */
export function CartButton() {
  const { items, ready } = useQuote();
  const router = useRouter();
  const count = ready ? items.length : 0;

  return (
    <button
      className="btn btn-quiet cart-button"
      type="button"
      aria-label={
        count
          ? `Quote list — review ${count} staged part${count === 1 ? "" : "s"}`
          : "Quote list — empty"
      }
      title="Your quote list"
      onClick={() => router.push("/rfq")}
    >
      <svg
        className="cart-glyph"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
        <path d="M2.5 3.5h2.3l2.3 11.3a1.6 1.6 0 0 0 1.6 1.3h8.3a1.6 1.6 0 0 0 1.6-1.3L21.5 8H6.2" />
      </svg>
      {count > 0 ? <span className="cart-count">{count}</span> : null}
    </button>
  );
}

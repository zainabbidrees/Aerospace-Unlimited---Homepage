"use client";

import { useRouter } from "next/navigation";
import { useQuote } from "./QuoteProvider";

/* ONE LABEL, TWO BEHAVIOURS. The button reads "Request a Quote" whether or not
   anything has been collected; only the count badge and what a click does change.

   IT USED TO RENAME ITSELF TO "Quote List" the moment a part was added, and that
   was wrong for two reasons the client named on 2026-08-05:

     1. IT IS THE SAME BUTTON, IN THE SAME PLACE, DOING THE SAME JOB. A control
        that changes its name under the cursor asks the visitor to re-read the
        header and work out whether the thing they were about to click is still
        there. The count badge already says a list exists; the label does not need
        to say it a second time, at the cost of the one action the header is for.
     2. "Quote List" NAMES OUR PLUMBING, NOT THE BUYER'S GOAL. Nobody arrives
        wanting a list. They want a price, and the staged parts are how they get
        one — so the label stays on the outcome and the badge carries the state.

   The BEHAVIOUR is unchanged and still contextual, because that part was right:
   with parts staged a click opens the drawer to review and send them, and with an
   empty list it goes straight to the RFQ form rather than opening an empty drawer.
   Both are the same errand, which is exactly why one label covers them.

   Before hydration the count is unknowable, so the button renders its empty state
   on the server and fills the badge in on mount. The label is now identical in both
   states, so that swap is invisible — previously it was a visible word change on
   every page load for anyone with a saved list. */
export function QuoteButton({ className = "btn btn-primary" }: { className?: string }) {
  const { items, ready, openDrawer } = useQuote();
  const router = useRouter();
  const count = ready ? items.length : 0;

  return (
    <button
      className={className}
      type="button"
      /* The visible label is the same in both states, so the accessible name
         carries the count that sighted users read off the badge — and says what
         the click will do, since a screen-reader user gets no drawer preview. */
      aria-label={
        count
          ? `Request a quote — review ${count} staged part${count === 1 ? "" : "s"}`
          : "Request a quote"
      }
      onClick={() => {
        if (count) openDrawer();
        else router.push("/rfq");
      }}
    >
      <span>Request a Quote</span>
      <span className="quote-count" data-empty={count === 0} hidden={count === 0}>
        {count}
      </span>
    </button>
  );
}

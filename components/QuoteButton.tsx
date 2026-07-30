"use client";

import { useRouter } from "next/navigation";
import { useQuote } from "./QuoteProvider";

/* One button, two states. With an empty list "Quote List (0)" is a dead
   control that tells a first-time visitor nothing — so until they have
   collected anything it is simply the primary "Request a Quote" action,
   and it becomes the list once there is a list to show.

   Before hydration the count is unknowable, so the button renders its empty
   state on the server and fills in on mount. That is the same first paint a
   visitor with an empty list gets, which is most of them. */
export function QuoteButton({ className = "btn btn-primary" }: { className?: string }) {
  const { items, ready, openDrawer } = useQuote();
  const router = useRouter();
  const count = ready ? items.length : 0;

  return (
    <button
      className={className}
      type="button"
      aria-label={
        count
          ? `Quote list, ${count} part${count === 1 ? "" : "s"}`
          : "Request a quote"
      }
      onClick={() => {
        // Contextual action: opens the list if there is one, otherwise goes
        // straight to the RFQ form rather than opening an empty drawer.
        if (count) openDrawer();
        else router.push("/rfq");
      }}
    >
      <span>{count ? "Quote List" : "Request a Quote"}</span>
      <span className="quote-count" data-empty={count === 0} hidden={count === 0}>
        {count}
      </span>
    </button>
  );
}

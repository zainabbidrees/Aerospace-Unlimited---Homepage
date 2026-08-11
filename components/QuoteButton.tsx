import Link from "next/link";

/* ONE JOB. "Request a Quote" always opens the RFQ form — nothing else.

   It used to change behaviour with the cart's state: once parts were staged a
   click opened a review drawer, and only an empty list went straight to the
   form. The same button, in the same place, did two different things, which is
   exactly what confused buyers. On 2026-08-06 that was split apart — the staged
   cart now has its own control (see CartButton.tsx) and the drawer was removed,
   so this button is purely the primary call to action. The RFQ form prefills
   from the saved list regardless, so a buyer with staged parts still finds them
   waiting when they land there. */
export function QuoteButton({ className = "btn btn-primary" }: { className?: string }) {
  return (
    <Link className={className} href="/rfq">
      Request a Quote
    </Link>
  );
}

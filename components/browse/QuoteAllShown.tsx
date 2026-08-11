"use client";

import type { Part } from "@/lib/data";
import { useQuote } from "@/components/QuoteProvider";
import { useToast } from "@/components/ToastProvider";

/* ==========================================================================
   QuoteAllShown — "add everything currently shown to a quote", for the results
   header. Distinct from the per-row "Add to quote": a buyer who has filtered a
   listing down to the set they want should be able to stage the whole set in
   one move instead of clicking every row. add() dedupes by part number, so
   pressing it twice is harmless.

   It stages the parts and confirms with a toast — it does NOT open a drawer or
   jump to the form (the review drawer was removed 2026-08-06). The buyer keeps
   browsing and heads to the form via the header cart button when ready, where
   quantities are set per line. See CartButton.tsx.
   ========================================================================== */

export function QuoteAllShown({ parts }: { parts: Part[] }) {
  const { add, ready } = useQuote();
  const { toast } = useToast();
  if (!parts.length) return null;
  return (
    <button
      className="btn btn-quiet btn-sm quoteall"
      type="button"
      disabled={!ready}
      onClick={() => {
        parts.forEach((p) => add(p, 1));
        toast(
          `${parts.length} part${parts.length === 1 ? "" : "s"} added to your quote list.`
        );
      }}
    >
      Add {parts.length} shown to a quote
    </button>
  );
}

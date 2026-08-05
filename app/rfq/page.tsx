import type { Metadata } from "next";
import { Suspense } from "react";
import { RfqForm } from "@/components/rfq/RfqForm";

/*
  /rfq — Instant Quote request. The route the whole site's primary CTA points at
  ("Request a Quote", "Send us a parts list", the quote drawer). It was linked
  from every page but never built, so every one of those buttons 404'd; this is
  the page they were always meant to reach. UX ported from prototype/rfq.html —
  see RfqForm.tsx.

  RfqForm reads the query string (?pn, ?q, ?mode) with useSearchParams and so
  must sit inside a Suspense boundary, or the build cannot statically prerender
  the route.
*/

export const metadata: Metadata = {
  title: "Request a quote",
  description:
    "Request a quote on any aviation or aerospace part. A named account manager " +
    "answers within 15 minutes, 24/7. No account required.",
};

export default function RfqPage() {
  return (
    <main id="main" className="section-tight">
      <Suspense fallback={null}>
        <RfqForm />
      </Suspense>
    </main>
  );
}

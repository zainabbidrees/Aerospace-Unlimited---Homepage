import type { Metadata } from "next";
import { Suspense } from "react";
import { RfqForm } from "@/components/rfq/RfqForm";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { Testimonials } from "@/components/home/Testimonials";

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
      {/* Arms the [data-reveal] entrance on the testimonials band, exactly as the
          homepage does. Additive and motion-safe — the band is fully visible at
          rest, so no-JS and reduced motion still get it. */}
      <ScrollReveal />

      <Suspense fallback={null}>
        <RfqForm />
      </Suspense>

      {/* ====================================================================
           TESTIMONIALS — the homepage's "What our clients say" block, reused
           at the end of the quote request: the same editorial split of a
           featured pull-quote beside a roster, same real sourced reviews
           (see Testimonials.tsx).
           ==================================================================== */}
      <section className="section section-subtle">
        <div className="u-page">
          <Testimonials />
        </div>
      </section>
    </main>
  );
}

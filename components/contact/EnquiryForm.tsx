"use client";

/* ==========================================================================
   The general enquiry form — everything that is not a part request.

   Two behaviours carried over from prototype/contact.html, both of them the
   reason this form exists in this shape rather than as a plain contact box:

   1. THE TOPIC SELECTOR CORRECTS INTENT EARLY. Choosing "pricing or
      availability" reveals the faster route at the moment the buyer reveals what
      they want — before they have typed a part number into a message box that is
      read within one business day instead of fifteen minutes. It appears on
      `change`, not on submit: warning someone after they have written three
      paragraphs just annoys them into sending it anyway. The form still submits
      either way; nobody is trapped.

   2. IT CONFIRMS IN PLACE. A separate thank-you page would throw away the AOG
      number and the direct details the sender may still need thirty seconds
      later, so the panel swaps to a receipt and leaves the page around it.

   Validation is the site's shared ValidatedForm — errors beside the field, in
   plain language, focus moved to the first one. Nothing here is hidden at rest:
   the form is server-rendered complete, and the only element that starts hidden
   is the nudge, which is an addition rather than content. See au-motion-safety.
   ========================================================================== */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ValidatedForm } from "@/components/ValidatedForm";

/* The eight topics the prototype states, in its order. "Pricing or availability"
   leads because it is the most-picked and the one that needs re-routing. */
const TOPICS: { value: string; label: string }[] = [
  { value: "quote", label: "Pricing or availability for a part" },
  { value: "order", label: "An existing order or shipment" },
  { value: "vendor", label: "Vendor set-up, certificates or a supplier survey" },
  { value: "accounts", label: "Accounts, invoicing or payment terms" },
  { value: "sell", label: "Offering us inventory to buy" },
  { value: "partnership", label: "Partnership or reseller enquiry" },
  { value: "careers", label: "Careers" },
  { value: "other", label: "Something else" },
];

export function EnquiryForm() {
  const [topic, setTopic] = useState("");
  const [sent, setSent] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);

  /* The receipt is shorter than the form it replaces, so without this the reader
     is left looking at the empty space the form used to fill — the confirmation
     scrolls off above them. Only ever runs after a successful submit. */
  useEffect(() => {
    if (sent) doneRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [sent]);

  if (sent) {
    return (
      <div className="enq-done" role="status" ref={doneRef}>
        <span className="enq-done-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.6 12.4 9.4 17.2 19.4 6.8" />
          </svg>
        </span>
        <h3>Enquiry received.</h3>
        <p>
          You will get a reply at the address you gave, within one business day.
          If it turns out to be urgent before then, call{" "}
          <a href="tel:+17147054780">+1-714-705-4780</a> — the desk is staffed
          around the clock — or <Link href="/rfq">raise a quote request</Link> for
          a 15-minute answer.
        </p>
        <button className="btn btn-quiet" type="button" onClick={() => setSent(false)}>
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <ValidatedForm
      className="enq-form"
      onValid={() => {
        setSent(true);
        /* No backend in this phase — the prototype's behaviour, unchanged. */
        return false;
      }}
    >
      {/* TWO FIELDS PER ROW AND NO ADVISORY HINTS. Six inputs were running eleven
          stacked blocks tall: every field carried its own hint line, the phone's
          explained when we would ring you, and the email's explained which address
          to use. Both are things a sender works out from the label. `autoComplete`
          is doing the real work against "so much typing" — a browser fills name,
          email, company and phone in one gesture, which no amount of copy can. */}
      <div className="field-row">
        <div className="field" data-label="Full name">
          <label htmlFor="c-name">
            Full name <span className="required" aria-hidden="true">*</span>
          </label>
          <input id="c-name" name="name" type="text" autoComplete="name" required />
          <div className="error" />
        </div>
        <div className="field" data-label="Work email">
          <label htmlFor="c-email">
            Work email <span className="required" aria-hidden="true">*</span>
          </label>
          <input id="c-email" name="email" type="email" autoComplete="email" required />
          <div className="error" />
        </div>
      </div>

      <div className="field-row">
        <div className="field" data-label="Company">
          <label htmlFor="c-company">
            Company <span className="required" aria-hidden="true">*</span>
          </label>
          <input id="c-company" name="company" type="text" autoComplete="organization" required />
          <div className="error" />
        </div>
        <div className="field" data-label="Phone">
          <label htmlFor="c-phone">
            Phone <span className="optional">optional</span>
          </label>
          <input id="c-phone" name="phone" type="tel" autoComplete="tel" />
          <div className="error" />
        </div>
      </div>

      <div className="field" data-label="Topic">
        <label htmlFor="c-topic">
          What is this about? <span className="required" aria-hidden="true">*</span>
        </label>
        <select
          id="c-topic"
          name="topic"
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option value="">Select a topic</option>
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <div className="error" />
      </div>

      {/* Shown only for the one topic this form is worst at. */}
      {topic === "quote" && (
        <aside className="enq-nudge">
          <p className="enq-nudge-title">This form is the slow way to get a price.</p>
          <p className="enq-nudge-body">
            Sent here it is read within one business day, then handed to the quoting
            desk. Sent there it comes back in writing within 15 minutes, at any hour.
          </p>
          <div className="enq-nudge-cta">
            <Link className="btn btn-primary" href="/rfq">
              Take me to the quote form
            </Link>
            <Link className="btn btn-quiet btn-sm" href="/rfq?mode=list">
              I have a whole list
            </Link>
          </div>
        </aside>
      )}

      <div className="field" data-label="Message">
        <label htmlFor="c-message">
          Your question <span className="required" aria-hidden="true">*</span>
        </label>
        <textarea
          id="c-message"
          name="message"
          rows={4}
          required
          placeholder="Order or quote numbers, part numbers, or your PO reference."
        />
        {/* The one hint that survives, because it is the only one a sender cannot
            infer and the only one with a consequence: export-controlled data must
            not travel through a web form. */}
        <p className="hint">No passwords, card details or export-controlled data.</p>
        <div className="error" />
      </div>

      <div className="enq-submit">
        <button className="btn btn-primary btn-lg" type="submit">
          Send enquiry
        </button>
        <p className="u-caption">
          Or email <a href="mailto:sales@aerospaceunlimited.com">sales@aerospaceunlimited.com</a>
          {" · "}call <a href="tel:+17147054780">+1-714-705-4780</a>
        </p>
      </div>
    </ValidatedForm>
  );
}

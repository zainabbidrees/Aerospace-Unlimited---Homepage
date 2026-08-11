"use client";

/* ==========================================================================
   Hero RFQ — the compact quote request that replaces the hero search slab.

   The header already carries the catalogue search, so a second search field in
   the hero was redundant. The headline promises a quote in 15 minutes, so the
   field a buyer meets first is now the start of that quote, not another search.

   ONE PART, FAST. This is deliberately not the full /rfq form (part lines,
   paste mode, company details, urgency notes). It takes only the minimum that
   form itself names as required — part number, quantity, email — plus the
   site's signature AOG toggle, and confirms in place. Anyone with a whole
   parts list is one click from the full form at /rfq.

   The look is a precise instrument, not a stock form: leading marks in each
   well, a real switch for AOG (its live dot echoes the header's AOG control),
   and the promise sitting at the button. Fields keep the shared `.field` /
   `.error` contract so ValidatedForm validates them exactly like every other
   form. Confirms inline like the contact and RFQ forms — no backend this phase;
   the email is shown back to the sender and never leaves the page in a URL.
   ========================================================================== */

import Link from "next/link";
import { useState } from "react";
import { ValidatedForm } from "@/components/ValidatedForm";
import { useToast } from "@/components/ToastProvider";
import { NumberField } from "@/components/NumberField";

interface Receipt {
  pn: string;
  email: string;
  aog: boolean;
  eta: string;
  ref: string;
}

/* Leading marks — muted, decorative, and never the label (the visible <label>
   and the field's data-label carry that). Kept inline so the well and its mark
   travel together. */
const TagIcon = () => (
  <svg className="hero-rfq-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
    <circle cx="7.5" cy="7.5" r="1.4" />
  </svg>
);
const MailIcon = () => (
  <svg className="hero-rfq-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2.2" />
    <path d="m3.5 7 8.5 5.6L20.5 7" />
  </svg>
);

export function HeroRfq() {
  const { toast } = useToast();
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  if (receipt) {
    return (
      <div className="hero-rfq hero-rfq-done" role="status">
        <span className="hero-rfq-done-check" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <span className="hero-rfq-done-badge">Request received</span>
        <p className="hero-rfq-done-line">
          A quote for <b className="u-mono">{receipt.pn}</b> is on its way to{" "}
          <b>{receipt.email}</b> by <b>{receipt.eta}</b>.
          {receipt.aog ? " Flagged AOG — pulled to the front of the 24/7 desk." : ""}
        </p>
        <p className="hero-rfq-done-ref">
          Reference <span className="u-mono">{receipt.ref}</span>
        </p>
        <div className="hero-rfq-done-actions">
          <button className="btn btn-quiet" type="button" onClick={() => setReceipt(null)}>
            Request another
          </button>
          <Link className="btn btn-ghost" href="/rfq">
            Send a full parts list &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ValidatedForm
      className="hero-rfq"
      aria-label="Request a quote"
      onValid={(form) => {
        const data = new FormData(form);
        const now = new Date();
        const eta = new Date(now.getTime() + 15 * 60 * 1000).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });
        const ref =
          "AU-" +
          now.getFullYear() +
          String(now.getMonth() + 1).padStart(2, "0") +
          String(now.getDate()).padStart(2, "0") +
          "-" +
          String(now.getHours()).padStart(2, "0") +
          String(now.getMinutes()).padStart(2, "0");
        setReceipt({
          pn: String(data.get("pn") || "your part"),
          email: String(data.get("email") || "your email"),
          aog: data.get("aog") === "1",
          eta,
          ref,
        });
        toast("Request received — a quote is on the way.");
        /* Handled in place; keep the browser from performing a native submit. */
        return false;
      }}
    >
      <div className="hero-rfq-head">
        <span className="hero-rfq-kicker">Instant quote</span>
        <span className="hero-rfq-eta">
          <span className="hero-rfq-eta-dot" aria-hidden="true" />
          15-minute reply
        </span>
      </div>

      <div className="field hero-rfq-field" data-label="Part number">
        <label htmlFor="hero-pn">
          Part number <span className="required" aria-hidden="true">*</span>
        </label>
        <div className="hero-rfq-well">
          <TagIcon />
          <input
            id="hero-pn"
            name="pn"
            type="text"
            required
            data-mono
            autoComplete="off"
            placeholder="MS21042L3, NSN or CAGE"
          />
        </div>
        <div className="error" />
      </div>

      <div className="hero-rfq-row">
        <div className="field hero-rfq-field hero-rfq-qty" data-label="Quantity">
          <label htmlFor="hero-qty">
            Qty <span className="required" aria-hidden="true">*</span>
          </label>
          <div className="hero-rfq-well">
            <NumberField id="hero-qty" name="qty" min={1} defaultValue={1} required data-mono />
          </div>
          <div className="error" />
        </div>
        <div className="field hero-rfq-field hero-rfq-email" data-label="Email">
          <label htmlFor="hero-email">
            Email <span className="required" aria-hidden="true">*</span>
          </label>
          <div className="hero-rfq-well">
            <MailIcon />
            <input
              id="hero-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@company.com"
            />
          </div>
          <div className="error" />
        </div>
      </div>

      <label className="hero-rfq-aog">
        <span className="hero-rfq-aog-label">
          <span className="hero-rfq-aog-dot" aria-hidden="true" />
          Aircraft on ground <span className="hero-rfq-aog-sub">— jump the 24/7 queue</span>
        </span>
        <input className="hero-rfq-aog-input" type="checkbox" name="aog" value="1" role="switch" />
      </label>

      <button className="btn btn-primary hero-rfq-submit" type="submit">
        Request a Quote
        <svg className="hero-rfq-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h13M12 5l7 7-7 7" />
        </svg>
      </button>
      <p className="hero-rfq-note">No account required · Answered 24/7, holidays included</p>
    </ValidatedForm>
  );
}

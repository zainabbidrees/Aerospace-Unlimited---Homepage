"use client";

/* ==========================================================================
   RFQ — the Instant Quote request, ported from prototype/rfq.html to the Next
   app and wired to the live quote list.

   The rules the prototype set, kept verbatim because they are the reason the
   form converts:

     1. ONE SCREEN. No wizard. A buyer here has already decided; the form's job
        is to get out of the way.
     2. MINIMUM REQUIRED FIELDS. Part number, quantity, email. Everything else
        is optional and collapsed, so the form looks as short as it is.
     3. THE PROMISE SITS AT THE BUTTON — reassurance at the moment of commitment.
     4. NO ACCOUNT, EVER. Stated, because a first-time visitor expects a wall.

   IT ARRIVES KNOWING THE CONTEXT. Reached from five places, it prefills so
   nobody retypes a part number they just clicked:
     ?pn=<part>   one line, titled for that part
     ?q=<query>   one line + a "not in the catalog, that's normal" notice
     the quote list (localStorage, via useQuote) → one line per collected part
     ?mode=list   opens in paste mode for a whole spreadsheet column

   NO BACKEND THIS PHASE. Like the contact form, a valid submit confirms in
   place (a separate page would throw away the AOG number the sender may still
   want) and clears the quote list so a converted list is not left looking
   pending. Validation is the shared ValidatedForm. See au-inner-pages.
   ========================================================================== */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ValidatedForm } from "@/components/ValidatedForm";
import { NumberField } from "@/components/NumberField";
import { DatePicker } from "@/components/DatePicker";
import { CERTS } from "@/components/home/CertMarquee";
import { useQuote } from "@/components/QuoteProvider";
import { useToast } from "@/components/ToastProvider";
import { PARTS } from "@/lib/data";
import { partsForContext } from "@/lib/rfq";

const CONDITIONS = [
  "Any condition",
  "New / Factory Sealed",
  "New Surplus",
  "Overhauled / 8130-3",
  "Serviceable / Traceable",
];

/* A condition string only fills the select if it is one the select offers;
   anything else falls back to "Any condition" rather than a blank option. */
function normaliseCondition(c: string | undefined): string {
  return c && CONDITIONS.includes(c) ? c : "Any condition";
}

interface Line {
  id: number;
  pn: string;
  qty: number;
  condition: string;
}

interface Receipt {
  lines: { pn: string; qty: string; condition: string }[];
  email: string;
  aog: boolean;
  needby: string;
  ref: string;
  eta: string;
}

export function RfqForm() {
  const params = useSearchParams();
  const pn = params.get("pn") ?? "";
  const q = params.get("q") ?? "";
  const mode = params.get("mode") ?? "";

  /* Entity context — a card elsewhere on the site said "quote this platform /
     OEM / category / number". `for` is the human label; the rest resolve to
     sample rows via partsForContext. */
  const forLabel = params.get("for") ?? "";
  const ctx = {
    aircraft: params.get("aircraft") ?? undefined,
    cage: params.get("cage") ?? undefined,
    category: params.get("category") ?? undefined,
    fsc: params.get("fsc") ?? undefined,
    nsn: params.get("nsn") ?? undefined,
    niin: params.get("niin") ?? undefined,
  };
  const hasCtx = Boolean(
    forLabel || ctx.aircraft || ctx.cage || ctx.category || ctx.fsc || ctx.nsn || ctx.niin
  );
  /* When the sample carries no matching row, the label rides in as a note so
     the account manager still has the context — never a fabricated part line. */
  const noteDefault = forLabel ? `Parts for ${forLabel}.` : "";

  const { items, ready, clear } = useQuote();
  const { toast } = useToast();

  const nextId = useRef(1);
  const mkLine = (pn = "", qty = 1, condition = ""): Line => ({
    id: nextId.current++,
    pn,
    qty,
    condition: normaliseCondition(condition),
  });

  /* Initial lines come from the URL synchronously, so a ?pn / ?q arrival never
     flashes an empty row. The quote-list path fills in after the localStorage
     read, below. */
  const [lines, setLines] = useState<Line[]>(() => {
    if (pn) {
      const found = PARTS.find((p) => p.pn === pn);
      return [mkLine(pn, 1, found?.condition)];
    }
    if (q) return [mkLine(q, 1)];
    if (hasCtx) {
      const cp = partsForContext(ctx);
      if (cp.length) return cp.map((p) => mkLine(p.pn, 1, p.condition));
      /* No sample match — one empty line, with the context carried in the note. */
      return [mkLine()];
    }
    return [mkLine()];
  });

  const [entryMode, setEntryMode] = useState<"lines" | "paste">(
    mode === "list" ? "paste" : "lines"
  );
  const [paste, setPaste] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const filledFromList = useRef(false);

  /* Prefill from the quote list once the persisted read has happened — only
     when the URL did not already name a part, and only once, so a later list
     change does not overwrite what the buyer is editing. */
  useEffect(() => {
    if (pn || q || hasCtx || filledFromList.current) return;
    if (ready && items.length) {
      filledFromList.current = true;
      setLines(items.map((i) => mkLine(i.pn, i.qty, i.condition)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, items, pn, q]);

  useEffect(() => {
    if (receipt) doneRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [receipt]);

  const title = useMemo(() => {
    if (pn) return `Request a quote for ${pn}`;
    if (forLabel) return `Request a quote — ${forLabel}`;
    if (!pn && !q && filledFromList.current && lines.length)
      return `Request quotes for ${lines.length} part${lines.length === 1 ? "" : "s"}`;
    return "Request a quote";
  }, [pn, q, forLabel, lines.length]);

  function updateLine(id: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function addLine() {
    setLines((prev) => [...prev, mkLine()]);
  }
  function removeLine(id: number) {
    setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));
  }

  /* Paste parsing — a part number then an optional quantity separated by comma,
     tab, semicolon or whitespace, because a pasted spreadsheet column could use
     any of them and reformatting is not the buyer's job. */
  function convertPaste() {
    const raw = paste.trim();
    if (!raw) return;
    const parsed = raw
      .split(/\r?\n/)
      .map((line): { pn: string; qty: number } | null => {
        const m = line.trim().match(/^(.+?)[\s,;\t]+(\d+)\s*$/);
        if (m) return { pn: m[1].trim().replace(/[,;]$/, ""), qty: parseInt(m[2], 10) };
        return line.trim() ? { pn: line.trim(), qty: 1 } : null;
      })
      .filter((x): x is { pn: string; qty: number } => x !== null);
    if (!parsed.length) return;
    setLines(parsed.map((p) => mkLine(p.pn, p.qty)));
    setEntryMode("lines");
    toast(`${parsed.length} line${parsed.length === 1 ? "" : "s"} added. Check the quantities and send.`);
  }

  if (receipt) {
    return (
      <div className="u-page rfq-wrap">
        <div className="rfq-done" role="status" ref={doneRef}>
          <span className="badge badge-accent rfq-done-badge">Request received</span>
          <h1 className="au-h1 rfq-done-title">Your request is with an account manager now.</h1>
          <p className="rfq-done-eta">
            Expect the answer at <b>{receipt.email}</b> in writing by{" "}
            <b>{receipt.eta}</b>
            {receipt.aog ? " — flagged AOG and pulled to the front of the 24/7 desk." : "."}
          </p>

          <div className="card rfq-done-card">
            <h2 className="rfq-done-sub">What we received</h2>
            <table className="spec-table rfq-summary">
              <thead>
                <tr>
                  <th>Part number</th>
                  <th>Qty</th>
                  <th>Condition</th>
                </tr>
              </thead>
              <tbody>
                {receipt.lines.map((l, i) => (
                  <tr key={i}>
                    <td className="u-mono">{l.pn}</td>
                    <td className="u-mono">{l.qty}</td>
                    <td>{l.condition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="rfq-done-ref">
              Your reference: <span className="u-mono">{receipt.ref}</span>
            </p>
          </div>

          <div className="notice rfq-done-notice">
            <strong>
              Quotes arrive from <span className="u-mono">sales@aerospaceunlimited.com</span>.
            </strong>{" "}
            If nothing has landed in 15 minutes, check your spam folder before assuming it
            did not send — then call <a href="tel:+17147054780">+1-714-705-4780</a>.
          </div>

          <div className="rfq-done-again">
            <button className="btn btn-primary btn-lg" type="button" onClick={() => setReceipt(null)}>
              Start another request
            </button>
            <Link className="btn btn-quiet btn-lg" href="/part-types">
              Keep browsing the catalog
            </Link>
          </div>

          <p className="u-caption rfq-done-aog">
            Situation changed and this is now urgent?{" "}
            <a href="tel:+17147054780">Call the 24/7 AOG desk on +1-714-705-4780</a> and quote
            your reference — we will pull it forward.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="u-page rfq-wrap">
      <ol className="breadcrumb rfq-crumbs">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>Request a quote</li>
      </ol>

      <div className="pdp-layout">
        <div>
          <h1 className="au-h1 rfq-title">{title}</h1>
          <p className="rfq-lede">
            Tell us what you need and where to send the answer. A named account manager
            replies within 15 minutes, day or night.
          </p>

          <ValidatedForm
            className="rfq-form"
            onValid={(form) => {
              const data = new FormData(form);
              const pns = data.getAll("pn").map(String);
              const qtys = data.getAll("qty").map(String);
              const conds = data.getAll("condition").map(String);
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
                lines: pns.map((p, i) => ({
                  pn: p,
                  qty: qtys[i] ?? "1",
                  condition: conds[i] ?? "Any condition",
                })),
                email: String(data.get("email") || "your email"),
                aog: data.get("aog") === "1",
                needby: String(data.get("needby") || ""),
                ref,
                eta,
              });
              /* A converted list should not linger as if it were still pending. */
              clear();
              return false;
            }}
          >
            {/* 1 — WHAT DO YOU NEED */}
            <fieldset className="rfq-fs">
              <legend className="rfq-legend">1. What do you need?</legend>

              <div className="rfq-modes" role="tablist" aria-label="How to enter parts">
                <button
                  type="button"
                  role="tab"
                  aria-selected={entryMode === "lines"}
                  className={`btn btn-sm ${entryMode === "lines" ? "btn-quiet" : "btn-ghost"}`}
                  onClick={() => setEntryMode("lines")}
                >
                  Enter line by line
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={entryMode === "paste"}
                  className={`btn btn-sm ${entryMode === "paste" ? "btn-quiet" : "btn-ghost"}`}
                  onClick={() => setEntryMode("paste")}
                >
                  Paste a list
                </button>
              </div>

              {entryMode === "lines" ? (
                <div>
                  <div className="rfq-lines">
                    {lines.map((l) => (
                      <div className="card rfq-line" key={l.id}>
                        <div className="field-row">
                          <div className="field rfq-line-pn" data-label="Part number">
                            <label htmlFor={`pn-${l.id}`}>
                              Part number <span className="required" aria-hidden="true">*</span>
                            </label>
                            <input
                              id={`pn-${l.id}`}
                              name="pn"
                              type="text"
                              required
                              data-mono
                              autoComplete="off"
                              placeholder="e.g. MS21042L3"
                              value={l.pn}
                              onChange={(e) => updateLine(l.id, { pn: e.target.value })}
                            />
                            <div className="error" />
                          </div>
                          <div className="field rfq-line-qty" data-label="Quantity">
                            <label htmlFor={`qty-${l.id}`}>
                              Quantity <span className="required" aria-hidden="true">*</span>
                            </label>
                            <NumberField
                              id={`qty-${l.id}`}
                              name="qty"
                              min={1}
                              required
                              data-mono
                              value={l.qty}
                              onChange={(e) =>
                                updateLine(l.id, { qty: Math.max(1, parseInt(e.target.value, 10) || 1) })
                              }
                            />
                            <div className="error" />
                          </div>
                          <div className="field rfq-line-cond" data-label="Condition">
                            <label htmlFor={`cond-${l.id}`}>Condition</label>
                            <select
                              id={`cond-${l.id}`}
                              name="condition"
                              value={l.condition}
                              onChange={(e) => updateLine(l.id, { condition: e.target.value })}
                            >
                              {CONDITIONS.map((c) => (
                                <option key={c}>{c}</option>
                              ))}
                            </select>
                            <div className="error" />
                          </div>
                        </div>
                        {lines.length > 1 ? (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm rfq-line-rm"
                            onClick={() => removeLine(l.id)}
                          >
                            Remove this line
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <button type="button" className="btn btn-quiet btn-sm rfq-add" onClick={addLine}>
                    + Add another part
                  </button>
                </div>
              ) : (
                <div>
                  <div className="field" data-label="Parts list">
                    <label htmlFor="paste">Paste your list</label>
                    <p className="hint">
                      One part per line. Add a quantity after a comma, tab or space — for
                      example <span className="u-mono">MS21042L3, 10</span>. Copying straight
                      from a spreadsheet column works.
                    </p>
                    <textarea
                      id="paste"
                      className="rfq-paste"
                      value={paste}
                      onChange={(e) => setPaste(e.target.value)}
                      placeholder={"MS21042L3, 10\nAN960-10L, 250\n114E1200-5, 2"}
                    />
                    <div className="error" />
                  </div>
                  <button type="button" className="btn btn-quiet btn-sm" onClick={convertPaste}>
                    Convert to lines
                  </button>
                </div>
              )}
            </fieldset>

            {/* 2 — WHERE SHOULD WE SEND IT */}
            <fieldset className="rfq-fs">
              <legend className="rfq-legend">2. Where should we send it?</legend>

              <div className="field" data-label="Email">
                <label htmlFor="email">
                  Email <span className="required" aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@company.com"
                />
                <p className="hint">
                  Used only to send your quote. No account is created and no newsletter is sent.
                </p>
                <div className="error" />
              </div>

              <details className="rfq-more">
                <summary>
                  Add company and phone details{" "}
                  <span className="optional">(optional — speeds up complex quotes)</span>
                </summary>
                <div className="field-row rfq-more-row">
                  <div className="field" data-label="Name">
                    <label htmlFor="name">Your name</label>
                    <input id="name" name="name" type="text" autoComplete="name" />
                    <div className="error" />
                  </div>
                  <div className="field" data-label="Company">
                    <label htmlFor="company">Company</label>
                    <input id="company" name="company" type="text" autoComplete="organization" />
                    <div className="error" />
                  </div>
                </div>
                <div className="field-row rfq-more-row">
                  <div className="field" data-label="Phone">
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" name="phone" type="tel" autoComplete="tel" />
                    <p className="hint">Only used if we need to clarify something to quote accurately.</p>
                    <div className="error" />
                  </div>
                  <div className="field" data-label="Country">
                    <label htmlFor="country">Ship-to country</label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      autoComplete="country-name"
                      placeholder="United States"
                    />
                    <p className="hint">Determines export-compliance handling.</p>
                    <div className="error" />
                  </div>
                </div>
              </details>
            </fieldset>

            {/* 3 — HOW URGENT */}
            <fieldset className="rfq-fs">
              <legend className="rfq-legend">3. How urgent is this?</legend>
              <div className="u-stack rfq-urgent">
                <label className="check">
                  <input type="checkbox" name="aog" value="1" />
                  <span>
                    <span className="t">Aircraft on ground (AOG)</span>
                    <span className="d">
                      Goes straight to the 24/7 desk ahead of the standard queue. Use this for
                      grounded-aircraft situations at any hour.
                    </span>
                  </span>
                </label>
                <div className="field rfq-needby" data-label="Needed by">
                  <label htmlFor="needby">
                    Needed by <span className="optional">(optional)</span>
                  </label>
                  <DatePicker id="needby" name="needby" />
                  <div className="error" />
                </div>
                <div className="field" data-label="Notes">
                  <label htmlFor="notes">
                    Anything else we should know? <span className="optional">(optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    className="rfq-notes"
                    defaultValue={noteDefault}
                    placeholder="Condition requirements, certification requirements, alternates acceptable, target price…"
                  />
                  <div className="error" />
                </div>
              </div>
            </fieldset>

            <div className="card rfq-submit">
              <button className="btn btn-primary btn-lg btn-block" type="submit">
                Send request — quote back within 15 minutes
              </button>
              <p className="u-caption u-center rfq-submit-note">
                No account required · We never sell or share your details · Answered 24/7,
                including weekends and holidays
              </p>
            </div>
          </ValidatedForm>
        </div>

        {/* REASSURANCE RAIL — the buyer's objections answered in peripheral
            vision while they fill the form, not before it.

            The copy is deliberately flat: each step is a subject and a fact,
            no asides, no "not a…" contrasts. The full accreditation set (the
            same CERTS inventory the homepage marquee scrolls) sits below it
            as a tile grid — every mark, because "which certificates do they
            hold" is exactly the question a vendor-approval buyer brings to
            this page. The rail is NOT sticky: it reads once and gets out of
            the way, rather than following the visitor down a long form. */}
        <aside className="rfq-panel">
          <div className="rfq-panel-head">
            <h2 className="u-h3">What happens next</h2>
          </div>
          <div className="rfq-panel-body">
            <ol className="rfq-steps">
              <li>
                <span className="rfq-step-num" aria-hidden="true">1</span>
                <div>
                  <h3>Send your request</h3>
                  <p>Your part numbers go straight to the quoting desk.</p>
                </div>
              </li>
              <li>
                <span className="rfq-step-num" aria-hidden="true">2</span>
                <div>
                  <h3>Get your quote in 15 minutes</h3>
                  <p>Price, availability, condition and lead time for every line.</p>
                </div>
              </li>
              <li>
                <span className="rfq-step-num" aria-hidden="true">3</span>
                <div>
                  <h3>Order if it works for you</h3>
                  <p>There is no obligation and no follow-up unless you ask.</p>
                </div>
              </li>
            </ol>

            <div className="rfq-panel-certs">
              <h3 className="rfq-certs-title">
                Accreditations &amp; memberships
              </h3>
              {/* Every mark the company holds — the homepage marquee's own
                  inventory, so the two can never disagree. Each tile's alt
                  and title name the accreditation. */}
              <ul className="rfq-certs-grid">
                {CERTS.map((c) => (
                  <li key={c.img}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/img/certs/${c.img}.png`}
                      alt={c.label}
                      title={c.label}
                      loading="lazy"
                      decoding="async"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rfq-panel-foot">
            Aircraft on ground? Call <a href="tel:+17147054780">+1-714-705-4780</a>.
            The AOG desk answers 24/7.
          </div>
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useQuote } from "./QuoteProvider";
import { useToast } from "./ToastProvider";

export function QuoteDrawer() {
  const { items, drawerOpen, closeDrawer, remove, setQty } = useQuote();
  const { toast } = useToast();
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (drawerOpen) {
      // This effect runs before focus moves, so the active element is still
      // whatever the buyer clicked to get here.
      lastFocus.current = document.activeElement as HTMLElement | null;
      closeRef.current?.focus();
    } else {
      lastFocus.current?.focus();
      lastFocus.current = null;
    }
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  const empty = items.length === 0;

  return (
    <>
      <div className="drawer-scrim" hidden={!drawerOpen} onClick={closeDrawer} />
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-drawer-title"
        hidden={!drawerOpen}
      >
        <div className="drawer-head">
          <h2 id="quote-drawer-title">Your quote list</h2>
          <button
            className="btn btn-ghost btn-sm"
            type="button"
            ref={closeRef}
            aria-label="Close quote list"
            onClick={closeDrawer}
          >
            Close ✕
          </button>
        </div>

        <div className="drawer-body">
          {empty ? (
            <div style={{ padding: "var(--au-s-6) 0", textAlign: "center" }}>
              <p className="u-body-strong">Your quote list is empty.</p>
              <p
                className="u-caption"
                style={{
                  marginTop: "var(--au-s-2)",
                  maxWidth: "34ch",
                  marginInline: "auto",
                }}
              >
                Add parts as you browse and request one quote for all of them at once.
              </p>
              <Link
                className="btn btn-quiet"
                style={{ marginTop: "var(--au-s-4)" }}
                href="/browse"
                onClick={closeDrawer}
              >
                Browse the catalog
              </Link>
            </div>
          ) : (
            items.map((i) => (
              <div className="qline" key={i.pn}>
                <div>
                  <div className="pn">{i.pn}</div>
                  <div className="desc">{i.desc}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "var(--au-s-2)",
                  }}
                >
                  <div className="controls">
                    <label className="u-visually-hidden" htmlFor={`qty-${i.pn}`}>
                      Quantity for {i.pn}
                    </label>
                    <input
                      id={`qty-${i.pn}`}
                      type="number"
                      min={1}
                      value={i.qty}
                      onChange={(e) => setQty(i.pn, e.target.value)}
                    />
                  </div>
                  <button
                    className="remove"
                    type="button"
                    onClick={() => {
                      remove(i.pn);
                      toast(`${i.pn} removed.`);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="drawer-foot">
          {/* Goes straight to the RFQ form, which prefills from this list. Adding
              a review page in between would be one more click for zero
              information. */}
          <Link
            className="btn btn-primary btn-block btn-lg"
            href="/rfq"
            onClick={closeDrawer}
            aria-disabled={empty || undefined}
            style={empty ? { opacity: 0.5, pointerEvents: "none" } : undefined}
          >
            Request quotes for these parts
          </Link>
          <p className="u-caption u-center" style={{ marginTop: "var(--au-s-3)" }}>
            One form, all lines. Quote back within 15 minutes.
          </p>
        </div>
      </aside>
    </>
  );
}

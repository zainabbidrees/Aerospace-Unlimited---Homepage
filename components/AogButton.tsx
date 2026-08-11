"use client";

/* ==========================================================================
   AOG button — the 24/7 "aircraft on ground" control in the header.

   It is still a real `tel:` anchor, so with no JS (or in a screenshot
   renderer) a click dials the desk directly and nothing is lost. WITH JS the
   click is intercepted and a small popover opens first — it names the desk,
   says plainly that continuing places a call, and offers the number both as a
   tap-to-call button and as readable text. That removes the jarring "tapped a
   badge, phone is suddenly dialing" moment without hiding the number that used
   to sit beside it in the navbar.
   ========================================================================== */

import { useEffect, useRef, useState } from "react";

const AOG_TEL = "+17147054780";
const AOG_DISPLAY = "+1–714–705–4780";

export function AogButton() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const callRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    // Move focus to the call action so the popover is keyboard-usable at once.
    callRef.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="aog" ref={wrapRef}>
      <a
        className="btn btn-aog"
        href={`tel:${AOG_TEL}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
      >
        <span className="dot" aria-hidden="true" />
        <span>
          AOG<span className="label-desktop"> 24/7</span>
        </span>
      </a>

      {open ? (
        <div className="aog-pop" role="dialog" aria-label="Call the AOG desk">
          <p className="aog-pop-k">
            <span className="dot" aria-hidden="true" />
            Aircraft on Ground · 24/7
          </p>
          <p className="aog-pop-t">
            Our emergency desk is staffed around the clock. Continuing will place a
            call to:
          </p>
          <a className="btn btn-primary btn-block aog-pop-call" href={`tel:${AOG_TEL}`} ref={callRef}>
            Call {AOG_DISPLAY}
          </a>
        </div>
      ) : null}
    </div>
  );
}

"use client";

/* ==========================================================================
   NumberField — a − / + quantity counter in place of the browser's tiny,
   dated native spin buttons.

   The wrapper `.numfield` carries the well look (border, recessed shadow,
   focus ring via :focus-within); the inner input is stripped bare and
   centered between the two step buttons, with the native ::-webkit spinners
   hidden in CSS. Stepping sets the value through the input's NATIVE value
   setter and dispatches a real `input` event, so it works whether the parent
   drives the input as controlled (value + onChange) or uncontrolled
   (defaultValue): a controlled parent's onChange fires exactly as if the
   value were typed. The buttons are aria-hidden and out of the tab order —
   the input itself, with its own keyboard up/down, remains the accessible
   control.
   ========================================================================== */

import { useRef } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function NumberField({ className, ...props }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  const step = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const min = props.min != null ? Number(props.min) : -Infinity;
    const max = props.max != null ? Number(props.max) : Infinity;
    const by = props.step != null ? Number(props.step) : 1;
    const cur = parseFloat(el.value);
    const base = Number.isFinite(cur) ? cur : Number.isFinite(min) ? min : 0;
    const next = Math.min(max, Math.max(min, base + dir * by));
    const set = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    set?.call(el, String(next));
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.focus();
  };

  return (
    <span className="numfield">
      <button
        type="button"
        className="numfield-step"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => step(-1)}
      >
        <svg viewBox="0 0 12 12" width="12" height="12">
          <path
            d="M2 6h8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <input ref={ref} type="number" className={className} {...props} />
      <button
        type="button"
        className="numfield-step"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => step(1)}
      >
        <svg viewBox="0 0 12 12" width="12" height="12">
          <path
            d="M6 2v8M2 6h8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </span>
  );
}

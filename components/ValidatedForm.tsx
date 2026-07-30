"use client";

/* ==========================================================================
   Form validation

   Validate on submit and on blur-after-error only — never while the buyer
   is still mid-word. Errors are shown next to the field, described in
   plain language, and focus jumps to the first one.

   This stays a DOM pass over `.field` blocks rather than becoming a
   controlled-input abstraction, for two reasons: the markup and the CSS
   contract (`.field[data-invalid]`, `.error`, `data-label`) carry over from
   the prototype untouched, and the forms here are long and mostly static, so
   per-keystroke re-renders of a forty-field RFQ would buy nothing.
   ========================================================================== */

import { useCallback, useEffect, useRef } from "react";

type Props = Omit<React.ComponentPropsWithoutRef<"form">, "onSubmit"> & {
  /* Runs only once every field passes. Return false to keep the browser from
     performing the form's native action (used by the pages that hand off to a
     client transition instead). */
  onValid?: (form: HTMLFormElement, e: React.FormEvent<HTMLFormElement>) => boolean | void;
};

export function ValidatedForm({ children, onValid, ...rest }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const validateField = useCallback((field: HTMLElement): boolean => {
    const input = field.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, select, textarea"
    );
    if (!input) return true;
    const err = field.querySelector<HTMLElement>(".error");
    let message = "";

    if ("required" in input && input.required && !input.value.trim()) {
      message = `${field.dataset.label || "This field"} is required.`;
    } else if (
      input instanceof HTMLInputElement &&
      input.type === "email" &&
      input.value &&
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)
    ) {
      message = "Enter a valid email address, e.g. name@company.com";
    } else if (
      input instanceof HTMLInputElement &&
      input.type === "number" &&
      input.value &&
      Number(input.value) < 1
    ) {
      message = "Quantity must be at least 1.";
    }

    field.dataset.invalid = String(Boolean(message));
    if (err) err.textContent = message;
    input.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }, []);

  const fields = useCallback(
    () => Array.from(formRef.current?.querySelectorAll<HTMLElement>(".field") ?? []),
    []
  );

  /* Re-validation after a field has already failed. Delegated from the form
     rather than bound per input, so fields added to the DOM later — the RFQ's
     extra part lines — are covered without a re-wire. `blur` and `focusout`
     differ here: only the latter bubbles. */
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    /* Suppress the browser's native validation. Without this it fires first
       and short-circuits everything below — so the plain-language messages,
       the per-field marking and the focus-the-first-error behaviour never
       run, and the buyer gets an unstyled native bubble that vanishes on the
       next click instead. Set here rather than in the markup so no page can
       forget it. */
    form.setAttribute("novalidate", "");

    const recheck = (e: Event) => {
      const field = (e.target as HTMLElement).closest<HTMLElement>(".field");
      if (field && field.dataset.invalid === "true") validateField(field);
    };
    form.addEventListener("focusout", recheck);
    form.addEventListener("input", recheck);
    return () => {
      form.removeEventListener("focusout", recheck);
      form.removeEventListener("input", recheck);
    };
  }, [validateField]);

  return (
    <form
      ref={formRef}
      {...rest}
      onSubmit={(e) => {
        const bad = fields().filter((f) => !validateField(f));
        if (bad.length) {
          e.preventDefault();
          const first = bad[0].querySelector<HTMLElement>("input, select, textarea");
          first?.focus();
          first?.scrollIntoView({ block: "center", behavior: "smooth" });
          return;
        }
        if (onValid && formRef.current) {
          if (onValid(formRef.current, e) === false) e.preventDefault();
        }
      }}
    >
      {children}
    </form>
  );
}

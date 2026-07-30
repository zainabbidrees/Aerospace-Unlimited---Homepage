"use client";

import { useEffect, useRef, useState } from "react";

/* Identifiers on a part page exist to be pasted into someone else's system,
   so copying one should never mean selecting 13 digits by hand. */
export function CopyButton({
  value,
  className = "btn btn-text btn-sm",
  children = "Copy",
}: {
  value: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  return (
    <button
      className={className}
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value);
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1400);
      }}
    >
      {copied ? "Copied" : children}
    </button>
  );
}

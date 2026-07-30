"use client";

import { ToastProvider } from "./ToastProvider";
import { QuoteProvider } from "./QuoteProvider";

/* Toast wraps Quote because the quote list raises its own undo toasts. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <QuoteProvider>{children}</QuoteProvider>
    </ToastProvider>
  );
}

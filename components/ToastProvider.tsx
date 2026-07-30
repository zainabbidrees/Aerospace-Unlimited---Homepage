"use client";

/* ==========================================================================
   Toast with undo

   "Add to quote" must never cost the buyer their place in a results list.
   Confirmation happens in place, and every add is reversible — which is
   what makes it safe to click without thinking.
   ========================================================================== */

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

interface Toast {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastApi {
  toast: (message: string, actionLabel?: string, onAction?: () => void) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const nextId = useRef(0);
  /* Timers are tracked so a toast dismissed by hand doesn't leave a pending
     removal for an id that has already been reused. */
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, actionLabel?: string, onAction?: () => void) => {
      const id = nextId.current++;
      setItems((prev) => [...prev, { id, message, actionLabel, onAction }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), 6000)
      );
    },
    [dismiss]
  );

  const api = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* The region is only in the DOM when it has something to say, matching
          the prototype, which created it lazily on the first toast. */}
      {items.length > 0 && (
        <div className="toast-region" role="status" aria-live="polite">
          {items.map((t) => (
            <div className="toast" key={t.id}>
              <span className="grow">{t.message}</span>
              {t.actionLabel && (
                <button
                  type="button"
                  onClick={() => {
                    t.onAction?.();
                    dismiss(t.id);
                  }}
                >
                  {t.actionLabel}
                </button>
              )}
              <button type="button" aria-label="Dismiss" onClick={() => dismiss(t.id)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

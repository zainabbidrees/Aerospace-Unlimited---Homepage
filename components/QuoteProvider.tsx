"use client";

/* ==========================================================================
   Quote list

   Persisted so a buyer who opens six parts in six tabs — normal behaviour
   when sourcing a work package — still ends up with one RFQ, not six.
   ========================================================================== */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Part } from "@/lib/data";
import { useToast } from "./ToastProvider";

const STORE = "au_quote_list";

export interface QuoteLine {
  pn: string;
  desc: string;
  mfr: string;
  nsn: string;
  qty: number;
  condition: string;
}

interface QuoteApi {
  items: QuoteLine[];
  /* False until the localStorage read has happened. Every control that
     renders a count must gate on this, or the server-rendered "0" and the
     client's real number disagree and React throws a hydration mismatch. */
  ready: boolean;
  has: (pn: string) => boolean;
  toggle: (part: Part) => void;
  add: (part: Part, qty?: number) => void;
  remove: (pn: string) => void;
  setQty: (pn: string, qty: number | string) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const QuoteContext = createContext<QuoteApi | null>(null);

export function useQuote(): QuoteApi {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside <QuoteProvider>");
  return ctx;
}

function read(): QuoteLine[] {
  try {
    const raw = localStorage.getItem(STORE);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteLine[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setItems(read());
    setReady(true);

    /* The six-tabs case the persistence exists for: a tab that was already
       open when another one added a part should not hold a stale list and
       overwrite it on the next change. */
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORE) setItems(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback((next: QuoteLine[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORE, JSON.stringify(next));
    } catch {
      /* Private browsing and full quotas both land here. The list still works
         for the current page; it just will not survive a reload. */
    }
  }, []);

  const add = useCallback(
    (part: Part, qty = 1) => {
      setItems((prev) => {
        const found = prev.find((i) => i.pn === part.pn);
        const next = found
          ? prev.map((i) => (i.pn === part.pn ? { ...i, qty: i.qty + qty } : i))
          : [
              ...prev,
              {
                pn: part.pn,
                desc: part.desc,
                mfr: part.mfr,
                nsn: part.nsn,
                qty,
                condition: part.condition,
              },
            ];
        try {
          localStorage.setItem(STORE, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    []
  );

  const remove = useCallback((pn: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.pn !== pn);
      try {
        localStorage.setItem(STORE, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const setQty = useCallback((pn: string, qty: number | string) => {
    setItems((prev) => {
      const n = Math.max(1, parseInt(String(qty), 10) || 1);
      const next = prev.map((i) => (i.pn === pn ? { ...i, qty: n } : i));
      try {
        localStorage.setItem(STORE, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const clear = useCallback(() => commit([]), [commit]);

  const has = useCallback((pn: string) => items.some((i) => i.pn === pn), [items]);

  /* One control, both directions, with the undo that makes it safe to click
     without reading. Living here rather than in the row component means the
     row stays presentational and the toast copy cannot drift between the
     places a part can be added from. */
  const toggle = useCallback(
    (part: Part) => {
      if (items.some((i) => i.pn === part.pn)) {
        const previous = items.find((i) => i.pn === part.pn)!;
        remove(part.pn);
        toast(`${part.pn} removed from your quote list.`, "Undo", () =>
          setItems((prev) => {
            const next = [...prev, previous];
            try {
              localStorage.setItem(STORE, JSON.stringify(next));
            } catch {}
            return next;
          })
        );
      } else {
        add(part, 1);
        toast(`${part.pn} added to your quote list.`, "Undo", () => remove(part.pn));
      }
    },
    [items, add, remove, toast]
  );

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  /* Scroll lock belongs with the state that causes it, not with the drawer
     component, so an unmount mid-open cannot leave the page frozen. */
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  const api = useMemo<QuoteApi>(
    () => ({
      items,
      ready,
      has,
      toggle,
      add,
      remove,
      setQty,
      clear,
      drawerOpen,
      openDrawer,
      closeDrawer,
    }),
    [items, ready, has, toggle, add, remove, setQty, clear, drawerOpen, openDrawer, closeDrawer]
  );

  return <QuoteContext.Provider value={api}>{children}</QuoteContext.Provider>;
}

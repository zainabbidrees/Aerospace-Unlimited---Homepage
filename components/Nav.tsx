"use client";

/* ==========================================================================
   Nav dropdowns

   Click-driven rather than hover-only, because hover menus are unusable on
   a touchscreen and hostile to anyone with a tremor. Hover still opens them
   on pointer devices for speed, but the click contract is what the panel is
   actually built on, so nothing depends on the cursor resting still.
   ========================================================================== */

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, type NavItem } from "./nav-data";

/* A nav item is "current" if it is the page, or if the page is one of the
   destinations inside its panel — so browsing manufacturers still lights up
   Catalog rather than leaving the bar looking unanchored. */
function owns(item: NavItem, pathname: string): boolean {
  if (item.href === pathname) return true;
  return (item.children ?? []).some((c) => c.href.split("#")[0] === pathname);
}

function panelId(label: string) {
  return "navpanel-" + label.toLowerCase().replace(/[^a-z]+/g, "-");
}

export function Nav() {
  const pathname = usePathname();
  /* Which panel is open, and whether it was opened deliberately. Reading the
     open state back off the DOM is what broke this in the prototype: hover had
     already opened the panel by the time the click fired, so the click toggled
     it straight back shut and the menu appeared not to work at all on a mouse.
     `locked` separates "open because the pointer is here" from "open because
     the user asked for it". */
  const [open, setOpen] = useState<string | null>(null);
  const [locked, setLocked] = useState<string | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement | null>());

  const close = useCallback(() => {
    setOpen(null);
    setLocked(null);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-nav-item]")) close();
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [close]);

  // A route change must not leave a panel hanging open over the new page.
  useEffect(() => close(), [pathname, close]);

  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    },
    []
  );

  const hoverCapable = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <nav className="header-nav" aria-label="Primary">
      <div className="u-page">
        {NAV.map((n) => {
          const current = owns(n, pathname) ? { "aria-current": "page" as const } : {};

          if (!n.children) {
            return (
              <Link className="nav-link" href={n.href} key={n.label} {...current}>
                {n.label}
              </Link>
            );
          }

          const id = panelId(n.label);
          const isOpen = open === n.label;

          return (
            <div
              className="nav-item"
              data-nav-item
              key={n.label}
              ref={(el) => {
                itemRefs.current.set(n.label, el);
              }}
              onMouseEnter={() => {
                if (!hoverCapable()) return;
                if (leaveTimer.current) clearTimeout(leaveTimer.current);
                if (locked !== n.label) setOpen(n.label);
              }}
              onMouseLeave={() => {
                if (!hoverCapable()) return;
                if (locked === n.label) return;
                // A short grace period so a diagonal cursor path to the panel
                // does not slam it shut mid-movement.
                leaveTimer.current = setTimeout(() => {
                  setOpen((cur) => (cur === n.label ? null : cur));
                }, 180);
              }}
              onKeyDown={(e) => {
                const item = itemRefs.current.get(n.label);
                const links = item
                  ? Array.from(
                      item.querySelectorAll<HTMLAnchorElement>(".nav-panel-link, .nav-panel-foot")
                    )
                  : [];

                // Escape closes and returns focus to the toggle so keyboard
                // users never get stranded inside the panel.
                if (e.key === "Escape") {
                  close();
                  item?.querySelector<HTMLButtonElement>("[data-nav-toggle]")?.focus();
                  return;
                }
                if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  if (!isOpen) {
                    setOpen(n.label);
                    setLocked(n.label);
                    // The panel is hidden until this render commits, so focus
                    // has to wait for it to exist.
                    requestAnimationFrame(() => {
                      const fresh = itemRefs.current
                        .get(n.label)
                        ?.querySelector<HTMLAnchorElement>(".nav-panel-link, .nav-panel-foot");
                      fresh?.focus();
                    });
                    return;
                  }
                  const i = links.indexOf(document.activeElement as HTMLAnchorElement);
                  const next =
                    e.key === "ArrowDown"
                      ? i < 0
                        ? 0
                        : (i + 1) % links.length
                      : i <= 0
                        ? links.length - 1
                        : i - 1;
                  links[next]?.focus();
                }
              }}
              /* Tabbing out of the panel closes it — but only when focus
                 actually lands somewhere else on the page. A null
                 relatedTarget, or <body>, means focus left the document or was
                 simply dropped, not a deliberate move elsewhere. Treating
                 either as "tabbed away" collapsed the panel the instant
                 anything took focus off the button, which read as the menu
                 refusing to open at all. */
              onBlur={(e) => {
                const to = e.relatedTarget as Node | null;
                if (!to || to === document.body) return;
                const item = itemRefs.current.get(n.label);
                if (item && !item.contains(to)) {
                  setOpen((cur) => (cur === n.label ? null : cur));
                  setLocked((cur) => (cur === n.label ? null : cur));
                }
              }}
            >
              <button
                className="nav-link nav-link-toggle"
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                data-nav-toggle
                {...current}
                onClick={() => {
                  const next = locked !== n.label;
                  setLocked(next ? n.label : null);
                  setOpen(next ? n.label : null);
                }}
              >
                {n.label}
                <span className="nav-caret" aria-hidden="true" />
              </button>
              <div className="nav-panel" id={id} data-nav-panel hidden={!isOpen}>
                <div className="nav-panel-grid" data-cols={n.columns ?? 1}>
                  {n.children.map((c, i) => (
                    <Link className="nav-panel-link" href={c.href} key={`${c.href}-${i}`}>
                      <span className="t">{c.label}</span>
                      <span className="d">{c.note}</span>
                    </Link>
                  ))}
                </div>
                {n.foot && (
                  <Link className="nav-panel-foot" href={n.foot.href}>
                    {n.foot.label} →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

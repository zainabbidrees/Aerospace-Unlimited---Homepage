/* ==========================================================================
   Site chrome

   Header and footer live in the root layout so the persistent elements —
   search, AOG, quote list — are provably identical on every page. A search
   box that shifts position between pages is a real, measurable cost to a
   buyer moving fast.
   ========================================================================== */

import Link from "next/link";
import { SearchField } from "./SearchField";
import { AogButton } from "./AogButton";
import { QuoteButton } from "./QuoteButton";
import { CartButton } from "./CartButton";
import { Nav } from "./Nav";

/* Two rows, not three. The utility strip was carrying a promise already
   stated in the hero and an email address already in the footer, so it
   earned its removal — the phone number is the only part of it a buyer
   acts on, and it moves inline.

   The quote actions are split so no control does two jobs. "Request a Quote"
   (QuoteButton) always opens the RFQ form. The staged cart has its own button
   (CartButton) that appears once parts are collected, carries the count, and
   goes straight to the same form — no review drawer in between (the drawer was
   removed 2026-08-06). Earlier this was one state-dependent button that opened
   a drawer with a list but went to the form when empty, which is the confusion
   this split removes. AOG stays because it is a different job at a different
   urgency, and it is a phone link — the live site sells AOG as a 24/7 service,
   and for a grounded aircraft the phone is the mechanism. */
export function SiteHeader({ showSearch = true }: { showSearch?: boolean }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="header-main">
          <div className="u-page">
            <Link className="logo" href="/">
              Aerospace Unlimited
            </Link>
            {showSearch ? (
              <SearchField id="header-search" compact />
            ) : (
              <div style={{ flex: 1 }} />
            )}
            <div className="header-actions">
              <AogButton />
              <CartButton />
              <QuoteButton />
            </div>
          </div>
        </div>

        <Nav />
      </header>
    </>
  );
}

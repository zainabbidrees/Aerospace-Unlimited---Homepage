/* ==========================================================================
   Site chrome

   Header and footer live in the root layout so the persistent elements —
   search, AOG, quote list — are provably identical on every page. A search
   box that shifts position between pages is a real, measurable cost to a
   buyer moving fast.
   ========================================================================== */

import Link from "next/link";
import { SearchField } from "./SearchField";
import { QuoteButton } from "./QuoteButton";
import { Nav } from "./Nav";

/* Two rows, not three. The utility strip was carrying a promise already
   stated in the hero and an email address already in the footer, so it
   earned its removal — the phone number is the only part of it a buyer
   acts on, and it moves inline.

   Two actions, not three. "Request a Quote" and "Quote List" were
   competing for the same intent; they are now one button whose BEHAVIOUR
   changes with state while its label does not — it reads "Request a Quote"
   throughout and a count badge carries the staged parts. It used to rename
   itself to "Quote List" once anything was collected; that was reverted on
   2026-08-05, see QuoteButton.tsx. AOG stays because it is a different job
   at a different urgency, and it is a phone link — the live site sells AOG
   as a 24/7 service, and for a grounded aircraft the phone is the
   mechanism. */
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
              <a className="header-phone" href="tel:+17147054780">
                +1-714-705-4780
              </a>
              <a className="btn btn-aog" href="tel:+17147054780">
                <span className="dot" aria-hidden="true" />
                <span>
                  AOG<span className="label-desktop"> 24/7</span>
                </span>
              </a>
              <QuoteButton />
            </div>
          </div>
        </div>

        <Nav />
      </header>
    </>
  );
}

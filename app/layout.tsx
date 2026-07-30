import type { Metadata } from "next";
import "@/styles/ux.css";
import { Providers } from "@/components/Providers";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { QuoteDrawer } from "@/components/QuoteDrawer";

export const metadata: Metadata = {
  title: {
    default: "Aerospace Unlimited — Aviation & aerospace parts, quoted in 15 minutes",
    template: "%s — Aerospace Unlimited",
  },
  description:
    "Search over 2 billion aviation and aerospace part numbers by part number, NSN, NIIN or CAGE code. Quotes returned within 15 minutes, 24/7. AS9120B and ISO 9001:2015 accredited.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Both faces are pulled by @import at the top of ux.css. Preconnecting
            here shaves the DNS and TLS round-trips off the critical path.
            See design.md → Open items: self-hosting is the production path. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body>
        <Providers>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <QuoteDrawer />
        </Providers>
      </body>
    </html>
  );
}

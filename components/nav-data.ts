/* ==========================================================================
   Primary navigation

   Flat, matching the live site: the six identifier lookups are each their own
   top-level item rather than being folded into a catalog hub, because that is
   how the live nav carries them and how buyers expect to find them.

   Live order: About Us, Manufacturers, FSCs, NIIN, NSN, Part Types, CAGE Code,
   Other Resource, Blog, Contact Us. "Other Resource" stays a dropdown of the
   four standalone resource pages. Quality lives in the footer, which is where
   the live site keeps it too (Company Information → Quality).
   ========================================================================== */

export interface NavChild {
  href: string;
  label: string;
  note: string;
}

export interface NavItem {
  href: string;
  label: string;
  columns?: 1 | 2;
  children?: NavChild[];
  foot?: { href: string; label: string };
}

export const NAV: NavItem[] = [
  { href: "/about", label: "About Us" },
  { href: "/manufacturers", label: "Manufacturers" },
  { href: "/fscs", label: "FSCs" },
  { href: "/niin", label: "NIIN" },
  { href: "/nsn", label: "NSN" },
  { href: "/part-types", label: "Part Types" },
  { href: "/cage-codes", label: "CAGE Code" },
  {
    href: "/gse-tooling",
    label: "Other Resource",
    columns: 1,
    children: [
      { href: "/gse-tooling", label: "GSE Tooling", note: "Ground support equipment and tooling" },
      { href: "/pma-supplements", label: "PMA Supplements List", note: "Approved supplements by aircraft type" },
      { href: "/salvaged-aircraft-parts", label: "Salvaged Aircraft Parts", note: "Traceable teardown inventory" },
      { href: "/pma-parts", label: "PMA Parts", note: "FAA-approved alternatives to OEM lines" },
    ],
  },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

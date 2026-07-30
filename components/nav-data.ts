/* ==========================================================================
   Primary navigation

   The live site carries ten top-level items — About Us, Manufacturers,
   FSCs, NIIN, NSN, Part Types, CAGE Code, Other Resource, Blog, Contact Us.
   Six of those ten are all the same task ("find a part by an identifier I
   happen to hold"), so they collapse into one Catalog hub that still
   contains every one of them. Nothing is removed from the site; the choice
   is simply made on one page instead of in the nav bar.

   Quality moves to the footer, which is where the live site keeps it too
   (Company Information → Quality).
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
  {
    href: "/browse",
    label: "Catalog",
    /* The six identifier routes the live site carries as separate top-level
       nav items. Collapsing them into a hub link alone cost a click from
       every page; as a panel they are visible again without crowding the
       bar. Each carries a one-line explanation, because "NIIN" means
       nothing to a buyer who has only ever called it a part number. */
    columns: 2,
    children: [
      { href: "/browse/manufacturers", label: "By Manufacturer", note: "A–Z index, with CAGE codes" },
      { href: "/browse#categories", label: "By Part Type / FSC", note: "Grouped by what the part does" },
      { href: "/browse/aircraft", label: "By Aircraft Model", note: "Airframe and rotorcraft platforms" },
      { href: "/browse#identifiers", label: "By NSN", note: "13-digit National Stock Number" },
      { href: "/browse#identifiers", label: "By NIIN", note: "The last 9 digits of an NSN" },
      { href: "/browse/manufacturers", label: "By CAGE Code", note: "5-character manufacturer code" },
    ],
    foot: { href: "/browse", label: "View the full catalog" },
  },
  {
    href: "/capabilities",
    label: "Other Resources",
    columns: 1,
    children: [
      { href: "/capabilities#gse", label: "GSE Tooling", note: "Ground support equipment and tooling" },
      { href: "/capabilities#pma", label: "PMA Supplements List", note: "Approved supplements by aircraft type" },
      { href: "/capabilities#pma", label: "PMA Parts", note: "Approved alternatives to OEM lines" },
      { href: "/capabilities#salvage", label: "Salvaged Aircraft Parts", note: "Traceable teardown inventory" },
      { href: "/capabilities#repair", label: "Aircraft Repair Capabilities", note: "Assessment and overhaul" },
    ],
  },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

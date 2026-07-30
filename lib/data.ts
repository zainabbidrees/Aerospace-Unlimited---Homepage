/* ==========================================================================
   Aerospace Unlimited — prototype catalog data

   Stand-in data so the flows are genuinely clickable. Part numbers, NSNs and
   CAGE codes here are illustrative and are NOT real inventory records.
   In production this comes from the catalog API.

   Ported verbatim from prototype/assets/data.js. This module has no client
   dependency, so server components read it directly at request time and the
   catalog never ships to the browser except where a page genuinely needs to
   filter it live (the search field).
   ========================================================================== */

export type Stock = "in" | "limited" | "quote";

export interface Manufacturer {
  name: string;
  cage: string;
  count: number;
}

export interface Category {
  slug: string;
  name: string;
  fsc: string;
  count: number;
}

export interface Aircraft {
  slug: string;
  name: string;
  count: number;
}

export interface Part {
  pn: string;
  desc: string;
  nsn: string;
  niin: string;
  cage: string;
  fsc: string;
  mfr: string;
  category: string;
  stock: Stock;
  qty: number;
  condition: string;
  lead: string;
  aircraft: string[];
}

export interface TopNsn {
  nsn: string;
  desc: string;
  img: string;
  alt: string;
}

export interface Resource {
  id: string;
  name: string;
  note: string;
  href?: string;
  /* A decorative photograph for the open slat, revealed as it expands. Basename
     of a file in /img/resources — never captioned, and rendered aria-hidden:
     these are ambient treatment, not evidence of the specific capability. See
     au-stock-photography-scope. */
  img?: string;
}

export const MANUFACTURERS: Manufacturer[] = [
  { name: "Honeywell International", cage: "99193", count: 184320 },
  { name: "Collins Aerospace", cage: "0MEV7", count: 152880 },
  { name: "Parker Hannifin", cage: "12345", count: 96410 },
  { name: "Safran Landing Systems", cage: "F0203", count: 74215 },
  { name: "Eaton Aerospace", cage: "73842", count: 68930 },
  { name: "Meggitt Aerospace", cage: "K0473", count: 51204 },
  { name: "Moog Inc.", cage: "94697", count: 47188 },
  { name: "Crane Aerospace", cage: "56878", count: 39640 },
  { name: "TransDigm Group", cage: "1AB29", count: 35812 },
  { name: "Ametek Aerospace", cage: "80058", count: 28470 },
  { name: "Bell Textron", cage: "97499", count: 24105 },
  { name: "GE Aviation", cage: "07482", count: 118640 },
  { name: "Woodward Inc.", cage: "99251", count: 21980 },
  { name: "Zodiac Aerospace", cage: "F6218", count: 19340 },
];

export const CATEGORIES: Category[] = [
  { slug: "valves", name: "Valves & Regulators", fsc: "4820", count: 42180 },
  { slug: "pumps", name: "Pumps & Fuel Components", fsc: "4320", count: 38640 },
  { slug: "bearings", name: "Bearings & Bushings", fsc: "3110", count: 61230 },
  { slug: "electrical", name: "Electrical Connectors", fsc: "5935", count: 54710 },
  { slug: "instruments", name: "Flight Instruments", fsc: "6610", count: 22940 },
  { slug: "landing-gear", name: "Landing Gear Components", fsc: "1620", count: 18320 },
  { slug: "hydraulics", name: "Hydraulic Actuators", fsc: "1650", count: 27650 },
  { slug: "fasteners", name: "Fasteners & Hardware", fsc: "5306", count: 94210 },
  { slug: "filters", name: "Filters & Elements", fsc: "2940", count: 16480 },
  { slug: "seals", name: "Seals, Gaskets & O-Rings", fsc: "5330", count: 47390 },
  { slug: "switches", name: "Switches & Relays", fsc: "5930", count: 31870 },
  { slug: "avionics", name: "Avionics & Radio", fsc: "5821", count: 14260 },
];

export const AIRCRAFT: Aircraft[] = [
  { slug: "b737", name: "Boeing 737 (all series)", count: 128400 },
  { slug: "a320", name: "Airbus A320 family", count: 116230 },
  { slug: "b777", name: "Boeing 777", count: 87610 },
  { slug: "crj", name: "Bombardier CRJ series", count: 41280 },
  { slug: "uh60", name: "Sikorsky UH-60 Black Hawk", count: 68940 },
  { slug: "ch47", name: "Boeing CH-47 Chinook", count: 52170 },
  { slug: "bell206", name: "Bell 206 JetRanger", count: 24860 },
  { slug: "c130", name: "Lockheed C-130 Hercules", count: 79320 },
];

/* Each part carries every identifier a buyer might be holding, because we
   cannot know which one they'll search by. */
export const PARTS: Part[] = [
  {
    pn: "MS21042L3", desc: "Nut, Self-Locking, Hexagon, Reduced Height",
    nsn: "5310-00-877-5797", niin: "008775797", cage: "96906", fsc: "5310",
    mfr: "Honeywell International", category: "fasteners", stock: "in", qty: 4820,
    condition: "New / Factory Sealed", lead: "Same day", aircraft: ["b737", "a320"],
  },
  {
    pn: "AN960-10L", desc: "Washer, Flat, Light Series, Aluminium Alloy",
    nsn: "5310-00-167-0821", niin: "001670821", cage: "88044", fsc: "5310",
    mfr: "Parker Hannifin", category: "fasteners", stock: "in", qty: 12600,
    condition: "New / Factory Sealed", lead: "Same day", aircraft: ["b737", "c130"],
  },
  {
    pn: "114E1200-5", desc: "Valve Assembly, Pressure Regulating, Bleed Air",
    nsn: "4820-01-234-5678", niin: "012345678", cage: "99193", fsc: "4820",
    mfr: "Honeywell International", category: "valves", stock: "limited", qty: 6,
    condition: "Overhauled / 8130-3", lead: "1–2 days", aircraft: ["b737", "b777"],
  },
  {
    pn: "60B00025-1", desc: "Actuator, Hydraulic, Linear, Flight Control",
    nsn: "1650-01-445-9012", niin: "014459012", cage: "94697", fsc: "1650",
    mfr: "Moog Inc.", category: "hydraulics", stock: "quote", qty: 0,
    condition: "Serviceable / Traceable", lead: "Quote required", aircraft: ["uh60"],
  },
  {
    pn: "2610-1234-01", desc: "Pump, Fuel Boost, Centrifugal, 28 VDC",
    nsn: "4320-01-556-7788", niin: "015567788", cage: "73842", fsc: "4320",
    mfr: "Eaton Aerospace", category: "pumps", stock: "in", qty: 34,
    condition: "New Surplus", lead: "Same day", aircraft: ["a320", "crj"],
  },
  {
    pn: "MS27484T10B35S", desc: "Connector, Receptacle, Electrical, Circular",
    nsn: "5935-01-098-7654", niin: "010987654", cage: "0MEV7", fsc: "5935",
    mfr: "Collins Aerospace", category: "electrical", stock: "in", qty: 782,
    condition: "New / Factory Sealed", lead: "Same day", aircraft: ["b777", "c130"],
  },
  {
    pn: "101420-01", desc: "Indicator, Altitude, Barometric, Servo-Driven",
    nsn: "6610-01-332-1100", niin: "013321100", cage: "80058", fsc: "6610",
    mfr: "Ametek Aerospace", category: "instruments", stock: "limited", qty: 3,
    condition: "Overhauled / 8130-3", lead: "2–3 days", aircraft: ["bell206", "crj"],
  },
  {
    pn: "3-1420-3", desc: "Bearing, Ball, Annular, Airframe, Sealed",
    nsn: "3110-00-100-2233", niin: "001002233", cage: "56878", fsc: "3110",
    mfr: "Crane Aerospace", category: "bearings", stock: "in", qty: 268,
    condition: "New / Factory Sealed", lead: "Same day", aircraft: ["b737", "uh60"],
  },
  {
    pn: "AS1895-14", desc: "Seal, Metallic, High Temperature, Engine",
    nsn: "5330-01-778-9900", niin: "017789900", cage: "K0473", fsc: "5330",
    mfr: "Meggitt Aerospace", category: "seals", stock: "in", qty: 145,
    condition: "New / Factory Sealed", lead: "Same day", aircraft: ["b777", "a320"],
  },
  {
    pn: "9550-3", desc: "Filter Element, Fluid, Hydraulic System",
    nsn: "2940-01-221-3344", niin: "012213344", cage: "12345", fsc: "2940",
    mfr: "Parker Hannifin", category: "filters", stock: "in", qty: 96,
    condition: "New / Factory Sealed", lead: "Same day", aircraft: ["c130", "ch47"],
  },
  {
    pn: "8TJ81GAB1", desc: "Switch, Toggle, Environmentally Sealed, DPDT",
    nsn: "5930-00-443-5566", niin: "004435566", cage: "99251", fsc: "5930",
    mfr: "Woodward Inc.", category: "switches", stock: "limited", qty: 11,
    condition: "New Surplus", lead: "1–2 days", aircraft: ["bell206", "uh60"],
  },
  {
    pn: "622-5130-001", desc: "Transceiver, VHF Communication, ARINC 750",
    nsn: "5821-01-667-8899", niin: "016678899", cage: "0MEV7", fsc: "5821",
    mfr: "Collins Aerospace", category: "avionics", stock: "quote", qty: 0,
    condition: "Serviceable / Traceable", lead: "Quote required", aircraft: ["crj", "b737"],
  },
  {
    pn: "201-076-001-101", desc: "Link Assembly, Landing Gear Drag Brace",
    nsn: "1620-01-889-0011", niin: "018890011", cage: "97499", fsc: "1620",
    mfr: "Bell Textron", category: "landing-gear", stock: "limited", qty: 2,
    condition: "Overhauled / 8130-3", lead: "3–5 days", aircraft: ["bell206"],
  },
  {
    pn: "F0203-4471", desc: "Cylinder Assembly, Main Landing Gear Shock Strut",
    nsn: "1620-01-990-1122", niin: "019901122", cage: "F0203", fsc: "1620",
    mfr: "Safran Landing Systems", category: "landing-gear", stock: "quote", qty: 0,
    condition: "Quote / Sourced to Order", lead: "Quote required", aircraft: ["a320"],
  },
  {
    pn: "390100-3", desc: "Valve, Check, Fuel System, In-Line",
    nsn: "4820-01-334-4455", niin: "013344455", cage: "1AB29", fsc: "4820",
    mfr: "TransDigm Group", category: "valves", stock: "in", qty: 58,
    condition: "New / Factory Sealed", lead: "Same day", aircraft: ["ch47", "c130"],
  },
  {
    pn: "9013M52P05", desc: "Bushing, Sleeve, Engine Mount, Nickel Alloy",
    nsn: "3120-01-556-6677", niin: "015566677", cage: "07482", fsc: "3120",
    mfr: "GE Aviation", category: "bearings", stock: "in", qty: 412,
    condition: "New / Factory Sealed", lead: "Same day", aircraft: ["b777"],
  },
];

/* "Top NSN" is a section on the live homepage. Stand-in values. */
/* The `img` on each row is the client's aerospace photography, used as
   ambient context for the card — it is the ENVIRONMENT the part works in, not
   a photograph of the part itself. Each one is paired to the system its NSN
   belongs to (hot section, flight deck, hydraulics) so the pairing reads as
   deliberate rather than random, but no card claims to depict its own item.
   Every `alt` describes the photograph, for the same reason. */
export const TOP_NSN: TopNsn[] = [
  { nsn: "5310-00-877-5797", desc: "Nut, Self-Locking, Hexagon",
    img: "engine-hangar", alt: "An engine with its cowling opened on a maintenance stand inside a lit hangar" },
  { nsn: "5310-00-167-0821", desc: "Washer, Flat, Light Series",
    img: "turboprop", alt: "A four-blade turboprop propeller and spinner seen head-on under a wing" },
  { nsn: "4820-01-234-5678", desc: "Valve, Pressure Regulating",
    img: "turbofan", alt: "The fan blades of a turbofan engine lit from below at dusk" },
  { nsn: "5935-01-098-7654", desc: "Connector, Receptacle, Electrical",
    img: "flight-deck", alt: "An airliner flight deck on final approach, instruments lit, runway ahead" },
  { nsn: "3110-00-100-2233", desc: "Bearing, Ball, Annular",
    img: "bizjet-dusk", alt: "A business jet parked nose-on at an airfield at sunset" },
  { nsn: "4320-01-556-7788", desc: "Pump, Fuel Boost, Centrifugal",
    img: "narrowbody-dusk", alt: "A narrow-body airliner taxiing head-on into an orange sunset" },
  { nsn: "5330-01-778-9900", desc: "Seal, Metallic, High Temperature",
    img: "nozzle", alt: "The exhaust nozzle of a military jet, petals closed, seen from behind" },
  { nsn: "2940-01-221-3344", desc: "Filter Element, Fluid, Hydraulic",
    img: "cargo-load", alt: "A pallet of freight on a loader being raised to a wide-body's cargo door" },
];

/* "Other Resources" — the five items in the live site's nav dropdown and
   homepage section, kept verbatim.

   NOTE: `id` is NOT unique — "Aircraft PMA Supplements" and "PMA Parts" both
   carry id "pma" deliberately, because both anchor to the one PMA section
   rather than inventing content for a second page. Anything rendering this
   list must key on the index, not on `id`. Flag for the client to confirm
   whether these are genuinely distinct offerings. */
export const RESOURCES: Resource[] = [
  { id: "gse", name: "GSE Tooling", note: "Ground support equipment and specialised maintenance tooling.", img: "gse" },
  { id: "aircraft", name: "Parts by Aircraft / Helicopter Model", note: "Browse by airframe or rotorcraft platform.", href: "/browse/aircraft", img: "aircraft" },
  { id: "pma", name: "Aircraft PMA Supplements", note: "Approved supplement listings by aircraft type.", img: "pma-supplements" },
  { id: "repair", name: "Aircraft Repair Capabilities", note: "Send a unit for assessment and overhaul.", img: "repair" },
  { id: "salvage", name: "Salvaged Aircraft Parts", note: "Traceable teardown inventory for legacy airframes.", img: "salvage" },
  { id: "pma", name: "PMA Parts", note: "Parts Manufacturer Approval alternatives to OEM lines.", img: "pma-parts" },
];

export function findPart(pn: string): Part | undefined {
  const target = pn.toUpperCase().replace(/[\s\-_./]/g, "");
  return PARTS.find((p) => p.pn.toUpperCase().replace(/[\s\-_./]/g, "") === target);
}

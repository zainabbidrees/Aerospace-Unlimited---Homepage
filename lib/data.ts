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

  /* ---- Extended working sample: at least two illustrative lines per Federal
     Supply Class in FSCS, so every /fscs/<code> detail page (and the part-type
     and manufacturer pages that draw from the same rows) is populated rather
     than empty. Still illustrative, NOT real inventory. See au-no-invented-content. */
  { pn: "S1560-4471", desc: "Fairing, Housing, Airframe", nsn: "1560-01-201-3344", niin: "012013344", cage: "F0203", fsc: "1560", mfr: "Safran Landing Systems", category: "seals", stock: "in", qty: 42, condition: "New / Factory Sealed", lead: "Same day", aircraft: ["a320"] },
  { pn: "1560-STR-88", desc: "Panel, Access, Structural", nsn: "1560-01-202-7788", niin: "012027788", cage: "0MEV7", fsc: "1560", mfr: "Collins Aerospace", category: "seals", stock: "limited", qty: 6, condition: "Overhauled / 8130-3", lead: "2–3 days", aircraft: ["b737"] },
  { pn: "PB-6109-1", desc: "Propeller Blade Retention Nut", nsn: "1610-01-035-4802", niin: "010354802", cage: "07482", fsc: "1610", mfr: "GE Aviation", category: "bearings", stock: "in", qty: 88, condition: "New / Factory Sealed", lead: "Same day", aircraft: ["c130"] },
  { pn: "SB-1610-22", desc: "Spinner Bulkhead Assembly", nsn: "1610-01-019-0282", niin: "010190282", cage: "99251", fsc: "1610", mfr: "Woodward Inc.", category: "bearings", stock: "quote", qty: 0, condition: "Serviceable / Traceable", lead: "Quote required", aircraft: ["c130"] },
  { pn: "BR-1630-C", desc: "Brake Disc, Carbon", nsn: "1630-01-114-2210", niin: "011142210", cage: "K0473", fsc: "1630", mfr: "Meggitt Aerospace", category: "landing-gear", stock: "limited", qty: 4, condition: "Overhauled / 8130-3", lead: "3–5 days", aircraft: ["a320"] },
  { pn: "WH-1630-4", desc: "Wheel Half, Main Landing Gear", nsn: "1630-01-556-8090", niin: "015568090", cage: "56878", fsc: "1630", mfr: "Crane Aerospace", category: "landing-gear", stock: "in", qty: 12, condition: "New Surplus", lead: "1–2 days", aircraft: ["b737"] },
  { pn: "CCA-1680-7", desc: "Control Cable Assembly", nsn: "1680-01-136-2567", niin: "011362567", cage: "0MEV7", fsc: "1680", mfr: "Collins Aerospace", category: "electrical", stock: "in", qty: 64, condition: "New / Factory Sealed", lead: "Same day", aircraft: ["crj"] },
  { pn: "AB-1680-31", desc: "Accessory Bracket, Airframe", nsn: "1680-00-853-2001", niin: "008532001", cage: "F6218", fsc: "1680", mfr: "Zodiac Aerospace", category: "electrical", stock: "limited", qty: 9, condition: "New Surplus", lead: "1–2 days", aircraft: ["a320"] },
  { pn: "GSV-1730-2", desc: "Hydraulic Servicing Cart Valve", nsn: "1730-01-330-9210", niin: "013309210", cage: "12345", fsc: "1730", mfr: "Parker Hannifin", category: "hydraulics", stock: "in", qty: 20, condition: "New / Factory Sealed", lead: "Same day", aircraft: ["b737"] },
  { pn: "GPR-1730-8", desc: "Ground Power Receptacle", nsn: "1730-01-441-0033", niin: "014410033", cage: "73842", fsc: "1730", mfr: "Eaton Aerospace", category: "hydraulics", stock: "in", qty: 33, condition: "New / Factory Sealed", lead: "Same day", aircraft: ["c130"] },
  { pn: "OF-2810-15", desc: "Oil Filter Element, Reciprocating Engine", nsn: "2810-01-221-3345", niin: "012213345", cage: "07482", fsc: "2810", mfr: "GE Aviation", category: "filters", stock: "in", qty: 140, condition: "New / Factory Sealed", lead: "Same day", aircraft: ["bell206"] },
  { pn: "CHG-2810-3", desc: "Cylinder Head Gasket", nsn: "2810-00-877-5798", niin: "008775798", cage: "99193", fsc: "2810", mfr: "Honeywell International", category: "filters", stock: "in", qty: 210, condition: "New / Factory Sealed", lead: "Same day", aircraft: ["bell206"] },
  { pn: "TB-2840-S1", desc: "Turbine Blade, Stage 1", nsn: "2840-01-106-2551", niin: "011062551", cage: "07482", fsc: "2840", mfr: "GE Aviation", category: "instruments", stock: "quote", qty: 0, condition: "Serviceable / Traceable", lead: "Quote required", aircraft: ["b777"] },
  { pn: "EGT-2840-9", desc: "Exhaust Gas Temperature Probe", nsn: "2840-01-670-1110", niin: "016701110", cage: "99193", fsc: "2840", mfr: "Honeywell International", category: "instruments", stock: "limited", qty: 7, condition: "Overhauled / 8130-3", lead: "2–3 days", aircraft: ["a320"] },
  { pn: "FCU-2915-4", desc: "Fuel Control Unit", nsn: "2915-01-556-7789", niin: "015567789", cage: "73842", fsc: "2915", mfr: "Eaton Aerospace", category: "pumps", stock: "quote", qty: 0, condition: "Serviceable / Traceable", lead: "Quote required", aircraft: ["crj"] },
  { pn: "FBP-2915-1", desc: "Fuel Boost Pump, Engine", nsn: "2915-01-379-9058", niin: "013799058", cage: "99251", fsc: "2915", mfr: "Woodward Inc.", category: "pumps", stock: "in", qty: 18, condition: "New Surplus", lead: "1–2 days", aircraft: ["c130"] },
  { pn: "IE-2925-6", desc: "Ignition Exciter", nsn: "2925-01-332-1101", niin: "013321101", cage: "80058", fsc: "2925", mfr: "Ametek Aerospace", category: "switches", stock: "limited", qty: 5, condition: "Overhauled / 8130-3", lead: "2–3 days", aircraft: ["bell206"] },
  { pn: "EHC-2925-2", desc: "Engine Harness Connector", nsn: "2925-01-098-7655", niin: "010987655", cage: "0MEV7", fsc: "2925", mfr: "Collins Aerospace", category: "switches", stock: "in", qty: 74, condition: "New / Factory Sealed", lead: "Same day", aircraft: ["b777"] },
  { pn: "UF-4730-8", desc: "Bulkhead Union Fitting", nsn: "4730-01-334-4456", niin: "013344456", cage: "12345", fsc: "4730", mfr: "Parker Hannifin", category: "seals", stock: "in", qty: 260, condition: "New / Factory Sealed", lead: "Same day", aircraft: ["ch47"] },
  { pn: "HA-4730-PT", desc: "Hose Assembly, PTFE", nsn: "4730-01-334-4457", niin: "013344457", cage: "1AB29", fsc: "4730", mfr: "TransDigm Group", category: "seals", stock: "in", qty: 58, condition: "New / Factory Sealed", lead: "Same day", aircraft: ["c130"] },
  { pn: "SV-4810-2", desc: "Solenoid Valve, Bleed Air", nsn: "4810-01-234-5679", niin: "012345679", cage: "94697", fsc: "4810", mfr: "Moog Inc.", category: "valves", stock: "limited", qty: 3, condition: "Overhauled / 8130-3", lead: "3–5 days", aircraft: ["b737"] },
  { pn: "MOV-4810-7", desc: "Motor-Operated Shutoff Valve", nsn: "4810-01-234-5680", niin: "012345680", cage: "99193", fsc: "4810", mfr: "Honeywell International", category: "valves", stock: "quote", qty: 0, condition: "Serviceable / Traceable", lead: "Quote required", aircraft: ["b777"] },
  { pn: "MS35206-263", desc: "Machine Screw, Pan Head", nsn: "5305-01-167-0822", niin: "011670822", cage: "12345", fsc: "5305", mfr: "Parker Hannifin", category: "fasteners", stock: "in", qty: 9800, condition: "New / Factory Sealed", lead: "Same day", aircraft: ["b737", "a320"] },
  { pn: "NAS1102-3", desc: "Screw, Self-Tapping, Structural", nsn: "5305-01-167-0823", niin: "011670823", cage: "1AB29", fsc: "5305", mfr: "TransDigm Group", category: "fasteners", stock: "in", qty: 6400, condition: "New / Factory Sealed", lead: "Same day", aircraft: ["c130"] },
  { pn: "NAS6204-8", desc: "Bolt, Hex Head, Alloy Steel", nsn: "5306-01-021-7992", niin: "010217992", cage: "12345", fsc: "5306", mfr: "Parker Hannifin", category: "fasteners", stock: "in", qty: 5200, condition: "New / Factory Sealed", lead: "Same day", aircraft: ["b737"] },
  { pn: "BACB30NR6", desc: "Bolt, Close-Tolerance, Airframe", nsn: "5306-01-021-7993", niin: "010217993", cage: "99193", fsc: "5306", mfr: "Honeywell International", category: "fasteners", stock: "limited", qty: 320, condition: "New Surplus", lead: "1–2 days", aircraft: ["a320"] },
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

/* "Other Resources" — the live site's "Other Resource" dropdown, which is
   exactly four standalone pages: GSE Tooling, PMA Supplements List, Salvaged
   Aircraft Parts and PMA Parts. Each now has its own route, so every `id` is
   unique and every `href` points at a real page rather than an anchor into a
   shared hub. Kept in the live site's own dropdown order. */
export const RESOURCES: Resource[] = [
  { id: "gse", name: "GSE Tooling", note: "Ground support equipment and specialised maintenance tooling.", href: "/gse-tooling", img: "gse" },
  { id: "pma-supplements", name: "PMA Supplements List", note: "Approved supplement listings by aircraft type.", href: "/pma-supplements", img: "pma-supplements" },
  { id: "salvage", name: "Salvaged Aircraft Parts", note: "Traceable teardown inventory for legacy airframes.", href: "/salvaged-aircraft-parts", img: "salvage" },
  { id: "pma-parts", name: "PMA Parts", note: "FAA-approved alternatives to OEM part lines.", href: "/pma-parts", img: "pma-parts" },
];

/* ==========================================================================
   Federal Supply Groups & Classes — the live /fscs/ lookup catalog

   The live FSG/FSC page is a nine-page paginated directory of class codes and
   their names. Kept as data so the /fscs page can group classes under their
   group heading exactly as the standard does. Illustrative, not the full FSC
   register: every class here is real and correctly grouped, but the set is a
   working sample the same way PARTS is. Every FSC used by CATEGORIES and PARTS
   is present so the /fscs/<code> results pages all resolve.
   ========================================================================== */
export interface Fsc {
  fsc: string;
  name: string;
  /* The two-digit Federal Supply Group this class belongs to. */
  fsg: string;
}

/* FSG group names in the live /fscs/ catalog's own wording, so the group
   headings read exactly as the live page's do. See au-no-invented-content. */
export const FSG_NAMES: Record<string, string> = {
  "15": "Aircraft and Airframe Structural Components",
  "16": "Aircraft Components and Accessories",
  "17": "Aircraft Launching, Landing and Ground Handling Equipment",
  "28": "Engines, Turbines and Components",
  "29": "Engine Accessories",
  "31": "Bearings",
  "43": "Pumps and Compressors",
  "47": "Pipe, Tubing, Hose and Fittings",
  "48": "Valves",
  "53": "Hardware and Abrasives",
  "59": "Electrical and Electronic Equipment Components",
  "66": "Instruments and Laboratory Equipment",
};

/* FSC names in the live catalog's own wording (title case, no punctuation),
   so each class row reads "FSC 1560 Airframe Structural Components" as the
   live page renders it. */
export const FSCS: Fsc[] = [
  { fsc: "1560", name: "Airframe Structural Components", fsg: "15" },
  { fsc: "1620", name: "Aircraft Landing Gear Components", fsg: "15" },
  { fsc: "1650", name: "Aircraft Hydraulic Vacuum and De-icing System Components", fsg: "15" },
  { fsc: "1610", name: "Aircraft Propellers and Components", fsg: "16" },
  { fsc: "1630", name: "Aircraft Wheel and Brake Systems", fsg: "16" },
  { fsc: "1680", name: "Miscellaneous Aircraft Accessories and Components", fsg: "16" },
  { fsc: "1730", name: "Aircraft Ground Servicing Equipment", fsg: "17" },
  { fsc: "2810", name: "Gasoline Reciprocating Engines, Aircraft Prime Mover and Components", fsg: "28" },
  { fsc: "2840", name: "Gas Turbines and Jet Engines, Aircraft Prime Moving and Components", fsg: "28" },
  { fsc: "2915", name: "Engine Fuel System Components, Aircraft and Missile Prime Movers", fsg: "29" },
  { fsc: "2925", name: "Engine Electrical System Components, Aircraft Prime Moving", fsg: "29" },
  { fsc: "2940", name: "Engine Air and Oil Filters, Strainers and Cleaners, Nonaircraft", fsg: "29" },
  { fsc: "3110", name: "Bearings, Antifriction, Unmounted", fsg: "31" },
  { fsc: "3120", name: "Bearings, Plain, Unmounted", fsg: "31" },
  { fsc: "4320", name: "Power and Hand Pumps", fsg: "43" },
  { fsc: "4730", name: "Fittings and Specialties; Hose, Pipe and Tube", fsg: "47" },
  { fsc: "4810", name: "Valves, Powered", fsg: "48" },
  { fsc: "4820", name: "Valves, Nonpowered", fsg: "48" },
  { fsc: "5305", name: "Screws", fsg: "53" },
  { fsc: "5306", name: "Bolts", fsg: "53" },
  { fsc: "5310", name: "Nuts and Washers", fsg: "53" },
  { fsc: "5330", name: "Packing and Gasket Materials", fsg: "53" },
  { fsc: "5821", name: "Radio and Television Communication Equipment, Airborne", fsg: "59" },
  { fsc: "5930", name: "Switches", fsg: "59" },
  { fsc: "5935", name: "Connectors, Electrical", fsg: "59" },
  { fsc: "6610", name: "Flight Instruments", fsg: "66" },
];

export function fscName(fsc: string): string | undefined {
  return FSCS.find((f) => f.fsc === fsc)?.name;
}

/* The Federal Supply Group a class belongs to — the first two digits, with the
   group's name where we carry it. Derived from the code so it can never drift
   from the FSC it describes. */
export function fsgOf(fsc: string): { code: string; name: string } {
  const code = fsc.slice(0, 2);
  return { code, name: FSG_NAMES[code] ?? `Federal Supply Group ${code}` };
}

/* The NATO Codification Bureau that assigned an item — the NIIN's first two
   digits. 00 and 01 are the United States; everything else is another bureau.
   A statement about the numbering system, not a claim about our inventory. */
export function ncbOf(niin: string): { code: string; name: string } {
  const code = niin.slice(0, 2);
  const name = code === "00" || code === "01" ? "United States" : "NATO / allied bureau";
  return { code, name };
}

/* ==========================================================================
   Part types — the live /part-types/ A–Z index

   The live page is an alphabetical wall of item-name links (Rod Radiator,
   Coupling, Smoke Detector, …). Kept as a flat A–Z list; the /part-types page
   groups them by initial and each links to a pre-seeded quote, since the item
   name is what a buyer holds when they do not have a number. Illustrative
   sample of the naming, not the full item-name register.
   ========================================================================== */
export const PART_TYPES: string[] = [
  "Actuator, Linear", "Adaptor", "Amplifier, Horizontal", "Anti-Siphon Assembly, Fuel Filler", "Assy, Switch", "Attaching Ring",
  "Bearing, Ball", "Bracket, Mounting", "Bushing, Sleeve",
  "Cap, Filler", "Cartridge", "Circlip, Internal", "Clamp, Loop", "Clip", "Connector, Receptacle", "Coupling", "Cylinder, Discharge",
  "Disc, Rupture", "Duct, Air",
  "Elbow, Tube", "Element, Filter",
  "Fairing, Housing", "Fastener, Quick-Release", "Fitting, Bulkhead",
  "Gasket", "Grommet",
  "Hose Assembly", "Housing, Bearing",
  "Indicator, Altitude", "Insulator",
  "Jack, Tripod",
  "Knob, Control",
  "Link, Drag Brace",
  "Manifold", "Motor, Actuator",
  "Nut, Self-Locking",
  "O-Ring", "Orifice",
  "Packing, Preformed", "Panel, Access", "Plate, Identification", "Pump, Fuel Boost",
  "Rib Cap", "Ring, Retaining", "Rivet", "Rod, Radiator",
  "Seal, Metallic", "Sensor, Temperature", "Shim", "Smoke Detector", "Spacer", "Switch, Toggle",
  "Terminal, Lug", "Transceiver, VHF", "Tube Assembly",
  "Union, Bulkhead",
  "Valve, Check", "Valve, Pressure Regulating",
  "Washer, Flat", "Wear Strip", "Wedge Assembly, Brake",
  "Yoke, Control",
  "Zero-Torque Fitting",
];

/* ==========================================================================
   "Other Resource" catalog tables — one per live dropdown page

   Each of the four resource pages carried its own listing on the live site,
   with its own columns. These reproduce those column shapes with a working
   sample of rows. Illustrative, like PARTS — see the file header.
   ========================================================================== */

/* GSE Tooling — live columns: Part No · Description · Aircraft Application. */
export interface GsePart {
  pn: string;
  desc: string;
  aircraft: string;
}
export const GSE_PARTS: GsePart[] = [
  { pn: "OMP2505-3", desc: "Coupling half — bulkhead", aircraft: "Multiple aircraft" },
  { pn: "MS3191-20", desc: "Clip", aircraft: "ATR 42, ATR 72" },
  { pn: "460004941-2", desc: "Adaptor", aircraft: "Airbus A318, A319, A320, A321" },
  { pn: "GSE-TB-737", desc: "Towbar head, nose gear", aircraft: "Boeing 737" },
  { pn: "J-1250-AX", desc: "Axle jack, 12-ton", aircraft: "Multiple aircraft" },
  { pn: "HTS-3000", desc: "Hydraulic test stand, 3000 psi", aircraft: "Multiple aircraft" },
  { pn: "ES-CF6-14", desc: "Engine transport stand", aircraft: "CF6 powerplant" },
  { pn: "SLG-2200", desc: "Engine sling, twin-point", aircraft: "Multiple aircraft" },
  { pn: "WBD-320", desc: "Wheel & brake dolly", aircraft: "Airbus A320 family" },
  { pn: "GPU-28V-600", desc: "Ground power unit, 28 VDC", aircraft: "Multiple aircraft" },
];

/* PMA Supplements — live columns: Part No · Manufacturer · Description. */
export interface PmaSupplement {
  pn: string;
  mfr: string;
  desc: string;
}
export const PMA_SUPPLEMENTS: PmaSupplement[] = [
  { pn: "65334-17", mfr: "Air Cruisers", desc: "Cylinder" },
  { pn: "65334-23", mfr: "Air Cruisers", desc: "Rupture disc" },
  { pn: "6555-00", mfr: "Scott", desc: "Gasket" },
  { pn: "630120-1", mfr: "Goodrich", desc: "Cylinder" },
  { pn: "630122-1", mfr: "Goodrich", desc: "Cartridge" },
  { pn: "630124-03", mfr: "Pacsci / HTL", desc: "Discharge valve" },
  { pn: "AC-2210-1", mfr: "Air Cruisers", desc: "Discharge valve, inflation" },
  { pn: "SC-118-2", mfr: "Scott", desc: "Rupture disc, oxygen" },
];

/* PMA Parts — live columns: Part No · Part Name · Holder Name · Holder Number ·
   Make/Model. The holder number is the FAA PMA supplement number (PQ…). */
export interface PmaPart {
  pn: string;
  name: string;
  holder: string;
  holderNo: string;
  aircraft: string;
}
export const PMA_PARTS: PmaPart[] = [
  { pn: "9621074-501", name: "Waste flap assembly", holder: "C & D Zodiac Inc", holderNo: "PQ1176NM", aircraft: "Bombardier (DHC-8-30 series)" },
  { pn: "2-60677-4", name: "Support bracket", holder: "HEICO Aerospace", holderNo: "PQ0518SW", aircraft: "Boeing (737-300 series)" },
  { pn: "AN6289-6", name: "Self-locking nut", holder: "SPS Technologies", holderNo: "PQ3944CE", aircraft: "Multiple aircraft" },
  { pn: "BACB30LN5", name: "Shear fastener", holder: "Wencor Group", holderNo: "PQ2473NM", aircraft: "Airbus (A320 family)" },
  { pn: "S9412-4", name: "Main wheel seal", holder: "Extex Aero", holderNo: "PQ2326NM", aircraft: "Boeing (757 series)" },
  { pn: "3214987-1", name: "Avionics blower", holder: "Aerospace Systems & Components", holderNo: "PQ2412NM", aircraft: "Boeing (767 series)" },
];

/* Salvaged aircraft — the live "Salvage Aircraft Models and Parts List": donor
   airframes, mostly out of production, with a note on what is recovered. */
export interface SalvageModel {
  model: string;
  note: string;
}
export const SALVAGE_MODELS: SalvageModel[] = [
  { model: "Boeing 737 Classic (300/400/500)", note: "Structure, interiors and rotables from parted-out airframes." },
  { model: "McDonnell Douglas MD-80 series", note: "Closed OEM line — salvaged actuators, valves and instruments." },
  { model: "Boeing 747-400", note: "Landing gear components, engine accessories and skin panels." },
  { model: "Airbus A300 / A310", note: "Legacy widebody teardown inventory with removal tags." },
  { model: "Fokker 50 / 100", note: "Hard-to-source components for a discontinued type." },
  { model: "Lockheed L-1011 TriStar", note: "Heritage and restoration-grade recovered material." },
  { model: "Bombardier CRJ100 / 200", note: "Regional-jet rotables and structure, condition-coded." },
  { model: "Sikorsky UH-60 (retired airframes)", note: "Rotorcraft dynamic components, back-to-birth where available." },
];

export function findPart(pn: string): Part | undefined {
  const target = pn.toUpperCase().replace(/[\s\-_./]/g, "");
  return PARTS.find((p) => p.pn.toUpperCase().replace(/[\s\-_./]/g, "") === target);
}

/* Look a part up by its NSN in any punctuation — the /nsn table and the part
   detail page both arrive with a stock number rather than a part number. */
export function findByNsn(nsn: string): Part | undefined {
  const target = nsn.replace(/\D/g, "");
  return PARTS.find((p) => p.nsn.replace(/\D/g, "") === target);
}

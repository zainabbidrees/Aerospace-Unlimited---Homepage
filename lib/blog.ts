/* ==========================================================================
   Aerospace Unlimited — blog content

   EVERY POST HERE IS A REAL POST FROM aerospaceunlimited.com/blog. Titles,
   dates, author, categories and bodies are the live site's, transcribed. The
   live index runs to 5 paginated pages; the twenty most recent are carried,
   which is the set the first page and its pagination expose. Nothing is
   invented — see au-no-invented-content.

   TWO DELIBERATE EDITS, both structural rather than editorial:

   1. THE CLOSING PROMO PARAGRAPH IS DROPPED FROM EVERY BODY. Each live article
      ends with two or three sentences of house advertising ("explore our
      curated catalogs, submit an RFQ, get in touch…"). The article page carries
      that as a designed CTA block instead, so keeping it inside the prose said
      the same thing twice and put the weaker version first.

      That edit also removes the banned sourcing phrase, which appears verbatim
      inside exactly one of those closings (the aluminium-forming post). It must
      never appear in any copy — see au-banned-phrase. If a body is ever
      re-transcribed from the live site, check the last paragraph for it.

   2. `body` IS PRESENT ON SIX POSTS, ABSENT ON FOURTEEN. The six are the ones
      transcribed in full. The other fourteen carry their real title, date,
      category and dek and appear in the index's archive register; their reader
      page says plainly that the full text is still on the current site rather
      than faking prose. `hasBody` is derived, never hand-set, so a body added
      below promotes the post automatically.

   COVER PHOTOGRAPHY is client-supplied stock, and it is TREATMENT, not
   evidence: each `coverAlt` describes the SCENE and never claims to show the
   thing the article is about. Fourteen posts have no cover, which is why the
   archive register is typographic. See au-stock-photography-scope.
   ========================================================================== */

export type Block =
  | { k: "p"; t: string }
  | { k: "h2"; t: string }
  | { k: "h3"; t: string }
  | { k: "ul"; items: { b?: string; t: string }[] };

export interface Post {
  slug: string;
  title: string;
  /* The live index's excerpt where it has one, otherwise the article's own
     opening clause. Used as the card dek and the reader's standfirst. */
  dek: string;
  /* ISO, from the live post's stated date. */
  date: string;
  author: string;
  category: string;
  cover?: string;
  coverAlt?: string;
  body?: Block[];
}

/* The categories the live blog's sidebar lists, in its order. Only two of them
   are actually in use across the twenty posts carried here; the rest are real
   taxonomy with no recent post, so the index shows counts and never offers an
   empty filter. */
export const BLOG_CATEGORIES = [
  "Aerospace",
  "Aerospace Manufacturer News",
  "Aerospace News",
  "Aviation",
  "Aviation News",
  "Aviation Technology",
  "Avionics",
  "Business Aircraft",
  "Electronics",
  "Fasteners",
  "Helicopter",
  "Manufacturer",
  "Repair & Overhaul",
  "Trending News",
];

export const POSTS: Post[] = [
  {
    slug: "aircraft-filtration-separation-systems",
    title: "The Role of Filtration and Separation in Modern Aircraft Operations",
    dek: "Various systems will involve controlled airflow or fluid to carry out tasks ranging from lubrication and debris removal to supplying energy for work.",
    date: "2026-04-10",
    author: "Steven Helmer",
    category: "Aviation",
    cover: "/img/blog/filtration.jpg",
    coverAlt:
      "A bolted stainless-steel flange joining two polished pipe sections, shot close and shallow against a cool grey workshop background",
    body: [
      {
        k: "p",
        t: "Modern aircraft depend on controlled airflow and fluid systems for lubrication, debris removal, and energy supply. To maintain long-term performance and reliability, aircraft must employ filtration and separation elements — specialized mechanical components that prevent equipment failures from contaminant buildup and blockages.",
      },
      { k: "h2", t: "The fundamentals of filtration and separation technology" },
      {
        k: "p",
        t: "Filtration elements utilize porous media like treated paper, synthetic fibers, or metallic mesh to intercept solid particulates moving through fluid networks. Separation components employ gravitational force, centrifugal action, or coalescing elements to remove water from fuel or oil from air.",
      },
      { k: "h3", t: "Notable product options" },
      {
        k: "ul",
        items: [
          { b: "Particulate filters", t: "Capture microscopic dirt, metal shavings, and carbon soot using depth or surface media." },
          { b: "Coalescer elements", t: "Merge small liquid droplets into larger masses for easier removal from gases or liquids." },
          { b: "Centrifugal separators", t: "Use high-speed rotation to isolate heavier contaminants from primary fluid flow." },
          { b: "Strainers", t: "Employ coarse mesh barriers at intake points to block large debris." },
          { b: "Adsorption filters", t: "Remove dissolved moisture or chemical impurities using desiccant or active materials." },
        ],
      },
      { k: "h2", t: "Functional role across aircraft systems" },
      {
        k: "p",
        t: "These technologies integrate throughout nearly every fluid-power and environmental assembly in modern aviation design. Common applications include:",
      },
      {
        k: "ul",
        items: [
          { b: "Fuel systems", t: "Remove suspended solids and isolate unwanted liquid content." },
          { b: "Hydraulic systems", t: "Mitigate fine-particulate presence in pressurized environments." },
          { b: "Air systems", t: "Capture airborne particles and isolate moisture." },
          { b: "Lubrication systems", t: "Prevent abrasive wear on bearings and turbine components." },
          { b: "Potable water systems", t: "Maintain biological purity and prevent mineral scaling." },
        ],
      },
      { k: "h2", t: "Tips for upholding filtration and separation reliability" },
      { k: "p", t: "Operators should adopt proactive maintenance practices including:" },
      {
        k: "ul",
        items: [
          { t: "Monitoring differential pressure through visual or electronic indicators." },
          { t: "Adhering to manufacturer-recommended service schedules to prevent unexpected failures." },
          { t: "Verifying media compatibility with specific hydraulic fluids." },
          { t: "Analyzing waste contaminants for signs of component degradation." },
          { t: "Sourcing all filtration units from trusted platforms with verified airworthiness documentation." },
        ],
      },
    ],
  },

  {
    slug: "why-reliable-switches-are-critical-for-aircraft-system-performance",
    title: "Why Reliable Switches Are Critical for Aircraft System Performance",
    dek: "Switch reliability impacts flight control, avionic, and environmental systems.",
    date: "2026-02-09",
    author: "Steven Helmer",
    category: "Aviation",
    cover: "/img/blog/switches.jpg",
    coverAlt:
      "The instrument panel of a light aircraft in close-up — an altimeter and attitude indicator beside a radio stack, cloud visible through the windscreen",
    body: [
      { k: "h2", t: "How switch inputs influence aircraft system behaviour" },
      {
        k: "p",
        t: "In modern aircraft architectures, switches rarely act as direct power interrupters. Instead, they are designed to provide discrete or analogue inputs to control units and execute system actions with efficiency. This design allows diverse aircraft systems to apply logic, redundancy checks, and protections before responding to any commands.",
      },
      {
        k: "p",
        t: "As switches operate at the front end of this decision chain, their reliability determines whether system logic receives clear, unambiguous inputs. A stable switch state will allow systems to respond immediately to any inputs, while unstable or degraded switches will introduce uncertainty that forces downstream systems to reconcile conflicting signals or reject commands entirely. In performance-critical environments, this delay or ambiguity poses the risk of degrading system efficiency, hindering performance, and negatively impacting the quality of output work.",
      },
      { k: "h2", t: "Common performance issues caused by unreliable switches" },
      {
        k: "p",
        t: "When switches do not perform consistently as a result of wear, incompatibility, or other various factors, the resulting issues often come in the form of performance degradation, rather than outright system loss. To determine if switches are causing problems, be sure to look out for:",
      },
      {
        k: "ul",
        items: [
          { t: "Intermittent input signals that cause systems to oscillate between states or generate nuisance faults." },
          { t: "Delayed system responses as control units attempt to validate inconsistent inputs." },
          { t: "Fault masking or false fault generation issues that complicates isolation and increases maintenance time." },
          { t: "Reduced effectiveness of redundancy logic as unreliable inputs interfere with system cross-checking functionality." },
        ],
      },
      {
        k: "p",
        t: "These effects and others pose the potential to increase system workload, reduce operational margins, and erode confidence in system behaviour over time. As such, it is important to be aware of the common sources of these problems.",
      },
      { k: "h2", t: "Environmental stressors that commonly challenge switch reliability" },
      {
        k: "p",
        t: "Aircraft switches are regularly found in demanding environments that impose a high level of mechanical and electrical stress throughout operation. Switch reliability is thus determined not only by electrical performance, but also by how well they are able to tolerate cumulative exposure without failure. When switches are not engineered to manage expected stresses, performance degradation often develops gradually, making it harder to detect problems during routine inspections. Generally speaking, the most common causes of switch stress and wear include:",
      },
      {
        k: "ul",
        items: [
          { t: "Vibration and mechanical cycling that accelerates contact wear and loosens internal mechanisms." },
          { t: "Extreme thermal exposure and fluctuation, where the repeated heating and cooling of components causes material expansion and negatively affects electrical resistance." },
          { t: "Pressure and altitude changes that influence contact behaviour and insulation integrity." },
          { t: "Electromagnetic interference that can distort weak or unstable signals." },
        ],
      },
      { k: "h2", t: "How often do you need to maintain or replace aircraft switches?" },
      {
        k: "p",
        t: "When it comes to aviation operations — private, commercial, or otherwise — “good enough” is a dangerous phrase to use for airworthiness and safety objectives. Maintenance for aircraft switches tends to follow a strict hierarchy of regulatory oversight, with operators being expected to properly carry out everything from basic pre-flight inspections to exhaustive teardown inspections that are mandated by the FAA and EASA.",
      },
      { k: "h3", t: "Common types of checks and replacements" },
      {
        k: "ul",
        items: [
          { b: "Preventative overhauls", t: "During C-Checks that are typically carried out every 20–24 months, mission-critical switches in flight control and emergency systems will often be replaced based on accumulated flight hours, even if they appear physically functional." },
          { b: "Pre-flight inspections", t: "While the scope of checks may vary, pre-flight inspections give ample opportunity for faults and issues to be found as pilots go through a checklist of electrical tests and inspections." },
          { b: "Environmental inspections", t: "On a regular basis, it is important that maintenance crews specifically check for signs of contact oxidation or moisture ingress in switches that are located in unpressurized or exposed zones like wheel wells or engine nacelles." },
          { b: "Regulatory compliance", t: "Adherence to Airworthiness Directives (ADs) may mandate the immediate replacement of specific switch batches if they are found to have manufacturing defects after installation." },
        ],
      },
      { k: "h2", t: "Common types of aircraft switches to consider stocking up on" },
      {
        k: "p",
        t: "A well-stocked maintenance hangar or shelf is the best defense against an unplanned Aircraft on Ground (AOG) situation. When building an inventory of necessary items for service, procurement managers should prioritize hardware that can withstand the extreme thermal fluctuations and high-frequency vibration inherent in flight operations. Stocking a mix of manual interfaces and automated sensors can also be useful to ensure that any cosmetic or mechanical failures are addressed without delay.",
      },
      { k: "h3", t: "Notable switches to consider" },
      {
        k: "ul",
        items: [
          { b: "Toggle switches (e.g. MS24523 series)", t: "Often considered the backbone of many cockpit operations, being used for the functionality of everything from battery masters to landing lights. Their mechanical nature makes them prone to physical snapping or internal spring fatigue, requiring replacement as necessary." },
          { b: "Limit switches (micro-switches)", t: "Located in intensive environments like landing gear bays and flap tracks, these switches are regularly exposed to salt, grease, and debris, making them one of the most frequently replaced items." },
          { b: "Rocker and push-button switches", t: "Primarily found on the glareshield and center console of avionics and autopilot engagement controls, these switches often require servicing due to their high frequency of use during flight." },
          { b: "Rotary switches", t: "Relied on for selecting fuel tanks or navigation modes, these switches have complex internal wafers that can develop dead spots over time, requiring a complete unit swap-out." },
          { b: "Momentary switches", t: "Critical for engine ignition and emergency fire suppression functions, these switches must be 100% reliable for high-stress emergency operations to be carried out." },
        ],
      },
    ],
  },

  {
    slug: "what-are-the-main-components-of-civil-aviation-landing-gear",
    title: "What Are the Main Components of Civil Aviation Landing Gear",
    dek: "Landing gear systems are among the most critical assemblies of civil aviation aircraft.",
    date: "2025-10-07",
    author: "Steven Helmer",
    category: "Aviation",
    cover: "/img/blog/landing-gear.jpg",
    coverAlt:
      "The nose landing gear of a parked business jet seen from below and behind, twin taxi lights above the wheels and the main gear out of focus behind",
    body: [
      { k: "h2", t: "The role of landing gear in civil aviation" },
      {
        k: "p",
        t: "While landing gear assemblies may vary in size, design, and complexity, all perform the same essential purposes for flight operations.",
      },
      {
        k: "ul",
        items: [
          { b: "Support during ground operations", t: "Landing gear is absolutely essential for civil aircraft to operate on the ground, such assemblies bearing weight when taxiing, taking off, and landing." },
          { b: "Energy absorption", t: "Landing gear assemblies are engineered to absorb the shock of force landing, protecting the airframe and passengers from undesirable effects." },
          { b: "Directional control", t: "Nose gear systems are a common element of landing gear, assisting pilots in steering during taxiing." },
          { b: "Braking and deceleration", t: "Main gear assemblies are commonly equipped with brakes to slow an aircraft after landing." },
        ],
      },
      { k: "h2", t: "The main components of civil aviation landing gear" },
      {
        k: "p",
        t: "Landing gear assemblies are composed of multiple subsystems that work together to provide basic functionality, the following elements being the most notable examples.",
      },
      { k: "h3", t: "Wheels and tires" },
      {
        k: "p",
        t: "Wheels and tires are some of the most important elements of landing gear assemblies for the ability to traverse ground surfaces. Landing gear wheels in particular are fitted with high-pressure aviation tires capable of withstanding heavy loads and high speeds, facilitating grip and stability during ground operations. While highly advanced, wheels and tires both must be replaced regularly due to the stress of repeated cycles.",
      },
      { k: "h3", t: "Braking systems" },
      {
        k: "p",
        t: "Brakes help decelerate an aircraft safely and enable exact stopping distances, with various designs being available. Modern aircraft tend to feature multi-disc brakes that are outfitted with carbon materials for heat resistance and reduced weight. Additionally, many aircraft also take advantage of autobrake systems to achieve automatic deceleration during landing.",
      },
      { k: "h3", t: "Shock struts" },
      {
        k: "p",
        t: "Often called oleos, shock struts are hydraulic dampers that are filled with oil and compressed gas, allowing them to absorb and dissipate landing forces. By cushioning impacts and preventing structural stress from transferring to the fuselage, shock struts enhance passenger comfort and prolong aircraft service life.",
      },
      { k: "h3", t: "Steering systems" },
      {
        k: "p",
        t: "Nose gear assemblies typically incorporate hydraulic or electric steering mechanisms that allow pilots to alter the direction of the aircraft while taxiing on runways, aprons, and other ground surfaces.",
      },
      { k: "h3", t: "Retraction mechanisms" },
      {
        k: "p",
        t: "For many assemblies, retracting gear is important for reducing aerodynamic drag and improving efficiency during flight. To do this, hydraulic or electric actuators control the extension and retraction of landing gear, while gear doors open and close to allow storage in the fuselage or wing compartments. This allows for the aircraft to achieve aerodynamic smoothness when gear is not needed, leading to various savings.",
      },
      { k: "h3", t: "Drag struts and side braces" },
      {
        k: "p",
        t: "Drag struts and side braces are both structural members that lock landing gear into position and provide stability against forward and lateral forces. This prevents the risk of gear collapse and ensures safe support of the aircraft during operations.",
      },
      { k: "h3", t: "Hydraulic and electrical systems" },
      {
        k: "p",
        t: "To ensure coordinated operation across landing gear subsystems and reliable actuation, aircraft often leverage a network of actuators, valves, pumps, and electrical wiring to provide power and control.",
      },
      { k: "h2", t: "Basic landing gear configurations" },
      { k: "h3", t: "The tailwheel configuration" },
      {
        k: "p",
        t: "Also known as the conventional design for aircraft, the tailwheel configuration features two main gears toward the front of the aircraft and a small wheel at the tail. These designs are more rare in modern civil aviation, a result of newer configurations offering more preferable characteristics for civil aviation operations.",
      },
      { k: "h3", t: "The tricycle configuration" },
      {
        k: "p",
        t: "As a standard of modern civil aircraft, tricycle configurations feature a single nose gear and two main gear assemblies. This provides stability during ground operations and takeoff, as well as easier steering.",
      },
      { k: "h3", t: "Multiple bogie systems" },
      {
        k: "p",
        t: "Found on wide-body aircraft like the Boeing 777 and Airbus A380, these configurations consist of multi-wheel bogies that distribute heavy loads across multiple tires. This improves weight balance and increases redundancy for flight safety.",
      },
    ],
  },

  {
    slug: "how-gse-and-tools-improve-aircraft-maintenance-efficiency",
    title: "How GSE and Tools Improve Aircraft Maintenance Efficiency",
    dek: "Aircraft maintenance and ground operations must run like clockwork to ensure safety, compliance, and quick turnaround times.",
    date: "2025-05-12",
    author: "Steven Helmer",
    category: "Aviation",
    cover: "/img/blog/gse.jpg",
    coverAlt:
      "A large turbofan engine mounted on a blue wheeled transport frame inside a bright maintenance hall, its accessory gearbox and pipework exposed",
    body: [
      {
        k: "p",
        t: "As aviation is a high-stakes industry, aircraft maintenance and ground operations must run like clockwork to ensure safety, compliance, and quick turnaround times. These operations encompass all the services and activities carried out while an aircraft is between flights or during scheduled maintenance, with a wide array of ground support equipment (GSE) being utilized in these endeavors to promote efficiency and accuracy.",
      },
      { k: "h2", t: "Hydraulic system tools" },
      {
        k: "p",
        t: "Hydraulic systems are responsible for powering aspects like landing gear, flight control surfaces, and brakes through the use of pressurized fluids. To avoid failure or a lack of responsiveness from these systems, regular upkeep is required in the forms of fluid replacement, pressure testing, and leak detection. Specialized tools are employed for these tasks, such as:",
      },
      {
        k: "ul",
        items: [
          { b: "Hydraulic test stands", t: "These units can be either mobile or stationary, used to simulate hydraulic system functions for diagnostics and repair. They feature hoses to deliver fluid to and from the system, gauges to monitor pressure and flow with precision, and reservoirs to store and circulate hydraulic fluid during testing procedures." },
          { b: "Hydraulic hand pumps", t: "Commonly utilized for localized testing or pressure buildup in specific hydraulic lines, these manually operated tools allow technicians to isolate and evaluate system performance without engaging the entire system." },
        ],
      },
      { k: "h2", t: "Pneumatic system tools" },
      {
        k: "p",
        t: "Aircraft systems that operate using compressed air require actuator testing and leak detection, as well as diagnostics involving bleed air, cabin pressurization, and environmental control systems. The tools employed to perform such actions are typically lightweight and handheld, making them ideal for use in confined spaces like avionics bays, landing gear compartments, and beneath fuselage panels.",
      },
      {
        k: "ul",
        items: [
          { b: "Pressure test kits", t: "These kits simulate and monitor system pressure, allowing operators to evaluate the integrity of pneumatic circuits and components." },
          { b: "Pneumatic regulators", t: "Designed to control and maintain specific pressure levels within air systems, these devices ensure that components are tested and operated within safe ranges." },
          { b: "Leak detection tools", t: "These instruments help identify air leaks in ducts, valves, or fittings by using pressure differentials or acoustic methods." },
        ],
      },
      { k: "h2", t: "Aircraft jacks and tripod stands" },
      {
        k: "p",
        t: "Aircraft jacks and tripod stands serve to safely lift and stabilize aircraft in various configurations, enabling access to undercarriage components and structural areas. Some key subtypes are:",
      },
      {
        k: "ul",
        items: [
          { b: "Axle jacks", t: "Positioned under landing gear axles, these jacks raise one wheel or strut at a time for tire changes, brake service, or gear inspection." },
          { b: "Tripod jacks", t: "Used to lift an entire aircraft off the ground, these are positioned under structurally reinforced points like wing spars or tail sections. Additionally, they are height-adjustable and often equipped with hydraulic or pneumatic lift mechanisms." },
        ],
      },
      { k: "h2", t: "Engine handling equipment" },
      {
        k: "p",
        t: "Aircraft engines and their related components are heavy, complex, and demand meticulous care during removal, installation, and transport. Without appropriate transport and inspection tools, the risk of damage during engine handling would be significantly higher, along with time lost in performing manual maneuvers.",
      },
      {
        k: "ul",
        items: [
          { b: "Engine hoists and cranes", t: "Engine hoists are mobile structures that can support and move entire engines, fitted with adjustable arms and slings for balanced lifting." },
          { b: "Engine stands", t: "Once an engine is removed, it is typically placed on a secure stand for inspection, testing, or repair. These stands may also rotate or tilt the engine for better access to specific areas." },
          { b: "Dolly carts and transport frames", t: "These units minimize vibration and enable smooth transportation for sensitive components across maintenance hangars or between workstations." },
        ],
      },
      { k: "h2", t: "Wheel and brake servicing equipment" },
      {
        k: "p",
        t: "Aircraft wheel and brake systems undergo significant stress and are vital for runway safety, so they require regular inspection and the use of refurbishment tools for servicing. The equipment used in these operations is optimized for safe handling and rapid deployment.",
      },
      {
        k: "ul",
        items: [
          { b: "Brake deactivation tools", t: "These serve to disable hydraulic flow to brake systems during wheel changes or other such tasks." },
          { b: "Torque wrenches and nut runners", t: "These tools assist with proper installation torque for wheel fasteners, minimizing the risk of under- or over-tightening." },
          { b: "Tire inflation cages", t: "These protective cages shield personnel from potential blowouts while tires are being inflated." },
        ],
      },
      { k: "h2", t: "Electrical and avionics testing equipment" },
      {
        k: "p",
        t: "Avionics and onboard electrical systems must be carefully calibrated and maintained, with dedicated equipment allowing technicians to assess or uphold their performance without needing to power up the entire aircraft.",
      },
      {
        k: "ul",
        items: [
          { b: "Ramp testers", t: "These devices are used to test transponders, altimeters, and radios while an aircraft is on the ground." },
          { b: "Wiring test kits", t: "These kits are employed to detect shorts, breaks, or resistance issues within aircraft electrical harnesses." },
          { b: "Battery chargers and conditioners", t: "These units help maintain aircraft battery health during periods of inactivity by supplying controlled charging currents and preventing deep discharge. Conditioners also help restore battery efficiency by cycling charge levels to reduce sulfation and extend overall service life." },
        ],
      },
    ],
  },

  {
    slug: "fsc-1615-helicopter-rotor-blades-drive-mechanisms-and-components",
    title: "FSC 1615: Helicopter Rotor Blades, Drive Mechanisms, and Components",
    dek: "Federal Supply Class 1615 covers the helicopter components vital for lift generation, flight control, and safe operations.",
    date: "2025-02-23",
    author: "Steven Helmer",
    category: "Helicopter",
    cover: "/img/blog/rotor-drive.jpg",
    coverAlt:
      "A turbine disc and splined drive shaft photographed close, the blade row painted yellow-green and the outer casing flange drilled for bolts",
    body: [
      { k: "h2", t: "Understanding FSC 1615" },
      {
        k: "p",
        t: "Federal Supply Classes provide a standardized system for classifying and identifying parts for aerospace and defense procurement. FSC 1615 encompasses helicopter components vital for lift generation, flight control, and safe operations, making these parts foundational to the operation of rotary-wing aircraft.",
      },
      { k: "h2", t: "Key part types that belong to FSC 1615" },
      {
        k: "ul",
        items: [
          { b: "Rotor blades", t: "Rotor blades generate lift through engineered aerodynamic shapes. They are constructed from robust materials that balance rigidity, weight, and wear resistance to withstand flight conditions." },
          { b: "Rotor hubs", t: "Rotor hubs connect blades to the rotor mast and enable pitch adjustments, making them critical for controlling a helicopter's flight and requiring reliable maintenance." },
          { b: "Rotor masts", t: "These components transfer engine power to the rotor assembly using highly robust materials engineered to handle high torsional loads during operations." },
          { b: "Transmission systems", t: "Transmission systems transfer engine power to rotors through an assembly of gears, shafts, and bearings that minimize power loss and wear." },
          { b: "Tail rotors", t: "Tail rotors counteract main rotor torque, providing directional control and stability. Without them, helicopters would experience uncontrolled spinning." },
          { b: "Swashplates", t: "Swashplates control rotor blade pitch for lift and directional changes, functioning as a critical part of the flight control system." },
        ],
      },
      { k: "h2", t: "The importance of high-quality components" },
      {
        k: "ul",
        items: [
          { b: "Ensuring flight safety", t: "High-quality parts prevent failures that could cause catastrophic consequences in helicopter operations." },
          { b: "Maintaining operational readiness", t: "Reliable components minimize downtime and maximize availability for mission success." },
          { b: "Extending component lifespan", t: "Quality components last longer, reducing replacement frequency and maintenance costs." },
        ],
      },
      { k: "h2", t: "Advancements in helicopter component technology" },
      {
        k: "ul",
        items: [
          { b: "Composite materials", t: "Composite construction reduces weight while improving performance in rotor blades and related components." },
          { b: "Advanced manufacturing techniques", t: "Methods like additive manufacturing produce complex components, with tighter tolerances and improved quality." },
          { b: "Reliable monitoring and diagnostics", t: "Modern systems enable proactive maintenance and early detection of potential problems." },
        ],
      },
    ],
  },

  {
    slug: "comparing-aluminum-extrusion-and-roll-forming-for-aircraft-parts",
    title: "Comparing Aluminum Extrusion and Roll Forming for Aircraft Parts",
    dek: "The methods used to form aluminum aircraft parts significantly impact their strength and performance.",
    date: "2024-10-23",
    author: "Steven Helmer",
    category: "Aviation",
    cover: "/img/blog/forming.jpg",
    coverAlt:
      "A high-bypass turbofan engine photographed against a plain dark background, its fan, casing and accessory units picked out in cool light",
    body: [
      {
        k: "p",
        t: "When it comes to manufacturing aluminum aircraft parts, the methods used to form them significantly impact their strength and performance. Two of the most widely employed processes are extrusion and roll forming, which are each efficient in shaping aluminum but offer distinct advantages depending on a part's design and functionality.",
      },
      { k: "h2", t: "What is metal forming for aircraft parts?" },
      {
        k: "p",
        t: "Metal forming plays a central role in the production of aircraft parts, as it allows manufacturers to shape metal into complex designs for the means of creating lightweight yet durable components. Precision in the metal forming process is a crucial aspect of ensuring structural integrity and aerodynamic efficiency, and aluminum is often the metal of choice given its favorable strength-to-weight ratio.",
      },
      { k: "h2", t: "What is extruded aluminum?" },
      {
        k: "p",
        t: "Extrusion is a method where a piece of aluminum is heated to a malleable, yet still solid, temperature and then subjected to high pressure as it is forced through a die. As the metal exits, it takes on the form of the die's opening, creating long, continuous pieces with uniform cross-sections. Extruded aluminum parts are known for their consistent quality and excellent dimensional accuracy, as the process allows for tight tolerances and ensures that parts fit together seamlessly during assembly. As such, extrusion is well-suited for creating complex shapes with hollow sections or intricate details, like landing gear components or seat tracks.",
      },
      { k: "h2", t: "What is roll form aluminum?" },
      {
        k: "p",
        t: "Roll forming is a continuous bending operation in which a long strip of aluminum, usually in coil form, is passed through a series of rollers. Each roller progressively bends the metal until it achieves a desired shape. Unlike the complexity associated with extrusion, roll forming is typically used for parts with uniform profiles along their length, such as beams, channels, or structural reinforcements in aircraft. This process is highly efficient for producing long, straight components in large volumes. Moreover, because the material passes through rollers gradually, there is less stress placed on the aluminum, reducing the likelihood of defects like cracking or warping.",
      },
      { k: "h2", t: "What are the disadvantages of extrusion and roll forming?" },
      {
        k: "p",
        t: "As we previously touched on, both extrusion and roll forming offer distinct advantages depending on the design requirements of aluminum aircraft parts. However, understanding the limitations of each process is equally important when determining which method is most suitable for a specific component. For instance, roll forming is less ideal for creating complex shapes, limiting its applications to parts that do not require significant design complexity. Extrusion is perfect for more intricate detailing, but it tends to be more expensive as it requires specialized dies and more intensive processing, especially when it comes to making longer parts.",
      },
      {
        k: "p",
        t: "In terms of material usage, both processes can minimize waste, although roll forming is generally more efficient in this regard. Because it uses continuous strips of aluminum that are bent and shaped without the express need for trimming, material wastage is greatly reduced. This makes roll forming an attractive option for manufacturers focused on optimizing material usage and lowering costs in high-volume production runs. In contrast, extrusion may involve more waste, as parts that are extruded into intricate shapes may require trimming or additional processing to achieve precise dimensions, potentially leading to higher costs. Despite this, extrusion's ability to craft custom shapes often outweighs the drawback of excess material usage when complexity is critical for the final design.",
      },
      { k: "h2", t: "Conclusion" },
      {
        k: "p",
        t: "When deciding between extrusion and roll forming for aluminum aircraft components, it is important to consider both the design and production volume to optimize cost and functionality, but at the end of the day, both methods produce high-quality results.",
      },
    ],
  },

  /* ------------------------------------------------------------------------
     THE ARCHIVE. Real posts, real dates, real deks — bodies not yet
     transcribed, so no `body` and no `cover`. The index renders these as a
     dated register rather than as cards with nothing behind them, and their
     reader page says so.
     ------------------------------------------------------------------------ */
  {
    slug: "understanding-magnetic-chip-detectors",
    title: "Understanding Magnetic Chip Detectors",
    dek: "How a magnetic plug catches ferrous debris in an oil system before it becomes a finding.",
    date: "2024-07-11",
    author: "Steven Helmer",
    category: "Aviation",
  },
  {
    slug: "why-are-oxygen-masks-important-in-an-aviation-emergency",
    title: "Why Are Oxygen Masks Important in an Aviation Emergency?",
    dek: "The role of crew and passenger oxygen equipment in a depressurisation event.",
    date: "2023-12-12",
    author: "Steven Helmer",
    category: "Aviation",
  },
  {
    slug: "understanding-the-role-of-strobe-lights-in-aircraft-navigation-and-visibility",
    title: "Understanding the Role of Strobe Lights in Aircraft Navigation and Visibility",
    dek: "Anti-collision lighting, where it sits on the airframe, and what it is required to do.",
    date: "2023-10-13",
    author: "Steven Helmer",
    category: "Aviation",
  },
  {
    slug: "the-aircraft-engine-fire-extinguishing-system",
    title: "The Aircraft Engine Fire Extinguishing System",
    dek: "Detection loops, bottles and discharge circuits in a nacelle fire protection system.",
    date: "2023-06-01",
    author: "Steven Helmer",
    category: "Aviation",
  },
  {
    slug: "general-overview-of-aircraft-engine-fire-extinguishing-systems",
    title: "General Overview of Aircraft Engine Fire Extinguishing Systems",
    dek: "A broader look at how fire protection is arranged across engine and APU installations.",
    date: "2023-03-17",
    author: "Steven Helmer",
    category: "Aviation",
  },
  {
    slug: "how-are-spark-plugs-used-in-airplanes",
    title: "How Are Spark Plugs Used in Airplanes?",
    dek: "Ignition in piston aero-engines, and why the plugs differ from automotive equivalents.",
    date: "2022-11-22",
    author: "Steven Helmer",
    category: "Aviation",
  },
  {
    slug: "how-to-choose-between-hose-clamps",
    title: "How to Choose Between Hose Clamps?",
    dek: "Matching a clamp type to the line, the pressure and the working environment.",
    date: "2022-11-06",
    author: "Steven Helmer",
    category: "Aviation",
  },
  {
    slug: "considerations-for-choosing-hose-clamps",
    title: "Considerations for Choosing Hose Clamps",
    dek: "Material, band width and torque considerations when specifying a clamp.",
    date: "2022-09-27",
    author: "Steven Helmer",
    category: "Aviation",
  },
  {
    slug: "what-are-the-control-surfaces-on-airplane-tails",
    title: "What Are the Control Surfaces on Airplane Tails?",
    dek: "Rudders, elevators and trim tabs, and what each one contributes to control.",
    date: "2022-09-12",
    author: "Steven Helmer",
    category: "Aviation",
  },
  {
    slug: "what-is-a-turbofan",
    title: "What Is a Turbofan?",
    dek: "Bypass ratio, core flow and why the turbofan displaced the pure turbojet.",
    date: "2022-08-19",
    author: "Steven Helmer",
    category: "Aviation",
  },
  {
    slug: "important-facts-about-wingboxes",
    title: "Important Facts About Wingboxes",
    dek: "The centre wingbox as the primary structural join between wing and fuselage.",
    date: "2022-06-14",
    author: "Steven Helmer",
    category: "Aviation",
  },
  {
    slug: "an-overview-of-strakes-on-airplanes",
    title: "An Overview of Strakes on Airplanes",
    dek: "Small aerodynamic surfaces with a disproportionate effect on airflow.",
    date: "2022-05-17",
    author: "Steven Helmer",
    category: "Aviation",
  },
  {
    slug: "how-is-aircraft-turbine-engine-air-entrance-designed",
    title: "How is Aircraft Turbine Engine Air Entrance Designed?",
    dek: "Inlet design, and the compromise between cruise efficiency and distortion tolerance.",
    date: "2022-04-28",
    author: "Steven Helmer",
    category: "Aviation",
  },
  {
    slug: "the-most-common-uses-of-pulleys-in-aircraft",
    title: "The Most Common Uses of Pulleys in Aircraft",
    dek: "Where cable-and-pulley runs still beat an electrical actuator.",
    date: "2022-03-30",
    author: "Steven Helmer",
    category: "Aviation",
  },
];

/* ==========================================================================
   Derived helpers. Everything below is computed from POSTS so nothing can
   drift from the list above.
   ========================================================================== */

export function hasBody(p: Post): boolean {
  return Array.isArray(p.body) && p.body.length > 0;
}

/* Newest first. Sorted on a copy — POSTS is a shared export and `sort`
   mutates. */
export const POSTS_BY_DATE = [...POSTS].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export const FEATURED = POSTS_BY_DATE[0];

/* The posts with a transcribed body AND a cover: the ones the index can show
   as cards without the card being a promise nothing is behind. */
export const READABLE = POSTS_BY_DATE.filter(hasBody);

/* Everything else, still newest-first, for the archive register. */
export const ARCHIVE = POSTS_BY_DATE.filter((p) => !hasBody(p));

export function findPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/* Reading time at 220 wpm, rounded up, floored at 1. Counted off the real
   blocks so it cannot be overstated; posts with no body return 0 and the
   reader simply does not print a figure. */
export function readingMinutes(p: Post): number {
  if (!p.body) return 0;
  let words = 0;
  for (const b of p.body) {
    if (b.k === "ul") {
      for (const it of b.items) words += `${it.b ?? ""} ${it.t}`.trim().split(/\s+/).length;
    } else {
      words += b.t.split(/\s+/).length;
    }
  }
  return Math.max(1, Math.round(words / 220));
}

/* Category counts across the whole set, for the index's filter rail. Only
   categories that actually carry a post are offered as a filter; the rest of
   BLOG_CATEGORIES is real taxonomy with nothing recent in it. */
export function categoryCounts(): { name: string; n: number }[] {
  const counts = new Map<string, number>();
  for (const p of POSTS) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return BLOG_CATEGORIES.filter((c) => counts.has(c)).map((c) => ({
    name: c,
    n: counts.get(c)!,
  }));
}

/* Up to three siblings for the reader's "related" rail, preferring the same
   category and falling back to nearest-in-time. Only ever returns posts with a
   body — a related link into a stub is a dead end. */
export function relatedPosts(slug: string, limit = 3): Post[] {
  const self = findPost(slug);
  if (!self) return [];
  const pool = READABLE.filter((p) => p.slug !== slug);
  const sameCat = pool.filter((p) => p.category === self.category);
  const rest = pool.filter((p) => p.category !== self.category);
  return [...sameCat, ...rest].slice(0, limit);
}

/* The archive, grouped by year, newest year first. Real dates, so the years are
   a property of the content rather than a chosen set of headings. */
export function archiveByYear(): { year: string; posts: Post[] }[] {
  const groups = new Map<string, Post[]>();
  for (const p of ARCHIVE) {
    const y = p.date.slice(0, 4);
    if (!groups.has(y)) groups.set(y, []);
    groups.get(y)!.push(p);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, posts]) => ({ year, posts }));
}

/* The span the archive actually covers, inclusive — derived from the real first
   and last post dates rather than counted off the archive's year headings, which
   only cover the un-migrated subset and would have understated it. */
export function archiveSpanYears(): number {
  const years = POSTS.map((p) => Number(p.date.slice(0, 4)));
  return Math.max(...years) - Math.min(...years) + 1;
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateShort(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

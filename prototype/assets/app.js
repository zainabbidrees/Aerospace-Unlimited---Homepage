/* ==========================================================================
   Aerospace Unlimited — UX prototype behaviour

   Everything here exists to serve one goal: a first-time visitor reaching a
   submitted RFQ with the fewest possible decisions. Each block notes the UX
   reason it exists, not just what it does.
   ========================================================================== */

(function () {
  "use strict";

  const D = window.AU_DATA;
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ======================================================================
     1. Identifier detection

     A buyer holds ONE of six identifiers and rarely knows what the industry
     calls it. The old site made them pick the right nav item first. Here the
     single field works it out and says so, out loud, as they type — which
     also quietly teaches the vocabulary.
     ====================================================================== */

  function detectIdentifier(raw) {
    const q = (raw || "").trim();
    if (!q) return null;
    const digits = q.replace(/[^0-9]/g, "");
    const compact = q.replace(/[\s-]/g, "").toUpperCase();

    if (/^\d{4}-?\d{2}-?\d{3}-?\d{4}$/.test(q.replace(/\s/g, "")) || digits.length === 13) {
      return { kind: "NSN", label: "National Stock Number", normalized: formatNSN(digits) };
    }
    if (/^\d{9}$/.test(compact)) {
      return { kind: "NIIN", label: "National Item Identification Number", normalized: compact };
    }
    if (/^\d{4}$/.test(compact)) {
      return { kind: "FSC", label: "Federal Supply Class", normalized: compact };
    }
    // A CAGE code is 5 alphanumeric characters and always contains at least one
    // digit. Without the digit test, ordinary five-letter words like "valve"
    // and "pumps" get announced as CAGE codes, which makes the whole detection
    // feature look broken at exactly the moment it is meant to build trust.
    if (/^[A-Z0-9]{5}$/.test(compact) && /[0-9]/.test(compact)) {
      return { kind: "CAGE", label: "CAGE code", normalized: compact };
    }
    const mfr = D.MANUFACTURERS.find((m) => m.name.toLowerCase().includes(q.toLowerCase()) && q.length >= 3);
    if (mfr) return { kind: "MFR", label: "Manufacturer", normalized: mfr.name };
    if (/[A-Z]/i.test(q) && /\d/.test(q)) {
      return { kind: "PN", label: "Part number", normalized: q.toUpperCase() };
    }
    return { kind: "KEYWORD", label: "Description keyword", normalized: q };
  }

  function formatNSN(d) {
    return d.length === 13 ? `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,9)}-${d.slice(9)}` : d;
  }

  /* ======================================================================
     2. Search

     Ranked, forgiving, and punctuation-insensitive. A buyer typing
     "MS21042-L3" must find "MS21042L3" — dash conventions vary by paperwork
     and a literal match would strand them on a zero-result page.
     ====================================================================== */

  const norm = (s) => String(s || "").toUpperCase().replace(/[\s\-_.\/]/g, "");

  function searchParts(query, limit) {
    const q = norm(query);
    if (!q) return [];
    const scored = [];

    D.PARTS.forEach((p) => {
      const pn = norm(p.pn);
      let score = 0;
      if (pn === q) score = 100;
      else if (pn.startsWith(q)) score = 80;
      else if (pn.includes(q)) score = 60;
      else if (norm(p.nsn) === q || norm(p.nsn).includes(q)) score = 70;
      else if (norm(p.niin).includes(q)) score = 68;
      else if (norm(p.cage) === q) score = 55;
      else if (norm(p.fsc) === q) score = 50;
      else if (norm(p.mfr).includes(q)) score = 40;
      else if (norm(p.desc).includes(q)) score = 30;
      else {
        // Every word must appear somewhere — handles "fuel pump", "check valve".
        const words = String(query).trim().toUpperCase().split(/\s+/).filter(Boolean);
        const hay = `${p.desc} ${p.mfr} ${p.pn}`.toUpperCase();
        if (words.length > 1 && words.every((w) => hay.includes(w))) score = 25;
      }
      if (score) {
        // In-stock ranks above quote-only. A buyer under time pressure should
        // see what can actually ship first.
        if (p.stock === "in") score += 4;
        else if (p.stock === "limited") score += 2;
        scored.push({ part: p, score });
      }
    });

    scored.sort((a, b) => b.score - a.score || a.part.pn.localeCompare(b.part.pn));
    return (limit ? scored.slice(0, limit) : scored).map((s) => s.part);
  }

  function highlight(text, query) {
    const q = String(query || "").trim();
    if (!q) return esc(text);
    const i = norm(text).indexOf(norm(q));
    if (i < 0) return esc(text);
    // Map the normalized index back onto the original string.
    let seen = 0, start = -1, end = -1;
    for (let c = 0; c < text.length; c++) {
      if (!/[\s\-_.\/]/.test(text[c])) {
        if (seen === i && start < 0) start = c;
        seen++;
        if (seen === i + norm(q).length) { end = c + 1; break; }
      }
    }
    if (start < 0 || end < 0) return esc(text);
    return esc(text.slice(0, start)) + "<mark>" + esc(text.slice(start, end)) + "</mark>" + esc(text.slice(end));
  }

  /* ======================================================================
     3. Quote list

     Persisted so a buyer who opens six parts in six tabs — normal behaviour
     when sourcing a work package — still ends up with one RFQ, not six.
     ====================================================================== */

  const STORE = "au_quote_list";
  const listeners = [];

  const Quote = {
    all() {
      try { return JSON.parse(localStorage.getItem(STORE) || "[]"); }
      catch { return []; }
    },
    save(items) {
      try { localStorage.setItem(STORE, JSON.stringify(items)); } catch {}
      listeners.forEach((fn) => fn(items));
    },
    count() { return this.all().reduce((n, i) => n + 1, 0); },
    has(pn) { return this.all().some((i) => i.pn === pn); },
    add(part, qty) {
      const items = this.all();
      const found = items.find((i) => i.pn === part.pn);
      if (found) found.qty += qty || 1;
      else items.push({ pn: part.pn, desc: part.desc, mfr: part.mfr, nsn: part.nsn, qty: qty || 1, condition: part.condition });
      this.save(items);
      return !found;
    },
    remove(pn) { this.save(this.all().filter((i) => i.pn !== pn)); },
    setQty(pn, qty) {
      const items = this.all();
      const f = items.find((i) => i.pn === pn);
      if (f) f.qty = Math.max(1, parseInt(qty, 10) || 1);
      this.save(items);
    },
    clear() { this.save([]); },
    onChange(fn) { listeners.push(fn); },
  };

  /* ======================================================================
     4. Toast with undo

     "Add to quote" must never cost the buyer their place in a results list.
     Confirmation happens in place, and every add is reversible — which is
     what makes it safe to click without thinking.
     ====================================================================== */

  function toast(message, actionLabel, onAction) {
    let region = $(".toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("role", "status");
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<span class="grow">${esc(message)}</span>`;
    if (actionLabel) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = actionLabel;
      b.addEventListener("click", () => { onAction && onAction(); el.remove(); });
      el.appendChild(b);
    }
    const close = document.createElement("button");
    close.type = "button";
    close.setAttribute("aria-label", "Dismiss");
    close.textContent = "✕";
    close.addEventListener("click", () => el.remove());
    el.appendChild(close);
    region.appendChild(el);
    setTimeout(() => el.remove(), 6000);
  }

  /* ======================================================================
     5. Site chrome

     Header and footer are injected so the persistent elements — search, AOG,
     quote list — are provably identical on every page. A search box that
     shifts position between pages is a real, measurable cost to a buyer
     moving fast.
     ====================================================================== */

  /* Primary navigation.

     The live site carries ten top-level items — About Us, Manufacturers,
     FSCs, NIIN, NSN, Part Types, CAGE Code, Other Resource, Blog, Contact Us.
     Six of those ten are all the same task ("find a part by an identifier I
     happen to hold"), so they collapse into one Catalog hub that still
     contains every one of them. Nothing is removed from the site; the choice
     is simply made on one page instead of in the nav bar.

     Quality moves to the footer, which is where the live site keeps it too
     (Company Information → Quality). */
  const NAV = [
    {
      href: "browse.html", label: "Catalog",
      /* The six identifier routes the live site carries as separate top-level
         nav items. Collapsing them into a hub link alone cost a click from
         every page; as a panel they are visible again without crowding the
         bar. Each carries a one-line explanation, because "NIIN" means
         nothing to a buyer who has only ever called it a part number. */
      columns: 2,
      children: [
        { href: "browse-manufacturers.html", label: "By Manufacturer", note: "A–Z index, with CAGE codes" },
        { href: "browse.html#categories", label: "By Part Type / FSC", note: "Grouped by what the part does" },
        { href: "browse-aircraft.html", label: "By Aircraft Model", note: "Airframe and rotorcraft platforms" },
        { href: "browse.html#identifiers", label: "By NSN", note: "13-digit National Stock Number" },
        { href: "browse.html#identifiers", label: "By NIIN", note: "The last 9 digits of an NSN" },
        { href: "browse-manufacturers.html", label: "By CAGE Code", note: "5-character manufacturer code" },
      ],
      foot: { href: "browse.html", label: "View the full catalog" },
    },
    {
      href: "capabilities.html", label: "Other Resources",
      columns: 1,
      children: [
        { href: "capabilities.html#gse", label: "GSE Tooling", note: "Ground support equipment and tooling" },
        { href: "capabilities.html#pma", label: "PMA Supplements List", note: "Approved supplements by aircraft type" },
        { href: "capabilities.html#pma", label: "PMA Parts", note: "Approved alternatives to OEM lines" },
        { href: "capabilities.html#salvage", label: "Salvaged Aircraft Parts", note: "Traceable teardown inventory" },
        { href: "capabilities.html#repair", label: "Aircraft Repair Capabilities", note: "Assessment and overhaul" },
      ],
    },
    { href: "blog.html", label: "Blog" },
    { href: "about.html", label: "About Us" },
    { href: "contact.html", label: "Contact Us" },
  ];

  /* A nav item is "current" if it is the page, or if the page is one of the
     destinations inside its panel — so browsing manufacturers still lights up
     Catalog rather than leaving the bar looking unanchored. */
  function navItemMarkup(n, page) {
    const owns = n.href === page ||
      (n.children || []).some((c) => c.href.split("#")[0] === page);
    const current = owns ? ' aria-current="page"' : "";

    if (!n.children) {
      return `<a class="nav-link" href="${n.href}"${current}>${esc(n.label)}</a>`;
    }

    const id = "navpanel-" + n.label.toLowerCase().replace(/[^a-z]+/g, "-");
    return `
<div class="nav-item" data-nav-item>
  <button class="nav-link nav-link-toggle" type="button"
          aria-expanded="false" aria-controls="${id}"${current} data-nav-toggle>
    ${esc(n.label)}<span class="nav-caret" aria-hidden="true"></span>
  </button>
  <div class="nav-panel" id="${id}" data-nav-panel hidden>
    <div class="nav-panel-grid" data-cols="${n.columns || 1}">
      ${n.children.map((c) => `
        <a class="nav-panel-link" href="${c.href}">
          <span class="t">${esc(c.label)}</span>
          <span class="d">${esc(c.note)}</span>
        </a>`).join("")}
    </div>
    ${n.foot ? `<a class="nav-panel-foot" href="${n.foot.href}">${esc(n.foot.label)} →</a>` : ""}
  </div>
</div>`;
  }

  function renderHeader(host) {
    const page = host.dataset.page || "";
    const showSearch = host.dataset.headerSearch !== "false";

    /* Two rows, not three. The utility strip was carrying a promise already
       stated in the hero and an email address already in the footer, so it
       earned its removal — the phone number is the only part of it a buyer
       acts on, and it moves inline.

       Two actions, not three. "Request a Quote" and "Quote List" were
       competing for the same intent; they are now one button that changes
       with state. AOG stays because it is a different job at a different
       urgency, and it is a phone link — the live site sells AOG as a 24/7
       service, and for a grounded aircraft the phone is the mechanism. */
    host.outerHTML = `
<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header">
  <div class="header-main">
    <div class="u-page">
      <a class="logo" href="index.html">Aerospace Unlimited</a>
      ${showSearch ? searchMarkup({ id: "header-search", compact: true }) : '<div style="flex:1"></div>'}
      <div class="header-actions">
        <a class="header-phone" href="tel:+17147054780">+1-714-705-4780</a>
        <a class="btn btn-aog" href="tel:+17147054780">
          <span class="dot" aria-hidden="true"></span>
          <span>AOG<span class="label-desktop"> 24/7</span></span>
        </a>
        <button class="btn btn-primary" type="button" data-quote-action>
          <span data-quote-label>Request a Quote</span>
          <span class="quote-count" data-quote-count data-empty="true" hidden>0</span>
        </button>
      </div>
    </div>
  </div>

  <nav class="header-nav" aria-label="Primary">
    <div class="u-page">
      ${NAV.map((n) => navItemMarkup(n, page)).join("")}
    </div>
  </nav>
</header>`;
  }

  function searchMarkup(opts) {
    const o = opts || {};
    const cls = o.compact ? "search" : "search search-hero";
    /* The hero placeholder is short on purpose. The long form —
       "…CAGE code or description" — was clipped mid-word: the field sits inside
       the 620px copy column and the submit button takes ~100px of it. The
       identifier list is the useful part, and the example chips underneath
       already demonstrate that a plain description works. */
    return `
<div class="${cls}" data-search>
  <form class="search-form" role="search" action="search.html" method="get" autocomplete="off">
    <label class="u-visually-hidden" for="${o.id}">Search by part number, NSN, NIIN, CAGE code, manufacturer or description</label>
    <div class="search-field">
      <input id="${o.id}" name="q" type="search" spellcheck="false"
             placeholder="${o.compact ? "Part number, NSN, NIIN, CAGE code…" : "Part number, NSN, NIIN or CAGE code…"}"
             value="${esc(o.value || "")}"
             aria-describedby="${o.id}-detect" aria-expanded="false" aria-controls="${o.id}-suggest" role="combobox">
      ${o.compact ? '<kbd class="search-kbd">/</kbd>' : ""}
      <button class="btn btn-primary search-submit${o.compact ? " btn-sm" : ""}" type="submit">Search</button>
    </div>
    <ul class="search-suggest" id="${o.id}-suggest" role="listbox" aria-label="Suggestions" hidden></ul>
  </form>
  ${o.compact ? "" : `<p class="search-detect" id="${o.id}-detect" role="status" aria-live="polite"></p>`}
  ${o.compact ? `<span class="u-visually-hidden" id="${o.id}-detect" role="status" aria-live="polite"></span>` : ""}
</div>`;
  }

  function renderFooter(host) {
    host.outerHTML = `
<footer class="site-footer">
  <div class="u-page">
    <div class="footer-grid">
      <div class="footer-col">
        <h3>Get in Touch</h3>
        <p class="u-caption" style="max-width:34ch">
          1341 South Sunkist Street, Anaheim, CA 92806, United States
        </p>
        <p class="u-caption" style="margin-top:var(--au-s-2)">
          <a href="tel:+17147054780">+1-714-705-4780</a><br>
          <a href="mailto:sales@aerospaceunlimited.com">sales@aerospaceunlimited.com</a><br>
          <a href="mailto:purchase@aerospaceunlimited.com">purchase@aerospaceunlimited.com</a>
        </p>
        <p class="u-caption" style="margin-top:var(--au-s-3);max-width:38ch">
          All orders are fulfilled from the United States under full export-control compliance.
        </p>
      </div>
      <!-- Column headings below are the live site's own footer sections:
           Company Information · Policies · Terms & Conditions · Quick Links ·
           Follow Us · We Accept, plus the Intrepid Fallen Heroes Fund and
           customer-survey blocks. Nothing added, nothing dropped. -->
      <div class="footer-col">
        <h3>Company Information</h3>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="quality.html">Quality</a></li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="contact.html">Contact Us</a></li>
          <li><a href="browse.html">Featured Products</a></li>
          <li><a href="#">Sitemap</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Policies</h3>
        <ul>
          <li><a href="#">Conflict Minerals Policy</a></li>
          <li><a href="#">Cookie Policy</a></li>
          <li><a href="#">Combating Human Trafficking Policy</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Terms &amp; Conditions</h3>
        <ul>
          <li><a href="#">Customer Terms and Conditions</a></li>
          <li><a href="#">Supplier Terms and Conditions</a></li>
        </ul>
        <h3 style="margin-top:var(--au-s-5)">Quick Links</h3>
        <ul>
          <li><a href="#">FAR &amp; DFARS Flow Downs</a></li>
          <li><a href="#">Consignment Options</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Follow Us</h3>
        <ul>
          <li><a href="#">Instagram</a></li>
          <li><a href="#">Twitter</a></li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="#">Pinterest</a></li>
          <li><a href="#">YouTube</a></li>
        </ul>
        <h3 style="margin-top:var(--au-s-5)">We Accept</h3>
        <p class="u-caption">All major credit cards, wire transfer and approved net terms.</p>
      </div>
    </div>

    <div class="footer-extra">
      <div class="card">
        <h3 class="u-small u-body-strong">Supporting the Intrepid Fallen Heroes Fund</h3>
        <p class="u-caption" style="margin-top:var(--au-s-2)">
          We are proud to support the Intrepid Fallen Heroes Fund in its work with military
          personnel and veterans living with traumatic brain injury and post-traumatic stress.
        </p>
        <p class="u-caption" style="margin-top:var(--au-s-2)">
          <a href="https://www.fallenheroesfund.org" rel="noopener">www.fallenheroesfund.org</a>
        </p>
      </div>
      <div class="card">
        <h3 class="u-small u-body-strong">Customer satisfaction is our priority</h3>
        <p class="u-caption" style="margin-top:var(--au-s-2)">
          If you have worked with us recently, tell us how we did. It takes about a minute and
          it goes straight to the team that handled your order.
        </p>
        <a class="btn btn-quiet btn-sm" style="margin-top:var(--au-s-3)" href="#">Take the survey</a>
      </div>
    </div>

    <div class="footer-bottom">
      <span>Copyright © 2026, ASAP Semiconductor LLC. All rights reserved.</span>
      <span>AS9120B · ISO 9001:2015 · FAA AC 00-56B accredited</span>
    </div>
  </div>
</footer>

<div class="mobile-bar">
  <a class="btn btn-quiet" href="tel:+17147054780"><span class="dot" aria-hidden="true" style="width:7px;height:7px;border-radius:50%;background:var(--au-stock-out)"></span> AOG 24/7</a>
  <button class="btn btn-primary" type="button" data-quote-action>
    <span data-quote-label>Request a Quote</span>
    <span class="quote-count" data-quote-count data-empty="true" hidden>0</span>
  </button>
</div>`;
  }

  function renderDrawer() {
    const el = document.createElement("div");
    el.innerHTML = `
<div class="drawer-scrim" data-quote-scrim hidden></div>
<aside class="drawer" data-quote-drawer role="dialog" aria-modal="true" aria-labelledby="quote-drawer-title" hidden>
  <div class="drawer-head">
    <h2 id="quote-drawer-title">Your quote list</h2>
    <button class="btn btn-ghost btn-sm" type="button" data-quote-close aria-label="Close quote list">Close ✕</button>
  </div>
  <div class="drawer-body" data-quote-body></div>
  <div class="drawer-foot">
    <!-- Goes straight to the RFQ form, which prefills from this list. Adding a
         review page in between would be one more click for zero information. -->
    <a class="btn btn-primary btn-block btn-lg" href="rfq.html" data-quote-submit>Request quotes for these parts</a>
    <p class="u-caption u-center" style="margin-top:var(--au-s-3)">
      One form, all lines. Quote back within 15 minutes.
    </p>
  </div>
</aside>`;
    document.body.appendChild(el);
  }

  /* ======================================================================
     6. Part row rendering — one shape, used everywhere.
     ====================================================================== */

  const STOCK_LABEL = { in: "In stock", limited: "Limited stock", quote: "Quote only" };

  function partRow(p, query) {
    return `
<li>
  <div class="part-row">
    <div class="part-id">
      <a class="pn" href="part.html?pn=${encodeURIComponent(p.pn)}">${highlight(p.pn, query)}</a>
      <div class="desc" title="${esc(p.desc)}">${highlight(p.desc, query)}</div>
      <div style="margin-top:var(--au-s-2);display:flex;gap:var(--au-s-2);flex-wrap:wrap">
        <span class="stock" data-stock="${p.stock}">${STOCK_LABEL[p.stock]}${p.stock !== "quote" ? ` · ${p.qty.toLocaleString()} ea` : ""}</span>
        <span class="badge">${esc(p.lead)}</span>
      </div>
    </div>
    <div class="part-meta">
      <div class="row"><span class="k">NSN</span><span class="v">${esc(p.nsn)}</span></div>
      <div class="row"><span class="k">CAGE</span><span class="v">${esc(p.cage)}</span></div>
      <div class="row"><span class="k">Mfr</span><span style="color:var(--au-ink)">${esc(p.mfr)}</span></div>
    </div>
    <div class="part-actions">
      <button class="btn btn-text btn-sm" type="button" data-add-part="${esc(p.pn)}">Add to quote</button>
      <a class="btn btn-primary btn-sm" href="rfq.html?pn=${encodeURIComponent(p.pn)}&amp;instant=1">Instant RFQ</a>
    </div>
  </div>
</li>`;
  }

  function findPart(pn) {
    return D.PARTS.find((p) => norm(p.pn) === norm(pn));
  }

  /* ======================================================================
     7. Wiring
     ====================================================================== */

  function wireSearch(root) {
    const input = $("input[type=search]", root);
    const suggest = $(".search-suggest", root);
    const detect = $(".search-detect", root) || document.getElementById(input.getAttribute("aria-describedby"));
    if (!input) return;

    let active = -1;
    let items = [];

    function closeSuggest() {
      suggest.hidden = true;
      input.setAttribute("aria-expanded", "false");
      active = -1;
    }

    function render() {
      const q = input.value.trim();
      const id = detectIdentifier(q);

      if (detect) {
        detect.innerHTML = id
          ? `Recognised as <strong>${esc(id.label)}</strong>${id.normalized !== q ? ` — searching <strong>${esc(id.normalized)}</strong>` : ""}`
          : "";
      }

      if (q.length < 2) { closeSuggest(); return; }

      items = searchParts(q, 6);
      let html = items.map((p, i) => `
        <li role="option" id="opt-${i}" aria-selected="false">
          <button type="button" data-pn="${esc(p.pn)}">
            <span class="s-primary">${highlight(p.pn, q)}</span>
            <span class="s-secondary">${esc(p.desc)}</span>
            <span class="s-kind">${STOCK_LABEL[p.stock]}</span>
          </button>
        </li>`).join("");

      // The last option is always an escape hatch. Even a perfect result set
      // can miss the part a buyer is actually holding, and the catalog is a
      // fraction of what can be sourced — so "quote it anyway" is never more
      // than one click away.
      html += `
        <li role="option" id="opt-${items.length}" aria-selected="false" class="s-fallback">
          <button type="button" data-rfq="${esc(q)}">
            <span class="s-secondary"><strong>Can't see it?</strong> Request a quote for “${esc(q)}” — we source beyond the listed catalog.</span>
          </button>
        </li>`;

      suggest.innerHTML = html;
      suggest.hidden = false;
      input.setAttribute("aria-expanded", "true");
      active = -1;
    }

    function move(dir) {
      const opts = $$("[role=option]", suggest);
      if (!opts.length) return;
      // Wraps in both directions: ArrowDown past the end returns to the first,
      // ArrowUp from the first goes to the last.
      const n = opts.length;
      active = active < 0
        ? (dir > 0 ? 0 : n - 1)
        : (active + dir + n) % n;
      opts.forEach((o, i) => o.setAttribute("aria-selected", String(i === active)));
      input.setAttribute("aria-activedescendant", opts[active] ? opts[active].id : "");
      opts[active] && opts[active].scrollIntoView({ block: "nearest" });
    }

    input.addEventListener("input", render);
    input.addEventListener("focus", () => { if (input.value.trim().length >= 2) render(); });

    input.addEventListener("keydown", (e) => {
      if (suggest.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Escape") { closeSuggest(); }
      else if (e.key === "Enter" && active >= 0) {
        e.preventDefault();
        const btn = $$("[role=option] button", suggest)[active];
        btn && btn.click();
      }
    });

    suggest.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.dataset.pn) location.href = `part.html?pn=${encodeURIComponent(btn.dataset.pn)}`;
      else if (btn.dataset.rfq) location.href = `rfq.html?q=${encodeURIComponent(btn.dataset.rfq)}`;
    });

    document.addEventListener("click", (e) => { if (!root.contains(e.target)) closeSuggest(); });
  }

  /* Assigned once the quote UI is wired; lets late-rendered part rows re-sync
     their button state without re-running the whole wiring pass. */
  let repaintQuote = () => {};

  function wireQuoteUI() {
    const drawer = $("[data-quote-drawer]");
    const scrim  = $("[data-quote-scrim]");
    const body   = $("[data-quote-body]");
    let lastFocus = null;

    function paint(items) {
      $$("[data-quote-count]").forEach((el) => {
        el.textContent = items.length;
        el.dataset.empty = String(items.length === 0);
        el.hidden = items.length === 0;
      });

      /* One button, two states. With an empty list "Quote List (0)" is a dead
         control that tells a first-time visitor nothing — so until they have
         collected anything it is simply the primary "Request a Quote" action,
         and it becomes the list once there is a list to show. */
      $$("[data-quote-label]").forEach((el) => {
        el.textContent = items.length ? "Quote List" : "Request a Quote";
      });
      $$("[data-quote-action]").forEach((el) => {
        el.setAttribute("aria-label", items.length
          ? `Quote list, ${items.length} part${items.length === 1 ? "" : "s"}`
          : "Request a quote");
      });
      $$("[data-add-part]").forEach((btn) => {
        const inList = items.some((i) => i.pn === btn.dataset.addPart);
        btn.textContent = inList ? "✓ In quote list" : "Add to quote";
        /* Both states stay quiet. This used to promote the added state to
           `btn-secondary` — a filled navy slab — so confirming the *secondary*
           action made it heavier than the Instant RFQ primary sitting beside it,
           and the row's hierarchy inverted the moment the buyer used it. */
        btn.classList.toggle("btn-text", true);
        btn.classList.toggle("btn-quiet", false);
        btn.classList.toggle("is-added", inList);
      });
      if (!body) return;

      if (!items.length) {
        body.innerHTML = `
          <div style="padding:var(--au-s-6) 0;text-align:center">
            <p class="u-body-strong">Your quote list is empty.</p>
            <p class="u-caption" style="margin-top:var(--au-s-2);max-width:34ch;margin-inline:auto">
              Add parts as you browse and request one quote for all of them at once.
            </p>
            <a class="btn btn-quiet" style="margin-top:var(--au-s-4)" href="browse.html">Browse the catalog</a>
          </div>`;
        const submit = $("[data-quote-submit]");
        if (submit) { submit.setAttribute("aria-disabled", "true"); submit.style.opacity = "0.5"; submit.style.pointerEvents = "none"; }
        return;
      }

      const submit = $("[data-quote-submit]");
      if (submit) { submit.removeAttribute("aria-disabled"); submit.style.opacity = ""; submit.style.pointerEvents = ""; }

      body.innerHTML = items.map((i) => `
        <div class="qline">
          <div>
            <div class="pn">${esc(i.pn)}</div>
            <div class="desc">${esc(i.desc)}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:var(--au-s-2)">
            <div class="controls">
              <label class="u-visually-hidden" for="qty-${esc(i.pn)}">Quantity for ${esc(i.pn)}</label>
              <input id="qty-${esc(i.pn)}" type="number" min="1" value="${i.qty}" data-qty="${esc(i.pn)}">
            </div>
            <button class="remove" type="button" data-remove="${esc(i.pn)}">Remove</button>
          </div>
        </div>`).join("");
    }

    function open() {
      lastFocus = document.activeElement;
      drawer.hidden = false; scrim.hidden = false;
      const close = $("[data-quote-close]");
      close && close.focus();
      document.body.style.overflow = "hidden";
    }
    function close() {
      drawer.hidden = true; scrim.hidden = true;
      document.body.style.overflow = "";
      lastFocus && lastFocus.focus();
    }

    document.addEventListener("click", (e) => {
      // Contextual action: opens the list if there is one, otherwise goes
      // straight to the RFQ form rather than opening an empty drawer.
      if (e.target.closest("[data-quote-action]")) {
        if (Quote.all().length) open();
        else location.href = "rfq.html";
        return;
      }
      if (e.target.closest("[data-quote-open]")) { open(); return; }
      if (e.target.closest("[data-quote-close]") || e.target.closest("[data-quote-scrim]")) { close(); return; }

      const add = e.target.closest("[data-add-part]");
      if (add) {
        const part = findPart(add.dataset.addPart);
        if (!part) return;
        if (Quote.has(part.pn)) { Quote.remove(part.pn); toast(`${part.pn} removed from your quote list.`); }
        else { Quote.add(part, 1); toast(`${part.pn} added to your quote list.`, "Undo", () => Quote.remove(part.pn)); }
        return;
      }

      const rm = e.target.closest("[data-remove]");
      if (rm) {
        const pn = rm.dataset.remove;
        const item = Quote.all().find((i) => i.pn === pn);
        Quote.remove(pn);
        toast(`${pn} removed.`, "Undo", () => { const items = Quote.all(); items.push(item); Quote.save(items); });
      }
    });

    document.addEventListener("change", (e) => {
      const q = e.target.closest("[data-qty]");
      if (q) Quote.setQty(q.dataset.qty, q.value);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer && !drawer.hidden) close();
    });

    repaintQuote = () => paint(Quote.all());
    Quote.onChange(paint);
    paint(Quote.all());
  }

  /* ======================================================================
     Nav dropdowns

     Click-driven rather than hover-only, because hover menus are unusable on
     a touchscreen and hostile to anyone with a tremor. Hover still opens them
     on pointer devices for speed, but the click contract is what the panel is
     actually built on, so nothing depends on the cursor resting still.
     ====================================================================== */
  function wireNav() {
    const items = $$("[data-nav-item]");
    if (!items.length) return;

    /* Open state is tracked explicitly rather than read back off the DOM.
       Reading `panel.hidden` inside the click handler meant hover had already
       opened the panel by the time the click fired, so the click toggled it
       straight back shut and the menu appeared not to work at all on a mouse.
       `locked` separates "open because the pointer is here" from "open because
       the user asked for it". */
    const locked = new WeakMap();

    function closeAll(except) {
      items.forEach((item) => {
        if (item === except) return;
        locked.set(item, false);
        $("[data-nav-panel]", item).hidden = true;
        $("[data-nav-toggle]", item).setAttribute("aria-expanded", "false");
      });
    }

    function setOpen(item, open) {
      if (open) closeAll(item);
      $("[data-nav-panel]", item).hidden = !open;
      $("[data-nav-toggle]", item).setAttribute("aria-expanded", String(open));
    }

    items.forEach((item) => {
      const toggle = $("[data-nav-toggle]", item);
      locked.set(item, false);

      toggle.addEventListener("click", () => {
        const next = !locked.get(item);
        locked.set(item, next);
        setOpen(item, next);
      });

      // Hover is an accelerator on pointer devices only, never the contract —
      // and it never overrides an explicit click.
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        let leaveTimer;
        item.addEventListener("mouseenter", () => {
          clearTimeout(leaveTimer);
          if (!locked.get(item)) setOpen(item, true);
        });
        item.addEventListener("mouseleave", () => {
          // A short grace period so a diagonal cursor path to the panel does
          // not slam it shut mid-movement.
          if (locked.get(item)) return;
          leaveTimer = setTimeout(() => {
            if (!locked.get(item)) setOpen(item, false);
          }, 180);
        });
      }

      // Arrow keys walk the panel; Escape closes and returns focus to the
      // toggle so keyboard users never get stranded inside it.
      item.addEventListener("keydown", (e) => {
        const links = $$(".nav-panel-link, .nav-panel-foot", panel);
        if (e.key === "Escape") {
          locked.set(item, false);
          setOpen(item, false);
          toggle.focus();
          return;
        }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          if (panel.hidden) {
            locked.set(item, true);
            setOpen(item, true);
            links[0] && links[0].focus();
            e.preventDefault();
            return;
          }
          const i = links.indexOf(document.activeElement);
          const next = e.key === "ArrowDown"
            ? (i < 0 ? 0 : (i + 1) % links.length)
            : (i <= 0 ? links.length - 1 : i - 1);
          links[next] && links[next].focus();
          e.preventDefault();
        }
      });

      /* Tabbing out of the panel closes it — but only when focus actually
         lands somewhere else on the page. A null relatedTarget means focus
         left the document entirely (the user clicked browser chrome, or
         alt-tabbed away), and collapsing the menu behind their back in that
         case means it is gone when they come back to it. */
      item.addEventListener("focusout", (e) => {
        const to = e.relatedTarget;
        // A null relatedTarget, or <body>, means focus left the document or
        // was simply dropped — not a deliberate move elsewhere on the page.
        // Treating either as "tabbed away" collapsed the panel the instant
        // anything took focus off the button, which read as the menu refusing
        // to open at all. Only a real element elsewhere closes it.
        if (!to || to === document.body) return;
        if (!item.contains(to)) {
          locked.set(item, false);
          setOpen(item, false);
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("[data-nav-item]")) closeAll(null);
    });
  }

  /* "/" jumps to search from anywhere. Costs nothing to those who don't know
     it; saves a mouse trip for the buyers who use this site daily. */
  function wireShortcut() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const input = $("#header-search") || $("input[type=search]");
      if (input) { e.preventDefault(); input.focus(); input.select(); }
    });
  }

  function wireCopy() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-copy]");
      if (!btn) return;
      const value = btn.dataset.copy;
      navigator.clipboard && navigator.clipboard.writeText(value);
      const old = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(() => { btn.textContent = old; }, 1400);
    });
  }

  /* ======================================================================
     8. Form validation

     Validate on submit and on blur-after-error only — never while the buyer
     is still mid-word. Errors are shown next to the field, described in
     plain language, and focus jumps to the first one.
     ====================================================================== */

  function wireForms() {
    $$("form[data-validate]").forEach((form) => {
      if (form.dataset.wired === "true") return; // safe to call repeatedly
      form.dataset.wired = "true";

      /* Suppress the browser's native validation. Without this it fires first
         and short-circuits everything below — so the plain-language messages,
         the per-field marking and the focus-the-first-error behaviour never
         run, and the buyer gets an unstyled native bubble that vanishes on the
         next click instead. Set here rather than in the markup so no page can
         forget it. */
      form.setAttribute("novalidate", "");

      const fields = $$(".field", form);

      function validateField(field) {
        const input = $("input, select, textarea", field);
        if (!input) return true;
        const err = $(".error", field);
        let message = "";

        if (input.required && !input.value.trim()) {
          message = `${field.dataset.label || "This field"} is required.`;
        } else if (input.type === "email" && input.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) {
          message = "Enter a valid email address, e.g. name@company.com";
        } else if (input.type === "number" && input.value && Number(input.value) < 1) {
          message = "Quantity must be at least 1.";
        }

        field.dataset.invalid = String(Boolean(message));
        if (err) err.textContent = message;
        input.setAttribute("aria-invalid", String(Boolean(message)));
        return !message;
      }

      fields.forEach((field) => {
        const input = $("input, select, textarea", field);
        if (!input) return;
        input.addEventListener("blur", () => { if (field.dataset.invalid === "true") validateField(field); });
        input.addEventListener("input", () => { if (field.dataset.invalid === "true") validateField(field); });
      });

      form.addEventListener("submit", (e) => {
        const bad = fields.filter((f) => !validateField(f));
        if (bad.length) {
          e.preventDefault();
          const first = $("input, select, textarea", bad[0]);
          first && first.focus();
          first && first.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      });
    });
  }

  /* ======================================================================
     9. Boot
     ====================================================================== */

  function init() {
    const headerHost = $("[data-au-header]");
    if (headerHost) renderHeader(headerHost);
    const footerHost = $("[data-au-footer]");
    if (footerHost) renderFooter(footerHost);
    renderDrawer();

    $$("[data-search]").forEach(wireSearch);
    wireNav();
    wireQuoteUI();
    wireShortcut();
    wireCopy();
    wireForms();

    document.dispatchEvent(new CustomEvent("au:ready"));
  }

  window.AU = {
    $, $$, esc, norm, detectIdentifier, searchParts, highlight,
    partRow, findPart, Quote, toast, searchMarkup, STOCK_LABEL,
    param: (k) => new URLSearchParams(location.search).get(k) || "",

    /* Mount a search field into a host element and wire it. Used by any page
       that needs a second search field beyond the header one. */
    mountSearch(host, opts) {
      host.innerHTML = searchMarkup(opts || {});
      const root = $("[data-search]", host);
      if (root) wireSearch(root);
      return root;
    },

    /* Render a list of parts and immediately re-sync the add-to-quote buttons
       with what is already in the list. Anything that injects part rows after
       load must go through here, or the buttons will lie about their state. */
    renderParts(host, parts, query) {
      if (!host) return;
      host.innerHTML = parts.map((p) => partRow(p, query || "")).join("");
      repaintQuote();
    },

    repaint: () => repaintQuote(),

    /* Pages that inject a form after load must call this, or the form will
       submit unvalidated. */
    wireForms: () => wireForms(),
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

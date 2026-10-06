/*
 * Main clinician views: home, regimen lists, regimen page, drugs, topics, saved, about, search.
 */
(function () {
  "use strict";

  const ONCO = window.ONCO;
  const V = ONCO.vocab;
  const ui = ONCO.ui;
  const esc = ui.esc;
  const fmt = ui.fmt;
  const main = () => document.getElementById("main");
  const views = ONCO.views;

  views.home = function () {
    ui.setTitle("");
    ui.setActiveNav("");
    const out = ONCO.regimens.filter((r) => r.setting === "outpatient");
    const inp = ONCO.regimens.filter((r) => r.setting === "inpatient");
    const groups = ui.groupsFor(ONCO.regimens).map((g) => g.group);
    main().innerHTML =
      '<section class="hero"><h1>Chemotherapy regimens</h1>' +
      '<p class="muted">Doses, how to give each drug, premedication, prophylaxis and precautions — separated into outpatient (day unit) and inpatient regimens. Based on NCCN Guidelines and eviQ protocols.</p></section>' +
      '<div class="grid-2">' +
      '<a class="tile out" href="#/regimens?setting=outpatient"><h2>Outpatient regimens</h2><p>Given in the day unit or clinic, e.g. AC, FOLFOX, R-CHOP, carboplatin–paclitaxel.</p><span class="count" style="color:var(--out)">' + out.length + " regimens →</span></a>" +
      '<a class="tile in" href="#/regimens?setting=inpatient"><h2>Inpatient regimens</h2><p>Need admission, e.g. Hyper-CVAD, 7+3, R-ICE, DA-EPOCH-R, high-dose methotrexate.</p><span class="count" style="color:var(--in)">' + inp.length + " regimens →</span></a>" +
      "</div>" +
      '<div class="grid" style="margin-top:1rem">' +
      '<a class="tile" href="#/interactions"><h2>Interaction checker</h2><p>Azoles with vincristine or venetoclax, methotrexate with PPIs, QT drugs with arsenic, and more.</p></a>' +
      '<a class="tile" href="#/cumulative"><h2>Cumulative dose tracker</h2><p>Lifetime anthracycline (doxorubicin-equivalent) and bleomycin totals.</p></a>' +
      '<a class="tile" href="#/patient-app"><h2>Patient app</h2><p>Give a patient their own plain-language version of their treatment, with dates and warning signs.</p></a>' +
      '<a class="tile" href="#/supportive"><h2>Prophylaxis &amp; supportive care</h2><p>Antiemetics, G-CSF, antiviral, PJP, antifungal, TLS, mesna, febrile neutropenia.</p></a>' +
      '<a class="tile" href="#/principles"><h2>Principles of administration</h2><p>Safe prescribing, dose calculation, extravasation, hypersensitivity, intrathecal safety.</p></a>' +
      '<a class="tile" href="#/drugs"><h2>Drugs A–Z</h2><p>How to give each drug, vesicant status, toxicities, kidney/liver dose rules.</p></a>' +
      '<a class="tile" href="#/calculators"><h2>Calculators</h2><p>BSA, creatinine clearance, eGFR, carboplatin (Calvert), ANC, dose reduction.</p></a>' +
      "</div>" +
      '<h2 class="group-title">Browse by cancer type</h2><div class="tags">' +
      groups.map((g) => '<a class="badge neutral" href="#/regimens?group=' + encodeURIComponent(g) + '">' + esc(g) + "</a>").join("") +
      "</div>";
  };

  function searchText(r) {
    return [r.name, r.shortName, r.group, (r.indications || []).join(" "), ui.uniqueDrugs(r).map(ui.drugName).join(" "), ui.uniqueDrugs(r).map((id) => ((ONCO.drugs[id] || {}).aka || []).join(" ")).join(" ")]
      .join(" ")
      .toLowerCase();
  }
  views.searchText = searchText;

  views.regimens = function (query) {
    const setting = query.get("setting") || "all";
    const group = query.get("group") || "all";
    const text = (query.get("q") || "").toLowerCase();
    ui.setTitle(setting === "inpatient" ? "Inpatient regimens" : setting === "outpatient" ? "Outpatient regimens" : "Regimens");
    ui.setActiveNav(setting === "all" ? "" : setting);

    const allGroups = ui.groupsFor(ONCO.regimens).map((g) => g.group);
    let regs = ONCO.regimens.slice();
    if (setting !== "all") regs = regs.filter((r) => r.setting === setting);
    if (group !== "all") regs = regs.filter((r) => r.group === group);
    if (text) regs = regs.filter((r) => searchText(r).indexOf(text) >= 0);
    regs.sort((a, b) => a.name.localeCompare(b.name));

    const heading =
      setting === "outpatient"
        ? '<h1>Outpatient regimens</h1><p class="muted">Given in the day unit or clinic. Patient goes home the same day (some carry a home infusion pump).</p>'
        : setting === "inpatient"
          ? '<h1>Inpatient regimens</h1><p class="muted">Need hospital admission: long or continuous infusions, intensive hydration, close monitoring (TLS, methotrexate levels), or expected profound neutropenia.</p>'
          : "<h1>All regimens</h1>";

    main().innerHTML =
      '<div class="page-head">' + heading + "</div>" +
      '<div class="filters"><div class="seg" role="group" aria-label="Setting">' +
      ["all", "outpatient", "inpatient"].map((s) => '<button type="button" data-setting="' + s + '" aria-pressed="' + (s === setting) + '">' + (s === "all" ? "All" : s === "outpatient" ? "Outpatient" : "Inpatient") + "</button>").join("") +
      "</div>" +
      '<label class="visually-hidden" for="group-filter">Cancer type</label><select id="group-filter"><option value="all">All cancer types</option>' +
      allGroups.map((g) => '<option value="' + esc(g) + '"' + (g === group ? " selected" : "") + ">" + esc(g) + "</option>").join("") +
      "</select>" +
      '<label class="visually-hidden" for="text-filter">Filter</label><input id="text-filter" type="text" placeholder="Filter by drug or name" value="' + esc(text) + '">' +
      "</div>" +
      (regs.length ? ui.groupsFor(regs).map((g) => '<h2 class="group-title">' + esc(g.group) + '</h2><div class="reg-list">' + g.items.map(ui.regimenItem).join("") + "</div>").join("") : '<p class="empty">No regimens match.</p>');

    function go(next) {
      const p = new URLSearchParams();
      const s = next.setting || setting;
      const g = next.group || group;
      const q = next.q !== undefined ? next.q : text;
      if (s !== "all") p.set("setting", s);
      if (g !== "all") p.set("group", g);
      if (q) p.set("q", q);
      const h = "#/regimens" + (p.toString() ? "?" + p.toString() : "");
      if (next.replace) {
        history.replaceState(null, "", h);
        ONCO.route();
      } else location.hash = h;
    }

    const m = main();
    m.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => go({ setting: b.dataset.setting })));
    m.querySelector("#group-filter").addEventListener("change", (e) => go({ group: e.target.value }));
    const tf = m.querySelector("#text-filter");
    tf.addEventListener(
      "input",
      ui.debounce(() => {
        go({ q: tf.value.trim().toLowerCase(), replace: true });
        const again = main().querySelector("#text-filter");
        if (again) {
          again.focus();
          again.setSelectionRange(again.value.length, again.value.length);
        }
      }, 250)
    );
  };

  // ---------- Regimen page ----------

  function calendarHtml(r) {
    const S = ONCO.schedule;
    const start = S.parseDate(ui.state.calendarStart);
    const cal = S.calendar(r);
    return cal
      .map((ph) => {
        const cells = ph.days
          .map((d) => {
            const date = start ? ui.shortDate(S.addDays(start, d.day - 1)) : "";
            const chips = d.items
              .map((it) => '<span class="chip" title="' + esc(ui.drugName(it.entry.drug)) + '">' + esc(ui.shortName(it.entry.drug)) + (it.untilRecovery ? " →" : "") + "</span>")
              .join("");
            return '<div class="cal-day' + (d.items.length ? " has" : "") + '"><div class="cal-num">Day ' + d.day + "</div>" + (date ? '<div class="cal-date">' + esc(date) + "</div>" : "") + chips + "</div>";
          })
          .join("");
        return (ph.phase ? "<h3>" + esc(ph.phase) + (ph.length ? ' <span class="muted small">(' + ph.length + "-day cycle)</span>" : "") + "</h3>" : "") + '<div class="cal-grid">' + cells + "</div>";
      })
      .join("");
  }

  function organTableHtml(r) {
    const rows = ui.uniqueDrugs(r).map((id) => {
      const base = ONCO.doseRules[id] || {};
      const lines = r.drugs.filter((d) => d.drug === id);
      const anyHigh = lines.map((l) => ONCO.organ.rulesFor(l));
      const skip = anyHigh.every((x) => x.skip) ? anyHigh[0].skip : "";
      const renal = [].concat.apply([], anyHigh.map((x) => x.renal.map((y) => y.text)));
      const hepatic = [].concat.apply([], anyHigh.map((x) => x.hepatic.map((y) => y.text)));
      const age = [].concat.apply([], anyHigh.map((x) => x.age.map((y) => y.text)));
      const uniq = (a) => a.filter((x, i) => a.indexOf(x) === i);
      const kidney = uniq(renal).length ? ui.list(uniq(renal)) : base.note ? fmt(base.note) : skip ? '<span class="muted">' + esc(skip) + "</span>" : '<span class="muted">No routine adjustment</span>';
      const liver = uniq(hepatic).length ? ui.list(uniq(hepatic)) : '<span class="muted">No routine adjustment</span>';
      return "<tr><td>" + ui.drugLink(id) + (age.length ? '<div class="small muted">' + esc(uniq(age).join(" ")) + "</div>" : "") + '</td><td data-label="Kidney (GFR/CrCl)">' + kidney + '</td><td data-label="Liver">' + liver + "</td></tr>";
    });
    return '<div class="table-wrap"><table class="stack organ"><thead><tr><th>Drug</th><th>Kidney (GFR / CrCl, mL/min)</th><th>Liver</th></tr></thead><tbody>' + rows.join("") + "</tbody></table></div>";
  }

  function interactionsHtml(r) {
    const res = ONCO.interactions.forRegimen(r);
    const ext = res.external
      .map(
        (e) =>
          "<li>" + ui.severityBadge(e.rule.severity) + " <strong>" + esc(ui.drugName(e.drug)) + "</strong> + " + esc(e.others.map(ONCO.interactions.name).join(", ")) + ": " + esc(e.rule.effect) + ' <span class="muted">' + esc(e.rule.action) + "</span></li>"
      )
      .join("");
    const int = res.internal
      .map((p) => "<li>" + ui.severityBadge(p.rule.severity) + " <strong>" + esc(ui.drugName(p.x)) + " + " + esc(ui.drugName(p.y)) + "</strong>: " + esc(p.rule.action) + "</li>")
      .join("");
    return (
      (ext ? "<h3>Medicines to watch for with this regimen</h3><ul class=\"ix-list\">" + ext + "</ul>" : '<p class="muted">No listed interactions with other medicines.</p>') +
      (int ? "<h3>Within this regimen (order and timing)</h3><ul class=\"ix-list\">" + int + "</ul>" : "") +
      '<p><a class="btn small" href="#/interactions?reg=' + esc(r.id) + '">Check with the patient\'s own medicines →</a></p>'
    );
  }

  views.regimen = function (id) {
    const r = ui.regimenById(id);
    if (!r) return views.notFound();
    ui.setTitle(r.shortName || r.name);
    ui.setActiveNav(r.setting);
    const fav = ui.favorites().indexOf(r.id) >= 0;

    let lastPhase = null;
    const rows = r.drugs
      .map((d, i) => {
        let phaseRow = "";
        if (d.phase && d.phase !== lastPhase) {
          phaseRow = '<tr class="phase"><td colspan="5">' + esc(d.phase) + "</td></tr>";
          lastPhase = d.phase;
        }
        return (
          phaseRow +
          "<tr>" +
          '<td data-label="Drug">' + ui.drugLink(d.drug, d.label) + "</td>" +
          '<td data-label="Dose">' + ui.doseText(d) + '<span class="calc" data-calc="' + i + '"></span></td>' +
          '<td data-label="Route">' + esc(d.route) + "</td>" +
          '<td data-label="Days">' + fmt(d.days) + "</td>" +
          '<td data-label="How to give">' + fmt(d.admin || "") + "</td>" +
          "</tr>"
        );
      })
      .join("");

    const tagLinks = (r.tags || []).map((t) => '<a class="badge neutral" href="' + ui.topicHref(t) + '">' + esc(V.tags[t] || t) + "</a>").join("");
    const S = ONCO.schedule;
    const defCycles = S.defaultCycles(r);

    main().innerHTML =
      '<div class="page-head">' +
      '<div class="crumbs"><a href="#/regimens?setting=' + esc(r.setting) + '">' + (r.setting === "inpatient" ? "Inpatient" : "Outpatient") + "</a> › " + esc(r.group) + "</div>" +
      '<div class="head-row"><h1>' + esc(r.name) + "</h1></div>" +
      '<div class="head-actions">' +
      '<button class="btn" type="button" id="fav-btn" aria-pressed="' + fav + '">' + (fav ? "★ Saved" : "☆ Save") + "</button>" +
      '<a class="btn" href="#/order/' + esc(r.id) + '">Order sheet</a>' +
      '<a class="btn" href="#/leaflet/' + esc(r.id) + '">Patient leaflet</a>' +
      '<a class="btn primary" href="#/share/' + esc(r.id) + '">Give to patient (app)</a>' +
      '<button class="btn" type="button" onclick="window.print()">Print</button>' +
      "</div>" +
      '<div class="badges">' + ui.settingBadge(r.setting) + '<span class="badge neutral">' + esc(r.group) + "</span>" + ui.emetoBadge(r.emetogenic) + ui.fnBadge(r.fnRisk) + "</div>" +
      "</div>" +
      (r.alerts && r.alerts.length ? '<div class="callout danger"><strong>Critical safety points</strong>' + ui.list(r.alerts) + "</div>" : "") +
      '<section class="card"><div class="facts">' +
      ui.fact("Setting", (V.settings[r.setting] || r.setting) + (r.settingNote ? " — " + r.settingNote : "")) +
      ui.fact("Cycle length", r.cycle && r.cycle.length) +
      ui.fact("Number of cycles", r.cycle && r.cycle.count) +
      ui.fact("Treatment intent", r.intent) +
      ui.fact("Emetogenic risk", V.emetogenic[r.emetogenic]) +
      ui.fact("Febrile neutropenia risk", V.fnRisk[r.fnRisk]) +
      "</div></section>" +
      '<section class="card"><h2>Indications</h2>' + ui.list(r.indications) + "</section>" +
      '<section class="card"><h2>Drugs, doses and administration</h2>' +
      '<details class="calc-box"' + (ui.state.calcOpen ? " open" : "") + ' id="reg-calc"><summary>Calculate doses for a patient (with kidney / liver adjustment)</summary>' +
      ui.patientForm("reg") +
      '<div id="reg-alerts"></div>' +
      '<p class="small muted" style="margin-top:.6rem">Calculated doses include the kidney, liver and age rules in this app. They are a guide: round per local policy and check every dose independently. Values are not saved.</p>' +
      "</details>" +
      '<div class="table-wrap"><table class="stack"><thead><tr><th>Drug</th><th>Dose</th><th>Route</th><th>Days</th><th>How to give</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
      (r.order && r.order.length ? "<h3>Order of administration (day 1)</h3><ol>" + r.order.map((o) => "<li>" + fmt(o) + "</li>").join("") + "</ol>" : "") +
      "</section>" +
      '<section class="card" id="calendar"><h2>Day-by-day calendar</h2>' +
      '<div class="calc-form cal-controls no-print"><label>Day 1 of cycle 1 (optional)<input type="date" id="cal-start" value="' + esc(ui.state.calendarStart) + '"></label>' +
      '<label>Number of cycles<input type="number" id="cal-cycles" min="1" max="60" value="' + esc(ui.state.calendarCycles || defCycles) + '"></label>' +
      '<button class="btn" type="button" id="ics-btn">Download calendar (.ics)</button></div>' +
      '<div id="cal-body">' + calendarHtml(r) + "</div>" +
      '<p class="small muted">"→" means start on this day and continue until blood counts recover. Dates after surgery or for "until progression" phases are estimates.</p>' +
      "</section>" +
      '<div class="grid-2">' +
      (r.premeds && r.premeds.length ? '<section class="card"><h2>Premedication (before chemo)</h2>' + ui.list(r.premeds) + "</section>" : "") +
      (r.takeHome && r.takeHome.length ? '<section class="card"><h2>Prophylaxis &amp; take-home medicines</h2>' + ui.list(r.takeHome) + "</section>" : "") +
      "</div>" +
      (r.monitoring && r.monitoring.length ? '<section class="card"><h2>Before each cycle &amp; monitoring</h2>' + ui.list(r.monitoring) + "</section>" : "") +
      (r.precautions && r.precautions.length ? '<section class="card"><h2>Precautions</h2>' + ui.list(r.precautions) + "</section>" : "") +
      '<section class="card"><h2>Kidney and liver dose adjustments</h2>' + organTableHtml(r) +
      '<p class="small muted">These rules are applied automatically in the calculator above. Thresholds are common published values; eviQ uses the ADDIKD guideline (eGFR) — check your protocol.</p></section>' +
      (r.doseMods && r.doseMods.length ? '<section class="card"><h2>Dose modification for toxicity (summary)</h2>' + ui.list(r.doseMods) + '<p class="small muted">Summary only. Use the full NCCN/eviQ protocol for complete tables.</p></section>' : "") +
      '<section class="card"><h2>Drug interactions</h2>' + interactionsHtml(r) + "</section>" +
      (r.notes && r.notes.length ? '<section class="card"><h2>Notes &amp; variants</h2>' + ui.list(r.notes) + "</section>" : "") +
      (tagLinks ? '<section class="card"><h2>Related supportive-care topics</h2><div class="tags">' + tagLinks + "</div></section>" : "") +
      ui.refs(r.references);

    const m = main();
    m.querySelector("#fav-btn").addEventListener("click", (e) => {
      const on = ui.toggleFavorite(r.id);
      e.currentTarget.setAttribute("aria-pressed", on);
      e.currentTarget.textContent = on ? "★ Saved" : "☆ Save";
    });

    const details = m.querySelector("#reg-calc");
    details.addEventListener("toggle", () => {
      ui.state.calcOpen = details.open;
    });
    const form = m.querySelector("#reg-form");
    const update = () => {
      const p = ui.readPatientForm(form);
      m.querySelector("#reg-results").innerHTML = ui.patientResults(p);
      const alerts = [];
      r.drugs.forEach((d, i) => {
        const el = m.querySelector('[data-calc="' + i + '"]');
        const disp = ui.doseDisplay(d, p);
        el.innerHTML = disp.html;
        el.className = disp.cls;
        el.title = disp.title || "";
        const res = disp.result;
        if (res && res.reasons && res.reasons.length) alerts.push({ name: d.label || ui.drugName(d.drug), avoid: res.avoid, reasons: res.reasons });
      });
      const ready = p.bsa > 0 || p.weightKg > 0;
      let html = "";
      if (ready && alerts.length) {
        html += '<div class="callout ' + (alerts.some((a) => a.avoid) ? "danger" : "warn") + '"><strong>Dose changes for this patient</strong><ul>' +
          alerts.map((a) => "<li><strong>" + esc(a.name) + (a.avoid ? " — do not give" : "") + ":</strong> " + esc(a.reasons.join(" ")) + "</li>").join("") + "</ul></div>";
      }
      if (ready && !p.kidneyEntered) html += '<p class="small muted">Enter age, sex and creatinine to apply kidney rules.</p>';
      if (ready && !p.liverEntered) html += '<p class="small muted">Liver tests not entered — liver rules not checked.</p>';
      m.querySelector("#reg-alerts").innerHTML = html;
    };
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    update();

    const calStart = m.querySelector("#cal-start");
    const calCycles = m.querySelector("#cal-cycles");
    const updCal = () => {
      ui.state.calendarStart = calStart.value;
      ui.state.calendarCycles = calCycles.value;
      m.querySelector("#cal-body").innerHTML = calendarHtml(r);
    };
    calStart.addEventListener("change", updCal);
    calCycles.addEventListener("change", updCal);
    m.querySelector("#ics-btn").addEventListener("click", () => {
      const start = S.parseDate(calStart.value);
      if (!start) {
        alert("Choose the date of day 1 first.");
        return;
      }
      ui.download((r.shortName || r.id).replace(/[^\w-]+/g, "_") + "-calendar.ics", "text/calendar", ui.regimenIcs(r, start, Number(calCycles.value) || defCycles, ""));
    });
  };

  // ---------- Drugs ----------

  views.drugs = function (query) {
    ui.setTitle("Drugs A–Z");
    ui.setActiveNav("drugs");
    const text = (query.get("q") || "").toLowerCase();
    const drugs = Object.values(ONCO.drugs).sort((a, b) => a.name.localeCompare(b.name));
    const filtered = text ? drugs.filter((d) => (d.name + " " + (d.aka || []).join(" ") + " " + d.class).toLowerCase().indexOf(text) >= 0) : drugs;
    main().innerHTML =
      '<div class="page-head"><h1>Drugs A–Z</h1><p class="muted">How to give each drug, vesicant status, main toxicities, kidney/liver dose rules and interactions.</p></div>' +
      '<div class="filters"><input id="drug-filter" type="text" placeholder="Filter drugs" value="' + esc(text) + '" aria-label="Filter drugs"></div>' +
      '<div class="reg-list">' +
      filtered
        .map(
          (d) =>
            '<a class="reg-item" href="#/drug/' + esc(d.id) + '"><div class="title">' + esc(d.name) + (d.aka && d.aka.length ? ' <span class="muted small">(' + esc(d.aka.join(", ")) + ")</span>" : "") + '</div><div class="sub">' + esc(d.class) + '</div><div class="badges">' +
            vesicantBadge(d.vesicant) + (d.emetogenic ? '<span class="badge ' + esc(d.emetogenic) + '">Emetic: ' + esc(d.emetogenic) + "</span>" : "") + "</div></a>"
        )
        .join("") +
      "</div>";
    const f = main().querySelector("#drug-filter");
    f.addEventListener(
      "input",
      ui.debounce(() => {
        history.replaceState(null, "", "#/drugs" + (f.value ? "?q=" + encodeURIComponent(f.value.trim().toLowerCase()) : ""));
        ONCO.route();
        const again = main().querySelector("#drug-filter");
        again.focus();
        again.setSelectionRange(again.value.length, again.value.length);
      }, 250)
    );
  };

  function vesicantBadge(v) {
    if (!v) return "";
    const cls = v === "vesicant" ? "danger" : v === "none" ? "ok" : "warn";
    return '<a class="badge ' + cls + '" href="#/principles/extravasation">' + esc(V.vesicant[v] || v) + "</a>";
  }

  views.drug = function (id) {
    const d = ONCO.drugs[id];
    if (!d) return views.notFound();
    ui.setTitle(d.name);
    ui.setActiveNav("drugs");
    const usedIn = ONCO.regimens.filter((r) => r.drugs.some((x) => x.drug === id)).sort((a, b) => a.name.localeCompare(b.name));
    const rules = ONCO.doseRules[id] || {};
    const ruleList = (arr) => (arr && arr.length ? ui.list(arr.map((r) => r.text + (r.minDose ? " (applies to doses ≥ " + r.minDose + ")" : ""))) : '<span class="muted">No routine adjustment in the calculator.</span>');
    const ix = ONCO.interactionData.rules
      .map((rule) => ({ rule: rule, others: ONCO.interactions.otherSide(id, rule) }))
      .filter((x) => x.others && (x.others.length || x.rule.id === "live-vaccine"));
    const pinfo = ONCO.patient.drugInfo(id);
    main().innerHTML =
      '<div class="page-head"><div class="crumbs"><a href="#/drugs">Drugs A–Z</a></div><h1>' + esc(d.name) + "</h1>" +
      (d.aka && d.aka.length ? '<p class="muted">Also called: ' + esc(d.aka.join(", ")) + "</p>" : "") +
      '<div class="badges">' + vesicantBadge(d.vesicant) + (d.emetogenic ? '<span class="badge ' + esc(d.emetogenic) + '">Emetic risk: ' + esc(d.emetogenic) + "</span>" : "") + "</div></div>" +
      (d.alerts && d.alerts.length ? '<div class="callout danger"><strong>Critical safety points</strong>' + ui.list(d.alerts) + "</div>" : "") +
      '<section class="card"><dl class="kv">' + ui.kv("Class", d.class) + ui.kv("Routes", d.routes) + ui.kv("Vesicant status", V.vesicant[d.vesicant]) + ui.kv("Emetogenic risk (alone)", d.emetogenic ? V.emetogenic[d.emetogenic] + (d.emetoNote ? " — " + d.emetoNote : "") : "") + ui.kv("Maximum / cumulative dose", d.maxDose) + "</dl></section>" +
      '<section class="card"><h2>How to give</h2>' + ui.list(d.admin) + "</section>" +
      '<div class="grid-2"><section class="card"><h2>Main toxicities</h2>' + ui.list(d.toxicities) + '</section><section class="card"><h2>Precautions &amp; interactions</h2>' + ui.list(d.precautions) + "</section></div>" +
      '<section class="card"><h2>Kidney and liver</h2><dl class="kv">' + ui.kv("Renal (summary)", d.renal) + ui.kv("Hepatic (summary)", d.hepatic) + "</dl>" +
      '<h3>Rules applied in the dose calculator</h3><dl class="kv"><dt>Kidney</dt><dd>' + (rules.note ? fmt(rules.note) : ruleList(rules.renal)) + "</dd><dt>Liver</dt><dd>" + ruleList(rules.hepatic) + "</dd></dl>" +
      '<p class="small muted">General guide only. Check the specific protocol and product information.</p></section>' +
      (d.extravasation ? '<section class="card"><h2>If extravasation happens</h2><p>' + fmt(d.extravasation) + '</p><p class="small"><a href="#/principles/extravasation">General extravasation steps →</a></p></section>' : "") +
      (ix.length ? '<section class="card"><h2>Interactions</h2><ul class="ix-list">' + ix.map((x) => "<li>" + ui.severityBadge(x.rule.severity) + " with " + esc((x.others.length ? x.others : ["live-vaccine"]).map(ONCO.interactions.name).slice(0, 8).join(", ")) + ": " + esc(x.rule.effect) + ' <span class="muted">' + esc(x.rule.action) + "</span></li>").join("") + '</ul><p><a class="btn small" href="#/interactions?ids=' + esc(id) + '">Open interaction checker →</a></p></section>' : "") +
      '<section class="card"><h2>What patients are told</h2><p>' + esc(pinfo.what) + "</p>" + ui.list(pinfo.tips) + "</section>" +
      (usedIn.length ? '<section class="card"><h2>Used in these regimens</h2><div class="reg-list">' + usedIn.map(ui.regimenItem).join("") + "</div></section>" : "");
  };

  // ---------- Topics ----------

  views.topicIndex = function (kind) {
    const isSup = kind === "supportive";
    const items = isSup ? ONCO.supportive : ONCO.principles;
    ui.setTitle(isSup ? "Prophylaxis & supportive care" : "Principles of administration");
    ui.setActiveNav(kind);
    main().innerHTML =
      '<div class="page-head"><h1>' + (isSup ? "Prophylaxis &amp; supportive care" : "Principles of chemotherapy administration") + "</h1>" +
      '<p class="muted">' + (isSup ? "What to prescribe to prevent complications: antiemetics, growth factors, anti-infectives, TLS prevention and more." : "Safe prescribing, checking, giving and monitoring of anticancer drugs.") + "</p></div>" +
      '<div class="grid">' + items.map((t) => '<a class="tile" href="#/' + kind + "/" + esc(t.id) + '"><h2>' + esc(t.title) + "</h2><p>" + esc(t.summary) + "</p></a>").join("") + "</div>";
  };

  function autoTable(kind) {
    const levels = kind === "fnRisk" ? ["high", "intermediate", "low", "expected"] : ["high", "moderate", "low", "minimal"];
    const labels = kind === "fnRisk" ? V.fnRisk : V.emetogenic;
    const rows = levels
      .map((lvl) => {
        const regs = ONCO.regimens.filter((r) => r[kind] === lvl).sort((a, b) => a.name.localeCompare(b.name));
        if (!regs.length) return "";
        return "<tr><td><strong>" + esc(labels[lvl]) + "</strong></td><td>" + regs.map((r) => '<a href="#/regimen/' + esc(r.id) + '">' + esc(r.shortName || r.name) + "</a>").join(", ") + "</td></tr>";
      })
      .join("");
    return '<div class="table-wrap"><table><thead><tr><th>Level</th><th>Regimens</th></tr></thead><tbody>' + rows + "</tbody></table></div>";
  }

  views.renderSections = function (sections) {
    return (sections || [])
      .map((s) => {
        let h = "";
        if (s.heading) h += "<h2>" + esc(s.heading) + "</h2>";
        if (s.auto) h += autoTable(s.auto);
        if (s.callout) h += '<div class="callout ' + esc(s.callout.type || "info") + '">' + fmt(s.callout.text) + "</div>";
        (s.body || []).forEach((p) => (h += "<p>" + fmt(p) + "</p>"));
        if (s.bullets) h += ui.list(s.bullets);
        if (s.steps) h += "<ol>" + s.steps.map((x) => "<li>" + fmt(x) + "</li>").join("") + "</ol>";
        if (s.table) {
          h += '<div class="table-wrap"><table><thead><tr>' + s.table.head.map((c) => "<th>" + esc(c) + "</th>").join("") + "</tr></thead><tbody>" + s.table.rows.map((row) => "<tr>" + row.map((c) => "<td>" + fmt(c) + "</td>").join("") + "</tr>").join("") + "</tbody></table></div>";
        }
        return h;
      })
      .join("");
  };

  views.topic = function (kind, id) {
    const items = kind === "supportive" ? ONCO.supportive : ONCO.principles;
    const t = items.find((x) => x.id === id);
    if (!t) return views.notFound();
    ui.setTitle(t.title);
    ui.setActiveNav(kind);
    const tagged = ONCO.regimens.filter((r) => (r.tags || []).indexOf(id) >= 0).sort((a, b) => a.name.localeCompare(b.name));
    main().innerHTML =
      '<div class="page-head"><div class="crumbs"><a href="#/' + kind + '">' + (kind === "supportive" ? "Prophylaxis &amp; supportive care" : "Principles") + "</a></div>" +
      "<h1>" + esc(t.title) + '</h1><p class="muted">' + esc(t.summary) + "</p></div>" +
      '<article class="card article">' + views.renderSections(t.sections) + "</article>" +
      (tagged.length ? '<section class="card"><h2>Regimens that need this</h2><div class="reg-list">' + tagged.map(ui.regimenItem).join("") + "</div></section>" : "") +
      ui.refs(t.references);
  };

  // ---------- Saved, about, search, not found ----------

  views.favorites = function () {
    ui.setTitle("Saved regimens");
    ui.setActiveNav("favorites");
    const regs = ui.favorites().map(ui.regimenById).filter(Boolean);
    main().innerHTML = '<div class="page-head"><h1>Saved regimens</h1><p class="muted">Tap ☆ Save on any regimen. Saved on this device only.</p></div>' + (regs.length ? '<div class="reg-list">' + regs.map(ui.regimenItem).join("") + "</div>" : '<p class="empty">Nothing saved yet.</p>');
  };

  views.about = function () {
    ui.setTitle("About & sources");
    ui.setActiveNav("about");
    main().innerHTML =
      '<div class="page-head"><h1>About &amp; sources</h1></div>' +
      '<section class="card"><h2>Important disclaimer</h2><div class="callout danger"><p><strong>This app is a reference aid for qualified oncology professionals. It is not a prescribing system and does not replace clinical judgement.</strong></p>' +
      "<p>Doses shown are standard adult starting doses. Kidney/liver adjustments use common published thresholds. Before every prescription, check the dose against the current NCCN Guideline, the current eviQ protocol (or your national protocol) and your hospital policy. Guidelines change; content can contain errors.</p></div>" +
      "<p>Content last reviewed: " + esc(ONCO.meta.contentReviewed) + ". Version " + esc(ONCO.meta.version) + ".</p></section>" +
      '<section class="card"><h2>Main sources</h2><ul class="section-list">' +
      '<li><a href="https://www.nccn.org/guidelines/category_1" target="_blank" rel="noopener">NCCN Clinical Practice Guidelines in Oncology</a> — disease guidelines and supportive care (Antiemesis; Hematopoietic Growth Factors; Prevention and Treatment of Cancer-Related Infections; Management of Immunotherapy-Related Toxicities).</li>' +
      '<li><a href="https://www.nccn.org/compendia-templates/nccn-templates-main" target="_blank" rel="noopener">NCCN Chemotherapy Order Templates</a></li>' +
      '<li><a href="https://www.eviq.org.au" target="_blank" rel="noopener">eviQ Cancer Treatments Online</a> (Cancer Institute NSW) — protocol numbers on each regimen page; ADDIKD kidney dosing guideline.</li>' +
      "<li>ASCO / ESMO / MASCC / ONS guidelines; ESC 2022 cardio-oncology guideline (anthracycline equivalents); product information for interactions.</li>" +
      "<li>Pivotal trials named on each regimen page.</li></ul></section>" +
      '<section class="card"><h2>Privacy</h2><p>Nothing typed into the calculators or order sheet is stored or sent anywhere. Saved regimens, theme, your team\'s contact details (on the share page) and patients\' saved plans (on their own phone) are kept only on that device.</p></section>' +
      '<section class="card"><h2>Add or correct content</h2><p>All content lives in plain JavaScript files in the <code>data/</code> folder. See <code>CONTRIBUTING.md</code> for the format.</p></section>';
  };

  function buildIndex() {
    const idx = [];
    ONCO.regimens.forEach((r) => idx.push({ type: "Regimen", title: r.name, sub: (r.setting === "inpatient" ? "Inpatient" : "Outpatient") + " · " + r.group, href: "#/regimen/" + r.id, text: searchText(r), boost: (r.shortName || "").toLowerCase() }));
    Object.values(ONCO.drugs).forEach((d) => idx.push({ type: "Drug", title: d.name, sub: d.class, href: "#/drug/" + d.id, text: (d.name + " " + (d.aka || []).join(" ") + " " + d.class).toLowerCase(), boost: d.name.toLowerCase() }));
    ONCO.supportive.forEach((t) => idx.push({ type: "Supportive care", title: t.title, sub: t.summary, href: "#/supportive/" + t.id, text: (t.title + " " + t.summary + " " + (t.keywords || []).join(" ")).toLowerCase(), boost: t.title.toLowerCase() }));
    ONCO.principles.forEach((t) => idx.push({ type: "Principle", title: t.title, sub: t.summary, href: "#/principles/" + t.id, text: (t.title + " " + t.summary + " " + (t.keywords || []).join(" ")).toLowerCase(), boost: t.title.toLowerCase() }));
    [
      ["Interaction checker", "#/interactions", "interactions drug interaction azole cyp3a4"],
      ["Cumulative dose tracker", "#/cumulative", "cumulative lifetime anthracycline doxorubicin bleomycin"],
      ["Patient app", "#/patient-app", "patient app leaflet qr link"],
      ["Calculators", "#/calculators", "bsa crcl egfr calvert carboplatin anc"],
    ].forEach((t) => idx.push({ type: "Tool", title: t[0], sub: "", href: t[1], text: (t[0] + " " + t[2]).toLowerCase(), boost: t[0].toLowerCase() }));
    return idx;
  }

  let index = null;
  views.search = function (q) {
    if (!index) index = buildIndex();
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return index
      .map((e) => {
        let score = 0;
        for (const t of terms) {
          if (e.text.indexOf(t) < 0) return null;
          if (e.boost === t) score += 10;
          else if (e.boost.indexOf(t) === 0) score += 5;
          if (e.title.toLowerCase().indexOf(t) >= 0) score += 3;
          score += 1;
        }
        return { e, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || a.e.title.localeCompare(b.e.title))
      .map((x) => x.e);
  };

  views.searchPage = function (query) {
    const q = query.get("q") || "";
    ui.setTitle("Search");
    ui.setActiveNav("");
    const input = document.getElementById("search-input");
    if (document.activeElement !== input) input.value = q;
    const hits = views.search(q);
    main().innerHTML =
      "<h1>Search</h1>" + (q ? '<p class="muted">' + hits.length + " result" + (hits.length === 1 ? "" : "s") + " for “" + esc(q) + "”</p>" : "") +
      '<div class="card search-results" style="padding:0">' +
      (hits.length ? hits.map((h) => '<a class="hit" href="' + esc(h.href) + '"><div class="t">' + esc(h.title) + ' <span class="badge neutral">' + esc(h.type) + '</span></div><div class="s">' + esc(h.sub) + "</div></a>").join("") : '<p class="empty" style="padding:1rem">No results.</p>') +
      "</div>";
  };

  views.notFound = function () {
    ui.setTitle("Not found");
    main().innerHTML = '<h1>Not found</h1><p>That page does not exist. <a href="#/">Go home</a>.</p>';
  };
})();

/*
 * OncoRegimens app: hash router + views. No framework, no build step.
 */
(function () {
  "use strict";

  const ONCO = window.ONCO;
  const V = ONCO.vocab;
  const main = document.getElementById("main");

  // Patient values typed into a calculator. Kept in memory only (never saved).
  const state = {
    patient: { heightCm: "", weightKg: "", age: "", sex: "M", scr: "", scrUnit: "mgdl", gfrMethod: "cg", measuredGfr: "", floorScr: true },
    calcOpen: false,
  };

  // ---------- Small helpers ----------

  const storage = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        /* storage blocked: ignore */
      }
    },
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Minimal inline formatting for content strings: **bold** and [text](url)
  function fmt(s) {
    let out = esc(s);
    out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, text, url) {
      const ext = /^https?:/i.test(url);
      return '<a href="' + url + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + text + "</a>";
    });
    return out;
  }

  function list(items, cls) {
    if (!items || !items.length) return "";
    return '<ul class="section-list ' + (cls || "") + '">' + items.map((i) => "<li>" + fmt(i) + "</li>").join("") + "</ul>";
  }

  function unitLabel(u) {
    return V.units[u] || u;
  }

  function fmtNum(n) {
    return Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });
  }

  function doseText(entry) {
    if (entry.dose === undefined || entry.dose === null) return entry.doseNote ? fmt(entry.doseNote) : "—";
    const d = Array.isArray(entry.dose) ? entry.dose.map(fmtNum).join("–") : fmtNum(entry.dose);
    const u = entry.unit === "AUC" ? "" : " " + unitLabel(entry.unit);
    const main = entry.unit === "AUC" ? "AUC " + d : d + u;
    let s = '<span class="dose">' + esc(main) + "</span>";
    if (typeof entry.cap === "number") s += ' <span class="muted small nowrap">(max ' + fmtNum(entry.cap) + (entry.unit === "units/m2" || entry.unit === "units" ? " units" : " mg") + ")</span>";
    if (entry.doseNote) s += '<div class="small muted">' + fmt(entry.doseNote) + "</div>";
    return s;
  }

  function drugName(id) {
    const d = ONCO.drugs[id];
    return d ? d.name : id;
  }

  function drugLink(id, label) {
    const d = ONCO.drugs[id];
    if (!d) return esc(label || id);
    return '<a href="#/drug/' + esc(id) + '">' + esc(label || d.name) + "</a>";
  }

  function settingBadge(s) {
    return '<span class="badge ' + (s === "inpatient" ? "in" : "out") + '">' + esc(s === "inpatient" ? "Inpatient" : "Outpatient") + "</span>";
  }

  function emetoBadge(e) {
    if (!e) return "";
    return '<a class="badge ' + esc(e) + '" href="#/supportive/antiemetic" title="Emetogenic risk">Emetic risk: ' + esc(e) + "</a>";
  }

  function fnBadge(f) {
    if (!f) return "";
    const label = f === "expected" ? "Profound neutropenia" : "FN risk: " + f;
    return '<a class="badge ' + esc(f) + '" href="#/supportive/gcsf" title="' + esc(V.fnRisk[f] || "") + '">' + esc(label) + "</a>";
  }

  function favorites() {
    return storage.get("onco.favorites", []);
  }

  function toggleFavorite(id) {
    const f = favorites();
    const i = f.indexOf(id);
    if (i >= 0) f.splice(i, 1);
    else f.push(id);
    storage.set("onco.favorites", f);
    return i < 0;
  }

  function regimenById(id) {
    return ONCO.regimens.find((r) => r.id === id);
  }

  // Tags can point at a supportive-care topic or a principles topic.
  function topicHref(id) {
    if (ONCO.supportive.some((t) => t.id === id)) return "#/supportive/" + id;
    if (ONCO.principles.some((t) => t.id === id)) return "#/principles/" + id;
    return "#/supportive";
  }

  function groupsFor(regs) {
    const order = [];
    const map = {};
    regs.forEach((r) => {
      if (!map[r.group]) {
        map[r.group] = [];
        order.push(r.group);
      }
      map[r.group].push(r);
    });
    order.sort();
    return order.map((g) => ({ group: g, items: map[g] }));
  }

  function regimenItem(r) {
    const drugs = uniqueDrugs(r).map(drugName).join(", ");
    return (
      '<a class="reg-item" href="#/regimen/' + esc(r.id) + '">' +
      '<div class="title">' + esc(r.name) + "</div>" +
      '<div class="sub">' + esc(drugs) + "</div>" +
      '<div class="badges">' + settingBadge(r.setting) + '<span class="badge neutral">' + esc(r.group) + "</span>" + emetoBadge(r.emetogenic) + fnBadge(r.fnRisk) + "</div>" +
      "</a>"
    );
  }

  function uniqueDrugs(r) {
    const seen = [];
    r.drugs.forEach((d) => {
      if (seen.indexOf(d.drug) < 0) seen.push(d.drug);
    });
    return seen;
  }

  function setTitle(t) {
    document.title = t ? t + " · OncoRegimens" : "OncoRegimens";
  }

  function setActiveNav(key) {
    document.querySelectorAll(".mainnav a").forEach((a) => {
      a.classList.toggle("active", a.dataset.nav === key);
    });
  }

  function refs(references) {
    if (!references || !references.length) return "";
    return (
      '<section class="card"><h2>Sources</h2><ul class="section-list">' +
      references
        .map((r) => "<li>" + (r.url ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.label) + "</a>" : esc(r.label)) + "</li>")
        .join("") +
      "</ul></section>"
    );
  }

  // ---------- Views ----------

  function viewHome() {
    setTitle("");
    setActiveNav("");
    const out = ONCO.regimens.filter((r) => r.setting === "outpatient");
    const inp = ONCO.regimens.filter((r) => r.setting === "inpatient");
    const groups = groupsFor(ONCO.regimens).map((g) => g.group);
    main.innerHTML =
      '<section class="hero">' +
      "<h1>Chemotherapy regimens</h1>" +
      '<p class="muted">Doses, how to give each drug, premedication, prophylaxis and precautions — separated into outpatient (day unit) and inpatient regimens. Based on NCCN Guidelines and eviQ protocols.</p>' +
      "</section>" +
      '<div class="grid-2">' +
      '<a class="tile out" href="#/regimens?setting=outpatient"><h2>Outpatient regimens</h2><p>Given in the day unit or clinic, e.g. AC, FOLFOX, R-CHOP, carboplatin–paclitaxel.</p><span class="count" style="color:var(--out)">' + out.length + " regimens →</span></a>" +
      '<a class="tile in" href="#/regimens?setting=inpatient"><h2>Inpatient regimens</h2><p>Need admission, e.g. Hyper-CVAD, 7+3, R-ICE, DA-EPOCH-R, high-dose methotrexate.</p><span class="count" style="color:var(--in)">' + inp.length + " regimens →</span></a>" +
      "</div>" +
      '<div class="grid" style="margin-top:1rem">' +
      '<a class="tile" href="#/supportive"><h2>Prophylaxis &amp; supportive care</h2><p>Antiemetics, G-CSF, antiviral, PJP, antifungal, TLS, mesna, febrile neutropenia.</p></a>' +
      '<a class="tile" href="#/principles"><h2>Principles of administration</h2><p>Safe prescribing, dose calculation, extravasation, hypersensitivity, intrathecal safety.</p></a>' +
      '<a class="tile" href="#/drugs"><h2>Drugs A–Z</h2><p>How to give each drug, vesicant status, key toxicities, renal/hepatic advice.</p></a>' +
      '<a class="tile" href="#/calculators"><h2>Calculators</h2><p>BSA, creatinine clearance, eGFR, carboplatin (Calvert), ANC.</p></a>' +
      "</div>" +
      '<h2 class="group-title">Browse by cancer type</h2>' +
      '<div class="tags">' +
      groups.map((g) => '<a class="badge neutral" href="#/regimens?group=' + encodeURIComponent(g) + '">' + esc(g) + "</a>").join("") +
      "</div>";
  }

  function viewRegimens(query) {
    const setting = query.get("setting") || "all";
    const group = query.get("group") || "all";
    const text = (query.get("q") || "").toLowerCase();
    setTitle(setting === "inpatient" ? "Inpatient regimens" : setting === "outpatient" ? "Outpatient regimens" : "Regimens");
    setActiveNav(setting === "all" ? "" : setting);

    const allGroups = groupsFor(ONCO.regimens).map((g) => g.group);
    let regs = ONCO.regimens.slice();
    if (setting !== "all") regs = regs.filter((r) => r.setting === setting);
    if (group !== "all") regs = regs.filter((r) => r.group === group);
    if (text) regs = regs.filter((r) => searchText(r).indexOf(text) >= 0);
    regs.sort((a, b) => a.name.localeCompare(b.name));

    const heading =
      setting === "outpatient"
        ? "<h1>Outpatient regimens</h1><p class=\"muted\">Given in the day unit or clinic. Patient goes home the same day (some carry a home infusion pump).</p>"
        : setting === "inpatient"
          ? "<h1>Inpatient regimens</h1><p class=\"muted\">Need hospital admission: long or continuous infusions, intensive hydration, close monitoring (TLS, methotrexate levels), or expected profound neutropenia.</p>"
          : "<h1>All regimens</h1>";

    main.innerHTML =
      '<div class="page-head">' + heading + "</div>" +
      '<div class="filters">' +
      '<div class="seg" role="group" aria-label="Setting">' +
      ["all", "outpatient", "inpatient"]
        .map((s) => '<button type="button" data-setting="' + s + '" aria-pressed="' + (s === setting) + '">' + (s === "all" ? "All" : s === "outpatient" ? "Outpatient" : "Inpatient") + "</button>")
        .join("") +
      "</div>" +
      '<label class="visually-hidden" for="group-filter">Cancer type</label>' +
      '<select id="group-filter"><option value="all">All cancer types</option>' +
      allGroups.map((g) => '<option value="' + esc(g) + '"' + (g === group ? " selected" : "") + ">" + esc(g) + "</option>").join("") +
      "</select>" +
      '<label class="visually-hidden" for="text-filter">Filter</label>' +
      '<input id="text-filter" type="text" placeholder="Filter by drug or name" value="' + esc(text) + '">' +
      "</div>" +
      (regs.length
        ? groupsFor(regs)
            .map((g) => '<h2 class="group-title">' + esc(g.group) + '</h2><div class="reg-list">' + g.items.map(regimenItem).join("") + "</div>")
            .join("")
        : '<p class="empty">No regimens match.</p>');

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
        route();
      } else location.hash = h;
    }

    main.querySelectorAll(".seg button").forEach((b) => b.addEventListener("click", () => go({ setting: b.dataset.setting })));
    main.querySelector("#group-filter").addEventListener("change", (e) => go({ group: e.target.value }));
    const tf = main.querySelector("#text-filter");
    tf.addEventListener("input", debounce(() => {
      go({ q: tf.value.trim().toLowerCase(), replace: true });
      const again = main.querySelector("#text-filter");
      if (again) {
        again.focus();
        again.setSelectionRange(again.value.length, again.value.length);
      }
    }, 250));
  }

  function patientForm(idPrefix) {
    const p = state.patient;
    return (
      '<form class="calc-form" id="' + idPrefix + '-form" onsubmit="return false">' +
      '<label>Height (cm)<input name="heightCm" type="number" inputmode="decimal" min="50" max="250" value="' + esc(p.heightCm) + '"></label>' +
      '<label>Weight (kg)<input name="weightKg" type="number" inputmode="decimal" min="10" max="350" value="' + esc(p.weightKg) + '"></label>' +
      '<label>Age (years)<input name="age" type="number" inputmode="numeric" min="16" max="110" value="' + esc(p.age) + '"></label>' +
      '<label>Sex<select name="sex"><option value="M"' + (p.sex === "M" ? " selected" : "") + '>Male</option><option value="F"' + (p.sex === "F" ? " selected" : "") + ">Female</option></select></label>" +
      '<label>Serum creatinine<input name="scr" type="number" inputmode="decimal" step="0.01" min="0" value="' + esc(p.scr) + '"></label>' +
      '<label>Creatinine unit<select name="scrUnit"><option value="mgdl"' + (p.scrUnit === "mgdl" ? " selected" : "") + '>mg/dL</option><option value="umol"' + (p.scrUnit === "umol" ? " selected" : "") + ">µmol/L</option></select></label>" +
      '<label>GFR for carboplatin<select name="gfrMethod">' +
      '<option value="cg"' + (p.gfrMethod === "cg" ? " selected" : "") + ">Cockcroft–Gault CrCl</option>" +
      '<option value="ckdepi"' + (p.gfrMethod === "ckdepi" ? " selected" : "") + ">CKD-EPI, de-indexed (eviQ)</option>" +
      '<option value="measured"' + (p.gfrMethod === "measured" ? " selected" : "") + ">Measured GFR</option>" +
      "</select></label>" +
      '<label>Measured GFR (mL/min)<input name="measuredGfr" type="number" inputmode="decimal" min="0" value="' + esc(p.measuredGfr) + '"></label>' +
      '<label class="check"><input name="floorScr" type="checkbox"' + (p.floorScr ? " checked" : "") + "> Round creatinine below 0.7 mg/dL (62 µmol/L) up to 0.7 for GFR estimates (common safety practice)</label>" +
      "</form>" +
      '<div class="results" id="' + idPrefix + '-results"></div>'
    );
  }

  function readPatientForm(form) {
    const fd = new FormData(form);
    state.patient = {
      heightCm: fd.get("heightCm") || "",
      weightKg: fd.get("weightKg") || "",
      age: fd.get("age") || "",
      sex: fd.get("sex") || "M",
      scr: fd.get("scr") || "",
      scrUnit: fd.get("scrUnit") || "mgdl",
      gfrMethod: fd.get("gfrMethod") || "cg",
      measuredGfr: fd.get("measuredGfr") || "",
      floorScr: fd.get("floorScr") === "on",
    };
    return ONCO.calc.patientFromInput(state.patient);
  }

  function resultBox(k, v, s) {
    return '<div class="result"><div class="k">' + esc(k) + '</div><div class="v">' + v + "</div>" + (s ? '<div class="s">' + esc(s) + "</div>" : "") + "</div>";
  }

  function patientResults(p) {
    const r = [];
    const f = (x, d) => (isFinite(x) && x > 0 ? x.toFixed(d) : "—");
    r.push(resultBox("BSA (Mosteller)", f(p.bsa, 2) + " m²"));
    r.push(resultBox("BMI", f(p.bmi, 1), p.bmi >= 30 ? "Obese: ASCO advises full weight-based dosing" : ""));
    r.push(resultBox("CrCl (Cockcroft–Gault)", f(p.crcl, 0) + " mL/min", p.bmi >= 30 ? "uses adjusted body weight" : "uses actual body weight"));
    r.push(resultBox("eGFR CKD-EPI 2021", f(p.egfr, 0), "mL/min/1.73 m²"));
    r.push(resultBox("eGFR de-indexed", f(p.egfrDeindexed, 0) + " mL/min", "eGFR × BSA / 1.73"));
    r.push(resultBox("GFR used for carboplatin", f(p.gfrForCarboplatin, 0) + " mL/min", p.gfrForCarboplatin > 125 ? "capped at 125 in Calvert" : ""));
    return r.join("");
  }

  function viewRegimen(id) {
    const r = regimenById(id);
    if (!r) return viewNotFound();
    setTitle(r.shortName || r.name);
    setActiveNav(r.setting);
    const fav = favorites().indexOf(r.id) >= 0;

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
          '<td data-label="Drug">' + drugLink(d.drug, d.label) + "</td>" +
          '<td data-label="Dose">' + doseText(d) + '<span class="calc" data-calc="' + i + '"></span></td>' +
          '<td data-label="Route">' + esc(d.route) + "</td>" +
          '<td data-label="Days">' + esc(d.days) + "</td>" +
          '<td data-label="How to give">' + fmt(d.admin || "") + "</td>" +
          "</tr>"
        );
      })
      .join("");

    const tagLinks = (r.tags || [])
      .map((t) => '<a class="badge neutral" href="' + topicHref(t) + '">' + esc(V.tags[t] || t) + "</a>")
      .join("");

    main.innerHTML =
      '<div class="page-head">' +
      '<div class="crumbs"><a href="#/regimens?setting=' + esc(r.setting) + '">' + esc(r.setting === "inpatient" ? "Inpatient" : "Outpatient") + "</a> › " + esc(r.group) + "</div>" +
      '<div class="head-row"><h1>' + esc(r.name) + "</h1>" +
      '<div class="head-actions"><button class="btn" type="button" id="fav-btn" aria-pressed="' + fav + '">' + (fav ? "★ Saved" : "☆ Save") + '</button><button class="btn" type="button" onclick="window.print()">Print</button></div></div>' +
      '<div class="badges">' + settingBadge(r.setting) + '<span class="badge neutral">' + esc(r.group) + "</span>" + emetoBadge(r.emetogenic) + fnBadge(r.fnRisk) + "</div>" +
      "</div>" +
      (r.alerts && r.alerts.length ? '<div class="callout danger"><strong>Critical safety points</strong>' + list(r.alerts) + "</div>" : "") +
      '<section class="card"><div class="facts">' +
      fact("Setting", (V.settings[r.setting] || r.setting) + (r.settingNote ? " — " + r.settingNote : "")) +
      fact("Cycle length", r.cycle && r.cycle.length) +
      fact("Number of cycles", r.cycle && r.cycle.count) +
      fact("Treatment intent", r.intent) +
      fact("Emetogenic risk", V.emetogenic[r.emetogenic]) +
      fact("Febrile neutropenia risk", V.fnRisk[r.fnRisk]) +
      "</div></section>" +
      '<section class="card"><h2>Indications</h2>' + list(r.indications) + "</section>" +
      '<section class="card"><h2>Drugs, doses and administration</h2>' +
      '<details class="calc-box"' + (state.calcOpen ? " open" : "") + ' id="reg-calc"><summary>Calculate doses for a patient</summary>' +
      patientForm("reg") +
      '<p class="small muted" style="margin-top:.6rem">Calculated doses are a guide. Round per local policy and check every dose independently. Values are not saved.</p>' +
      "</details>" +
      '<div class="table-wrap"><table class="stack"><thead><tr><th>Drug</th><th>Dose</th><th>Route</th><th>Days</th><th>How to give</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
      (r.order && r.order.length ? "<h3>Order of administration (day 1)</h3><ol>" + r.order.map((o) => "<li>" + fmt(o) + "</li>").join("") + "</ol>" : "") +
      "</section>" +
      '<div class="grid-2">' +
      (r.premeds && r.premeds.length ? '<section class="card"><h2>Premedication (before chemo)</h2>' + list(r.premeds) + "</section>" : "") +
      (r.takeHome && r.takeHome.length ? '<section class="card"><h2>Prophylaxis &amp; take-home medicines</h2>' + list(r.takeHome) + "</section>" : "") +
      "</div>" +
      (r.monitoring && r.monitoring.length ? '<section class="card"><h2>Before each cycle &amp; monitoring</h2>' + list(r.monitoring) + "</section>" : "") +
      (r.precautions && r.precautions.length ? '<section class="card"><h2>Precautions</h2>' + list(r.precautions) + "</section>" : "") +
      (r.doseMods && r.doseMods.length ? '<section class="card"><h2>Dose modification (summary)</h2>' + list(r.doseMods) + '<p class="small muted">Summary only. Use the full NCCN/eviQ protocol for complete dose-modification tables.</p></section>' : "") +
      (r.notes && r.notes.length ? '<section class="card"><h2>Notes &amp; variants</h2>' + list(r.notes) + "</section>" : "") +
      (tagLinks ? '<section class="card"><h2>Related supportive-care topics</h2><div class="tags">' + tagLinks + "</div></section>" : "") +
      refs(r.references);

    main.querySelector("#fav-btn").addEventListener("click", (e) => {
      const on = toggleFavorite(r.id);
      e.currentTarget.setAttribute("aria-pressed", on);
      e.currentTarget.textContent = on ? "★ Saved" : "☆ Save";
    });

    const details = main.querySelector("#reg-calc");
    details.addEventListener("toggle", () => {
      state.calcOpen = details.open;
    });
    const form = main.querySelector("#reg-form");
    const update = () => {
      const p = readPatientForm(form);
      main.querySelector("#reg-results").innerHTML = patientResults(p);
      const ready = p.bsa > 0 || p.weightKg > 0;
      r.drugs.forEach((d, i) => {
        const el = main.querySelector('[data-calc="' + i + '"]');
        if (!el) return;
        if (!ready || d.dose === undefined || d.dose === null) {
          el.textContent = "";
          el.className = "calc";
          return;
        }
        const res = ONCO.calc.doseForEntry(d, p);
        if (res.error) {
          el.textContent = res.error;
          el.className = "calc err";
        } else {
          el.textContent = "= " + res.values.map(fmtNum).join("–") + " " + res.outUnit + (res.capped ? " (capped)" : "");
          el.className = "calc" + (res.capped ? " capped" : "");
          el.title = res.note || "";
        }
      });
    };
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    update();
  }

  function fact(k, v) {
    if (!v) return "";
    return '<div class="fact"><div class="k">' + esc(k) + '</div><div class="v">' + esc(v) + "</div></div>";
  }

  function viewDrugs(query) {
    setTitle("Drugs A–Z");
    setActiveNav("drugs");
    const text = (query.get("q") || "").toLowerCase();
    const drugs = Object.values(ONCO.drugs).sort((a, b) => a.name.localeCompare(b.name));
    const filtered = text ? drugs.filter((d) => (d.name + " " + (d.aka || []).join(" ") + " " + d.class).toLowerCase().indexOf(text) >= 0) : drugs;
    main.innerHTML =
      '<div class="page-head"><h1>Drugs A–Z</h1><p class="muted">How to give each drug, vesicant status, main toxicities, and renal/hepatic advice.</p></div>' +
      '<div class="filters"><input id="drug-filter" type="text" placeholder="Filter drugs" value="' + esc(text) + '" aria-label="Filter drugs"></div>' +
      '<div class="reg-list">' +
      filtered
        .map(
          (d) =>
            '<a class="reg-item" href="#/drug/' + esc(d.id) + '"><div class="title">' + esc(d.name) + (d.aka && d.aka.length ? ' <span class="muted small">(' + esc(d.aka.join(", ")) + ")</span>" : "") + '</div><div class="sub">' + esc(d.class) + '</div><div class="badges">' +
            vesicantBadge(d.vesicant) +
            (d.emetogenic ? '<span class="badge ' + esc(d.emetogenic) + '">Emetic: ' + esc(d.emetogenic) + "</span>" : "") +
            "</div></a>"
        )
        .join("") +
      "</div>";
    const f = main.querySelector("#drug-filter");
    f.addEventListener("input", debounce(() => {
      history.replaceState(null, "", "#/drugs" + (f.value ? "?q=" + encodeURIComponent(f.value.trim().toLowerCase()) : ""));
      route();
      const again = main.querySelector("#drug-filter");
      again.focus();
      again.setSelectionRange(again.value.length, again.value.length);
    }, 250));
  }

  function vesicantBadge(v) {
    if (!v) return "";
    const cls = v === "vesicant" ? "danger" : v === "none" ? "ok" : "warn";
    return '<a class="badge ' + cls + '" href="#/principles/extravasation">' + esc(V.vesicant[v] || v) + "</a>";
  }

  function viewDrug(id) {
    const d = ONCO.drugs[id];
    if (!d) return viewNotFound();
    setTitle(d.name);
    setActiveNav("drugs");
    const usedIn = ONCO.regimens.filter((r) => r.drugs.some((x) => x.drug === id)).sort((a, b) => a.name.localeCompare(b.name));
    main.innerHTML =
      '<div class="page-head"><div class="crumbs"><a href="#/drugs">Drugs A–Z</a></div>' +
      "<h1>" + esc(d.name) + "</h1>" +
      (d.aka && d.aka.length ? '<p class="muted">Also called: ' + esc(d.aka.join(", ")) + "</p>" : "") +
      '<div class="badges">' + vesicantBadge(d.vesicant) + (d.emetogenic ? '<span class="badge ' + esc(d.emetogenic) + '">Emetic risk: ' + esc(d.emetogenic) + "</span>" : "") + "</div></div>" +
      (d.alerts && d.alerts.length ? '<div class="callout danger"><strong>Critical safety points</strong>' + list(d.alerts) + "</div>" : "") +
      '<section class="card"><dl class="kv">' +
      kv("Class", d.class) +
      kv("Routes", d.routes) +
      kv("Vesicant status", V.vesicant[d.vesicant]) +
      kv("Emetogenic risk (alone)", d.emetogenic ? V.emetogenic[d.emetogenic] : "") +
      kv("Maximum / cumulative dose", d.maxDose) +
      "</dl></section>" +
      '<section class="card"><h2>How to give</h2>' + list(d.admin) + "</section>" +
      '<div class="grid-2">' +
      '<section class="card"><h2>Main toxicities</h2>' + list(d.toxicities) + "</section>" +
      '<section class="card"><h2>Precautions &amp; interactions</h2>' + list(d.precautions) + "</section>" +
      "</div>" +
      '<section class="card"><h2>Organ impairment</h2><dl class="kv">' + kv("Renal", d.renal) + kv("Hepatic", d.hepatic) + "</dl>" +
      '<p class="small muted">General guide only. Check the specific protocol and product information.</p></section>' +
      (d.extravasation ? '<section class="card"><h2>If extravasation happens</h2><p>' + fmt(d.extravasation) + '</p><p class="small"><a href="#/principles/extravasation">General extravasation steps →</a></p></section>' : "") +
      (usedIn.length ? '<section class="card"><h2>Used in these regimens</h2><div class="reg-list">' + usedIn.map(regimenItem).join("") + "</div></section>" : "");
  }

  function kv(k, v) {
    if (!v) return "";
    return "<dt>" + esc(k) + "</dt><dd>" + fmt(v) + "</dd>";
  }

  function topicIndex(kind) {
    const isSup = kind === "supportive";
    const items = isSup ? ONCO.supportive : ONCO.principles;
    setTitle(isSup ? "Prophylaxis & supportive care" : "Principles of administration");
    setActiveNav(kind);
    main.innerHTML =
      '<div class="page-head"><h1>' + (isSup ? "Prophylaxis &amp; supportive care" : "Principles of chemotherapy administration") + "</h1>" +
      '<p class="muted">' + (isSup ? "What to prescribe to prevent complications: antiemetics, growth factors, anti-infectives, TLS prevention and more." : "Safe prescribing, checking, giving and monitoring of anticancer drugs.") + "</p></div>" +
      '<div class="grid">' +
      items.map((t) => '<a class="tile" href="#/' + kind + "/" + esc(t.id) + '"><h2>' + esc(t.title) + "</h2><p>" + esc(t.summary) + "</p></a>").join("") +
      "</div>";
  }

  // Tables built from regimen data so they never drift from the regimen pages.
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

  function renderSections(sections) {
    return (sections || [])
      .map((s) => {
        let h = "";
        if (s.heading) h += "<h2>" + esc(s.heading) + "</h2>";
        if (s.auto) h += autoTable(s.auto);
        if (s.callout) h += '<div class="callout ' + esc(s.callout.type || "info") + '">' + fmt(s.callout.text) + "</div>";
        (s.body || []).forEach((p) => (h += "<p>" + fmt(p) + "</p>"));
        if (s.bullets) h += list(s.bullets);
        if (s.steps) h += "<ol>" + s.steps.map((x) => "<li>" + fmt(x) + "</li>").join("") + "</ol>";
        if (s.table) {
          h +=
            '<div class="table-wrap"><table><thead><tr>' + s.table.head.map((c) => "<th>" + esc(c) + "</th>").join("") + "</tr></thead><tbody>" +
            s.table.rows.map((row) => "<tr>" + row.map((c) => "<td>" + fmt(c) + "</td>").join("") + "</tr>").join("") +
            "</tbody></table></div>";
        }
        return h;
      })
      .join("");
  }

  function viewTopic(kind, id) {
    const items = kind === "supportive" ? ONCO.supportive : ONCO.principles;
    const t = items.find((x) => x.id === id);
    if (!t) return viewNotFound();
    setTitle(t.title);
    setActiveNav(kind);
    const tagged = ONCO.regimens.filter((r) => (r.tags || []).indexOf(id) >= 0).sort((a, b) => a.name.localeCompare(b.name));
    main.innerHTML =
      '<div class="page-head"><div class="crumbs"><a href="#/' + kind + '">' + (kind === "supportive" ? "Prophylaxis &amp; supportive care" : "Principles") + "</a></div>" +
      "<h1>" + esc(t.title) + '</h1><p class="muted">' + esc(t.summary) + "</p></div>" +
      '<article class="card article">' + renderSections(t.sections) + "</article>" +
      (tagged.length ? '<section class="card"><h2>Regimens that need this</h2><div class="reg-list">' + tagged.map(regimenItem).join("") + "</div></section>" : "") +
      refs(t.references);
  }

  function viewCalculators() {
    setTitle("Calculators");
    setActiveNav("calculators");
    main.innerHTML =
      '<div class="page-head"><h1>Calculators</h1><p class="muted">Values are not saved. Always double-check before prescribing.</p></div>' +
      '<section class="card"><h2>BSA, kidney function and carboplatin</h2>' + patientForm("std") +
      '<h3>Carboplatin dose (Calvert)</h3><div class="calc-form"><label>Target AUC<input id="auc" type="number" step="0.5" min="1" max="8" value="5"></label></div>' +
      '<div class="results" id="carbo-results"></div>' +
      '<p class="small muted">Dose (mg) = AUC × (GFR + 25). GFR is capped at 125 mL/min, so the maximum dose is AUC × 150 mg (e.g. 750 mg for AUC 5). eviQ (ADDIKD) prefers de-indexed CKD-EPI eGFR or measured GFR; many US centres use Cockcroft–Gault.</p>' +
      "</section>" +
      '<section class="card"><h2>Absolute neutrophil count (ANC)</h2><div class="calc-form" id="anc-form">' +
      '<label>WBC (×10⁹/L)<input name="wbc" type="number" step="0.01" min="0"></label>' +
      '<label>Neutrophils (segs) %<input name="segs" type="number" step="0.1" min="0" max="100"></label>' +
      '<label>Bands %<input name="bands" type="number" step="0.1" min="0" max="100" value="0"></label>' +
      '</div><div class="results" id="anc-results"></div>' +
      '<p class="small muted">ANC = WBC × (neutrophils % + bands %) / 100. Most solid-tumour protocols need ANC ≥ 1.5 ×10⁹/L and platelets ≥ 100 ×10⁹/L to give chemotherapy on time (check the protocol).</p>' +
      "</section>" +
      '<section class="card"><h2>Dose reduction</h2><div class="calc-form" id="red-form">' +
      '<label>Full dose<input name="full" type="number" step="0.1" min="0"></label>' +
      '<label>Give (% of full dose)<select name="pct"><option>90</option><option>80</option><option selected>75</option><option>60</option><option>50</option><option>25</option></select></label>' +
      '</div><div class="results" id="red-results"></div></section>';

    const form = main.querySelector("#std-form");
    const auc = main.querySelector("#auc");
    const update = () => {
      const p = readPatientForm(form);
      main.querySelector("#std-results").innerHTML = patientResults(p);
      const a = Number(auc.value);
      const dose = ONCO.calc.calvert(a, p.gfrForCarboplatin);
      main.querySelector("#carbo-results").innerHTML =
        resultBox("Carboplatin dose", isFinite(dose) ? Math.round(dose) + " mg" : "—", isFinite(dose) ? "AUC " + a + " × (" + Math.min(p.gfrForCarboplatin, 125).toFixed(0) + " + 25)" : "Needs age, sex, weight, creatinine") +
        resultBox("Maximum for this AUC", isFinite(a) ? Math.round(a * 150) + " mg" : "—", "AUC × 150");
    };
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    auc.addEventListener("input", update);
    update();

    const anc = main.querySelector("#anc-form");
    const updAnc = () => {
      const w = Number(anc.querySelector('[name="wbc"]').value);
      const s = Number(anc.querySelector('[name="segs"]').value);
      const b = Number(anc.querySelector('[name="bands"]').value) || 0;
      const v = (w * (s + b)) / 100;
      let grade = "";
      if (w > 0 && s >= 0) {
        if (v < 0.5) grade = "Severe neutropenia (<0.5)";
        else if (v < 1.0) grade = "Moderate (0.5–<1.0)";
        else if (v < 1.5) grade = "Mild (1.0–<1.5)";
        else grade = "≥1.5";
      }
      main.querySelector("#anc-results").innerHTML = resultBox("ANC", w > 0 ? v.toFixed(2) + " ×10⁹/L" : "—", grade);
    };
    anc.addEventListener("input", updAnc);
    updAnc();

    const red = main.querySelector("#red-form");
    const updRed = () => {
      const full = Number(red.querySelector('[name="full"]').value);
      const pct = Number(red.querySelector('[name="pct"]').value);
      main.querySelector("#red-results").innerHTML = resultBox("Reduced dose", full > 0 ? ONCO.calc.roundDose((full * pct) / 100) : "—", pct + "% of full dose");
    };
    red.addEventListener("input", updRed);
    red.addEventListener("change", updRed);
    updRed();
  }

  function viewFavorites() {
    setTitle("Saved regimens");
    setActiveNav("favorites");
    const regs = favorites().map(regimenById).filter(Boolean);
    main.innerHTML =
      '<div class="page-head"><h1>Saved regimens</h1><p class="muted">Tap ☆ Save on any regimen. Saved on this device only.</p></div>' +
      (regs.length ? '<div class="reg-list">' + regs.map(regimenItem).join("") + "</div>" : '<p class="empty">Nothing saved yet.</p>');
  }

  function viewAbout() {
    setTitle("About & sources");
    setActiveNav("about");
    main.innerHTML =
      '<div class="page-head"><h1>About &amp; sources</h1></div>' +
      '<section class="card"><h2>Important disclaimer</h2>' +
      '<div class="callout danger"><p><strong>This app is a reference aid for qualified oncology professionals. It is not a prescribing system and does not replace clinical judgement.</strong></p>' +
      "<p>Doses shown are standard adult starting doses. Before every prescription, check the dose against the current NCCN Guideline, the current eviQ protocol (or your national protocol) and your hospital policy, and adjust for organ function, toxicity and patient factors. Guidelines change; content can contain errors.</p></div>" +
      "<p>Content last reviewed: " + esc(ONCO.meta.contentReviewed) + ". Version " + esc(ONCO.meta.version) + ".</p></section>" +
      '<section class="card"><h2>Main sources</h2><ul class="section-list">' +
      '<li><a href="https://www.nccn.org/guidelines/category_1" target="_blank" rel="noopener">NCCN Clinical Practice Guidelines in Oncology</a> — disease guidelines and supportive care (Antiemesis; Hematopoietic Growth Factors; Prevention and Treatment of Cancer-Related Infections; Management of Immunotherapy-Related Toxicities). Free registration required.</li>' +
      '<li><a href="https://www.nccn.org/compendia-templates/nccn-templates-main" target="_blank" rel="noopener">NCCN Chemotherapy Order Templates</a></li>' +
      '<li><a href="https://www.eviq.org.au" target="_blank" rel="noopener">eviQ Cancer Treatments Online</a> (Cancer Institute NSW) — protocol numbers are given on each regimen page.</li>' +
      '<li>ASCO / ONS / MASCC guidelines: antiemetics, chemotherapy safety standards, dosing in obesity, hepatitis B screening, extravasation.</li>' +
      "<li>Pivotal trials named on each regimen page (e.g. KEYNOTE-522, POLARIX, FLOT4, PRODIGE 24, APL0406, VIALE-A).</li>" +
      "</ul></section>" +
      '<section class="card"><h2>Privacy</h2><p>Nothing you type into the calculators is stored or sent anywhere. Only your saved-regimen list and theme choice are kept on this device.</p></section>' +
      '<section class="card"><h2>Add or correct content</h2><p>All content lives in plain JavaScript files in the <code>data/</code> folder. See <code>CONTRIBUTING.md</code> in the repository for the format.</p></section>';
  }

  // ---------- Search ----------

  function searchText(r) {
    return [r.name, r.shortName, r.group, (r.indications || []).join(" "), uniqueDrugs(r).map(drugName).join(" "), uniqueDrugs(r).map((id) => ((ONCO.drugs[id] || {}).aka || []).join(" ")).join(" ")]
      .join(" ")
      .toLowerCase();
  }

  function buildIndex() {
    const idx = [];
    ONCO.regimens.forEach((r) => idx.push({ type: "Regimen", title: r.name, sub: (r.setting === "inpatient" ? "Inpatient" : "Outpatient") + " · " + r.group, href: "#/regimen/" + r.id, text: searchText(r), boost: (r.shortName || "").toLowerCase() }));
    Object.values(ONCO.drugs).forEach((d) => idx.push({ type: "Drug", title: d.name, sub: d.class, href: "#/drug/" + d.id, text: (d.name + " " + (d.aka || []).join(" ") + " " + d.class).toLowerCase(), boost: d.name.toLowerCase() }));
    ONCO.supportive.forEach((t) => idx.push({ type: "Supportive care", title: t.title, sub: t.summary, href: "#/supportive/" + t.id, text: (t.title + " " + t.summary + " " + (t.keywords || []).join(" ")).toLowerCase(), boost: t.title.toLowerCase() }));
    ONCO.principles.forEach((t) => idx.push({ type: "Principle", title: t.title, sub: t.summary, href: "#/principles/" + t.id, text: (t.title + " " + t.summary + " " + (t.keywords || []).join(" ")).toLowerCase(), boost: t.title.toLowerCase() }));
    return idx;
  }

  let index = null;

  function search(q) {
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
  }

  function viewSearch(query) {
    const q = query.get("q") || "";
    setTitle("Search");
    setActiveNav("");
    const input = document.getElementById("search-input");
    if (document.activeElement !== input) input.value = q;
    const hits = search(q);
    main.innerHTML =
      "<h1>Search</h1>" +
      (q ? '<p class="muted">' + hits.length + " result" + (hits.length === 1 ? "" : "s") + " for “" + esc(q) + "”</p>" : "") +
      '<div class="card search-results" style="padding:0">' +
      (hits.length
        ? hits.map((h) => '<a class="hit" href="' + esc(h.href) + '"><div class="t">' + esc(h.title) + ' <span class="badge neutral">' + esc(h.type) + '</span></div><div class="s">' + esc(h.sub) + "</div></a>").join("")
        : '<p class="empty" style="padding:1rem">No results.</p>') +
      "</div>";
  }

  function viewNotFound() {
    setTitle("Not found");
    main.innerHTML = '<h1>Not found</h1><p>That page does not exist. <a href="#/">Go home</a>.</p>';
  }

  // ---------- Router ----------

  function route() {
    const hash = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = hash.split("?");
    const query = new URLSearchParams(qs || "");
    const parts = path.split("/").filter(Boolean).map(decodeURIComponent);

    const searchInput = document.getElementById("search-input");
    if (parts[0] !== "search" && document.activeElement !== searchInput) searchInput.value = "";

    switch (parts[0]) {
      case undefined:
        viewHome();
        break;
      case "regimens":
        viewRegimens(query);
        break;
      case "regimen":
        viewRegimen(parts[1]);
        break;
      case "drugs":
        viewDrugs(query);
        break;
      case "drug":
        viewDrug(parts[1]);
        break;
      case "supportive":
      case "principles":
        if (parts[1]) viewTopic(parts[0], parts[1]);
        else topicIndex(parts[0]);
        break;
      case "calculators":
        viewCalculators();
        break;
      case "favorites":
        viewFavorites();
        break;
      case "about":
        viewAbout();
        break;
      case "search":
        viewSearch(query);
        break;
      default:
        viewNotFound();
    }
  }

  function debounce(fn, ms) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  // ---------- Boot ----------

  function initTheme() {
    const saved = storage.get("onco.theme", null);
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    document.getElementById("theme-toggle").addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      storage.set("onco.theme", next);
    });
  }

  function initDisclaimer() {
    const bar = document.getElementById("disclaimer-bar");
    if (!storage.get("onco.disclaimerOk", false)) bar.hidden = false;
    document.getElementById("disclaimer-ok").addEventListener("click", () => {
      storage.set("onco.disclaimerOk", true);
      bar.hidden = true;
    });
  }

  function initSearch() {
    const input = document.getElementById("search-input");
    const form = document.getElementById("search-form");
    const run = debounce(() => {
      const q = input.value.trim();
      if (!q) {
        if (location.hash.indexOf("#/search") === 0) location.hash = "#/";
        return;
      }
      const target = "#/search?q=" + encodeURIComponent(q);
      if (location.hash.indexOf("#/search") === 0) {
        history.replaceState(null, "", target);
        route();
      } else location.hash = target;
    }, 200);
    input.addEventListener("input", run);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const hits = search(input.value.trim());
      if (hits.length) location.hash = hits[0].href;
    });
  }

  window.addEventListener("hashchange", () => {
    route();
    if (location.hash.indexOf("#/search") !== 0) window.scrollTo(0, 0);
  });

  initTheme();
  initDisclaimer();
  initSearch();
  route();

  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();

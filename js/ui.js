/*
 * Shared UI helpers and in-memory state, used by all view files.
 */
(function () {
  "use strict";

  const ONCO = window.ONCO;
  const V = ONCO.vocab;
  const ui = (ONCO.ui = {});
  ONCO.views = ONCO.views || {};

  // Values typed by the user. Kept in memory only (never saved), except where noted.
  ui.state = {
    patient: {
      heightCm: "", weightKg: "", age: "", sex: "M", scr: "", scrUnit: "mgdl", gfrMethod: "cg", measuredGfr: "", floorScr: true,
      bili: "", biliUnit: "mgdl", biliUln: "", ast: "", astUln: "", alp: "", alpUln: "",
    },
    calcOpen: false,
    calendarStart: "",
    calendarCycles: "",
    order: { name: "", mrn: "", dob: "", diagnosis: "", cycle: "1", of: "", date: "", allergies: "", prescriber: "", anc: "1.5", plt: "100", labDate: "", pct: {} },
    cumulative: { rows: [], risk: {}, bsa: "", planReg: "", planCycles: "" },
  };

  ui.storage = {
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

  ui.esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };
  const esc = ui.esc;

  // Minimal inline formatting: **bold** and [text](url)
  ui.fmt = function (s) {
    let out = esc(s);
    out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, text, url) {
      const ext = /^https?:/i.test(url);
      return '<a href="' + url + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + text + "</a>";
    });
    return out;
  };
  const fmt = ui.fmt;

  ui.list = function (items, cls) {
    if (!items || !items.length) return "";
    return '<ul class="section-list ' + (cls || "") + '">' + items.map((i) => "<li>" + fmt(i) + "</li>").join("") + "</ul>";
  };

  ui.unitLabel = function (u) {
    return V.units[u] || u;
  };

  ui.fmtNum = function (n) {
    return Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  ui.doseText = function (entry) {
    if (entry.dose === undefined || entry.dose === null) return entry.doseNote ? fmt(entry.doseNote) : "—";
    const d = Array.isArray(entry.dose) ? entry.dose.map(ui.fmtNum).join("–") : ui.fmtNum(entry.dose);
    const main = entry.unit === "AUC" ? "AUC " + d : d + " " + ui.unitLabel(entry.unit);
    let s = '<span class="dose">' + esc(main) + "</span>";
    if (typeof entry.cap === "number") s += ' <span class="muted small nowrap">(max ' + ui.fmtNum(entry.cap) + (entry.unit === "units/m2" || entry.unit === "units" ? " units" : " mg") + ")</span>";
    if (entry.doseNote) s += '<div class="small muted">' + fmt(entry.doseNote) + "</div>";
    return s;
  };

  ui.drugName = function (id) {
    const d = ONCO.drugs[id];
    return d ? d.name : id;
  };

  ui.drugLink = function (id, label) {
    const d = ONCO.drugs[id];
    if (!d) return esc(label || id);
    return '<a href="#/drug/' + esc(id) + '">' + esc(label || d.name) + "</a>";
  };

  // Short names for calendar cells.
  const SHORT = {
    "arsenic-trioxide": "ATO", atezolizumab: "Atezo", azacitidine: "Aza", bendamustine: "Benda", bleomycin: "Bleo", bortezomib: "Bortez",
    capecitabine: "Cape", carboplatin: "Carbo", cisplatin: "Cis", cyclophosphamide: "Cyclo", cytarabine: "Ara-C", dacarbazine: "DTIC",
    daunorubicin: "Dauno", dexamethasone: "Dex", docetaxel: "Doce", doxorubicin: "Doxo", durvalumab: "Durva", etoposide: "Etop",
    filgrastim: "G-CSF", fludarabine: "Flu", fluorouracil: "5-FU", gemcitabine: "Gem", idarubicin: "Ida", ifosfamide: "Ifos",
    irinotecan: "Irino", lenalidomide: "Len", leucovorin: "LV", mesna: "Mesna", methotrexate: "MTX", methylprednisolone: "MP",
    "nab-paclitaxel": "nab-P", oxaliplatin: "Oxali", paclitaxel: "Pacli", pembrolizumab: "Pembro", pemetrexed: "Pem", pertuzumab: "Pertuz",
    polatuzumab: "Pola", prednisolone: "Pred", rituximab: "Ritux", temozolomide: "TMZ", thiotepa: "Thiotepa", trastuzumab: "Trastuz",
    "trastuzumab-emtansine": "T-DM1", tretinoin: "ATRA", venetoclax: "Ven", vinblastine: "Vinbl", vincristine: "VCR", vinorelbine: "Vinor",
  };
  ui.shortName = function (id) {
    return SHORT[id] || ui.drugName(id);
  };

  ui.settingBadge = function (s) {
    return '<span class="badge ' + (s === "inpatient" ? "in" : "out") + '">' + (s === "inpatient" ? "Inpatient" : "Outpatient") + "</span>";
  };

  ui.emetoBadge = function (e) {
    if (!e) return "";
    return '<a class="badge ' + esc(e) + '" href="#/supportive/antiemetic" title="Emetogenic risk">Emetic risk: ' + esc(e) + "</a>";
  };

  ui.fnBadge = function (f) {
    if (!f) return "";
    const label = f === "expected" ? "Profound neutropenia" : "FN risk: " + f;
    return '<a class="badge ' + esc(f) + '" href="#/supportive/gcsf" title="' + esc(V.fnRisk[f] || "") + '">' + esc(label) + "</a>";
  };

  ui.severityBadge = function (sev) {
    const cls = sev === "avoid" ? "danger" : sev === "major" ? "warn" : sev === "moderate" ? "low" : "neutral";
    return '<span class="badge ' + cls + '">' + esc(ONCO.interactions.SEVERITY_LABEL[sev]) + "</span>";
  };

  ui.favorites = function () {
    return ui.storage.get("onco.favorites", []);
  };

  ui.toggleFavorite = function (id) {
    const f = ui.favorites();
    const i = f.indexOf(id);
    if (i >= 0) f.splice(i, 1);
    else f.push(id);
    ui.storage.set("onco.favorites", f);
    return i < 0;
  };

  ui.regimenById = function (id) {
    return ONCO.regimens.find((r) => r.id === id);
  };

  // Tags can point at a supportive-care topic or a principles topic.
  ui.topicHref = function (id) {
    if (ONCO.supportive.some((t) => t.id === id)) return "#/supportive/" + id;
    if (ONCO.principles.some((t) => t.id === id)) return "#/principles/" + id;
    return "#/supportive";
  };

  ui.uniqueDrugs = function (r) {
    const seen = [];
    r.drugs.forEach((d) => {
      if (seen.indexOf(d.drug) < 0) seen.push(d.drug);
    });
    return seen;
  };

  ui.groupsFor = function (regs) {
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
  };

  ui.regimenItem = function (r) {
    const drugs = ui.uniqueDrugs(r).map(ui.drugName).join(", ");
    return (
      '<a class="reg-item" href="#/regimen/' + esc(r.id) + '">' +
      '<div class="title">' + esc(r.name) + "</div>" +
      '<div class="sub">' + esc(drugs) + "</div>" +
      '<div class="badges">' + ui.settingBadge(r.setting) + '<span class="badge neutral">' + esc(r.group) + "</span>" + ui.emetoBadge(r.emetogenic) + ui.fnBadge(r.fnRisk) + "</div>" +
      "</a>"
    );
  };

  ui.setTitle = function (t) {
    document.title = t ? t + " · OncoRegimens" : "OncoRegimens";
  };

  ui.setActiveNav = function (key) {
    document.querySelectorAll(".mainnav a").forEach((a) => {
      a.classList.toggle("active", a.dataset.nav === key);
    });
  };

  ui.refs = function (references) {
    if (!references || !references.length) return "";
    return (
      '<section class="card"><h2>Sources</h2><ul class="section-list">' +
      references.map((r) => "<li>" + (r.url ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.label) + "</a>" : esc(r.label)) + "</li>").join("") +
      "</ul></section>"
    );
  };

  ui.kv = function (k, v) {
    if (!v) return "";
    return "<dt>" + esc(k) + "</dt><dd>" + fmt(v) + "</dd>";
  };

  ui.fact = function (k, v) {
    if (!v) return "";
    return '<div class="fact"><div class="k">' + esc(k) + '</div><div class="v">' + esc(v) + "</div></div>";
  };

  ui.debounce = function (fn, ms) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  };

  ui.resultBox = function (k, v, s) {
    return '<div class="result"><div class="k">' + esc(k) + '</div><div class="v">' + v + "</div>" + (s ? '<div class="s">' + esc(s) + "</div>" : "") + "</div>";
  };

  // ---------- Patient measurement form (shared by regimen calculator, calculators page, order sheet) ----------

  function opt(value, label, current) {
    return '<option value="' + value + '"' + (current === value ? " selected" : "") + ">" + label + "</option>";
  }

  ui.patientForm = function (idPrefix) {
    const p = ui.state.patient;
    const num = (name, label, attrs) => '<label>' + label + '<input name="' + name + '" type="number" inputmode="decimal" ' + (attrs || "") + ' value="' + esc(p[name]) + '"></label>';
    return (
      '<form class="calc-form" id="' + idPrefix + '-form" onsubmit="return false">' +
      '<div class="form-group-title">Body and kidneys</div>' +
      num("heightCm", "Height (cm)", 'min="50" max="250"') +
      num("weightKg", "Weight (kg)", 'min="10" max="350"') +
      num("age", "Age (years)", 'min="16" max="110"') +
      '<label>Sex<select name="sex">' + opt("M", "Male", p.sex) + opt("F", "Female", p.sex) + "</select></label>" +
      num("scr", "Serum creatinine", 'step="0.01" min="0"') +
      '<label>Creatinine unit<select name="scrUnit">' + opt("mgdl", "mg/dL", p.scrUnit) + opt("umol", "µmol/L", p.scrUnit) + "</select></label>" +
      '<label>Kidney function used<select name="gfrMethod">' + opt("cg", "Cockcroft–Gault CrCl", p.gfrMethod) + opt("ckdepi", "CKD-EPI, de-indexed (eviQ)", p.gfrMethod) + opt("measured", "Measured GFR", p.gfrMethod) + "</select></label>" +
      num("measuredGfr", "Measured GFR (mL/min)", 'min="0"') +
      '<label class="check"><input name="floorScr" type="checkbox"' + (p.floorScr ? " checked" : "") + "> Round creatinine below 0.7 mg/dL (62 µmol/L) up to 0.7 for GFR estimates (common safety practice)</label>" +
      '<div class="form-group-title">Liver (optional — for liver dose adjustments)</div>' +
      num("bili", "Bilirubin", 'step="0.1" min="0"') +
      '<label>Bilirubin unit<select name="biliUnit">' + opt("mgdl", "mg/dL", p.biliUnit) + opt("umol", "µmol/L", p.biliUnit) + "</select></label>" +
      num("biliUln", "Bilirubin ULN", 'step="0.1" min="0" placeholder="' + (p.biliUnit === "umol" ? "21" : "1.2") + '"') +
      num("ast", "AST or ALT (higher, U/L)", 'min="0"') +
      num("astUln", "AST/ALT ULN", 'min="0" placeholder="40"') +
      num("alp", "ALP (U/L)", 'min="0"') +
      num("alpUln", "ALP ULN", 'min="0" placeholder="120"') +
      "</form>" +
      '<div class="results" id="' + idPrefix + '-results"></div>'
    );
  };

  ui.readPatientForm = function (form) {
    const fd = new FormData(form);
    const g = (k, d) => (fd.get(k) === null ? d : fd.get(k));
    ui.state.patient = {
      heightCm: g("heightCm", ""), weightKg: g("weightKg", ""), age: g("age", ""), sex: g("sex", "M"), scr: g("scr", ""), scrUnit: g("scrUnit", "mgdl"),
      gfrMethod: g("gfrMethod", "cg"), measuredGfr: g("measuredGfr", ""), floorScr: fd.get("floorScr") === "on",
      bili: g("bili", ""), biliUnit: g("biliUnit", "mgdl"), biliUln: g("biliUln", ""), ast: g("ast", ""), astUln: g("astUln", ""), alp: g("alp", ""), alpUln: g("alpUln", ""),
    };
    return ONCO.calc.patientFromInput(ui.state.patient);
  };

  ui.currentPatient = function () {
    return ONCO.calc.patientFromInput(ui.state.patient);
  };

  ui.patientResults = function (p) {
    const f = (x, d) => (isFinite(x) && x > 0 ? x.toFixed(d) : "—");
    const r = [];
    r.push(ui.resultBox("BSA (Mosteller)", f(p.bsa, 2) + " m²"));
    r.push(ui.resultBox("BMI", f(p.bmi, 1), p.bmi >= 30 ? "Obese: ASCO advises full weight-based dosing" : ""));
    r.push(ui.resultBox("CrCl (Cockcroft–Gault)", f(p.crcl, 0) + " mL/min", p.bmi >= 30 ? "uses adjusted body weight" : "uses actual body weight"));
    r.push(ui.resultBox("eGFR CKD-EPI 2021", f(p.egfr, 0), "mL/min/1.73 m²"));
    r.push(ui.resultBox("eGFR de-indexed", f(p.egfrDeindexed, 0) + " mL/min", "eGFR × BSA / 1.73"));
    r.push(ui.resultBox("Kidney function used", f(p.gfrForCarboplatin, 0) + " mL/min", "for dose rules and carboplatin"));
    if (p.liverEntered) {
      const l = p.liver;
      r.push(ui.resultBox("Bilirubin", f(l.biliMgDl, 2) + " mg/dL", isFinite(l.biliXuln) ? l.biliXuln.toFixed(1) + " × ULN" : ""));
      if (isFinite(l.astXuln)) r.push(ui.resultBox("AST/ALT", l.astXuln.toFixed(1) + " × ULN"));
      if (isFinite(l.alpXuln)) r.push(ui.resultBox("ALP", l.alpXuln.toFixed(1) + " × ULN"));
    }
    return r.join("");
  };

  // Dose display for one regimen line. Returns { html, cls, title, result }.
  ui.doseDisplay = function (entry, p) {
    const ready = p.bsa > 0 || p.weightKg > 0;
    if (!ready || entry.dose === undefined || entry.dose === null) return { html: "", cls: "calc" };
    const res = ONCO.calc.finalDose(entry, p);
    const unit = " " + res.outUnit;
    const vals = (v) => v.map(ui.fmtNum).join("–");
    if (res.error) return { html: esc(res.error), cls: "calc err", result: res };
    if (res.avoid) return { html: "Do not give — " + esc(res.reasons.join(" ")), cls: "calc avoid", result: res };
    const adjusted = res.factor !== 1 || res.setDose !== undefined;
    let html = "= " + esc(vals(res.values) + unit) + (res.capped ? " (capped)" : "") + (res.setNote ? " " + esc(res.setNote) : "");
    if (adjusted) html += '<span class="full">full dose ' + esc(vals(res.full) + unit) + "</span>";
    if (res.reasons.length) html += '<span class="why">' + esc(res.reasons.join(" ")) + "</span>";
    const cls = "calc" + (adjusted ? " adjusted" : "") + (res.caution ? " caution" : "") + (res.capped && !adjusted ? " capped" : "");
    return { html: html, cls: cls, result: res, title: res.note || "" };
  };

  ui.formatDate = function (d) {
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };
  ui.shortDate = function (d) {
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  };

  ui.download = function (filename, mime, content) {
    const blob = new Blob([content], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 500);
  };

  // .ics content for a regimen from a start date.
  ui.regimenIcs = function (regimen, start, cycles, who) {
    const events = ONCO.schedule.treatmentDates(regimen, start, cycles).map((t) => {
      const names = [];
      t.items.forEach((it) => {
        const n = ONCO.patient.drugInfo(it.entry.drug).name;
        if (names.indexOf(n) < 0) names.push(n);
      });
      return {
        date: t.date,
        title: "Chemotherapy: " + (regimen.shortName || regimen.name) + " — cycle " + t.cycle + ", day " + t.day,
        description: (who ? who + "\n" : "") + "Treatment: " + names.join(", "),
      };
    });
    return ONCO.schedule.ics(events, (regimen.shortName || regimen.name) + " treatment");
  };

  // QR code as inline SVG (vendored qrcode-generator, MIT).
  ui.qrSvg = function (text) {
    if (typeof window.qrcode !== "function") return "";
    const qr = window.qrcode(0, "M");
    qr.addData(text);
    qr.make();
    return qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true, alt: "QR code" });
  };
})();

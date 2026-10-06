/*
 * Tool views: calculators, printable order sheet, interaction checker, cumulative dose tracker.
 */
(function () {
  "use strict";

  const ONCO = window.ONCO;
  const ui = ONCO.ui;
  const esc = ui.esc;
  const fmt = ui.fmt;
  const main = () => document.getElementById("main");
  const views = ONCO.views;

  // ---------- Calculators ----------

  views.calculators = function () {
    ui.setTitle("Tools & calculators");
    ui.setActiveNav("calculators");
    main().innerHTML =
      '<div class="page-head"><h1>Tools &amp; calculators</h1><p class="muted">Values are not saved. Always double-check before prescribing.</p></div>' +
      '<div class="grid" style="margin-bottom:1rem">' +
      '<a class="tile" href="#/interactions"><h2>Interaction checker</h2><p>Check regimen drugs against the patient\'s other medicines.</p></a>' +
      '<a class="tile" href="#/cumulative"><h2>Cumulative dose tracker</h2><p>Anthracycline and bleomycin lifetime totals.</p></a>' +
      '<a class="tile" href="#/patient-app"><h2>Patient app</h2><p>Create a patient\'s personal treatment page with a QR code.</p></a>' +
      "</div>" +
      '<section class="card"><h2>BSA, kidney and liver function, carboplatin</h2>' + ui.patientForm("std") +
      '<h3>Carboplatin dose (Calvert)</h3><div class="calc-form"><label>Target AUC<input id="auc" type="number" step="0.5" min="1" max="8" value="5"></label></div>' +
      '<div class="results" id="carbo-results"></div>' +
      '<p class="small muted">Dose (mg) = AUC × (GFR + 25). GFR is capped at 125 mL/min, so the maximum dose is AUC × 150 mg. eviQ (ADDIKD) prefers de-indexed CKD-EPI eGFR or measured GFR; many US centres use Cockcroft–Gault.</p>' +
      "</section>" +
      '<section class="card"><h2>Absolute neutrophil count (ANC)</h2><div class="calc-form" id="anc-form">' +
      '<label>WBC (×10⁹/L)<input name="wbc" type="number" step="0.01" min="0"></label>' +
      '<label>Neutrophils (segs) %<input name="segs" type="number" step="0.1" min="0" max="100"></label>' +
      '<label>Bands %<input name="bands" type="number" step="0.1" min="0" max="100" value="0"></label>' +
      '</div><div class="results" id="anc-results"></div>' +
      '<p class="small muted">ANC = WBC × (neutrophils % + bands %) / 100. Most solid-tumour protocols need ANC ≥ 1.5 ×10⁹/L and platelets ≥ 100 ×10⁹/L to treat on time.</p></section>' +
      '<section class="card"><h2>Dose reduction</h2><div class="calc-form" id="red-form">' +
      '<label>Full dose<input name="full" type="number" step="0.1" min="0"></label>' +
      '<label>Give (% of full dose)<select name="pct"><option>90</option><option>80</option><option selected>75</option><option>60</option><option>50</option><option>25</option></select></label>' +
      '</div><div class="results" id="red-results"></div></section>';

    const m = main();
    const form = m.querySelector("#std-form");
    const auc = m.querySelector("#auc");
    const update = () => {
      const p = ui.readPatientForm(form);
      m.querySelector("#std-results").innerHTML = ui.patientResults(p);
      const a = Number(auc.value);
      const dose = ONCO.calc.calvert(a, p.gfrForCarboplatin);
      m.querySelector("#carbo-results").innerHTML =
        ui.resultBox("Carboplatin dose", isFinite(dose) ? Math.round(dose) + " mg" : "—", isFinite(dose) ? "AUC " + a + " × (" + Math.min(p.gfrForCarboplatin, 125).toFixed(0) + " + 25)" : "Needs age, sex, weight, creatinine") +
        ui.resultBox("Maximum for this AUC", isFinite(a) ? Math.round(a * 150) + " mg" : "—", "AUC × 150");
    };
    form.addEventListener("input", update);
    form.addEventListener("change", update);
    auc.addEventListener("input", update);
    update();

    const anc = m.querySelector("#anc-form");
    const updAnc = () => {
      const w = Number(anc.querySelector('[name="wbc"]').value);
      const s = Number(anc.querySelector('[name="segs"]').value);
      const b = Number(anc.querySelector('[name="bands"]').value) || 0;
      const v = (w * (s + b)) / 100;
      let grade = "";
      if (w > 0 && s >= 0) grade = v < 0.5 ? "Severe neutropenia (<0.5)" : v < 1.0 ? "Moderate (0.5–<1.0)" : v < 1.5 ? "Mild (1.0–<1.5)" : "≥1.5";
      m.querySelector("#anc-results").innerHTML = ui.resultBox("ANC", w > 0 ? v.toFixed(2) + " ×10⁹/L" : "—", grade);
    };
    anc.addEventListener("input", updAnc);
    updAnc();

    const red = m.querySelector("#red-form");
    const updRed = () => {
      const full = Number(red.querySelector('[name="full"]').value);
      const pct = Number(red.querySelector('[name="pct"]').value);
      m.querySelector("#red-results").innerHTML = ui.resultBox("Reduced dose", full > 0 ? ONCO.calc.roundDose((full * pct) / 100) : "—", pct + "% of full dose");
    };
    red.addEventListener("input", updRed);
    red.addEventListener("change", updRed);
    updRed();
  };

  // ---------- Order sheet ----------

  function orderField(name, label, type) {
    return '<label>' + esc(label) + '<input name="' + name + '" type="' + (type || "text") + '" value="' + esc(ui.state.order[name]) + '"></label>';
  }

  function sheetHtml(r, p) {
    const o = ui.state.order;
    const ready = p.bsa > 0 || p.weightKg > 0;
    const f = (x, d) => (isFinite(x) && x > 0 ? x.toFixed(d) : "____");
    const blank = (v) => (v ? esc(v) : '<span class="blank"></span>');
    const today = new Date();
    let lastPhase = null;
    const alerts = [];
    const rows = r.drugs
      .map((d, i) => {
        let phaseRow = "";
        if (d.phase && d.phase !== lastPhase) {
          phaseRow = '<tr class="phase"><td colspan="8">' + esc(d.phase) + "</td></tr>";
          lastPhase = d.phase;
        }
        let full = "—";
        let rule = "";
        let final = "—";
        let pctCell = "";
        if (d.dose !== undefined && ready) {
          const res = ONCO.calc.finalDose(d, p);
          if (res.error) full = esc(res.error);
          else {
            const unit = " " + res.outUnit;
            full = esc(res.full.map(ui.fmtNum).join("–") + unit) + (res.capped && res.factor === 1 ? " (cap)" : "");
            if (res.avoid) {
              rule = '<strong class="txt-danger">DO NOT GIVE</strong><div class="small">' + esc(res.reasons.join(" ")) + "</div>";
              final = '<strong class="txt-danger">0</strong>';
              alerts.push((d.label || ui.drugName(d.drug)) + ": do not give — " + res.reasons.join(" "));
            } else {
              const adjusted = res.factor !== 1 || res.setDose !== undefined;
              rule = adjusted ? esc(res.reasons.join(" ")) : res.reasons.length ? '<span class="small">' + esc(res.reasons.join(" ")) + "</span>" : "—";
              if (res.reasons.length) alerts.push((d.label || ui.drugName(d.drug)) + ": " + res.reasons.join(" "));
              const pct = Number(o.pct[i] === undefined ? 100 : o.pct[i]) || 0;
              final = "<strong>" + esc(res.values.map((v) => ui.fmtNum(ONCO.calc.roundDose((v * pct) / 100))).join("–") + unit) + "</strong>" + (res.setNote ? '<div class="small">' + esc(res.setNote) + "</div>" : "");
              pctCell = '<span class="nowrap"><input class="pct" type="number" min="0" max="100" step="5" data-pct="' + i + '" value="' + esc(o.pct[i] === undefined ? 100 : o.pct[i]) + '" aria-label="Percent of dose">%</span>';
            }
          }
        } else if (d.dose === undefined) {
          full = fmt(d.doseNote || "");
        }
        return (
          phaseRow +
          '<tr><td data-label="Day(s)">' + fmt(d.days) + '</td><td data-label="Drug"><strong>' + esc(d.label || ui.drugName(d.drug)) + '</strong></td><td data-label="Dose">' + ui.doseText(d) +
          '</td><td data-label="Calculated">' + full + '</td><td data-label="Kidney/liver/age">' + rule + '</td><td data-label="% given">' + pctCell + '</td><td data-label="Final dose">' + final +
          '</td><td data-label="Route / administration">' + esc(d.route) + '<div class="small">' + fmt(d.admin || "") + "</div></td></tr>"
        );
      })
      .join("");
    const methodLabel = { cg: "Cockcroft–Gault CrCl", ckdepi: "CKD-EPI (de-indexed)", measured: "measured GFR" }[p.gfrMethod];
    const eviq = (r.references || []).find((x) => /eviQ/.test(x.label));
    return (
      '<div class="sheet-head"><div><div class="sheet-title">CHEMOTHERAPY ORDER</div><div class="sheet-reg">' + esc(r.name) + "</div>" +
      '<div class="small">' + (r.setting === "inpatient" ? "Inpatient" : "Outpatient") + " · " + esc(r.cycle.length) + " · " + esc(r.intent) + "</div></div>" +
      '<div class="sheet-box"><div>Cycle <strong>' + blank(o.cycle) + "</strong> of <strong>" + blank(o.of) + "</strong></div><div>Planned date: <strong>" + blank(o.date) + "</strong></div></div></div>" +
      '<table class="sheet-grid"><tr><th>Patient name</th><td>' + blank(o.name) + "</td><th>MRN / ID</th><td>" + blank(o.mrn) + "</td></tr>" +
      "<tr><th>Date of birth</th><td>" + blank(o.dob) + "</td><th>Diagnosis</th><td>" + blank(o.diagnosis) + "</td></tr>" +
      "<tr><th>Allergies</th><td colspan=\"3\">" + blank(o.allergies) + "</td></tr></table>" +
      '<table class="sheet-grid"><tr><th>Height</th><td>' + f(p.heightCm, 0) + " cm</td><th>Weight</th><td>" + f(p.weightKg, 1) + " kg</td><th>BSA</th><td><strong>" + f(p.bsa, 2) + " m²</strong></td></tr>" +
      "<tr><th>Creatinine</th><td>" + (ui.state.patient.scr ? esc(ui.state.patient.scr) + " " + (ui.state.patient.scrUnit === "umol" ? "µmol/L" : "mg/dL") : "____") + "</td><th>Kidney function</th><td>" + f(p.gfrForCarboplatin, 0) + " mL/min <span class=\"small\">(" + esc(methodLabel) + ")</span></td><th>Age / sex</th><td>" + (p.age || "__") + " / " + p.sex + "</td></tr>" +
      "<tr><th>Bilirubin</th><td>" + (ui.state.patient.bili ? esc(ui.state.patient.bili) + " " + (ui.state.patient.biliUnit === "umol" ? "µmol/L" : "mg/dL") : "____") + "</td><th>AST/ALT</th><td>" + (ui.state.patient.ast ? esc(ui.state.patient.ast) + " U/L" : "____") + "</td><th>Labs dated</th><td>" + blank(o.labDate) + "</td></tr></table>" +
      '<div class="sheet-criteria"><strong>Proceed only if:</strong> ANC ≥ ' + esc(o.anc) + " ×10⁹/L and platelets ≥ " + esc(o.plt) + " ×10⁹/L, organ function acceptable, and toxicity reviewed. " +
      '<span class="small">' + fmt((r.monitoring || [])[0] || "") + "</span></div>" +
      (alerts.length ? '<div class="sheet-alert"><strong>Dose adjustments for this patient:</strong><ul>' + alerts.map((a) => "<li>" + esc(a) + "</li>").join("") + "</ul></div>" : "") +
      "<h3>Premedication</h3>" + ui.list(r.premeds) +
      '<h3>Anticancer drugs</h3><div class="table-wrap"><table class="sheet-drugs"><thead><tr><th>Day(s)</th><th>Drug</th><th>Protocol dose</th><th>Calculated</th><th>Kidney / liver / age</th><th>% given</th><th>Final dose</th><th>Route / administration</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
      (r.order && r.order.length ? '<p class="small"><strong>Order:</strong> ' + esc(r.order.join(" → ")) + "</p>" : "") +
      "<h3>Take-home medicines and prophylaxis</h3>" + ui.list(r.takeHome) +
      '<table class="sheet-sign"><tr><th>Prescriber</th><td>' + blank(o.prescriber) + '</td><th>Signature</th><td></td><th>Date</th><td></td></tr>' +
      "<tr><th>Pharmacist verified</th><td></td><th>Signature</th><td></td><th>Date</th><td></td></tr>" +
      "<tr><th>Nurse check 1</th><td></td><th>Nurse check 2</th><td></td><th>Time</th><td></td></tr></table>" +
      '<p class="small muted">Generated by OncoRegimens on ' + esc(ui.formatDate(today)) + ". Reference aid — verify every dose against the current protocol" + (eviq ? " (" + esc(eviq.label) + ")" : "") + " and local policy.</p>"
    );
  }

  views.order = function (id) {
    const r = ui.regimenById(id);
    if (!r) return views.notFound();
    ui.setTitle("Order sheet — " + (r.shortName || r.name));
    ui.setActiveNav(r.setting);
    main().innerHTML =
      '<div class="page-head no-print"><div class="crumbs"><a href="#/regimen/' + esc(r.id) + '">' + esc(r.shortName || r.name) + "</a> › Order sheet</div>" +
      '<h1>Chemotherapy order sheet</h1><div class="head-actions"><button class="btn primary" type="button" onclick="window.print()">Print order</button><a class="btn" href="#/regimen/' + esc(r.id) + '">Back to regimen</a></div>' +
      '<p class="muted">Enter the patient\'s measurements and details. Doses include the kidney, liver and age rules. Use "% given" for extra reductions (e.g. 80% after toxicity). Nothing is saved.</p></div>' +
      '<section class="card no-print"><h2>Patient measurements</h2>' + ui.patientForm("ord") + "</section>" +
      '<section class="card no-print"><h2>Order details</h2><form class="calc-form" id="ord-details" onsubmit="return false">' +
      orderField("name", "Patient name") + orderField("mrn", "MRN / ID") + orderField("dob", "Date of birth", "date") + orderField("diagnosis", "Diagnosis") +
      orderField("cycle", "Cycle number", "number") + orderField("of", "Total cycles", "number") + orderField("date", "Planned date", "date") + orderField("allergies", "Allergies") +
      orderField("prescriber", "Prescriber") + orderField("labDate", "Labs dated", "date") + orderField("anc", "Proceed if ANC ≥ (×10⁹/L)", "number") + orderField("plt", "Proceed if platelets ≥ (×10⁹/L)", "number") +
      "</form></section>" +
      '<div class="order-sheet card" id="sheet"></div>';

    const m = main();
    const pform = m.querySelector("#ord-form");
    const dform = m.querySelector("#ord-details");
    const render = () => {
      const p = ui.readPatientForm(pform);
      m.querySelector("#ord-results").innerHTML = ui.patientResults(p);
      const fd = new FormData(dform);
      Object.keys(ui.state.order).forEach((k) => {
        if (k !== "pct" && fd.get(k) !== null) ui.state.order[k] = fd.get(k);
      });
      m.querySelector("#sheet").innerHTML = sheetHtml(r, p);
    };
    pform.addEventListener("input", render);
    pform.addEventListener("change", render);
    dform.addEventListener("input", render);
    m.querySelector("#sheet").addEventListener("change", (e) => {
      const i = e.target.dataset && e.target.dataset.pct;
      if (i === undefined) return;
      ui.state.order.pct[i] = Math.max(0, Math.min(100, Number(e.target.value) || 0));
      // Redraw after the current event finishes (the input may be losing focus).
      setTimeout(render, 0);
    });
    if (!ui.state.order.of) ui.state.order.of = String(ONCO.schedule.defaultCycles(r));
    m.querySelector('#ord-details [name="of"]').value = ui.state.order.of;
    render();
  };

  // ---------- Interaction checker ----------

  views.interactions = function (query) {
    ui.setTitle("Interaction checker");
    ui.setActiveNav("interactions");
    const I = ONCO.interactions;
    const all = I.items();
    let ids = (query.get("ids") || "").split(",").filter((x) => x && all.some((i) => i.id === x));
    const reg = ui.regimenById(query.get("reg") || "");
    if (reg) ui.uniqueDrugs(reg).forEach((d) => { if (ids.indexOf(d) < 0) ids.push(d); });

    main().innerHTML =
      '<div class="page-head"><h1>Interaction checker</h1><p class="muted">Add the regimen drugs and the patient\'s other medicines. Covers the interactions most relevant to the regimens in this app — it is <strong>not</strong> a complete interaction database.</p></div>' +
      '<section class="card"><div class="filters">' +
      '<div class="ix-search"><input id="ix-q" type="text" placeholder="Type a medicine (e.g. posaconazole, warfarin, omeprazole)" autocomplete="off" aria-label="Add a medicine"><div id="ix-suggest" class="suggest"></div></div>' +
      '<select id="ix-reg"><option value="">Add all drugs from a regimen…</option>' + ONCO.regimens.slice().sort((a, b) => a.name.localeCompare(b.name)).map((r) => '<option value="' + esc(r.id) + '">' + esc(r.shortName || r.name) + "</option>").join("") + "</select>" +
      '<button class="btn small" type="button" id="ix-clear">Clear</button></div>' +
      '<div class="tags" id="ix-chips"></div></section>' +
      '<section class="card" id="ix-results"></section>';

    const m = main();
    const q = m.querySelector("#ix-q");
    const sug = m.querySelector("#ix-suggest");

    function sync() {
      history.replaceState(null, "", "#/interactions" + (ids.length ? "?ids=" + ids.join(",") : ""));
      m.querySelector("#ix-chips").innerHTML = ids.map((id) => '<span class="chip big">' + esc(I.name(id)) + ' <button type="button" data-remove="' + esc(id) + '" aria-label="Remove">×</button></span>').join("") || '<span class="muted">No medicines added yet.</span>';
      const res = I.check(ids);
      m.querySelector("#ix-results").innerHTML =
        "<h2>Results</h2>" +
        (ids.length < 2
          ? '<p class="muted">Add at least two medicines.</p>'
          : res.length
            ? '<ul class="ix-list">' + res.map((p) => "<li>" + ui.severityBadge(p.rule.severity) + " <strong>" + esc(I.name(p.x)) + " + " + esc(I.name(p.y)) + "</strong><div>" + esc(p.rule.effect) + '</div><div class="muted">' + esc(p.rule.action) + "</div></li>").join("") + "</ul>"
            : '<p class="callout ok">No interactions found in this app\'s list. Check a full interaction resource and the product information.</p>');
    }

    function add(id) {
      if (ids.indexOf(id) < 0) ids.push(id);
      q.value = "";
      sug.innerHTML = "";
      sync();
    }

    q.addEventListener("input", () => {
      const t = q.value.trim().toLowerCase();
      if (!t) {
        sug.innerHTML = "";
        return;
      }
      const hits = all.filter((i) => (i.name + " " + i.aka.join(" ")).toLowerCase().indexOf(t) >= 0 && ids.indexOf(i.id) < 0).slice(0, 8);
      sug.innerHTML = hits.map((h) => '<button type="button" data-add="' + esc(h.id) + '">' + esc(h.name) + ' <span class="muted small">' + (h.kind === "drug" ? "regimen drug" : "other medicine") + "</span></button>").join("") || '<div class="muted small" style="padding:.4rem">Not in the list.</div>';
    });
    q.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const first = sug.querySelector("[data-add]");
        if (first) add(first.dataset.add);
      }
    });
    sug.addEventListener("click", (e) => {
      const b = e.target.closest("[data-add]");
      if (b) add(b.dataset.add);
    });
    m.querySelector("#ix-chips").addEventListener("click", (e) => {
      const b = e.target.closest("[data-remove]");
      if (!b) return;
      ids = ids.filter((x) => x !== b.dataset.remove);
      sync();
    });
    m.querySelector("#ix-reg").addEventListener("change", (e) => {
      const r = ui.regimenById(e.target.value);
      if (r) ui.uniqueDrugs(r).forEach((d) => { if (ids.indexOf(d) < 0) ids.push(d); });
      e.target.value = "";
      sync();
    });
    m.querySelector("#ix-clear").addEventListener("click", () => {
      ids = [];
      sync();
    });
    sync();
  };

  // ---------- Cumulative dose tracker ----------

  views.cumulative = function () {
    ui.setTitle("Cumulative dose tracker");
    ui.setActiveNav("calculators");
    const C = ONCO.cumulative;
    const st = ui.state.cumulative;
    const pBsa = ui.currentPatient().bsa;
    if (!st.bsa && pBsa > 0) st.bsa = pBsa.toFixed(2);
    const regs = C.regimens().sort((a, b) => a.name.localeCompare(b.name));
    const regOptions = (sel) => '<option value="">Choose regimen…</option>' + regs.map((r) => '<option value="' + esc(r.id) + '"' + (r.id === sel ? " selected" : "") + ">" + esc(r.shortName || r.name) + "</option>").join("");
    const agentOptions = (sel) => C.TRACKED.map((id) => '<option value="' + id + '"' + (id === sel ? " selected" : "") + ">" + esc(C.AGENTS[id].name) + " (" + C.AGENTS[id].unit + ")</option>").join("");
    const RISKS = [["rt", "Chest / mediastinal radiotherapy"], ["heart", "Heart disease or LVEF < 55%"], ["age", "Age ≥ 65 years"], ["her2", "HER2-targeted therapy"], ["htn", "Hypertension, diabetes or other CV risk factors"]];

    main().innerHTML =
      '<div class="page-head"><h1>Cumulative dose tracker</h1><p class="muted">Add previous treatment (by regimen and number of cycles, or as a total dose) to see lifetime anthracycline and bleomycin exposure. Nothing is saved.</p></div>' +
      '<section class="card"><h2>Previous treatment</h2>' +
      '<div class="calc-form" style="margin-bottom:.8rem"><label>BSA (m²) — needed for ABVD bleomycin<input id="cu-bsa" type="number" step="0.01" min="0.5" max="3.5" value="' + esc(st.bsa) + '"></label></div>' +
      '<div id="cu-rows"></div>' +
      '<div class="head-actions"><button class="btn small" type="button" id="cu-add-reg">+ Add regimen</button><button class="btn small" type="button" id="cu-add-man">+ Add a drug total</button></div>' +
      '<h3>Cardiac risk factors</h3><div class="tags">' + RISKS.map((rk) => '<label class="check-chip"><input type="checkbox" data-risk="' + rk[0] + '"' + (st.risk[rk[0]] ? " checked" : "") + "> " + esc(rk[1]) + "</label>").join("") + "</div></section>" +
      '<section class="card"><h2>Lifetime totals</h2><div id="cu-out"></div></section>' +
      '<section class="card"><h2>If you give more</h2><div class="calc-form"><label>Planned regimen<select id="cu-plan-reg">' + regOptions(st.planReg) + '</select></label><label>Cycles<input id="cu-plan-cyc" type="number" min="1" max="20" value="' + esc(st.planCycles) + '"></label></div><div id="cu-plan"></div></section>' +
      '<p class="small muted">Doxorubicin-equivalent factors (ESC 2022): doxorubicin 1, epirubicin 0.8, daunorubicin 0.6, idarubicin 5, mitoxantrone 10. Liposomal doxorubicin is not included. Thresholds are guides; decisions need cardio-oncology input.</p>';

    const m = main();

    function perText(row) {
      const r = ui.regimenById(row.regimenId);
      if (!r) return "";
      const pc = C.perCycle(r, Number(st.bsa));
      return Object.keys(pc).map((id) => C.AGENTS[id].name + " " + (isFinite(pc[id].amount) ? Math.round(pc[id].amount * 10) / 10 + " " + pc[id].unit : "(" + pc[id].note + ")") + "/cycle" + (pc[id].note && isFinite(pc[id].amount) ? " — " + pc[id].note : "")).join("; ");
    }

    function rowsHtml() {
      if (!st.rows.length) return '<p class="muted">No previous treatment added.</p>';
      return st.rows
        .map((row, i) => {
          if (row.type === "manual") {
            return '<div class="cu-row"><select data-i="' + i + '" data-k="drug">' + agentOptions(row.drug) + '</select><input data-i="' + i + '" data-k="amount" type="number" min="0" placeholder="Total" value="' + esc(row.amount || "") + '"><button class="btn small" type="button" data-del="' + i + '">Remove</button></div>';
          }
          const per = perText(row);
          return '<div class="cu-row"><select data-i="' + i + '" data-k="regimenId">' + regOptions(row.regimenId) + '</select><input data-i="' + i + '" data-k="cycles" type="number" min="0" max="30" placeholder="Cycles" value="' + esc(row.cycles || "") + '"><button class="btn small" type="button" data-del="' + i + '">Remove</button><div class="small muted cu-per" data-per="' + i + '">' + esc(per) + "</div></div>";
        })
        .join("");
    }

    function meter(value, max, marks) {
      const pct = Math.min(100, (value / max) * 100);
      return '<div class="meter"><div class="meter-fill" style="width:' + pct.toFixed(1) + '%"></div>' + marks.map((mk) => '<span class="meter-mark" style="left:' + ((mk / max) * 100).toFixed(1) + '%" title="' + mk + '"></span>').join("") + "</div>";
    }

    function totalsHtml(t, a) {
      const by = Object.keys(t.byDrug).map((id) => "<li>" + esc(C.AGENTS[id].name) + ": <strong>" + Math.round(t.byDrug[id]) + " " + esc(C.AGENTS[id].unit) + "</strong></li>").join("");
      return (
        (by ? "<ul>" + by + "</ul>" : '<p class="muted">Nothing counted yet.</p>') +
        (t.doxEq > 0 ? "<p><strong>Doxorubicin-equivalent: " + Math.round(t.doxEq) + " mg/m²</strong></p>" + meter(t.doxEq, 600, [250, a.ceiling, 550]) + '<p class="small muted">Marks: 250 (high-risk exposure), ' + a.ceiling + " (recommended ceiling), 550 (absolute maximum).</p>" : "") +
        (t.bleomycin > 0 ? "<p><strong>Bleomycin: " + Math.round(t.bleomycin) + " units</strong></p>" + meter(t.bleomycin, 450, [300, 400]) : "") +
        a.messages.map((msg) => '<div class="callout ' + (msg.level === "danger" ? "danger" : msg.level === "caution" ? "warn" : "ok") + '">' + esc(msg.text) + "</div>").join("") +
        (t.missing.length ? '<p class="small txt-danger">' + esc(t.missing.join("; ")) + "</p>" : "")
      );
    }

    // Rebuild the row inputs only when rows are added or removed (not while the user is typing in them).
    function renderRows() {
      m.querySelector("#cu-rows").innerHTML = rowsHtml();
    }

    function render() {
      st.bsa = m.querySelector("#cu-bsa").value;
      st.rows.forEach((row, i) => {
        const el = m.querySelector('[data-per="' + i + '"]');
        if (el) el.textContent = perText(row);
      });
      const risk = Object.keys(st.risk).some((k) => st.risk[k]);
      const t = C.total(st.rows, Number(st.bsa));
      m.querySelector("#cu-out").innerHTML = totalsHtml(t, C.assess(t, risk));
      st.planReg = m.querySelector("#cu-plan-reg").value;
      st.planCycles = m.querySelector("#cu-plan-cyc").value;
      if (st.planReg && Number(st.planCycles) > 0) {
        const t2 = C.total(st.rows.concat([{ type: "regimen", regimenId: st.planReg, cycles: st.planCycles }]), Number(st.bsa));
        m.querySelector("#cu-plan").innerHTML = "<h3>After the planned cycles</h3>" + totalsHtml(t2, C.assess(t2, risk));
      } else m.querySelector("#cu-plan").innerHTML = '<p class="muted">Choose a regimen and number of cycles to see the projected total.</p>';
    }

    m.querySelector("#cu-add-reg").addEventListener("click", () => {
      st.rows.push({ type: "regimen", regimenId: "", cycles: "" });
      renderRows();
      render();
    });
    m.querySelector("#cu-add-man").addEventListener("click", () => {
      st.rows.push({ type: "manual", drug: "doxorubicin", amount: "" });
      renderRows();
      render();
    });
    m.querySelector("#cu-rows").addEventListener("change", (e) => {
      const i = e.target.dataset.i;
      if (i === undefined) return;
      st.rows[i][e.target.dataset.k] = e.target.value;
      render();
    });
    m.querySelector("#cu-rows").addEventListener("click", (e) => {
      const d = e.target.dataset.del;
      if (d === undefined) return;
      st.rows.splice(Number(d), 1);
      renderRows();
      render();
    });
    m.querySelectorAll("[data-risk]").forEach((cb) =>
      cb.addEventListener("change", () => {
        st.risk[cb.dataset.risk] = cb.checked;
        render();
      })
    );
    ["#cu-bsa", "#cu-plan-reg", "#cu-plan-cyc"].forEach((sel) => m.querySelector(sel).addEventListener("change", render));
    m.querySelector("#cu-rows").addEventListener("input", (e) => {
      const i = e.target.dataset.i;
      if (i === undefined || e.target.tagName !== "INPUT") return;
      st.rows[i][e.target.dataset.k] = e.target.value;
      render();
    });
    renderRows();
    render();
  };
})();

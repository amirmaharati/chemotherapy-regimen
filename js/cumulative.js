/*
 * Cumulative dose tracker: anthracyclines (as doxorubicin equivalents) and bleomycin.
 * Pure functions — no DOM.
 */
(function (root) {
  "use strict";

  const ONCO = root.ONCO;
  const C = {};

  // Doxorubicin-equivalent factors for cardiotoxicity (ESC 2022 cardio-oncology guideline).
  C.AGENTS = {
    doxorubicin: { name: "Doxorubicin", factor: 1, limit: 550, unit: "mg/m²" },
    epirubicin: { name: "Epirubicin", factor: 0.8, limit: 900, unit: "mg/m²" },
    daunorubicin: { name: "Daunorubicin", factor: 0.6, limit: 550, unit: "mg/m²" },
    idarubicin: { name: "Idarubicin", factor: 5, limit: 150, unit: "mg/m²" },
    mitoxantrone: { name: "Mitoxantrone", factor: 10, limit: 140, unit: "mg/m²" },
    bleomycin: { name: "Bleomycin", factor: null, limit: 400, unit: "units" },
  };

  C.TRACKED = Object.keys(C.AGENTS);

  // Regimens in the app that contain a tracked drug.
  C.regimens = function () {
    return ONCO.regimens.filter(function (r) {
      return r.drugs.some(function (d) { return C.TRACKED.indexOf(d.drug) >= 0; });
    });
  };

  /*
   * Amount of each tracked drug in one cycle of a regimen.
   * Returns { drugId: { amount, unit, note } }. Bleomycin in units/m² needs bsa.
   */
  C.perCycle = function (regimen, bsa) {
    const out = {};
    const phases = ONCO.schedule.phases(regimen);
    phases.forEach(function (ph) {
      ph.lines.forEach(function (line) {
        if (C.TRACKED.indexOf(line.drug) < 0 || typeof line.dose === "undefined") return;
        const ld = ONCO.schedule.lineDays(line, ph.length);
        const n = ld ? ld.days.length : 1;
        const dose = Array.isArray(line.dose) ? line.dose[0] : line.dose;
        let amount = dose * n;
        let note = "";
        if (line.unit === "units/m2") {
          if (bsa > 0) amount = amount * bsa;
          else {
            amount = NaN;
            note = "needs BSA";
          }
        } else if (line.unit !== "mg/m2" && line.unit !== "units") {
          return;
        }
        if (regimen.id === "da-epoch-r") note = "dose level 1 — higher if escalated";
        const prev = out[line.drug];
        out[line.drug] = {
          amount: prev && phases.length === 1 ? prev.amount + amount : Math.max(prev ? prev.amount : 0, amount),
          unit: line.drug === "bleomycin" ? "units" : "mg/m²",
          note: note,
        };
      });
    });
    return out;
  };

  /*
   * rows: [{ type: "regimen", regimenId, cycles } | { type: "manual", drug, amount }]
   * Returns { byDrug: { id: amount }, doxEq, bleomycin, missing: [] }
   */
  C.total = function (rows, bsa) {
    const byDrug = {};
    const missing = [];
    rows.forEach(function (row) {
      if (row.type === "manual") {
        const a = Number(row.amount);
        if (C.AGENTS[row.drug] && a > 0) byDrug[row.drug] = (byDrug[row.drug] || 0) + a;
        return;
      }
      const reg = ONCO.regimens.find(function (r) { return r.id === row.regimenId; });
      const cycles = Number(row.cycles) || 0;
      if (!reg || !cycles) return;
      const pc = C.perCycle(reg, bsa);
      Object.keys(pc).forEach(function (id) {
        if (!isFinite(pc[id].amount)) {
          missing.push(reg.shortName + ": " + C.AGENTS[id].name + " " + pc[id].note);
          return;
        }
        byDrug[id] = (byDrug[id] || 0) + pc[id].amount * cycles;
      });
    });
    let doxEq = 0;
    Object.keys(byDrug).forEach(function (id) {
      if (C.AGENTS[id].factor) doxEq += byDrug[id] * C.AGENTS[id].factor;
    });
    return { byDrug: byDrug, doxEq: doxEq, bleomycin: byDrug.bleomycin || 0, missing: missing };
  };

  /*
   * riskFactors: true if any (chest radiotherapy, heart disease, age ≥ 65, HER2 therapy, hypertension/diabetes).
   * Returns messages with level "ok" | "caution" | "danger".
   */
  C.assess = function (totals, riskFactors) {
    const msgs = [];
    const ceiling = riskFactors ? 400 : 450;
    const d = totals.doxEq;
    if (d > 0) {
      if (d >= 550) msgs.push({ level: "danger", text: "Doxorubicin-equivalent " + Math.round(d) + " mg/m² — at or above the usual absolute maximum (550 mg/m²). Further anthracycline is generally not advised." });
      else if (d >= ceiling) msgs.push({ level: "danger", text: "Doxorubicin-equivalent " + Math.round(d) + " mg/m² — at or above the recommended ceiling (" + ceiling + " mg/m²" + (riskFactors ? " with risk factors" : "") + "). Cardio-oncology review before more anthracycline." });
      else if (d >= 250) msgs.push({ level: "caution", text: "Doxorubicin-equivalent " + Math.round(d) + " mg/m² — ≥ 250 mg/m² is a high-risk exposure (ESC). Monitor LVEF and consider cardioprotection (e.g. dexrazoxane)." });
      else msgs.push({ level: "ok", text: "Doxorubicin-equivalent " + Math.round(d) + " mg/m² — below 250 mg/m²." });
    }
    Object.keys(totals.byDrug).forEach(function (id) {
      const ag = C.AGENTS[id];
      if (id !== "bleomycin" && id !== "doxorubicin" && totals.byDrug[id] >= ag.limit) {
        msgs.push({ level: "danger", text: ag.name + " " + Math.round(totals.byDrug[id]) + " " + ag.unit + " — above its own limit (" + ag.limit + ")." });
      }
    });
    const b = totals.bleomycin;
    if (b > 0) {
      if (b >= 400) msgs.push({ level: "danger", text: "Bleomycin " + Math.round(b) + " units — at or above the lifetime limit (400 units). High risk of lung fibrosis." });
      else if (b >= 300) msgs.push({ level: "caution", text: "Bleomycin " + Math.round(b) + " units — approaching the limit; check lung function (DLCO) and risk factors (age > 40, kidney function, smoking, chest RT)." });
      else msgs.push({ level: "ok", text: "Bleomycin " + Math.round(b) + " units — below 300 units." });
    }
    return { ceiling: ceiling, messages: msgs };
  };

  ONCO.cumulative = C;
})(typeof window !== "undefined" ? window : globalThis);

/*
 * Kidney and liver dose-adjustment engine. Pure functions — no DOM.
 *
 * Rules live in data/dose-adjustments.js (per drug) and can be overridden on a regimen
 * drug line with renalRules / hepaticRules.
 *
 * Rule conditions (first matching rule wins, so list the most severe first):
 *   age:     ageAbove (years) — regimen-specific, e.g. high-dose cytarabine
 *   renal:   gfrBelow (mL/min, strict <)  or  scrAbove (mg/dL, strict >)
 *   hepatic: biliMgDlAbove, biliXulnAbove, astXulnAbove, alpXulnAbove  (any one = match; all: true = every one)
 * Rule effects: factor (e.g. 0.75), setDose (new dose in the line's unit), setNote, avoid, caution
 * Optional: minDose — rule only applies when the line's dose (same unit) is at least this (e.g. high-dose cytarabine).
 */
(function (root) {
  "use strict";

  const ONCO = root.ONCO;
  const O = {};

  ONCO.doseRules = ONCO.doseRules || {};
  ONCO.addDoseRules = function (map) {
    Object.keys(map).forEach(function (k) {
      ONCO.doseRules[k] = map[k];
    });
  };

  const DEFAULT_ULN = { biliMgdl: 1.2, biliUmol: 21, ast: 40, alp: 120 };
  O.DEFAULT_ULN = DEFAULT_ULN;

  // Liver values from raw form input: { bili, biliUnit ("mgdl"|"umol"), biliUln, ast, astUln, alp, alpUln }
  O.liverValues = function (input) {
    const num = function (x) {
      const n = Number(x);
      return x === "" || x === null || x === undefined || !isFinite(n) || n <= 0 ? NaN : n;
    };
    const bili = num(input.bili);
    const umol = input.biliUnit === "umol";
    const biliUln = num(input.biliUln) || (umol ? DEFAULT_ULN.biliUmol : DEFAULT_ULN.biliMgdl);
    const ast = num(input.ast);
    const alp = num(input.alp);
    return {
      biliMgDl: umol ? bili / 17.1 : bili,
      biliXuln: bili / biliUln,
      astXuln: ast / (num(input.astUln) || DEFAULT_ULN.ast),
      alpXuln: alp / (num(input.alpUln) || DEFAULT_ULN.alp),
    };
  };

  function maxDose(entry) {
    return Array.isArray(entry.dose) ? entry.dose[entry.dose.length - 1] : entry.dose;
  }

  // Which rules apply to this regimen line, or why none do.
  O.rulesFor = function (entry) {
    const base = ONCO.doseRules[entry.drug] || {};
    const out = {
      renal: entry.renalRules || base.renal || [],
      hepatic: entry.hepaticRules || base.hepatic || [],
      age: entry.ageRules || base.age || [],
      note: base.note || "",
      skip: "",
    };
    if (/intrathecal/i.test(entry.route || "")) {
      out.renal = [];
      out.hepatic = [];
      out.skip = "Intrathecal dose — kidney/liver rules for systemic dosing do not apply.";
    }
    const dose = maxDose(entry);
    const keep = function (r) {
      return !(r.minDose && (typeof dose !== "number" || dose < r.minDose));
    };
    out.renal = out.renal.filter(keep);
    out.hepatic = out.hepatic.filter(keep);
    out.age = out.age.filter(keep);
    return out;
  };

  const HEP_KEYS = { biliMgDlAbove: "biliMgDl", biliXulnAbove: "biliXuln", astXulnAbove: "astXuln", alpXulnAbove: "alpXuln" };

  // true / false / null (cannot tell — value missing)
  O.matches = function (rule, v) {
    if (rule.ageAbove !== undefined) return isFinite(v.age) && v.age > 0 ? v.age > rule.ageAbove : null;
    if (rule.gfrBelow !== undefined) return isFinite(v.gfr) ? v.gfr < rule.gfrBelow : null;
    if (rule.scrAbove !== undefined) return isFinite(v.scrMgDl) ? v.scrMgDl > rule.scrAbove : null;
    const results = Object.keys(HEP_KEYS)
      .filter(function (k) { return rule[k] !== undefined; })
      .map(function (k) {
        const val = v[HEP_KEYS[k]];
        return isFinite(val) ? val > rule[k] : null;
      });
    if (!results.length) return false;
    if (rule.all) {
      if (results.indexOf(false) >= 0) return false;
      return results.indexOf(null) >= 0 ? null : true;
    }
    if (results.indexOf(true) >= 0) return true;
    return results.indexOf(null) >= 0 ? null : false;
  };

  /*
   * status: "none" (no rules) | "ok" (rules checked, full dose) | "adjust" | "avoid" | "caution" | "unknown" (values missing)
   */
  O.evaluateSet = function (rules, values) {
    if (!rules.length) return { status: "none" };
    let unknown = false;
    for (let i = 0; i < rules.length; i++) {
      const m = O.matches(rules[i], values);
      if (m === null) {
        unknown = true;
        continue;
      }
      if (m) {
        const r = rules[i];
        const status = r.avoid ? "avoid" : r.factor !== undefined || r.setDose !== undefined ? "adjust" : "caution";
        // partial: a more severe rule above could not be checked (value missing).
        return { status: status, rule: r, partial: unknown };
      }
    }
    return { status: unknown ? "unknown" : "ok" };
  };

  /*
   * patient: { gfrForCarboplatin, scrMgDlRaw, liver: liverValues(...) }
   * Returns { renal, hepatic, factor, setDose, setNote, avoid, caution, reasons: [] }
   */
  O.evaluate = function (entry, patient) {
    const rules = O.rulesFor(entry);
    const liver = patient.liver || {};
    const values = {
      gfr: patient.gfrForCarboplatin,
      scrMgDl: patient.scrMgDlRaw,
      biliMgDl: liver.biliMgDl,
      biliXuln: liver.biliXuln,
      astXuln: liver.astXuln,
      alpXuln: liver.alpXuln,
      age: patient.age,
    };
    const renal = O.evaluateSet(rules.renal, values);
    const hepatic = O.evaluateSet(rules.hepatic, values);
    const age = O.evaluateSet(rules.age, values);
    const out = { renal: renal, hepatic: hepatic, age: age, factor: 1, setDose: undefined, setNote: "", avoid: false, caution: false, reasons: [], skip: rules.skip, note: rules.note };
    [["Age", age], ["Kidney", renal], ["Liver", hepatic]].forEach(function (pair) {
      const res = pair[1];
      if (!res.rule) return;
      const r = res.rule;
      out.reasons.push(pair[0] + ": " + r.text + (res.partial ? " (some values not entered — a stricter rule may apply)" : ""));
      if (r.avoid) out.avoid = true;
      else if (r.setDose !== undefined) {
        // Keep the lowest set dose if two rules both set one.
        const lo = function (x) { return Array.isArray(x) ? x[0] : x; };
        if (out.setDose === undefined || lo(r.setDose) < lo(out.setDose)) out.setDose = r.setDose;
        if (r.setNote) out.setNote = r.setNote;
      } else if (r.factor !== undefined) out.factor *= r.factor;
      else out.caution = true;
    });
    return out;
  };

  // Plain text for a rule list (used in tables).
  O.describe = function (rules) {
    return rules.map(function (r) { return r.text; });
  };

  ONCO.organ = O;
})(typeof window !== "undefined" ? window : globalThis);

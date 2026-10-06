/*
 * Clinical calculators. Pure functions only (no DOM) so they can be unit tested.
 */
(function (root) {
  "use strict";

  const ONCO = root.ONCO;

  const calc = {};

  // Body surface area, Mosteller: sqrt(height cm × weight kg / 3600)
  calc.bsaMosteller = function (heightCm, weightKg) {
    if (!(heightCm > 0 && weightKg > 0)) return NaN;
    return Math.sqrt((heightCm * weightKg) / 3600);
  };

  // Body surface area, DuBois: 0.007184 × W^0.425 × H^0.725
  calc.bsaDuBois = function (heightCm, weightKg) {
    if (!(heightCm > 0 && weightKg > 0)) return NaN;
    return 0.007184 * Math.pow(weightKg, 0.425) * Math.pow(heightCm, 0.725);
  };

  calc.bmi = function (heightCm, weightKg) {
    if (!(heightCm > 0 && weightKg > 0)) return NaN;
    const m = heightCm / 100;
    return weightKg / (m * m);
  };

  // Ideal body weight (Devine)
  calc.idealBodyWeight = function (heightCm, sex) {
    if (!(heightCm > 0)) return NaN;
    const inches = heightCm / 2.54;
    return (sex === "F" ? 45.5 : 50) + 2.3 * (inches - 60);
  };

  // Adjusted body weight = IBW + 0.4 × (actual − IBW)
  calc.adjustedBodyWeight = function (heightCm, weightKg, sex) {
    const ibw = calc.idealBodyWeight(heightCm, sex);
    if (!(ibw > 0 && weightKg > 0)) return NaN;
    return weightKg > ibw ? ibw + 0.4 * (weightKg - ibw) : weightKg;
  };

  calc.creatinineToMgDl = function (value, unit) {
    if (!(value > 0)) return NaN;
    return unit === "umol" ? value / 88.4 : value;
  };

  // Cockcroft–Gault creatinine clearance (mL/min)
  calc.cockcroftGault = function (age, weightKg, sex, scrMgDl) {
    if (!(age > 0 && weightKg > 0 && scrMgDl > 0)) return NaN;
    let v = ((140 - age) * weightKg) / (72 * scrMgDl);
    if (sex === "F") v *= 0.85;
    return v;
  };

  // CKD-EPI 2021 (race-free) eGFR, mL/min/1.73 m²
  calc.ckdEpi2021 = function (age, sex, scrMgDl) {
    if (!(age > 0 && scrMgDl > 0)) return NaN;
    const female = sex === "F";
    const k = female ? 0.7 : 0.9;
    const a = female ? -0.241 : -0.302;
    const r = scrMgDl / k;
    let v = 142 * Math.pow(Math.min(r, 1), a) * Math.pow(Math.max(r, 1), -1.2) * Math.pow(0.9938, age);
    if (female) v *= 1.012;
    return v;
  };

  // Remove the 1.73 m² indexing (eviQ / ADDIKD recommend this for carboplatin dosing)
  calc.deindexGfr = function (egfr, bsa) {
    if (!(egfr > 0 && bsa > 0)) return NaN;
    return (egfr * bsa) / 1.73;
  };

  // Calvert formula: dose (mg) = AUC × (GFR + 25). GFR capped at 125 mL/min (FDA advice).
  calc.calvert = function (auc, gfr) {
    if (!(auc > 0 && gfr > 0)) return NaN;
    return auc * (Math.min(gfr, 125) + 25);
  };

  calc.roundDose = function (value) {
    if (!isFinite(value)) return value;
    if (value < 10) return Math.round(value * 10) / 10;
    return Math.round(value);
  };

  /*
   * Work out a single drug line for one patient.
   * entry: a regimen drug line { dose, unit, cap, ... }
   * patient: { bsa, weightKg, gfrForCarboplatin }
   * Returns { values: [number], outUnit, capped: bool, note, error }
   */
  calc.doseForEntry = function (entry, patient) {
    const doses = Array.isArray(entry.dose) ? entry.dose : [entry.dose];
    const out = { values: [], outUnit: "mg", capped: false, note: "", error: "" };

    if (typeof entry.dose === "undefined" || entry.dose === null) {
      out.error = "See notes";
      return out;
    }

    doses.forEach(function (d) {
      let v;
      switch (entry.unit) {
        case "mg/m2":
          if (!(patient.bsa > 0)) { out.error = "Needs height + weight"; return; }
          v = d * patient.bsa;
          break;
        case "units/m2":
          if (!(patient.bsa > 0)) { out.error = "Needs height + weight"; return; }
          v = d * patient.bsa;
          out.outUnit = "units";
          break;
        case "mg/kg":
          if (!(patient.weightKg > 0)) { out.error = "Needs weight"; return; }
          v = d * patient.weightKg;
          break;
        case "mcg/kg":
          if (!(patient.weightKg > 0)) { out.error = "Needs weight"; return; }
          v = d * patient.weightKg;
          out.outUnit = "micrograms";
          break;
        case "AUC":
          if (!(patient.gfrForCarboplatin > 0)) { out.error = "Needs age, sex, weight + creatinine"; return; }
          v = calc.calvert(d, patient.gfrForCarboplatin);
          out.note = "Calvert: AUC × (GFR + 25), GFR capped at 125 mL/min";
          break;
        case "mg":
          v = d;
          break;
        case "units":
          v = d;
          out.outUnit = "units";
          break;
        default:
          out.error = "Unknown unit";
          return;
      }
      if (typeof entry.cap === "number" && v > entry.cap) {
        v = entry.cap;
        out.capped = true;
      }
      out.values.push(calc.roundDose(v));
    });

    return out;
  };

  /*
   * Build the patient object from raw form input.
   * input: { heightCm, weightKg, age, sex, scr, scrUnit, gfrMethod, measuredGfr, floorScr }
   */
  calc.patientFromInput = function (input) {
    const p = {};
    p.heightCm = Number(input.heightCm) || 0;
    p.weightKg = Number(input.weightKg) || 0;
    p.age = Number(input.age) || 0;
    p.sex = input.sex === "F" ? "F" : "M";
    p.bsa = calc.bsaMosteller(p.heightCm, p.weightKg);
    p.bmi = calc.bmi(p.heightCm, p.weightKg);
    p.ibw = calc.idealBodyWeight(p.heightCm, p.sex);
    p.adjbw = calc.adjustedBodyWeight(p.heightCm, p.weightKg, p.sex);

    let scr = calc.creatinineToMgDl(Number(input.scr), input.scrUnit);
    p.scrMgDlRaw = scr;
    if (input.floorScr && scr > 0 && scr < 0.7) scr = 0.7;
    p.scrMgDl = scr;

    // Use adjusted body weight for Cockcroft–Gault when BMI ≥ 30
    p.cgWeight = p.bmi >= 30 ? p.adjbw : p.weightKg;
    p.crcl = calc.cockcroftGault(p.age, p.cgWeight, p.sex, scr);
    p.egfr = calc.ckdEpi2021(p.age, p.sex, scr);
    p.egfrDeindexed = calc.deindexGfr(p.egfr, p.bsa);

    const method = input.gfrMethod || "cg";
    if (method === "measured") p.gfrForCarboplatin = Number(input.measuredGfr) || NaN;
    else if (method === "ckdepi") p.gfrForCarboplatin = p.egfrDeindexed;
    else p.gfrForCarboplatin = p.crcl;
    p.gfrMethod = method;
    return p;
  };

  ONCO.calc = calc;
})(typeof window !== "undefined" ? window : globalThis);

/*
 * Kidney (renal) and liver (hepatic) dose-adjustment rules, per drug.
 * The engine (js/organ.js) applies these to the calculated doses.
 *
 * "GFR" means the kidney-function value chosen in the calculator (Cockcroft–Gault CrCl,
 * de-indexed CKD-EPI eGFR, or measured GFR).
 * Thresholds are common published values (product information, eviQ, Floyd/Kintzel & Dorr reviews).
 * eviQ now follows the ADDIKD guideline (eGFR-based) — always check the current protocol.
 * Drugs not listed here need no routine adjustment (or the advice is "use with caution" only).
 */
ONCO.addDoseRules({
  "arsenic-trioxide": {
    renal: [{ gfrBelow: 30, caution: true, text: "GFR < 30: use with caution; dose reduction may be needed (limited data)." }],
  },
  bendamustine: {
    renal: [
      { gfrBelow: 30, avoid: true, text: "GFR < 30: do not use." },
      { gfrBelow: 40, caution: true, text: "GFR 30–39: some products are not recommended below 40 — check the product information." },
    ],
    hepatic: [
      { biliXulnAbove: 3, avoid: true, text: "Bilirubin > 3 × ULN: do not use." },
      { astXulnAbove: 2.5, biliXulnAbove: 1.5, all: true, avoid: true, text: "AST/ALT > 2.5 × ULN with bilirubin > 1.5 × ULN: do not use." },
    ],
  },
  bleomycin: {
    renal: [
      { gfrBelow: 10, factor: 0.4, text: "GFR < 10: give 40%." },
      { gfrBelow: 20, factor: 0.45, text: "GFR 10–19: give 45%." },
      { gfrBelow: 30, factor: 0.55, text: "GFR 20–29: give 55%." },
      { gfrBelow: 40, factor: 0.6, text: "GFR 30–39: give 60%." },
      { gfrBelow: 50, factor: 0.7, text: "GFR 40–49: give 70%." },
    ],
  },
  bortezomib: {
    hepatic: [{ biliXulnAbove: 1.5, setDose: 0.7, text: "Bilirubin > 1.5 × ULN: start at 0.7 mg/m² in cycle 1, then adjust by tolerance." }],
  },
  capecitabine: {
    renal: [
      { gfrBelow: 30, avoid: true, text: "GFR < 30: contraindicated." },
      { gfrBelow: 51, factor: 0.75, text: "GFR 30–50: give 75% of the dose." },
    ],
    hepatic: [{ biliXulnAbove: 3, caution: true, text: "Bilirubin > 3 × ULN: interrupt if drug-related; use with caution." }],
  },
  carboplatin: {
    note: "Dose already adjusts for kidney function through the Calvert formula (AUC × (GFR + 25)).",
  },
  cisplatin: {
    renal: [
      { gfrBelow: 30, avoid: true, text: "GFR < 30: do not give cisplatin — use carboplatin or another regimen." },
      { gfrBelow: 45, factor: 0.5, text: "GFR 30–44: give 50% (strongly consider carboplatin instead)." },
      { gfrBelow: 60, factor: 0.75, text: "GFR 45–59: give 75% (or consider carboplatin / split dosing)." },
    ],
  },
  cyclophosphamide: {
    renal: [{ gfrBelow: 10, factor: 0.75, text: "GFR < 10: give 75%." }],
    hepatic: [
      { biliMgDlAbove: 5, avoid: true, text: "Bilirubin > 5 mg/dL: avoid." },
      { biliMgDlAbove: 3, factor: 0.75, text: "Bilirubin 3.1–5 mg/dL: give 75%." },
    ],
  },
  cytarabine: {
    renal: [
      { minDose: 1000, gfrBelow: 30, avoid: true, text: "High dose (≥ 1 g/m²), GFR < 30: avoid — very high risk of cerebellar toxicity." },
      { minDose: 1000, gfrBelow: 46, factor: 0.5, text: "High dose, GFR 30–45: give 50%." },
      { minDose: 1000, gfrBelow: 60, factor: 0.6, text: "High dose, GFR 46–59: give 60%." },
    ],
    hepatic: [{ biliMgDlAbove: 2, factor: 0.5, text: "Bilirubin > 2 mg/dL: consider 50%, escalate if tolerated." }],
  },
  daunorubicin: {
    renal: [{ scrAbove: 3, factor: 0.5, text: "Serum creatinine > 3 mg/dL (265 µmol/L): give 50%." }],
    hepatic: [
      { biliMgDlAbove: 5, avoid: true, text: "Bilirubin > 5 mg/dL: avoid." },
      { biliMgDlAbove: 3, factor: 0.5, text: "Bilirubin 3.1–5 mg/dL: give 50%." },
      { biliMgDlAbove: 1.2, factor: 0.75, text: "Bilirubin 1.2–3 mg/dL: give 75%." },
    ],
  },
  docetaxel: {
    hepatic: [
      { biliXulnAbove: 1, avoid: true, text: "Bilirubin > ULN: do not give." },
      { astXulnAbove: 1.5, alpXulnAbove: 2.5, all: true, avoid: true, text: "AST/ALT > 1.5 × ULN with ALP > 2.5 × ULN: do not give." },
    ],
  },
  doxorubicin: {
    hepatic: [
      { biliMgDlAbove: 5, avoid: true, text: "Bilirubin > 5 mg/dL: avoid." },
      { biliMgDlAbove: 3, factor: 0.25, text: "Bilirubin 3.1–5 mg/dL: give 25%." },
      { biliMgDlAbove: 1.2, factor: 0.5, text: "Bilirubin 1.2–3 mg/dL: give 50%." },
    ],
  },
  etoposide: {
    renal: [
      { gfrBelow: 15, factor: 0.5, text: "GFR < 15: give 50%." },
      { gfrBelow: 50, factor: 0.75, text: "GFR 15–49: give 75%." },
    ],
    hepatic: [{ biliMgDlAbove: 1.5, factor: 0.5, text: "Bilirubin > 1.5 mg/dL: consider 50%." }],
  },
  fludarabine: {
    renal: [
      { gfrBelow: 30, avoid: true, text: "GFR < 30: avoid." },
      { gfrBelow: 50, factor: 0.6, text: "GFR 30–49: give 60%." },
      { gfrBelow: 80, factor: 0.8, text: "GFR 50–79: give 80%." },
    ],
  },
  fluorouracil: {
    hepatic: [{ biliMgDlAbove: 5, avoid: true, text: "Bilirubin > 5 mg/dL: avoid." }],
  },
  gemcitabine: {
    renal: [{ gfrBelow: 30, caution: true, text: "GFR < 30: use with caution (haemolytic uraemic syndrome risk)." }],
    hepatic: [{ biliMgDlAbove: 1.6, factor: 0.8, text: "Bilirubin > 1.6 mg/dL: start at 80%, escalate if tolerated." }],
  },
  idarubicin: {
    renal: [{ scrAbove: 2, factor: 0.75, text: "Serum creatinine > 2 mg/dL (177 µmol/L): give 75%." }],
    hepatic: [
      { biliMgDlAbove: 5, avoid: true, text: "Bilirubin > 5 mg/dL: avoid." },
      { biliMgDlAbove: 2.5, factor: 0.5, text: "Bilirubin 2.6–5 mg/dL: give 50%." },
    ],
  },
  ifosfamide: {
    renal: [
      { gfrBelow: 30, avoid: true, text: "GFR < 30: avoid (high risk of encephalopathy and kidney damage) — specialist advice." },
      { gfrBelow: 60, factor: 0.8, text: "GFR 30–59: consider about 20% reduction — published practice varies." },
    ],
  },
  irinotecan: {
    renal: [{ gfrBelow: 15, caution: true, text: "GFR < 15 / dialysis: not recommended." }],
    hepatic: [
      { biliXulnAbove: 3, avoid: true, text: "Bilirubin > 3 × ULN: avoid." },
      { biliXulnAbove: 1, factor: 0.75, text: "Bilirubin 1–3 × ULN: reduce by one dose level (about 25%)." },
    ],
  },
  lenalidomide: {
    renal: [
      { gfrBelow: 30, setDose: 15, setNote: "every 48 hours (dialysis: 5 mg daily after dialysis)", text: "GFR < 30: 15 mg every 48 h (dialysis: 5 mg daily after dialysis)." },
      { gfrBelow: 60, setDose: 10, text: "GFR 30–59: 10 mg once daily." },
    ],
  },
  methotrexate: {
    renal: [
      { minDose: 500, gfrBelow: 10, avoid: true, text: "High dose, GFR < 10: do not give." },
      { minDose: 500, gfrBelow: 50, factor: 0.5, text: "High dose, GFR 10–49: give 50% (eviQ Hyper-CVAD B) — or delay / choose another regimen." },
      { minDose: 500, gfrBelow: 60, caution: true, text: "High dose, GFR 50–59: HD-MTX ideally needs ≥ 60 — consider reduction, delay or extra monitoring." },
    ],
    hepatic: [
      { biliMgDlAbove: 5, avoid: true, text: "Bilirubin > 5 mg/dL: avoid." },
      { biliMgDlAbove: 3, factor: 0.75, text: "Bilirubin 3.1–5 mg/dL: give 75%." },
    ],
  },
  "nab-paclitaxel": {
    hepatic: [
      { biliXulnAbove: 1.5, avoid: true, text: "Pancreatic cancer: bilirubin > 1.5 × ULN — do not give." },
      { astXulnAbove: 10, avoid: true, text: "AST/ALT > 10 × ULN: do not give." },
    ],
  },
  oxaliplatin: {
    renal: [{ gfrBelow: 30, factor: 0.76, text: "GFR < 30: reduce (85 → 65 mg/m², about 75%)." }],
  },
  paclitaxel: {
    hepatic: [
      { biliXulnAbove: 5, avoid: true, text: "Bilirubin > 5 × ULN: avoid." },
      { astXulnAbove: 10, avoid: true, text: "AST/ALT ≥ 10 × ULN: avoid." },
      { biliXulnAbove: 2, factor: 0.5, text: "Bilirubin 2–5 × ULN: about 50% (3-weekly: 90 mg/m²)." },
      { biliXulnAbove: 1.25, factor: 0.75, text: "Bilirubin 1.26–2 × ULN: about 75% (3-weekly: 135 mg/m²)." },
    ],
  },
  pemetrexed: {
    renal: [{ gfrBelow: 45, avoid: true, text: "GFR < 45: do not give." }],
  },
  polatuzumab: {
    renal: [{ gfrBelow: 30, caution: true, text: "GFR < 30: not studied — use with caution." }],
    hepatic: [{ biliXulnAbove: 1.5, avoid: true, text: "Bilirubin > 1.5 × ULN: avoid." }],
  },
  temozolomide: {
    renal: [{ gfrBelow: 30, caution: true, text: "GFR < 30: use with caution (limited data)." }],
  },
  "trastuzumab-emtansine": {
    hepatic: [
      { astXulnAbove: 3, biliXulnAbove: 2, all: true, avoid: true, text: "AST/ALT > 3 × ULN with bilirubin > 2 × ULN: stop permanently." },
      { astXulnAbove: 20, avoid: true, text: "AST/ALT > 20 × ULN: stop permanently." },
      { astXulnAbove: 5, avoid: true, text: "AST/ALT 5–20 × ULN: hold until ≤ 5 × ULN, then reduce one dose level." },
      { biliXulnAbove: 3, avoid: true, text: "Bilirubin > 3 × ULN: hold until ≤ 1.5 × ULN, then reduce one dose level." },
    ],
  },
  venetoclax: {
    renal: [{ gfrBelow: 15, caution: true, text: "GFR < 15: no data; higher tumour lysis risk." }],
  },
  vinblastine: {
    hepatic: [
      { biliMgDlAbove: 3, avoid: true, text: "Bilirubin > 3 mg/dL: avoid." },
      { biliMgDlAbove: 1.5, factor: 0.5, text: "Bilirubin 1.5–3 mg/dL: give 50%." },
    ],
  },
  vincristine: {
    hepatic: [
      { biliMgDlAbove: 3, avoid: true, text: "Bilirubin > 3 mg/dL: omit." },
      { biliMgDlAbove: 1.5, factor: 0.5, text: "Bilirubin 1.5–3 mg/dL: give 50%." },
    ],
  },
  vinorelbine: {
    hepatic: [
      { biliMgDlAbove: 3, factor: 0.25, text: "Bilirubin > 3 mg/dL: give 25%." },
      { biliMgDlAbove: 2, factor: 0.5, text: "Bilirubin 2.1–3 mg/dL: give 50%." },
    ],
  },
});

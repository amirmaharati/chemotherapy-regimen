/*
 * Shared namespace for the data files and the app.
 * Data files call ONCO.addRegimens / addDrugs / addSupportive / addPrinciples.
 * Works in the browser (window) and in Node tests (globalThis).
 */
(function (root) {
  "use strict";

  const ONCO = root.ONCO || (root.ONCO = {});

  ONCO.meta = {
    appName: "OncoRegimens",
    version: "0.2.0",
    contentReviewed: "2026-10",
  };

  ONCO.regimens = ONCO.regimens || [];
  ONCO.drugs = ONCO.drugs || {};
  ONCO.supportive = ONCO.supportive || [];
  ONCO.principles = ONCO.principles || [];

  ONCO.addRegimens = function (list) {
    ONCO.regimens.push(...list);
  };
  ONCO.addDrugs = function (list) {
    list.forEach(function (d) {
      ONCO.drugs[d.id] = d;
    });
  };
  ONCO.addSupportive = function (list) {
    ONCO.supportive.push(...list);
  };
  ONCO.addPrinciples = function (list) {
    ONCO.principles.push(...list);
  };

  // Fixed vocabularies. The data tests check every record against these.
  ONCO.vocab = {
    settings: {
      outpatient: "Outpatient (day unit)",
      inpatient: "Inpatient (admission)",
    },
    emetogenic: {
      high: "High (>90%)",
      moderate: "Moderate (30–90%)",
      low: "Low (10–30%)",
      minimal: "Minimal (<10%)",
    },
    fnRisk: {
      low: "Low (<10%)",
      intermediate: "Intermediate (10–20%)",
      high: "High (>20%)",
      "expected": "Profound neutropenia expected (leukaemia / intensive protocol)",
    },
    units: {
      "mg/m2": "mg/m²",
      "mg/kg": "mg/kg",
      "mg": "mg",
      "AUC": "AUC (mg/mL·min)",
      "units/m2": "units/m²",
      "units": "units",
      "mcg/kg": "micrograms/kg",
    },
    vesicant: {
      vesicant: "Vesicant",
      irritant: "Irritant",
      "irritant-vesicant": "Irritant with vesicant properties",
      none: "Non-vesicant",
    },
    // Supportive-care topics a regimen can be tagged with (links to the supportive page of the same id).
    tags: {
      "antiemetic": "Antiemetic prophylaxis",
      "gcsf": "G-CSF (growth factor) support",
      "hbv": "Hepatitis B screening / prophylaxis",
      "hsv-vzv": "HSV / VZV antiviral prophylaxis",
      "pjp": "PJP (Pneumocystis) prophylaxis",
      "antifungal": "Antifungal prophylaxis",
      "antibacterial": "Antibacterial prophylaxis",
      "tls": "Tumour lysis syndrome prevention",
      "hydration": "Hydration / nephroprotection",
      "mesna": "Mesna (bladder protection)",
      "hd-mtx": "High-dose methotrexate care",
      "eye-drops": "Steroid eye drops (high-dose cytarabine)",
      "vte": "VTE prophylaxis",
      "cardiac": "Cardiac monitoring",
      "pulmonary": "Pulmonary monitoring (bleomycin)",
      "hypersensitivity": "Hypersensitivity / infusion reaction",
      "extravasation": "Vesicant – extravasation risk",
      "irae": "Immune-related adverse events",
      "diarrhoea": "Diarrhoea management",
      "neuropathy": "Peripheral neuropathy",
      "differentiation": "Differentiation syndrome",
      "it-chemo": "Intrathecal chemotherapy",
      "fertility": "Fertility preservation",
      "mucositis": "Mucositis / oral care",
    },
  };
})(typeof window !== "undefined" ? window : globalThis);

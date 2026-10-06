/*
 * Head & neck, CNS, sarcoma and single-agent immunotherapy regimens.
 */
(function () {
  "use strict";
  const T = ONCO.text;
  const R = ONCO.ref;

  ONCO.addRegimens([
    {
      id: "cisplatin-100-rt",
      name: "High-dose cisplatin 100 mg/m² every 3 weeks with radiotherapy",
      shortName: "Cisplatin 100 + RT",
      setting: "outpatient",
      settingNote: "about 4–5 hours with hydration (some centres admit overnight)",
      group: "Head & neck",
      intent: "Curative (chemoradiation)",
      indications: [
        "Locally advanced head and neck squamous cell carcinoma: definitive chemoradiation (e.g. 70 Gy / 35 fractions).",
        "Post-operative chemoradiation for positive margins or extranodal extension (EORTC 22931 / RTOG 9501).",
        "Nasopharyngeal carcinoma (with induction or adjuvant chemotherapy per protocol).",
      ],
      cycle: { length: "21 days", count: "3 doses (days 1, 22, 43 of radiotherapy)" },
      emetogenic: "high",
      fnRisk: "low",
      drugs: [
        { drug: "cisplatin", dose: 100, unit: "mg/m2", route: "IV infusion", days: "Days 1, 22, 43", d: [1], admin: "In 1000 mL sodium chloride 0.9% over 60 min with pre-hydration (1 L + magnesium) and post-hydration (1 L)." },
      ],
      order: ["Antiemetics", "Pre-hydration with magnesium", "Cisplatin", "Post-hydration"],
      premeds: [T.hec, T.cisplatinHydration],
      takeHome: [T.hecHome, "Oral fluids 2–3 L/day for 3 days.", "Mucositis care: salt/bicarbonate mouthwash, analgesic ladder, dietitian, early feeding tube if needed.", T.fever],
      tags: ["antiemetic", "hydration", "mucositis"],
      monitoring: [
        "Baseline: audiogram (if hearing concerns), dental assessment before RT, UEC/CrCl (need ≥ 60 mL/min), Mg, nutrition.",
        "Weekly during RT: FBC, UEC, Mg, weight, mucositis grade.",
      ],
      precautions: [
        "Cumulative cisplatin ≥ 200 mg/m² during RT is the target associated with benefit.",
        "Weekly cisplatin 40 mg/m² is an alternative (non-inferior in post-op setting — JCOG1008).",
        "Unfit for cisplatin: cetuximab-RT is inferior in HPV+ disease; consider RT alone or carboplatin-based options.",
      ],
      doseMods: ["CrCl falls < 50–60 mL/min, grade ≥ 2 ototoxicity or neuropathy: omit or switch (e.g. carboplatin)."],
      references: [
        R.eviq(291, "Head and neck SCC locally advanced definitive cisplatin (three weekly) chemoradiation", "https://www.eviq.org.au/medical-oncology/head-and-neck/definitive-chemoradiation/291-head-and-neck-scc-locally-advanced-definitive"),
        R.eviq(286, "Head and neck SCC post-operative cisplatin (three weekly) chemoradiation", "https://www.eviq.org.au/medical-oncology/head-and-neck/post-operative-chemoradiation/286-head-and-neck-scc-locally-advanced-post-operat"),
        R.nccn("Head and Neck Cancers"),
      ],
    },
    {
      id: "stupp-temozolomide",
      name: "Temozolomide with radiotherapy, then adjuvant temozolomide (Stupp)",
      shortName: "Stupp TMZ",
      setting: "outpatient",
      settingNote: "oral at home; daily radiotherapy visits",
      group: "CNS (brain)",
      intent: "Curative-intent / life-prolonging",
      indications: [
        "Newly diagnosed glioblastoma (IDH-wildtype, CNS WHO grade 4), ECOG 0–2, with 60 Gy / 30 fractions — Stupp (EORTC/NCIC).",
        "Older/frail patients: short-course RT (40 Gy / 15 fractions) with temozolomide (eviQ ID 3365).",
      ],
      cycle: { length: "Concurrent: daily for 6 weeks; adjuvant: 28 days", count: "Concurrent phase (42–49 days), 4-week break, then 6 adjuvant cycles (up to 12)" },
      emetogenic: "moderate",
      fnRisk: "low",
      drugs: [
        { phase: "Part 1 — with radiotherapy", drug: "temozolomide", dose: 75, unit: "mg/m2", route: "Oral", days: "Daily during RT (max 49 days), including weekends", admin: "1 hour before RT (or in the morning) on an empty stomach; antiemetic 30–60 min before." },
        { phase: "Part 2 — adjuvant (start 4 weeks after RT)", drug: "temozolomide", label: "Temozolomide (cycle 1)", dose: 150, unit: "mg/m2", route: "Oral", days: "Days 1–5 every 28 days", admin: "At bedtime on an empty stomach." },
        { phase: "Part 2 — adjuvant (start 4 weeks after RT)", drug: "temozolomide", label: "Temozolomide (cycles 2–6, if tolerated)", dose: 200, unit: "mg/m2", route: "Oral", days: "Days 1–5 every 28 days", admin: "Escalate if cycle 1 nadir ANC ≥ 1.5 and platelets ≥ 100 × 10⁹/L and non-haematological toxicity ≤ grade 2." },
      ],
      phaseInfo: {
        "Part 1 — with radiotherapy": { days: 42, cycles: 1 },
        "Part 2 — adjuvant (start 4 weeks after RT)": { days: 28, cycles: 6, gapBefore: 28 },
      },
      premeds: ["Concurrent phase: ondansetron 8 mg or metoclopramide 10 mg 30–60 min before each dose (low–moderate risk).", "Adjuvant phase: 5-HT3 antagonist before each dose (moderate risk)."],
      takeHome: [
        T.pjp + " **Required during the concurrent phase** (regardless of lymphocyte count) and until lymphocyte recovery.",
        "Dexamethasone for cerebral oedema only as needed — taper to lowest dose (raises PJP and glucose risk).",
        T.bowel,
        "Anti-epileptic only if seizures (no routine prophylaxis).",
        T.fever,
      ],
      tags: ["antiemetic", "pjp"],
      monitoring: [
        "Concurrent phase: FBC **weekly** (hold TMZ if ANC < 1.5 or platelets < 100 × 10⁹/L until recovery).",
        "Adjuvant: FBC day 21–22 and before each cycle (ANC ≥ 1.5, platelets ≥ 100); LFTs.",
        "MGMT promoter methylation status (prognostic/predictive).",
      ],
      precautions: ["Thrombocytopenia can be prolonged.", "Hepatotoxicity — check LFTs.", "Tumour Treating Fields can be added in the adjuvant phase (EF-14)."],
      doseMods: ["Adjuvant: dose levels 200 → 150 → 100 mg/m²; stop if 100 mg/m² is not tolerated.", "Concurrent: hold (do not reduce) for cytopenias; stop for grade 3–4 non-haematological toxicity."],
      references: [
        R.eviq(3364, "Glioblastoma temozolomide chemoradiation followed by temozolomide (overview)", "https://www.eviq.org.au/medical-oncology/neurological/glioma/3364-glioblastoma-temozolomide-chemoradiation-foll"),
        R.nccn("Central Nervous System Cancers"),
        R.trial("Stupp R et al. N Engl J Med 2005"),
      ],
    },
    {
      id: "doxorubicin-ifosfamide",
      name: "AI: doxorubicin + ifosfamide (soft tissue sarcoma)",
      shortName: "AI",
      setting: "inpatient",
      settingNote: "4-day admission (ifosfamide with mesna and hydration)",
      group: "Sarcoma",
      intent: "Palliative (or neoadjuvant/curative in selected cases)",
      indications: [
        "Advanced or metastatic soft tissue sarcoma when tumour shrinkage is the goal (higher response than doxorubicin alone — EORTC 62012).",
        "Selected neoadjuvant/adjuvant use in high-risk extremity/trunk sarcoma.",
      ],
      cycle: { length: "21 days", count: "Up to 6 cycles" },
      emetogenic: "high",
      fnRisk: "high",
      alerts: [
        "Ifosfamide **encephalopathy**: check conscious level/confusion every shift; stop ifosfamide and give methylene blue if it develops.",
        "Ifosfamide needs **mesna** and hydration (haemorrhagic cystitis). Test urine for blood daily.",
      ],
      drugs: [
        { drug: "doxorubicin", dose: 25, unit: "mg/m2", route: "IV push", days: "Days 1–3", admin: "Over 5–15 min into a fast-running drip (total 75 mg/m²). **Vesicant.**" },
        { drug: "mesna", label: "Mesna (before ifosfamide)", dose: 500, unit: "mg/m2", route: "IV", days: "Days 1–4", admin: "IV bolus/short infusion before ifosfamide (eviQ ID 1659 schedule)." },
        { drug: "ifosfamide", dose: 2500, unit: "mg/m2", route: "IV infusion", days: "Days 1–4", admin: "In 1000 mL sodium chloride 0.9% over 1–3 hours (total 10 g/m²). Hydration ≥ 2–3 L/day." },
        { drug: "mesna", label: "Mesna (after ifosfamide)", dose: 1500, unit: "mg/m2", route: "IV infusion", days: "Days 1–4", admin: "Infusion after ifosfamide, followed by oral mesna 2000 mg (per eviQ) — total mesna exceeds the ifosfamide dose." },
        { drug: "filgrastim", label: "Pegfilgrastim", dose: 6, unit: "mg", route: "SC", days: "Day 5", admin: "Primary prophylaxis." },
      ],
      order: ["Antiemetics", "Pre-hydration", "Doxorubicin (days 1–3)", "Mesna", "Ifosfamide", "Mesna + post-hydration"],
      premeds: [T.hecMultiDay],
      takeHome: ["Oral mesna as prescribed (repeat if vomited within 2 h).", T.gcsfPrimary, "Drink 2–3 L/day and report blood in urine.", T.fever],
      tags: ["antiemetic", "gcsf", "mesna", "hydration", "cardiac", "extravasation", "fertility"],
      monitoring: [
        "Baseline: LVEF, UEC, LFTs, albumin (low albumin raises encephalopathy risk), phosphate, bicarbonate.",
        "Daily: UEC, urinalysis for blood, neuro observations, fluid balance.",
        "Before each cycle: FBC, UEC, phosphate/bicarbonate (Fanconi syndrome), LVEF if cumulative doxorubicin high.",
      ],
      precautions: [
        "Cumulative doxorubicin: 6 cycles = 450 mg/m² (consider dexrazoxane or stopping anthracycline earlier).",
        "Methylene blue 50 mg IV every 4–6 h for encephalopathy (avoid with serotonergic drugs — serotonin syndrome).",
        "Sperm banking / fertility counselling before treatment.",
      ],
      doseMods: ["Encephalopathy grade ≥ 2: stop ifosfamide this cycle; next cycle consider reduction and prophylactic methylene blue.", "Haematuria: increase mesna/hydration; stop ifosfamide for gross haematuria."],
      references: [
        R.eviq(1659, "Soft tissue sarcoma locally advanced or metastatic doxorubicin and ifosfamide", "https://www.eviq.org.au/medical-oncology/sarcoma/soft-tissue-sarcoma/1659-soft-tissue-sarcoma-locally-advanced-or-metas"),
        R.nccn("Soft Tissue Sarcoma"),
        R.trial("Judson I et al. EORTC 62012, Lancet Oncol 2014"),
      ],
    },
    {
      id: "pembrolizumab-mono",
      name: "Pembrolizumab monotherapy",
      shortName: "Pembrolizumab",
      setting: "outpatient",
      settingNote: "about 1 hour",
      group: "Immunotherapy",
      intent: "Palliative or adjuvant (indication specific)",
      indications: [
        "Examples: NSCLC with PD-L1 ≥ 50% (first line); melanoma (adjuvant and metastatic); MSI-high/dMMR solid tumours; head & neck SCC (CPS ≥ 1); urothelial, renal (adjuvant), cervical, Hodgkin lymphoma and others — check the current approved indication.",
      ],
      cycle: { length: "21 or 42 days", count: "Usually up to 2 years (35 cycles q3w) or 1 year adjuvant, or until progression/toxicity" },
      emetogenic: "minimal",
      fnRisk: "low",
      drugs: [
        { drug: "pembrolizumab", dose: 200, unit: "mg", doseNote: "every 3 weeks — or 400 mg every 6 weeks", route: "IV infusion", days: "Day 1", admin: "In sodium chloride 0.9% over 30 min with a 0.2–5 micron in-line filter." },
      ],
      premeds: [T.minimal, "No routine premedication."],
      takeHome: [T.irae],
      tags: ["irae"],
      monitoring: [
        "Baseline: FBC, UEC, LFTs, glucose, TFTs, cortisol; consider troponin/ECG if cardiac risk. " + T.hbvScreen,
        "Before each dose: UEC, LFTs, glucose; TFTs every 6 weeks.",
      ],
      precautions: [
        "Avoid starting with high-dose steroids or immunosuppressants if possible (may reduce efficacy).",
        "Autoimmune disease or organ transplant: discuss risks before starting.",
        "Pseudoprogression can occur — confirm progression with repeat imaging.",
      ],
      doseMods: ["No dose reductions. Hold for grade 2 irAEs (most), permanently stop for most grade 4 and some grade 3 irAEs (see irAE page)."],
      references: [R.nccnSupportive("Management of Immunotherapy-Related Toxicities"), R.nccn("disease-specific guidelines (NSCLC, Melanoma, Head and Neck, etc.)")],
    },
  ]);
})();

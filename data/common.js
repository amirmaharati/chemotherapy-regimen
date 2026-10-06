/*
 * Shared reference helpers and repeated text used by the regimen files.
 * Keep wording here so a change (e.g. a new antiemetic standard) updates every regimen at once.
 */
(function () {
  "use strict";

  const NCCN_TREATMENT = "https://www.nccn.org/guidelines/category_1";
  const NCCN_SUPPORTIVE = "https://www.nccn.org/guidelines/category_3";

  ONCO.ref = {
    nccn: function (guideline) {
      return { label: "NCCN Guidelines®: " + guideline, url: NCCN_TREATMENT };
    },
    nccnSupportive: function (guideline) {
      return { label: "NCCN Guidelines®: " + guideline, url: NCCN_SUPPORTIVE };
    },
    eviq: function (id, title, url) {
      return { label: "eviQ protocol ID " + id + " — " + title, url: url };
    },
    trial: function (label) {
      return { label: label };
    },
  };

  ONCO.text = {
    // Antiemetics (NCCN Antiemesis; MASCC/ESMO)
    hec:
      "**Antiemetics — high emetic risk (NCCN 4-drug):** NK1 antagonist (aprepitant 125 mg PO or fosaprepitant 150 mg IV) + 5-HT3 antagonist (e.g. ondansetron 8–16 mg IV/PO, granisetron, or palonosetron 0.25 mg IV) + dexamethasone 12 mg PO/IV + olanzapine 5–10 mg PO, 30–60 min before chemotherapy.",
    hecHome:
      "Antiemetics days 2–4: olanzapine 5–10 mg PO at night; aprepitant 80 mg PO days 2–3 (only if oral aprepitant 125 mg was used on day 1); dexamethasone 8 mg PO once daily days 2–4.",
    hecHomeAC:
      "Antiemetics days 2–4: olanzapine 5–10 mg PO at night; aprepitant 80 mg PO days 2–3 (if oral aprepitant was used on day 1). Dexamethasone on days 2–3 is optional with anthracycline + cyclophosphamide (NCCN).",
    hecMultiDay:
      "**Antiemetics — multi-day high emetic risk:** 5-HT3 antagonist daily (or palonosetron 0.25 mg IV on days 1, 3, 5) + dexamethasone daily + NK1 antagonist (e.g. aprepitant 125 mg day 1 then 80 mg daily; can extend through day 5) ± olanzapine 5–10 mg nightly. Continue dexamethasone 2 days after the last chemotherapy day (delayed nausea).",
    mec:
      "**Antiemetics — moderate emetic risk:** 5-HT3 antagonist (palonosetron preferred, or ondansetron/granisetron) + dexamethasone 8–12 mg PO/IV, 30–60 min before chemotherapy. Add an NK1 antagonist for carboplatin-based regimens (MASCC/ASCO) and for patients at higher risk or with poor control before (NCCN); eviQ also lists it for oxaliplatin.",
    mecHome:
      "Antiemetics days 2–3: dexamethasone 8 mg PO daily (or a 5-HT3 antagonist if palonosetron was not given on day 1); aprepitant 80 mg days 2–3 if aprepitant was started on day 1.",
    low: "**Antiemetics — low emetic risk:** one agent before chemotherapy — dexamethasone 8 mg, or metoclopramide 10 mg, or prochlorperazine 10 mg, or a 5-HT3 antagonist.",
    minimal: "**Antiemetics — minimal emetic risk:** no routine prophylaxis needed.",
    breakthrough:
      "Breakthrough nausea: metoclopramide 10 mg PO up to three times daily (max 5 days) or prochlorperazine 10 mg PO up to four times daily; add olanzapine 2.5–5 mg at night if not already used.",

    // Premedications
    taxPremed3w:
      "**Paclitaxel premedication** 30–60 min before: dexamethasone 20 mg IV/PO + antihistamine (e.g. promethazine 12.5–25 mg IV, diphenhydramine 25–50 mg IV or loratadine 10 mg PO) ± famotidine 20 mg IV.",
    taxPremedWeekly:
      "**Weekly paclitaxel premedication** 30–60 min before: dexamethasone 8–10 mg IV (may taper and stop after 2 reaction-free doses, per local policy) + antihistamine ± famotidine 20 mg IV.",
    docetaxelPremed:
      "**Docetaxel premedication:** dexamethasone 8 mg PO twice daily for 3 days, starting the day before chemotherapy (prevents hypersensitivity and fluid retention).",
    rituxPremed:
      "**Rituximab premedication** 30–60 min before: paracetamol 1 g PO + antihistamine (e.g. loratadine 10 mg PO or promethazine/diphenhydramine IV) ± hydrocortisone 100 mg IV (first infusion, or if a previous reaction).",
    pemetrexedVitamins:
      "**Pemetrexed vitamins:** folic acid 350–1000 micrograms PO daily starting ≥ 5–7 days before cycle 1 and until 21 days after the last dose; vitamin B12 1000 micrograms IM 1 week before cycle 1, then every 3 cycles. Dexamethasone 4 mg PO twice daily the day before, the day of and the day after pemetrexed (rash prevention).",
    cisplatinHydration:
      "**Cisplatin hydration:** pre-hydration 1 L sodium chloride 0.9% with magnesium sulfate 10 mmol ± potassium chloride 20 mmol over 1 h; post-hydration 1 L sodium chloride 0.9% over 1 h. Aim urine output ≥ 100 mL/h. Encourage 2–3 L oral fluid daily for 3 days.",

    // Take-home / prophylaxis
    fever:
      "Teach the patient: temperature ≥ 38 °C, rigors, or feeling suddenly unwell = go to hospital immediately (possible febrile neutropenia). Give a written alert card.",
    mouth: "Mouth care: soft toothbrush and bland mouthwash (sodium bicarbonate or salt water) 4 times daily.",
    bowel: "Laxatives for constipation (e.g. senna ± macrogol) — especially with vinca alkaloids, 5-HT3 antagonists and opioids.",
    loperamide:
      "Loperamide for diarrhoea: 4 mg at the first loose stool, then 2 mg every 2 hours (4 mg every 4 hours overnight) until 12 hours without diarrhoea (max 48 hours). Seek care if not settling, fever, or dizziness.",
    hbvProph:
      "**Hepatitis B:** test HBsAg and anti-HBc before starting. If either is positive, give entecavir 0.5 mg daily or tenofovir daily during treatment and for at least 12 months after the last anti-CD20 dose; monitor HBV DNA and LFTs.",
    hsv: "**HSV/VZV prophylaxis:** aciclovir 400–800 mg PO twice daily or valaciclovir 500 mg PO once to twice daily.",
    pjp: "**PJP prophylaxis:** trimethoprim–sulfamethoxazole 160/800 mg PO once daily or three times weekly. Alternatives: dapsone 100 mg daily (check G6PD), atovaquone 1500 mg daily, or inhaled pentamidine 300 mg monthly.",
    allopurinol:
      "**TLS prevention:** allopurinol 300 mg PO daily (reduce in renal impairment) starting 1–2 days before chemotherapy for 7–10 days, plus oral fluids 2–3 L/day. Use rasburicase instead for high TLS risk.",
    gcsfPrimary:
      "**G-CSF primary prophylaxis:** pegfilgrastim 6 mg SC once 24–72 h after chemotherapy, or filgrastim 5 micrograms/kg SC daily from 24–72 h after chemotherapy until neutrophil recovery.",
    irae:
      "Immunotherapy: report new cough or breathlessness, diarrhoea, rash, yellow skin/eyes, severe tiredness, headache or vision change at any time — even months after stopping (immune-related adverse events). Carry an immunotherapy alert card.",
    cold: "Oxaliplatin: avoid cold drinks, cold food and cold air for 3–5 days after each dose; wear gloves to handle cold items.",
    pump: "Home 5-FU pump: keep the pump below the level of the line, do not get it wet, and use the spill kit if it leaks; return for disconnection at 46 hours.",
    hbvScreen: "Hepatitis B (HBsAg, anti-HBc), hepatitis C and HIV testing before starting (ASCO recommends this for all patients starting systemic therapy).",
    contraception: "Effective contraception during treatment and for at least 6 months after (longer for some drugs). Discuss fertility preservation before starting.",
  };
})();

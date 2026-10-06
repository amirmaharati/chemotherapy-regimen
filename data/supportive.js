/*
 * Prophylaxis and supportive-care topics.
 * Topic ids match the regimen tags in ONCO.vocab.tags (regimens link here).
 * Section fields: heading, body[], bullets[], steps[], table {head[], rows[][]}, callout {type, text}, auto ("fnRisk" | "emetogenic")
 */
(function () {
  "use strict";
  const R = ONCO.ref;

  ONCO.addSupportive([
    {
      id: "antiemetic",
      title: "Antiemetic prophylaxis",
      summary: "Emetic risk of each drug and which antiemetics to give before and after chemotherapy (NCCN / MASCC).",
      keywords: ["nausea", "vomiting", "CINV", "ondansetron", "aprepitant", "olanzapine", "dexamethasone", "palonosetron"],
      sections: [
        {
          heading: "Key rules",
          bullets: [
            "Choose the antiemetic regimen by the **most emetogenic drug** in the regimen.",
            "Prevent rather than treat: give antiemetics before chemotherapy and cover the delayed phase (days 2–4).",
            "NCCN counts **any regimen with an anthracycline plus cyclophosphamide** (e.g. AC, CHOP) as high risk, and carboplatin AUC ≥ 4 as high risk.",
            "NK1 antagonists (aprepitant, fosaprepitant, netupitant) raise dexamethasone levels — that is why dexamethasone is 12 mg (not 20 mg) when given with them.",
          ],
        },
        {
          heading: "Emetic risk of IV anticancer drugs",
          table: {
            head: ["Risk (no prophylaxis)", "Examples"],
            rows: [
              ["**High** (> 90%)", "Cisplatin; anthracycline + cyclophosphamide (AC/CHOP); carboplatin AUC ≥ 4; cyclophosphamide > 1500 mg/m²; dacarbazine; doxorubicin ≥ 60 mg/m²; epirubicin > 90 mg/m²; ifosfamide ≥ 2 g/m² per dose; carmustine > 250 mg/m²; melphalan ≥ 140 mg/m²; trastuzumab deruxtecan; sacituzumab govitecan"],
              ["**Moderate** (30–90%)", "Carboplatin AUC < 4; oxaliplatin; irinotecan; cyclophosphamide ≤ 1500 mg/m²; doxorubicin < 60 mg/m²; daunorubicin; idarubicin; ifosfamide < 2 g/m²; bendamustine; azacitidine; cytarabine > 200 mg/m²; methotrexate ≥ 250 mg/m²; arsenic trioxide; temozolomide; thiotepa; busulfan"],
              ["**Low** (10–30%)", "Paclitaxel; docetaxel; nab-paclitaxel; 5-FU; gemcitabine; pemetrexed; etoposide; cytarabine 100–200 mg/m²; methotrexate 50–250 mg/m²; topotecan; mitomycin; eribulin; cabazitaxel; trastuzumab emtansine; polatuzumab vedotin; brentuximab vedotin"],
              ["**Minimal** (< 10%)", "Bleomycin; vincristine; vinblastine; vinorelbine; fludarabine; methotrexate ≤ 50 mg/m²; bortezomib; rituximab; trastuzumab; pertuzumab; bevacizumab; checkpoint inhibitors (pembrolizumab, nivolumab, atezolizumab, durvalumab)"],
            ],
          },
        },
        {
          heading: "Recommended prevention (NCCN)",
          table: {
            head: ["Risk", "Day 1 (before chemo)", "Days 2–4"],
            rows: [
              ["High", "**Preferred:** NK1 antagonist + 5-HT3 antagonist + dexamethasone 12 mg + olanzapine 5–10 mg. Other options: olanzapine + palonosetron + dexamethasone; or NK1 + 5-HT3 + dexamethasone.", "Olanzapine 5–10 mg days 2–4; aprepitant 80 mg days 2–3 (if oral aprepitant day 1); dexamethasone 8 mg days 2–4 (optional for AC)."],
              ["Moderate", "5-HT3 antagonist (palonosetron preferred) + dexamethasone 8–12 mg ± NK1 antagonist (higher-risk patients, carboplatin, oxaliplatin, irinotecan). Or olanzapine + palonosetron + dexamethasone.", "Dexamethasone 8 mg days 2–3, or 5-HT3 antagonist days 2–3 (if palonosetron not used); continue olanzapine/aprepitant if started."],
              ["Low", "One agent: dexamethasone 8 mg, metoclopramide 10 mg, prochlorperazine 10 mg, or a 5-HT3 antagonist.", "None routinely."],
              ["Minimal", "None routinely.", "None."],
            ],
          },
        },
        {
          heading: "Antiemetic doses",
          table: {
            head: ["Drug", "Usual adult dose", "Notes"],
            rows: [
              ["Aprepitant", "125 mg PO day 1, 80 mg PO days 2–3", "IV aprepitant emulsion 130 mg day 1 is an alternative."],
              ["Fosaprepitant", "150 mg IV day 1 (single dose)", "Infusion-site reactions possible."],
              ["Netupitant–palonosetron (NEPA)", "300 mg/0.5 mg PO day 1", "Fixed combination (NK1 + 5-HT3)."],
              ["Rolapitant", "180 mg PO day 1", "Does not raise dexamethasone levels."],
              ["Ondansetron", "16–24 mg PO or 8–16 mg IV day 1", "Max single IV dose 16 mg (QT prolongation). Constipation, headache."],
              ["Granisetron", "2 mg PO or 1 mg IV; transdermal patch 3.1 mg/24 h; ER SC 10 mg", "Patch applied 24–48 h before chemo."],
              ["Palonosetron", "0.25 mg IV (or 0.5 mg PO) day 1", "Long half-life; preferred 5-HT3 for moderate risk."],
              ["Dexamethasone", "12 mg with NK1 antagonist; 8–12 mg moderate; 8 mg days 2–4", "Watch glucose, insomnia."],
              ["Olanzapine", "5–10 mg PO at night days 1–4", "Use 5 mg (or 2.5 mg) in elderly/sedated patients."],
              ["Metoclopramide", "10 mg PO/IV up to 3 times daily", "Max 5 days (extrapyramidal effects)."],
              ["Prochlorperazine", "10 mg PO/IV every 6 h as needed", "Extrapyramidal effects."],
              ["Haloperidol", "0.5–2 mg PO/IV every 4–6 h as needed", "Breakthrough option."],
              ["Lorazepam", "0.5–2 mg PO/SL", "Anticipatory nausea, anxiety (night before and morning of chemo)."],
            ],
          },
        },
        {
          heading: "Breakthrough and special situations",
          bullets: [
            "**Breakthrough:** add a drug from a different class, give it regularly (not only as needed); check for other causes (bowel obstruction, constipation, brain metastases, hypercalcaemia, opioids, gastroparesis).",
            "**Anticipatory nausea:** best prevented by good control from cycle 1; lorazepam, relaxation, behavioural therapy.",
            "**Multi-day chemotherapy:** give the day-1 antiemetic for each chemo day and continue 2 days after the last (palonosetron may be repeated every other day).",
            "**Oral chemotherapy:** moderate–high risk (e.g. temozolomide > 75 mg/m²/day) → 5-HT3 antagonist before each dose; low/minimal → metoclopramide or prochlorperazine as needed.",
          ],
        },
        { heading: "Regimens in this app by emetic risk", auto: "emetogenic" },
      ],
      references: [R.nccnSupportive("Antiemesis"), R.trial("Herrstedt J et al. MASCC/ESMO antiemetic guideline update, ESMO Open 2024"), R.trial("Hesketh PJ et al. Antiemetics: ASCO guideline update, J Clin Oncol 2020")],
    },
    {
      id: "gcsf",
      title: "G-CSF (growth factor) support",
      summary: "When to give filgrastim or pegfilgrastim to prevent febrile neutropenia, with doses and timing.",
      keywords: ["filgrastim", "pegfilgrastim", "neulasta", "growth factor", "neutropenia", "FN risk"],
      sections: [
        {
          heading: "Primary prophylaxis (from cycle 1)",
          table: {
            head: ["Febrile neutropenia risk of regimen", "Action (NCCN)"],
            rows: [
              ["High (> 20%)", "**Give G-CSF.**"],
              ["Intermediate (10–20%)", "Give G-CSF if the patient has ≥ 1 risk factor (below)."],
              ["Low (< 10%)", "Not routinely."],
            ],
          },
        },
        {
          heading: "Patient risk factors",
          bullets: [
            "Age ≥ 65 years receiving full-dose chemotherapy.",
            "Previous chemotherapy or radiotherapy; persistent neutropenia; bone marrow involvement by tumour.",
            "Recent surgery or open wounds; poor performance status; HIV infection.",
            "Liver dysfunction (bilirubin > 2 mg/dL); renal dysfunction (CrCl < 50 mL/min).",
            "Previous febrile neutropenia.",
          ],
        },
        {
          heading: "Secondary prophylaxis",
          body: ["After an episode of febrile neutropenia or dose-limiting neutropenia, give G-CSF in later cycles — especially when treatment is curative and dose reduction would reduce cure rates. In palliative settings, dose reduction or delay is an alternative."],
        },
        {
          heading: "Drugs and doses",
          table: {
            head: ["Drug", "Dose", "Timing"],
            rows: [
              ["Filgrastim (and biosimilars)", "5 micrograms/kg SC daily (often rounded to 300 or 480 micrograms)", "Start 24–72 h after chemotherapy; continue until neutrophils recover past the nadir."],
              ["Pegfilgrastim (and biosimilars)", "6 mg SC once per cycle", "24–72 h after chemotherapy (or on-body injector applied on chemo day). Not within 14 days before the next chemo; not for weekly regimens."],
              ["Lipegfilgrastim / eflapegrastim", "6 mg / 13.2 mg SC once per cycle", "As for pegfilgrastim (availability varies)."],
            ],
          },
        },
        {
          heading: "Do not use routinely",
          bullets: [
            "**During concurrent chemoradiation involving the chest/mediastinum** (more thrombocytopenia and complications).",
            "For afebrile neutropenia.",
            "On the same day as myelosuppressive chemotherapy.",
            "ABVD for Hodgkin lymphoma: usually given on time without G-CSF regardless of neutrophil count.",
          ],
        },
        {
          heading: "Side effects",
          bullets: ["Bone pain (loratadine 10 mg daily for 5–7 days, paracetamol or NSAIDs can help).", "Rare: splenic rupture (left upper abdominal or shoulder-tip pain), ARDS, sickle-cell crisis, capillary leak, aortitis, glomerulonephritis."],
        },
        { heading: "Regimens in this app by febrile neutropenia risk", auto: "fnRisk" },
      ],
      references: [R.nccnSupportive("Hematopoietic Growth Factors"), R.trial("Smith TJ et al. Recommendations for the use of WBC growth factors: ASCO guideline, J Clin Oncol 2015")],
    },
    {
      id: "febrile-neutropenia",
      title: "Febrile neutropenia — emergency management",
      summary: "Definition, first-hour actions, empiric antibiotics and low-risk assessment (MASCC score).",
      keywords: ["fever", "neutropenic sepsis", "FN", "MASCC", "cefepime", "piperacillin", "meropenem"],
      sections: [
        {
          callout: { type: "danger", text: "**Treat as an emergency. Give empiric IV antibiotics within 60 minutes of arrival** — do not wait for the blood count if the patient had chemotherapy recently and is unwell." },
        },
        {
          heading: "Definition",
          bullets: [
            "Fever: single oral temperature ≥ 38.3 °C, or ≥ 38.0 °C sustained over 1 hour (NCCN). Many local protocols use ≥ 38.0 °C once.",
            "Neutropenia: ANC < 0.5 × 10⁹/L, or expected to fall below 0.5 × 10⁹/L within 48 hours.",
            "Patients on steroids or the elderly may not have fever — treat if unwell with suspected infection.",
          ],
        },
        {
          heading: "First hour",
          steps: [
            "Assess ABC, vital signs, sepsis screen; look for a source (lungs, mouth, perianal area — no rectal exam, skin, central line).",
            "Blood cultures: 2 sets (peripheral + each central line lumen); urine culture; other cultures as indicated.",
            "Bloods: FBC, UEC, LFTs, lactate, CRP; chest X-ray if respiratory symptoms.",
            "**Start empiric IV antibiotics** (below). Give IV fluids for hypotension; escalate to ICU if shocked.",
          ],
        },
        {
          heading: "Empiric antibiotics (high-risk / inpatient)",
          table: {
            head: ["Situation", "Antibiotic (adult, normal renal function)"],
            rows: [
              ["Standard", "Antipseudomonal β-lactam monotherapy: **cefepime 2 g IV every 8 h**, or **piperacillin–tazobactam 4.5 g IV every 6 h**, or meropenem 1 g IV every 8 h (preferred if ESBL risk or severe sepsis)."],
              ["Add vancomycin (gram-positive cover) if", "Haemodynamic instability; suspected catheter infection; skin/soft-tissue infection; pneumonia; MRSA colonisation; gram-positive cocci in blood culture; severe mucositis on fluoroquinolone prophylaxis."],
              ["Severe penicillin allergy", "Follow local policy (e.g. aztreonam + vancomycin ± aminoglycoside)."],
            ],
          },
        },
        {
          heading: "Low-risk patients (outpatient option)",
          body: ["MASCC score ≥ 21 (or CISNE score for solid tumours) with good support at home: after observation and the first dose of IV antibiotics, oral **ciprofloxacin 500–750 mg twice daily + amoxicillin–clavulanate 875/125 mg twice daily** (or moxifloxacin alone), with daily review."],
          table: {
            head: ["MASCC risk index item", "Points"],
            rows: [
              ["Burden of illness: no or mild symptoms", "5"],
              ["Burden of illness: moderate symptoms", "3"],
              ["No hypotension (systolic > 90 mmHg)", "5"],
              ["No chronic obstructive pulmonary disease", "4"],
              ["Solid tumour, or haematological cancer with no previous fungal infection", "4"],
              ["No dehydration needing IV fluids", "3"],
              ["Outpatient when fever started", "3"],
              ["Age < 60 years", "2"],
            ],
          },
        },
        {
          heading: "After starting treatment",
          bullets: [
            "Review cultures at 48–72 h; narrow or stop vancomycin if no gram-positive infection.",
            "Persistent fever 4–7 days in high-risk patients: CT chest, fungal markers, consider empiric/pre-emptive antifungal.",
            "Continue until afebrile ≥ 48 h and neutrophils recovering (or treat a documented infection for its full course).",
            "Therapeutic G-CSF: consider for high-risk features (age > 65, sepsis, ANC < 0.1, pneumonia, invasive fungal infection, expected long neutropenia).",
          ],
        },
      ],
      references: [R.nccnSupportive("Prevention and Treatment of Cancer-Related Infections"), R.trial("Taplitz RA et al. Outpatient management of fever and neutropenia: ASCO/IDSA guideline, J Clin Oncol 2018"), R.trial("Klastersky J et al. MASCC risk index, J Clin Oncol 2000")],
    },
    {
      id: "hbv",
      title: "Hepatitis B screening and prophylaxis",
      summary: "Who to test, and when to give entecavir or tenofovir to prevent HBV reactivation.",
      keywords: ["hepatitis B", "HBsAg", "anti-HBc", "entecavir", "tenofovir", "reactivation", "rituximab"],
      sections: [
        {
          heading: "Screening",
          bullets: [
            "Test **all patients before systemic anticancer therapy** (ASCO 2020): HBsAg, anti-HBc (total or IgG) and anti-HBs. Also hepatitis C antibody and HIV.",
            "Highest reactivation risk: anti-CD20 antibodies (rituximab, obinutuzumab), stem cell transplant, high-dose steroids, anthracyclines in HBsAg-positive patients.",
          ],
        },
        {
          heading: "What to do",
          table: {
            head: ["Result", "Action"],
            rows: [
              ["**HBsAg positive** (chronic HBV)", "Start antiviral before or with the first chemotherapy: **entecavir 0.5 mg PO daily** or **tenofovir** (TDF 300 mg or TAF 25 mg PO daily). Continue ≥ 12 months after treatment ends (≥ 12–18 months after anti-CD20). Check HBV DNA; refer to hepatology."],
              ["**HBsAg negative, anti-HBc positive** (past infection)", "Anti-CD20 or stem cell transplant: **give prophylaxis** (entecavir or tenofovir) during and ≥ 12 months after. Other therapy: monitor ALT and HBV DNA every 1–3 months and treat if DNA becomes detectable — or give prophylaxis."],
              ["All negative", "No prophylaxis. Consider HBV vaccination."],
            ],
          },
        },
        {
          heading: "Notes",
          bullets: ["Avoid lamivudine for long courses (resistance).", "Adjust entecavir/tenofovir for renal function.", "HCV-positive: refer for direct-acting antiviral treatment; check interactions."],
        },
      ],
      references: [R.nccnSupportive("Prevention and Treatment of Cancer-Related Infections"), R.trial("Hwang JP et al. Hepatitis B virus screening and management for patients with cancer: ASCO provisional clinical opinion update, J Clin Oncol 2020")],
    },
    {
      id: "hsv-vzv",
      title: "HSV / VZV antiviral prophylaxis (and CMV)",
      summary: "Aciclovir or valaciclovir for bortezomib, leukaemia, purine analogues, bendamustine and transplant.",
      keywords: ["aciclovir", "acyclovir", "valaciclovir", "zoster", "shingles", "herpes", "CMV", "letermovir"],
      sections: [
        {
          heading: "Who needs HSV/VZV prophylaxis",
          bullets: [
            "Acute leukaemia during induction/consolidation; allogeneic or autologous stem cell transplant.",
            "Proteasome inhibitors (bortezomib, carfilzomib) and anti-CD38 antibodies (daratumumab).",
            "Purine analogues (fludarabine, cladribine), alemtuzumab, bendamustine.",
            "CAR-T cell therapy and bispecific antibodies.",
          ],
        },
        {
          heading: "Drugs",
          table: {
            head: ["Drug", "Dose (normal renal function)"],
            rows: [
              ["Aciclovir", "400–800 mg PO twice daily"],
              ["Valaciclovir", "500 mg PO once or twice daily"],
              ["Famciclovir", "250 mg PO twice daily"],
            ],
          },
          bullets: ["Duration: during treatment and until immune recovery (e.g. ≥ 2 months after alemtuzumab and until CD4 > 200 cells/µL; months after purine analogues/bendamustine).", "Reduce doses in renal impairment."],
        },
        {
          heading: "CMV",
          bullets: [
            "Allogeneic transplant (CMV-seropositive recipient): letermovir prophylaxis to day 100 (up to 200) and CMV PCR monitoring.",
            "Alemtuzumab: CMV PCR monitoring with pre-emptive treatment.",
          ],
        },
        {
          heading: "Vaccination",
          body: ["Recombinant (non-live) zoster vaccine is recommended for adults on or about to start immunosuppressive therapy — ideally before treatment. **No live vaccines** during chemotherapy."],
        },
      ],
      references: [R.nccnSupportive("Prevention and Treatment of Cancer-Related Infections")],
    },
    {
      id: "pjp",
      title: "PJP (Pneumocystis) prophylaxis",
      summary: "Trimethoprim–sulfamethoxazole for ALL, temozolomide with RT, purine analogues, prolonged steroids and more.",
      keywords: ["pneumocystis", "PCP", "co-trimoxazole", "Bactrim", "Septrin", "dapsone", "atovaquone", "pentamidine"],
      sections: [
        {
          heading: "Who needs PJP prophylaxis (NCCN)",
          bullets: [
            "Acute lymphoblastic leukaemia — throughout treatment.",
            "Allogeneic stem cell transplant; autologous transplant (3–6 months).",
            "Alemtuzumab (≥ 2 months after and until CD4 > 200 cells/µL); purine analogues (fludarabine, cladribine); PI3K inhibitors (idelalisib).",
            "**Temozolomide with radiotherapy** — until lymphocyte recovery.",
            "**Prolonged corticosteroids:** ≥ 20 mg prednisolone (or equivalent) daily for ≥ 4 weeks.",
            "Often used with bendamustine, DA-EPOCH-R, R-ICE/R-DHAP salvage, CAR-T and bispecific antibodies.",
          ],
        },
        {
          heading: "Drugs",
          table: {
            head: ["Drug", "Dose", "Watch for"],
            rows: [
              ["**Trimethoprim–sulfamethoxazole (first choice)**", "160/800 mg (1 DS tablet) once daily or three times weekly; or 80/400 mg (SS) daily", "Rash, cytopenias, hyperkalaemia, raised creatinine. **Stop around high-dose methotrexate.**"],
              ["Dapsone", "100 mg PO daily", "Check **G6PD** first; methaemoglobinaemia, haemolysis."],
              ["Atovaquone", "1500 mg PO daily with food", "GI upset; expensive."],
              ["Pentamidine", "300 mg nebulised every 4 weeks (or 4 mg/kg IV monthly)", "Less effective; bronchospasm."],
            ],
          },
        },
        { heading: "Bonus protection", body: ["Trimethoprim–sulfamethoxazole also prevents toxoplasmosis and some bacterial infections."] },
      ],
      references: [R.nccnSupportive("Prevention and Treatment of Cancer-Related Infections")],
    },
    {
      id: "antifungal",
      title: "Antifungal prophylaxis",
      summary: "Posaconazole for AML/MDS induction, echinocandins near vincristine, and key azole interactions.",
      keywords: ["posaconazole", "fluconazole", "voriconazole", "micafungin", "aspergillus", "candida", "azole"],
      sections: [
        {
          heading: "Who needs it",
          table: {
            head: ["Setting", "Suggested prophylaxis"],
            rows: [
              ["AML / high-risk MDS induction or re-induction (neutropenic)", "**Posaconazole** delayed-release tablets 300 mg twice daily day 1, then 300 mg daily (NCCN category 1), until neutrophil recovery. Alternatives: voriconazole, isavuconazole, micafungin 50–100 mg IV daily, liposomal amphotericin."],
              ["ALL (vincristine-containing)", "**Avoid azoles around vincristine** (severe neurotoxicity). Use micafungin (or fluconazole with caution, per local policy)."],
              ["Allogeneic transplant", "Fluconazole (pre-engraftment) or a mould-active azole; posaconazole for GVHD on high-dose steroids."],
              ["Solid tumours / most lymphoma", "Not routinely."],
            ],
          },
        },
        {
          heading: "Important interactions (azoles inhibit CYP3A4)",
          bullets: [
            "**Vincristine / vinblastine / vinorelbine** → severe neuropathy, ileus.",
            "**Venetoclax** → reduce dose (posaconazole: 70 mg; voriconazole: 100 mg; moderate inhibitors: 50%).",
            "Ibrutinib, midostaurin, ciclosporin/tacrolimus, some TKIs; QT-prolonging drugs (arsenic trioxide, ondansetron).",
            "Therapeutic drug monitoring for posaconazole (prophylaxis trough > 0.7 mg/L) and voriconazole.",
          ],
        },
      ],
      references: [R.nccnSupportive("Prevention and Treatment of Cancer-Related Infections")],
    },
    {
      id: "antibacterial",
      title: "Antibacterial prophylaxis",
      summary: "Fluoroquinolone prophylaxis for expected prolonged, profound neutropenia.",
      keywords: ["levofloxacin", "ciprofloxacin", "fluoroquinolone", "neutropenia"],
      sections: [
        {
          heading: "Who",
          bullets: [
            "Expected ANC < 0.1 × 10⁹/L for > 7 days (e.g. AML/MDS induction, intensive ALL, stem cell transplant).",
            "Not routine for most solid tumour chemotherapy (low risk).",
          ],
        },
        {
          heading: "What",
          bullets: [
            "**Levofloxacin 500–750 mg PO daily** (or ciprofloxacin 500 mg twice daily), from the start of neutropenia until recovery or until IV antibiotics start.",
            "Downsides: resistance, C. difficile, QT prolongation, tendinopathy.",
            "Asplenia / chronic GVHD: penicillin V (encapsulated organisms).",
          ],
        },
      ],
      references: [R.nccnSupportive("Prevention and Treatment of Cancer-Related Infections")],
    },
    {
      id: "tls",
      title: "Tumour lysis syndrome (TLS) prevention",
      summary: "Risk groups, hydration, allopurinol, rasburicase and monitoring.",
      keywords: ["tumor lysis", "allopurinol", "rasburicase", "uric acid", "hyperkalaemia", "Cairo-Bishop", "G6PD"],
      sections: [
        {
          heading: "Laboratory TLS (Cairo–Bishop)",
          body: ["Two or more of the following from 3 days before to 7 days after treatment: uric acid ≥ 476 µmol/L (8 mg/dL); potassium ≥ 6.0 mmol/L; phosphate ≥ 1.45 mmol/L (4.5 mg/dL); calcium ≤ 1.75 mmol/L (7 mg/dL) — or a 25% change from baseline. **Clinical TLS** = laboratory TLS plus creatinine ≥ 1.5 × ULN, arrhythmia/sudden death, or seizure."],
        },
        {
          heading: "Risk groups",
          table: {
            head: ["Risk", "Examples"],
            rows: [
              ["High", "Burkitt lymphoma/leukaemia; B-ALL with WBC ≥ 100 × 10⁹/L or LDH ≥ 2 × ULN; AML with WBC ≥ 100; bulky lymphoblastic lymphoma; CLL starting venetoclax with high tumour burden; existing renal impairment with intermediate-risk disease."],
              ["Intermediate", "AML with WBC 25–100; ALL with WBC < 100 and LDH < 2 × ULN; DLBCL with raised LDH (non-bulky); AML starting venetoclax."],
              ["Low", "Most solid tumours; indolent lymphoma; myeloma (most); CML."],
            ],
          },
        },
        {
          heading: "Prevention by risk",
          table: {
            head: ["Risk", "Prevention", "Monitoring"],
            rows: [
              ["Low", "Oral/IV hydration ± allopurinol.", "Daily labs while treating (first days)."],
              ["Intermediate", "IV hydration 2–3 L/m²/day (if heart allows); **allopurinol** 300 mg daily (100–300 mg every 8 h, max 800 mg/day; reduce for renal function), start 1–2 days before for 3–7 days. Febuxostat 80–120 mg daily is an alternative.", "Labs every 8–12 h for 24–48 h. Rasburicase if uric acid rises."],
              ["High", "IV hydration ~3 L/m²/day; **rasburicase** 0.2 mg/kg IV daily (up to 5 days) — many centres use a single fixed dose of 3–6 mg and repeat if needed.", "Labs every 4–6 h; cardiac monitoring; nephrology aware."],
            ],
          },
        },
        {
          heading: "Rasburicase cautions",
          bullets: [
            "**Contraindicated in G6PD deficiency** (haemolysis, methaemoglobinaemia) — test G6PD first in at-risk populations.",
            "Uric acid samples must be sent **on ice** (rasburicase keeps working in the tube).",
            "Do not combine with allopurinol on the same day (allopurinol not needed while on rasburicase).",
          ],
        },
        {
          heading: "Other points",
          bullets: [
            "Urine alkalinisation is **not** recommended (calcium phosphate precipitation) — except for high-dose methotrexate.",
            "No potassium or phosphate in IV fluids. Treat hyperkalaemia promptly. Early dialysis for refractory hyperkalaemia, fluid overload or severe AKI.",
          ],
        },
      ],
      references: [R.trial("Cairo MS, Bishop M. Br J Haematol 2004; Coiffier B et al. TLS guidelines, J Clin Oncol 2008"), R.nccn("disease guidelines (AML, ALL, B-Cell Lymphomas, CLL)")],
    },
    {
      id: "hydration",
      title: "Hydration and kidney protection (cisplatin, ifosfamide)",
      summary: "Pre- and post-hydration with magnesium for cisplatin; general nephroprotection.",
      keywords: ["cisplatin hydration", "magnesium", "nephrotoxicity", "mannitol", "kidney"],
      sections: [
        {
          heading: "Cisplatin hydration — principles",
          bullets: [
            "Check CrCl before each dose (full dose usually needs ≥ 60 mL/min).",
            "Pre-hydrate and post-hydrate with sodium chloride 0.9%; add **magnesium** (and usually potassium) to the pre-hydration.",
            "Aim urine output ≥ 100 mL/h during and after; encourage 2–3 L oral fluid daily for 3 days.",
            "Mannitol (12.5–25 g) is optional (local policy); use furosemide only for fluid overload.",
            "Avoid nephrotoxins near the dose: NSAIDs, aminoglycosides, IV contrast.",
          ],
        },
        {
          heading: "Example schedules",
          table: {
            head: ["Cisplatin dose", "Example hydration"],
            rows: [
              ["Weekly 25–40 mg/m²", "1 L sodium chloride 0.9% + magnesium sulfate 10 mmol over 1 h before; 500 mL–1 L after."],
              ["60–100 mg/m² (single day)", "1 L sodium chloride 0.9% + magnesium sulfate 10 mmol ± KCl 20 mmol over 1–2 h; cisplatin in 1 L sodium chloride 0.9% over 1–2 h; 1 L sodium chloride 0.9% over 1–2 h after."],
              ["Multi-day (e.g. BEP 20 mg/m² × 5)", "1 L before and after each daily dose, with daily Mg/K replacement; strict fluid balance and daily weight."],
              ["24-hour infusion (e.g. R-DHAP)", "Continuous hydration ≥ 3 L/day with Mg/K; monitor electrolytes daily."],
            ],
          },
        },
        {
          heading: "After treatment",
          bullets: ["Check magnesium and potassium weekly; oral magnesium if low.", "Hearing and neuropathy check before each cycle."],
        },
      ],
      references: [R.eviq(291, "Head and neck cisplatin (three weekly) chemoradiation — hydration example", "https://www.eviq.org.au/medical-oncology/head-and-neck/definitive-chemoradiation/291-head-and-neck-scc-locally-advanced-definitive")],
    },
    {
      id: "mesna",
      title: "Mesna (bladder protection)",
      summary: "Preventing haemorrhagic cystitis with ifosfamide and high-dose cyclophosphamide.",
      keywords: ["haemorrhagic cystitis", "hemorrhagic cystitis", "acrolein", "ifosfamide", "uromitexan"],
      sections: [
        {
          heading: "Who needs mesna",
          bullets: ["**Ifosfamide — always.**", "High-dose or fractionated cyclophosphamide (e.g. Hyper-CVAD, transplant conditioning)."],
        },
        {
          heading: "Schedules",
          table: {
            head: ["Ifosfamide schedule", "Mesna"],
            rows: [
              ["Short infusion (1–3 h)", "IV mesna 20% of the ifosfamide dose at 0, 4 and 8 h (total 60%) — or 20% IV at 0 h then oral 40% at 2 and 6 h."],
              ["24-hour continuous infusion", "Mesna equal to the ifosfamide dose in the same 24-h period, then continue for 12–24 h after ifosfamide ends."],
              ["Hyper-CVAD cyclophosphamide", "Mesna 600 mg/m²/day continuous, from 1 h before the first dose to 12 h after the last."],
            ],
          },
          bullets: ["Oral mesna ≈ 2 × IV dose (bioavailability ~50%). Repeat oral dose if vomited within 2 h."],
        },
        {
          heading: "Monitoring",
          bullets: [
            "Hydration ≥ 2–3 L/day; urinalysis for blood daily.",
            "Microscopic haematuria → increase hydration and mesna. Gross haematuria → stop ifosfamide, urology review.",
            "Late haemorrhagic cystitis after transplant may be viral (BK virus).",
          ],
        },
      ],
      references: [R.trial("Hensley ML et al. ASCO chemotherapy and radiotherapy protectants guideline, J Clin Oncol 2009")],
    },
    {
      id: "hd-mtx",
      title: "High-dose methotrexate (HD-MTX) care",
      summary: "Checks, hydration and alkalinisation, leucovorin rescue, methotrexate levels and glucarpidase.",
      keywords: ["methotrexate levels", "leucovorin rescue", "glucarpidase", "urine pH", "alkalinisation", "sodium bicarbonate"],
      sections: [
        {
          callout: { type: "danger", text: "HD-MTX (≥ 500 mg/m²) can cause fatal kidney injury and toxicity if clearance is delayed. **Leucovorin must be given on time** and levels checked daily until < 0.1 µmol/L (or protocol target)." },
        },
        {
          heading: "Before starting",
          bullets: [
            "CrCl ideally ≥ 60 mL/min; normal-ish LFTs; no significant third-space fluid (**drain pleural effusions/ascites**).",
            "Stop interacting drugs 24–48 h before until MTX clears: **PPIs, NSAIDs/aspirin, penicillins, trimethoprim–sulfamethoxazole, probenecid, ciprofloxacin**, levetiracetam (reported). Avoid IV contrast.",
            "Baseline weight and fluid balance chart.",
          ],
        },
        {
          heading: "Hydration and alkalinisation",
          bullets: [
            "IV fluid ~2.5–3 L/m²/day with sodium bicarbonate (e.g. 50–150 mmol/L), starting 4–12 h before MTX.",
            "**Urine pH ≥ 7.0 before starting** and maintained until MTX < 0.1 µmol/L. Check pH with every void. Extra bicarbonate (or acetazolamide) if pH < 7.",
            "Urine output target ≥ 100 mL/m²/h; furosemide only for fluid overload.",
          ],
        },
        {
          heading: "Leucovorin rescue and levels",
          bullets: [
            "Start leucovorin at the protocol time (usually 24–36 h after the start of MTX) — e.g. 15 mg/m² IV/PO every 6 h.",
            "MTX levels typically at 24, 48 and 72 h, then daily. Typical targets (protocol specific): 48 h < 1 µmol/L; 72 h < 0.1–0.2 µmol/L.",
            "High levels or rising creatinine → increase leucovorin per nomogram, increase hydration, keep urine alkaline.",
          ],
        },
        {
          heading: "Glucarpidase",
          bullets: [
            "Consider when MTX levels are far above the expected curve **with acute kidney injury** (consensus guideline, Ramsey 2018), ideally within 48–60 h of the start of MTX.",
            "Dose 50 units/kg IV over 5 minutes. Continue leucovorin but separate by ≥ 2 h.",
            "After glucarpidase, standard MTX immunoassays are unreliable for ~48 h (use LC-MS if available).",
          ],
        },
        {
          heading: "Toxicity monitoring",
          bullets: ["Daily: creatinine, electrolytes, LFTs, FBC, mucositis, neurological status.", "Restart trimethoprim–sulfamethoxazole and PPIs only after MTX has cleared."],
        },
      ],
      references: [R.trial("Ramsey LB et al. Consensus guideline for use of glucarpidase, The Oncologist 2018"), R.trial("Howard SC et al. Preventing and managing toxicities of high-dose methotrexate, The Oncologist 2016")],
    },
    {
      id: "eye-drops",
      title: "Steroid eye drops for high-dose cytarabine",
      summary: "Preventing cytarabine keratoconjunctivitis (doses ≥ 1 g/m²).",
      keywords: ["HiDAC", "conjunctivitis", "keratitis", "prednisolone eye drops", "dexamethasone eye drops"],
      sections: [
        {
          heading: "Who",
          body: ["Any cytarabine dose ≥ 1 g/m² (HiDAC consolidation, Hyper-CVAD B, R-DHAP, FLAG-Ida, MATRix)."],
        },
        {
          heading: "Regimen",
          bullets: [
            "**Dexamethasone 0.1% or prednisolone 1% eye drops, 1–2 drops in each eye every 6 hours** (4 times daily; some protocols every 2–4 h while awake).",
            "Start before (or with) the first cytarabine dose; continue for **48–72 hours after the last dose** (eviQ: at least 72 h).",
          ],
        },
        {
          heading: "Also check",
          bullets: [
            "Cerebellar function before **every** HiDAC dose (nystagmus, slurred speech, finger–nose, gait, handwriting). Stop cytarabine permanently if abnormal.",
            "Eye pain, photophobia or blurred vision → ophthalmology review.",
          ],
        },
      ],
      references: [R.eviq(347, "AML FLAG-Ida (eye drop instructions)", "https://www.eviq.org.au/haematology/leukaemias/acute-myeloid-leukaemia/347-acute-myeloid-leukaemia-flag-ida-fludarabine")],
    },
    {
      id: "vte",
      title: "VTE (blood clot) prophylaxis",
      summary: "Aspirin or LMWH with lenalidomide/thalidomide; when to consider DOAC prophylaxis in ambulatory patients.",
      keywords: ["thrombosis", "DVT", "pulmonary embolism", "aspirin", "enoxaparin", "apixaban", "Khorana", "lenalidomide"],
      sections: [
        {
          heading: "IMiDs (lenalidomide, thalidomide, pomalidomide)",
          table: {
            head: ["VTE risk", "Prophylaxis"],
            rows: [
              ["Standard (0–1 risk factor)", "Aspirin 75–325 mg daily (commonly 100 mg)."],
              ["High (prior VTE, high-dose dexamethasone, doxorubicin or multi-agent chemo, immobility, BMI ≥ 30, etc.)", "LMWH (e.g. enoxaparin 40 mg SC daily) or therapeutic warfarin; DOACs (e.g. apixaban 2.5 mg twice daily) increasingly used."],
            ],
          },
        },
        {
          heading: "Ambulatory solid tumour patients",
          bullets: [
            "Khorana score ≥ 2: consider apixaban 2.5 mg twice daily or rivaroxaban 10 mg daily if bleeding risk is low (AVERT, CASSINI; ASCO 2023).",
            "Hospitalised cancer patients: pharmacological prophylaxis unless contraindicated.",
          ],
        },
        {
          heading: "Platelet thresholds",
          bullets: ["Prophylactic LMWH: usually hold if platelets < 25–30 × 10⁹/L. Therapeutic anticoagulation: adjust if platelets < 50 × 10⁹/L."],
        },
      ],
      references: [R.trial("Key NS et al. VTE prophylaxis and treatment in cancer: ASCO guideline update, J Clin Oncol 2023"), R.nccnSupportive("Cancer-Associated Venous Thromboembolic Disease")],
    },
    {
      id: "cardiac",
      title: "Cardiac monitoring (anthracyclines, HER2 drugs, others)",
      summary: "LVEF checks, cumulative anthracycline limits and drug-specific heart risks.",
      keywords: ["cardiotoxicity", "LVEF", "echo", "MUGA", "anthracycline", "trastuzumab", "dexrazoxane", "cumulative dose"],
      sections: [
        {
          heading: "Anthracyclines",
          bullets: [
            "Baseline LVEF (echo or MUGA) and cardiovascular risk assessment (ESC 2022 cardio-oncology guideline).",
            "Repeat echo at end of treatment and at 12 months, earlier if high risk or high cumulative dose. Troponin/NT-proBNP can help.",
            "Dexrazoxane can be used for cardioprotection (e.g. doxorubicin > 300 mg/m² in metastatic disease).",
          ],
          table: {
            head: ["Drug", "Lifetime cumulative limit (approx.)", "Doxorubicin-equivalent factor (ESC)"],
            rows: [
              ["Doxorubicin", "450–550 mg/m² (lower with chest RT or heart disease)", "1"],
              ["Epirubicin", "900 mg/m²", "0.8"],
              ["Daunorubicin", "550 mg/m² (400 with chest RT)", "0.6"],
              ["Idarubicin", "~150 mg/m² (IV)", "5"],
              ["Mitoxantrone", "140 mg/m²", "10"],
            ],
          },
        },
        {
          heading: "HER2-targeted therapy (trastuzumab, pertuzumab, T-DM1)",
          bullets: [
            "LVEF at baseline and every 3 months.",
            "Hold if LVEF falls ≥ 16 points from baseline, or below normal with a ≥ 10-point fall; recheck in 4 weeks. Start heart-failure therapy and involve cardio-oncology.",
          ],
        },
        {
          heading: "Other drugs",
          bullets: [
            "5-FU / capecitabine: coronary vasospasm — stop, ECG, troponin.",
            "Immune checkpoint inhibitors: myocarditis (rare, often early, can be fatal) — troponin and ECG at baseline and with symptoms.",
            "Arsenic trioxide and other QT-prolonging drugs: ECG and electrolytes.",
            "High-dose cyclophosphamide: haemorrhagic myocarditis.",
          ],
        },
      ],
      references: [R.trial("Lyon AR et al. 2022 ESC Guidelines on cardio-oncology, Eur Heart J 2022"), R.nccn("Breast Cancer (cardiac monitoring with HER2 therapy)")],
    },
    {
      id: "pulmonary",
      title: "Pulmonary monitoring (bleomycin and others)",
      summary: "Bleomycin lung toxicity: risk factors, monitoring, and the lifelong oxygen warning.",
      keywords: ["bleomycin lung", "pneumonitis", "DLCO", "pulmonary fibrosis", "oxygen"],
      sections: [
        {
          heading: "Bleomycin",
          bullets: [
            "Risk factors: cumulative dose > 400 units, age > 40, renal impairment, smoking, chest radiotherapy, high inspired oxygen, G-CSF (possibly).",
            "Baseline PFTs with DLCO and chest X-ray; chest examination and symptom check before **every** dose.",
            "Stop bleomycin for new cough, breathlessness, crackles, infiltrates, or a significant fall in DLCO (e.g. > 25%).",
            "Treat pneumonitis with corticosteroids (e.g. prednisolone 1 mg/kg).",
            "**Lifelong:** tell anaesthetists; use the lowest oxygen concentration that keeps saturations acceptable.",
          ],
        },
        {
          heading: "Other drugs that can cause lung toxicity",
          bullets: ["Methotrexate, gemcitabine, busulfan, carmustine, docetaxel, oxaliplatin (rare).", "Immune checkpoint inhibitors (pneumonitis) — see irAE page.", "Trastuzumab deruxtecan (interstitial lung disease)."],
        },
      ],
      references: [R.nccn("Hodgkin Lymphoma; Testicular Cancer")],
    },
    {
      id: "irae",
      title: "Immune-related adverse events (immunotherapy)",
      summary: "How to grade and treat side effects of checkpoint inhibitors (pembrolizumab, atezolizumab, durvalumab…).",
      keywords: ["irAE", "checkpoint inhibitor", "pneumonitis", "colitis", "hepatitis", "thyroiditis", "hypophysitis", "adrenal", "myocarditis"],
      sections: [
        {
          heading: "General approach by grade (NCCN / ASCO)",
          table: {
            head: ["Grade", "Immunotherapy", "Treatment"],
            rows: [
              ["1 (mild)", "Usually continue, monitor closely (hold for some neurological, haematological or cardiac events).", "Symptomatic."],
              ["2 (moderate)", "**Hold.** Resume when ≤ grade 1 and prednisolone ≤ 10 mg/day.", "Prednisolone 0.5–1 mg/kg/day; taper over ≥ 4–6 weeks."],
              ["3 (severe)", "Hold; consider permanent discontinuation (organ dependent).", "(Methyl)prednisolone 1–2 mg/kg/day; admit if needed. Add second-line drug if no response in 48–72 h."],
              ["4 (life-threatening)", "**Permanently stop** (except endocrine events controlled with hormone replacement).", "IV methylprednisolone 1–2 mg/kg/day; second-line immunosuppression early."],
            ],
          },
        },
        {
          heading: "Organ-specific points",
          table: {
            head: ["irAE", "Key action"],
            rows: [
              ["Colitis / diarrhoea", "Exclude infection (C. difficile). Steroids; infliximab or vedolizumab if steroid-refractory. Loperamide alone is not enough for grade ≥ 2."],
              ["Pneumonitis", "CT chest; exclude infection. Grade ≥ 2: steroids; grade ≥ 3: admit, IV steroids."],
              ["Hepatitis", "Steroids; mycophenolate if refractory. **Avoid infliximab** (hepatotoxic)."],
              ["Hypothyroidism / thyroiditis", "Levothyroxine; beta-blocker for thyrotoxic phase. Usually continue immunotherapy."],
              ["Hypophysitis / adrenal insufficiency", "Check cortisol/ACTH; **hydrocortisone replacement** (stress dosing when ill); start steroids before thyroxine."],
              ["Type 1 diabetes", "Insulin; watch for DKA. Steroids do not help."],
              ["Skin rash", "Topical steroids/antihistamines; urgent review for blistering or mucosal involvement (SJS/TEN)."],
              ["Nephritis", "Stop nephrotoxins; steroids for grade ≥ 2."],
              ["Myocarditis", "**Emergency**: troponin, ECG, cardiology; high-dose IV methylprednisolone; permanent discontinuation."],
              ["Neurological (myasthenia, Guillain–Barré, encephalitis)", "Admit; neurology; steroids ± IVIG/plasma exchange; permanently stop."],
            ],
          },
        },
        {
          heading: "While on steroids",
          bullets: ["PJP prophylaxis if ≥ 20 mg prednisolone for ≥ 4 weeks.", "Gastric protection, glucose monitoring, bone health, consider antifungal with prolonged high doses."],
        },
      ],
      references: [R.nccnSupportive("Management of Immunotherapy-Related Toxicities"), R.trial("Schneider BJ et al. Management of irAEs: ASCO guideline update, J Clin Oncol 2021")],
    },
    {
      id: "diarrhoea",
      title: "Diarrhoea management",
      summary: "Loperamide, octreotide and red flags for chemotherapy-induced diarrhoea (irinotecan, fluoropyrimidines, pertuzumab).",
      keywords: ["diarrhea", "loperamide", "octreotide", "irinotecan", "atropine"],
      sections: [
        {
          heading: "Grading (CTCAE)",
          table: {
            head: ["Grade", "Stools per day above baseline"],
            rows: [["1", "< 4"], ["2", "4–6; limiting instrumental activities"], ["3", "≥ 7; incontinence; hospitalisation needed"], ["4", "Life-threatening"]],
          },
        },
        {
          heading: "Uncomplicated (grade 1–2, no red flags)",
          bullets: [
            "**Loperamide** 4 mg at the first loose stool, then 2 mg every 4 h or after each loose stool (max 16 mg/day). For irinotecan: 2 mg every 2 h (4 mg every 4 h overnight) until 12 h diarrhoea-free (max 48 h).",
            "Oral fluids with salt and sugar; small bland meals; avoid lactose, alcohol, spicy/fatty food.",
            "No response in 24–48 h: stool tests (C. difficile, culture), **octreotide 100–150 micrograms SC three times daily** (up to 500 micrograms).",
          ],
        },
        {
          heading: "Complicated — admit",
          bullets: [
            "Any grade 3–4, or grade 1–2 with fever, neutropenia, dehydration, bleeding, severe cramps, vomiting or reduced performance status.",
            "IV fluids/electrolytes, octreotide, antibiotics (e.g. fluoroquinolone) if febrile or neutropenic; hold chemotherapy.",
          ],
        },
        {
          heading: "Special cases",
          bullets: [
            "Irinotecan early cholinergic syndrome (< 24 h): atropine 0.25–1 mg IV/SC.",
            "Severe early toxicity after 5-FU/capecitabine: suspect DPD deficiency; **uridine triacetate** within 96 h.",
            "Immunotherapy colitis: needs steroids — see irAE page.",
          ],
        },
      ],
      references: [R.trial("Benson AB et al. Recommended guidelines for treatment of cancer treatment-induced diarrhea, J Clin Oncol 2004")],
    },
    {
      id: "neuropathy",
      title: "Chemotherapy-induced peripheral neuropathy",
      summary: "Which drugs cause it, how to assess, dose changes and duloxetine.",
      keywords: ["CIPN", "neuropathy", "oxaliplatin", "paclitaxel", "vincristine", "bortezomib", "duloxetine"],
      sections: [
        {
          heading: "Main causes",
          bullets: [
            "Platinum: oxaliplatin (acute cold-induced + chronic cumulative), cisplatin.",
            "Taxanes: paclitaxel > docetaxel; nab-paclitaxel.",
            "Vinca alkaloids: vincristine (also autonomic — constipation/ileus).",
            "Bortezomib, thalidomide; antibody–drug conjugates with MMAE (polatuzumab, brentuximab, enfortumab).",
          ],
        },
        {
          heading: "Assess every cycle (CTCAE)",
          table: {
            head: ["Grade", "Description", "Usual action"],
            rows: [
              ["1", "Numbness/tingling, no functional limit", "Continue; monitor."],
              ["2", "Limits instrumental daily activities (buttons, writing)", "Reduce dose or delay (drug specific)."],
              ["3", "Limits self-care", "Stop the drug."],
            ],
          },
        },
        {
          heading: "Prevention and treatment",
          bullets: [
            "No drug is proven to prevent neuropathy (ASCO). Calcium/magnesium infusions are not recommended.",
            "Frozen gloves/socks or compression during taxane infusion may reduce it.",
            "**Duloxetine** 30 mg daily for 1 week, then 60 mg daily for painful neuropathy (best evidence).",
            "Exercise, falls prevention, foot care.",
            "Avoid azole antifungals with vincristine; cap vincristine at 2 mg in most adult protocols.",
          ],
        },
      ],
      references: [R.trial("Loprinzi CL et al. Prevention and management of CIPN: ASCO guideline update, J Clin Oncol 2020")],
    },
    {
      id: "mucositis",
      title: "Mucositis and oral care",
      summary: "Prevention (oral care, cryotherapy, photobiomodulation) and treatment of oral mucositis.",
      keywords: ["stomatitis", "mouth ulcers", "oral cryotherapy", "ice chips", "mouthwash", "benzydamine"],
      sections: [
        {
          heading: "Prevention",
          bullets: [
            "Oral care for all: soft toothbrush, bland rinses (sodium chloride or sodium bicarbonate) 4–6 times daily, dental review before head & neck radiotherapy or bone-modifying agents.",
            "**Oral cryotherapy** (ice chips for 30 min) during bolus 5-FU and high-dose melphalan.",
            "Photobiomodulation (low-level laser) for head & neck RT and stem cell transplant (MASCC/ISOO).",
            "Benzydamine mouthwash for head & neck RT (moderate doses).",
            "Chlorhexidine is **not** recommended to prevent mucositis.",
            "Dexamethasone mouthwash for mTOR-inhibitor stomatitis (everolimus).",
          ],
        },
        {
          heading: "Treatment",
          bullets: [
            "Pain: topical lidocaine, morphine mouthwash 0.2%, systemic analgesia (opioids for severe).",
            "Treat infection: candida (nystatin, fluconazole), HSV (aciclovir).",
            "Nutrition support; feeding tube if unable to eat; IV fluids if dehydrated.",
            "Hold or reduce causative drug for grade ≥ 3 (fluoropyrimidines, methotrexate).",
          ],
        },
      ],
      references: [R.trial("Elad S et al. MASCC/ISOO clinical practice guidelines for mucositis, Cancer 2020")],
    },
    {
      id: "differentiation",
      title: "Differentiation syndrome",
      summary: "Recognising and treating differentiation syndrome with ATRA, arsenic trioxide and IDH/menin/FLT3 inhibitors.",
      keywords: ["APL", "retinoic acid syndrome", "ATRA syndrome", "dexamethasone", "IDH inhibitor"],
      sections: [
        {
          heading: "Drugs",
          body: ["ATRA and arsenic trioxide (APL); IDH inhibitors (ivosidenib, enasidenib, olutasidenib); menin inhibitors (revumenib, ziftomenib); gilteritinib."],
        },
        {
          heading: "Features",
          bullets: ["Fever, breathlessness, hypoxia, lung infiltrates, pleural/pericardial effusions.", "Weight gain > 5 kg, oedema, hypotension, acute kidney injury.", "Often days 2–21 of treatment; can occur later."],
        },
        {
          heading: "Prevention (APL)",
          bullets: ["APL0406: prednisone 0.5 mg/kg/day from day 1 to the end of induction.", "Some protocols: dexamethasone 2.5 mg/m² twice daily or 10 mg twice daily if WBC > 10 × 10⁹/L.", "Hydroxyurea for rising WBC."],
        },
        {
          heading: "Treatment",
          bullets: [
            "**Dexamethasone 10 mg IV twice daily** at the first suspicion; continue until resolved (≥ 3 days), then taper.",
            "Diuretics for fluid overload; supportive care; ICU if needed.",
            "Hold ATRA/ATO (or the causative drug) if severe; restart when resolved.",
            "Treat possible infection at the same time — features overlap.",
          ],
        },
      ],
      references: [R.nccn("Acute Myeloid Leukemia"), R.trial("Sanz MA et al. Management of APL: ELN recommendations, Blood 2019")],
    },
    {
      id: "fertility",
      title: "Fertility preservation and contraception",
      summary: "Discuss fertility before treatment; sperm banking, egg/embryo freezing, GnRH agonists.",
      keywords: ["sperm banking", "oocyte", "embryo", "GnRH agonist", "goserelin", "infertility", "pregnancy"],
      sections: [
        {
          heading: "Before treatment",
          bullets: [
            "Discuss fertility risk with all patients of reproductive age **before** starting (ASCO).",
            "High risk: alkylating agents (cyclophosphamide, ifosfamide, busulfan, melphalan, procarbazine, bendamustine), high cumulative cisplatin, pelvic/testicular radiotherapy, total body irradiation, transplant conditioning.",
          ],
        },
        {
          heading: "Options",
          table: {
            head: ["Who", "Options"],
            rows: [
              ["Men", "**Sperm cryopreservation** (before chemotherapy — even one sample helps)."],
              ["Women", "Oocyte or embryo cryopreservation (about 2 weeks of ovarian stimulation, random-start possible; letrozole-based protocol for hormone-sensitive breast cancer). Ovarian tissue cryopreservation. **GnRH agonist** (e.g. goserelin 3.6 mg monthly starting ≥ 1 week before chemotherapy) to reduce ovarian failure — an addition, not a substitute."],
            ],
          },
        },
        {
          heading: "During and after",
          bullets: ["Effective contraception during treatment (and usually ≥ 6 months after; drug specific).", "Pregnancy test before each cycle when relevant.", "Lenalidomide/thalidomide: strict pregnancy prevention programmes."],
        },
      ],
      references: [R.trial("Oktay K et al. Fertility preservation in patients with cancer: ASCO guideline update, J Clin Oncol 2018")],
    },
  ]);
})();

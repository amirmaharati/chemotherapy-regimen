/*
 * Principles of chemotherapy prescribing and administration.
 * Same section format as data/supportive.js. Ids "extravasation", "hypersensitivity" and "it-chemo" are also regimen tags.
 */
(function () {
  "use strict";
  const R = ONCO.ref;

  ONCO.addPrinciples([
    {
      id: "before-treatment",
      title: "Before starting chemotherapy",
      summary: "Checklist: diagnosis, intent, fitness, consent, baseline tests, venous access, fertility, vaccines.",
      keywords: ["baseline tests", "consent", "ECOG", "performance status", "pre-chemotherapy", "checklist"],
      sections: [
        {
          heading: "Decide",
          bullets: [
            "Confirm the diagnosis (histology, biomarkers) and stage; discuss at a multidisciplinary meeting.",
            "Define the **treatment intent** (curative, life-prolonging, palliative) — it changes how you handle toxicity and dose reductions.",
            "Assess fitness: ECOG performance status, comorbidities, organ function; geriatric assessment for older adults (G8 screen; CARG toxicity score).",
            "Written informed consent; written patient information; 24-hour contact number.",
          ],
        },
        {
          heading: "Baseline tests",
          table: {
            head: ["Test", "When"],
            rows: [
              ["FBC, UEC (creatinine/CrCl), LFTs, Ca, Mg, phosphate, glucose; height and weight", "All patients"],
              ["Hepatitis B (HBsAg, anti-HBc), hepatitis C, HIV", "All patients starting systemic therapy (ASCO)"],
              ["Pregnancy test", "Patients who could be pregnant"],
              ["LVEF (echo/MUGA)", "Anthracyclines, HER2 therapy, high-dose cyclophosphamide, cardiac history"],
              ["Pulmonary function with DLCO", "Bleomycin"],
              ["Audiogram", "Cisplatin with hearing problems or high cumulative dose"],
              ["ECG (QTc)", "Arsenic trioxide and other QT-prolonging drugs; cardiac history"],
              ["TFTs, cortisol, glucose", "Immune checkpoint inhibitors"],
              ["**DPYD genotype**", "Before 5-FU or capecitabine (where available)"],
              ["UGT1A1 genotype", "Irinotecan (optional; consider in Gilbert's)"],
              ["G6PD", "Before rasburicase or dapsone in at-risk patients"],
              ["Dental review", "Head & neck radiotherapy, bone-modifying agents"],
            ],
          },
        },
        {
          heading: "Plan",
          bullets: [
            "**Venous access:** port or PICC for vesicant infusions, infusional 5-FU, long courses or poor veins.",
            "Fertility preservation and contraception (see Fertility page).",
            "Medicine reconciliation: interactions (azoles, warfarin, St John's wort, PPIs with HD-MTX), stop unnecessary drugs.",
            "Vaccines: inactivated influenza, COVID-19, pneumococcal, recombinant zoster — ideally ≥ 2 weeks before. **No live vaccines** during chemotherapy (and for ≥ 6 months after anti-CD20).",
            "Smoking cessation, nutrition, exercise advice.",
          ],
        },
      ],
      references: [R.trial("Neuss MN et al. ASCO/ONS chemotherapy administration safety standards, J Oncol Pract 2016"), R.nccnSupportive("Older Adult Oncology")],
    },
    {
      id: "dose-calculation",
      title: "Dose calculation",
      summary: "BSA, obesity, carboplatin (Calvert), dose caps, rounding and when to recalculate.",
      keywords: ["BSA", "body surface area", "Mosteller", "Calvert", "obesity", "dose capping", "dose rounding", "dose banding"],
      sections: [
        {
          heading: "Body surface area (BSA)",
          bullets: [
            "**Mosteller:** BSA (m²) = √(height cm × weight kg ÷ 3600). DuBois is an alternative.",
            "Use **actual body weight**. ASCO advises **full weight-based doses in obese patients** — do not routinely cap BSA at 2.0 m².",
            "Recalculate when weight changes by ≥ 5–10% (many centres recalculate every cycle).",
          ],
        },
        {
          heading: "Carboplatin (Calvert formula)",
          bullets: [
            "**Dose (mg) = target AUC × (GFR + 25).**",
            "Cap GFR at **125 mL/min** → maximum dose = AUC × 150 mg (e.g. 900 mg for AUC 6).",
            "GFR estimate: Cockcroft–Gault (adjusted body weight if obese) is common in the US; eviQ/ADDIKD prefers de-indexed CKD-EPI eGFR (eGFR × BSA ÷ 1.73). Use **measured GFR** when estimates are unreliable (extremes of weight, muscle mass, unstable creatinine).",
            "Very low creatinine overestimates GFR: many centres round creatinine < 0.7 mg/dL (62 µmol/L) up to 0.7.",
          ],
        },
        {
          heading: "Caps, fixed doses and units",
          bullets: [
            "**Vincristine** usually capped at **2 mg** in adults (exceptions such as DA-EPOCH-R).",
            "Fixed (flat) doses for many antibodies: pembrolizumab 200 mg, atezolizumab 1200 mg, durvalumab 1500 mg, pertuzumab 840/420 mg.",
            "mg/kg drugs: trastuzumab, T-DM1, polatuzumab, arsenic trioxide.",
            "**Units:** bleomycin 1 unit = 1000 international units; check what your pharmacy uses.",
          ],
        },
        {
          heading: "Rounding and dose intensity",
          bullets: [
            "Dose rounding within ±5% (up to 10% in some palliative settings) or dose banding is acceptable per local policy.",
            "In curative treatment keep relative dose intensity high (≥ 85%): use G-CSF rather than unnecessary dose reductions or delays.",
          ],
        },
      ],
      references: [R.trial("Griggs JJ et al. Appropriate systemic therapy dosing for obese adult patients with cancer: ASCO guideline update, J Clin Oncol 2021"), R.trial("Calvert AH et al. J Clin Oncol 1989"), R.trial("ADDIKD guideline (International consensus on anticancer drug dosing in kidney dysfunction), eviQ 2022")],
    },
    {
      id: "prescribing-checking",
      title: "Prescribing and independent checking",
      summary: "Safe order sets, what an order must contain, double checks and look-alike drug names.",
      keywords: ["order set", "double check", "verification", "tall man", "look-alike", "abbreviations"],
      sections: [
        {
          heading: "The order",
          bullets: [
            "Use protocol-based, preferably electronic order sets. No verbal orders (except to hold or stop).",
            "Must include: two patient identifiers, date, diagnosis, regimen name, cycle and day, height, weight, BSA (and date measured), allergies.",
            "For each drug: full generic name, dose per unit (e.g. mg/m²) **and** calculated dose, route, diluent/volume, rate, sequence, days.",
            "Supportive medicines (antiemetics, hydration, premedication) and the lab criteria to treat.",
          ],
        },
        {
          heading: "Independent checks",
          steps: [
            "Prescriber checks the protocol, calculations, labs, cumulative doses and interactions.",
            "Pharmacist verifies independently before preparation.",
            "Two qualified nurses check at the bedside: patient identity, drug, dose, volume, route, rate, expiry, appearance, line.",
          ],
        },
        {
          heading: "Avoid errors",
          bullets: [
            "No trailing zeros (write 1 mg, not 1.0 mg); always a leading zero (0.5 mg). Write 'units' in full.",
            "Use Tall Man lettering for look-alike names (as eviQ does):",
          ],
          table: {
            head: ["Look-alike pair", "Risk"],
            rows: [
              ["DOXOrubicin / DAUNOrubicin / IDArubicin", "Different doses and cumulative limits"],
              ["DOXOrubicin / DOXOrubicin pegylated liposomal", "Very different doses"],
              ["CISplatin / CARBOplatin", "Ten-fold dose difference"],
              ["PACLItaxel / DOCEtaxel / nab-PACLItaxel", "Different doses and premedication"],
              ["vinCRIStine / vinBLAStine / vinORELBine", "vinBLAStine dose is ~5 × higher"],
              ["Trastuzumab / trastuzumab emtansine / trastuzumab deruxtecan", "Not interchangeable"],
            ],
          },
        },
      ],
      references: [R.trial("Neuss MN et al. ASCO/ONS chemotherapy administration safety standards, J Oncol Pract 2016"), R.trial("ISMP list of high-alert medications")],
    },
    {
      id: "safe-handling",
      title: "Safe handling of cytotoxic drugs",
      summary: "PPE, closed systems, spills, waste and patient body-fluid precautions.",
      keywords: ["PPE", "gloves", "spill kit", "cytotoxic waste", "CSTD", "hazardous drugs"],
      sections: [
        {
          heading: "Preparation and administration",
          bullets: [
            "Prepare in pharmacy in a biological safety cabinet or isolator; use closed-system transfer devices where possible.",
            "PPE: **two pairs of chemotherapy-tested gloves**, impermeable long-sleeved gown, eye/face protection if splashing is possible.",
            "Prime IV lines with non-drug fluid (or in pharmacy). Use Luer-lock connections. Discard the set intact into cytotoxic waste.",
            "Do not crush or open oral anticancer drugs; carers wear gloves.",
          ],
        },
        {
          heading: "Spills",
          steps: ["Get the spill kit and put on PPE.", "Contain and absorb the spill (pads), working from outside in.", "Clean with detergent then water; dispose as cytotoxic waste.", "Report the incident; wash any skin contact with soap and water; eye contact — irrigate for 15 minutes."],
        },
        {
          heading: "Body fluids",
          bullets: [
            "Precautions for at least 48 hours after chemotherapy (up to 7 days for some drugs): gloves for handling urine, vomit or faeces; double-flush toilet; wash soiled linen separately.",
            "Condoms for 48–72 hours after chemotherapy.",
            "Staff who are pregnant or breastfeeding may choose not to handle cytotoxics.",
          ],
        },
      ],
      references: [R.trial("NIOSH list of hazardous drugs in healthcare settings"), R.trial("eviQ: Safe handling and waste management of hazardous drugs")],
    },
    {
      id: "administration",
      title: "Giving chemotherapy safely",
      summary: "Checks before giving, IV access, vesicants, drug order, filters/diluents and monitoring.",
      keywords: ["administration", "sequence", "order of drugs", "IV access", "filters", "diluent", "monitoring"],
      sections: [
        {
          heading: "Before each treatment",
          bullets: [
            "Right patient (2 identifiers), drug, dose, route, rate, time; consent in place.",
            "Labs meet protocol criteria; toxicity assessed and graded; weight checked.",
            "Required premedication taken (e.g. dexamethasone before docetaxel, folic acid/B12 for pemetrexed, hydration for cisplatin).",
          ],
        },
        {
          heading: "IV access and vesicants",
          bullets: [
            "Check blood return before, during (every 2–5 mL for push drugs) and after; flush between drugs.",
            "Avoid the antecubital fossa, wrist and hand for vesicants; avoid limbs with lymphoedema or after axillary surgery.",
            "Peripheral vesicant push: into the side arm of a free-flowing drip; peripheral vesicant infusions only if short (< 30–60 min) with the nurse present.",
            "Continuous vesicant infusions (e.g. DA-EPOCH-R) **only through a central line**.",
          ],
        },
        {
          heading: "Order of drugs that matters",
          table: {
            head: ["Give first", "Then", "Why"],
            rows: [
              ["Paclitaxel", "Cisplatin", "Cisplatin first reduces paclitaxel clearance → more neutropenia"],
              ["Paclitaxel / docetaxel", "Carboplatin", "Less thrombocytopenia"],
              ["Doxorubicin", "Paclitaxel", "Paclitaxel raises doxorubicin levels"],
              ["Leucovorin", "5-FU", "Leucovorin enhances 5-FU"],
              ["Antibodies (rituximab, trastuzumab, pertuzumab, checkpoint inhibitors)", "Chemotherapy", "Usual protocol order; monitors reactions"],
              ["Fludarabine", "Cytarabine (4 h later)", "Increases active cytarabine in blasts (FLAG)"],
              ["Nab-paclitaxel", "Gemcitabine", "Trial (MPACT) order"],
            ],
          },
        },
        {
          heading: "Diluents, filters and lines",
          table: {
            head: ["Drug", "Requirement"],
            rows: [
              ["Oxaliplatin", "Glucose 5% only (never sodium chloride)"],
              ["Cisplatin", "Sodium chloride (needs chloride); no aluminium"],
              ["Paclitaxel", "0.2 micron in-line filter; non-PVC bag and set"],
              ["Docetaxel", "Non-PVC bag and set"],
              ["Etoposide", "Concentration ≤ 0.4 mg/mL; infuse ≥ 30–60 min"],
              ["Dacarbazine", "Protect from light"],
              ["Pembrolizumab, durvalumab, T-DM1, polatuzumab, thiotepa", "In-line filter"],
              ["Vinca alkaloids", "Minibag (50 mL) — never syringe"],
            ],
          },
        },
        {
          heading: "During and after",
          bullets: [
            "Emergency (anaphylaxis) kit at the chair. Vital signs per drug (more often with first antibody infusions).",
            "Observation periods: e.g. pertuzumab loading 60 min, T-DM1 cycle 1 90 min, polatuzumab cycle 1 90 min.",
            "Document batch numbers. Give discharge education, written plan, home pump instructions and 24-hour contact.",
          ],
        },
      ],
      references: [R.trial("Neuss MN et al. ASCO/ONS chemotherapy administration safety standards, J Oncol Pract 2016"), R.trial("eviQ: Antineoplastic drug administration course")],
    },
    {
      id: "it-chemo",
      title: "Intrathecal chemotherapy safety",
      summary: "Only preservative-free methotrexate, cytarabine and hydrocortisone go intrathecally. Vinca alkaloids are fatal intrathecally.",
      keywords: ["intrathecal", "IT methotrexate", "lumbar puncture", "vincristine error", "Ommaya"],
      sections: [
        {
          callout: { type: "danger", text: "**Vincristine, vinblastine, vinorelbine and bortezomib are FATAL if given intrathecally.** Vinca alkaloids must be supplied in a minibag (≥ 50 mL), labelled 'For intravenous use only — fatal if given by other routes'." },
        },
        {
          heading: "Rules",
          bullets: [
            "Only preservative-free **methotrexate, cytarabine and hydrocortisone** (and a few protocol-specific drugs) are given intrathecally.",
            "Intrathecal drugs are supplied separately: different time and place, separate packaging, labelled 'For intrathecal use only'.",
            "Given only by trained staff on an intrathecal register, in a designated area, with a two-person check immediately before injection.",
            "Never have IV and intrathecal chemotherapy on the same trolley or in the room at the same time. Use neuraxial (non-Luer) connectors where available.",
          ],
        },
        {
          heading: "Procedure points",
          bullets: [
            "Platelets usually ≥ 50 × 10⁹/L and coagulation acceptable; hold anticoagulants per policy.",
            "Typical adult doses: methotrexate 12 mg (6 mg via Ommaya), cytarabine 50–100 mg, hydrocortisone 25–50 mg (protocol specific).",
            "Lie flat for about 30–60 minutes afterwards. Watch for headache, arachnoiditis, seizures.",
            "If a vinca alkaloid is given intrathecally by mistake: stop, get neurosurgical help immediately (CSF drainage and lavage). Outcome is usually fatal or severe disability.",
          ],
        },
      ],
      references: [R.trial("WHO Information Exchange System Alert No. 115: vincristine — fatal if given intrathecally"), R.trial("eviQ: Intrathecal chemotherapy (safety)")],
    },
    {
      id: "extravasation",
      title: "Extravasation (vesicant leakage)",
      summary: "Which drugs are vesicants, the first steps, and drug-specific antidotes (dexrazoxane, hyaluronidase).",
      keywords: ["extravasation", "vesicant", "dexrazoxane", "hyaluronidase", "DMSO", "cold compress", "warm compress"],
      sections: [
        {
          heading: "Drug classes",
          table: {
            head: ["Group", "Examples"],
            rows: [
              ["Vesicants", "Anthracyclines (doxorubicin, daunorubicin, epirubicin, idarubicin), vinca alkaloids (vincristine, vinblastine, vinorelbine), mitomycin, dactinomycin, trabectedin, mechlorethamine"],
              ["Irritants with vesicant properties", "Oxaliplatin, paclitaxel, docetaxel, bendamustine, cisplatin (concentrated)"],
              ["Irritants", "Carboplatin, etoposide, dacarbazine, irinotecan, liposomal doxorubicin, 5-FU"],
              ["Non-vesicants", "Cyclophosphamide, cytarabine, methotrexate, gemcitabine, pemetrexed, fludarabine, bleomycin, monoclonal antibodies"],
            ],
          },
        },
        {
          heading: "Signs",
          body: ["Pain, burning, stinging, swelling, redness or blanching at the site; loss of blood return; slowing infusion. With a central line: chest, neck or shoulder pain or swelling."],
        },
        {
          heading: "First steps (all drugs)",
          steps: [
            "**Stop the infusion** immediately. Leave the cannula in place for now.",
            "Disconnect the line and **aspirate** as much drug as possible through the cannula (small syringe).",
            "Remove the cannula. Do not press on the area.",
            "Mark the edge of the area with a pen and photograph it.",
            "Elevate the limb; give analgesia.",
            "Apply **cold or warm compress** and give an **antidote** according to the drug (table below).",
            "Inform the medical team; document (drug, concentration, volume, time, actions); report the incident.",
            "Give the patient written information; review at 24 h, 48 h and 1 week. **Early plastic surgery referral** for large vesicant extravasation, blistering, persistent pain or necrosis.",
          ],
        },
        {
          heading: "Drug-specific management",
          table: {
            head: ["Drug group", "Compress", "Antidote"],
            rows: [
              ["Anthracyclines", "**Cold** 15–20 min, 4 times daily for 3 days (remove 15 min before dexrazoxane)", "**Dexrazoxane** IV within 6 h, in the other arm: 1000 mg/m² day 1 (max 2000 mg), 1000 mg/m² day 2 (max 2000 mg), 500 mg/m² day 3 (max 1000 mg); halve if CrCl < 40 mL/min. Or topical DMSO 99% every 8 h for 7–14 days (not with dexrazoxane)."],
              ["Vinca alkaloids", "**Warm** 15–20 min, 4 times daily for 1–2 days (**no cold**)", "**Hyaluronidase** SC around the site, e.g. 150 units in 1 mL as five 0.2 mL injections (doses up to 1500 units used)."],
              ["Oxaliplatin", "**Warm** (avoid cold — may trigger neuropathy)", "None specific."],
              ["Taxanes (paclitaxel, docetaxel)", "Cold", "None proven (hyaluronidase sometimes used for paclitaxel)."],
              ["Mitomycin", "Cold", "Topical DMSO."],
              ["Mechlorethamine (and large concentrated cisplatin)", "Cold", "Sodium thiosulfate SC."],
              ["Irritants / non-vesicants", "Cold for comfort; elevate", "None."],
            ],
          },
        },
      ],
      references: [R.trial("Pérez Fidalgo JA et al. Management of chemotherapy extravasation: ESMO–EONS clinical practice guidelines, Ann Oncol 2012"), R.trial("ONS Chemotherapy and Immunotherapy Guidelines"), R.trial("eviQ: Extravasation management")],
    },
    {
      id: "hypersensitivity",
      title: "Hypersensitivity and infusion reactions",
      summary: "High-risk drugs, immediate management of anaphylaxis, rechallenge and desensitisation.",
      keywords: ["anaphylaxis", "allergic reaction", "infusion reaction", "adrenaline", "epinephrine", "desensitisation", "carboplatin allergy", "paclitaxel reaction"],
      sections: [
        {
          heading: "High-risk drugs",
          table: {
            head: ["Drug", "Typical pattern"],
            rows: [
              ["Carboplatin (also oxaliplatin, cisplatin)", "IgE-mediated; risk rises after ~6 cycles or on re-treatment; can be severe"],
              ["Paclitaxel, docetaxel", "First or second infusion, within minutes (vehicle: Cremophor / polysorbate 80)"],
              ["Rituximab and other antibodies", "Cytokine-release infusion reaction, mainly the first infusion"],
              ["Asparaginase, etoposide, bleomycin, liposomal doxorubicin", "Various mechanisms"],
            ],
          },
        },
        {
          heading: "Immediate management",
          steps: [
            "**Stop the infusion.** Call for help. Keep the line open with sodium chloride 0.9%.",
            "Assess airway, breathing, circulation. Lie flat with legs raised (sit up if breathing is difficult). Give high-flow oxygen.",
            "**Anaphylaxis** (hypotension, bronchospasm, stridor, or two body systems involved): **adrenaline (epinephrine) 0.5 mg IM** (0.5 mL of 1 mg/mL) into the outer thigh; repeat every 5 minutes if needed. IV fluid bolus 500–1000 mL.",
            "Then (adjuncts, not instead of adrenaline): H1 antihistamine (e.g. promethazine 12.5–25 mg IV or diphenhydramine 25–50 mg IV), H2 blocker (famotidine 20 mg IV), hydrocortisone 100–200 mg IV, salbutamol nebuliser for wheeze.",
            "Vital signs every 5–15 minutes. Observe ≥ 4–6 hours after anaphylaxis (biphasic reactions). Tryptase within 1–2 hours.",
            "Document the reaction and refer to allergy/immunology before re-exposure.",
          ],
        },
        {
          heading: "After the reaction",
          bullets: [
            "**Mild taxane reactions:** often safe to restart after symptoms resolve, at a slower rate with extra premedication.",
            "**Rituximab infusion reaction:** once resolved, restart at half the previous rate.",
            "**Platinum reactions:** skin testing and desensitisation protocols (e.g. 12-step, 3-bag) in experienced centres; switching platinum carries cross-reactivity risk.",
            "Severe anaphylaxis: do not re-expose without specialist advice.",
          ],
        },
        {
          heading: "Standard premedication",
          table: {
            head: ["Drug", "Premedication"],
            rows: [
              ["Paclitaxel", "Dexamethasone + H1 antihistamine ± H2 blocker"],
              ["Docetaxel", "Dexamethasone 8 mg twice daily for 3 days from the day before"],
              ["Rituximab, polatuzumab", "Paracetamol + antihistamine ± hydrocortisone"],
              ["Bleomycin", "Paracetamol (fever/chills)"],
              ["Carboplatin, oxaliplatin", "None routinely (antiemetic dexamethasone already given); desensitisation after a reaction"],
            ],
          },
        },
      ],
      references: [R.trial("Roselló S et al. Management of infusion reactions to systemic anticancer therapy: ESMO guidelines, Ann Oncol 2017"), R.trial("Resuscitation Council UK / ASCIA anaphylaxis guidelines")],
    },
    {
      id: "oral-chemo",
      title: "Oral anticancer drugs",
      summary: "Same safety rules as IV chemo: prescribing, education, handling, adherence and interactions.",
      keywords: ["oral chemotherapy", "capecitabine", "temozolomide", "adherence", "missed dose"],
      sections: [
        {
          heading: "Key points",
          bullets: [
            "Prescribe and verify with the same standards as IV chemotherapy; supply one cycle at a time.",
            "Teach: dose, days on/off, food rules, what to do with a missed or vomited dose (usually **do not double up**), and when to stop and call (e.g. capecitabine diarrhoea or hand–foot syndrome).",
            "Handling: swallow whole; do not crush or open; carers wear gloves; store away from children; return unused drugs to the pharmacy.",
            "Check interactions: CYP3A4 inhibitors/inducers, warfarin (capecitabine), acid suppressants (some TKIs), grapefruit, herbal products.",
            "Check adherence and toxicity at every visit (diaries or apps help).",
          ],
        },
      ],
      references: [R.trial("Neuss MN et al. ASCO/ONS standards including oral chemotherapy, J Oncol Pract 2016")],
    },
    {
      id: "toxicity-dose-modification",
      title: "Toxicity grading and dose modification",
      summary: "CTCAE grades, typical blood count thresholds and general rules for delay or reduction.",
      keywords: ["CTCAE", "dose reduction", "dose delay", "ANC threshold", "platelet threshold"],
      sections: [
        {
          heading: "CTCAE v5 grades",
          table: {
            head: ["Grade", "Meaning"],
            rows: [["1", "Mild — no intervention"], ["2", "Moderate — limits instrumental daily activities"], ["3", "Severe — limits self-care; may need admission"], ["4", "Life-threatening — urgent intervention"], ["5", "Death"]],
          },
        },
        {
          heading: "Usual blood count thresholds on day 1",
          bullets: [
            "Most 2–4-weekly solid tumour regimens: **ANC ≥ 1.5 × 10⁹/L and platelets ≥ 100 × 10⁹/L**.",
            "Weekly regimens often allow ANC ≥ 1.0 and platelets ≥ 75 × 10⁹/L (protocol specific).",
            "Some curative lymphoma regimens (e.g. ABVD) are given on time regardless of ANC if the patient is well.",
          ],
        },
        {
          heading: "General rules (if the protocol gives none)",
          table: {
            head: ["Toxicity", "Usual action"],
            rows: [
              ["Grade 1", "Continue full dose."],
              ["Grade 2", "Delay until ≤ grade 1 for some toxicities; usually same dose the first time."],
              ["Grade 3", "Delay until ≤ grade 1, then reduce by one dose level (about 20–25%)."],
              ["Grade 4", "Delay and reduce by one or two levels, or stop the drug."],
              ["Recurrent grade 3–4 despite reduction", "Stop the responsible drug."],
            ],
          },
          bullets: [
            "Curative intent: protect dose intensity (G-CSF, supportive care) rather than reducing doses for neutropenia alone.",
            "Doses are usually not re-escalated after reduction (exception: DA-EPOCH-R).",
            "Organ impairment: see each drug page (renal and hepatic advice).",
          ],
        },
      ],
      references: [R.trial("Common Terminology Criteria for Adverse Events (CTCAE) v5.0, NCI 2017")],
    },
    {
      id: "special-populations",
      title: "Older adults, pregnancy and other special groups",
      summary: "Geriatric assessment, obesity, pregnancy and dialysis.",
      keywords: ["elderly", "geriatric", "pregnancy", "obesity", "dialysis", "G8"],
      sections: [
        {
          heading: "Older adults",
          bullets: [
            "Screen with G8 (≤ 14 → full geriatric assessment); estimate toxicity risk with the CARG or CRASH score.",
            "Consider reduced starting doses in palliative settings (e.g. GO2 trial in gastro-oesophageal cancer); escalate if tolerated.",
            "G-CSF with R-CHOP in patients ≥ 65; R-mini-CHOP for > 80 years; pre-phase steroids for frail lymphoma patients.",
          ],
        },
        {
          heading: "Obesity",
          body: ["Use full weight-based doses (ASCO 2021); manage toxicity the same way as for other patients."],
        },
        {
          heading: "Pregnancy",
          bullets: [
            "Avoid chemotherapy in the first trimester if possible (malformation risk).",
            "Many regimens (e.g. AC, weekly paclitaxel) can be given in the second and third trimesters; avoid trastuzumab, methotrexate, and endocrine therapy during pregnancy.",
            "Stop chemotherapy about 3 weeks before planned delivery (neutrophil recovery). Multidisciplinary care with obstetrics. No breastfeeding during chemotherapy.",
          ],
        },
        {
          heading: "Dialysis",
          body: ["Drug-specific; many drugs are given after dialysis (e.g. bortezomib, lenalidomide 5 mg after dialysis). For carboplatin in anuric patients the Calvert formula gives AUC × (0 + 25); timing relative to dialysis follows the protocol. Seek specialist pharmacy advice."],
        },
      ],
      references: [R.nccnSupportive("Older Adult Oncology"), R.trial("Mohile SG et al. Practical assessment and management of vulnerabilities in older patients receiving chemotherapy: ASCO guideline, J Clin Oncol 2018")],
    },
  ]);
})();

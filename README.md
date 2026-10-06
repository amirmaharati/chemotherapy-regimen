# OncoRegimens

A reference app for medical oncology: chemotherapy regimens, how to give each drug, premedication, prophylaxis, precautions and doses. Regimens are split into **outpatient** (day unit) and **inpatient** (admission).

Content is based on the **NCCN Guidelines** and **eviQ** protocols. Each regimen page lists its eviQ protocol number and the pivotal trials.

> **For qualified health professionals only.** This is a reference aid, not a prescribing system. Always check doses against the current NCCN guideline, the eviQ protocol and your hospital policy before treating a patient. Guidelines change and content can contain errors.

## What is inside

- **47 regimens** — 34 outpatient, 13 inpatient. For each: indications, doses, route, days, how to give each drug, order of administration, premedication, take-home medicines and prophylaxis, checks before each cycle, precautions, dose-modification summary, sources.
- **Dose calculator on every regimen page** — enter height, weight, age, sex, creatinine and (optionally) liver tests; it works out BSA, CrCl, eGFR and every drug dose (carboplatin by Calvert, vincristine capped at 2 mg, etc.).
- **Kidney, liver and age dose rules applied automatically** — e.g. cisplatin 75% at GFR 45–59, 50% at 30–44 and "do not give" under 30; doxorubicin and vincristine reduced for high bilirubin; docetaxel blocked if bilirubin > ULN; high-dose cytarabine reduced for age and kidney function. Each regimen also has a kidney/liver adjustment table.
- **Printable chemo order sheet** — patient details, measurements, calculated and adjusted doses, extra "% given" for toxicity reductions, premedication, take-home medicines and signature boxes.
- **Day-by-day calendar** for each cycle, with real dates from a start date and a phone-calendar (.ics) download.
- **Drug interaction checker** — azoles with vincristine or venetoclax, methotrexate with PPIs/NSAIDs/co-trimoxazole, QT drugs with arsenic, warfarin with capecitabine, and more. Each regimen lists the medicines to watch for.
- **Cumulative dose tracker** — lifetime anthracycline (doxorubicin-equivalent) and bleomycin totals from previous regimens, with limits and "what if I give N more cycles".
- **Patient leaflets** for every regimen in plain language: what each medicine does, how it is given, side effects sorted into "emergency", "call today" and "common — usually not dangerous", food advice, and questions to ask.
- **Patient app** — press "Give to patient" on a regimen, enter the start date and your team's phone numbers, and the patient scans a QR code. Their phone then shows their treatment dates, "today is day 9 of cycle 1", the next treatment, warnings when blood counts are lowest, one-tap call buttons, side-effect guidance and food advice — offline, with phone-calendar reminders.
- **48 drug pages** — how to inject/infuse, diluent, vesicant status, main toxicities, interactions, renal and hepatic advice, extravasation steps.
- **22 prophylaxis & supportive-care pages** — antiemetics, G-CSF, febrile neutropenia, hepatitis B, HSV/VZV, PJP, antifungal, antibacterial, TLS, cisplatin hydration, mesna, high-dose methotrexate, steroid eye drops, VTE, cardiac and lung monitoring, immunotherapy side effects, diarrhoea, neuropathy, mucositis, differentiation syndrome, fertility.
- **11 principles pages** — before treatment, dose calculation, prescribing and checking, safe handling, giving chemotherapy, intrathecal safety, extravasation, hypersensitivity, oral chemotherapy, toxicity grading, special populations.
- **Calculators** — BSA, Cockcroft–Gault, CKD-EPI 2021, carboplatin (Calvert), ANC, dose reduction.
- Search, saved favourites, print view, dark mode, works on phones and **offline**.

### Outpatient (day unit)

| Cancer type | Regimen |
|---|---|
| Breast | AC / dose-dense AC (doxorubicin + cyclophosphamide) |
| Breast | Capecitabine (adjuvant after neoadjuvant, or metastatic) |
| Breast | KEYNOTE-522: carboplatin + paclitaxel + pembrolizumab → AC + pembrolizumab |
| Breast | TC (docetaxel + cyclophosphamide) |
| Breast | TCHP (docetaxel + carboplatin + trastuzumab + pertuzumab) |
| Breast | Trastuzumab emtansine (T-DM1), adjuvant |
| Breast | Weekly paclitaxel (after AC) |
| Breast | Weekly paclitaxel + trastuzumab (APT) |
| CNS (brain) | Temozolomide with radiotherapy, then adjuvant temozolomide (Stupp) |
| Colorectal | CAPOX / XELOX |
| Colorectal | FOLFIRI |
| Colorectal | mFOLFOX6 |
| Genitourinary | Docetaxel (± prednisolone) — prostate |
| Genitourinary | Gemcitabine + cisplatin (urothelial) |
| Gynaecological | Carboplatin + paclitaxel (3-weekly) |
| Gynaecological | Weekly cisplatin 40 mg/m² with radiotherapy |
| Head & neck | High-dose cisplatin 100 mg/m² with radiotherapy |
| Immunotherapy | Pembrolizumab monotherapy |
| Leukaemia & MDS | Azacitidine (MDS) |
| Lung | Carboplatin + etoposide + atezolizumab (ES-SCLC) |
| Lung | Carboplatin + paclitaxel + pembrolizumab |
| Lung | Carboplatin + pemetrexed + pembrolizumab |
| Lung | Cisplatin + etoposide with radiotherapy (LS-SCLC) |
| Lung | Cisplatin + vinorelbine (adjuvant NSCLC) |
| Lymphoma | ABVD |
| Lymphoma | BR (bendamustine + rituximab) |
| Lymphoma | Pola-R-CHP |
| Lymphoma | R-CHOP-21 |
| Myeloma | VRd (bortezomib + lenalidomide + dexamethasone) |
| Upper GI | CROSS (weekly carboplatin + paclitaxel with RT) |
| Upper GI | FLOT |
| Upper GI | Gemcitabine + cisplatin + durvalumab (biliary) |
| Upper GI | Gemcitabine + nab-paclitaxel |
| Upper GI | mFOLFIRINOX |

### Inpatient (admission)

| Cancer type | Regimen |
|---|---|
| Genitourinary | BEP (germ cell tumours) |
| Leukaemia & MDS | 7+3 induction |
| Leukaemia & MDS | ATRA + arsenic trioxide (APL) |
| Leukaemia & MDS | Azacitidine + venetoclax (cycle 1 ramp-up) |
| Leukaemia & MDS | FLAG-Ida |
| Leukaemia & MDS | High-dose cytarabine (HiDAC) consolidation |
| Leukaemia & MDS | Hyper-CVAD course A |
| Leukaemia & MDS | Hyper-CVAD course B |
| Lymphoma | DA-EPOCH-R |
| Lymphoma | MATRix (primary CNS lymphoma) |
| Lymphoma | R-DHAP |
| Lymphoma | R-ICE |
| Sarcoma | AI (doxorubicin + ifosfamide) |

## The patient app — how it works

1. On a regimen page press **Give to patient (app)**.
2. Enter the date of day 1, number of cycles and your team's phone numbers (saved on your device for next time).
3. The patient scans the QR code (or you send the link). They tap **Save to this phone** and **Add dates to my phone calendar**.

**Privacy:** the plan travels inside the link itself (after the `#`, which browsers never send to a server). Nothing is stored on a server; the plan lives only on the patient's phone.

**Limits:** a sent plan cannot be changed — send a new link if the plan changes. Automatic messages from the doctor to the patient's app would need a server with accounts (not built). The app must be online (e.g. GitHub Pages) for patients to open the link.

## How to open the app

**Option 1 — on your computer:** download the repository and double-click `index.html`. It opens in your browser. No installation needed.

**Option 2 — as a free website (recommended for phones):**
1. On GitHub, open the repository → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Merge to `main`. The site is published at `https://<your-username>.github.io/chemotherapy-regimen/`.
4. On your phone, open that link and choose **Add to Home Screen**. It then works offline too.

**Option 3 — local server:** `npm start` (needs Node.js), then open http://localhost:8080.

## Adding or correcting content

All content is in plain JavaScript files in `data/`. You do not need to touch the app code. See [CONTRIBUTING.md](CONTRIBUTING.md) for the format and a copy-paste template.

After any change run the tests (needs Node.js 18+):

```
npm test
```

The tests check every regimen (known drugs, valid units, doses, links, no missing fields, readable treatment days), the kidney/liver rules, the calculators, the interaction data, the patient content and the patient link.

## Project layout

```
index.html              page shell
css/styles.css          all styles (light/dark)
js/core.js              shared namespace + fixed vocabularies
js/calc.js              BSA, CrCl, eGFR, Calvert, final dose
js/organ.js             kidney / liver / age dose-rule engine
js/schedule.js          treatment days, calendar, .ics export
js/interactions.js      interaction checker engine
js/cumulative.js        anthracycline / bleomycin totals
js/plan.js              patient plan link (encode / decode)
js/patient.js           builds plain-language leaflets
js/ui.js, js/views-*.js pages (clinician, tools, patient)
js/app.js               router and start-up
js/vendor/qrcode.js     QR code generator (MIT, Kazuhiko Arase)
data/common.js          shared text (antiemetic schedules, prophylaxis wording)
data/drugs.js           drug pages
data/dose-adjustments.js kidney / liver rules per drug
data/regimens/*.js      regimens by cancer type
data/supportive.js      prophylaxis & supportive care
data/principles.js      principles of administration
data/interactions.js    interaction rules, drug classes, other medicines
data/patient.js         patient side-effect guide, food advice, general advice
data/patient-drugs.js   plain-language drug information
tests/                  data, calculator, rules, calendar and tool tests (node --test)
sw.js                   offline cache
```

## Sources

- NCCN Clinical Practice Guidelines in Oncology (disease guidelines; Antiemesis; Hematopoietic Growth Factors; Prevention and Treatment of Cancer-Related Infections; Management of Immunotherapy-Related Toxicities).
- eviQ Cancer Treatments Online (Cancer Institute NSW).
- ASCO, ESMO, MASCC and ONS guidelines named on each page, and the pivotal trials.

Not affiliated with or endorsed by NCCN or eviQ.

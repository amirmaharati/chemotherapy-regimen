# OncoRegimens

A reference app for medical oncology: chemotherapy regimens, how to give each drug, premedication, prophylaxis, precautions and doses. Regimens are split into **outpatient** (day unit) and **inpatient** (admission).

Content is based on the **NCCN Guidelines** and **eviQ** protocols. Each regimen page lists its eviQ protocol number and the pivotal trials.

> **For qualified health professionals only.** This is a reference aid, not a prescribing system. Always check doses against the current NCCN guideline, the eviQ protocol and your hospital policy before treating a patient. Guidelines change and content can contain errors.

## What is inside

- **47 regimens** — 34 outpatient, 13 inpatient. For each: indications, doses, route, days, how to give each drug, order of administration, premedication, take-home medicines and prophylaxis, checks before each cycle, precautions, dose-modification summary, sources.
- **Dose calculator on every regimen page** — enter height, weight, age, sex and creatinine; it works out BSA, CrCl, eGFR and every drug dose (carboplatin by Calvert, vincristine capped at 2 mg, etc.).
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

The tests check every regimen (known drugs, valid units, doses, links, no missing fields) and the calculators.

## Project layout

```
index.html              page shell
css/styles.css          all styles (light/dark)
js/core.js              shared namespace + fixed vocabularies
js/calc.js              BSA, CrCl, eGFR, Calvert, dose calculation
js/app.js               pages, search, router
data/common.js          shared text (antiemetic schedules, prophylaxis wording)
data/drugs.js           drug pages
data/regimens/*.js      regimens by cancer type
data/supportive.js      prophylaxis & supportive care
data/principles.js      principles of administration
tests/                  data and calculator tests (node --test)
sw.js                   offline cache
```

## Sources

- NCCN Clinical Practice Guidelines in Oncology (disease guidelines; Antiemesis; Hematopoietic Growth Factors; Prevention and Treatment of Cancer-Related Infections; Management of Immunotherapy-Related Toxicities).
- eviQ Cancer Treatments Online (Cancer Institute NSW).
- ASCO, ESMO, MASCC and ONS guidelines named on each page, and the pivotal trials.

Not affiliated with or endorsed by NCCN or eviQ.

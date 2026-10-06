# Adding or correcting content

All content lives in `data/`. Each file is plain JavaScript that calls one function, for example `ONCO.addRegimens([...])`. You never need to change `js/app.js` to add content.

After every change, run `npm test`. The tests tell you exactly what is wrong (unknown drug, bad unit, missing field…).

## Add a regimen

1. Open the file for the cancer type in `data/regimens/` (or create a new file — then add it to `index.html` **and** `sw.js`).
2. Copy the template below into the list and fill it in.
3. Every `drug` value must match a drug `id` in `data/drugs.js`. If the drug is new, add a drug page first (see below).
4. Run `npm test`.

```js
{
  id: "short-unique-id",                 // lower-case, dashes only; used in the web address
  name: "Full regimen name (drug + drug)",
  shortName: "Short name",
  setting: "outpatient",                 // "outpatient" or "inpatient"
  settingNote: "about 2 hours",          // optional, free text
  group: "Breast",                       // cancer type; groups the list
  intent: "Curative (adjuvant)",
  indications: ["Who gets it and when."],
  cycle: { length: "21 days", count: "4 cycles" },
  emetogenic: "high",                    // high | moderate | low | minimal
  fnRisk: "intermediate",                // high | intermediate | low | expected (profound, e.g. leukaemia)
  alerts: ["Optional red-box safety points."],
  drugs: [
    {
      phase: "Cycles 1–4",               // optional: groups rows (e.g. loading vs maintenance)
      drug: "doxorubicin",               // must exist in data/drugs.js
      label: "Doxorubicin (bolus)",      // optional display name
      dose: 60,                          // number, or [min, max] range, or leave out and use doseNote
      unit: "mg/m2",                     // mg/m2 | mg/kg | mg | AUC | units/m2 | units | mcg/kg
      cap: 2,                            // optional maximum dose in mg (or units)
      doseNote: "twice daily",           // optional text after the dose
      route: "IV push",
      days: "Day 1",                     // read by the calendar: "Day 1", "Days 1–3", "Days 1, 8, 15", "Days 1–4 and 11–14", "From day 6 until recovery", "Daily from day 1"
      d: [1],                            // optional: explicit days if the text cannot be read (e.g. "Weekly × 12")
      admin: "How to give it: diluent, volume, time, line, warnings.",
      renalRules: [],                    // optional: override the drug's kidney rules for this line
      hepaticRules: [],                  // optional: override the drug's liver rules for this line
      ageRules: [{ ageAbove: 60, setDose: 1000, text: "Age > 60: 1000 mg/m² per dose." }], // optional
    },
  ],
  cycleDays: 28,                         // optional: cycle length in days if cycle.length has no number
  phaseInfo: {                           // required when drug lines use phases
    "Cycles 1–4": { days: 21, cycles: 4 },
    "Maintenance": { days: 21, cycles: null, gapBefore: 0 }, // null = until progression
  },
  order: ["Antiemetics", "Drug A", "Drug B"],
  premeds: [ONCO.text.hec],              // shared wording lives in data/common.js
  takeHome: [ONCO.text.hecHome, ONCO.text.fever],
  tags: ["antiemetic", "gcsf"],          // links to supportive/principles pages (see ONCO.vocab.tags in js/core.js)
  monitoring: ["Before each cycle: FBC, UEC, LFTs."],
  precautions: ["Important warnings."],
  doseMods: ["Short dose-modification summary."],
  notes: ["Variants, newer options."],
  references: [
    ONCO.ref.eviq(4104, "eviQ protocol title", "https://www.eviq.org.au/..."),
    ONCO.ref.nccn("Breast Cancer"),
    ONCO.ref.trial("Author et al. Trial name, Journal Year"),
  ],
}
```

Text supports `**bold**` and `[link text](https://…)`.

## Add a drug page

Add an object to `data/drugs.js`:

```js
{
  id: "drug-id",
  name: "Drug name",
  aka: ["brand names", "abbreviations"],
  class: "Drug class",
  routes: "IV",
  vesicant: "vesicant",          // vesicant | irritant | irritant-vesicant | none
  emetogenic: "moderate",        // as used alone
  emetoNote: "optional dose-dependent note",
  maxDose: "optional cumulative limit",
  alerts: ["optional red-box points"],
  admin: ["How to give it."],
  toxicities: ["Main side effects."],
  precautions: ["Interactions and warnings."],
  renal: "Renal advice.",
  hepatic: "Hepatic advice.",
  extravasation: "Required if vesicant.",
}
```

## Kidney and liver rules

Rules per drug live in `data/dose-adjustments.js`. The first matching rule wins, so list the most severe first.

```js
cisplatin: {
  renal: [
    { gfrBelow: 30, avoid: true, text: "GFR < 30: do not give." },
    { gfrBelow: 45, factor: 0.5, text: "GFR 30–44: give 50%." },
  ],
  hepatic: [{ biliMgDlAbove: 3, factor: 0.75, text: "Bilirubin > 3 mg/dL: give 75%." }],
}
```

Conditions: `gfrBelow`, `scrAbove` (mg/dL), `ageAbove`, `biliMgDlAbove`, `biliXulnAbove`, `astXulnAbove`, `alpXulnAbove` (add `all: true` to require every condition). Effects (one per rule): `factor`, `setDose` (+ optional `setNote`), `avoid`, `caution`. Add `minDose` to apply only to high doses (e.g. HiDAC). Intrathecal lines are skipped automatically.

## Interactions

`data/interactions.js` has other medicines (`agents`), `classes` (e.g. `azole-strong`) and `rules` (`a`, `b`, `severity`, `effect`, `action`). Rules can name drug ids or classes.

## Patient content

- `data/patient-drugs.js`: one entry per drug — `what` (plain words), `effects` (keys from the side-effect guide), `tips`, `diet`.
- `data/patient.js`: the side-effect guide (each with a level: `emergency`, `call`, `expected`), red flags, food advice, home-medicine text per regimen tag, general advice.

Write for patients: short sentences, everyday words.

## Add a supportive-care or principles page

Add an object to `data/supportive.js` or `data/principles.js` with `id`, `title`, `summary`, `keywords`, `sections` and `references`. A section can have `heading`, `body` (paragraphs), `bullets`, `steps` (numbered), `table` (`head` + `rows`), and `callout` (`{ type: "danger" | "warn" | "info" | "ok", text }`).

To let regimens link to a new page, add its `id` to `ONCO.vocab.tags` in `js/core.js`.

## After changing content

- Run `npm test`.
- Bump `CACHE` in `sw.js` (e.g. `oncoregimens-v2`) so installed phone apps update.
- Update `ONCO.meta.contentReviewed` in `js/core.js`.

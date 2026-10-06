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
      days: "Day 1",
      admin: "How to give it: diluent, volume, time, line, warnings.",
    },
  ],
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

## Add a supportive-care or principles page

Add an object to `data/supportive.js` or `data/principles.js` with `id`, `title`, `summary`, `keywords`, `sections` and `references`. A section can have `heading`, `body` (paragraphs), `bullets`, `steps` (numbered), `table` (`head` + `rows`), and `callout` (`{ type: "danger" | "warn" | "info" | "ok", text }`).

To let regimens link to a new page, add its `id` to `ONCO.vocab.tags` in `js/core.js`.

## After changing content

- Run `npm test`.
- Bump `CACHE` in `sw.js` (e.g. `oncoregimens-v2`) so installed phone apps update.
- Update `ONCO.meta.contentReviewed` in `js/core.js`.

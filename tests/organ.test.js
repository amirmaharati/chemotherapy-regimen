/*
 * Kidney / liver / age dose-adjustment tests.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { loadOnco } = require("./load");

const ONCO = loadOnco();
const C = ONCO.calc;

const patient = (extra) => C.patientFromInput(Object.assign({ heightCm: 170, weightKg: 70, age: 55, sex: "M", scr: 1, scrUnit: "mgdl", gfrMethod: "cg" }, extra));
const line = (rid, drug, pred) => ONCO.regimens.find((r) => r.id === rid).drugs.find((d) => d.drug === drug && (!pred || pred(d)));

test("cisplatin follows kidney function", () => {
  const cis = line("cisplatin-100-rt", "cisplatin");
  assert.equal(C.finalDose(cis, patient({ scr: 1 })).factor, 1);
  assert.equal(C.finalDose(cis, patient({ scr: 1.6 })).factor, 0.75); // CrCl ~52
  assert.equal(C.finalDose(cis, patient({ scr: 2.3 })).factor, 0.5); // ~36
  const bad = C.finalDose(cis, patient({ scr: 3 })); // ~27
  assert.equal(bad.avoid, true);
  assert.equal(bad.values.length, 0);
  assert.ok(bad.full[0] > 0, "full dose still reported");
});

test("pemetrexed and capecitabine contraindicated at low GFR", () => {
  assert.equal(C.finalDose(line("carbo-pem-pembro", "pemetrexed"), patient({ scr: 2 })).avoid, true); // ~42
  assert.equal(C.finalDose(line("capox", "capecitabine"), patient({ scr: 3 })).avoid, true);
  assert.equal(C.finalDose(line("capox", "capecitabine"), patient({ scr: 2 })).factor, 0.75);
});

test("carboplatin is not double-adjusted (Calvert already uses GFR)", () => {
  const r = C.finalDose(line("tchp", "carboplatin"), patient({ scr: 2 }));
  assert.equal(r.factor, 1);
  assert.equal(r.avoid, false);
});

test("liver rules: doxorubicin, vincristine (after cap), docetaxel", () => {
  const p = patient({ bili: 2.5, biliUnit: "mgdl" });
  const doxo = C.finalDose(line("r-chop-21", "doxorubicin"), p);
  assert.equal(doxo.factor, 0.5);
  assert.equal(doxo.values[0], Math.round(doxo.full[0] / 2));
  assert.deepEqual([...C.finalDose(line("r-chop-21", "vincristine"), p).values], [1]);
  assert.equal(C.finalDose(line("tc-breast", "docetaxel"), patient({ bili: 1.5 })).avoid, true);
  // bilirubin in µmol/L: 43 µmol/L ≈ 2.5 mg/dL
  assert.equal(C.finalDose(line("r-chop-21", "doxorubicin"), patient({ bili: 43, biliUnit: "umol" })).factor, 0.5);
});

test("docetaxel AST + ALP rule needs both values", () => {
  const doce = line("tc-breast", "docetaxel");
  assert.equal(C.finalDose(doce, patient({ bili: 0.8, ast: 70, alp: 400 })).avoid, true); // 1.75× and 3.3×
  assert.equal(C.finalDose(doce, patient({ bili: 0.8, ast: 70, alp: 150 })).avoid, false);
});

test("high-dose-only rules: cytarabine and methotrexate", () => {
  const p = patient({ scr: 2 }); // CrCl ~42
  assert.equal(C.finalDose(line("7-plus-3", "cytarabine"), p).factor, 1, "standard-dose cytarabine not reduced");
  assert.equal(C.finalDose(line("hidac-consolidation", "cytarabine"), p).factor, 0.5);
  assert.equal(C.finalDose(line("hyper-cvad-b", "methotrexate", (d) => d.dose === 800), p).factor, 0.5);
});

test("intrathecal doses skip organ rules", () => {
  const it = line("hyper-cvad-a", "methotrexate", (d) => /intrathecal/i.test(d.route));
  const r = C.finalDose(it, patient({ scr: 5, bili: 6 }));
  assert.equal(r.avoid, false);
  assert.deepEqual([...r.values], [12]);
});

test("set-dose rules: lenalidomide and age-based cytarabine", () => {
  const len = C.finalDose(line("vrd", "lenalidomide"), patient({ scr: 2.5 })); // ~33
  assert.deepEqual([...len.values], [10]);
  const len2 = C.finalDose(line("vrd", "lenalidomide"), patient({ scr: 4 }));
  assert.deepEqual([...len2.values], [15]);
  assert.match(len2.setNote, /48 hours/);
  const old = C.finalDose(line("hyper-cvad-b", "cytarabine"), patient({ age: 65 }));
  assert.equal(old.values[0], Math.round(1000 * old.full[0] / 3000));
  const young = C.finalDose(line("hyper-cvad-b", "cytarabine"), patient({ age: 45 }));
  assert.equal(young.factor, 1);
  assert.equal(young.setDose, undefined);
});

test("unknown liver values do not change doses", () => {
  const r = C.finalDose(line("r-chop-21", "doxorubicin"), patient({}));
  assert.equal(r.factor, 1);
  assert.equal(r.organ.hepatic.status, "unknown");
});

test("every dose rule is well formed and refers to a real drug", () => {
  const conds = ["gfrBelow", "scrAbove", "ageAbove", "biliMgDlAbove", "biliXulnAbove", "astXulnAbove", "alpXulnAbove"];
  const check = (r, where) => {
    assert.ok(r.text && r.text.length > 5, "text in " + where);
    assert.ok(conds.some((c) => typeof r[c] === "number"), "condition in " + where);
    const effects = ["factor", "setDose", "avoid", "caution"].filter((e) => r[e] !== undefined);
    assert.equal(effects.length, 1, "exactly one effect in " + where);
    if (r.factor !== undefined) assert.ok(r.factor > 0 && r.factor < 1, "factor range in " + where);
  };
  for (const id of Object.keys(ONCO.doseRules)) {
    assert.ok(ONCO.drugs[id], "rules for unknown drug " + id);
    const set = ONCO.doseRules[id];
    (set.renal || []).forEach((r) => check(r, id + " renal"));
    (set.hepatic || []).forEach((r) => check(r, id + " hepatic"));
    const below = (set.renal || []).filter((r) => r.gfrBelow !== undefined && !r.minDose).map((r) => r.gfrBelow);
    assert.deepEqual(below, below.slice().sort((a, b) => a - b), id + ": renal rules must go from most to least severe");
  }
  for (const reg of ONCO.regimens) {
    for (const d of reg.drugs) {
      ["renalRules", "hepaticRules", "ageRules"].forEach((k) => (d[k] || []).forEach((r) => check(r, reg.id + " " + d.drug + " " + k)));
    }
  }
});

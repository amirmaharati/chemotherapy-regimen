/*
 * Calculator tests.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { loadOnco } = require("./load");

const C = loadOnco().calc;

const close = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, a + " ≈ " + b);

test("BSA (Mosteller and DuBois)", () => {
  close(C.bsaMosteller(170, 70), 1.818, 0.001);
  close(C.bsaMosteller(180, 100), 2.236, 0.001);
  close(C.bsaDuBois(170, 70), 1.810, 0.005);
  assert.ok(Number.isNaN(C.bsaMosteller(0, 70)));
});

test("Cockcroft–Gault", () => {
  close(C.cockcroftGault(60, 70, "M", 1.0), 77.78);
  close(C.cockcroftGault(60, 70, "F", 1.0), 66.11);
  close(C.creatinineToMgDl(88.4, "umol"), 1.0, 0.0001);
});

test("CKD-EPI 2021", () => {
  close(C.ckdEpi2021(60, "M", 1.0), 86.2, 0.3);
  close(C.ckdEpi2021(50, "F", 0.8), 89.7, 0.3);
  close(C.deindexGfr(86.5, 2.0), 100, 0.1);
});

test("Calvert caps GFR at 125", () => {
  assert.equal(C.calvert(5, 100), 625);
  assert.equal(C.calvert(5, 150), 750);
  assert.equal(C.calvert(6, 125), 900);
});

test("dose for a regimen line", () => {
  const p = { bsa: 2.0, weightKg: 80, gfrForCarboplatin: 100 };
  const vcr = C.doseForEntry({ dose: 1.4, unit: "mg/m2", cap: 2 }, p);
  assert.deepEqual([...vcr.values], [2]);
  assert.equal(vcr.capped, true);

  assert.deepEqual([...C.doseForEntry({ dose: 60, unit: "mg/m2" }, p).values], [120]);
  assert.deepEqual([...C.doseForEntry({ dose: 8, unit: "mg/kg" }, p).values], [640]);
  assert.deepEqual([...C.doseForEntry({ dose: [5, 6], unit: "AUC" }, p).values], [625, 750]);
  assert.deepEqual([...C.doseForEntry({ dose: 5, unit: "AUC", cap: 600 }, p).values], [600]);
  assert.deepEqual([...C.doseForEntry({ dose: 10, unit: "units/m2" }, p).values], [20]);
  assert.equal(C.doseForEntry({ dose: 10, unit: "units/m2" }, p).outUnit, "units");
  assert.equal(C.doseForEntry({ dose: 60, unit: "mg/m2" }, { weightKg: 80 }).error, "Needs height + weight");
});

test("patient from form input", () => {
  const p = C.patientFromInput({ heightCm: 170, weightKg: 70, age: 60, sex: "M", scr: 0.5, scrUnit: "mgdl", gfrMethod: "cg", floorScr: true });
  close(p.bsa, 1.818, 0.001);
  assert.equal(p.scrMgDl, 0.7, "creatinine floored to 0.7");
  close(p.crcl, 111.1, 0.2);
  assert.equal(p.gfrForCarboplatin, p.crcl);

  const obese = C.patientFromInput({ heightCm: 165, weightKg: 120, age: 50, sex: "F", scr: 1.0, scrUnit: "mgdl", gfrMethod: "ckdepi" });
  assert.ok(obese.bmi >= 30);
  assert.ok(obese.cgWeight < 120, "uses adjusted body weight when BMI ≥ 30");
  assert.equal(obese.gfrForCarboplatin, obese.egfrDeindexed);
});

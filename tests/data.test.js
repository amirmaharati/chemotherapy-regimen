/*
 * Data integrity tests. Run with: npm test  (or node --test)
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT, scriptsFromIndex, loadOnco } = require("./load");

const ONCO = loadOnco();
const V = ONCO.vocab;
const topicIds = new Set([...ONCO.supportive, ...ONCO.principles].map((t) => t.id));

function allStrings(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => allStrings(v, out));
  return out;
}

test("every data file is loaded by index.html and cached by the service worker", () => {
  const scripts = scriptsFromIndex();
  const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
  const regimenFiles = fs.readdirSync(path.join(ROOT, "data/regimens")).map((f) => "data/regimens/" + f);
  const dataFiles = fs.readdirSync(path.join(ROOT, "data")).filter((f) => f.endsWith(".js")).map((f) => "data/" + f);
  for (const f of [...regimenFiles, ...dataFiles, "js/core.js", "js/calc.js", "js/app.js"]) {
    assert.ok(scripts.includes(f), f + " missing from index.html");
    assert.ok(sw.includes('"' + f + '"'), f + " missing from sw.js precache list");
  }
});

test("there are outpatient and inpatient regimens", () => {
  assert.ok(ONCO.regimens.filter((r) => r.setting === "outpatient").length >= 20);
  assert.ok(ONCO.regimens.filter((r) => r.setting === "inpatient").length >= 10);
});

test("regimen ids are unique and URL-safe", () => {
  const ids = ONCO.regimens.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate regimen id");
  ids.forEach((id) => assert.match(id, /^[a-z0-9]+(-[a-z0-9]+)*$/, "bad id " + id));
});

for (const r of ONCO.regimens) {
  test("regimen " + r.id + " is complete and valid", () => {
    assert.ok(r.name && r.name.length > 3, "name");
    assert.ok(V.settings[r.setting], "setting " + r.setting);
    assert.ok(r.group, "group");
    assert.ok(r.intent, "intent");
    assert.ok(Array.isArray(r.indications) && r.indications.length, "indications");
    assert.ok(r.cycle && r.cycle.length && r.cycle.count, "cycle length/count");
    assert.ok(V.emetogenic[r.emetogenic], "emetogenic " + r.emetogenic);
    assert.ok(V.fnRisk[r.fnRisk], "fnRisk " + r.fnRisk);
    assert.ok(Array.isArray(r.drugs) && r.drugs.length, "drugs");
    assert.ok(Array.isArray(r.premeds) && r.premeds.length, "premeds");
    assert.ok(Array.isArray(r.references) && r.references.length, "references");
    assert.ok(
      r.references.some((ref) => /eviQ|NCCN/.test(ref.label)),
      "needs at least one eviQ or NCCN reference"
    );

    for (const d of r.drugs) {
      const where = r.id + " / " + d.drug;
      assert.ok(ONCO.drugs[d.drug], "unknown drug " + where);
      assert.ok(V.units[d.unit], "unit " + d.unit + " in " + where);
      assert.ok(d.route && d.days && d.admin, "route/days/admin in " + where);
      if (d.dose === undefined) {
        assert.ok(d.doseNote, "dose or doseNote required in " + where);
      } else if (Array.isArray(d.dose)) {
        assert.equal(d.dose.length, 2, "range must have 2 values in " + where);
        assert.ok(d.dose[0] > 0 && d.dose[1] > d.dose[0], "range must ascend in " + where);
      } else {
        assert.ok(typeof d.dose === "number" && d.dose > 0, "dose must be a positive number in " + where);
      }
      if (d.cap !== undefined) assert.ok(typeof d.cap === "number" && d.cap > 0, "cap in " + where);
    }

    for (const t of r.tags || []) {
      assert.ok(V.tags[t], "unknown tag " + t);
      assert.ok(topicIds.has(t), "tag " + t + " has no supportive/principles topic");
    }

    for (const s of allStrings(r)) {
      assert.ok(!/undefined|NaN|\[object/.test(s), "broken text in " + r.id + ": " + s.slice(0, 80));
    }
  });
}

test("key dose sanity checks", () => {
  const dose = (id, drug, label) => {
    const r = ONCO.regimens.find((x) => x.id === id);
    const line = r.drugs.find((d) => d.drug === drug && (!label || d.label === label));
    return line.dose;
  };
  assert.equal(dose("ac", "doxorubicin"), 60);
  assert.equal(dose("ac", "cyclophosphamide"), 600);
  assert.equal(dose("r-chop-21", "vincristine"), 1.4);
  assert.equal(ONCO.regimens.find((x) => x.id === "r-chop-21").drugs.find((d) => d.drug === "vincristine").cap, 2);
  assert.equal(dose("mfolfox6", "oxaliplatin"), 85);
  assert.equal(dose("capox", "oxaliplatin"), 130);
  assert.equal(dose("hyper-cvad-a", "cyclophosphamide"), 300);
  assert.equal(dose("hyper-cvad-a", "vincristine"), 2);
  assert.equal(dose("7-plus-3", "daunorubicin"), 60);
  assert.equal(dose("bep", "cisplatin"), 20);
  assert.equal(dose("bep", "bleomycin"), 30);
  assert.equal(dose("abvd", "bleomycin"), 10);
  assert.equal(dose("r-ice", "carboplatin"), 5);
  assert.equal(ONCO.regimens.find((x) => x.id === "r-ice").drugs.find((d) => d.drug === "carboplatin").cap, 800);
});

test("vinca alkaloids are never given by a non-IV route", () => {
  for (const r of ONCO.regimens) {
    for (const d of r.drugs) {
      if (["vincristine", "vinblastine", "vinorelbine", "bortezomib"].includes(d.drug)) {
        assert.ok(!/intrathecal/i.test(d.route), r.id + ": " + d.drug + " must not be intrathecal");
      }
    }
  }
});

test("drug monographs are complete", () => {
  for (const d of Object.values(ONCO.drugs)) {
    assert.match(d.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, "bad drug id " + d.id);
    assert.ok(d.name && d.class && d.routes, "name/class/routes for " + d.id);
    assert.ok(V.vesicant[d.vesicant], "vesicant for " + d.id);
    assert.ok(V.emetogenic[d.emetogenic], "emetogenic for " + d.id);
    assert.ok(Array.isArray(d.admin) && d.admin.length, "admin for " + d.id);
    assert.ok(Array.isArray(d.toxicities) && d.toxicities.length, "toxicities for " + d.id);
    assert.ok(d.renal && d.hepatic, "renal/hepatic for " + d.id);
    if (d.vesicant === "vesicant") assert.ok(d.extravasation, "vesicant " + d.id + " needs extravasation advice");
  }
});

test("every drug monograph is used by at least one regimen", () => {
  const used = new Set(ONCO.regimens.flatMap((r) => r.drugs.map((d) => d.drug)));
  for (const id of Object.keys(ONCO.drugs)) assert.ok(used.has(id), "unused drug monograph " + id);
});

test("supportive and principles topics are well formed", () => {
  const all = [...ONCO.supportive, ...ONCO.principles];
  const ids = all.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length, "duplicate topic id");
  for (const t of all) {
    assert.ok(t.title && t.summary, "title/summary for " + t.id);
    assert.ok(Array.isArray(t.sections) && t.sections.length, "sections for " + t.id);
    for (const s of t.sections) {
      if (s.table) {
        for (const row of s.table.rows) assert.equal(row.length, s.table.head.length, "table row width in " + t.id);
      }
      if (s.auto) assert.ok(["fnRisk", "emetogenic"].includes(s.auto), "auto in " + t.id);
    }
    for (const s of allStrings(t)) assert.ok(!/undefined|NaN|\[object/.test(s), "broken text in " + t.id);
  }
  for (const tag of Object.keys(V.tags)) assert.ok(ids.includes(tag), "vocab tag " + tag + " has no topic");
});

test("reference links use https", () => {
  const refs = [...ONCO.regimens, ...ONCO.supportive, ...ONCO.principles].flatMap((x) => x.references || []);
  for (const ref of refs) {
    assert.ok(ref.label, "reference label");
    if (ref.url) assert.match(ref.url, /^https:\/\//, "https url: " + ref.url);
    if (/eviQ protocol/.test(ref.label)) assert.match(ref.url, /^https:\/\/(www\.)?eviq\.org\.au\//, "eviQ url: " + ref.url);
  }
});

/*
 * Interaction checker, cumulative dose tracker, patient content and plan link tests.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { loadOnco } = require("./load");

const ONCO = loadOnco();
const I = ONCO.interactions;
const reg = (id) => ONCO.regimens.find((r) => r.id === id);

test("interaction checker finds key pairs", () => {
  const sev = (ids) => [...I.check(ids)].map((p) => p.rule.id + ":" + p.rule.severity);
  assert.ok(sev(["vincristine", "posaconazole"]).includes("vinca-azole:avoid"));
  assert.ok(sev(["vincristine", "fluconazole"]).includes("vinca-azole-mod:major"));
  assert.ok(sev(["venetoclax", "posaconazole"]).includes("ven-posa:major"));
  assert.ok(sev(["methotrexate", "omeprazole"]).includes("mtx-clearance:avoid"));
  assert.ok(sev(["arsenic-trioxide", "ondansetron"]).includes("ato-qt:major"));
  assert.ok(sev(["capecitabine", "warfarin"]).includes("fp-warfarin:major"));
  assert.ok(sev(["rituximab", "live-vaccine"]).includes("live-vaccine:avoid"));
  assert.equal(I.check(["doxorubicin", "cyclophosphamide"]).length, 0);
});

test("results are sorted most severe first", () => {
  const res = I.check(["venetoclax", "posaconazole", "vincristine", "rituximab", "antihypertensive"]);
  assert.equal(res[0].rule.severity, "avoid");
  assert.equal(res[res.length - 1].rule.severity, "timing");
});

test("regimen interaction summary", () => {
  const r = I.forRegimen(reg("r-chop-21"));
  assert.ok(r.external.some((e) => e.rule.id === "vinca-azole" && e.others.includes("posaconazole")));
  const pac = I.forRegimen(reg("carbo-pacli-ovarian"));
  assert.ok(pac.internal.some((p) => p.rule.id === "taxane-carbo"));
});

test("interaction data refers to real drugs, agents and classes", () => {
  const D = ONCO.interactionData;
  const agentIds = D.agents.map((a) => a.id);
  assert.equal(new Set(agentIds).size, agentIds.length, "duplicate agent id");
  agentIds.forEach((id) => assert.ok(!ONCO.drugs[id], "agent id clashes with regimen drug " + id));
  const known = (x) => ONCO.drugs[x] || agentIds.includes(x) || D.classes[x] || x === "anticancer";
  Object.keys(D.classes).forEach((c) => D.classes[c].forEach((m) => assert.ok(ONCO.drugs[m] || agentIds.includes(m), "class " + c + " member " + m)));
  D.supportiveDrugs.forEach((id) => assert.ok(ONCO.drugs[id], "supportive " + id));
  const ruleIds = D.rules.map((r) => r.id);
  assert.equal(new Set(ruleIds).size, ruleIds.length, "duplicate rule id");
  for (const r of D.rules) {
    [...r.a, ...r.b].forEach((x) => assert.ok(known(x), r.id + ": unknown " + x));
    assert.ok(["avoid", "major", "moderate", "timing"].includes(r.severity), r.id + " severity");
    assert.ok(r.effect && r.action, r.id + " text");
  }
});

test("cumulative tracker", () => {
  const C = ONCO.cumulative;
  assert.equal(C.perCycle(reg("r-chop-21")).doxorubicin.amount, 50);
  assert.equal(C.perCycle(reg("doxorubicin-ifosfamide")).doxorubicin.amount, 75);
  assert.equal(C.perCycle(reg("abvd")).doxorubicin.amount, 50);
  assert.equal(C.perCycle(reg("7-plus-3")).daunorubicin.amount, 180);
  assert.equal(C.perCycle(reg("bep")).bleomycin.amount, 90);
  assert.equal(C.perCycle(reg("abvd"), 2).bleomycin.amount, 40);
  assert.ok(Number.isNaN(C.perCycle(reg("abvd")).bleomycin.amount), "ABVD bleomycin needs BSA");

  const t = C.total([{ type: "regimen", regimenId: "r-chop-21", cycles: 6 }, { type: "manual", drug: "epirubicin", amount: 300 }], 1.8);
  assert.equal(t.byDrug.doxorubicin, 300);
  assert.equal(t.doxEq, 300 + 240);
  const a = C.assess(t, false);
  assert.equal(a.messages[0].level, "danger");
  assert.equal(C.assess(C.total([{ type: "regimen", regimenId: "ac", cycles: 4 }]), false).messages[0].level, "ok");
  assert.equal(C.assess(C.total([{ type: "regimen", regimenId: "bep", cycles: 4 }]), false).messages[0].level, "caution");
});

test("patient content covers every drug, effect and tag", () => {
  const P = ONCO.patientContent;
  for (const id of Object.keys(ONCO.drugs)) {
    const info = ONCO.patientDrugs[id];
    assert.ok(info && info.what, "patient info for " + id);
    (info.effects || []).forEach((k) => assert.ok(P.sideEffects[k], id + ": unknown side effect " + k));
  }
  for (const k of Object.keys(P.sideEffects)) {
    const e = P.sideEffects[k];
    assert.ok(P.levels[e.level], k + " level");
    assert.ok(e.title && e.what, k + " text");
  }
  for (const tag of Object.keys(ONCO.vocab.tags)) assert.ok(P.tagText[tag], "patient text for tag " + tag);
});

test("leaflet builder groups side effects by level", () => {
  const b = ONCO.patient.build(reg("ac"));
  assert.ok(b.effects.emergency.some((e) => e.key === "infection"));
  assert.ok(b.effects.expected.some((e) => e.key === "red-urine"));
  assert.ok(b.effects.expected.some((e) => e.key === "hair-loss"));
  assert.equal(b.drugs.length, 3);
  assert.ok(b.home.length > 0);
  assert.ok(b.schedule[0].days.some((d) => d.day === 1));
  for (const r of ONCO.regimens) {
    const x = ONCO.patient.build(r);
    assert.ok(x.drugs.every((d) => d.what), r.id + " leaflet drugs");
  }
});

test("plan link round trip and status", () => {
  const P = ONCO.plan;
  const plan = { regimenId: "ac", start: "2026-10-12", cycles: 4, name: "Sára ✓", phone: "+98 21 1234", emergency: "115", team: "Clinic", hospital: "", message: "Blood test the day before." };
  const code = P.encode(plan);
  assert.match(code, /^[A-Za-z0-9_-]+$/);
  const back = P.decode(code);
  assert.equal(back.name, "Sára ✓");
  assert.equal(back.cycles, 4);
  assert.equal(back.message, plan.message);
  assert.equal(P.decode("not-a-plan"), null);
  assert.equal(P.decode(P.toBase64Url(JSON.stringify({ v: 1, r: "nope", s: "2026-01-01" }))), null);

  const st = P.status(back, new Date(2026, 9, 20)); // day 9 of cycle 1
  assert.equal(st.current.cycle, 1);
  assert.equal(st.current.day, 9);
  assert.equal(st.next.cycle, 2);
  assert.equal(st.finished, false);
  assert.equal(P.status(back, new Date(2027, 5, 1)).finished, true);
});

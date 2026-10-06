/*
 * Calendar / schedule tests.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { loadOnco } = require("./load");

const ONCO = loadOnco();
const S = ONCO.schedule;
const reg = (id) => ONCO.regimens.find((r) => r.id === id);

test("parseDays reads common wording", () => {
  const days = (t) => [...S.parseDays(t).days];
  assert.deepEqual(days("Day 1"), [1]);
  assert.deepEqual(days("Days 1–3"), [1, 2, 3]);
  assert.deepEqual(days("Days 1, 8, 15"), [1, 8, 15]);
  assert.deepEqual(days("Days 1–4 and 11–14"), [1, 2, 3, 4, 11, 12, 13, 14]);
  assert.deepEqual(days("Days −5 and 0"), [-5, 0]);
  assert.deepEqual(days("Days 1, 8, 15 (some protocols days 2, 9, 16)"), [1, 8, 15]);
  assert.deepEqual(days("Day 7 (or 8)"), [7]);
  assert.deepEqual(days("Day 1 every week"), [1]);
  assert.deepEqual(days("Days 1–6, then daily until neutrophil recovery"), [1, 2, 3, 4, 5, 6]);
  assert.equal(S.parseDays("From day 6 until ANC recovery").untilRecovery, true);
  assert.equal(S.parseDays("Daily from day 1").daily, true);
  assert.equal(S.parseDays("Weekly × 12"), null);
});

test("every regimen line has calendar days inside its cycle", () => {
  for (const r of ONCO.regimens) {
    for (const ph of S.phases(r)) {
      assert.ok(ph.length > 0, r.id + " phase '" + ph.name + "' has no cycle length");
      for (const d of ph.lines) {
        const ld = S.lineDays(d, ph.length);
        assert.ok(ld && ld.days.length, r.id + ": cannot read days '" + d.days + "' for " + d.drug + " (add d: [..])");
        ld.days.forEach((day) => assert.ok(day <= ph.length && day >= -14, r.id + ": day " + day + " outside " + ph.length + "-day cycle (" + d.drug + ")"));
      }
    }
  }
});

test("phaseInfo keys match phases, and phased regimens define cycles", () => {
  for (const r of ONCO.regimens) {
    const names = S.phases(r).map((p) => p.name);
    Object.keys(r.phaseInfo || {}).forEach((k) => assert.ok(names.includes(k), r.id + ": phaseInfo key not used: " + k));
    if (names.length > 1) {
      names.forEach((n) => assert.ok(r.phaseInfo && n in r.phaseInfo && "cycles" in r.phaseInfo[n], r.id + ": phase '" + n + "' needs phaseInfo with cycles"));
    }
  }
});

test("AC dates from a start date", () => {
  const dates = S.treatmentDates(reg("ac"), new Date(2026, 9, 12), 4);
  assert.equal(dates.length, 8); // day 1 chemo + day 2 G-CSF × 4
  assert.equal(S.isoDate(dates[0].date), "2026-10-12");
  assert.equal(S.isoDate(dates[2].date), "2026-11-02");
  assert.equal(dates[6].cycle, 4);
});

test("phased regimens lay out in order (KEYNOTE-522, Stupp)", () => {
  const kn = S.expandCycles(reg("keynote-522"), new Date(2026, 0, 1));
  assert.equal(kn.length, 17);
  assert.equal(kn[8].phase, "After surgery — adjuvant");
  const stupp = S.expandCycles(reg("stupp-temozolomide"), new Date(2026, 0, 1));
  assert.equal(stupp.length, 7);
  assert.equal(S.daysBetween(stupp[0].start, stupp[1].start), 42 + 28); // RT phase + 4-week gap
});

test("MATRix rituximab falls before day 1", () => {
  const dates = S.treatmentDates(reg("matrix"), new Date(2026, 0, 10), 1);
  assert.equal(S.isoDate(dates[0].date), "2026-01-04"); // day −5
  assert.equal(S.isoDate(dates[1].date), "2026-01-09"); // day 0
});

test("ics export", () => {
  const ics = S.ics([{ date: new Date(2026, 9, 12), title: "Chemo, cycle 1; day 1", description: "Doxorubicin\nCyclophosphamide" }], "Test");
  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /DTSTART;VALUE=DATE:20261012/);
  assert.match(ics, /SUMMARY:Chemo\\, cycle 1\\; day 1/);
  assert.match(ics, /TRIGGER;RELATED=START:-PT6H/);
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
});

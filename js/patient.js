/*
 * Builds plain-language patient information for a regimen (leaflet + patient app).
 * Pure functions — no DOM. Content comes from data/patient.js and data/patient-drugs.js.
 */
(function (root) {
  "use strict";

  const ONCO = root.ONCO;
  const PT = {};

  PT.routeWords = function (route) {
    const r = ONCO.patientContent.routes.find(function (x) { return x[0].test(route || ""); });
    return r ? r[1] : route;
  };

  PT.drugInfo = function (id) {
    const info = ONCO.patientDrugs[id] || {};
    const d = ONCO.drugs[id] || {};
    return {
      id: id,
      name: info.name || d.name || id,
      what: info.what || "",
      effects: info.effects || [],
      tips: info.tips || [],
      diet: info.diet || [],
    };
  };

  function uniq(list) {
    const out = [];
    list.forEach(function (x) {
      if (out.indexOf(x) < 0) out.push(x);
    });
    return out;
  }

  PT.lowCountsLikely = function (regimen) {
    return ["high", "intermediate", "expected"].indexOf(regimen.fnRisk) >= 0;
  };

  PT.build = function (regimen) {
    const C = ONCO.patientContent;
    const drugIds = uniq(regimen.drugs.map(function (d) { return d.drug; }));

    // Schedule of the first cycle of each phase, in plain words.
    const schedule = ONCO.schedule.calendar(regimen).map(function (ph) {
      return {
        phase: ph.phase,
        length: ph.length,
        days: ph.days
          .filter(function (d) { return d.items.length; })
          .map(function (d) {
            const seen = [];
            const items = [];
            d.items.forEach(function (it) {
              const name = PT.drugInfo(it.entry.drug).name;
              if (seen.indexOf(name) >= 0) return;
              seen.push(name);
              items.push({ name: name, how: PT.routeWords(it.entry.route), untilRecovery: it.untilRecovery });
            });
            return { day: d.day, items: items };
          }),
      };
    });

    const drugs = drugIds.map(function (id) {
      const info = PT.drugInfo(id);
      const routes = uniq(regimen.drugs.filter(function (d) { return d.drug === id; }).map(function (d) { return PT.routeWords(d.route); }));
      return Object.assign(info, { how: routes.join("; ") });
    });

    // Side effects from every drug, grouped by level, first-mentioned first.
    let keys = [];
    drugs.forEach(function (d) { keys = keys.concat(d.effects); });
    if ((regimen.tags || []).indexOf("hypersensitivity") >= 0) keys.push("allergy");
    if ((regimen.tags || []).indexOf("extravasation") >= 0) keys.push("drip-site");
    if ((regimen.tags || []).indexOf("tls") >= 0) keys.push("tumour-lysis");
    if ((regimen.tags || []).indexOf("vte") >= 0) keys.push("clots");
    if (PT.lowCountsLikely(regimen)) keys.unshift("infection");
    keys = uniq(keys).filter(function (k) { return C.sideEffects[k]; });
    const effects = { emergency: [], call: [], expected: [] };
    keys.forEach(function (k) {
      const e = C.sideEffects[k];
      effects[e.level].push(Object.assign({ key: k }, e));
    });

    const home = (regimen.tags || []).map(function (t) { return C.tagText[t]; }).filter(Boolean);

    const dietSpecific = [];
    drugs.forEach(function (d) {
      d.diet.forEach(function (tip) { dietSpecific.push({ drug: d.name, tip: tip }); });
    });
    const situational = [];
    if (keys.indexOf("nausea") >= 0) situational.push({ title: "If you feel sick", items: C.nutrition.nausea });
    if (keys.indexOf("mouth") >= 0) situational.push({ title: "If your mouth is sore", items: C.nutrition.mouth });
    if (keys.indexOf("diarrhoea") >= 0) situational.push({ title: "If you have diarrhoea", items: C.nutrition.diarrhoea });
    if (keys.indexOf("constipation") >= 0) situational.push({ title: "If you are constipated", items: C.nutrition.constipation });

    return {
      regimen: regimen,
      setting: regimen.setting === "inpatient" ? "You will stay in hospital for this treatment" + (regimen.settingNote ? " (" + regimen.settingNote + ")." : ".") : "You will usually have this treatment in the day unit and go home the same day" + (regimen.settingNote ? " (" + regimen.settingNote + ")." : "."),
      cycleText: regimen.cycle.length,
      cyclesText: regimen.cycle.count,
      lowCounts: PT.lowCountsLikely(regimen),
      schedule: schedule,
      drugs: drugs,
      effects: effects,
      home: home,
      diet: { eat: C.nutrition.eat, avoid: C.nutrition.avoid, specific: dietSpecific, situational: situational },
      redFlags: C.redFlags,
      general: C.general,
      questions: C.questions,
    };
  };

  ONCO.patient = PT;
})(typeof window !== "undefined" ? window : globalThis);

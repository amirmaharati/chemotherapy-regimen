/*
 * Interaction checker engine (data in data/interactions.js). Pure functions — no DOM.
 */
(function (root) {
  "use strict";

  const ONCO = root.ONCO;
  const I = {};
  const ORDER = { avoid: 0, major: 1, moderate: 2, timing: 3 };
  I.SEVERITY_LABEL = { avoid: "Avoid", major: "Major", moderate: "Moderate", timing: "Timing / order" };

  function D() {
    return ONCO.interactionData;
  }

  // Everything that can be picked: regimen drugs + other medicines.
  I.items = function () {
    const drugs = Object.values(ONCO.drugs).map(function (d) {
      return { id: d.id, name: d.name, aka: d.aka || [], kind: "drug" };
    });
    const agents = D().agents.map(function (a) {
      return { id: a.id, name: a.name, aka: a.aka || [], kind: "agent" };
    });
    return drugs.concat(agents).sort(function (a, b) { return a.name.localeCompare(b.name); });
  };

  I.name = function (id) {
    if (ONCO.drugs[id]) return ONCO.drugs[id].name;
    const a = D().agents.find(function (x) { return x.id === id; });
    return a ? a.name : id;
  };

  I.tokens = function (id) {
    const t = [id];
    const classes = D().classes;
    Object.keys(classes).forEach(function (c) {
      if (classes[c].indexOf(id) >= 0) t.push(c);
    });
    if (ONCO.drugs[id] && D().supportiveDrugs.indexOf(id) < 0) t.push("anticancer");
    return t;
  };

  function matchesSide(id, side) {
    const t = I.tokens(id);
    return side.some(function (s) { return t.indexOf(s) >= 0; });
  }

  // Does this rule involve the drug? Returns the ids on the other side, or null.
  I.otherSide = function (id, rule) {
    if (matchesSide(id, rule.a)) return I.members(rule.b).filter(function (x) { return x !== id; });
    if (matchesSide(id, rule.b)) return I.members(rule.a).filter(function (x) { return x !== id; });
    return null;
  };

  // All interactions among a list of ids. Returns [{ rule, x, y }] most severe first.
  I.check = function (ids) {
    const out = [];
    const seen = {};
    D().rules.forEach(function (rule) {
      ids.forEach(function (x) {
        ids.forEach(function (y) {
          if (x === y) return;
          if (matchesSide(x, rule.a) && matchesSide(y, rule.b)) {
            const key = rule.id + "|" + [x, y].sort().join("|");
            if (seen[key]) return;
            seen[key] = true;
            out.push({ rule: rule, x: x, y: y });
          }
        });
      });
    });
    return out.sort(function (p, q) { return ORDER[p.rule.severity] - ORDER[q.rule.severity]; });
  };

  // Names of everything on one side of a rule (classes expanded).
  I.members = function (side) {
    const classes = D().classes;
    const ids = [];
    side.forEach(function (s) {
      if (s === "anticancer") return;
      (classes[s] || [s]).forEach(function (id) {
        if (ids.indexOf(id) < 0) ids.push(id);
      });
    });
    return ids;
  };

  /*
   * For a regimen: interactions between its own drugs (internal) and medicines to watch for (external).
   * external: [{ rule, drug, others: [ids] }]
   */
  I.forRegimen = function (regimen) {
    const regIds = [];
    regimen.drugs.forEach(function (d) {
      if (regIds.indexOf(d.drug) < 0) regIds.push(d.drug);
    });
    const internal = I.check(regIds);
    const external = [];
    D().rules.forEach(function (rule) {
      [["a", "b"], ["b", "a"]].forEach(function (pair) {
        regIds.forEach(function (id) {
          if (!matchesSide(id, rule[pair[0]])) return;
          const others = I.members(rule[pair[1]]).filter(function (o) { return regIds.indexOf(o) < 0 && !ONCO.drugs[o]; });
          if (!others.length) return;
          if (external.some(function (e) { return e.rule.id === rule.id && e.drug === id; })) return;
          external.push({ rule: rule, drug: id, others: others });
        });
      });
    });
    external.sort(function (p, q) { return ORDER[p.rule.severity] - ORDER[q.rule.severity]; });
    return { internal: internal, external: external };
  };

  ONCO.interactions = I;
})(typeof window !== "undefined" ? window : globalThis);

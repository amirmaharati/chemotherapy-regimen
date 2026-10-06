/*
 * Patient treatment plan: encoded into a link / QR code by the doctor, saved on the patient's phone.
 * The plan travels in the URL fragment (#/p/...), which browsers never send to a server.
 * Pure functions — no DOM.
 */
(function (root) {
  "use strict";

  const ONCO = root.ONCO;
  const P = {};
  const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

  function utf8Bytes(str) {
    const s = unescape(encodeURIComponent(str));
    const out = [];
    for (let i = 0; i < s.length; i++) out.push(s.charCodeAt(i));
    return out;
  }

  function bytesToUtf8(bytes) {
    let s = "";
    bytes.forEach(function (b) { s += String.fromCharCode(b); });
    return decodeURIComponent(escape(s));
  }

  // base64url without padding
  P.toBase64Url = function (str) {
    const b = utf8Bytes(str);
    let out = "";
    for (let i = 0; i < b.length; i += 3) {
      const n = (b[i] << 16) | ((b[i + 1] || 0) << 8) | (b[i + 2] || 0);
      out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63];
      if (i + 1 < b.length) out += B64[(n >> 6) & 63];
      if (i + 2 < b.length) out += B64[n & 63];
    }
    return out;
  };

  P.fromBase64Url = function (code) {
    const bytes = [];
    let buf = 0;
    let bits = 0;
    for (let i = 0; i < code.length; i++) {
      const v = B64.indexOf(code[i]);
      if (v < 0) throw new Error("bad character");
      buf = (buf << 6) | v;
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        bytes.push((buf >> bits) & 255);
      }
    }
    return bytesToUtf8(bytes);
  };

  /*
   * plan: { regimenId, start ("YYYY-MM-DD"), cycles, name, phone, emergency, team, hospital, message }
   */
  P.encode = function (plan) {
    const short = { v: 1, r: plan.regimenId, s: plan.start, c: Number(plan.cycles) || undefined };
    if (plan.name) short.n = plan.name;
    if (plan.phone) short.p = plan.phone;
    if (plan.emergency) short.e = plan.emergency;
    if (plan.team) short.t = plan.team;
    if (plan.hospital) short.h = plan.hospital;
    if (plan.message) short.m = plan.message;
    return P.toBase64Url(JSON.stringify(short));
  };

  // Returns a plan or null if the code is broken / refers to an unknown regimen.
  P.decode = function (code) {
    try {
      const o = JSON.parse(P.fromBase64Url(String(code || "")));
      if (!o || o.v !== 1 || typeof o.r !== "string") return null;
      if (!ONCO.regimens.some(function (r) { return r.id === o.r; })) return null;
      if (!ONCO.schedule.parseDate(o.s)) return null;
      const str = function (x, max) { return typeof x === "string" ? x.slice(0, max) : ""; };
      return {
        regimenId: o.r,
        start: o.s,
        cycles: Math.max(1, Math.min(60, Number(o.c) || ONCO.schedule.defaultCycles(ONCO.regimens.find(function (r) { return r.id === o.r; })))),
        name: str(o.n, 60),
        phone: str(o.p, 40),
        emergency: str(o.e, 40),
        team: str(o.t, 80),
        hospital: str(o.h, 80),
        message: str(o.m, 500),
      };
    } catch (e) {
      return null;
    }
  };

  // Where the patient is in their treatment on a given day.
  P.status = function (plan, today) {
    const reg = ONCO.regimens.find(function (r) { return r.id === plan.regimenId; });
    const start = ONCO.schedule.parseDate(plan.start);
    const dates = ONCO.schedule.treatmentDates(reg, start, plan.cycles);
    const cycles = ONCO.schedule.expandCycles(reg, start, plan.cycles);
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const next = dates.find(function (d) { return ONCO.schedule.daysBetween(t, d.date) >= 0; }) || null;
    let current = null;
    cycles.forEach(function (c) {
      const day = ONCO.schedule.daysBetween(c.start, t) + 1;
      if (day >= 1 && day <= c.length) current = { cycle: c.cycle, day: day, length: c.length, phase: c.phase };
    });
    const finished = !next && dates.length && ONCO.schedule.daysBetween(dates[dates.length - 1].date, t) > 0;
    return { regimen: reg, dates: dates, next: next, current: current, finished: !!finished, totalCycles: cycles.length };
  };

  ONCO.plan = P;
})(typeof window !== "undefined" ? window : globalThis);

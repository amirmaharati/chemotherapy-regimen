/*
 * Treatment schedule: which drugs are given on which day of a cycle, cycle lengths,
 * calendar dates and .ics (phone calendar) export. Pure functions — no DOM.
 *
 * Drug lines describe days in words ("Days 1, 8, 15"). parseDays() reads that text.
 * A line can override with an explicit array: d: [1, 8, 15].
 * Regimens with phases describe each phase in phaseInfo: { "<phase>": { days, cycles, gapBefore } }.
 */
(function (root) {
  "use strict";

  const ONCO = root.ONCO;
  const S = {};

  function range(a, b) {
    const out = [];
    for (let i = a; i <= b; i++) out.push(i);
    return out;
  }

  /*
   * Returns one of:
   *   { days: [1, 8, 15] }
   *   { daily: true, from: 1 }            — every day of the cycle from day N
   *   { from: 6, untilRecovery: true }    — starts on day N, continues until counts recover
   *   null                                — could not read the text
   */
  S.parseDays = function (text) {
    if (!text) return null;
    let t = String(text).toLowerCase().replace(/[\u2013\u2014\u2212]/g, "-");
    t = t.split("(")[0].split(" or ")[0].split(";")[0].trim();
    let m = t.match(/^from day (-?\d+)/);
    if (m) return { from: Number(m[1]), untilRecovery: true };
    if (/^daily/.test(t) || /^day 1 to end/.test(t)) {
      m = t.match(/day (-?\d+)/);
      return { daily: true, from: m ? Number(m[1]) : 1 };
    }
    m = t.match(/^days? (.+)$/);
    if (!m) return null;
    const days = [];
    m[1].split(/,|\band\b/).forEach(function (tok) {
      const r = tok.trim().match(/^(-?\d+)(?:\s*-\s*(-?\d+))?/);
      if (!r) return;
      const a = Number(r[1]);
      const b = r[2] !== undefined ? Number(r[2]) : a;
      range(Math.min(a, b), Math.max(a, b)).forEach(function (d) {
        if (days.indexOf(d) < 0) days.push(d);
      });
    });
    return days.length ? { days: days.sort(function (x, y) { return x - y; }) } : null;
  };

  // Days of the cycle on which a line is given, for a phase of `length` days.
  S.lineDays = function (entry, length) {
    if (Array.isArray(entry.d)) return { days: entry.d.slice() };
    const p = S.parseDays(entry.days);
    if (!p) return null;
    if (p.daily) return { days: range(p.from, length || p.from), daily: true };
    if (p.untilRecovery) return { days: [p.from], untilRecovery: true };
    return p;
  };

  function firstNumberBefore(text, word) {
    const m = String(text || "").match(new RegExp("(\\d+)\\s*" + word));
    return m ? Number(m[1]) : null;
  }

  // Phases in order of first appearance. Regimens without phases have one phase named "".
  S.phases = function (regimen) {
    const names = [];
    regimen.drugs.forEach(function (d) {
      const n = d.phase || "";
      if (names.indexOf(n) < 0) names.push(n);
    });
    const defLength = regimen.cycleDays || firstNumberBefore(regimen.cycle && regimen.cycle.length, "days?");
    const info = regimen.phaseInfo || {};
    return names.map(function (name) {
      const pi = info[name] || {};
      return {
        name: name,
        length: pi.days || defLength || null,
        cycles: pi.cycles === undefined ? null : pi.cycles,
        gapBefore: pi.gapBefore || 0,
        lines: regimen.drugs.filter(function (d) {
          return (d.phase || "") === name;
        }),
      };
    });
  };

  // Default number of cycles: sum of phase cycles (phased regimens) or the first number in cycle.count.
  S.defaultCycles = function (regimen) {
    const phases = S.phases(regimen);
    if (phases.length > 1 || phases[0].cycles !== null) {
      let total = 0;
      phases.forEach(function (p) {
        total += p.cycles === null ? 3 : p.cycles;
      });
      return total;
    }
    return firstNumberBefore(regimen.cycle && regimen.cycle.count, "") || 1;
  };

  /*
   * Calendar for one cycle of each phase.
   * Returns [{ phase, length, firstDay, days: [{ day, items: [{ entry, index, untilRecovery }] }] }]
   */
  S.calendar = function (regimen) {
    return S.phases(regimen).map(function (ph) {
      const byDay = {};
      let minDay = 1;
      let maxDay = ph.length || 1;
      ph.lines.forEach(function (entry) {
        const ld = S.lineDays(entry, ph.length);
        if (!ld) return;
        ld.days.forEach(function (day) {
          (byDay[day] = byDay[day] || []).push({ entry: entry, index: regimen.drugs.indexOf(entry), untilRecovery: !!ld.untilRecovery });
          if (day < minDay) minDay = day;
          if (day > maxDay) maxDay = day;
        });
      });
      const days = range(minDay, maxDay).filter(function (d) { return d !== 0 || byDay[0]; }).map(function (day) {
        return { day: day, items: byDay[day] || [] };
      });
      return { phase: ph.name, length: ph.length, firstDay: minDay, days: days };
    });
  };

  /*
   * Lay out cycles in time from a start date.
   * Returns [{ cycle, phase, start (Date of day 1), length }]
   */
  S.expandCycles = function (regimen, startDate, totalCycles) {
    const phases = S.phases(regimen);
    const out = [];
    let offset = 0;
    let n = 0;
    const total = totalCycles || S.defaultCycles(regimen);
    phases.forEach(function (ph, i) {
      if (n >= total) return;
      offset += ph.gapBefore;
      const isLast = i === phases.length - 1;
      let cycles = ph.cycles === null ? (isLast ? total - n : 1) : ph.cycles;
      if (isLast && ph.cycles !== null && phases.length === 1) cycles = total;
      cycles = Math.min(cycles, total - n);
      for (let c = 0; c < cycles; c++) {
        n++;
        out.push({ cycle: n, phase: ph.name, start: S.addDays(startDate, offset), length: ph.length || 21 });
        offset += ph.length || 21;
      }
    });
    return out;
  };

  /*
   * Every treatment day with its date.
   * Returns [{ date, cycle, day, phase, items }]
   */
  S.treatmentDates = function (regimen, startDate, totalCycles) {
    const cal = S.calendar(regimen);
    const out = [];
    S.expandCycles(regimen, startDate, totalCycles).forEach(function (cy) {
      const ph = cal.find(function (p) { return p.phase === cy.phase; });
      ph.days.forEach(function (d) {
        if (!d.items.length) return;
        // Day 1 is the cycle start date; day 0 is the day before, day -5 six days before.
        out.push({ date: S.addDays(cy.start, d.day - 1), cycle: cy.cycle, day: d.day, phase: cy.phase, items: d.items });
      });
    });
    return out;
  };

  S.parseDate = function (iso) {
    const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return isNaN(d.getTime()) ? null : d;
  };

  S.addDays = function (date, n) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() + n);
    return d;
  };

  S.isoDate = function (date) {
    const p = function (x) { return (x < 10 ? "0" : "") + x; };
    return date.getFullYear() + "-" + p(date.getMonth() + 1) + "-" + p(date.getDate());
  };

  S.daysBetween = function (a, b) {
    const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((ub - ua) / 86400000);
  };

  function icsEscape(s) {
    return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  }

  function icsFold(line) {
    // RFC 5545: lines over 75 octets are folded. Approximate by characters.
    const parts = [];
    let rest = line;
    while (rest.length > 74) {
      parts.push(rest.slice(0, 74));
      rest = " " + rest.slice(74);
    }
    parts.push(rest);
    return parts.join("\r\n");
  }

  /*
   * events: [{ date: Date, title, description }]
   * All-day events with a reminder at 6 pm the evening before.
   */
  S.ics = function (events, calName) {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//OncoRegimens//EN", "CALSCALE:GREGORIAN", "X-WR-CALNAME:" + icsEscape(calName || "Chemotherapy")];
    events.forEach(function (ev, i) {
      const day = S.isoDate(ev.date).replace(/-/g, "");
      const next = S.isoDate(S.addDays(ev.date, 1)).replace(/-/g, "");
      lines.push(
        "BEGIN:VEVENT",
        "UID:" + day + "-" + i + "@oncoregimens",
        "DTSTAMP:" + stamp,
        "DTSTART;VALUE=DATE:" + day,
        "DTEND;VALUE=DATE:" + next,
        "SUMMARY:" + icsEscape(ev.title),
        "DESCRIPTION:" + icsEscape(ev.description || ""),
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        "DESCRIPTION:" + icsEscape(ev.title),
        "TRIGGER;RELATED=START:-PT6H",
        "END:VALARM",
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");
    return lines.map(icsFold).join("\r\n") + "\r\n";
  };

  ONCO.schedule = S;
})(typeof window !== "undefined" ? window : globalThis);

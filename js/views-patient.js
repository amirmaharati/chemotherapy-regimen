/*
 * Patient views: printable leaflet, doctor's "give to patient" page (link + QR),
 * receiving a plan on the patient's phone, and the patient's own home page.
 */
(function () {
  "use strict";

  const ONCO = window.ONCO;
  const ui = ONCO.ui;
  const esc = ui.esc;
  const fmt = ui.fmt;
  const main = () => document.getElementById("main");
  const views = ONCO.views;
  const S = ONCO.schedule;

  function plans() {
    return ui.storage.get("onco.plans", []);
  }

  // ---------- Shared leaflet body ----------

  function effectList(items, withHelp) {
    return (
      '<ul class="effects">' +
      items
        .map(
          (e) =>
            "<li><strong>" + esc(e.title) + "</strong>" +
            (e.what ? "<div>" + esc(e.what) + "</div>" : "") +
            (withHelp && e.help && e.help.length ? '<div class="help">What helps: ' + e.help.map(fmt).join(" ") + "</div>" : "") +
            (e.call ? '<div class="call">' + fmt(e.call) + "</div>" : "") +
            "</li>"
        )
        .join("") +
      "</ul>"
    );
  }

  function leafletBody(b, opts) {
    opts = opts || {};
    const phone = opts.phone ? ' Call: <a href="tel:' + esc(opts.phone) + '">' + esc(opts.phone) + "</a>." : "";
    const emergency = opts.emergency ? ' Emergency / out of hours: <a href="tel:' + esc(opts.emergency) + '">' + esc(opts.emergency) + "</a>." : "";
    return (
      (opts.skipSchedule
        ? ""
        : '<section class="lf-sec" id="lf-schedule"><h2>What happens on each day</h2>' +
          b.schedule
            .map(
              (ph) =>
                (ph.phase ? "<h3>" + esc(ph.phase) + "</h3>" : "") +
                "<ul>" + ph.days.map((d) => "<li><strong>Day " + d.day + ":</strong> " + d.items.map((it) => esc(it.name) + ' <span class="muted">(' + esc(it.how) + (it.untilRecovery ? ", daily until your blood counts recover" : "") + ")</span>").join("; ") + "</li>").join("") + "</ul>" +
                (ph.length ? '<p class="muted small">Then the next cycle starts on day ' + (ph.length + 1) + " (if your blood tests are OK).</p>" : "")
            )
            .join("") +
          "</section>") +
      '<section class="lf-sec" id="lf-medicines"><h2>Your medicines</h2>' +
      b.drugs.map((d) => '<div class="lf-drug"><h3>' + esc(d.name) + "</h3><p>" + esc(d.what) + '</p><p class="muted">How it is given: ' + esc(d.how) + "</p>" + ui.list(d.tips) + "</div>").join("") +
      (b.home.length ? "<h3>Other medicines and checks</h3>" + ui.list(b.home) : "") +
      "</section>" +
      '<section class="lf-sec" id="lf-effects"><h2>Side effects: what is important and what is not</h2>' +
      '<div class="level emergency"><h3>🚨 Go to hospital or call now — day or night</h3>' + ui.list(b.redFlags) + (b.effects.emergency.length ? effectList(b.effects.emergency, false) : "") + "<p><strong>Do not wait until the morning." + phone + emergency + "</strong></p></div>" +
      (b.effects.call.length ? '<div class="level call"><h3>📞 Call your team today</h3>' + effectList(b.effects.call, true) + (phone ? "<p>" + phone + "</p>" : "") + "</div>" : "") +
      (b.effects.expected.length ? '<div class="level expected"><h3>✅ Common and usually not dangerous</h3><p>Tell your team at your next visit. Self-care tips are below each one.</p>' + effectList(b.effects.expected, true) + "</div>" : "") +
      (b.lowCounts ? '<p class="callout info">Your white blood cells (which fight infection) are usually <strong>lowest 7–14 days after each treatment</strong>. Take extra care then, and check your temperature if you feel unwell.</p>' : "") +
      "</section>" +
      '<section class="lf-sec" id="lf-food"><h2>Food and drink</h2>' +
      '<div class="grid-2"><div><h3>Eat and drink</h3>' + ui.list(b.diet.eat) + "</div><div><h3>Avoid</h3>" + ui.list(b.diet.avoid) + "</div></div>" +
      (b.diet.specific.length ? "<h3>For your medicines</h3><ul>" + b.diet.specific.map((x) => "<li><strong>" + esc(x.drug) + ":</strong> " + fmt(x.tip) + "</li>").join("") + "</ul>" : "") +
      b.diet.situational.map((s) => "<h3>" + esc(s.title) + "</h3>" + ui.list(s.items)).join("") +
      "</section>" +
      '<section class="lf-sec" id="lf-advice"><h2>Other important things</h2>' + ui.list(b.general) + "</section>" +
      '<section class="lf-sec"><h2>Questions you may want to ask</h2>' + ui.list(b.questions) + "</section>" +
      '<p class="small muted">This information supports — but does not replace — advice from your care team. Your team may give you different instructions.</p>'
    );
  }

  // ---------- Leaflet ----------

  views.leaflet = function (id) {
    const r = ui.regimenById(id);
    if (!r) return views.notFound();
    ui.setTitle("Patient leaflet — " + (r.shortName || r.name));
    ui.setActiveNav(r.setting);
    const b = ONCO.patient.build(r);
    main().innerHTML =
      '<div class="no-print head-actions" style="margin-bottom:1rem"><button class="btn primary" type="button" onclick="window.print()">Print leaflet</button><a class="btn" href="#/share/' + esc(r.id) + '">Give to patient as an app (QR)</a><a class="btn" href="#/regimen/' + esc(r.id) + '">Back to regimen</a></div>' +
      '<article class="card leaflet">' +
      '<header class="lf-head"><div class="muted small">Patient information</div><h1>Your treatment: ' + esc(r.shortName || r.name) + "</h1><p>" + esc(r.name) + "</p>" +
      '<p class="muted">This leaflet explains your treatment in simple words.</p></header>' +
      '<section class="lf-sec"><h2>Your treatment at a glance</h2><ul><li>' + esc(b.setting) + "</li><li>Each cycle: " + esc(b.cycleText) + "</li><li>Number of cycles: " + esc(b.cyclesText) + "</li><li>Your team will check your blood tests before each cycle.</li></ul></section>" +
      leafletBody(b, {}) +
      "</article>";
  };

  // ---------- Patient app explainer (for doctors) ----------

  views.patientApp = function () {
    ui.setTitle("Patient app");
    ui.setActiveNav("calculators");
    main().innerHTML =
      '<div class="page-head"><h1>Patient app</h1><p class="muted">Give each patient their own simple version of this app for their treatment.</p></div>' +
      '<section class="card"><h2>How it works</h2><ol>' +
      "<li>Open the patient's regimen and press <strong>Give to patient (app)</strong>.</li>" +
      "<li>Enter the date of day 1, the number of cycles and your team's phone numbers.</li>" +
      "<li>The patient scans the <strong>QR code</strong> (or you send the link by message).</li>" +
      "<li>On their phone they see: their treatment dates, what each medicine does, which side effects are an emergency and which are not, food advice, and one-tap buttons to call your team.</li>" +
      "<li>They can add all treatment dates to their phone calendar — the phone then reminds them the evening before each treatment.</li></ol>" +
      '<div class="callout info"><p><strong>Privacy:</strong> the plan travels inside the link itself. It is not sent to or stored on any server. It is saved only on the patient\'s phone.</p>' +
      "<p><strong>Limits:</strong> you cannot change a plan after it is sent — create a new link if the plan changes. Automatic messages from you to the patient need a server and accounts (not built yet).</p>" +
      "<p><strong>Needs the app online:</strong> publish it (e.g. GitHub Pages) so the link works on the patient's phone.</p></div></section>" +
      '<section class="card"><h2>Start</h2><div class="calc-form"><label>Regimen<select id="pa-reg">' + ONCO.regimens.slice().sort((a, b) => a.name.localeCompare(b.name)).map((r) => '<option value="' + esc(r.id) + '">' + esc(r.shortName || r.name) + "</option>").join("") + '</select></label><button class="btn primary" type="button" id="pa-go">Give to patient →</button></div></section>';
    main().querySelector("#pa-go").addEventListener("click", () => {
      location.hash = "#/share/" + main().querySelector("#pa-reg").value;
    });
  };

  // ---------- Share (doctor) ----------

  views.share = function (id) {
    const r = ui.regimenById(id);
    if (!r) return views.notFound();
    ui.setTitle("Give to patient — " + (r.shortName || r.name));
    ui.setActiveNav(r.setting);
    const team = ui.storage.get("onco.team", {});
    const todayIso = S.isoDate(new Date());
    const field = (name, label, type, value, extra) => '<label>' + esc(label) + '<input name="' + name + '" type="' + (type || "text") + '" value="' + esc(value || "") + '" ' + (extra || "") + "></label>";
    main().innerHTML =
      '<div class="page-head no-print"><div class="crumbs"><a href="#/regimen/' + esc(r.id) + '">' + esc(r.shortName || r.name) + "</a> › Give to patient</div><h1>Give to patient</h1>" +
      '<p class="muted">Creates a personal link and QR code. The patient opens it on their phone and keeps their treatment plan, dates and warning signs. <a href="#/patient-app">How it works</a></p></div>' +
      (location.protocol === "file:" ? '<div class="callout warn no-print">You are using the app from a file on this computer. Patients cannot open this link. Publish the app online first (see README: GitHub Pages).</div>' : "") +
      '<section class="card no-print"><h2>Plan details</h2><form class="calc-form" id="sh-form" onsubmit="return false">' +
      field("name", "Patient first name (optional)", "text", "", 'maxlength="60"') +
      field("start", "Day 1 of cycle 1", "date", todayIso, "required") +
      field("cycles", "Number of cycles", "number", S.defaultCycles(r), 'min="1" max="60"') +
      field("phone", "Team phone (daytime questions)", "tel", team.phone) +
      field("emergency", "Emergency / 24-hour phone", "tel", team.emergency) +
      field("team", "Team or doctor name", "text", team.team) +
      field("hospital", "Hospital", "text", team.hospital) +
      '<label class="wide">Message for the patient (optional)<textarea name="message" rows="2" maxlength="500" placeholder="e.g. Blood test the day before each cycle."></textarea></label>' +
      '<label class="check"><input type="checkbox" name="remember" checked> Remember team details on this device</label>' +
      '<button class="btn primary" type="submit" id="sh-make">Create patient link</button>' +
      "</form>" +
      '<p class="small muted">The link contains only what you type here. It is not sent to any server.</p></section>' +
      '<section class="card" id="sh-out" hidden></section>';

    const m = main();
    const form = m.querySelector("#sh-form");
    form.addEventListener("submit", () => {
      const fd = new FormData(form);
      const plan = {
        regimenId: r.id,
        start: fd.get("start"),
        cycles: fd.get("cycles"),
        name: (fd.get("name") || "").trim(),
        phone: (fd.get("phone") || "").trim(),
        emergency: (fd.get("emergency") || "").trim(),
        team: (fd.get("team") || "").trim(),
        hospital: (fd.get("hospital") || "").trim(),
        message: (fd.get("message") || "").trim(),
      };
      if (!S.parseDate(plan.start)) {
        alert("Please choose the date of day 1.");
        return;
      }
      if (fd.get("remember") === "on") ui.storage.set("onco.team", { phone: plan.phone, emergency: plan.emergency, team: plan.team, hospital: plan.hospital });
      const code = ONCO.plan.encode(plan);
      const link = location.href.split("#")[0] + "#/p/" + code;
      const out = m.querySelector("#sh-out");
      out.hidden = false;
      out.innerHTML =
        '<div class="qr-card"><div class="qr">' + ui.qrSvg(link) + "</div>" +
        '<div><h2>Scan with the patient\'s phone camera</h2><p><strong>' + esc(plan.name ? plan.name + " — " : "") + esc(r.shortName || r.name) + "</strong>, starting " + esc(ui.formatDate(S.parseDate(plan.start))) + ".</p>" +
        "<ol><li>Open the phone camera and point it at the code.</li><li>Tap the link, then <strong>Save to this phone</strong>.</li><li>Tap <strong>Add to my calendar</strong> for reminders.</li></ol>" +
        '<div class="no-print"><label class="small">Or send this link by message<input id="sh-link" type="text" readonly value="' + esc(link) + '"></label>' +
        '<div class="head-actions" style="margin-top:.5rem"><button class="btn" type="button" id="sh-copy">Copy link</button><a class="btn" href="#/p/' + esc(code) + '?preview=1">Preview patient view</a><button class="btn" type="button" onclick="window.print()">Print QR card</button></div></div></div></div>';
      out.querySelector("#sh-copy").addEventListener("click", () => {
        const inp = out.querySelector("#sh-link");
        inp.select();
        try {
          navigator.clipboard.writeText(inp.value);
        } catch (e) {
          document.execCommand("copy");
        }
      });
      out.scrollIntoView({ behavior: "smooth" });
    });
  };

  // ---------- Receive on patient's phone ----------

  views.receive = function (code, query) {
    const plan = ONCO.plan.decode(code);
    ui.setTitle("Your treatment plan");
    if (!plan) {
      main().innerHTML = '<div class="card"><h1>This link does not work</h1><p>It may be incomplete or from an older version. Please ask your care team for a new QR code or link.</p></div>';
      return;
    }
    if (query.get("preview") === "1") {
      views.me(new URLSearchParams(), { plan: plan, code: code, preview: true });
      return;
    }
    const r = ui.regimenById(plan.regimenId);
    main().innerHTML =
      '<section class="card patient-card"><h1>' + (plan.name ? "Hello " + esc(plan.name) + "," : "Hello,") + "</h1>" +
      "<p>Your care team" + (plan.team ? " (" + esc(plan.team) + ")" : "") + " has shared your treatment plan:</p>" +
      '<p class="big"><strong>' + esc(r.shortName || r.name) + "</strong><br>Starting " + esc(ui.formatDate(S.parseDate(plan.start))) + "</p>" +
      '<p>Save it on this phone to see your dates, what your medicines do, warning signs and food advice — even without internet.</p>' +
      '<div class="head-actions"><button class="btn primary big-btn" type="button" id="rc-save">Save to this phone</button><button class="btn big-btn" type="button" id="rc-view">Just look</button></div></section>';
    main().querySelector("#rc-save").addEventListener("click", () => {
      const list = plans().filter((p) => p.code !== code);
      list.unshift({ code: code, saved: new Date().toISOString() });
      ui.storage.set("onco.plans", list);
      ui.storage.set("onco.mode", "patient");
      location.hash = "#/me";
    });
    main().querySelector("#rc-view").addEventListener("click", () => views.me(new URLSearchParams(), { plan: plan, code: code, preview: true }));
  };

  // ---------- Patient home ----------

  views.me = function (query, direct) {
    ui.setTitle("My treatment");
    let plan = direct && direct.plan;
    let code = direct && direct.code;
    const list = plans();
    let index = Number(query.get("i")) || 0;
    if (!plan) {
      if (!list.length) {
        main().innerHTML =
          '<section class="card patient-card"><h1>My treatment</h1><p>No treatment plan is saved on this phone yet.</p><p>Ask your care team for your personal QR code or link.</p>' +
          '<p><a class="btn" href="#/" id="me-pro">Health professional view</a></p></section>';
        main().querySelector("#me-pro").addEventListener("click", () => ui.storage.set("onco.mode", "clinician"));
        return;
      }
      index = Math.min(index, list.length - 1);
      code = list[index].code;
      plan = ONCO.plan.decode(code);
      if (!plan) {
        main().innerHTML = '<section class="card"><h1>This saved plan cannot be read</h1><p>Please ask your team for a new QR code.</p><button class="btn" id="me-del">Remove it</button></section>';
        main().querySelector("#me-del").addEventListener("click", () => {
          ui.storage.set("onco.plans", list.filter((_, j) => j !== index));
          ONCO.route();
        });
        return;
      }
    }
    const st = ONCO.plan.status(plan, new Date());
    const r = st.regimen;
    const b = ONCO.patient.build(r);
    const today = new Date();
    const inDays = (d) => {
      const n = S.daysBetween(today, d);
      return n === 0 ? "today" : n === 1 ? "tomorrow" : "in " + n + " days";
    };

    let status = "";
    if (st.current) status += "<p>Today is <strong>day " + st.current.day + " of cycle " + st.current.cycle + "</strong> (of " + st.totalCycles + ").</p>";
    if (st.next) {
      const names = [];
      st.next.items.forEach((it) => {
        const n = ONCO.patient.drugInfo(it.entry.drug).name;
        if (names.indexOf(n) < 0) names.push(n);
      });
      status += '<p class="big">Next treatment: <strong>' + esc(ui.formatDate(st.next.date)) + "</strong> (" + inDays(st.next.date) + ")<br><span class=\"muted\">Cycle " + st.next.cycle + ", day " + st.next.day + ": " + esc(names.join(", ")) + "</span></p>";
    } else if (st.finished) status += '<p class="big">Your planned treatment dates are finished. Well done. Keep following your team\'s advice and go to your follow-up appointments.</p>';
    if (b.lowCounts && st.current && st.current.day >= 7 && st.current.day <= 14) {
      status += '<div class="callout warn">Your blood counts are probably at their <strong>lowest</strong> now (days 7–14). Avoid people who are unwell, wash your hands often, and check your temperature if you feel unwell. <strong>38 °C or higher = go to hospital.</strong></div>';
    }

    const datesHtml =
      '<ul class="dates">' +
      st.dates
        .map((t) => {
          const past = S.daysBetween(t.date, today) > 0;
          const isNext = st.next && t === st.next;
          const names = [];
          t.items.forEach((it) => {
            const n = ONCO.patient.drugInfo(it.entry.drug).name;
            if (names.indexOf(n) < 0) names.push(n);
          });
          return '<li class="' + (past ? "past" : "") + (isNext ? " next" : "") + '"><strong>' + esc(ui.shortDate(t.date)) + "</strong> — cycle " + t.cycle + ", day " + t.day + ": " + esc(names.join(", ")) + "</li>";
        })
        .join("") +
      "</ul>";

    const who = [plan.team, plan.hospital].filter(Boolean).join(", ");
    main().innerHTML =
      (direct && direct.preview ? '<div class="callout info no-print">Preview — this plan is not saved on this device.' + (ui.storage.get("onco.mode", "clinician") === "patient" ? "" : ' <a href="#/">Back to the app</a>') + "</div>" : "") +
      '<section class="card patient-card"><div class="muted small">My treatment</div><h1>' + (plan.name ? "Hello " + esc(plan.name) : "Hello") + "</h1>" +
      '<p class="big"><strong>' + esc(r.shortName || r.name) + "</strong></p><p class=\"muted\">" + esc(r.name) + (who ? "<br>Care team: " + esc(who) : "") + "</p>" +
      status +
      '<div class="actions-big">' +
      (plan.phone ? '<a class="btn big-btn" href="tel:' + esc(plan.phone) + '">📞 Call my team</a>' : "") +
      (plan.emergency ? '<a class="btn big-btn danger-btn" href="tel:' + esc(plan.emergency) + '">🚨 Emergency line</a>' : "") +
      '<button class="btn big-btn" type="button" id="me-ics">📅 Add dates to my phone calendar</button>' +
      "</div>" +
      (plan.message ? '<div class="callout info"><strong>Message from your team:</strong> ' + esc(plan.message) + "</div>" : "") +
      "</section>" +
      '<nav class="anchor-nav no-print"><a href="#me-dates">Dates</a><a href="#lf-medicines">Medicines</a><a href="#lf-effects">Side effects</a><a href="#lf-food">Food</a><a href="#lf-advice">Advice</a></nav>' +
      '<article class="card leaflet">' +
      '<section class="lf-sec" id="me-dates"><h2>My treatment dates</h2>' + datesHtml + '<p class="small muted">Your team may move dates if your blood tests are not ready. Always follow what your team tells you.</p></section>' +
      leafletBody(b, { phone: plan.phone, emergency: plan.emergency, skipSchedule: false }) +
      "</article>" +
      '<section class="card no-print"><h2>This phone</h2>' +
      (list.length > 1 && !(direct && direct.preview) ? "<p>Saved plans: " + list.map((p, j) => { const pl = ONCO.plan.decode(p.code); return '<a class="badge ' + (j === index ? "out" : "neutral") + '" href="#/me?i=' + j + '">' + esc(pl ? (ui.regimenById(pl.regimenId).shortName || pl.regimenId) + " · " + pl.start : "broken plan") + "</a>"; }).join(" ") + "</p>" : "") +
      '<div class="head-actions">' + (!(direct && direct.preview) ? '<button class="btn small" type="button" id="me-del">Remove this plan from my phone</button>' : "") + '<a class="btn small" href="#/" id="me-pro">Health professional view</a></div></section>';

    const m = main();
    m.querySelector("#me-ics").addEventListener("click", () => {
      ui.download("my-treatment-dates.ics", "text/calendar", ui.regimenIcs(r, S.parseDate(plan.start), plan.cycles, who));
    });
    const del = m.querySelector("#me-del");
    if (del)
      del.addEventListener("click", () => {
        if (!confirm("Remove this treatment plan from this phone?")) return;
        ui.storage.set("onco.plans", list.filter((_, j) => j !== index));
        location.hash = "#/me";
        ONCO.route();
      });
    m.querySelector("#me-pro").addEventListener("click", () => ui.storage.set("onco.mode", "clinician"));
    m.querySelectorAll(".anchor-nav a").forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const t = document.getElementById(a.getAttribute("href").slice(1));
        if (t) t.scrollIntoView({ behavior: "smooth" });
      })
    );
  };
})();

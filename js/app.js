/*
 * OncoRegimens: hash router and start-up. Views live in js/views-*.js.
 */
(function () {
  "use strict";

  const ONCO = window.ONCO;
  const ui = ONCO.ui;
  const views = ONCO.views;

  function patientMode() {
    return ui.storage.get("onco.mode", "clinician") === "patient";
  }

  function applyMode(route) {
    // The patient layout hides the professional navigation. Patient pages show it too when previewed.
    const patientRoute = route === "me" || route === "p";
    const on = patientMode() || patientRoute;
    document.body.classList.toggle("patient-mode", on);
    document.querySelector(".brand").setAttribute("href", patientMode() ? "#/me" : "#/");
    document.querySelector(".brand span").textContent = on ? "My treatment" : "OncoRegimens";
    const bar = document.getElementById("disclaimer-bar");
    if (on) bar.hidden = true;
    else if (!ui.storage.get("onco.disclaimerOk", false)) bar.hidden = false;
  }

  function route() {
    const hash = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = hash.split("?");
    const query = new URLSearchParams(qs || "");
    const parts = path.split("/").filter(Boolean).map(decodeURIComponent);

    if (!parts.length && patientMode()) {
      location.replace("#/me");
      return;
    }
    applyMode(parts[0]);

    const searchInput = document.getElementById("search-input");
    if (parts[0] !== "search" && document.activeElement !== searchInput) searchInput.value = "";

    switch (parts[0]) {
      case undefined:
        views.home();
        break;
      case "regimens":
        views.regimens(query);
        break;
      case "regimen":
        views.regimen(parts[1]);
        break;
      case "order":
        views.order(parts[1]);
        break;
      case "leaflet":
        views.leaflet(parts[1]);
        break;
      case "share":
        views.share(parts[1]);
        break;
      case "p":
        views.receive(parts[1], query);
        break;
      case "me":
        views.me(query);
        break;
      case "patient-app":
        views.patientApp();
        break;
      case "drugs":
        views.drugs(query);
        break;
      case "drug":
        views.drug(parts[1]);
        break;
      case "interactions":
        views.interactions(query);
        break;
      case "cumulative":
        views.cumulative();
        break;
      case "supportive":
      case "principles":
        if (parts[1]) views.topic(parts[0], parts[1]);
        else views.topicIndex(parts[0]);
        break;
      case "calculators":
        views.calculators();
        break;
      case "favorites":
        views.favorites();
        break;
      case "about":
        views.about();
        break;
      case "search":
        views.searchPage(query);
        break;
      default:
        views.notFound();
    }
  }
  ONCO.route = route;

  function initTheme() {
    const saved = ui.storage.get("onco.theme", null);
    if (saved) document.documentElement.setAttribute("data-theme", saved);
    document.getElementById("theme-toggle").addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      ui.storage.set("onco.theme", next);
    });
  }

  function initDisclaimer() {
    const bar = document.getElementById("disclaimer-bar");
    document.getElementById("disclaimer-ok").addEventListener("click", () => {
      ui.storage.set("onco.disclaimerOk", true);
      bar.hidden = true;
    });
  }

  function initSearch() {
    const input = document.getElementById("search-input");
    const form = document.getElementById("search-form");
    const run = ui.debounce(() => {
      const q = input.value.trim();
      if (!q) {
        if (location.hash.indexOf("#/search") === 0) location.hash = "#/";
        return;
      }
      const target = "#/search?q=" + encodeURIComponent(q);
      if (location.hash.indexOf("#/search") === 0) {
        history.replaceState(null, "", target);
        route();
      } else location.hash = target;
    }, 200);
    input.addEventListener("input", run);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const hits = views.search(input.value.trim());
      if (hits.length) location.hash = hits[0].href;
    });
  }

  window.addEventListener("hashchange", () => {
    route();
    if (location.hash.indexOf("#/search") !== 0) window.scrollTo(0, 0);
  });

  initTheme();
  initDisclaimer();
  initSearch();
  route();

  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();

/*
 * Service worker: caches the whole app so it works offline (e.g. on a ward with no signal).
 * Bump CACHE when any file changes so phones pick up the new version.
 */
const CACHE = "oncoregimens-v2";

const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/styles.css",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "js/core.js",
  "js/calc.js",
  "js/schedule.js",
  "js/organ.js",
  "js/interactions.js",
  "js/cumulative.js",
  "js/plan.js",
  "js/patient.js",
  "js/vendor/qrcode.js",
  "data/common.js",
  "data/drugs.js",
  "data/dose-adjustments.js",
  "data/regimens/breast.js",
  "data/regimens/gastrointestinal.js",
  "data/regimens/lung.js",
  "data/regimens/genitourinary-gynae.js",
  "data/regimens/head-neck-cns-sarcoma.js",
  "data/regimens/lymphoma-myeloma.js",
  "data/regimens/leukaemia.js",
  "data/supportive.js",
  "data/principles.js",
  "data/interactions.js",
  "data/patient.js",
  "data/patient-drugs.js",
  "js/ui.js",
  "js/views-main.js",
  "js/views-tools.js",
  "js/views-patient.js",
  "js/app.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first (fresh content when online), cache as fallback (offline).
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((hit) => hit || caches.match("index.html")))
  );
});

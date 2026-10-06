/*
 * Loads the app's data scripts into a sandbox, in the same order as index.html.
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..");

function scriptsFromIndex() {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  return [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
}

function loadOnco() {
  const sandbox = {};
  vm.createContext(sandbox);
  scriptsFromIndex()
    // Views and the router need a browser (DOM); the vendored QR library is not needed in tests.
    .filter((src) => !/^js\/(app|ui|views-[\w-]+)\.js$/.test(src) && !/^js\/vendor\//.test(src))
    .forEach((src) => {
      const code = fs.readFileSync(path.join(ROOT, src), "utf8");
      vm.runInContext(code, sandbox, { filename: src });
    });
  return sandbox.ONCO;
}

module.exports = { ROOT, scriptsFromIndex, loadOnco };

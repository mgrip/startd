import "./reactHotLoaderConfig";
import React from "react";
import { hot } from "react-hot-loader";
import { hydrate } from "react-dom";

const App = require(APP_PATH).default;
const HotApp = hot(module)(App);

function init() {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    hydrate(<HotApp ctx={{}} startd={window.startd} />, rootElement);
  }
}
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  // document has at least been parsed
  init();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    init();
  });
}

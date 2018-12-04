// @flow strict

import React from "react";
import { hot, setConfig } from "react-hot-loader";
import { hydrate } from "react-dom";

setConfig({
  ignoreSFC: true, // RHL will be __completely__ disabled for SFC
  pureRender: true // RHL will not change render method
});
const App = require(APP_PATH).default;
const HotApp = hot(module)(App);

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    hydrate(<HotApp ctx={{}} />, rootElement);
  }
});

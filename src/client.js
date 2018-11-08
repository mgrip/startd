// @flow strict

import React from "react";
import { hot } from "react-hot-loader";
import { hydrate } from "react-dom";

const App = require(APP_PATH).default;
const HotApp = hot(module)(App);

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    hydrate(<HotApp ctx={{}} />, rootElement);
  }
});

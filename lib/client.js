"use strict";

require("./reactHotLoaderConfig");

var _react = _interopRequireDefault(require("react"));

var _reactHotLoader = require("react-hot-loader");

var _reactDom = require("react-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).enterModule;
  enterModule && enterModule(module);
})();

const App = require(APP_PATH).default;

const HotApp = (0, _reactHotLoader.hot)(module)(App);

function init() {
  const rootElement = document.getElementById("root");

  if (rootElement) {
    (0, _reactDom.hydrate)(_react.default.createElement(HotApp, {
      ctx: {},
      startd: window.startd
    }), rootElement);
  }
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  // document has at least been parsed
  init();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    init();
  });
}

;

(function () {
  var reactHotLoader = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).default;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(App, "App", "/Users/mgrip/repos/startd/src/client.tsx");
  reactHotLoader.register(HotApp, "HotApp", "/Users/mgrip/repos/startd/src/client.tsx");
  reactHotLoader.register(init, "init", "/Users/mgrip/repos/startd/src/client.tsx");
})();

;

(function () {
  var leaveModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).leaveModule;
  leaveModule && leaveModule(module);
})();
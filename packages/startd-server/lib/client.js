"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactHotLoader = require("react-hot-loader");

var _reactDom = require("react-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var App = require(APP_PATH).default;

var HotApp = (0, _reactHotLoader.hot)(module)(App);
document.addEventListener("DOMContentLoaded", function () {
  var rootElement = document.getElementById("root");

  if (rootElement) {
    (0, _reactDom.hydrate)(_react.default.createElement(HotApp, {
      ctx: {}
    }), rootElement);
  }
});
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(App, "App", "/Users/mgrip/repos/startd/packages/startd-server/src/client.js");
  reactHotLoader.register(HotApp, "HotApp", "/Users/mgrip/repos/startd/packages/startd-server/src/client.js");
  leaveModule(module);
})();

;
"use strict";

require("./reactHotLoaderConfig");

var _react = _interopRequireDefault(require("react"));

var _reactHotLoader = require("react-hot-loader");

var _reactDom = require("react-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  strict
const App = require(APP_PATH).default;

const HotApp = (0, _reactHotLoader.hot)(module)(App);
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");

  if (rootElement) {
    (0, _reactDom.hydrate)(_react.default.createElement(HotApp, {
      ctx: {}
    }), rootElement);
  }
});
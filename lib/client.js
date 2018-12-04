"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactHotLoader = require("react-hot-loader");

var _reactDom = require("react-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  strict
(0, _reactHotLoader.setConfig)({
  ignoreSFC: true,
  // RHL will be __completely__ disabled for SFC
  pureRender: true // RHL will not change render method

});

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
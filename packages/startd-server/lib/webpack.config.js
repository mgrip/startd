"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var baseConfig = {
  // @TODO: swap this out for production
  mode: "development",
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      loader: "babel-loader",
      exclude: /node_modules/,
      options: {
        presets: ["react"]
      }
    }]
  },
  plugins: []
};

var _default = [_extends({
  name: "server"
}, baseConfig, {
  entry: ["babel-polyfill", _path2.default.resolve(__dirname, "server.js")],
  output: {
    filename: "server.bundle.js",
    path: __dirname
  },
  target: "node"
}), _extends({
  name: "client"
}, baseConfig, {
  entry: ["babel-polyfill", _path2.default.resolve(__dirname, "client.js")],
  output: {
    filename: "app.bundle.js",
    path: _path2.default.resolve(__dirname, "..", "public")
  }
})];
exports.default = _default;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(baseConfig, "baseConfig", "src/webpack.config.js");
  reactHotLoader.register(_default, "default", "src/webpack.config.js");
  leaveModule(module);
})();

;
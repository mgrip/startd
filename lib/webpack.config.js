"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

const baseConfig = {
  // @TODO: swap this out for production
  mode: "development",
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      loader: "babel-loader",
      exclude: /node_modules/,
      options: {
        presets: ["@babel/preset-react"]
      }
    }]
  },
  plugins: []
};
const _default = [{
  name: "server",
  ...baseConfig,
  entry: ["@babel/polyfill", _path.default.resolve(__dirname, "server.js")],
  output: {
    filename: "server.bundle.js",
    path: __dirname,
    libraryTarget: "commonjs2"
  },
  node: {
    __dirname: true
  },
  target: "node"
}, {
  name: "client",
  ...baseConfig,
  entry: ["@babel/polyfill", _path.default.resolve(__dirname, "client.js")],
  output: {
    filename: "app.bundle.js",
    path: _path.default.resolve(__dirname, "..", "public")
  }
}];
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(baseConfig, "baseConfig", "/Users/mgrip/repos/startd/src/webpack.config.js");
  reactHotLoader.register(_default, "default", "/Users/mgrip/repos/startd/src/webpack.config.js");
  leaveModule(module);
})();

;
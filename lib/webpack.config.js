"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _webpack = _interopRequireDefault(require("webpack"));

var _dirname = _interopRequireDefault(require("./dirname"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).enterModule;
  enterModule && enterModule(module);
})();

const baseConfig = {
  // @TODO: swap this out for production
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  module: {
    rules: [{
      test: /\.(js|jsx|ts|tsx)$/,
      loader: "babel-loader",
      exclude: /node_modules/,
      options: {
        presets: ["@babel/preset-react"]
      }
    }]
  },
  resolve: {
    extensions: ["*", ".mjs", ".js", ".jsx", ".tsx", ".ts"]
  },
  // this is a hack to get the node-pg module to work for projects that need it.
  // see https://github.com/brianc/node-postgres/issues/1138
  plugins: [new _webpack.default.IgnorePlugin(/pg-native/, /\/pg\//)]
};
const configs = [{
  name: "server",
  ...baseConfig,
  entry: ["@babel/polyfill", _path.default.resolve((0, _dirname.default)(), process.env.NODE_ENV === "production" ? "runServer" : "server.js")],
  output: {
    filename: "server.bundle.js",
    path: process.env.NODE_ENV === "production" ? process.cwd() : (0, _dirname.default)(),
    libraryTarget: "commonjs2"
  },
  node: {
    __dirname: true
  },
  target: "node"
}, {
  name: "client",
  ...baseConfig,
  entry: ["@babel/polyfill", _path.default.resolve((0, _dirname.default)(), "client.js")],
  output: {
    filename: "app.bundle.js",
    path: _path.default.resolve(process.env.NODE_ENV === "production" ? process.cwd() : (0, _dirname.default)(), "public")
  }
}];
const _default = configs;
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).default;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(baseConfig, "baseConfig", "/Users/mgrip/repos/startd/src/webpack.config.ts");
  reactHotLoader.register(configs, "configs", "/Users/mgrip/repos/startd/src/webpack.config.ts");
  reactHotLoader.register(_default, "default", "/Users/mgrip/repos/startd/src/webpack.config.ts");
})();

;

(function () {
  var leaveModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).leaveModule;
  leaveModule && leaveModule(module);
})();
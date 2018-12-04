"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _dirname = _interopRequireDefault(require("./dirname"));

var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  strict
const baseConfig = {
  // @TODO: swap this out for production
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
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
  // this is a hack to get the node-pg module to work for projects that need it.
  // see https://github.com/brianc/node-postgres/issues/1138
  plugins: [new _webpack.default.IgnorePlugin(/^pg-native$/)]
};
var _default = [{
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
exports.default = _default;
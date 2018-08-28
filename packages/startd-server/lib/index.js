#! /usr/bin/env node
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _minimist2 = require("minimist");

var _minimist3 = _interopRequireDefault(_minimist2);

var _findUp = require("find-up");

var _findUp2 = _interopRequireDefault(_findUp);

var _logger = require("./logger");

var _logger2 = _interopRequireDefault(_logger);

var _webpackConfig = require("./webpack.config.js");

var _webpackConfig2 = _interopRequireDefault(_webpackConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _minimist = (0, _minimist3.default)(process.argv.slice(2)),
    _minimist$_ = _slicedToArray(_minimist._, 1),
    inputPath = _minimist$_[0],
    middleware = _minimist.middleware;

if (typeof inputPath !== "string") {
  _logger2.default.error("You must provide a valid path to your root App component");
  process.exit(1);
}
// $FlowFixMe - for some reason flow isn't picking up the process.exit above
var appPath = _path2.default.resolve(process.cwd(), inputPath);
if (!_fs2.default.existsSync(appPath)) {
  _logger2.default.error(appPath + " is not a valid filepath \uD83D\uDE3F");
  process.exit(1);
}

var middlewarePath = void 0;
if (middleware) {
  middlewarePath = _path2.default.resolve(process.cwd(), middleware);
  if (!_fs2.default.existsSync(middlewarePath)) {
    _logger2.default.error(middlewarePath + " is not a valid filepath \uD83D\uDE3F");
    process.exit(1);
  }
}

if (!_findUp2.default.sync(".babelrc", { cwd: _path2.default.dirname(appPath) })) {
  _logger2.default.info("Looks like you don't have a .babelrc file set up for your app \uD83D\uDC7B");
  _logger2.default.info("  * by default startd transpiles your app using the react babel preset");
  _logger2.default.info("  * add a .babelrc file for other transpile options");
}

_logger2.default.info("Starting webpack compilation... 🕸");

var appConfig = _webpackConfig2.default.map(function (singleConfig) {
  return _extends({}, singleConfig, {
    plugins: [].concat(_toConsumableArray(singleConfig.plugins), [new _webpack2.default.DefinePlugin(_extends({ APP_PATH: JSON.stringify(appPath), PORT: 3000 }, middleware ? { MIDDLEWARE_PATH: JSON.stringify(middlewarePath) } : {}, process.env.NODE_ENV === "production" ? {
      "process.env.NODE_ENV": JSON.stringify("production"),
      BUNDLE_PATH: JSON.stringify(_webpackConfig2.default[1].output.filename)
    } : {
      BUNDLE_PATH: JSON.stringify("http://localhost:8080/" + _webpackConfig2.default[1].output.filename)
    }))])
  });
});
(0, _webpack2.default)(appConfig, function (err, multiStats) {
  if (err || multiStats.hasErrors()) {
    // Handle errors here
    _logger2.default.error("Webpack " + _chalk2.default.red("failed") + " to compile \uD83D\uDE3F");
    multiStats.stats.forEach(function (stats) {
      if (stats.compilation.errors && stats.compilation.errors.length > 0) {
        _logger2.default.debug(stats.compilation.errors);
      }
    });
  } else {
    _logger2.default.info("Webpack comilation " + _chalk2.default.green("successful!") + " \uD83C\uDF7E");
    _logger2.default.info("Launching startd server 🛫");
    // launch the server
    // $FlowFixMe webpack bundle will only exist under /lib
    require("./server.bundle.js");

    // if we're in development mode, run a dev server in parallel, to enable
    // watch mode and hot module replacement for the client code
    if (process.env.NODE_ENV !== "production") {
      _logger2.default.info('startd running in dev mode 🛠  make sure to add "--prod" flag when running in production');
      _logger2.default.info("🛠  compiling webpack for dev server... 🕸");
      var Koa = require("koa");
      var webpackDevMiddleware = require("koa-webpack");

      var devApp = new Koa();
      var clientConfig = appConfig[1];
      webpackDevMiddleware({
        config: _extends({}, clientConfig, {
          output: _extends({}, clientConfig.output, {
            publicPath: "http://localhost:8080/"
          })
        }),
        devMiddleware: {
          // since we're running the dev server for the client independently of
          // the backend server, we need to specify access control for the request
          // from the original host (3000) to connect to the websocket server (8081)
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000"
          },
          logLevel: "silent"
        }
      }).then(function (middleware) {
        _logger2.default.info("\uD83D\uDEE0  dev server launched " + _chalk2.default.green("successfully!") + " \uD83C\uDF7E  \uD83D\uDEEB");
        _logger2.default.info("Your app is now listening on ports " + _chalk2.default.cyan("3000") + ", " + _chalk2.default.cyan("8000") + ", and " + _chalk2.default.cyan("8081") + " \uD83E\uDD18");
        _logger2.default.info("You can access your app at " + _chalk2.default.underline.magenta("http://localhost:3000") + "\n\n                 ---------------\n                 |   browser   |\n                 ---------------\n                \u2199\u2197            \u2196\u2198\n----------------------      ------------------------------\n|       server       |      |        dev-server          |\n| (initial response) |      |       (app bundle)         |\n|   localhost:3000   |      |      localhost:8080        |\n----------------------      | websocket server (for HMR) |\n                            |      localhost:8081        |\n                            ------------------------------");
        devApp.use(middleware);
        devApp.listen(8080);
      });
    } else {
      _logger2.default.info("App successfully running production build. Your app is listening on port " + _chalk2.default.magenta("3000"));
    }
  }
});
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(middleware, "middleware", "src/index.js");
  reactHotLoader.register(inputPath, "inputPath", "src/index.js");
  reactHotLoader.register(appPath, "appPath", "src/index.js");
  reactHotLoader.register(middlewarePath, "middlewarePath", "src/index.js");
  reactHotLoader.register(appConfig, "appConfig", "src/index.js");
  leaveModule(module);
})();

;
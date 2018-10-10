#! /usr/bin/env node
"use strict";

var _webpack = _interopRequireDefault(require("webpack"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _chalk = _interopRequireDefault(require("chalk"));

var _minimist2 = _interopRequireDefault(require("minimist"));

var _findUp = _interopRequireDefault(require("find-up"));

var _logger = _interopRequireDefault(require("./logger"));

var _webpackConfig = _interopRequireDefault(require("./webpack.config.js"));

var _child_process = require("child_process");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _minimist = (0, _minimist2.default)(process.argv.slice(2)),
    _minimist$_ = _slicedToArray(_minimist._, 1),
    inputPath = _minimist$_[0],
    middleware = _minimist.middleware;

if (typeof inputPath !== "string") {
  _logger.default.error("You must provide a valid path to your root App component");

  process.exit(1);
} // $FlowFixMe - for some reason flow isn't picking up the process.exit above


var appPath = _path.default.resolve(process.cwd(), inputPath);

if (!_fs.default.existsSync(appPath)) {
  _logger.default.error("".concat(appPath, " is not a valid filepath \uD83D\uDE3F"));

  process.exit(1);
}

var middlewarePath;

if (middleware) {
  middlewarePath = _path.default.resolve(process.cwd(), middleware);

  if (!_fs.default.existsSync(middlewarePath)) {
    _logger.default.error("".concat(middlewarePath, " is not a valid filepath \uD83D\uDE3F"));

    process.exit(1);
  }
}

if (!_findUp.default.sync(".babelrc", {
  cwd: _path.default.dirname(appPath)
})) {
  _logger.default.info("Looks like you don't have a .babelrc file set up for your app \uD83D\uDC7B");

  _logger.default.info("  * by default startd transpiles your app using the react babel preset");

  _logger.default.info("  * add a .babelrc file for other transpile options");
}

_logger.default.info("Starting webpack compilation... 🕸");

var appConfig = _webpackConfig.default.map(function (singleConfig) {
  return _objectSpread({}, singleConfig, {
    plugins: _toConsumableArray(singleConfig.plugins).concat([new _webpack.default.DefinePlugin(_objectSpread({}, {
      APP_PATH: JSON.stringify(appPath),
      PORT: 3000
    }, middleware ? {
      MIDDLEWARE_PATH: JSON.stringify(middlewarePath)
    } : {}, process.env.NODE_ENV === "production" ? {
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      },
      BUNDLE_PATH: JSON.stringify("/" + _webpackConfig.default[1].output.filename)
    } : {
      BUNDLE_PATH: JSON.stringify("http://localhost:8080/" + _webpackConfig.default[1].output.filename)
    }))])
  });
});

var server;
(0, _webpack.default)(appConfig, function (err, multiStats) {
  if (err || multiStats.hasErrors()) {
    // Handle errors here
    _logger.default.error("Webpack ".concat(_chalk.default.red("failed"), " to compile \uD83D\uDE3F"));

    multiStats.stats.forEach(function (stats) {
      if (stats.compilation.errors && stats.compilation.errors.length > 0) {
        _logger.default.debug(stats.compilation.errors);
      }
    });
  } else {
    _logger.default.info("Webpack comilation ".concat(_chalk.default.green("successful!"), " \uD83C\uDF7E"));

    _logger.default.info("Launching startd server 🛫"); // launch the server
    // $FlowFixMe webpack bundle will only exist under /lib


    if (server) {
      server.kill();
    }

    server = (0, _child_process.spawn)("node", [_path.default.resolve(__dirname, "server.bundle.js")], {
      stdio: 'inherit',
      env: process.env
    }); // if we're in development mode, run a dev server in parallel, to enable
    // watch mode and hot module replacement for the client code

    if (process.env.NODE_ENV !== "production") {
      _logger.default.info('startd running in dev mode 🛠  make sure to add "--prod" flag when running in production');

      _logger.default.info("🛠  compiling webpack for dev server... 🕸");

      var Koa = require("koa");

      var webpackDevMiddleware = require("koa-webpack");

      var devApp = new Koa();
      var clientConfig = appConfig[1];
      webpackDevMiddleware({
        config: _objectSpread({}, clientConfig, {
          output: _objectSpread({}, clientConfig.output, {
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
          logLevel: "silent",
          reporter: function reporter() {
            // @TODO should combine this with above
            (0, _webpack.default)(appConfig, function () {
              if (server) {
                server.kill();
              }

              server = (0, _child_process.spawn)("node", [_path.default.resolve(__dirname, "server.bundle.js")], {
                stdio: 'inherit',
                env: process.env
              });
            });
          }
        }
      }).then(function (middleware) {
        _logger.default.info("\uD83D\uDEE0  dev server launched ".concat(_chalk.default.green("successfully!"), " \uD83C\uDF7E  \uD83D\uDEEB"));

        _logger.default.info("Your app is now listening on ports ".concat(_chalk.default.cyan("3000"), ", ").concat(_chalk.default.cyan("8000"), ", and ").concat(_chalk.default.cyan("8081"), " \uD83E\uDD18"));

        _logger.default.info("You can access your app at ".concat(_chalk.default.underline.magenta("http://localhost:3000"), "\n\n                 ---------------\n                 |   browser   |\n                 ---------------\n                \u2199\u2197            \u2196\u2198\n----------------------      ------------------------------\n|       server       |      |        dev-server          |\n| (initial response) |      |       (app bundle)         |\n|   localhost:3000   |      |      localhost:8080        |\n----------------------      | websocket server (for HMR) |\n                            |      localhost:8081        |\n                            ------------------------------"));

        devApp.use(middleware);
        devApp.listen(8080);
      });
    } else {
      _logger.default.info("App successfully running production build. Your app is listening on port ".concat(_chalk.default.magenta("3000")));
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

  reactHotLoader.register(middleware, "middleware", "/Users/mgrip/repos/startd/packages/startd-server/src/index.js");
  reactHotLoader.register(inputPath, "inputPath", "/Users/mgrip/repos/startd/packages/startd-server/src/index.js");
  reactHotLoader.register(appPath, "appPath", "/Users/mgrip/repos/startd/packages/startd-server/src/index.js");
  reactHotLoader.register(middlewarePath, "middlewarePath", "/Users/mgrip/repos/startd/packages/startd-server/src/index.js");
  reactHotLoader.register(appConfig, "appConfig", "/Users/mgrip/repos/startd/packages/startd-server/src/index.js");
  reactHotLoader.register(server, "server", "/Users/mgrip/repos/startd/packages/startd-server/src/index.js");
  leaveModule(module);
})();

;
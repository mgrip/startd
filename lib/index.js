#! /usr/bin/env node
//  strict
"use strict";

var _webpack = _interopRequireDefault(require("webpack"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _http = _interopRequireDefault(require("http"));

var _chalk = _interopRequireDefault(require("chalk"));

var _minimist2 = _interopRequireDefault(require("minimist"));

var _findUp = _interopRequireDefault(require("find-up"));

var _webpackConfig = _interopRequireDefault(require("./webpack.config.js"));

var _react = _interopRequireDefault(require("react"));

var _reactCliRenderer = _interopRequireWildcard(require("react-cli-renderer"));

var _koa = _interopRequireDefault(require("koa"));

var _koaWebpack = _interopRequireDefault(require("koa-webpack"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _minimist = (0, _minimist2.default)(process.argv.slice(2)),
    _minimist$_ = _slicedToArray(_minimist._, 1),
    inputAppPath = _minimist$_[0],
    inputMiddlewarePath = _minimist.inputMiddlewarePath;

var StartdServer =
/*#__PURE__*/
function (_React$Component) {
  _inherits(StartdServer, _React$Component);

  function StartdServer() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, StartdServer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(StartdServer)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      inputAppPath: inputAppPath,
      inputMiddlewarePath: inputMiddlewarePath,
      logs: [],
      devMode: process.env.NODE_ENV !== "production",
      buildStatus: {
        webpackCompile: "NOTSTARTED",
        launchServer: "NOTSTARTED",
        webpackDevCompile: "NOTSTARTED",
        launchDevServer: "NOTSTARTED"
      }
    });

    return _this;
  }

  _createClass(StartdServer, [{
    key: "addLog",
    value: function addLog(newLog) {
      this.setState(function (state) {
        return {
          logs: [newLog].concat(_toConsumableArray(state.logs))
        };
      });
    }
  }, {
    key: "startServer",
    value: function startServer() {
      if (this.state.server) {
        this.state.server.close();
      }

      var koaApp = require("./server.bundle.js").default;

      var server = _http.default.createServer(koaApp.callback());

      server.listen(3000);
      this.setState({
        server: server
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var appPath = _path.default.resolve(process.cwd(), this.state.inputAppPath);

      this.setState({
        appPath: appPath
      });

      if (!_fs.default.existsSync(appPath)) {
        this.addLog("".concat(appPath, " is not a valid filepath \uD83D\uDE3F"));
        return;
      }

      if (this.state.inputMiddlewarePath) {
        if (typeof this.state.inputMiddlewarePath !== "string") {
          // @TODO: maybe prompt to re-enter?
          this.addLog("Input filepath is not a string");
          return;
        }

        var middlewarePath = _path.default.resolve(process.cwd(), // $FlowFixMe flow isn't picking up the check above
        this.state.inputMiddlewarePath);

        this.setState({
          middlewarePath: middlewarePath
        });

        if (!_fs.default.existsSync(middlewarePath)) {
          this.addLog("".concat(middlewarePath, " is not a valid filepath"));
          return;
        }
      }

      if (!_findUp.default.sync(".babelrc", {
        cwd: _path.default.dirname(appPath)
      })) {
        this.addLog("Looks like you don't have a .babelrc file set up for your app. " + "By default startd transpiles your app using the react babel preset. " + "Add a .babelrc file for other transpile options!");
      }

      this.addLog("Starting webpack compilation...");
      this.setState(function (prevState) {
        return {
          buildStatus: _objectSpread({}, prevState.buildStatus, {
            webpackCompile: "WORKING"
          })
        };
      });

      var appConfig = _webpackConfig.default.map(function (singleConfig) {
        return _objectSpread({}, singleConfig, {
          plugins: _toConsumableArray(singleConfig.plugins).concat([new _webpack.default.DefinePlugin(_objectSpread({}, {
            APP_PATH: JSON.stringify(appPath),
            PORT: 3000
          }, _this2.state.middlewarePath ? {
            MIDDLEWARE_PATH: JSON.stringify(_this2.state.middlewarePath)
          } : {}, process.env.NODE_ENV === "production" ? {
            "process.env": {
              NODE_ENV: JSON.stringify("production")
            },
            BUNDLE_PATH: JSON.stringify("/" + _webpackConfig.default[1].output.filename)
          } : {
            BUNDLE_PATH: JSON.stringify("http://localhost:8080/" + _webpackConfig.default[1].output.filename)
          }))])
        });
      });

      (0, _webpack.default)(appConfig, function (err, multiStats) {
        if (err || multiStats.hasErrors()) {
          // Handle errors here
          // logger.error(`Webpack ${chalk.red("failed")} to compile 😿`);
          multiStats.stats.forEach(function (stats) {
            if (stats.compilation.errors && stats.compilation.errors.length > 0) {// logger.debug(stats.compilation.errors);
            }
          });
        } else {
          _this2.addLog("Webpack comilation ".concat(_chalk.default.green("successful!")));

          _this2.setState(function (prevState) {
            return {
              buildStatus: _objectSpread({}, prevState.buildStatus, {
                webpackCompile: "DONE"
              })
            };
          });

          _this2.addLog("Launching startd server 🛫");

          _this2.setState(function (prevState) {
            return {
              buildStatus: _objectSpread({}, prevState.buildStatus, {
                launchServer: "WORKING"
              })
            };
          });

          _this2.startServer();

          _this2.setState(function (prevState) {
            return {
              buildStatus: _objectSpread({}, prevState.buildStatus, {
                launchServer: "DONE"
              })
            };
          }); // if we're in development mode, run a dev server in parallel, to enable
          // watch mode and hot module replacement for the client code


          if (_this2.state.devMode) {
            _this2.addLog('startd running in dev mode  make sure to add "--prod" flag when running in production');

            _this2.addLog("Compiling webpack for dev server...");

            _this2.setState(function (prevState) {
              return {
                buildStatus: _objectSpread({}, prevState.buildStatus, {
                  webpackDevCompile: "WORKING"
                })
              };
            });

            var devApp = new _koa.default();
            var clientConfig = appConfig[1];
            (0, _koaWebpack.default)({
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
                  (0, _webpack.default)(appConfig, function () {
                    _this2.startServer();
                  });
                }
              },
              hotClient: {
                logLevel: "silent"
              }
            }).then(function (middleware) {
              _this2.setState(function (prevState) {
                return {
                  buildStatus: _objectSpread({}, prevState.buildStatus, {
                    webpackDevCompile: "DONE",
                    launchDevServer: "WORKING"
                  })
                };
              });

              devApp.use(middleware);
              devApp.listen(8080);

              _this2.setState(function (prevState) {
                return {
                  buildStatus: _objectSpread({}, prevState.buildStatus, {
                    launchDevServer: "DONE"
                  })
                };
              });

              _this2.addLog("dev server launched ".concat(_chalk.default.green("successfully!")));

              _this2.addLog("Your app is now listening on ports ".concat(_chalk.default.cyan("3000"), ", ").concat(_chalk.default.cyan("8000"), ", and ").concat(_chalk.default.cyan("8081"), " \uD83E\uDD18"));

              _this2.addLog("You can access your app at ".concat(_chalk.default.underline.magenta("http://localhost:3000"), " \uD83C\uDF89"));
            });
          } else {
            _this2.addLog("App successfully running production build. Your app is listening on port ".concat(_chalk.default.magenta("3000")));
          }
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      function getStepStatus(status) {
        switch (status) {
          case "NOTSTARTED":
            return "○";

          case "WORKING":
            return "...";

          default:
            return "✓";
        }
      }

      return _react.default.createElement(_reactCliRenderer.Section, {
        align: "center"
      }, "startd-server \uD83D\uDE80", this.state.devMode ? _react.default.createElement("div", {
        align: "center"
      }, _chalk.default.red("dev mode"), " \uD83D\uDEE0") : _react.default.createElement("div", {
        align: "center"
      }, _chalk.default.green("production mode"), " \uD83D\uDC6E\u200D\u2640\uFE0F"), _react.default.createElement(_reactCliRenderer.Section, {
        horizontal: true
      }, _react.default.createElement(_reactCliRenderer.Section, {
        align: "center"
      }, "Your App Build", _react.default.createElement(_reactCliRenderer.Section, null, getStepStatus(this.state.buildStatus.webpackCompile), " Compile your app with webpack", _react.default.createElement("br", null), getStepStatus(this.state.buildStatus.launchServer), " Launch a local server", this.state.devMode && _react.default.createElement(_reactCliRenderer.Section, null, getStepStatus(this.state.buildStatus.webpackDevCompile), " ", "Compile your app again, this time for a local development server (to enable HMR)"), this.state.devMode && _react.default.createElement(_reactCliRenderer.Section, null, getStepStatus(this.state.buildStatus.launchDevServer), " Launch local development server")), _react.default.createElement(_reactCliRenderer.Section, {
        align: "center",
        border: {
          horizontal: " ",
          vertical: "      "
        }
      }, _react.default.createElement(_reactCliRenderer.Section, {
        align: "center"
      }, "browser"), "\u2922 \u2921", _react.default.createElement(_reactCliRenderer.Section, {
        horizontal: true
      }, _react.default.createElement(_reactCliRenderer.Section, {
        border: {
          horizontal: "-",
          vertical: "|"
        },
        align: "center"
      }, this.state.buildStatus.launchServer === "DONE" ? _chalk.default.green("server") : _chalk.default.dim("server"), _react.default.createElement("br", null), this.state.buildStatus.launchServer === "DONE" ? _chalk.default.green("(initial response)") : _chalk.default.dim("(initial response)"), _react.default.createElement("br", null), this.state.buildStatus.launchServer === "DONE" ? _chalk.default.green("localhost:3000") : _chalk.default.dim("localhost:3000")), _react.default.createElement(_reactCliRenderer.Section, {
        border: {
          horizontal: "-",
          vertical: "|"
        },
        align: "center"
      }, this.state.buildStatus.launchDevServer === "DONE" ? _chalk.default.green("dev-server") : _chalk.default.dim("dev-server"), _react.default.createElement("br", null), this.state.buildStatus.launchDevServer === "DONE" ? _chalk.default.green("(app bundle)") : _chalk.default.dim("(app bundle)"), _react.default.createElement("br", null), this.state.buildStatus.launchDevServer === "DONE" ? _chalk.default.green("localhost:8080") : _chalk.default.dim("localhost:8080"), _react.default.createElement("br", null), this.state.buildStatus.launchDevServer === "DONE" ? _chalk.default.green("websocket server (for HMR)") : _chalk.default.dim("websocket server (for HMR)"), _react.default.createElement("br", null), this.state.buildStatus.launchDevServer === "DONE" ? _chalk.default.green("localhost:8081") : _chalk.default.dim("localhost:8081"))))), _react.default.createElement(_reactCliRenderer.Section, {
        align: "center"
      }, "Logs", _react.default.createElement("br", null), _react.default.createElement(_reactCliRenderer.Section, {
        height: 10,
        border: {
          horizontal: "-",
          vertical: "|"
        }
      }, this.state.logs.map(function (log, index) {
        return _react.default.createElement(_reactCliRenderer.Section, {
          key: index
        }, index > 0 ? _chalk.default.dim("".concat(index + 1, ": ").concat(log)) : "".concat(index + 1, ": ").concat(log));
      })))));
    }
  }, {
    key: "__reactstandin__regenerateByEval",
    // @ts-ignore
    value: function __reactstandin__regenerateByEval(key, code) {
      // @ts-ignore
      this[key] = eval(code);
    }
  }]);

  return StartdServer;
}(_react.default.Component);

(0, _reactCliRenderer.default)(_react.default.createElement(StartdServer, null));
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(inputMiddlewarePath, "inputMiddlewarePath", "/Users/mgrip/repos/startd/src/index.js");
  reactHotLoader.register(inputAppPath, "inputAppPath", "/Users/mgrip/repos/startd/src/index.js");
  reactHotLoader.register(StartdServer, "StartdServer", "/Users/mgrip/repos/startd/src/index.js");
  leaveModule(module);
})();

;
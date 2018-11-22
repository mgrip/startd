#! /usr/bin/env node
//  strict
"use strict";

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _http = _interopRequireDefault(require("http"));

var _chalk = _interopRequireDefault(require("chalk"));

var _minimist = _interopRequireDefault(require("minimist"));

var _findUp = _interopRequireDefault(require("find-up"));

var _react = _interopRequireDefault(require("react"));

var _reactCliRenderer = _interopRequireDefault(require("react-cli-renderer"));

var _koa = _interopRequireDefault(require("koa"));

var _cli = _interopRequireDefault(require("./cli"));

var _startd = _interopRequireDefault(require("./startd"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  _: [inputAppPath],
  inputMiddlewarePath
} = (0, _minimist.default)(process.argv.slice(2));

class StartdServer extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      inputAppPath,
      inputMiddlewarePath,
      logs: [],
      devMode: process.env.NODE_ENV !== "production",
      buildStatus: {
        webpackCompile: "NOTSTARTED",
        launchServer: "NOTSTARTED",
        webpackDevCompile: "NOTSTARTED",
        launchDevServer: "NOTSTARTED"
      }
    });
  }

  addLog(newLog) {
    this.setState(state => ({
      logs: [newLog, ...state.logs]
    }));
  }

  startServer(koaApp) {
    if (this.state.server) {
      this.state.server.close();
    }

    const server = _http.default.createServer(koaApp.callback()); // where to get port from?


    server.listen(3000);
    this.setState({
      server
    });
  }

  async componentDidMount() {
    const appPath = _path.default.resolve(process.cwd(), this.state.inputAppPath);

    this.setState({
      appPath
    });

    if (!_fs.default.existsSync(appPath)) {
      this.addLog(`${appPath} is not a valid filepath 😿`);
      return;
    }

    let middlewarePath;

    if (this.state.inputMiddlewarePath) {
      if (typeof this.state.inputMiddlewarePath !== "string") {
        // @TODO: maybe prompt to re-enter?
        this.addLog(`Input filepath is not a string`);
        return;
      }

      middlewarePath = _path.default.resolve(process.cwd(), // $FlowFixMe flow isn't picking up the check above
      this.state.inputMiddlewarePath);
      this.setState({
        middlewarePath
      });

      if (!_fs.default.existsSync(middlewarePath)) {
        this.addLog(`${middlewarePath} is not a valid filepath`);
        return;
      }
    }

    if (!_findUp.default.sync(".babelrc", {
      cwd: _path.default.dirname(appPath)
    })) {
      this.addLog("Looks like you don't have a .babelrc file set up for your app. " + "By default startd transpiles your app using the react babel preset. " + "Add a .babelrc file for other transpile options!");
    }

    const startd = new _startd.default(appPath, middlewarePath);
    this.addLog("Starting webpack compilation...");
    this.setState(prevState => ({
      buildStatus: { ...prevState.buildStatus,
        webpackCompile: "WORKING"
      }
    }));
    const koaApp = await startd.compileApp();
    this.addLog(`Webpack comilation ${_chalk.default.green("successful!")}`);
    this.setState(prevState => ({
      buildStatus: { ...prevState.buildStatus,
        webpackCompile: "DONE"
      }
    }));

    if (this.state.devMode && koaApp) {
      this.addLog("Launching startd server 🛫");
      this.setState(prevState => ({
        buildStatus: { ...prevState.buildStatus,
          launchServer: "WORKING"
        }
      })); // @TODO: handle webpack fail

      this.startServer(koaApp);
      this.setState(prevState => ({
        buildStatus: { ...prevState.buildStatus,
          launchServer: "DONE"
        }
      }));
      this.addLog('startd running in dev mode  make sure to add "--prod" flag when running in production');
      this.addLog("Compiling webpack for dev server...");
      this.setState(prevState => ({
        buildStatus: { ...prevState.buildStatus,
          webpackDevCompile: "WORKING"
        }
      }));
      const devApp = await startd.compileDevServer(updatedKoaApp => {
        this.startServer(updatedKoaApp);
      });
      devApp.listen(8080);
      this.setState(prevState => ({
        buildStatus: { ...prevState.buildStatus,
          launchDevServer: "DONE"
        }
      }));
      this.addLog(`dev server launched ${_chalk.default.green("successfully!")}`);
      this.addLog(`Your app is now listening on ports ${_chalk.default.cyan("3000")}, ${_chalk.default.cyan("8000")}, and ${_chalk.default.cyan("8081")} 🤘`);
      this.addLog(`You can access your app at ${_chalk.default.underline.magenta("http://localhost:3000")} 🎉`);
    } else {
      this.addLog("App successfully running production build. Your app has been compiled and is ready to launch. " + "Run 'node server.bundle.js' to launch the server");
    }
  }

  render() {
    return _react.default.createElement(_cli.default, {
      devMode: this.state.devMode,
      buildStatus: this.state.buildStatus,
      logs: this.state.logs
    });
  }

  // @ts-ignore
  __reactstandin__regenerateByEval(key, code) {
    // @ts-ignore
    this[key] = eval(code);
  }

}

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
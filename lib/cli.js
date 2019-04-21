"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Cli;

var _react = _interopRequireDefault(require("react"));

var _ink = require("ink");

var _chalk = _interopRequireDefault(require("chalk"));

var _index = require("./index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).enterModule;
  enterModule && enterModule(module);
})();

function getStepStatus(status) {
  switch (status) {
    case _index.BuildStatusOptions.NotStarted:
      return "○";

    case _index.BuildStatusOptions.Working:
      return "...";

    default:
      return "✓";
  }
}

function Cli({
  devMode,
  buildStatus,
  logs
}) {
  return _react.default.createElement(_ink.Box, {
    flexDirection: "column",
    alignItems: "center"
  }, _react.default.createElement(_ink.Box, null, "startd-server \uD83D\uDE80"), devMode ? _react.default.createElement(_ink.Box, null, _chalk.default.red("dev mode"), " \uD83D\uDEE0") : _react.default.createElement(_ink.Box, null, _chalk.default.green("production mode"), " \uD83D\uDC6E\u200D\u2640\uFE0F"), _react.default.createElement(_ink.Box, null, _react.default.createElement(_ink.Box, {
    flexBasis: "40%",
    flexDirection: "column"
  }, _react.default.createElement(_ink.Box, null, "Your App Build"), _react.default.createElement(_ink.Box, null, getStepStatus(buildStatus.webpackCompile), " Compile your app with webpack"), devMode && _react.default.createElement(_ink.Box, null, getStepStatus(buildStatus.launchServer), " Launch a local server"), devMode && _react.default.createElement(_ink.Box, null, getStepStatus(buildStatus.webpackDevCompile), " Compile development bundle"), devMode && _react.default.createElement(_ink.Box, null, getStepStatus(buildStatus.launchDevServer), " Launch local development server"), devMode && _react.default.createElement(_ink.Box, {
    flexDirection: "column",
    alignItems: "center",
    padding: 2
  }, _react.default.createElement(_ink.Box, null, "browser"), _react.default.createElement(_ink.Box, null, "\u2922 \u2921"), _react.default.createElement(_ink.Box, null, _react.default.createElement(_ink.Box, {
    flexBasis: "50%",
    flexDirection: "column",
    alignItems: "center"
  }, buildStatus.launchServer === _index.BuildStatusOptions.Done ? _chalk.default.green("server") : _chalk.default.dim("server"), buildStatus.launchServer === _index.BuildStatusOptions.Done ? _chalk.default.green("(initial response)") : _chalk.default.dim("(initial response)"), buildStatus.launchServer === _index.BuildStatusOptions.Done ? _chalk.default.green("localhost:3000") : _chalk.default.dim("localhost:3000")), _react.default.createElement(_ink.Box, {
    flexBasis: "50%",
    flexDirection: "column",
    alignItems: "center"
  }, buildStatus.launchDevServer === _index.BuildStatusOptions.Done ? _chalk.default.green("dev-server") : _chalk.default.dim("dev-server"), buildStatus.launchDevServer === _index.BuildStatusOptions.Done ? _chalk.default.green("(app bundle)") : _chalk.default.dim("(app bundle)"), buildStatus.launchDevServer === _index.BuildStatusOptions.Done ? _chalk.default.green("localhost:8080") : _chalk.default.dim("localhost:8080"), buildStatus.launchDevServer === _index.BuildStatusOptions.Done ? _chalk.default.green("websocket server (for HMR)") : _chalk.default.dim("websocket server (for HMR)"), buildStatus.launchDevServer === _index.BuildStatusOptions.Done ? _chalk.default.green("localhost:8081") : _chalk.default.dim("localhost:8081"))))), _react.default.createElement(_ink.Box, {
    flexBasis: "60%",
    flexDirection: "column"
  }, _react.default.createElement(_ink.Box, null, "Logs"), _react.default.createElement(_ink.Box, {
    flexDirection: "column"
  }, logs.map((log, index) => _react.default.createElement(_ink.Box, {
    key: index,
    textWrap: "truncate"
  }, index > 0 ? _chalk.default.dim(`${index + 1}: ${log}`) : `${index + 1}: ${log}`))))));
}

;

(function () {
  var reactHotLoader = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).default;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(getStepStatus, "getStepStatus", "/Users/mgrip/repos/startd/src/cli.tsx");
  reactHotLoader.register(Cli, "Cli", "/Users/mgrip/repos/startd/src/cli.tsx");
})();

;

(function () {
  var leaveModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).leaveModule;
  leaveModule && leaveModule(module);
})();
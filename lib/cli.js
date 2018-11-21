"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Cli;

var _react = _interopRequireDefault(require("react"));

var _reactCliRenderer = require("react-cli-renderer");

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

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

function Cli({
  devMode,
  buildStatus,
  logs
}) {
  return _react.default.createElement(_reactCliRenderer.Section, {
    align: "center"
  }, "startd-server \uD83D\uDE80", devMode ? _react.default.createElement("div", {
    align: "center"
  }, _chalk.default.red("dev mode"), " \uD83D\uDEE0") : _react.default.createElement("div", {
    align: "center"
  }, _chalk.default.green("production mode"), " \uD83D\uDC6E\u200D\u2640\uFE0F"), _react.default.createElement(_reactCliRenderer.Section, {
    horizontal: true
  }, _react.default.createElement(_reactCliRenderer.Section, {
    align: "center"
  }, "Your App Build", _react.default.createElement(_reactCliRenderer.Section, null, getStepStatus(buildStatus.webpackCompile), " Compile your app with webpack", _react.default.createElement("br", null), devMode && _react.default.createElement(_reactCliRenderer.Section, null, getStepStatus(buildStatus.launchServer), " Launch a local server"), devMode && _react.default.createElement(_reactCliRenderer.Section, null, getStepStatus(buildStatus.webpackDevCompile), " Compile your app again, this time for a local development server (to enable HMR)"), devMode && _react.default.createElement(_reactCliRenderer.Section, null, getStepStatus(buildStatus.launchDevServer), " Launch local development server")), devMode && _react.default.createElement(_reactCliRenderer.Section, {
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
  }, buildStatus.launchServer === "DONE" ? _chalk.default.green("server") : _chalk.default.dim("server"), _react.default.createElement("br", null), buildStatus.launchServer === "DONE" ? _chalk.default.green("(initial response)") : _chalk.default.dim("(initial response)"), _react.default.createElement("br", null), buildStatus.launchServer === "DONE" ? _chalk.default.green("localhost:3000") : _chalk.default.dim("localhost:3000")), _react.default.createElement(_reactCliRenderer.Section, {
    border: {
      horizontal: "-",
      vertical: "|"
    },
    align: "center"
  }, buildStatus.launchDevServer === "DONE" ? _chalk.default.green("dev-server") : _chalk.default.dim("dev-server"), _react.default.createElement("br", null), buildStatus.launchDevServer === "DONE" ? _chalk.default.green("(app bundle)") : _chalk.default.dim("(app bundle)"), _react.default.createElement("br", null), buildStatus.launchDevServer === "DONE" ? _chalk.default.green("localhost:8080") : _chalk.default.dim("localhost:8080"), _react.default.createElement("br", null), buildStatus.launchDevServer === "DONE" ? _chalk.default.green("websocket server (for HMR)") : _chalk.default.dim("websocket server (for HMR)"), _react.default.createElement("br", null), buildStatus.launchDevServer === "DONE" ? _chalk.default.green("localhost:8081") : _chalk.default.dim("localhost:8081"))))), _react.default.createElement(_reactCliRenderer.Section, {
    align: "center"
  }, "Logs", _react.default.createElement("br", null), _react.default.createElement(_reactCliRenderer.Section, {
    height: 10,
    border: {
      horizontal: "-",
      vertical: "|"
    }
  }, logs.map((log, index) => _react.default.createElement(_reactCliRenderer.Section, {
    key: index
  }, index > 0 ? _chalk.default.dim(`${index + 1}: ${log}`) : `${index + 1}: ${log}`))))));
}

;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(getStepStatus, "getStepStatus", "/Users/mgrip/repos/startd/src/cli.js");
  reactHotLoader.register(Cli, "Cli", "/Users/mgrip/repos/startd/src/cli.js");
  leaveModule(module);
})();

;
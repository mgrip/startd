"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _winston = _interopRequireDefault(require("winston"));

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var prettyPrint = _winston.default.format.prettyPrint;

var logger = _winston.default.createLogger({
  format: _winston.default.format.printf(function (info) {
    var type = _chalk.default.gray("log");

    switch (info.level) {
      case "error":
        type = _chalk.default.red.bold("!!");
        break;

      case "info":
        type = _chalk.default.bold.blue("ℹ");
        break;
    }

    return "".concat(_chalk.default.dim("🚀"), "  ").concat(_chalk.default.gray("[startd-server]"), " ").concat(type, " ").concat(info.message);
  }),
  transports: [new _winston.default.transports.Console()]
});

var debugLogger = _winston.default.createLogger({
  format: prettyPrint(),
  transports: [new _winston.default.transports.Console()]
});

var _default = {
  info: function info(message) {
    logger.log("info", _chalk.default.gray(message));
  },
  error: function error(message) {
    logger.log("error", message);
  },
  debug: function debug(data) {
    debugLogger.log("error", data);
  }
};
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(prettyPrint, "prettyPrint", "/Users/mgrip/repos/startd/packages/startd-server/src/logger.js");
  reactHotLoader.register(logger, "logger", "/Users/mgrip/repos/startd/packages/startd-server/src/logger.js");
  reactHotLoader.register(debugLogger, "debugLogger", "/Users/mgrip/repos/startd/packages/startd-server/src/logger.js");
  reactHotLoader.register(_default, "default", "/Users/mgrip/repos/startd/packages/startd-server/src/logger.js");
  leaveModule(module);
})();

;
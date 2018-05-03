"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require("winston");

var _winston2 = _interopRequireDefault(_winston);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var prettyPrint = _winston2.default.format.prettyPrint;


var logger = _winston2.default.createLogger({
  format: _winston2.default.format.printf(function (info) {
    var type = _chalk2.default.gray("log");
    switch (info.level) {
      case "error":
        type = _chalk2.default.red.bold("!!");
        break;
      case "info":
        type = _chalk2.default.bold.blue("ℹ");
        break;
    }
    return _chalk2.default.dim("🚀") + "  " + _chalk2.default.gray("[startd-server]") + " " + type + " " + info.message;
  }),
  transports: [new _winston2.default.transports.Console()]
});

var debugLogger = _winston2.default.createLogger({
  format: prettyPrint(),
  transports: [new _winston2.default.transports.Console()]
});

var _default = {
  info: function info(message) {
    logger.log("info", _chalk2.default.gray(message));
  },
  error: function error(message) {
    logger.log("error", message);
  },
  debug: function debug(data) {
    debugLogger.log("error", data);
  }
};
exports.default = _default;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(prettyPrint, "prettyPrint", "src/logger.js");
  reactHotLoader.register(logger, "logger", "src/logger.js");
  reactHotLoader.register(debugLogger, "debugLogger", "src/logger.js");
  reactHotLoader.register(_default, "default", "src/logger.js");
  leaveModule(module);
})();

;
"use strict";

var _server = _interopRequireDefault(require("./server.js"));

var _http = _interopRequireDefault(require("http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

const server = _http.default.createServer(_server.default.callback()); // where to get port from?


server.listen(process.env.PORT ? process.env.PORT : 3000);
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(server, "server", "/Users/mgrip/repos/startd/src/runServer.js");
  leaveModule(module);
})();

;
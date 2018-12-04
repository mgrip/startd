"use strict";

var _server = _interopRequireDefault(require("./server.js"));

var _http = _interopRequireDefault(require("http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  strict
const server = _http.default.createServer(_server.default.callback()); // where to get port from?


server.listen(process.env.PORT ? process.env.PORT : 3000);
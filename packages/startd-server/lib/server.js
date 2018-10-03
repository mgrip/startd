"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _koa = require("koa");

var _koa2 = _interopRequireDefault(_koa);

var _koaStatic = require("koa-static");

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _server = require("react-dom/server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var AppModule = require(APP_PATH);
var App = AppModule.default;
var app = new _koa2.default();

app.use((0, _koaStatic2.default)(_path2.default.resolve(__dirname, "..", "public"), { maxage: 0 }));

if (typeof MIDDLEWARE_PATH !== "undefined") {
  var MiddlewareModule = require(MIDDLEWARE_PATH);
  app.use(MiddlewareModule.default);
}

app.use(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ctx.type = "html";
            ctx.body = "<!doctype html><html lang=\"en\">\n      <head>\n        <meta charset=\"utf-8\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n        <script type=\"text/javascript\" src=\"/" + BUNDLE_PATH + "\"></script>\n      </head>\n      <body>\n        <div id=\"root\">" + (0, _server.renderToString)(_react2.default.createElement(App, { ctx: ctx })) + "</div>\n      </body>\n    </html>";

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

app.listen(PORT);
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(App, "App", "src/server.js");
  reactHotLoader.register(app, "app", "src/server.js");
  leaveModule(module);
})();

;
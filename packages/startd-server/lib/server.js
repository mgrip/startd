"use strict";

var _react = _interopRequireDefault(require("react"));

var _koa = _interopRequireDefault(require("koa"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _path = _interopRequireDefault(require("path"));

var _server = require("react-dom/server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var AppModule = require(APP_PATH);

var App = AppModule.default;
var app = new _koa.default();
app.use((0, _koaStatic.default)(_path.default.resolve(__dirname, "..", "public"), {
  maxage: 0
}));

if (typeof MIDDLEWARE_PATH !== "undefined") {
  var MiddlewareModule = require(MIDDLEWARE_PATH);

  app.use(MiddlewareModule.default);
}

app.use(
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(ctx) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ctx.type = "html";
            ctx.body = "<!doctype html><html lang=\"en\">\n      <head>\n        <meta charset=\"utf-8\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n        <script type=\"text/javascript\" src=\"".concat(BUNDLE_PATH, "\"></script>\n      </head>\n      <body>\n        <div id=\"root\">").concat((0, _server.renderToString)(_react.default.createElement(App, {
              ctx: ctx
            })), "</div>\n      </body>\n    </html>");

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
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

  reactHotLoader.register(App, "App", "/Users/mgrip/repos/startd/packages/startd-server/src/server.js");
  reactHotLoader.register(app, "app", "/Users/mgrip/repos/startd/packages/startd-server/src/server.js");
  leaveModule(module);
})();

;
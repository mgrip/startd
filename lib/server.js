"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _koa = _interopRequireDefault(require("koa"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _server = require("react-dom/server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

const AppModule = require(APP_PATH);

const App = AppModule.default;
const app = new _koa.default();
app.use((0, _koaStatic.default)("public", {
  maxage: 0
}));

if (typeof MIDDLEWARE_PATH !== "undefined") {
  const MiddlewareModule = require(MIDDLEWARE_PATH);

  app.use(MiddlewareModule.default);
}

app.use(async ctx => {
  ctx.type = "html";
  ctx.body = `<!doctype html><html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="text/javascript">
          window.startd = ${JSON.stringify(ctx.state.startd)};
        </script>
        <script type="text/javascript" src="${BUNDLE_PATH}"></script>
      </head>
      <body>
        <div id="root">${(0, _server.renderToString)(_react.default.createElement(App, {
    ctx: ctx,
    startd: ctx.state.startd
  }))}</div>
      </body>
    </html>`;
});
const _default = app;
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(App, "App", "/Users/mgrip/repos/startd/src/server.js");
  reactHotLoader.register(app, "app", "/Users/mgrip/repos/startd/src/server.js");
  reactHotLoader.register(_default, "default", "/Users/mgrip/repos/startd/src/server.js");
  leaveModule(module);
})();

;
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

//  strict
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
        <script type="text/javascript" src="${BUNDLE_PATH}"></script>
      </head>
      <body>
        <div id="root">${(0, _server.renderToString)(_react.default.createElement(App, {
    ctx: ctx
  }))}</div>
      </body>
    </html>`;
});
var _default = app;
exports.default = _default;
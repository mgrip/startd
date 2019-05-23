"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _koa = _interopRequireDefault(require("koa"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _server = require("react-dom/server");

var _reactHelmet = require("react-helmet");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).enterModule;
  enterModule && enterModule(module);
})();

// we need to dynamically import the app module from the user's project
// eslint-disable-next-line
const AppModule = require(APP_PATH);

const App = AppModule.default;
const app = new _koa.default();
app.proxy = USE_APP_PROXY;
app.use((0, _koaStatic.default)("public", {
  maxage: 0
}));
app.use(async (ctx, next) => {
  ctx.state.startd = {};
  await next();
});

if (typeof MIDDLEWARE_PATH !== "undefined") {
  // we need to dynamically import the app module from the user's project
  // eslint-disable-next-line
  const MiddlewareModule = require(MIDDLEWARE_PATH);

  app.use(MiddlewareModule.default);
}

app.use(async ctx => {
  let bundlePath = `/${BUNDLE_PATH}`;

  if (typeof DEV_PORT !== "undefined") {
    bundlePath = `${ctx.origin.substring(0, ctx.origin.lastIndexOf(":"))}:${DEV_PORT}/${BUNDLE_PATH}`;
  }

  const appMarkup = (0, _server.renderToString)(_react.default.createElement(App, {
    ctx: ctx,
    startd: ctx.state.startd
  }));

  const helmet = _reactHelmet.Helmet.renderStatic();

  ctx.type = "html";
  ctx.body = `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
      </head>
      <script type="text/javascript">
        window.startd = ${JSON.stringify(ctx.state.startd)};
      </script>
      <script type="text/javascript" src="${bundlePath}" async></script>
      <body>
        <div id="root">${appMarkup}</div>
      </body>
    </html>`;
});
const _default = app;
var _default2 = _default;
exports.default = _default2;
;

(function () {
  var reactHotLoader = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).default;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(App, "App", "/Users/mgrip/repos/startd/src/server.tsx");
  reactHotLoader.register(app, "app", "/Users/mgrip/repos/startd/src/server.tsx");
  reactHotLoader.register(_default, "default", "/Users/mgrip/repos/startd/src/server.tsx");
})();

;

(function () {
  var leaveModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).leaveModule;
  leaveModule && leaveModule(module);
})();
// @flow strict

import React from "react";
import Koa from "koa";
import serve from "koa-static";
import { renderToString } from "react-dom/server";

const AppModule = require(APP_PATH);
const App = AppModule.default;
const app = new Koa();

app.proxy = USE_APP_PROXY;

app.use(serve("public", { maxage: 0 }));

app.use(async (ctx, next) => {
  ctx.state.startd = {};
  await next();
});

if (typeof MIDDLEWARE_PATH !== "undefined") {
  const MiddlewareModule = require(MIDDLEWARE_PATH);
  app.use(MiddlewareModule.default);
}

let headerString = `<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>`;

if (typeof HEADER_PATH !== "undefined") {
  const HeaderModule = require(HEADER_PATH);
  headerString = HeaderModule.default;
}

app.use(async ctx => {
  ctx.type = "html";
  ctx.body = `<!doctype html><html lang="en">
      ${headerString}
      <script type="text/javascript">
        window.startd = ${JSON.stringify(ctx.state.startd)};
      </script>
      <script type="text/javascript" src="${BUNDLE_PATH}"></script>
      <body>
        <div id="root">${renderToString(
          <App ctx={ctx} startd={ctx.state.startd} />
        )}</div>
      </body>
    </html>`;
});

export default app;

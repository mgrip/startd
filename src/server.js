// @flow strict

import React from "react";
import Koa from "koa";
import serve from "koa-static";
import path from "path";
import { renderToString } from "react-dom/server";

const AppModule = require(APP_PATH);
const App = AppModule.default;
const app = new Koa();

app.use(serve(path.resolve(__dirname, "..", "public"), { maxage: 0 }));

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
        <div id="root">${renderToString(<App ctx={ctx} />)}</div>
      </body>
    </html>`;
});

app.listen(PORT);

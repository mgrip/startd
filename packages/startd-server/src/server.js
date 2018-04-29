// @flow

import React from "react";
import Koa from "koa";
import serve from "koa-static";
import path from "path";
import { renderToString } from "react-dom/server";

const App = require(APP_PATH).default;

const app = new Koa();

app.use(serve(path.resolve(process.cwd(), "public"), { maxage: 0 }));

// @TODO: make this relative for prod
const bundlePath = "http://localhost:8080/app.bundle.js";

app.use(async ctx => {
  ctx.type = "html";
  ctx.body = `<!doctype html><html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="text/javascript" src="${bundlePath}"></script>
      </head>
      <body>
        <div id="root">${renderToString(<App />)}</div>
      </body>
    </html>`;
});

app.listen(3000);

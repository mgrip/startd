#! /usr/bin/env node
//@flow

import webpack from "webpack";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import minimist from "minimist";
import findUp from "find-up";
import logger from "./logger";
import config from "./webpack.config.js";
import { spawn } from "child_process"

const {
  _: [inputPath],
  middleware
} = minimist(process.argv.slice(2));

if (typeof inputPath !== "string") {
  logger.error("You must provide a valid path to your root App component");
  process.exit(1);
}
// $FlowFixMe - for some reason flow isn't picking up the process.exit above
const appPath = path.resolve(process.cwd(), inputPath);
if (!fs.existsSync(appPath)) {
  logger.error(`${appPath} is not a valid filepath 😿`);
  process.exit(1);
}

let middlewarePath;
if (middleware) {
  middlewarePath = path.resolve(process.cwd(), middleware);
  if (!fs.existsSync(middlewarePath)) {
    logger.error(`${middlewarePath} is not a valid filepath 😿`);
    process.exit(1);
  }
}

if (!findUp.sync(".babelrc", { cwd: path.dirname(appPath) })) {
  logger.info(
    `Looks like you don't have a .babelrc file set up for your app 👻`
  );
  logger.info(
    `  * by default startd transpiles your app using the react babel preset`
  );
  logger.info(`  * add a .babelrc file for other transpile options`);
}

logger.info("Starting webpack compilation... 🕸");

const appConfig = config.map(singleConfig => ({
  ...singleConfig,
  plugins: [
    ...singleConfig.plugins,
    new webpack.DefinePlugin({
      ...{ APP_PATH: JSON.stringify(appPath), PORT: 3000 },
      ...(middleware
        ? { MIDDLEWARE_PATH: JSON.stringify(middlewarePath) }
        : {}),
      ...(process.env.NODE_ENV === "production"
        ? {
            "process.env.NODE_ENV": JSON.stringify("production"),
            BUNDLE_PATH: JSON.stringify(config[1].output.filename)
          }
        : {
            BUNDLE_PATH: JSON.stringify(
              "http://localhost:8080/" + config[1].output.filename
            )
          })
    })
  ]
}));
let server;
webpack(appConfig, (err, multiStats) => {
  if (err || multiStats.hasErrors()) {
    // Handle errors here
    logger.error(`Webpack ${chalk.red("failed")} to compile 😿`);
    multiStats.stats.forEach(stats => {
      if (stats.compilation.errors && stats.compilation.errors.length > 0) {
        logger.debug(stats.compilation.errors);
      }
    });
  } else {
    logger.info(`Webpack comilation ${chalk.green("successful!")} 🍾`);
    logger.info("Launching startd server 🛫");
    // launch the server
    // $FlowFixMe webpack bundle will only exist under /lib
    if (server) {
      server.kill();
    }
    server = spawn("node", [path.resolve(__dirname, "server.bundle.js")], {
      stdio: 'inherit',
      env: process.env,
    });

    // if we're in development mode, run a dev server in parallel, to enable
    // watch mode and hot module replacement for the client code
    if (process.env.NODE_ENV !== "production") {
      logger.info(
        'startd running in dev mode 🛠  make sure to add "--prod" flag when running in production'
      );
      logger.info("🛠  compiling webpack for dev server... 🕸");
      const Koa = require("koa");
      const webpackDevMiddleware = require("koa-webpack");

      const devApp = new Koa();
      const clientConfig = appConfig[1];
      webpackDevMiddleware({
        config: {
          ...clientConfig,
          output: {
            ...clientConfig.output,
            publicPath: "http://localhost:8080/"
          }
        },
        devMiddleware: {
          // since we're running the dev server for the client independently of
          // the backend server, we need to specify access control for the request
          // from the original host (3000) to connect to the websocket server (8081)
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000"
          },
          logLevel: "silent",
          reporter: () => {
            // @TODO should combine this with above
            webpack(appConfig, () => {
              if (server) {
                server.kill();
              }
              server = spawn("node", [path.resolve(__dirname, "server.bundle.js")], {
                stdio: 'inherit',
                env: process.env,
              });
            });
          }
        }
      }).then(middleware => {
        logger.info(
          `🛠  dev server launched ${chalk.green("successfully!")} 🍾  🛫`
        );
        logger.info(
          `Your app is now listening on ports ${chalk.cyan(
            "3000"
          )}, ${chalk.cyan("8000")}, and ${chalk.cyan("8081")} 🤘`
        );
        logger.info(
          `You can access your app at ${chalk.underline.magenta(
            "http://localhost:3000"
          )}

                 ---------------
                 |   browser   |
                 ---------------
                ↙↗            ↖↘
----------------------      ------------------------------
|       server       |      |        dev-server          |
| (initial response) |      |       (app bundle)         |
|   localhost:3000   |      |      localhost:8080        |
----------------------      | websocket server (for HMR) |
                            |      localhost:8081        |
                            ------------------------------`
        );
        devApp.use(middleware);
        devApp.listen(8080);
      });
    } else {
      logger.info(
        `App successfully running production build. Your app is listening on port ${chalk.magenta(
          "3000"
        )}`
      );
    }
  }
});

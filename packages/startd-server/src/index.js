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

const argv = minimist(process.argv.slice(2));

if (typeof argv.path !== "string") {
  logger.error(
    'You must provide a valid "--path" argument, as a path to your root App component.'
  );
  process.exit(1);
}
// $FlowFixMe - for some reason flow isn't picking up the process.exit above
const appPath = path.resolve(process.cwd(), argv.path);
if (!fs.existsSync(appPath)) {
  logger.error(`${appPath} is not a valid filepath 😿`);
  process.exit(1);
}

if (!findUp.sync(".babelrc", { cwd: path.dirname(appPath) })) {
  logger.error(
    `Looks like you don't have a .babelrc file set up for your app. 👻`
  );
  process.exit(1);
}

logger.info(chalk.gray("Starting webpack compilation... 🕸"));

const appConfig = config.map(singleConfig => ({
  ...singleConfig,
  plugins: [
    ...singleConfig.plugins,
    new webpack.DefinePlugin({
      APP_PATH: JSON.stringify(appPath)
    })
  ]
}));
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
    require("./server.bundle.js");

    // if we're in development mode, run a dev server in parallel, to enable
    // watch mode and hot module replacement for the client code
    if (process.env.NODE_ENV !== "production") {
      logger.info(
        chalk.gray(
          'startd running in dev mode 🛠  make sure to add "--prod" flag when running in production'
        )
      );
      logger.info(chalk.gray("🛠  compiling webpack for dev server... 🕸"));
      const Koa = require("koa");
      const webpackDevMiddleware = require("koa-webpack");

      const devApp = new Koa();
      const clientConfig = appConfig[1];
      const devMiddleware = webpackDevMiddleware({
        config: {
          ...clientConfig,
          output: {
            ...clientConfig.output,
            publicPath: "http://localhost:8080/"
          }
        },
        dev: {
          // since we're running the dev server for the client independently of
          // the backend server, we need to specify access control for the request
          // from the original host (3000) to connect to the websocket server (8081)
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000"
          },
          logLevel: "silent"
        }
      });
      const { dev } = devMiddleware;
      dev.waitUntilValid(() => {
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
      });
      devApp.use(devMiddleware);
      devApp.listen(8080);
    }
  }
});

// @flow strict

import webpack from "webpack";
import type { WebpackOptions } from "webpack";
import config from "./webpack.config.js";
import Koa from "koa";
import webpackDevMiddleware from "koa-webpack";

export default class Startd {
  webpackConfig: Array<WebpackOptions>;

  constructor(
    appPath: string,
    useProxy: boolean,
    middlewarePath?: string,
    headerPath?: string
  ) {
    this.webpackConfig = this.getWebpackConfig(
      appPath,
      useProxy,
      middlewarePath,
      headerPath
    );
  }

  getWebpackConfig(
    appPath: string,
    useProxy: boolean,
    middlewarePath?: string,
    headerPath?: string
  ): Array<WebpackOptions> {
    return config.map(singleConfig => ({
      ...singleConfig,
      plugins: [
        ...singleConfig.plugins,
        new webpack.DefinePlugin({
          ...{
            APP_PATH: JSON.stringify(appPath),
            PORT: 3000,
            USE_APP_PROXY: useProxy
          },
          ...(middlewarePath
            ? { MIDDLEWARE_PATH: JSON.stringify(middlewarePath) }
            : {}),
          ...(headerPath ? { HEADER_PATH: JSON.stringify(headerPath) } : {}),
          ...(process.env.NODE_ENV === "production"
            ? {
                BUNDLE_PATH: JSON.stringify(config[1].output.filename)
              }
            : {
                BUNDLE_PATH: JSON.stringify(config[1].output.filename),
                DEV_PORT: "8080"
              })
        })
      ]
    }));
  }

  compileApp(): Promise<Koa | void> {
    return new Promise((resolve, reject) => {
      // $FlowFixMe https://github.com/webpack/webpack/issues/8356
      webpack(this.webpackConfig, (err, multiStats) => {
        // $FlowFixMe webpack has incorrect flowtype
        if (err || multiStats.hasErrors()) {
          // Handle errors here
          // $FlowFixMe webpack has incorrect flowtype
          multiStats.stats.forEach(stats => {
            if (stats.hasErrors()) {
              // eslint-disable-next-line no-console
              console.log(stats.toString());
            }
          });
          reject();
        } else {
          if (process.env.NODE_ENV === "production") {
            resolve();
          } else {
            // $FlowFixMe this is the output of webpack, doesn't exist yet
            resolve(require("./server.bundle.js").default);
          }
        }
      });
    });
  }

  async compileDevServer(onChange: (app: Koa) => void): Promise<Koa> {
    const devApp = new Koa();
    const clientConfig = this.webpackConfig[1];
    const middleware = await webpackDevMiddleware({
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
          // $FlowFixMe https://github.com/webpack/webpack/issues/8356
          webpack(this.webpackConfig, () => {
            // $FlowFixMe this is the output of webpack, doesn't exist yet
            onChange(require("./server.bundle.js").default);
          });
        }
      },
      hotClient: {
        logLevel: "silent"
      }
    });
    devApp.use(middleware);
    return devApp;
  }
}

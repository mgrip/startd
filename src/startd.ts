import webpack from "webpack";
import config from "./webpack.config";
import Koa from "koa";
import webpackDevMiddleware from "koa-webpack";

export default class Startd {
  public webpackConfig: webpack.Configuration[];

  public constructor(
    appPath: string,
    useProxy: boolean,
    middlewarePath?: string
  ) {
    this.webpackConfig = this.getWebpackConfig(
      appPath,
      useProxy,
      middlewarePath
    );
  }

  public getWebpackConfig(
    appPath: string,
    useProxy: boolean,
    middlewarePath?: string
  ): webpack.Configuration[] {
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

  public compileApp(): Promise<Koa | void> {
    return new Promise((resolve, reject) => {
      webpack(this.webpackConfig, (err, multiStats) => {
        if (err || multiStats.hasErrors()) {
          // Handle errors here
          // @ts-ignore webpack stats type is wrong
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
            resolve(require("./server.bundle.js").default);
          }
        }
      });
    });
  }

  public async compileDevServer(onChange: (app: Koa) => void): Promise<Koa> {
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
        publicPath: "http://localhost:8080",
        // since we're running the dev server for the client independently of
        // the backend server, we need to specify access control for the request
        // from the original host (3000) to connect to the websocket server (8081)
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000"
        },
        logLevel: "silent",
        reporter: () => {
          webpack(this.webpackConfig, () => {
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

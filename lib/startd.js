"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _webpack = _interopRequireDefault(require("webpack"));

var _webpack2 = _interopRequireDefault(require("./webpack.config"));

var _koa = _interopRequireDefault(require("koa"));

var _koaWebpack = _interopRequireDefault(require("koa-webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).enterModule;
  enterModule && enterModule(module);
})();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Startd {
  constructor(appPath, useProxy, middlewarePath) {
    _defineProperty(this, "webpackConfig", void 0);

    this.webpackConfig = this.getWebpackConfig(appPath, useProxy, middlewarePath);
  }

  getWebpackConfig(appPath, useProxy, middlewarePath) {
    return _webpack2.default.map(singleConfig => ({ ...singleConfig,
      plugins: [...singleConfig.plugins, new _webpack.default.DefinePlugin({ ...{
          APP_PATH: JSON.stringify(appPath),
          PORT: 3000,
          USE_APP_PROXY: useProxy
        },
        ...(middlewarePath ? {
          MIDDLEWARE_PATH: JSON.stringify(middlewarePath)
        } : {}),
        ...(process.env.NODE_ENV === "production" ? {
          BUNDLE_PATH: JSON.stringify(_webpack2.default[1].output.filename)
        } : {
          BUNDLE_PATH: JSON.stringify(_webpack2.default[1].output.filename),
          DEV_PORT: "8080"
        })
      })]
    }));
  }

  compileApp() {
    return new Promise((resolve, reject) => {
      (0, _webpack.default)(this.webpackConfig, (err, multiStats) => {
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

  async compileDevServer(onChange) {
    const devApp = new _koa.default();
    const clientConfig = this.webpackConfig[1];
    const middleware = await (0, _koaWebpack.default)({
      config: { ...clientConfig,
        output: { ...clientConfig.output,
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
          (0, _webpack.default)(this.webpackConfig, () => {
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

  // @ts-ignore
  __reactstandin__regenerateByEval(key, code) {
    // @ts-ignore
    this[key] = eval(code);
  }

}

exports.default = Startd;
;

(function () {
  var reactHotLoader = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).default;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(Startd, "Startd", "/Users/mgrip/repos/startd/src/startd.ts");
})();

;

(function () {
  var leaveModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).leaveModule;
  leaveModule && leaveModule(module);
})();
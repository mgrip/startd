const webpack = require("webpack");
const path = require("path");
const fork = require("child_process").fork;
const express = require("express");
const WebpackDevServer = require("webpack-dev-server");
const formatWebpackMessages = require("webpack-format-messages");

const publicPath = path.resolve(process.cwd(), "public");
const scriptsPath = path.resolve(process.cwd(), "scripts");
const serverEntry = "startd-server.js";
const clientEntry = "startd-client.js";
const serverBundle = "startd-server.bundle.js";
const clientBundle = "startd.bundle.js";
const port = process.env.PORT || 3000;
const hotModuleReplacementPort = 8000;

let server = null;
const refresh = () => {
  if (server) server.kill();
  server = fork(path.resolve(publicPath, serverBundle), { stdio: "inherit" });
  console.log("Restarted the server");
};

const config = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        options: {
          babelrc: false,
          presets: [
            "babel-preset-es2015",
            "babel-preset-stage-1",
            "babel-preset-react"
          ]
        }
      }
    ]
  },
  devtool: "eval"
};
if (process.env.NODE_ENV !== "production") {
  config.module.rules[0].options.plugins = ["react-hot-loader/babel"];
} else {
  config.plugins = [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ];
}

const serverConfig = Object.assign({}, config, {
  entry: path.resolve(scriptsPath, serverEntry),
  output: {
    path: publicPath,
    filename: serverBundle
  },
  target: "node"
});
const clientConfig = Object.assign({}, config, {
  entry: [path.resolve(scriptsPath, clientEntry)],
  output: {
    path: publicPath,
    filename: clientBundle
  }
});
if (process.env.NODE_ENV !== "production") {
  clientConfig.entry.unshift(
    "react-hot-loader/patch",
    "webpack/hot/dev-server",
    "webpack-dev-server/client?http://localhost:" + hotModuleReplacementPort
  );
  clientConfig.plugins = [
    ...clientConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ];
}

const outputMessages = stats => {
  const messages = formatWebpackMessages(stats);

  if (!messages.errors.length && !messages.warnings.length) {
    console.log("Compiled successfully!");
  }

  if (messages.errors.length) {
    console.log("Failed to compile.");
    messages.errors.forEach(e => console.log(e));
    return;
  }

  if (messages.warnings.length) {
    console.log("Compiled with warnings.");
    messages.warnings.forEach(w => console.log(w));
  }
};

const createCompiler = config => {
  const compiler = webpack(config);
  compiler.plugin("invalid", () => console.log("Compiling..."));
  compiler.plugin("done", stats => outputMessages(stats));
  return compiler;
};

if (process.env.NODE_ENV === "production") {
  webpack([serverConfig, clientConfig]).run((err, stats) => {
    refresh();
  });
} else {
  const server = new WebpackDevServer(createCompiler(clientConfig), {
    contentBase: publicPath,
    publicPath: "/",
    hot: true,
    inline: true,
    proxy: {
      "/{!(startd.bundle.js|sockjs-node|hot-update)/**,!(startd.bundle.js|sockjs-node|hot-update),}": {
        target: "http://localhost:" + port + "/",
        ws: true,
        logLevel: "debug"
      }
    }
  }).listen(hotModuleReplacementPort);
  createCompiler(serverConfig).watch({}, err => {
    refresh();
  });
}

const formatWebpackMessages = require("webpack-format-messages");
const webpack = require("webpack");
const path = require("path");

const publicPath = path.resolve(process.cwd(), "public");
const scriptsPath = path.resolve(process.cwd(), "scripts");
const serverEntry = "startd-server.js";
const clientEntry = "startd-client.js";
const serverBundle = "startd-server.bundle.js";
const clientBundle = "startd.bundle.js";
const hotModuleReplacementPort = 8000;

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
  plugins: []
};

if (process.env.NODE_ENV !== "production") {
  config.module.rules[0].options.plugins = ["react-hot-loader/babel"];
  config.devtool = "eval";
} else {
  config.plugins = [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ];
}

exports.serverConfig = Object.assign({}, config, {
  entry: path.resolve(scriptsPath, serverEntry),
  output: {
    path: publicPath,
    filename: serverBundle
  },
  target: "node"
});
exports.clientConfig = Object.assign({}, config, {
  entry: [path.resolve(scriptsPath, clientEntry)],
  output: {
    path: publicPath,
    filename: clientBundle
  }
});
if (process.env.NODE_ENV !== "production") {
  exports.clientConfig.entry.unshift(
    "react-hot-loader/patch",
    "webpack/hot/dev-server",
    "webpack-dev-server/client?http://localhost:" + hotModuleReplacementPort
  );
  exports.clientConfig.plugins = [
    ...exports.clientConfig.plugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ];
}

exports.outputMessages = stats => {
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

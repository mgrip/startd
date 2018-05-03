// @flow

import path from "path";

const baseConfig = {
  // @TODO: swap this out for production
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["react"]
        }
      }
    ]
  },
  plugins: []
};

export default [
  {
    name: "server",
    ...baseConfig,
    entry: ["babel-polyfill", path.resolve(__dirname, "server.js")],
    output: {
      filename: "server.bundle.js",
      path: __dirname
    },
    target: "node"
  },
  {
    name: "client",
    ...baseConfig,
    entry: ["babel-polyfill", path.resolve(__dirname, "client.js")],
    output: {
      filename: "app.bundle.js",
      path: path.resolve(__dirname, "..", "public")
    }
  }
];

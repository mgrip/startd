// @flow strict

import path from "path";
import dirname from "./dirname";

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
          presets: ["@babel/preset-react"]
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
    entry: ["@babel/polyfill", path.resolve(dirname(), "server.js")],
    output: {
      filename: "server.bundle.js",
      path: dirname(),
      libraryTarget: "commonjs2"
    },
    node: {
      __dirname: true
    },
    target: "node"
  },
  {
    name: "client",
    ...baseConfig,
    entry: ["@babel/polyfill", path.resolve(dirname(), "client.js")],
    output: {
      filename: "app.bundle.js",
      path: path.resolve(dirname(), "..", "public")
    }
  }
];

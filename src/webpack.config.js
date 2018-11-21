// @flow strict

import path from "path";
import dirname from "./dirname";

const baseConfig = {
  // @TODO: swap this out for production
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
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
    entry: [
      "@babel/polyfill",
      path.resolve(
        dirname(),
        process.env.NODE_ENV === "production" ? "runServer" : "server.js"
      )
    ],
    output: {
      filename: "server.bundle.js",
      path: process.env.NODE_ENV === "production" ? process.cwd() : dirname(),
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
      path: path.resolve(
        process.env.NODE_ENV === "production" ? process.cwd() : dirname(),
        "public"
      )
    }
  }
];

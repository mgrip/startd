import path from "path";
import webpack from "webpack";
import dirname from "./dirname";

const baseConfig: webpack.Configuration = {
  // @TODO: swap this out for production
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"]
        }
      }
    ]
  },
  resolve: {
    extensions: ["*", ".mjs", ".js", ".jsx", ".tsx", ".ts"]
  },
  // this is a hack to get the node-pg module to work for projects that need it.
  // see https://github.com/brianc/node-postgres/issues/1138
  plugins: [new webpack.IgnorePlugin(/pg-native/, /\/pg\//)]
};

const configs: webpack.Configuration[] = [
  {
    name: "server",
    ...baseConfig,
    entry: [
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
    entry: [path.resolve(dirname(), "client.js")],
    output: {
      filename: "app.bundle.js",
      path: path.resolve(
        process.env.NODE_ENV === "production" ? process.cwd() : dirname(),
        "public"
      )
    }
  }
];

export default configs;

const webpack = require("webpack");
const {
  serverConfig,
  clientConfig,
  outputMessages
} = require("./webpack-config");

webpack([serverConfig, clientConfig]).run((err, stats) => {
  if (err) {
    console.log(err);
  } else {
    outputMessages(stats);
  }
});

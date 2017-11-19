const webpack = require("webpack");
const path = require("path");
const fork = require("child_process").fork;
const WebpackDevServer = require("webpack-dev-server");
const {
  clientConfig,
  serverConfig,
  outputMessages
} = require("./build/webpack-config");

const publicPath = path.resolve(process.cwd(), "public");
const serverBundle = "startd-server.bundle.js";
const port = process.env.PORT || 3000;
const hotModuleReplacementPort = 8000;

let server = null;
const refresh = () => {
  if (server) server.kill();
  server = fork(path.resolve(publicPath, serverBundle), { stdio: "inherit" });
  console.log("Restarted the server");
};

const createCompiler = config => {
  const compiler = webpack(config);
  compiler.plugin("invalid", () => console.log("Compiling..."));
  compiler.plugin("done", stats => outputMessages(stats));
  return compiler;
};

const devServer = new WebpackDevServer(createCompiler(clientConfig), {
  contentBase: publicPath,
  publicPath: "/",
  hot: true,
  inline: true,
  proxy: {
    "/{!(startd.bundle.js|sockjs-node|*.hot-update.json),!(sockjs-node)/**/!(*.hot-update.json)}": {
      target: "http://localhost:" + port + "/",
      logLevel: "debug"
    }
  },
  noInfo: true
}).listen(hotModuleReplacementPort);
createCompiler(serverConfig).watch({}, err => {
  refresh();
});

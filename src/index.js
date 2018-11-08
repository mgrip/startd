#! /usr/bin/env node
// @flow strict

import webpack from "webpack";
import path from "path";
import fs from "fs";
// not sure what's goin on with this libdef but flow is complaining
// that its not  using flow-strict strict $FlowFixMe
import chalk from "chalk";
import minimist from "minimist";
import findUp from "find-up";
import config from "./webpack.config.js";
import { spawn } from "child_process";
import type { ChildProcess } from "child_process";
import React from "react";
import ReactCLI, { Section } from "react-cli-renderer";
import Koa from "koa";
import webpackDevMiddleware from "koa-webpack";

const {
  _: [inputAppPath],
  inputMiddlewarePath
} = minimist(process.argv.slice(2));

type BuildStatus = "NOTSTARTED" | "WORKING" | "DONE";
class StartdServer extends React.Component<
  {},
  {
    inputAppPath: string,
    appPath?: string,
    inputMiddlewarePath?: string | boolean,
    middlewarePath?: string,
    logs: Array<string>,
    server?: ChildProcess,
    devMode: boolean,
    buildStatus: {
      webpackCompile: BuildStatus,
      launchServer: BuildStatus,
      webpackDevCompile: BuildStatus,
      launchDevServer: BuildStatus
    }
  }
> {
  state = {
    inputAppPath,
    inputMiddlewarePath,
    logs: [],
    devMode: process.env.NODE_ENV !== "production",
    buildStatus: {
      webpackCompile: "NOTSTARTED",
      launchServer: "NOTSTARTED",
      webpackDevCompile: "NOTSTARTED",
      launchDevServer: "NOTSTARTED"
    }
  };

  addLog(newLog: string): void {
    this.setState(state => ({
      logs: [newLog, ...state.logs]
    }));
  }

  componentDidMount() {
    const appPath = path.resolve(process.cwd(), this.state.inputAppPath);
    this.setState({ appPath });
    if (!fs.existsSync(appPath)) {
      this.addLog(`${appPath} is not a valid filepath 😿`);
      return;
    }

    if (this.state.inputMiddlewarePath) {
      if (typeof this.state.inputMiddlewarePath !== "string") {
        // @TODO: maybe prompt to re-enter?
        this.addLog(`Input filepath is not a string`);
        return;
      }
      const middlewarePath = path.resolve(
        process.cwd(),
        // $FlowFixMe flow isn't picking up the check above
        this.state.inputMiddlewarePath
      );
      this.setState({ middlewarePath });
      if (!fs.existsSync(middlewarePath)) {
        this.addLog(`${middlewarePath} is not a valid filepath`);
        return;
      }
    }

    if (!findUp.sync(".babelrc", { cwd: path.dirname(appPath) })) {
      this.addLog(
        "Looks like you don't have a .babelrc file set up for your app. " +
          "By default startd transpiles your app using the react babel preset. " +
          "Add a .babelrc file for other transpile options!"
      );
    }

    this.addLog("Starting webpack compilation...");
    this.setState(prevState => ({
      buildStatus: { ...prevState.buildStatus, webpackCompile: "WORKING" }
    }));

    const appConfig = config.map(singleConfig => ({
      ...singleConfig,
      plugins: [
        ...singleConfig.plugins,
        new webpack.DefinePlugin({
          ...{ APP_PATH: JSON.stringify(appPath), PORT: 3000 },
          ...(this.state.middlewarePath
            ? { MIDDLEWARE_PATH: JSON.stringify(this.state.middlewarePath) }
            : {}),
          ...(process.env.NODE_ENV === "production"
            ? {
                "process.env": {
                  NODE_ENV: JSON.stringify("production")
                },
                BUNDLE_PATH: JSON.stringify("/" + config[1].output.filename)
              }
            : {
                BUNDLE_PATH: JSON.stringify(
                  "http://localhost:8080/" + config[1].output.filename
                )
              })
        })
      ]
    }));
    webpack(appConfig, (err, multiStats) => {
      if (err || multiStats.hasErrors()) {
        // Handle errors here
        // logger.error(`Webpack ${chalk.red("failed")} to compile 😿`);
        multiStats.stats.forEach(stats => {
          if (stats.compilation.errors && stats.compilation.errors.length > 0) {
            // logger.debug(stats.compilation.errors);
          }
        });
      } else {
        this.addLog(`Webpack comilation ${chalk.green("successful!")}`);
        this.setState(prevState => ({
          buildStatus: { ...prevState.buildStatus, webpackCompile: "DONE" }
        }));
        this.addLog("Launching startd server 🛫");
        this.setState(prevState => ({
          buildStatus: { ...prevState.buildStatus, launchServer: "WORKING" }
        }));
        this.setState({
          server: spawn("node", [path.resolve(__dirname, "server.bundle.js")], {
            stdio: "inherit",
            env: process.env
          })
        });
        this.setState(prevState => ({
          buildStatus: { ...prevState.buildStatus, launchServer: "DONE" }
        }));

        // if we're in development mode, run a dev server in parallel, to enable
        // watch mode and hot module replacement for the client code
        if (this.state.devMode) {
          this.addLog(
            'startd running in dev mode  make sure to add "--prod" flag when running in production'
          );
          this.addLog("Compiling webpack for dev server...");
          this.setState(prevState => ({
            buildStatus: {
              ...prevState.buildStatus,
              webpackDevCompile: "WORKING"
            }
          }));

          const devApp = new Koa();
          const clientConfig = appConfig[1];
          webpackDevMiddleware({
            config: {
              ...clientConfig,
              output: {
                ...clientConfig.output,
                publicPath: "http://localhost:8080/"
              }
            },
            devMiddleware: {
              // since we're running the dev server for the client independently of
              // the backend server, we need to specify access control for the request
              // from the original host (3000) to connect to the websocket server (8081)
              headers: {
                "Access-Control-Allow-Origin": "http://localhost:3000"
              },
              logLevel: "silent",
              reporter: () => {
                // @TODO should combine this with above
                webpack(appConfig, () => {
                  if (this.state.server) {
                    this.state.server.kill();
                  }
                  this.setState({
                    server: spawn(
                      "node",
                      [path.resolve(__dirname, "server.bundle.js")],
                      {
                        stdio: "inherit",
                        env: process.env
                      }
                    )
                  });
                });
              }
            },
            hotClient: {
              logLevel: "silent"
            }
          }).then(middleware => {
            this.setState(prevState => ({
              buildStatus: {
                ...prevState.buildStatus,
                webpackDevCompile: "DONE",
                launchDevServer: "WORKING"
              }
            }));
            devApp.use(middleware);
            devApp.listen(8080);
            this.setState(prevState => ({
              buildStatus: {
                ...prevState.buildStatus,
                launchDevServer: "DONE"
              }
            }));
            this.addLog(`dev server launched ${chalk.green("successfully!")}`);
            this.addLog(
              `Your app is now listening on ports ${chalk.cyan(
                "3000"
              )}, ${chalk.cyan("8000")}, and ${chalk.cyan("8081")} 🤘`
            );
            this.addLog(
              `You can access your app at ${chalk.underline.magenta(
                "http://localhost:3000"
              )} 🎉`
            );
          });
        } else {
          this.addLog(
            `App successfully running production build. Your app is listening on port ${chalk.magenta(
              "3000"
            )}`
          );
        }
      }
    });
  }

  render() {
    function getStepStatus(status: BuildStatus): string {
      switch (status) {
        case "NOTSTARTED":
          return "○";
        case "WORKING":
          return "...";
        default:
          return "✓";
      }
    }
    return (
      <Section align="center">
        startd-server 🚀
        {this.state.devMode ? (
          <div align="center">{chalk.red("dev mode")} 🛠</div>
        ) : (
          <div align="center">{chalk.green("production mode")} 👮‍♀️</div>
        )}
        <Section horizontal>
          <Section align="center">
            Your App Build
            <Section>
              {getStepStatus(this.state.buildStatus.webpackCompile)} Compile
              your app with webpack
              <br />
              {getStepStatus(this.state.buildStatus.launchServer)} Launch a
              local server
              {this.state.devMode && (
                <Section>
                  {getStepStatus(this.state.buildStatus.webpackDevCompile)}{" "}
                  Compile your app again, this time for a local development
                  server (to enable HMR)
                </Section>
              )}
              {this.state.devMode && (
                <Section>
                  {getStepStatus(this.state.buildStatus.launchDevServer)} Launch
                  local development server
                </Section>
              )}
            </Section>
            <Section
              align="center"
              border={{ horizontal: " ", vertical: "      " }}
            >
              <Section align="center">browser</Section>⤢ ⤡
              <Section horizontal>
                <Section
                  border={{ horizontal: "-", vertical: "|" }}
                  align="center"
                >
                  {this.state.buildStatus.launchServer === "DONE"
                    ? chalk.green("server")
                    : chalk.dim("server")}
                  <br />
                  {this.state.buildStatus.launchServer === "DONE"
                    ? chalk.green("(initial response)")
                    : chalk.dim("(initial response)")}
                  <br />
                  {this.state.buildStatus.launchServer === "DONE"
                    ? chalk.green("localhost:3000")
                    : chalk.dim("localhost:3000")}
                </Section>
                <Section
                  border={{ horizontal: "-", vertical: "|" }}
                  align="center"
                >
                  {this.state.buildStatus.launchDevServer === "DONE"
                    ? chalk.green("dev-server")
                    : chalk.dim("dev-server")}
                  <br />
                  {this.state.buildStatus.launchDevServer === "DONE"
                    ? chalk.green("(app bundle)")
                    : chalk.dim("(app bundle)")}
                  <br />
                  {this.state.buildStatus.launchDevServer === "DONE"
                    ? chalk.green("localhost:8080")
                    : chalk.dim("localhost:8080")}
                  <br />
                  {this.state.buildStatus.launchDevServer === "DONE"
                    ? chalk.green("websocket server (for HMR)")
                    : chalk.dim("websocket server (for HMR)")}
                  <br />
                  {this.state.buildStatus.launchDevServer === "DONE"
                    ? chalk.green("localhost:8081")
                    : chalk.dim("localhost:8081")}
                </Section>
              </Section>
            </Section>
          </Section>
          <Section align="center">
            Logs
            <br />
            <Section height={10} border={{ horizontal: "-", vertical: "|" }}>
              {this.state.logs.map((log, index) => (
                <Section key={index}>
                  {index > 0
                    ? chalk.dim(`${index + 1}: ${log}`)
                    : `${index + 1}: ${log}`}
                </Section>
              ))}
            </Section>
          </Section>
        </Section>
      </Section>
    );
  }
}

ReactCLI(<StartdServer />);

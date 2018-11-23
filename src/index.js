#! /usr/bin/env node
// @flow strict

import path from "path";
import fs from "fs";
import http from "http";
import type { Server } from "http";
// not sure what's goin on with this libdef but flow is complaining
// that its not  using flow-strict strict $FlowFixMe
import chalk from "chalk";
import minimist from "minimist";
import findUp from "find-up";
import React from "react";
import ReactCLI, { watchStdout } from "react-cli-renderer";
import Koa from "koa";
import Cli from "./cli";
import Startd from "./startd";

const {
  _: [inputAppPath],
  middleware: inputMiddlewarePath
} = minimist(process.argv.slice(2));

export type BuildStatusOptions = "NOTSTARTED" | "WORKING" | "DONE";
export type BuildStatus = {
  webpackCompile: BuildStatusOptions,
  launchServer: BuildStatusOptions,
  webpackDevCompile: BuildStatusOptions,
  launchDevServer: BuildStatusOptions
};
class StartdServer extends React.Component<
  {},
  {
    inputAppPath: string,
    appPath?: string,
    inputMiddlewarePath?: string | boolean,
    middlewarePath?: string,
    logs: Array<string>,
    stdout: Array<string>,
    server?: Server,
    devMode: boolean,
    buildStatus: BuildStatus
  }
> {
  state = {
    inputAppPath,
    inputMiddlewarePath,
    logs: [],
    stdout: [],
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

  startServer(koaApp: Koa): void {
    if (this.state.server) {
      this.state.server.close();
    }

    const server = http.createServer(koaApp.callback());
    // where to get port from?
    server.listen(3000);
    this.setState({ server });
  }

  async componentDidMount() {
    const appPath = path.resolve(process.cwd(), this.state.inputAppPath);
    this.setState({ appPath });
    if (!fs.existsSync(appPath)) {
      this.addLog(`${appPath} is not a valid filepath 😿`);
      return;
    }

    let middlewarePath: string | void;
    if (this.state.inputMiddlewarePath) {
      if (typeof this.state.inputMiddlewarePath !== "string") {
        // @TODO: maybe prompt to re-enter?
        this.addLog(`Input filepath is not a string`);
        return;
      }
      middlewarePath = path.resolve(
        process.cwd(),
        // $FlowFixMe flow isn't picking up the check above
        this.state.inputMiddlewarePath
      );
      this.setState({ middlewarePath });
      this.addLog(`Using ${middlewarePath} middleware`);
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

    watchStdout(stdoutLines => {
      this.setState(prevState => ({
        stdout: [...prevState.stdout, ...stdoutLines]
      }));
    });

    const startd = new Startd(appPath, middlewarePath);

    this.addLog("Starting webpack compilation...");
    this.setState(prevState => ({
      buildStatus: { ...prevState.buildStatus, webpackCompile: "WORKING" }
    }));

    const koaApp = await startd.compileApp();
    this.addLog(`Webpack comilation ${chalk.green("successful!")}`);
    this.setState(prevState => ({
      buildStatus: { ...prevState.buildStatus, webpackCompile: "DONE" }
    }));

    if (this.state.devMode && koaApp) {
      this.addLog("Launching startd server 🛫");
      this.setState(prevState => ({
        buildStatus: { ...prevState.buildStatus, launchServer: "WORKING" }
      }));
      // @TODO: handle webpack fail
      this.startServer(koaApp);
      this.setState(prevState => ({
        buildStatus: { ...prevState.buildStatus, launchServer: "DONE" }
      }));
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
      const devApp = await startd.compileDevServer(updatedKoaApp => {
        this.startServer(updatedKoaApp);
      });
      devApp.listen(8080);
      this.setState(prevState => ({
        buildStatus: {
          ...prevState.buildStatus,
          launchDevServer: "DONE"
        }
      }));
      this.addLog(`dev server launched ${chalk.green("successfully!")}`);
      this.addLog(
        `Your app is now listening on ports ${chalk.cyan("3000")}, ${chalk.cyan(
          "8000"
        )}, and ${chalk.cyan("8081")} 🤘`
      );
      this.addLog(
        `You can access your app at ${chalk.underline.magenta(
          "http://localhost:3000"
        )} 🎉`
      );
    } else {
      this.addLog(
        "App successfully running production build. Your app has been compiled and is ready to launch. " +
          "Run 'node server.bundle.js' to launch the server"
      );
    }
  }

  render() {
    return (
      <Cli
        devMode={this.state.devMode}
        buildStatus={this.state.buildStatus}
        logs={this.state.logs}
        stdout={this.state.stdout}
      />
    );
  }
}

ReactCLI(<StartdServer />);

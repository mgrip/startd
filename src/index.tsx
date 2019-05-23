#! /usr/bin/env node

import path from "path";
import fs from "fs";
import http, { Server } from "http";
import chalk from "chalk";
import minimist from "minimist";
import findUp from "find-up";
import React from "react";
import { render } from "ink";
import Koa from "koa";
import Cli from "./cli";
import Startd from "./startd";

const {
  _: [inputAppPath],
  middleware: inputMiddlewarePath,
  useProxy
} = minimist(process.argv.slice(2), { boolean: ["useProxy"] });

export enum BuildStatusOptions {
  NotStarted,
  Working,
  Done
}

export interface BuildStatus {
  webpackCompile: BuildStatusOptions;
  launchServer: BuildStatusOptions;
  webpackDevCompile: BuildStatusOptions;
  launchDevServer: BuildStatusOptions;
}

interface StartdState {
  inputAppPath: string;
  appPath?: string;
  inputMiddlewarePath?: string | boolean;
  middlewarePath?: string;
  logs: string[];
  server?: Server;
  devMode: boolean;
  buildStatus: BuildStatus;
}
class StartdServer extends React.Component<{}, StartdState> {
  public state: StartdState = {
    inputAppPath,
    inputMiddlewarePath,
    logs: [],
    devMode: process.env.NODE_ENV !== "production",
    buildStatus: {
      webpackCompile: BuildStatusOptions.NotStarted,
      launchServer: BuildStatusOptions.NotStarted,
      webpackDevCompile: BuildStatusOptions.NotStarted,
      launchDevServer: BuildStatusOptions.NotStarted
    }
  };

  public addLog(newLog: string): void {
    this.setState(state => ({
      logs: [newLog, ...state.logs]
    }));
  }

  public startServer(koaApp: Koa): void {
    if (this.state.server) {
      this.state.server.close();
    }

    const server = http.createServer(koaApp.callback());
    // where to get port from?
    server.listen(3000);
    this.setState({ server });
  }

  public async componentDidMount() {
    const appPath = path.resolve(process.cwd(), this.state.inputAppPath);
    this.setState({ appPath });
    if (!fs.existsSync(appPath)) {
      this.addLog(`${appPath} is not a valid filepath 😿`);
      return;
    }

    let middlewarePath: string | undefined;
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

    const startd = new Startd(appPath, useProxy, middlewarePath);

    this.addLog("Starting webpack compilation...");
    this.setState(prevState => ({
      buildStatus: {
        ...prevState.buildStatus,
        webpackCompile: BuildStatusOptions.Working
      }
    }));

    let koaApp;
    try {
      koaApp = await startd.compileApp();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error, "Error compiling your app!");
      return;
    }
    this.addLog(`Webpack comilation ${chalk.green("successful!")}`);
    this.setState(prevState => ({
      buildStatus: {
        ...prevState.buildStatus,
        webpackCompile: BuildStatusOptions.Done
      }
    }));

    if (this.state.devMode && koaApp) {
      this.addLog("Launching startd server 🛫");
      this.setState(prevState => ({
        buildStatus: {
          ...prevState.buildStatus,
          launchServer: BuildStatusOptions.Working
        }
      }));
      // @TODO: handle webpack fail
      this.startServer(koaApp);
      this.setState(prevState => ({
        buildStatus: {
          ...prevState.buildStatus,
          launchServer: BuildStatusOptions.Done
        }
      }));
      this.addLog(
        'startd running in dev mode  make sure to add "--prod" flag when running in production'
      );
      this.addLog("Compiling webpack for dev server...");
      this.setState(prevState => ({
        buildStatus: {
          ...prevState.buildStatus,
          webpackDevCompile: BuildStatusOptions.Working
        }
      }));
      let devApp;
      try {
        devApp = await startd.compileDevServer(updatedKoaApp => {
          this.startServer(updatedKoaApp);
        });
        this.setState(prevState => ({
          buildStatus: {
            ...prevState.buildStatus,
            webpackDevCompile: BuildStatusOptions.Done
          }
        }));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error, "Error compiling your app!");
        return;
      }
      devApp.listen(8080);
      this.setState(prevState => ({
        buildStatus: {
          ...prevState.buildStatus,
          launchDevServer: BuildStatusOptions.Done
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

  public render() {
    return (
      <Cli
        devMode={this.state.devMode}
        buildStatus={this.state.buildStatus}
        logs={this.state.logs}
      />
    );
  }
}

render(<StartdServer />);

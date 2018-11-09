// @flow strict

import React from "react";
import { Section } from "react-cli-renderer";
// not sure what's goin on with this libdef but flow is complaining
// that its not  using flow-strict strict $FlowFixMe
import chalk from "chalk";
import type { BuildStatus, BuildStatusOptions } from "./index";

function getStepStatus(status: BuildStatusOptions): string {
  switch (status) {
    case "NOTSTARTED":
      return "○";
    case "WORKING":
      return "...";
    default:
      return "✓";
  }
}
export default function Cli({
  devMode,
  buildStatus,
  logs
}: {
  devMode: boolean,
  buildStatus: BuildStatus,
  logs: Array<string>
}) {
  return (
    <Section align="center">
      startd-server 🚀
      {devMode ? (
        <div align="center">{chalk.red("dev mode")} 🛠</div>
      ) : (
        <div align="center">{chalk.green("production mode")} 👮‍♀️</div>
      )}
      <Section horizontal>
        <Section align="center">
          Your App Build
          <Section>
            {getStepStatus(buildStatus.webpackCompile)} Compile your app with
            webpack
            <br />
            {getStepStatus(buildStatus.launchServer)} Launch a local server
            {devMode && (
              <Section>
                {getStepStatus(buildStatus.webpackDevCompile)} Compile your app
                again, this time for a local development server (to enable HMR)
              </Section>
            )}
            {devMode && (
              <Section>
                {getStepStatus(buildStatus.launchDevServer)} Launch local
                development server
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
                {buildStatus.launchServer === "DONE"
                  ? chalk.green("server")
                  : chalk.dim("server")}
                <br />
                {buildStatus.launchServer === "DONE"
                  ? chalk.green("(initial response)")
                  : chalk.dim("(initial response)")}
                <br />
                {buildStatus.launchServer === "DONE"
                  ? chalk.green("localhost:3000")
                  : chalk.dim("localhost:3000")}
              </Section>
              <Section
                border={{ horizontal: "-", vertical: "|" }}
                align="center"
              >
                {buildStatus.launchDevServer === "DONE"
                  ? chalk.green("dev-server")
                  : chalk.dim("dev-server")}
                <br />
                {buildStatus.launchDevServer === "DONE"
                  ? chalk.green("(app bundle)")
                  : chalk.dim("(app bundle)")}
                <br />
                {buildStatus.launchDevServer === "DONE"
                  ? chalk.green("localhost:8080")
                  : chalk.dim("localhost:8080")}
                <br />
                {buildStatus.launchDevServer === "DONE"
                  ? chalk.green("websocket server (for HMR)")
                  : chalk.dim("websocket server (for HMR)")}
                <br />
                {buildStatus.launchDevServer === "DONE"
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
            {logs.map((log, index) => (
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

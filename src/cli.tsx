import React from "react";
import { Box } from "ink";
// not sure what's goin on with this libdef but flow is complaining
// that its not  using flow-strict strict $FlowFixMe
import chalk from "chalk";
import { BuildStatus, BuildStatusOptions } from "./index";

function getStepStatus(status: BuildStatusOptions): string {
  switch (status) {
    case BuildStatusOptions.NotStarted:
      return "○";
    case BuildStatusOptions.Working:
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
  devMode: boolean;
  buildStatus: BuildStatus;
  logs: string[];
}) {
  return (
    <Box flexDirection="column" alignItems="center">
      <Box>startd-server 🚀</Box>
      {devMode ? (
        <Box>{chalk.red("dev mode")} 🛠</Box>
      ) : (
        <Box>{chalk.green("production mode")} 👮‍♀️</Box>
      )}
      <Box>
        <Box flexBasis="40%" flexDirection="column">
          <Box>Your App Build</Box>
          <Box>
            {getStepStatus(buildStatus.webpackCompile)} Compile your app with
            webpack
          </Box>
          {devMode && (
            <Box>
              {getStepStatus(buildStatus.launchServer)} Launch a local server
            </Box>
          )}
          {devMode && (
            <Box>
              {getStepStatus(buildStatus.webpackDevCompile)} Compile development
              bundle
            </Box>
          )}
          {devMode && (
            <Box>
              {getStepStatus(buildStatus.launchDevServer)} Launch local
              development server
            </Box>
          )}
          {devMode && (
            <Box flexDirection="column" alignItems="center" padding={2}>
              <Box>browser</Box>
              <Box>⤢ ⤡</Box>
              <Box>
                <Box flexBasis="50%" flexDirection="column" alignItems="center">
                  {buildStatus.launchServer === BuildStatusOptions.Done
                    ? chalk.green("server")
                    : chalk.dim("server")}
                  {buildStatus.launchServer === BuildStatusOptions.Done
                    ? chalk.green("(initial response)")
                    : chalk.dim("(initial response)")}
                  {buildStatus.launchServer === BuildStatusOptions.Done
                    ? chalk.green("localhost:3000")
                    : chalk.dim("localhost:3000")}
                </Box>
                <Box flexBasis="50%" flexDirection="column" alignItems="center">
                  {buildStatus.launchDevServer === BuildStatusOptions.Done
                    ? chalk.green("dev-server")
                    : chalk.dim("dev-server")}
                  {buildStatus.launchDevServer === BuildStatusOptions.Done
                    ? chalk.green("(app bundle)")
                    : chalk.dim("(app bundle)")}
                  {buildStatus.launchDevServer === BuildStatusOptions.Done
                    ? chalk.green("localhost:8080")
                    : chalk.dim("localhost:8080")}
                  {buildStatus.launchDevServer === BuildStatusOptions.Done
                    ? chalk.green("websocket server (for HMR)")
                    : chalk.dim("websocket server (for HMR)")}
                  {buildStatus.launchDevServer === BuildStatusOptions.Done
                    ? chalk.green("localhost:8081")
                    : chalk.dim("localhost:8081")}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        <Box flexBasis="60%" flexDirection="column">
          <Box>Logs</Box>
          <Box flexDirection="column">
            {logs.map((log, index) => (
              <Box key={index} textWrap="truncate">
                {index > 0
                  ? chalk.dim(`${index + 1}: ${log}`)
                  : `${index + 1}: ${log}`}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// @flow

import winston from "winston";
import chalk from "chalk";

const { prettyPrint } = winston.format;

const logger = winston.createLogger({
  format: winston.format.printf(info => {
    let type = chalk.gray("log");
    switch (info.level) {
      case "error":
        type = chalk.red.bold("!!");
        break;
      case "info":
        type = chalk.bold.blue("ℹ");
        break;
    }
    return `${chalk.dim("🚀")}  ${chalk.gray("[startd-server]")} ${type} ${
      info.message
    }`;
  }),
  transports: [new winston.transports.Console()]
});

const debugLogger = winston.createLogger({
  format: prettyPrint(),
  transports: [new winston.transports.Console()]
});

export default {
  info: function(message: string) {
    logger.log("info", message);
  },
  error: function(message: string) {
    logger.log("error", message);
  },
  debug: function(data: any) {
    debugLogger.log("error", data);
  }
};

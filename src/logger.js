/**
 * Logger
 * Created by Darshit Karkar on 06-19-2023.
 */

const _ = require("lodash");
const cluster = require("cluster");
const fs = require("fs");
const moment = require("moment-timezone");
const os = require("os");
const { createLogger, format, transports } = require("winston");

const { NODE_ENV = "local" } = process.env;

const timezone = "America/Regina";
const timestampFormat = "YYYY.MM.DD HH:mm:ss";

const getHostAndProcessInfo = () =>
  `[${os.hostname()} ${
    cluster.isWorker ? "WORKER #" + cluster.worker.id : "MASTER"
  }]`;

const logColors = {
  debug: "white",
  data: "grey",
  error: "red",
  help: "cyan",
  info: "green",
  input: "grey",
  prompt: "grey",
  silly: "magenta",
  warn: "cyan",
  verbose: "cyan"
};

const localFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp({ format: timestampFormat }),
  format.printf(({ level, message }) => {
    const formattedTimestamp = moment().format(timestampFormat);
    return `[${formattedTimestamp}] ${level.toUpperCase()} ${getHostAndProcessInfo()} ${message}`;
  })
);

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: timestampFormat }),
    format.printf(({ level, message }) => {
      const formattedTimestamp = moment().tz(timezone).format(timestampFormat);
      return `[${formattedTimestamp}] ${level.toUpperCase().padEnd(8)} ${getHostAndProcessInfo()} ${message}`;
    })
  ),
  exceptionHandlers: [
    // SplunkLoggerForExceptions
  ],
  exitOnError: false
});

// Adding transports, like file or console
logger.add(
  new transports.Console({
    format: localFormat
  })
);

module.exports = logger;

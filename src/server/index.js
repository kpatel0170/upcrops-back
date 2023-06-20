const express = require("express");
const { loadConfigurationFromFile, loadConfigurationFromDatabase } = require("./configuration-loader");
const initDataBase = require("./database");
// const initFirestore = require("./firestore-database");
const os = require("os");
const initMiddleware = require("./middlewares");
const initRouter = require("./router");
const http = require("http");
const webSocket = require("./socket-io");


global.config = {};
global.limits = {};
global.models = {};

const runServer = async () => {
    const app = express();
    /* Logger */
    const logger = require("../logger");
    logger.info("Logger Initialized!");

    await loadConfigurationFromFile(logger);
    await initDataBase(logger);

    logger.info(`
    APP_ENVIRONMENT: ${process.env.APP_ENVIRONMENT}
    APP_NAME: ${process.env.APP_NAME}
    APP_PORT: ${process.env.APP_PORT}
    APP_RELEASE: ${process.env.APP_RELEASE}
    APP_VERSION: ${process.env.APP_VERSION}`);

    initMiddleware(app, logger);
    initRouter(app, logger);

    const server = http.createServer(app);
    server.listen(process.env.APP_PORT, async () => {
        logger.info(`${process.env.APP_RELEASE} server STARTED on port: ${process.env.APP_PORT}\n`);
        await global.models.GLOBAL.LOG({
            description: `${process.env.APP_RELEASE} server STARTED on port: ${process.env.APP_PORT}`,
            time: Date.now(),
            parameters: {}
        }).save();
    });

    server.timeout = 120000;
}

module.exports = runServer;

const { isEmpty } = require("lodash");
const { InvalidArgumentsError } = require("../errors");
const Promise = require("bluebird");
const logger = require("../logger");
const mongoose = require("mongoose");

/* ConnectionFactory */
module.exports = function (config) {
  this.connections = {};

  this.getConnection = async (domain, db) => {
    if (
      isEmpty(domain) ||
      !config.MONGODB[domain] ||
      isEmpty(db) ||
      isEmpty(db.NAME)
    ) {
      throw new InvalidArgumentsError("Domain/DB cannot be empty!");
    }

    domain = domain.trim().toUpperCase();
    let connectionName = `${domain}#${db.NAME.trim().toUpperCase()}`;

    // Check if we already created a connection - if yes, return that, else, create a new connection, store and return.
    if (this.connections[connectionName]) {
      logger.info(
        `Connection to database (domain: ${domain}, db: ${db.NAME}) successful!`
      );
      return this.connections[connectionName];
    } else {
      try {
        let connection = await mongoose.createConnection(process.env.MONGOURI, {
          autoReconnect: false, // Removed deprecated option
          promiseLibrary: Promise,
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true
        });

        connection.on("connected", () =>
          logger.info(
            `Connection to database (domain: ${domain}, db: ${db.NAME}) successful!`
          )
        );
        connection.on("error", (error) =>
          logger.error(
            `Connection to database (domain: ${domain}, db: ${db.NAME}) failed! Error: ${error.message}\n${error.stack}`
          )
        );
        connection.on("disconnected", () =>
          logger.info(
            `Connection to database (domain: ${domain}, db: ${db.NAME}) terminated!`
          )
        );

        this.connections[connectionName] = connection;
        logger.info(
          `Connection to database (domain: ${domain}, db: ${db.NAME}) successful!`
        );
        return this.connections[connectionName];
      } catch (error) {
        logger.error(
          `Error creating connection to database (domain: ${domain}, db: ${db.NAME}): ${error.message}`
        );
        throw error;
      }
    }
  };
};

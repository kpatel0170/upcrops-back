/**
 * MongoDB / Mongoose
 * Created by Darshit Karkar on 06-19-2023
 */
const mongoose = require("mongoose");
const logger = require("../logger");
const ConnectionFactory = require("./connection-factory");
const config = require("../../config.json");

module.exports = async () => {
  mongoose.pluralize(null); // So that mongoose doesn't try to pluralize the schema and map accordingly.
  let models;
  try {
    const connectionFactory = new ConnectionFactory(config);
    // GLOBAL Connections
    const CONNECTION_IN_AGTECH = await connectionFactory.getConnection(
      "GLOBAL",
      config.MONGODB.GLOBAL.DATABASE.agriGen
    );

    const mongooseConnections = {
      GLOBAL: {
        agriGen: CONNECTION_IN_AGTECH,
      },
    };

    /* All the (mongoose) models to be defined here */
    models = {
      GLOBAL: {
        ADMIN: require("../schema/admin/admin")(CONNECTION_IN_AGTECH),
        LOG: require("../schema/log/log")(mongooseConnections.GLOBAL.agriGen),
        ROLE: require("../schema/role/role")(CONNECTION_IN_AGTECH),
        PRODUCT: require("../schema/product/product")(CONNECTION_IN_AGTECH),
        CART: require("../schema/cart/cart")(CONNECTION_IN_AGTECH),
        NOTIFICATION: require("../schema/notification/notification")(
          CONNECTION_IN_AGTECH
        ),
      },
    };

    return models;
  } catch (error) {
    logger.error(
      "Error encountered while trying to create database connections and models:\n" +
        error.stack
    );
    return null;
  }
};

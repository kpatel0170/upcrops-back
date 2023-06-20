/**
 * Authentication strategies
 * Created by Darshit Karkar, on 06-19-2023.
 */
"use strict";

const JwtStrategy = require("passport-jwt").Strategy;
const moment = require("moment");
const passport = require("passport");
const { isEmpty } = require("lodash");

const enums = require("../../json/enums.json");

const jwtOptions = require("./jwt-options");
const logger = require("../logger");

const { NODE_ENV = "local" } = process.env;

module.exports.setup = () => {

  passport.use(
    new JwtStrategy(jwtOptions, (req, jwt_payload, next) => {
      const {
        id,
        date,
        environment,
        phone,
        scope,
        email,
        type: type,
      } = jwt_payload;

      const reqInfo = `REQ [${req.requestId}] [${req.method}] ${req.originalUrl}`;
      logger.info(
        `${reqInfo} - #JwtStrategy - payload: ${JSON.stringify(jwt_payload)}`
      );

      // Do this check only for the USER apps
      if (type === enums.USER_TYPE.ADMIN) {
        if (isEmpty(date)) {
          logger.error(
            '#JwtStrategy - Property "date" is null. User needs to login again!'
          );
          next(null, false);
        }
      }

      let model;
      let criteria;
      console.log("test1", type);

      if (
        type === enums.USER_TYPE.ADMIN ||
        type === enums.USER_TYPE.USER ||
        type === enums.USER_TYPE.SELLER
      ) {
        console.log("test1", type);
        // Check if the token was generated from the same environment - since we are just extracting the phone from the token
        if (
          !isEmpty(environment) &&
          environment !== NODE_ENV &&
          NODE_ENV !== "local"
        ) {
          logger.error("#JwtStrategy - Invalid token!");
          next(null, false);
        }

        model = global.models.GLOBAL.ADMIN;
        if (type === enums.USER_TYPE.ADMIN) {
          console.log("test2-->>");

          // Check if the token was generated from the same environment - since we are just extracting the phone from the token
          if (
            !isEmpty(environment) &&
            environment !== NODE_ENV &&
            NODE_ENV !== "local"
          ) {
            logger.error("#JwtStrategy - Invalid token!");
            next(null, false);
          }
        }
        console.log("test4", type);

        //  logger.info('#JwtStrategy - criteria: ' + JSON.stringify(criteria) + '}' + model);
        model
          .findOne(criteria)
          .lean() // This will return a simple JSON from database - no modifications to database are possible.
          .then((object) => {
            if (!object) {
              logger.info("#JwtStrategy - No entry found!");
              next(null, false);
            } else {
              // logger.info("#JwtStrategy - Entry found!");
              if (type === enums.USER_TYPE.ADMIN) {
                object.scope = scope;
                object.type = type;
                next(null, object);
              } else if (type === enums.USER_TYPE.USER) {
                object.scope = scope;
                object.type = type;
                next(null, object);
              } else if (type === enums.USER_TYPE.SELLER) {
                object.scope = scope;
                object.type = type;
                next(null, object);
              }
            }
          })
          .catch((error) => {
            logger.error(
              `#JwtStrategy - Error encountered: ${error.message}\n${error.stack}`
            );
            next(null, false);
          });
      }
    })
  );
};

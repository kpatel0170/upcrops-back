const Joi = require("joi");
const jwt = require("jsonwebtoken");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const jwtOptions = require("../../auth/jwt-options");
const logger = require("../../logger");
const utils = require("../../utils");

module.exports = exports = {
  // router validation
  validation: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // route handler
  handler: async (req, res) => {
    let { email, password } = req.body;
    //validate email and password
    if (!email || !password) {
      logger.error(messages.FIELD_REQUIRE);
      const data4createResponseObject = {
        req: req,
        result: -400,
        message: messages.FIELD_REQUIRE,
        payload: {},
        logPayload: false
      };
      res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
      return;
    }
    try {
      // check if user is already logged in
      const admin = await global.models.GLOBAL.ADMIN.findOne({
        email: email
      }).populate({
        path: "role",
        model: "role",
        select: "_id roleName"
      });
      if (admin.password !== password) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.USER_NOT_FOUND,
          payload: {},
          logPayload: false
        };
        return res
          .status(enums.HTTP_CODES.NOT_FOUND)
          .json(utils.createResponseObject(data4createResponseObject));
      }

      // check if admin is blocked or not
      if (admin.isDelete == true) {
        return res.status(enums.HTTP_CODES.NOT_FOUND).json({
          result: -1,
          message: messages.BLOCKED_BY_ADMIN,
          payload: {},
          logPayload: false
        });
      }
      const rolename = await global.models.GLOBAL.ROLE.findOne({
        _id: admin.role
      });
      // create token
      if (rolename.roleName === "admin") {
        role = enums.USER_TYPE.ADMIN;
      } else if (rolename.roleName === "user") {
        role = enums.USER_TYPE.USER;
      } else if (rolename.roleName === "seller") {
        role = enums.USER_TYPE.SELLER;
      }
      const data4token = {
        id: admin._id,
        date: new Date(),
        environment: process.env.APP_ENVIRONMENT,
        email: email,
        scope: "login",
        type: role
      };
      delete admin._doc.password;
      const payload = {
        admin: admin,
        token: jwt.sign(data4token, jwtOptions.secretOrKey),
        token_type: "Bearer"
      };
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.LOGIN_SUCCESS,
        payload: payload,
        logPayload: false
      };
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
    } catch (error) {
      logger.error(
        `${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`
      );
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.GENERAL,
        payload: {},
        logPayload: false
      };
      return res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  }
};

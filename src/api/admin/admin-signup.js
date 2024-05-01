const _ = require("lodash");
const Joi = require("joi");
const ObjectId = require("mongodb").ObjectId;
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const jwt = require("jsonwebtoken");
const logger = require("../../logger");
const utils = require("../../utils");
const jwtOptions = require("../../auth/jwt-options");
const role = require("../../routes/role");
const admin = require("../../routes/admin");

module.exports = exports = {
  // router validation
  validation: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().required()
  }),

  // route handler
  handler: async (req, res) => {
    let { email, password, firstName, role, lastName } = req.body;

    if (!email || !password) {
      logger.error(messages.FILL_DETAILS);
      const FILL_DETAILS = {
        req: req,
        result: -400,
        message: messages.FILL_DETAILS,
        payload: {},
        logPayload: false
      };
      res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(FILL_DETAILS));
      return;
    }
    // check if email already exist
    const emailExist = await global.models.GLOBAL.ADMIN.findOne({
      email: email
    });

    if (emailExist) {
      const EXISTS_EMAIL = {
        req: req,
        result: -400,
        message: messages.EXISTS_EMAIL,
        payload: {},
        logPayload: false
      };
      res
        .status(enums.HTTP_CODES.DUPLICATE_VALUE)
        .json(utils.createResponseObject(EXISTS_EMAIL));
      return;
    }

    /* Save into mongodb */
    const rolename = await global.models.GLOBAL.ROLE.findOne({
      _id: role
    });

    const uid = new ObjectId();
    const adminObject = {
      _id: uid,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      role: rolename,
      status: {
        name:
          rolename.roleName === "admin" ||
          rolename.roleName === "user" ||
          rolename.roleName === "seller"
            ? enums.USER_STATUS.ACTIVE
            : enums.USER_STATUS.INACTIVE,
        modificationDate: Date.now().toString()
      },
      modificationDate: Date.now(),
      registractionDate: Date.now()
    };

    console.log(adminObject);

    const newAdmin = global.models.GLOBAL.ADMIN(adminObject);
    try {
      await newAdmin.save();
    } catch (error) {
      logger.error(
        "/admin - Error encountered while trying to add new admin:\n" + error
      );
      const FAILED_REGISTRATION = {
        req: req,
        result: -1,
        message: messages.FAILED_REGISTRATION,
        payload: {},
        logPayload: false
      };
      res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(FAILED_REGISTRATION));
      return;
    }
    const data4token = {
      email: email,
      date: new Date(),
      scope: "verification"
    };
    const payload = {
      admin: {
        _id: adminObject._id,
        email: adminObject.email,
        firstName: adminObject.firstName,
        lastName: adminObject.lastName,
        avatarName: adminObject.avatarName,
        avatarPic: adminObject.avatarPic,
        role: adminObject.role
      },
      token: jwt.sign(data4token, jwtOptions.secretOrKey),
      token_type: "Bearer"
    };
    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.REGISTER_SUCCESS,
      payload: payload,
      logPayload: false
    };
    return res
      .status(enums.HTTP_CODES.OK)
      .json(utils.createResponseObject(data4createResponseObject));
  }
};

const Joi = require("joi");
const jwt = require("jsonwebtoken");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const jwtOptions = require("../../auth/jwt-options");
const logger = require("../../logger");
const utils = require("../../utils");

module.exports = exports = {
  // route validation
  validation: Joi.object({
    uid: Joi.string().required(),
    isFeatured: Joi.boolean(),
    name: Joi.string(),
    description: Joi.array(),
    price: Joi.number(),
    durationType: Joi.string(),
  }),
  handler: async (req, res) => {
    const { user } = req;
    const {
      uid,
      name,
      description,
      price,
      durationType,
      isFeatured,

    } = req.body;
    try {
      let plansData = {
        uid: uid,
        name : name,
        description : description,
        price : price,
        durationType : durationType,
        isFeatured : isFeatured,
      };
      const createPlans = await global.models.GLOBAL.PLANS.create(plansData);

      if (createPlans) {
        let data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.PLANS_CREATED,
          payload: { createPlans },
        };
        return res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
      } else {
        let data4createResponseObject = {
          req: req,
          result: 1,
          message: messages.PLANS_NOT_CREATED,
          payload: {},
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      }
    } catch (err) {
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.GENERAL,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};

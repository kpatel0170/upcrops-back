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
    uid : Joi.string().required(),
    product : Joi.array(),
    total : Joi.number()
  }),
  handler: async (req, res) => {
    const { user } = req;
    const {
      uid,
      product,
      total,
    } = req.body;
    try {
      let cartData = {
        uid: uid,
        product : product,
        total : total,
        status : "pending",
      };
      const createCart = await global.models.GLOBAL.CART.create(cartData);
      console.log("createCart", createCart);

      if (createCart) {
        let data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.CART_CREATED,
          payload: { createCart },
        };
        return res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
      } else {
        let data4createResponseObject = {
          req: req,
          result: 1,
          message: messages.CART_NOT_CREATED,
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

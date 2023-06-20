const Joi = require("joi");
const jwt = require("jsonwebtoken");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const jwtOptions = require("../../auth/jwt-options");
const logger = require("../../logger");
const utils = require("../../utils");

module.exports = exports = {
  // route validation

  // route handler
  handler: async (req, res) => {
    const { user } = req;
    const id = req.params.id;
    req.files = JSON.parse(JSON.stringify(req.files));
    try {
      let multiImages = [];

      for (i = 0; i < req.files.image.length; i++) {
        multiImages.push({ media: req.files.image[i].location });
      }

      let findPost = await global.models.GLOBAL.PRODUCT.findByIdAndUpdate(
        {
          _id: id,
        },
        {
          $push: { image: multiImages },
        },
        { new: true }
      );
      let data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.ITEM_UPDATED,
        payload: {},
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
      return;
    } catch (error) {
      logger.error(
        `${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`
      );
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

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");
// Delete EditorService by id
module.exports = exports = {
  handler: async (req, res) => {
    const { id } = req.query;
    if (id) {
      try {
        let plansRemoved =
          await global.models.GLOBAL.PLANS.findByIdAndRemove(id);
        if (plansRemoved) {
          let data4createResponseObject = {
            req: req,
            result: -1,
            message: messages.PLANS_DELETED,
            payload: { plansRemoved },
            logPayload: false
          };
          return res
            .status(enums.HTTP_CODES.OK)
            .json(utils.createResponseObject(data4createResponseObject));
        } else {
          let data4createResponseObject = {
            req: req,
            result: 0,
            message: messages.NOT_FOUND,
            payload: {},
            logPayload: false
          };
          return res
            .status(enums.HTTP_CODES.NOT_FOUND)
            .json(utils.createResponseObject(data4createResponseObject));
        }
      } catch (error) {
        logger.error(
          `${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`
        );
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.GENERAL,
          payload: {},
          logPayload: false
        };
        return res
          .status(enums.HTTP_CODES.NOT_FOUND)
          .json(utils.createResponseObject(data4createResponseObject));
      }
    } else {
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.INVALID_PARAMETERS,
        payload: {},
        logPayload: false
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  }
};

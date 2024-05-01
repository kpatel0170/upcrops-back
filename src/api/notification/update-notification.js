const Joi = require("joi");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const { log } = require("../../logger");
const logger = require("../../logger");
const utils = require("../../utils");

// update editorService data
module.exports = exports = {
  handler: async (req, res) => {
    let { id } = req.params;
    //check if abuse is already created
    if (id) {
      let findNotification = await global.models.GLOBAL.NOTIFICATION.findOne({
        _id: id
      });
      if (findNotification) {
        try {
          //update editorservice data
          const updateNotification =
            await global.models.GLOBAL.NOTIFICATION.findByIdAndUpdate(
              req.params.id,
              req.body,
              { new: true }
            );
          if (updateNotification) {
            const data4createResponseObject = {
              req: req,
              result: 200,
              message: messages.POST_UPDATED,
              payload: { updateNotification },
              logPayload: false
            };
            res
              .status(enums.HTTP_CODES.OK)
              .json(utils.createResponseObject(data4createResponseObject));
            return;
          }
        } catch (err) {
          let data4createResponseObject = {
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
    }
  }
};

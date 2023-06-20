const Joi = require("joi");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const { log } = require("../../logger");
const logger = require("../../logger");
const utils = require("../../utils");

// update editorService data
module.exports = exports = {

  handler: async (req, res) => {
    let {id} = req.params;
    //check if abuse is already created
    const checkPlans = await global.models.GLOBAL.PRODUCT.findOne({
      _id: id,
    });
    if (!checkPlans) {
      let data4createResponseObject = {
        req: req,
        result: 1,
        message: messages.PLANS_NOT_FOUND,
        payload: {},
      };
      return res

        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));

    } else {
    try{
    //update editorservice data
    const updatePlans = await global.models.GLOBAL.PLANS.findByIdAndUpdate(
      req.params.id, 
      req.body , {new: true});
    if (updatePlans) {
      const data4createResponseObject = {
        req: req,
        result: 200,
        message: messages.PLANS_UPDATED,
        payload: { updatePlans },
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
      return;
    }
    }catch(err){
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
  }
  }
};


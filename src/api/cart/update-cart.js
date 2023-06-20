const Joi = require("joi");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const { log } = require("../../logger");
const logger = require("../../logger");
const utils = require("../../utils");
const product = require("../../routes/product");

// update editorService data
module.exports = exports = {

  handler: async (req, res) => {
    let {id} = req.params;
    //check if abuse is already created
    const checkCart = await global.models.GLOBAL.CART.findOne({
      _id: id,
    });

    if (!checkCart) {
      let data4createResponseObject = {
        req: req,
        result: 1,
        message: messages.CART_NOT_FOUND,
        payload: {},
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));

    } else {
    try{

    const updateCart = await global.models.GLOBAL.CART.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $push: {
          product: req.body.product,
        },
      },
      {
        new: true,
      }
    );

    let total = 0;
    
    for (let i = 0; i < updateCart.product.length; i++) {
      let findProduct = await global.models.GLOBAL.PRODUCT.findOne({
        _id: updateCart.product[i].pid,
      });
      if(findProduct){
        
        total = total +( findProduct.price * updateCart.product[i].quantity );
      }
    }

    const updateTotal = await global.models.GLOBAL.CART.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          total: total,
        },
      },
      {
        new: true,
      }
    ).populate({
      path: "product.pid",
      model: "product",
    })
    ;
     

    if (updateCart) {
      const data4createResponseObject = {
        req: req,
        result: 200,
        message: messages.CART_UPDATED,
        payload: { updateCart:updateTotal },
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


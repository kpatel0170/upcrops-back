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
    cid: Joi.string().required(),
    amount: Joi.number().required(),
    number: Joi.string().required(),
    expMonth: Joi.number().required(),
    expYear: Joi.number().required(),
    cvc: Joi.string().required(),
  }),
  handler: async (req, res) => {
    const { user } = req;
    const { uid, cid, number, expMonth, expYear, cvc } = req.body;
    try {
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

      //create token

      const token = await stripe.tokens.create({
        card: {
          number: number,
          exp_month: expMonth,
          exp_year: expYear,
          cvc: cvc,
        },
      });

      let findCart = await global.models.GLOBAL.CART.findOne({
        _id: cid,
      });

      //create customer
      const paymentIntent = await stripe.paymentIntents.create({
        amount: findCart.total * 100,
        currency: "usd",
        payment_method_types: ["card"],
        metadata: { integration_check: "accept_a_payment" },
        description: "Payment of Music, Album, Product or Service",
      });

      //check is payment is successfull

      const payment = await stripe.paymentIntents.retrieve(paymentIntent.id, {
        expand: ["payment_method"],
      });
      let paymentData = {
        uid: uid,
        cid: cid,
        amount: findCart.total,
        status: "completed",
        paymentId: paymentIntent.id,
      };


      const createPayment = await global.models.GLOBAL.PAYMENT.create(
        paymentData
      );

      let updateCartStatus = await global.models.GLOBAL.CART.findOneAndUpdate(
        {
          _id: cid,
        },
        {
          $set: {
            status: "completed",
          },
        },
        {
          new: true,
        }
      );

      if (createPayment) {
        let data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.PAYMENT_CREATED,
          payload: { createPayment },
        };
        return res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
      } else {
        let data4createResponseObject = {
          req: req,
          result: 1,
          message: messages.PAYMENT_NOT_CREATED,
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

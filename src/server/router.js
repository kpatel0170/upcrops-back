const enums = require("../../json/enums.json");
const messages = require("../../json/messages.json");

module.exports = (app, logger) => {
  // define all route imports here

  const adminRoute = require("../routes/admin/index");
  const roleRoute = require("../routes/role/index");
  const productRoute = require("../routes/product/index");

  const notificationRoute = require("../routes/notification/index");
  const cartRoute = require("../routes/cart/index");
  const paymentRoute = require("../routes/payment/index");
  const plansRoute = require("../routes/plans/index");

  // define all routes here

  app.use(["/api/v1/admin"], adminRoute);
  app.use(["/api/v1/role"], roleRoute);
  app.use(["/api/v1/product"], productRoute);
  app.use(["/api/v1/notification"], notificationRoute);
  app.use(["/api/v1/cart"], cartRoute);
  app.use(["/api/v1/payment"], paymentRoute);
  app.use(["/api/v1/plans"], plansRoute);

  const { createResponseObject } = require("../utils");

  /* Catch all */
  app.all("*", function (req, res) {
    res.status(enums.HTTP_CODES.BAD_REQUEST).json(
      createResponseObject({
        req: req,
        result: -1,
        message: "Sorry! The request could not be processed!",
        payload: {},
        logPayload: false
      })
    );
  });

  // Async error handler
  app.use((error, req, res, next) => {
    logger.error(
      `${req.originalUrl} - Error caught by error-handler (router.js): ${error.message}\n${error.stack}`
    );
    const data4responseObject = {
      req: req,
      result: -999,
      message: messages.GENERAL,
      payload: {},
      logPayload: false
    };

    return res
      .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(createResponseObject(data4responseObject));
  });
};

const express = require("express");
const router = express.Router();
const cartApi = require("../../api/cart");
const { validate } = require("../../middlewares");
const passport = require("passport");
const { profileUploadS3 } = require("../../s3FileUpload");

// Get Methods

router.get(
  "/getCart",
  passport.authenticate(["jwt"], { session: false }),
  cartApi.getCart.handler
);

router.post(
  "/addCart",
  passport.authenticate(["jwt"], { session: false }),
  cartApi.addCart.handler
);

router.put(
  "/updateCart/:id",
  passport.authenticate(["jwt"], { session: false }),
  cartApi.updateCart.handler
);

router.delete("/deleteCart", cartApi.deleteCart.handler);

module.exports = exports = router;

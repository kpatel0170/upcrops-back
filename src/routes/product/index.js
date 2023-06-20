const express = require("express");
const router = express.Router();
const productApi = require("../../api/product");
const { validate } = require("../../middlewares");
const passport = require("passport");
const { profileUploadS3 } = require('../../s3FileUpload');

// Get Methods

router.get(
  "/getProduct",
  passport.authenticate(["jwt"], { session: false }),
  productApi.getProduct.handler
);

router.post(
  "/addProduct",
  passport.authenticate(["jwt"], { session: false }),
  productApi.addProduct.handler
);

router.put(
  "/updateProduct/:id",
  passport.authenticate(["jwt"], { session: false }),
  productApi.updateProduct.handler
);

router.delete("/deleteProduct", productApi.deleteProduct.handler);

router.post(
  "/addImage/:id",
  passport.authenticate(["jwt"], { session: false }),
  profileUploadS3.fields([
    {
      name: "image",
      maxCount: 10,
    },
  ]),
  productApi.addImage.handler
);
router.delete("/deleteImage", productApi.deleteImage.handler);


module.exports = exports = router;
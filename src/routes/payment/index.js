const express = require("express");
const router = express.Router();
const paymentApi = require("../../api/payment");
const { validate } = require("../../middlewares");
const passport = require("passport");
const { profileUploadS3 } = require("../../s3FileUpload");

router.post("/addPayment", paymentApi.addPayment.handler);

module.exports = exports = router;

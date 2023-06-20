const express = require("express");
const router = express.Router();
const adminApi = require("../../api/admin");
const { validate } = require("../../middlewares");
const passport = require("passport");
const { profileUploadS3 } = require("../../s3FileUpload");

// Login
router.post(
  "/login",
  validate("body", adminApi.adminLogin.validation),
  adminApi.adminLogin.handler
);

// Signup
router.post(
  "/signup",
  validate("body", adminApi.adminSignup.validation),
  adminApi.adminSignup.handler
);

module.exports = exports = router;

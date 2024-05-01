const express = require("express");
const router = express.Router();
const notificationApi = require("../../api/notification");
const { validate } = require("../../middlewares");
const passport = require("passport");
const { profileUploadS3 } = require("../../s3FileUpload");

// Get Methods

router.get(
  "/getNotification",
  // passport.authenticate(["jwt"], { session: false }),
  notificationApi.getNotification.handler
);

router.put(
  "/updateNotification/:id",
  // passport.authenticate(["jwt"], { session: false }),
  notificationApi.updateNotification.handler
);

module.exports = exports = router;

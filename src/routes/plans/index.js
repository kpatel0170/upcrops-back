const express = require("express");
const router = express.Router();
const plansApi = require("../../api/plans");
const { validate } = require("../../middlewares");
const passport = require("passport");
const { profileUploadS3 } = require('../../s3FileUpload');

// Get Methods

router.get(
  "/getPlans", 
    plansApi.getPlans.handler
);

router.post(
  "/addPlans",
  plansApi.addPlans.handler
);

router.put(
  "/updatePlans/:id",
  plansApi.updatePlans.handler
);

router.delete("/deletePlans", plansApi.deletePlans.handler);

module.exports = exports = router;
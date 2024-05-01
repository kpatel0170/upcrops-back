const mongoose = require("mongoose");
const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const notificationSchema = new mongoose.Schema(
    {
      uid: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
      aid: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
      pid: { type: mongoose.Schema.Types.ObjectId, ref: "post" },
      eid: { type: mongoose.Schema.Types.ObjectId, ref: "event" },
      text: { type: String },
      upvote: { type: Number, default: 0, max: 1 },
      downvote: { type: Number, default: 0, max: 1 },
      comment: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      isSeeAll: { type: Boolean, default: false },
      message: { type: String }
    },
    {
      autoCreate: true,
      timestamps: true
    }
  );

  // return logsSchema;
  return connection.model("notification", notificationSchema, "notification");
};

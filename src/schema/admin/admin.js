const mongoose = require("mongoose");
const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const adminSchema = new mongoose.Schema(
    {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },
      country: { type: String, default: null },
      contact: { type: Number },
      password: { type: String },
      address: { type: String },
      pinCode: { type: Number },
      city: { type: String },
      state: { type: String },
      registrationDate: { type: Date, default: Date.now() },
      modificationData: { type: Date, default: Date.now() },
      role: { type: mongoose.Schema.Types.ObjectId },
      status: {
        name: {
          type: String,
          enum: [
            enums.USER_STATUS.ACTIVE,
            enums.USER_STATUS.BLOCKED,
            enums.USER_STATUS.DISABLED,
            enums.USER_STATUS.INACTIVE,
            enums.USER_STATUS.INVITED,
            enums.USER_STATUS.UNBLOCKED,
          ],
        },
        modificationDate: Date,
      },
    },
    {
      autoCreate: true,
    }
  );

  // return logsSchema;
  return connection.model("admin", adminSchema, "admin");
};

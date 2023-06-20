const mongoose = require("mongoose");
const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const paymentSchema = new mongoose.Schema(
    {
      uid: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
      cid: { type: mongoose.Schema.Types.ObjectId, ref: "cart" },
      amount : { type: Number },
      number : { type: String },
      expMonth : { type: Number },
      expYear : { type: Number },
      paymentId : { type: String },
      cvc : { type: String },
      status : { type: String },
    },
    {
      autoCreate: true,
      timestamps: true,
    }
  );

  // return logsSchema;
  return connection.model("payment", paymentSchema, "payment");
};

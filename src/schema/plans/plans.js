const mongoose = require("mongoose");
const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const paymentSchema = new mongoose.Schema(
    {
      uid: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
     isFeatured: { type: Boolean, default: false },
      name: { type: String },
      description: [
        {
          type: String,
        },
      ],
      price: { type: Number },
      durationType: { type: String },
    },
    {
      autoCreate: true,
      timestamps: true,
    }
  );

  // return logsSchema;
  return connection.model("payment", paymentSchema, "payment");
};

const mongoose = require("mongoose");
const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const cartSchema = new mongoose.Schema(
    {
      uid: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
      product :[
        {
          pid: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
          quantity : { type: Number }
        }
      ],
      total : { type: Number },
      status : { type: String },
    },
    {
      autoCreate: true,
      timestamps: true,
    }
  );

  // return logsSchema;
  return connection.model("cart", cartSchema, "cart");
};

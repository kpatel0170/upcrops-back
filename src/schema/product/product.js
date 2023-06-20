const mongoose = require("mongoose");
const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const productSchema = new mongoose.Schema(
    {
      uid: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
      name : { type: String },
      description : { type: String },
      price : { type: Number },
      spec : { type: String },
      image: [
        {
          media: String, 
        },
      ],
    },
    {
      autoCreate: true,
      timestamps: true,
    }
  );

  // return logsSchema;
  return connection.model("product", productSchema, "product");
};

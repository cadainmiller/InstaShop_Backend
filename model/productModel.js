const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const productSchema = new Schema(
  {
    name: {
      type: String,
      //required: true,
    },
    description: {
      type: String,
      //required: true,
    },
    product_image: {
      type: String,
    },
    productId: {
      type: String,
      //required: true,
    },
    shipping_details: {
      weight: {
        type: Number,
        default: 0,
      },

      width: {
        type: Number,
        default: 0,
      },
      height: {
        type: Number,
        default: 0,
      },
      depth: {
        type: Number,
        default: 0,
      },
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sale: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    sale_price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
productSchema.plugin(uniqueValidator, {
  message: "{PATH} Already in use",
});

const mongoose = require("mongoose");
var ObjectId = require("mongodb").ObjectID;
var uniqueValidator = require("mongoose-unique-validator");
const product = require("../model/productModel");

const Schema = mongoose.Schema;
const invoiceSchema = new Schema(
  {
    invoiceId: {
      type: String,
      required: true,
    },
    order: {
        orderId: {
          type: String,
          //required: true,
        },
        customer_info: {
          first_name: {
            type: String,
            //required: true,
          },
          last_name: {
            type: String,
            //required: true,
          },
          email: {
            type: String,
            //required: true,
          },
          phone_number: [
            {
              type: Number,
              //required: true,
            },
          ],
        },
        products: [
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
              type: String,
              default: "false",
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
        ],
        quantity: {
          type: Number,
        },
        total: {
          type: Number,
          // required: true,
        },
        tax: {
          type: Number,
          // required: true,
        },
        final_cost: {
          type: Number,
          // required: true,
        },
        shipping: {
          type: String,
          // required: true,
        },
        notes: {
          type: String,
          // required: true,
        },
        shipping_address: {
          street: {
            type: String,
          },
          street2: {
            type: String,
          },
          city: {
            type: String,
          },
          parish: {
            type: String,
          },
          zip: {
            type: String,
          },
        },
        order_invoice: {
          type: String,
        },
        order_receipt: {
          type: String,
        },
        status: {
          type: String,
          // required: true,
        },
    },
    notes: {
      type: String,
    },
    invoiceDoc: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
invoiceSchema.plugin(uniqueValidator, {
  message: "{PATH} Already in use",
});

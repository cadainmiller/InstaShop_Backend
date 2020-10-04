const generateId = require("../shared/createUniqueId");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");

exports.createOrder = async (req, res) => {

  const total_q = req.body.total * req.body.quantity;
  const gctTax = 0.165 * total_q;
  const totalcost = Math.round(gctTax * 100) / 100 + total_q;

  try {
    let order = new Order({
      orderId: "ORD-" + generateId(),
      status: req.body.status,
      customer_info: req.body.customer_info,
      quantity: req.body.quantity,
      products: req.body.products,
      notes: req.body.notes,
      total: req.body.total,
      tax: gctTax,
      final_cost: totalcost,
      shipping: req.body.shipping,
      shipping_address: req.body.shipping_address,
    });
    let createOrder = await order.save();
    res.status(200).json({
      msg: "New Orders created",
      data: createOrder,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.getOrders = async (req, res, next) => {
  const orders = await Order.find({}).exec((err, orders) => {
    if (err) {
      res.status(500).json(err);
    } else if (!orders) {
      res.status(404).json();
    }

    res.status(200).json({
      Orders: orders,
    });
  });
};

exports.getOrderById = async (req, res, next) => {
  try {
    const _id = req.params._id;
    const order = await Order.findById(_id).exec((err, order) => {
      if (err) {
        res.status(500).json(err);
      } else if (!order) {
        res.status(404).json("Product does not exist");
      }
      res.status(200).json(order);
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderByID = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findOne({ orderId: orderId }).exec(
      (err, order) => {
        if (err) {
          res.status(500).json(err);
        } else if (!order) {
          res.status(404).json("Order does not exist");
        }
        res.status(200).json(order);
      }
    );
  } catch (error) {
    next(error);
  }
};

// Story.
// findOne({ title: 'Casino Royale' }).
// populate('author').
// exec(function (err, story) {
//   if (err) return handleError(err);
//   console.log('The author is %s', story.author.name);
//   // prints "The author is Ian Fleming"
// });

// const products = await Product.findById(orders.products[0]).exec((err, product) =>{
//   if (err) {
//     res.status(500).json(err);
//   } else if (!orders) {
//     res.status(404).json();
//   }
//   res.status(200).json({
//   Orders: orders,
//   Product: product
// });

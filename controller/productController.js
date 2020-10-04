const Product = require("../model/productModel");
const generateId = require("../shared/createUniqueId");
const e = require("express");
const multer = require("multer");
const pdfMake = require("../pdfmake/pdfmake");
const vfsFonts = require("../pdfmake/vfs_fonts");


pdfMake.vfs = vfsFonts.pdfMake.vfs;

const product_image = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|JPG|PNG|JPEG|jpeg)$/))
      return cb(new Error("This is not a correct format of the file"));
    cb(undefined, true);
  },
});

exports.createPDF = async (req, res) => {
  var documentDefinition = {
    content: [`Hello`, "Nice to meet you!"],
  };

  const pdfDoc = pdfMake.createPdf(documentDefinition);
  pdfDoc.getBase64((data) => {
    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment;filename="filename.pdf"',
    });

    const download = Buffer.from(data.toString("utf-8"), "base64");
    res.end(download);
  });
};

exports.addNewProduct = async (req, res) => {

  function squared(num) {
    if (num == "true") {
      return req.body.sale_price;
    } else {
      return 0;
    }
  }

  try {
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      product_image: req.body.product_image,
      productId: "PRO-" + generateId(),
      shipping_details: req.body.shipping_details,
      quantity: req.body.quantity,
      sale: req.body.sale,
      sale_price: squared(req.body.sale),
      price: req.body.price,
    });
    let createProduct = await product.save();
    res.status(200).json({
      msg: "New product created",
      data: createProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

// exports.getProduct = async (req, res, next) => {
//   const product = await Product.find({});
//   res.status(200).json({
//     Products: product,
//   });
//   res.json({
//     Products: product,
//   });
// };

exports.getProduct = async (req, res, next) => {
  const product = await Product.find({}).exec((err, product) => {
    if (err) {
      res.status(500).json(err);
    } else if (!product) {
      res.status(404).json();
    }
    res.status(200).json(product);
  });
};

exports.getProductById = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId).exec((err, product) => {
      if (err) {
        res.status(500).json(err);
      } else if (!product) {
        res.status(404).json("Product does not exist");
      }
      res.status(200).json(product);
    });
  } catch (error) {
    next(error);
  }
  
};

exports.getProductByPD = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findOne({ productId: productId }).exec(
      (err, product) => {
        if (err) {
          res.status(500).json(err);
        } else if (!product) {
          res.status(404).json("Product does not exist");
        }
        res.status(200).json(product);
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.updateProductById = async (req, res, next) => {
  try {
    const update = req.body;
    const productId = req.params.productId;
    await Product.findByIdAndUpdate(productId, update);
    const product = await Product.findById(productId).exec((err, product) => {
      if (err) {
        res.status(500).json(err);
      } else if (!product) {
        res.status(404).json();
      }
      res.status(200).json({
        data: product,
        message: "Product has been updated",
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    await Product.findByIdAndDelete(productId);
    res.status(200).json({
      message: "Product has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

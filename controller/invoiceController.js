const Invoice = require("../model/invoiceModel");
const generateId = require("../shared/createUniqueId");
const fetch = require("node-fetch");
const url = process.env.API_URL;
const orderController = require("../controller/orderController");
const pdfMake = require("../pdfmake/pdfmake");
const vfsFonts = require("../pdfmake/vfs_fonts");
const invoiceCreateDoc = require("../docs/invoiceCreateDoc");
const events = require("events");
const Email = require("../config/email");
require("dotenv").config();
const today = new Date();

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

pdfMake.vfs = vfsFonts.pdfMake.vfs;
var eventEmitter = new events.EventEmitter();

var invoicepdf = "";
var productData;

function functionData(data) {
  if (data) {
    invoicepdf = data;
  }
}

function calDueDate() {
  dueDate = today.getDate() + 7;
  dueYear = today.getFullYear();
  dueMonth = monthNames[today.getMonth()];

  return `${dueMonth} ${dueDate}, ${dueYear}`;
}

function createDoc(info) {
  var pdfsomething = pdfMake.createPdf(info);
  pdfsomething.getDataUrl(functionData);
}
async function fetchOrderId(id) {
  const response = await fetch(`${url}order/${id}`);
  const json = await response.json();
  return json;
}

exports.createInvoice = async (req, res) => {
  try {
    const invoiceId = "INV-" + generateId();
    const notes = req.body.notes;
    const orderId = req.body.orderId;
    productData = await fetchOrderId(orderId);

    const productDataJson = productData;

    invoicepdf = await createDoc(
      invoiceCreateDoc.create(
        "INVOICE",
        "This is the subject",
        invoiceId,
        productDataJson,
        notes
      )
    );

    productData = await fetchOrderId(orderId);

    let invoice = new Invoice({
      invoiceId: invoiceId,
      order: productData,
      notes: notes,
      invoiceDoc: invoicepdf,
    });

    let createInvoice = await invoice.save();

    res.status(200).json({
      msg: "New Invoice created",
      data: createInvoice,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.getInvoice = async (req, res, next) => {
  const invoice = await Invoice.find({}).exec((err, invoice) => {
    if (err) {
      res.status(500).json(err);
    } else if (!invoice) {
      res.status(404).json();
    }
    res.status(200).json({
      Invoice: invoice,
    });
  });
};

exports.getInvoiceById = async (req, res, next) => {
  try {
    const invoiceId = req.params.invoiceId;
    const invoice = await Invoice.findOne({ invoiceId: invoiceId }).exec(
      (err, invoice) => {
        if (err) {
          res.status(500).json(err);
        } else if (!invoice) {
          res.status(404).json("Invoice does not exist");
        }
        res.status(200).json({ invoice });
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.getInvoiceByOrderId = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const invoice = await Invoice.findOne({ "order.orderId": orderId }).exec(
      (err, invoice) => {
        if (err) {
          res.status(500).json(err);
        } else if (!invoice) {
          res.status(404).json("Invoice does not exist");
        }
        res.status(200).json({ invoice });
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.emailInvoiceByOrderId = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;z
    const invoice = await Invoice.findOne({
      "order.orderId": orderId,
    }).exec((err, invoice) => {
      if (err) {
        res.status(500).json(err);
      } else if (!invoice) {
        res.status(404).json("Invoice does not exist");
      }

      sendData = invoice.invoiceDoc.toString();
      customerEmail = invoice.order.customer_info.email.toString();
      id = invoice.invoiceId.toString();

      const dueDate = calDueDate();

      email = `Hi ${invoice.order.customer_info.first_name},<br><br>
        I hope you’re well!<br> Please see attached invoice below.<br>
        This is due on ${dueDate}.<br><br>
        Kind regards,<br>
        Business Name`;

      const attachment = [
        {
          filename: `INVOICE-${id}.pdf`,
          content: sendData.split("base64,")[1],
          contentType: "application/pdf",
          encoding: "base64",
        },
      ];

      Email.SendEmail(
        [`imwildcode@gmail.com`],
        `COMPANY NAME (${id}) `,
        email,
        attachment
      );
      res.status(200).json(`${id} Was Sent to ${customerEmail}`);
    });
  } catch (error) {
    next(error);
  }
};

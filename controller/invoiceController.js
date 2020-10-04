const Invoice = require("../model/invoiceModel");
const generateId = require("../shared/createUniqueId");
const fetch = require("node-fetch");
const url = "http://localhost:4000/";
const orderController = require("../controller/orderController");
const pdfMake = require("../pdfmake/pdfmake");
const vfsFonts = require("../pdfmake/vfs_fonts");
const invoiceCreateDoc = require("../docs/invoiceCreateDoc");
const events = require("events");
const Email = require("../config/email");
require("dotenv").config();

pdfMake.vfs = vfsFonts.pdfMake.vfs;
var eventEmitter = new events.EventEmitter();

var invoicepdf = "";
var productData;

function functionData(data) {
  if (data) {
    invoicepdf = data;
  }
}

function pdfHandler(data) {
  invoicepdf = data;
}

function createDoc(info) {
  var pdfsomething = pdfMake.createPdf(info);
  pdfsomething.getDataUrl(functionData);
}

const getData = async (url) => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    productData = json;
  } catch (error) {}
};

//createDoc(invoiceCreateDoc.create("INVOICE", "This is the subject"));

exports.createInvoice = async (req, res) => {
  try {

   const invoiceId = "INV-" + generateId();
   const notes = req.body.notes;
    invoicepdf = await createDoc(
      invoiceCreateDoc.create("INVOICE", "This is the subject", invoiceId, notes)
    );

    const orderId = req.body.orderId;
    const response = await fetch(`${url}order/${orderId}`);
    const json = await response.json();

    productData = json;

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
      request: {
        type: "GET",
        url: "http://localhost:4000/invoice/" + createInvoice.invoiceId,
      },
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

exports.emailInvoiceById = async (req, res, next) => {
  try {
    const invoiceId = req.params.invoiceId;
    const invoice = await Invoice.findOne({ invoiceId: invoiceId }).exec(
      (err, invoice) => {
        if (err) {
          res.status(500).json(err);
        } else if (!invoice) {
          res.status(404).json("Invoice does not exist");
        }

        sendData = invoice.invoiceDoc.toString();
        productid = invoice.order.toString();
        customerEmail = invoice.order.customer_info.email.toString();
        id = invoice.invoiceId.toString();
        const [head, data] = sendData.split(",");

        const attachment = [
          {
            filename: `INVOICE-${id}.pdf`,
            content: sendData.split("base64,")[1],
            contentType: "application/pdf",
            encoding: "base64",
          },
        ]

        Email.SendEmail(
          customerEmail,
          "Welocme to Company ",
          productid,
          attachment   
        );
        //console.log(productData);
        //getData(url);
        res.status(200).json({ Invoice: invoice });
      }
    );
  } catch (error) {
    next(error);
  }
};

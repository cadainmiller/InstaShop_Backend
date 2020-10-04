const e = require("express");

exports.uploadFile = async (req, res) => {
  const uniqueId = (length = 8) => {
    return parseInt(
      Math.ceil(Math.random() * Date.now())
        .toPrecision(length)
        .toString()
        .replace(".", "")
    );
  };
};

exports.uploadProductImage = async (req, res) => {
  try {
    res.send(req.file);
  } catch (err) {
    res.send(400);
  }
};

const express = require("express");
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const app = express();

const userRoutes = require("./routes/userRoute"); //bring in our user routes
const productRoutes = require("./routes/productRoute"); //bring in our product routes
const invoiceRoutes = require("./routes/invoiceRoute"); //bring in our invoice routes
const orderRoutes = require("./routes/orderRoute"); //bring in our order routes
const uploadRoutes = require("./routes/uploadRoutes"); //bring in our upload routes
swaggerDocument = require("./swagger.json");

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
 // res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  next();
});
app.use("/public", express.static("public"));
app.use(bodyParser.json());
app.use(morgan("dev"));
require("./config/db")(app);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api", (req, res) => {
  res.send("Working Ya");
});

app.get("/", (req, res) => {
  res.send("API LIVE");
});

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/upload", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server Live ${process.env.API_URL}:${PORT}`);
});

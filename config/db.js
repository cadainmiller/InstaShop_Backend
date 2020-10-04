const mongoose = require("mongoose");
module.exports = function (app) {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then((connrction) => console.log("Application is connected to database"))
    .catch((err) => console.log(err));
  mongoose.Promise = global.Promise;
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("SIGHUP", cleanup);
  if (app) {
    app.set("mongoose", mongoose);
  }
};
function cleanup() {
  mongoose.connection.close(function () {
    process.exit(0);
  });
}

const dotenv = require("dotenv").config();
const express = require("express");
const router = express.Router();
const routes = require("./routes");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const getSwaggerJSDocOpts = require("./docs/options.js");
const mongoose = require("mongoose");
const cors = require("cors");
const mongoDB = process.env.MONGODB_URI || "mongodb://local:mota123@ds157475.mlab.com:57475/heroku_f5xnh953";
const fileUpload = require("express-fileupload");
const auth = require("./auth");
const fs = require("fs");
const https = require("https");

mongoose.connect(
  mongoDB,
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
const swaggerJSDocOpts = getSwaggerJSDocOpts(process.env.NODE_ENV);

const app = express();
const swaggerSpec = swaggerJSDoc(swaggerJSDocOpts);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(fileUpload());
app.use(auth.init());
app.use("/storage", express.static(__dirname + "/storage"));
app.use("/api", routes);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //console.log("ERR", err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json({});
});

const port = process.env.PORT || 3000;
const server = app.listen(port);

console.info(`App is running on  http://localhost:${port}`);

module.exports = server;

"use strict";

const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const errorHandler = require("./helpers/errorHandler");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true, strict: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Express API Powered by AWS Lambda!" });
});

app.use("/api/v1", routes);
app.use(errorHandler.notFound);
app.use(errorHandler.internalServerError);

module.exports.app = serverless(app);

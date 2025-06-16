const cors = require("cors");
const db = require("./db/connection");
const apiRouter = require("./routes/router");

const express = require("express");
const {
  sqlErrorHandler,
  customErrorHandler,
  internalServerError,
} = require("./controllers/error.controller");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

// app.use((err, req, res, next) => {

//     res.status(500).send({ msg: "Internal Server Error" });
//   });

app.all("/*splat", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(sqlErrorHandler);
app.use(customErrorHandler);
app.use(internalServerError);

module.exports = app;

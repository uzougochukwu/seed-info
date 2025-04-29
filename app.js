const db = require("./db/connection")
const { displayAPI, getTopics } = require ("./controllers/nc_news.controllers")
const express = require("express")
const app = express();
// const {

// } = require("./controllers")

app.use(express.json())

app.get("/api", displayAPI)

app.get("/api/topics", getTopics)

app.use((err, req, res, next) => {
    console.log(err);
    res.status(404).send({ msg: "Internal Server Error" });
  });


module.exports = app


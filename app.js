const db = require("./db/connection")
const { displayAPI, getTopics, getArticleById } = require ("./controllers/nc_news.controllers")
const express = require("express")
const app = express();


app.use(express.json())

app.get("/api", displayAPI)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.use((err, req, res, next) => {

    res.status(500).send({ msg: "Internal Server Error" });
  });

module.exports = app


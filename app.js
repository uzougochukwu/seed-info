const db = require("./db/connection")
const { displayAPI } = require ("./controllers/nc_news.controllers")
const express = require("express")
const app = express();

app.use(express.json())

app.get("/api", displayAPI)

module.exports = app
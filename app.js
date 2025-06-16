const cors = require('cors')
const db = require("./db/connection")
const apiRouter = require("./routes/router")

const express = require("express")


const app = express();

app.use(cors())
app.use(express.json())

app.use("/api", apiRouter)


app.use((err, req, res, next) => {

    res.status(500).send({ msg: "Internal Server Error" });
  });

module.exports = app


const { getTopics } = require("../controllers/nc_news.controllers");

const topicsRouter = require("express").Router();

topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;

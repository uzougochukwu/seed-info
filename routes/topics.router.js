const { getTopics, postTopic } = require("../controllers/nc_news.controllers");

const topicsRouter = require("express").Router();

topicsRouter.route("/").get(getTopics).post(postTopic);

module.exports = topicsRouter;

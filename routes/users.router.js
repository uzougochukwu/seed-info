const { getUsers } = require("../controllers/nc_news.controllers");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers);

module.exports = usersRouter;

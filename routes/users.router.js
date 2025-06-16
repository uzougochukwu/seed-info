const {
  getUsers,
  getUserByUsername,
} = require("../controllers/nc_news.controllers");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers);

usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;

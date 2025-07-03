const {
  removeComment,
  modifyVotesForComment,
} = require("../controllers/nc_news.controllers");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id")
// .delete(removeComment);
// .patch(modifyVotesForComment)

module.exports = commentsRouter;

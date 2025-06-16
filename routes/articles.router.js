const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentForArticle,
  modifyVotesForArticle,
} = require("../controllers/nc_news.controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(modifyVotesForArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentForArticle);

module.exports = articlesRouter;

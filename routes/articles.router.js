const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentForArticle,
  modifyVotesForArticle,
  postArticle,
  removeArticle,
} = require("../controllers/nc_news.controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(modifyVotesForArticle)
  // .delete(removeArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentForArticle);

module.exports = articlesRouter;

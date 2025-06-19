const endpointsArray = require("../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  addCommentForArticle,
  changeVotesForArticle,
  deleteComment,
  selectUsers,
  selectUserByUsername,
  changeVotesForComment,
  addArticle,
} = require("../models/nc_news.models");
const { commentData } = require("../db/data/test-data");

exports.displayAPI = (request, response, next) => {
  response.status(200).send({ endpoints: endpointsArray });
};

exports.getTopics = (request, response, next) => {
  selectTopics().then((topicsData) => {
    response.status(200).send({ topicsData });
  });
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;

  return selectArticleById(article_id).then((article) => {
    response.status(200).send({ article });
  });
};

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;

  return selectCommentsByArticleId(article_id).then((comment) => {
    response.status(200).send({ comment });
  });
};

exports.postCommentForArticle = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;
  addCommentForArticle(article_id, username, body).then((newComment) => {
    response.status(201).send({ newComment });
  });
};

exports.modifyVotesForArticle = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes: newVote } = request.body;
  changeVotesForArticle(article_id, newVote).then((article) => {
    response.status(201).send({ article });
  });
};

exports.removeComment = (request, response, next) => {
  const { comment_id } = request.params;

  deleteComment(comment_id).then(() => {
    response.status(204).send();
  });
};

exports.getUsers = (request, response, next) => {
  return selectUsers().then((users) => {
    response.status(200).send(users);
  });
};

exports.getArticles = (request, response, next) => {
  const { sort_by, order_by, topic, limit, p } = request.query;

  return selectArticles(sort_by, order_by, topic, limit, p).then((articles) => {
    response.status(200).send(articles);
  });
};

exports.getUserByUsername = (request, response, next) => {
  const { username } = request.params;

  return selectUserByUsername(username).then((user) => {
    response.status(200).send(user);
  });
};

exports.modifyVotesForComment = (request, response, next) => {
  const { comment_id } = request.params;
  const { inc_votes: newVote } = request.body;

  return changeVotesForComment(comment_id, newVote).then((comment) => {
    response.status(201).send({ comment });
  });
};

exports.postArticle = (request, response, next) => {
  const { author, title, body, topic, article_img_url } = request.body;

  return addArticle(author, title, body, topic, article_img_url).then(
    (article) => {
      response.status(201).send({ article });
    }
  );
};

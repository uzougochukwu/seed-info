const db = require("./db/connection")
const { displayAPI,
        getTopics,
        getArticleById,
        getArticles, 
        getCommentsByArticleId,
        postCommentForArticle,
        modifyVotesForArticle,
        removeComment,
        getUsers        
      } 
        = require ("./controllers/nc_news.controllers")
const express = require("express")
const app = express();


app.use(express.json())

app.get("/api", displayAPI)

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArticles)


app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentForArticle)

app.patch("/api/articles/:article_id", modifyVotesForArticle)

app.delete("/api/comments/:comment_id", removeComment)

app.get("/api/users", getUsers)


app.use((err, req, res, next) => {

    res.status(500).send({ msg: "Internal Server Error" });
  });

module.exports = app


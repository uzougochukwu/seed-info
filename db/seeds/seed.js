const db = require("../connection.js")
const format = require("pg-format")
const { convertTimestampToDate, createArticlesLookupObj } = require('./utils')

//console.log(require('./utils'))
// just run converTimestampToDate without the map function, pass in the table name as parameter

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`drop table if exists comments`)
   .then(() => {
    return db.query(`drop table if exists articles`)
   })
   .then (() => {
    return db.query(`drop table if exists users`)
   })
   .then(() => {
    return db.query(`drop table if exists topics`)
   })
   .then(() => {
    return db.query(`CREATE TABLE topics (
    slug VARCHAR(200) PRIMARY KEY,
    description VARCHAR(200),
    img_url VARCHAR(1000)
)`)
   })
   .then(() => {
    return db.query(
    `CREATE TABLE users (
    username VARCHAR(200) PRIMARY KEY,
    name VARCHAR(200),
    avatar_url VARCHAR(1000)
)`)
   })
   .then(() => {
    return db.query(
      `CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    topic VARCHAR(200) References topics(slug),
    author VARCHAR(200) References users(username),
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000)
)`
    )
   })
   .then(() => {
    return db.query(
      `CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    article_id INT References articles(article_id),
    body TEXT,
    votes INT DEFAULT 0,
    author VARCHAR(200) References Users(username),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`
    )
   })
   .then(() => {
    //transform array of objects into nested arrays
    const formattedTopics = topicData.map((topic) => {
      return [topic.slug, topic.description, topic.img_url]
    })

    // now use pg format to insert our query
    const insertTopicQuery = format (
      `INSERT INTO topics
      (slug, description, img_url)
      VALUES
      %L
      RETURNING *;`,
      formattedTopics
    )
    return db.query(insertTopicQuery)
   })
   .then(() => {
    const formattedUsers = userData.map((user) => {
      return [user.username, user.name, user.avatar_url]
    })

    const insertUserQuery = format (
      `INSERT INTO users
      (username, name, avatar_url)
      VALUES
      %L
      RETURNING *;`,
      formattedUsers
    )
    return db.query(insertUserQuery)
   })
   .then(() => {
    
    const formattedArticles = articleData.map((article) => {
      const finalArticle = convertTimestampToDate(article)
      
      return [ 
        finalArticle.title, 
        finalArticle.topic, 
        finalArticle.author, 
        finalArticle.body, 
        finalArticle.created_at, 
        finalArticle.votes, 
        finalArticle.article_img_url]
    })

    const insertArticleQuery = format (
      `INSERT INTO articles
      ( title, topic, author, body, created_at, votes, article_img_url)
      VALUES
      %L
      RETURNING *;`,
      formattedArticles
    )
    return db.query(insertArticleQuery)

   })
   .then((result) => {
    //console.log(result.rows)
    const articlesLookup = createArticlesLookupObj(result.rows)
    //console.log(articlesLookup)

    const formattedComments = commentData.map((comment) => {
      
      const finalComment = convertTimestampToDate(comment);
      
      return [
        articlesLookup[finalComment.article_title],
        finalComment.body,
        finalComment.votes,
        finalComment.author,
        finalComment.created_at
      ];
    });
    //console.log(formattedComments)

    const insertCommentQuery = format (
      `INSERT INTO comments
      ( article_id, body, votes, author, created_at)
      VALUES
      %L
      RETURNING *;`,
      formattedComments
    )
    return db.query(insertCommentQuery)
   })
   
};
module.exports = seed;

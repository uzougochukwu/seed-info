const db = require("../db/connection")

exports.selectTopics = () => {
 return db.query("SELECT * FROM topics;")
 .then(( { rows }) => {
    return rows;
 })
}

exports.selectArticleById = (article_id) => {
 
    return db
   .query(`select * from articles where article_id = $1; `, [article_id])
   .then((result) => {

      return result.rows[0]
   })

}

exports.selectArticles = () => {
   return db.query(`select first.author, first.title, first.article_id, 
      first.topic, first.created_at, first.votes, first.article_img_url,
       count(second.comment_id) from articles as first 
       left join comments as second on second.article_id = first.article_id 
       group by first.author, first.title, first.article_id, first.topic, 
       first.created_at, first.votes, first.article_img_url 
       order by first.created_at desc;`)
.then(( { rows }) => {
   return rows;   
})
}


exports.selectCommentsByArticleId = (article_id) => {
   return db
   .query(`select comment_id, article_id, body, votes, author,
       created_at from comments 
       where article_id = $1
       order by created_at desc; `, [article_id])
       .then(( result ) => {
         return result;
       })
}

exports.addCommentForArticle = (article_id, username, body) => {
   
   return db
   .query(`insert into comments (article_id, author, body)
      values
      ($1, $2, $3) returning *;`,
   [article_id, username, body]).then((result) => {
      return result.rows[0]


   })
}

exports.changeVotesForArticle = (article_id, newVote ) => {

   return db
   .query(`update articles 
      set votes = greatest(votes + $1, 0)
      where article_id = $2
      returning *;`,
   [newVote, article_id]).then((result) => {
      return result.rows[0]
   })
}

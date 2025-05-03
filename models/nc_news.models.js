const db = require("../db/connection")

exports.selectTopics = () => {
 return db.query("SELECT * FROM topics;")
 .then(( { rows }) => {
    return rows;
 })
}

exports.selectArticleById = (article_id) => {
 
    return db
   .query(`select * from articles where article_id = $1 `, [article_id])
   .then((result) => {

      return result.rows[0]
   })

}
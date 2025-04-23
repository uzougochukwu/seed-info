const db = require("../../db/connection");

// build function convertTimestampToDate

// function convertTimestampToDate(table) {

//   const seed = ({table}) => {
//     return db.query(`UPDATE articles
//       SET created_at = TO_TIMESTAMP(created_at);
//       UPDATE comments
//       SET created_at = TO_TIMESTAMP(created_at);`)
//   }

// }

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createArticlesLookupObj = (articleData) => {
  if (articleData.length === 0) {
  return {}    
  }
const lookupObj = {}
articleData.forEach((article) => {
  lookupObj[article.title] = article.article_id
})

return lookupObj
}



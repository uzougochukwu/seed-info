const db = require("../db/connection")

exports.selectTopics = () => {
 return db.query("SELECT * FROM topics ;")
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

// exports.selectArticles = () => {
//    return db.query(`select first.author, first.title, first.article_id, 
//       first.topic, first.created_at, first.votes, first.article_img_url,
//        count(second.comment_id) from articles as first 
//        left join comments as second on second.article_id = first.article_id 
//        group by first.author, first.title, first.article_id, first.topic, 
//        first.created_at, first.votes, first.article_img_url 
//        order by first.created_at desc;`)
// .then(( { rows }) => {
//    return rows;   
// })
// }

// comment out selectArticles, create a query str and add to it, depending on
// the values in the first and second parameters (and whether or not they exist)
// use greenlist


// changed from selectArticlesSort
exports.selectArticles = (sort_by) => {

let queryStr = `select first.author, first.article_id, 
   first.topic, first.created_at, first.votes, first.article_img_url,
    count(second.comment_id) as count from articles as first 
    left join comments as second on second.article_id = first.article_id 
    group by first.author, first.title, first.article_id, first.topic, 
    first.created_at, first.votes, first.article_img_url `

   //  const sort_by = request.query.sort_by
 
let queryArgs = []

const promiseArray = []

const validSortQueries = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "count"]

if(sort_by && validSortQueries.includes(sort_by)) {
   queryStr += ` order by first.${sort_by} desc ;`
}

promiseArray.unshift(db.query(queryStr, queryArgs))

return Promise.all(promiseArray).then((results) => {
   const queryPromise = results[0]

   // console.log(queryPromise.rows)

   return queryPromise.rows
})




// used to be includes(sort_by, order)

//    if (!allowedInputs.includes(sort_by)) {
// return Promise.reject({ status: 404, msg: "Invalid Input" })
//    }

// queryValues.push(sort_by)
// // queryValues.push(order)

// selectArticlesQueryStr += ` order by ${sort_by} ;`
 
// // selectArticlesQueryStr += ` $2 ;`

// //must add the descending afterwards

//    return db.query(`${selectArticlesQueryStr}`, [sort_by])
// .then(( { rows }) => {
//    return rows;   
// })

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

exports.deleteComment = (comment_id) => {
   return db
   .query(`delete from comments
      where comment_id = $1
      returning *;`, [comment_id])
}

exports.selectUsers = () => {
   return db
   .query(`select * from users;`)
}
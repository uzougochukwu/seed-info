const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics ;").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `select count(second.comment_id), first.author, first.title, first.article_id, first.topic, first.created_at, first.votes, first.article_img_url, first.body
  from articles first
  left join comments second
  on first.article_id = second.article_id
  where first.article_id = $1
  group by first.author, first.title, first.article_id, first.topic, first.created_at, first.votes, first.article_img_url, first.body;
`,
      [article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.selectArticles = (sort_by, order_by, topic, limit, p) => {
  let queryStr = `select first.author, first.title, first.article_id, 
   first.topic, first.created_at, first.votes, first.article_img_url,
    count(second.comment_id) as count from articles as first 
    left join comments as second on second.article_id = first.article_id 
    group by first.author, first.title, first.article_id, first.topic, 
    first.created_at, first.votes, first.article_img_url `;

  let queryArgs = [];

  const promiseArray = [];

  const validSortQueries = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "count",
  ];

  const validOrderQueries = ["asc", "desc"];

  const validTopicQueries = ["mitch", "cats"];

  if (sort_by && validSortQueries.includes(sort_by)) {
    queryStr += ` order by first.${sort_by} `;
  }

  if (order_by && validOrderQueries.includes(order_by)) {
    queryStr += `${order_by} `;
  }

  if (topic && validTopicQueries.includes(topic)) {
    queryStr = `select first.author, first.title, first.article_id, 
   first.topic, first.created_at, first.votes, first.article_img_url,
    count(second.comment_id) as count from articles as first 
    left join comments as second on second.article_id = first.article_id
    where first.topic = '${topic}' group by first.author, first.title, first.article_id, first.topic, 
    first.created_at, first.votes, first.article_img_url `;
  }

  let finalOffset = limit * p;

  // if (limit !== "" && p !== "") {
  if (typeof limit !== "undefined" && typeof p !== "undefined") {
    queryStr += `limit ${limit} offset ${finalOffset} ;`;
  } else {
    queryStr += `limit 10 offset 0;`;
  }

  promiseArray.unshift(db.query(queryStr, queryArgs));

  return Promise.all(promiseArray).then((results) => {
    const queryPromise = results[0];

    return queryPromise.rows;
  });
};

exports.selectCommentsByArticleId = (article_id, limit, p) => {
  const promiseArray = [];

  let queryStr = `select comment_id, article_id, body, votes, author,
       created_at from comments 
       where article_id = ${article_id}
       order by created_at desc `;

  let finalOffset = limit * p;

  // if (limit !== "" && p !== "") {
  if (typeof limit !== "undefined" && typeof p !== "undefined") {
    queryStr += `limit ${limit} offset ${finalOffset} ;`;
  } else {
    queryStr += `limit 10 offset 0;`;
  }

  promiseArray.unshift(db.query(queryStr));

  return Promise.all(promiseArray).then((results) => {
    const queryPromise = results[0];

    return queryPromise.rows;
  });
};

exports.addCommentForArticle = (article_id, username, body) => {
  return db
    .query(
      `insert into comments (article_id, author, body)
      values
      ($1, $2, $3) returning *;`,
      [article_id, username, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.changeVotesForArticle = (article_id, newVote) => {
  return db
    .query(
      `update articles 
      set votes = greatest(votes + $2, 0)
      where article_id = $1
      returning *;`,
      [article_id, newVote]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.deleteComment = (comment_id) => {
  return db.query(
    `delete from comments
      where comment_id = $1
      returning *;`,
    [comment_id]
  );
};

exports.selectUsers = () => {
  return db.query(`select * from users;`).then((result) => {
    return result;
  });
};

exports.selectUserByUsername = (username) => {
  return db
    .query(
      `select username, name, avatar_url from users where username = $1;`,
      [username]
    )
    .then((result) => {
      return result;
    });
};

exports.changeVotesForComment = (comment_id, newVote) => {
  return db
    .query(
      `update comments
    set votes = votes + $2
    where comment_id = $1
    returning *;`,
      [comment_id, newVote]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.addArticle = (author, title, body, topic, article_img_url) => {
  return db
    .query(
      `insert into articles (author, title, body, topic, article_img_url)
    values
    ($1, $2, $3, $4, $5) returning *;`,
      [author, title, body, topic, article_img_url]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.addTopic = (slug, description) => {
  return db
    .query(
      `insert into topics (slug, description)
    values
    ($1, $2) returning *;`,
      [slug, description]
    )
    .then((result) => {
      return result;
    });
};

exports.deleteArticle = (article_id) => {
  return db.query(
    `delete from comments
    where article_id = $1
    returning *;`, [article_id])
    .then(
    db.query(
    `delete from articles
    where article_id = $1
    returning *;`,
    [article_id]
  ));
};

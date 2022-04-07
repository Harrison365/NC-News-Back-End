const db = require("./db/connection.js");

//Get all topics
exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

//Get article by ID (with comment count)
exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT articles.*, 
    COUNT(comments.article_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1 
    GROUP BY articles.article_id;
    `,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      } else return result.rows[0];
    });
};

//Patch to change vote on specifed article
exports.voteAdder = (article_id, body) => {
  let article_idNumber = parseInt(article_id);
  if (typeof article_idNumber !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }

  if (!body.inc_votes || Object.keys(body).length !== 1) {
    return Promise.reject({ status: 400, msg: "invalid patch request" });
  }

  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE  article_id = $2 RETURNING *;",
      [body.inc_votes, article_idNumber]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      } else {
        return result.rows[0];
      }
    });
};

//Get array of usernames from users db
exports.fetchUsers = () => {
  return db.query("SELECT username FROM users;").then((result) => {
    return result.rows;
  });
};

///Get all articles with sort_by, order and by topic queries
exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  const possibleSortBys = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];
  const possibleOrderBys = ["desc", "asc"];
  const topicQueries = [];
  let queryStr = `SELECT articles.*, CAST(COUNT(comments.article_id) as INT) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;
  if (topic) {
    topicQueries.push(topic);
    queryStr += ` WHERE topic=$1`;
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
  if (!possibleSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }
  if (!possibleOrderBys.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid input (order)" });
  }
  return db.query(queryStr, topicQueries).then((results) => {
    return results.rows;
  });
};

//Get comments by article ID
exports.fetchCommentsById = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE  article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

//Post comment object to article when given ID. Responds with the posted comment
exports.addComment = (article_id, body) => {
  let article_idNumber = parseInt(article_id);
  if (typeof article_idNumber !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }
  if (!body.username || !body.body || Object.keys(body).length !== 2) {
    return Promise.reject({ status: 400, msg: "invalid post request" });
  }
  return db
    .query(
      ` 
  INSERT INTO comments
  (author, body, article_id)
  VALUES 
  ($1, $2, $3)
  RETURNING *;`,
      [body.username, body.body, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

//Delete comment by comment id
exports.fetchAndDeleteCommentByCommentId = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id]);
};

//Check article exists
exports.checkArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      }
    });
};

//Check comment exists
exports.checkCommentExists = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1;", [comment_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment ID not found" });
      }
    });
};

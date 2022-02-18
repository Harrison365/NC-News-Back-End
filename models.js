const db = require("./db/connection.js");

//vvv Get all topics///////////////////////////////////////////////////////
exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

//vvv Get article by ID (+comment count)////////////////////////////////////////////////////
exports.fetchArticleById = (article_id) => {
  return (
    db
      // .query(`SELECT * FROM articles WHERE  article_id = $1;`, [article_id])
      //^^^ query for just article stuff
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
      //^^^ query for article stuff THEN assind a row which is a count of comments that have the same article ID,
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "ID not found" });
        } else return result.rows[0];
      })
  );
};

/////////////////vvv Patch to change vote on specific article//////////////
exports.voteAdder = (article_id, body) => {
  //vvv if article id is not a number, reject. vvv
  let article_idNumber = parseInt(article_id);
  if (typeof article_idNumber !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }
  // vvv if votes is not provided or if there isnt exactly 1 inc_votes key passed to req.body, reject vvv
  if (!body.inc_votes || Object.keys(body).length !== 1) {
    return Promise.reject({ status: 400, msg: "invalid patch request" });
  }
  //vvv otherwise, update the number of votes of article (given) by the amount indicated vvv
  return (
    db
      //return *
      .query(
        "UPDATE articles SET votes = votes + $1 WHERE  article_id = $2 RETURNING *;",
        [body.inc_votes, article_idNumber]
      )
      //vvv return altered article unless article is empty (i.e. 999 not made yet)
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "ID not found" });
        } else {
          return result.rows[0];
        }
      })
  );
};

//vvv Get array of usernames from users db ////////////////

exports.fetchUsers = () => {
  return db.query("SELECT username FROM users;").then((result) => {
    return result.rows;
  });
};

//vvv GET all articles from articles db /////////

exports.fetchArticles = () => {
  return db.query("SELECT * FROM articles;").then((result) => {
    return result.rows;
  });
};

//vvv Get comments by ID////////////////////////////////////////////////////
exports.fetchCommentsById = (article_id) => {
  console.log("in model");
  return db
    .query(`SELECT * FROM comments WHERE  article_id = $1;`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      } else {
        console.log(result.rows);
        return result.rows;
      }
    });
};

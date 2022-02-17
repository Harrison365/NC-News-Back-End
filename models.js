const db = require("./db/connection.js");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE  article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found" });
      } else return result.rows[0];
    });
};

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

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
          //<Hard coded: if nothing is returned we assume its because this article_id doesnt exist
          return Promise.reject({ status: 404, msg: "ID not found" });
        } else return result.rows[0];
      })
  );
};

//vvv Patch to change vote on specific article//////////////
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
//vvv Without comment_count vvv///
// exports.fetchArticles = () => {
//   return db.query("SELECT * FROM articles;").then((result) => {
//     return result.rows;
//   });
// };
//vvv WITH vvv//////
exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.*, 
    COUNT(comments.article_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id;
    `
    )
    .then((result) => {
      return result.rows;
    });
};

//vvv Get comments by article ID////////////////////////////////////////////////////
exports.fetchCommentsById = (article_id) => {
  return db
    .query(`SELECT * FROM comments WHERE  article_id = $1;`, [article_id])
    .then((result) => {
      //vvv here, we can't hard code like on line 29 as we cant assume 0 responses means that the article doesnt exist
      //It may exist but have no comments. so we need to check it exists another way...vvv
      //We create another model called check 'parametric e.g. article_id' exists. SEE ABOVE
      //We can then invoke this in the controller with a promise all
      //We could also do this instead of line 29 but want to keep this just to see the alternative.
      return result.rows;
    });
};

//vvv POST comment object to article when given ID. Responds with the posted comment vvv////

exports.addComment = (article_id, body) => {
  // const { username , body } = commentToAdd //<<deconstruct
  //vvv if article id is not a number, reject. vvv
  let article_idNumber = parseInt(article_id);
  if (typeof article_idNumber !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }
  // vvv if newComment is not provided or if there isnt exactly 2 keys passed to req.body, reject vvv

  if (!body.username || !body.body || Object.keys(body).length !== 2) {
    return Promise.reject({ status: 400, msg: "invalid post request" });
  }
  // vvv otherwise add comment vvv///
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
      // console.log(result.rows);
      return result.rows[0];
    });
};

//DELETE Comment by comment id///
exports.fetchAndDeleteCommentByCommentId = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id]);

  //vvv here, we can't hard code like on line 29 as we cant assume 0 responses means that the article doesnt exist
  //It may exist but have no comments. so we need to check it exists another way...vvv
  //We create another model called check 'parametric e.g. article_id' exists. SEE ABOVE
  //We can then invoke this in the controller with a promise all
  //We could also do this instead of line 29 but want to keep this just to see the alternative.
};

////////////Checking exists, used in tadndem with other models using Promise.all /////////////////

//CHECK ARTICLE EXISTS vv///////

exports.checkArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID not found" });
        //dont need a positive return :) just the promise.reject
      }
    });
};
//CHECK COMMENT EXISTS vv///////

exports.checkCommentExists = (comment_id) => {
  console.log(comment_id);
  console.log(typeof comment_id);
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1;", [comment_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment ID not found" });
        //dont need a positive return :) just the promise.reject
      }
    });
};

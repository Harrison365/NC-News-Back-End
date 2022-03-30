const {
  fetchTopics,
  fetchArticleById,
  voteAdder,
  fetchUsers,
  fetchArticles,
  fetchCommentsById,
  checkArticleExists,
  addComment,
  fetchAndDeleteCommentByCommentId,
  checkCommentExists,
} = require("./models.js");
const endpointsJson = require("./endpoints.json");

//vvv GET api////
exports.getApi = (req, res) => {
  return res.status(200).send(endpointsJson);
};

//vvv Get all topics
exports.getTopics = (req, res) => {
  fetchTopics()
    .then((result) => {
      res.status(200).send({ topics: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

//vvv Get article by ID (+comment count)
exports.getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticleById(article_id)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};

//vvv Patch to change vote on specific article
exports.patchVote = (req, res, next) => {
  const article_id = req.params.article_id;
  const body = req.body;
  voteAdder(article_id, body)
    .then((result) => {
      res.status(200).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};

//vvv Get array of usernames from users db
exports.getUsers = (req, res) => {
  fetchUsers()
    .then((result) => {
      res.status(200).send({ users: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

//vvv GET all articles from articles db.

//vvv Without comment_count vvv///
// exports.getArticles = (req, res) => {
//   fetchArticles()
//     .then((result) => {
//       res.status(200).send({ articles: result }); //<<< dont understand this destructuring.
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
//vvv with vvv/////
// exports.getArticles = (req, res) => {
//   fetchArticles()
//     .then((result) => {
//       res.status(200).send({ articles: result }); //<<< dont understand this destructuring.
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
///vvvv Get articles, sort by topic & order asc or desc ////
exports.getArticles = (req, res, next) => {
  //queries need a next//
  const { sort_by, order, topic } = req.query;
  fetchArticles(sort_by, order, topic)
    .then((result) => {
      res.status(200).send({ articles: result });
    })
    .catch((err) => {
      next(err);
    });
};

//vvv GET comments for specified article_id

exports.getCommentsById = (req, res, next) => {
  //^^^Next; we expect errors for parametric (:) endpoints
  const article_id = req.params.article_id;
  Promise.all([fetchCommentsById(article_id), checkArticleExists(article_id)])
    .then((result) => {
      res.status(200).send({ comments: result[0] });
    })
    .catch((err) => {
      next(err);
    });
};

//vvv POST comment object to article when given ID. Responds with the posted comment vvv////

exports.postComment = (req, res, next) => {
  //parametric means we need a next//

  const article_id = req.params.article_id;
  const body = req.body;

  addComment(article_id, body)
    .then((addedComment) => {
      res.status(201).send({ comment: addedComment });
    })
    .catch((err) => {
      next(err);
    });
};

//DELETE Comment by comment id///

exports.deleteCommentByCommentId = (req, res, next) => {
  //^^^Next; we expect errors for parametric (:) endpoints
  const comment_id = +req.params.comment_id;

  Promise.all([
    checkCommentExists(comment_id),
    fetchAndDeleteCommentByCommentId(comment_id),
  ]) //^^^Must check before deleting////
    .then((result) => {
      res.status(204).send({ comments: result[0] }); //<<should be nothing
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

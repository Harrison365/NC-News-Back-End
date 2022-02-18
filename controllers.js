const {
  fetchTopics,
  fetchArticleById,
  voteAdder,
  fetchUsers,
  fetchArticles,
} = require("./models.js");

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

//vvv Get article by ID
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

exports.getArticles = (req, res) => {
  fetchArticles()
    .then((result) => {
      res.status(200).send({ articles: result }); //<<< dont understand this destructuring.
    })
    .catch((err) => {
      console.log(err);
    });
};

//vvv GET Comment count for specified article //
//May need to add onto 'Get Article by ID' on line 20

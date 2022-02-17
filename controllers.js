const {
  fetchTopics,
  fetchArticleById,
  voteAdder,
  fetchUsers,
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

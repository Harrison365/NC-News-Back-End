const { fetchTopics, fetchArticleById, votingModel } = require("./models.js");

exports.getTopics = (req, res) => {
  fetchTopics()
    .then((result) => {
      res.status(200).send({ topics: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

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

exports.patchVote = (req, res, next) => {
  console.log("in controller");
  const article_id = req.params.article_id;
  const body = req.body;
  votingModel(article_id, body)
    .then((result) => {
      res.status(201).send({ article: result });
    })
    .catch((err) => {
      next(err);
    });
};

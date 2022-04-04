const express = require("express");
const cors = require("cors");
const {
  getApi,
  getTopics,
  getArticleById,
  patchVote,
  getUsers,
  getArticles,
  getCommentsById,
  postComment,
  deleteCommentByCommentId,
} = require("./controllers.js");

const app = express();
app.use(cors());

app.use(express.json()); //<<< .json.parse request body and attaches to req.body

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchVote);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);
// etc...

// vvv Could put in seperate error file and require them in vvv
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "path not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

// ^^^ Could put in seperate error file and require them in ^^^

app.all("*", (req, res) => {
  res.status(404).send({ message: "path not found" });
});
//^^^ Default for all endpoints if the url doesn't exist

module.exports = app;

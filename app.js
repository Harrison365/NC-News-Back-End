const express = require("express");
const { getTopics, getArticleById } = require("./controllers.js");

const app = express();

app.use(express.json()); //<<< Not sure why?

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

// app.post

// etc...

app.all("*", (req, res) => {
  res.status(404).send({ message: "path not found" });
});

module.exports = app;

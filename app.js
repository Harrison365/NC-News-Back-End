const express = require("express");
const { getTopics, getArticleById } = require("./controllers.js");

const app = express();

app.use(express.json()); //<<< Not sure why?

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

// app.post

// etc...

// vvv Could put in seperate error file and require them in vvv
app.use((err, req, res, next) => {
  if (err.status) {
    console.log(err);
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    console.log(err);
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
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

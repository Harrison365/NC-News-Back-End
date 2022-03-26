///GET all articles with sorts and orders and by topic
exports.fetchArticles = (sort_by = "created_at", order = "desc", topic) => {
  console.log("inM");
  const possibleSortBys = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];
  const possibleOrderBys = ["desc", "asc"];
  const topicQueries = [];
  let queryStr = `SELECT articles.*, CAST(COUNT(comments.article_id) as INT) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.articles_id`;
  // let queryStr = `SELECT articles.*,
  // COUNT(comments.comment_id) AS comment_count
  // FROM articles
  // LEFT JOIN comments
  // ON articles.article_id = comments.article_id`;
  if (topic) {
    topicQueries.push(topic);
    queryStr += ` WHERE topic=$1`;
  }
  // if (
  //   ["coding", "football", "cooking", "mitch", "cats", "paper"].includes(topic)
  // ) {
  //   query += `WHERE topic = '${topic}'`;
  // } else if (topic !== undefined) {
  //   return Promise.reject({ status: 404, msg: "No topic found" });
  // }
  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  if (!possibleSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }
  if (!possibleOrderBys.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid input (order)" });
  }
  return db.query(queryStr, topicQueries).then((results) => {
    console.log("and here");
    return results.rows;
  });
};

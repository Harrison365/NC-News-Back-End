const request = require("supertest");
const data = require("../db/data/test-data"); //auto goes to index.js
const db = require("../db/connection.js"); //allows access to psql (connection.js)
const seed = require("../db/seeds/seed.js"); //access seed function
const app = require("../app.js"); //access endpoints + express
const { response } = require("express");

beforeEach(() => seed(data));
//^^^Reset data before every test.

afterAll(() => db.end());
//^^^Closes connection with psql after tests.

//vvv GET all topics from topic db.
describe("/api/topics", () => {
  describe("GET", () => {
    test("status: 200 - responds with array of all topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body.topics).toHaveLength(3);
          response.body.topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
  });
});

//vvv GET article when given article_id

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("status: 200 - responds with specified article object", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((response) => {
          expect(response.body.article).toEqual(
            expect.objectContaining({
              article_id: 3,
              title: "Eight pug gifs that remind me of mitch",
              topic: "mitch",
              author: "icellusedkars",
              body: "some gifs",
              created_at: "2020-11-03T09:12:00.000Z",
              votes: 0,
            })
          );
        });
    });
    //EXTRA Test for comment count vvv
    test("status 200- article object has comment count", () => {
      return request(app)
        .get("/api/articles/3")
        .then((response) => {
          expect(response.body.article.comment_count).toBe("2");
        });
    });
    // Sad path vvv
    test("status 400 -  responds wth an error message when given invalid article id", () => {
      return request(app)
        .get("/api/articles/banana") //<<< 999 would give 404 as it COULD exist as it is a number. Banana is an INVALID ID
        .expect(400) //<<< for impossible input like banana
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    test("Status 404 -  valid but non existant id", () => {
      return request(app)
        .get("/api/articles/999") //<<<plausable but not existant
        .expect(404) //<<<for plausable but not existant
        .then(({ body }) => {
          expect(body.msg).toBe("ID not found");
        });
    });
  });

  ///////vvv VOTE PATCH vvv////////////////

  describe("PATCH", () => {
    test("Status 200 - updates article vote count", () => {
      const vote = { inc_votes: 23 };
      return request(app)
        .patch("/api/articles/2")
        .send(vote) //this becomes req.body
        .expect(200)
        .then((response) => {
          expect(response.body.article.votes).toEqual(23);
        });
    });
  });
  test("status 400 -  responds wth an error message when given invalid article id", () => {
    const vote = { inc_votes: 23 };
    return request(app)
      .patch("/api/articles/banana")
      .send(vote) //this becomes req.body
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("Status 404 -  valid but non existant id", () => {
    const vote = { inc_votes: 23 };
    return request(app)
      .patch("/api/articles/999")
      .send(vote) //this becomes req.body
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID not found");
      });
  });
  test("Status 400 - invalid patch request", () => {
    const vote = {};
    return request(app)
      .patch("/api/articles/2")
      .send(vote) //this becomes req.body
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid patch request");
      }); //dont know how to get it to come here
  });
  test("Status 400 - invalid patch request", () => {
    const vote = { inc_votes: 23, votes: 23 };
    return request(app)
      .patch("/api/articles/2")
      .send(vote) //this becomes req.body
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid patch request");
      }); //dont know how to get it to come here
  });

  //vvv GET all usernames from users db.
  describe("/api/users", () => {
    describe("GET", () => {
      test("status: 200 - responds with array of all username keys", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then((response) => {
            expect(response.body.users).toHaveLength(4);
            expect(response.body.users).toEqual([
              { username: "butter_bridge" },
              { username: "icellusedkars" },
              { username: "rogersop" },
              { username: "lurker" },
            ]);
          });
      });
    });
  });
});

//vvv GET all articles from articles db.
describe("/api/articles", () => {
  describe("GET", () => {
    test("status: 200 - responds with array of all article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toHaveLength(12);
          response.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
  });
});

//vvv GET comments when given article_id

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("status: 200 - responds with array of comments with specified article_id", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toHaveLength(2);
          response.body.comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                body: expect.any(String),
                votes: expect.any(Number),
                author: expect.any(String),
                article_id: expect.any(Number),
                created_at: expect.any(String),
              })
            );
          });
        });
    });
    //Extra happy test for 0 comments on an article
    test("status: 200 - empty array if no comments but on an EXISTING article", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toEqual([]);
        });
    });
    // Sad path vvv
    test("status 400 -  responds with an error message when given invalid article id", () => {
      return request(app)
        .get("/api/articles/banana/comments") //<<< 999 would give 404 as it COULD exist as it is a number. Banana is an INVALID ID
        .expect(400) //<<< for impossible input like banana
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    test("Status 404 -  valid but non existant id", () => {
      return request(app)
        .get("/api/articles/999/comments") //<<<plausable but not existant
        .expect(404) //<<<for plausable but not existant
        .then(({ body }) => {
          expect(body.msg).toBe("ID not found");
        });
    });
  });
});

//vvv Global test - can apply to any endpoint. If endpoint doesn't exist -> 404.
describe("Error Handling", () => {
  test("should return 404 - path not found", () => {
    return request(app)
      .get("/api/brokenUrl")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("path not found");
      });
  });
});

HELLO;
//CAN'T TEST FOR 500 - Server Error

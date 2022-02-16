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
          expect(response.body).toEqual({
            //^^^.article???
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: 1604394720000,
            votes: 0,
          });
        });
    });
  });
});

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

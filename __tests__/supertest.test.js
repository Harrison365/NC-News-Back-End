const request = require("supertest");
const data = require("../db/data/test-data"); //auto goes to index.js
const db = require("../db/connection.js"); //allows access to psql (connection.js)
const seed = require("../db/seeds/seed.js"); //access seed function
const app = require("../app.js"); //access endpoints + express
const { response } = require("express");

beforeEach(() => seed(data));
//^Reset data before every test.

afterAll(() => db.end());
//^Closes connection with psql after tests.

describe("/api/topics", () => {
  describe("GET", () => {
    test("status: 200 - responds with array of all topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          console.log(response);
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

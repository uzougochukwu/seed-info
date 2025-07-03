jest.setTimeout(10000);

const endpointsJson = require("../endpoints.json");
const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const inputData = require("../db/data/test-data");

beforeEach(() => {
  return seed(inputData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object describing each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const body = response.body;
        const endpoints = body.endpoints;
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each containing a slug and a description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const body = response.body;
        const topics = body.topicsData;

        topics.forEach((topic) => {
          expect(topic.length).not.toEqual(0);
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an array of information on that article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.article_id).toBe(1);
        expect(response.body.article.count).toBe("11");
        expect(response.body.article.title).toBe(
          "Living in the shadow of a great man"
        );
        expect(response.body.article.topic).toBe("mitch");
        expect(response.body.article.author).toBe("butter_bridge");
        expect(response.body.article.body).toBe(
          "I find this existence challenging"
        );
        expect(response.body.article.created_at).toBe(
          "2020-07-09T20:11:00.000Z"
        );
        expect(response.body.article.votes).toBe(100);
        expect(response.body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body;

        articles.forEach((article) => {
          expect(article.length).not.toEqual(0);
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("count");
        });
      });
  }),
    test("200: Responds with an array of sorted article objects", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then((response) => {
          const articles = response.body;

          articles.forEach((article) => {
            expect(article.length).not.toEqual(0);
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("count");
          });
        });
    }),
    test("200: Responds with an array of sorted article objects", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order_by=desc")
        .expect(200)
        .then((response) => {
          const articles = response.body;

          articles.forEach((article) => {
            expect(article.length).not.toEqual(0);
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("count");
          });
          expect(articles).toBeSortedBy("votes", { descending: true });
        });
    }),
    test("200: Responds with an array of article objects for that topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then((response) => {
          const articles = response.body;

          articles.forEach((article) => {
            expect(article.length).not.toEqual(0);
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("count");
          });
          expect(response.body).toEqual([
            {
              author: "rogersop",
              title: "UNCOVERED: catspiracy to bring down democracy",
              article_id: 5,
              topic: "cats",
              created_at: "2020-08-03T13:14:00.000Z",
              votes: 0,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              count: "2",
            },
          ]);
        });
    });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comment.rows;

        comments.forEach((comment) => {
          expect(comment.length).not.toEqual(0);
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("article_id");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("comment_id");
        });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with an object showing newly inserted comment", () => {
    const postObj = {
      username: "icellusedkars",
      body: "This gif is awesome",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(postObj)
      .expect(201)
      .then((response) => {
        expect(response.body.newComment.article_id).toEqual(3);
        expect(response.body.newComment.body).toEqual("This gif is awesome");
        expect(response.body.newComment.author).toEqual("icellusedkars");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("201: Responds with an object showing updated article when we add votes to an article", () => {
    const postObj = {
      inc_votes: 5,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(postObj)
      .expect(201)
      .then((response) => {
        expect(response.body.article.article_id).toEqual(1);
        expect(response.body.article.title).toEqual(
          "Living in the shadow of a great man"
        );
        expect(response.body.article.topic).toEqual("mitch");
        expect(response.body.article.author).toEqual("butter_bridge");
        expect(response.body.article.body).toEqual(
          "I find this existence challenging"
        );
        expect(response.body.article.created_at).toEqual(
          "2020-07-09T20:11:00.000Z"
        );
        expect(response.body.article.votes).toEqual(105);
        expect(response.body.article.article_img_url).toEqual(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  }),
    test("201: Responds with an object showing updated article when we subtract votes from an article with more than 0 votes", () => {
      const postObj = {
        inc_votes: -5,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(postObj)
        .expect(201)
        .then((response) => {
          expect(response.body.article.article_id).toEqual(1);
          expect(response.body.article.title).toEqual(
            "Living in the shadow of a great man"
          );
          expect(response.body.article.topic).toEqual("mitch");
          expect(response.body.article.author).toEqual("butter_bridge");
          expect(response.body.article.body).toEqual(
            "I find this existence challenging"
          );
          expect(response.body.article.created_at).toEqual(
            "2020-07-09T20:11:00.000Z"
          );
          expect(response.body.article.votes).toEqual(95);
          expect(response.body.article.article_img_url).toEqual(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    }),
    test("201: Responds with an object showing updated article when we subtract votes from an article with 0 votes", () => {
      const postObj = {
        inc_votes: -5,
      };
      return request(app)
        .patch("/api/articles/4")
        .send(postObj)
        .expect(201)
        .then((response) => {
          expect(response.body.article.article_id).toEqual(4);
          expect(response.body.article.title).toEqual("Student SUES Mitch!");
          expect(response.body.article.topic).toEqual("mitch");
          expect(response.body.article.author).toEqual("rogersop");
          expect(response.body.article.body).toEqual(
            "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
          );
          expect(response.body.article.created_at).toEqual(
            "2020-05-06T01:14:00.000Z"
          );
          expect(response.body.article.votes).toEqual(0);
          expect(response.body.article.article_img_url).toEqual(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    }),
    test("201: Responds with an object showing updated article when we add votes to an article with 0 votes", () => {
      const postObj = {
        inc_votes: 5,
      };
      return request(app)
        .patch("/api/articles/4")
        .send(postObj)
        .expect(201)
        .then((response) => {
          expect(response.body.article.article_id).toEqual(4);
          expect(response.body.article.title).toEqual("Student SUES Mitch!");
          expect(response.body.article.topic).toEqual("mitch");
          expect(response.body.article.author).toEqual("rogersop");
          expect(response.body.article.body).toEqual(
            "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
          );
          expect(response.body.article.created_at).toEqual(
            "2020-05-06T01:14:00.000Z"
          );
          expect(response.body.article.votes).toEqual(5);
          expect(response.body.article.article_img_url).toEqual(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with nothing after deleting comment", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then((response) => {});
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body.rows;

        users.forEach((user) => {
          expect(user.length).not.toEqual(0);
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});

describe("Error Handling", () => {
  test("returns an error message when given an incorrect endpoint", () => {
    return request(app)
      .get("/api/notAnEndpoint")
      .expect(404)

      .then((response) => {
        const errMsg = response.res.statusMessage;
        expect(errMsg).toBe("Not Found");
      });
  });
  test("returns an error message when given a non numerical article_id", () => {
    return request(app)
      .get(`/api/articles/s`)
      .expect(500)
      .then((response) => {
        const errMsg = response.res.statusMessage;
        expect(errMsg).toBe("Internal Server Error");
      });
  });
});

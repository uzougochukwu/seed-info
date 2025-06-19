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
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
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
      .get("/api/articles?limit=10&p=0")
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
        .get("/api/articles?sort_by=votes&limit=10&p=0")
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
        .get("/api/articles?sort_by=votes&order_by=desc&limit=10&p=0")
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
        .get("/api/articles?topic=cats&limit=10&p=0")
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
    }),
    test("200: responds with paginated articles", () => {
      return request(app)
        .get("/api/articles?limit=2&p=5")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual([
            {
              author: "icellusedkars",
              title: "Sony Vaio; or, The Laptop",
              article_id: 2,
              topic: "mitch",
              created_at: "2020-10-16T05:03:00.000Z",
              votes: 0,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              count: "0",
            },
            {
              author: "icellusedkars",
              title: "Does Mitch predate civilisation?",
              article_id: 8,
              topic: "mitch",
              created_at: "2020-04-17T01:08:00.000Z",
              votes: 0,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              count: "0",
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
    }),
    test("201: Responds with the newly added article and author, title, topic, author, body, created_at, votes, article_img_url", () => {
      const postObj = {
        author: "rogersop",
        title: "Is Mitch ready for the Singularity?",
        body: "We all know Mitch likes technology, but is he willing to make way for AI? There can only be one supreme thought leader, and we all know that ChatGPT can fulfill that role perfectly.",
        topic: "mitch",
        article_img_url:
          "https://bigthink.com/wp-content/uploads/2021/12/13-8_Death-and-The-Singularity_Lead.jpg",
      };
      return request(app)
        .post("/api/articles")
        .send(postObj)
        .expect(201)
        .then((response) => {
          expect(response.body.article).toHaveProperty("author");
          expect(response.body.article).toHaveProperty("title");
          expect(response.body.article).toHaveProperty("body");
          expect(response.body.article).toHaveProperty("topic");
          expect(response.body.article).toHaveProperty("article_img_url");
          expect(response.body.article).toHaveProperty("article_id");
          expect(response.body.article).toHaveProperty("created_at");
          expect(response.body.article).toHaveProperty("votes");
          expect(response.body.article.author).toEqual("rogersop");
          expect(response.body.article.title).toEqual(
            "Is Mitch ready for the Singularity?"
          );
          expect(response.body.article.body).toEqual(
            "We all know Mitch likes technology, but is he willing to make way for AI? There can only be one supreme thought leader, and we all know that ChatGPT can fulfill that role perfectly."
          );
          expect(response.body.article.topic).toEqual("mitch");
          expect(response.body.article.article_img_url).toEqual(
            "https://bigthink.com/wp-content/uploads/2021/12/13-8_Death-and-The-Singularity_Lead.jpg"
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

describe("PATCH /api/comments/:comment_id", () => {
  test("201: Responds with the comment after updating the votes", () => {
    const postObj = {
      inc_votes: 2,
    };
    return request(app)
      .patch("/api/comments/1")
      .send(postObj)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toEqual({
          comment_id: 1,
          article_id: 9,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 18,
          author: "butter_bridge",
          created_at: "2020-04-06T12:17:00.000Z",
        });
      });
  }),
    test("201: Responds with the comment after updating the votes", () => {
      const postObj = {
        inc_votes: -2,
      };
      return request(app)
        .patch("/api/comments/1")
        .send(postObj)
        .expect(201)
        .then((response) => {
          expect(response.body.comment).toEqual({
            comment_id: 1,
            article_id: 9,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 14,
            author: "butter_bridge",
            created_at: "2020-04-06T12:17:00.000Z",
          });
        });
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

describe("GET /api/users/:username", () => {
  test("200: Responds with an array of a particular user when it receives a username", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then((response) => {
        const users = response.body.rows;

        users.forEach((user) => {
          expect(user.length).not.toEqual(0);
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });

        expect(response.body.rows[0].name).toEqual("sam");
        expect(response.body.rows[0].username).toEqual("icellusedkars");
        expect(response.body.rows[0].avatar_url).toEqual(
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
        );
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
      .expect(400)
      .then((response) => {
        const errMsg = response.res.statusMessage;
        expect(errMsg).toBe("Bad Request");
      });
  });
});

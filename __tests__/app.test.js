const endpointsJson = require("../endpoints.json");
const app = require("../app.js")
const request = require("supertest")
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const inputData = require("../db/data/test-data")

beforeEach(() => {
  return seed(inputData);
})

afterAll(() => {
  return db.end();
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => { 
        const body = response.body
        const endpoints = body.endpoints
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
      const body = response.body
      const topics = body.rows
      topics.forEach((topic) => {
        expect(topic).toHaveProperty('slug');
        expect(topic).toHaveProperty('description');
      })
    })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an array of information on that article", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then((response) => {
      expect(response.body.article.article_id).toBe(1)
      expect(response.body.article.title).toBe("Living in the shadow of a great man")
      expect(response.body.article.topic).toBe("mitch")
      expect(response.body.article.author).toBe("butter_bridge")
      expect(response.body.article.body).toBe("I find this existence challenging")
      expect(response.body.article.created_at).toBe("2020-07-09T20:11:00.000Z")
      expect(response.body.article.votes).toBe(100)
      expect(response.body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
      
      })
    
    })
  })


describe("Error Handling", () => {
test("returns an error message when given an incorrect endpoint", () => {
  return request(app)
  .get("/api/notAnEndpoint")
  .expect(404)

  .then((response) => {
    const errMsg = response.res.statusMessage
    expect(errMsg).toBe("Not Found");
  })
})
test("returns an error message when given a non numerical article_id", () => {
  return request(app)
  .get(`/api/articles/s`)
  .expect(500)
  .then((response) => {
    const errMsg = response.res.statusMessage
    expect(errMsg).toBe("Internal Server Error")
  })
})
})
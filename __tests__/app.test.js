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
      // .then(({ body: { endpoints } }) => {
      //   expect(endpoints).toEqual(endpointsJson);
      // });
      .then((response) => { 
        const body = response.body
        const endpoints = body.endpoints
        //console.log(body)
        //console.log(endpoints)
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects, each containing a slug and a description", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    // .then(({body: {topics}}) => {
    //   console.log(topics)
    //   expect(topics).toHaveLength(3);
    //   topics.forEach((topic) => {
    //     expect(topic).toHaveProperty('slug');
    //     expect(topic).toHaveProperty('description');
    //   })
    // })
    .then((response) => {
      const body = response.body
      const topics = body.rows
      //console.log(topics)
      topics.forEach((topic) => {
        expect(topic).toHaveProperty('slug');
        expect(topic).toHaveProperty('description');
      })
    })
  })
})

describe("Error Handling", () => {
test("returns an error message when given an incorrect endpoint", () => {
  return request(app)
  .get("/api/notAnEndpoint")
  .expect(404)
  // .then(({ body }) => {
  //   expect(body.msg).toBe("Not Found")
  // })
  .then((response) => {
    const body = response.body
    //console.log(response.notFound)

    expect(response.notFound).toEqual(true);
  })
})
})
const request = require("supertest");
const app = require("../../../app");

describe("Test the root path", () => {
  it("should response the GET method with status code 200", async () => {
    return request(app)
    .get('/')
    .set("Content-Type","application/json")
    .then((res) => {
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual(
        expect.objectContaining({
          ...res.body
        })
      )
    })
  });
  it("should response the GET method with status code 404", async () => {
    return request(app)
    .get('/somelinkthatleadstonowhere')
    .set("Content-Type","application/json")
    .then((res) => {
      expect(res.statusCode).toBe(404)
      expect(res.body).toEqual(
        expect.objectContaining({
          ...res.body
        })
      )
    })
  });
});

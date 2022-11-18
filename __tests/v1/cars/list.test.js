const request = require("supertest");
const app = require("../../../app");

describe("GET /v1/cars", () => {
  it("should return statusCode 200", async () => {
    return request(app)
      .get("/v1/cars")
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("cars");
        expect(res.body.cars).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: expect.any(String),
              price : expect.any(Number),
              size : expect.any(String),
              image: expect.any(String),
              isCurrentlyRented : expect.any(Boolean),
            }),
          ])
        );
      });
  });
});

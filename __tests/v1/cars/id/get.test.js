const request = require("supertest");
const app = require("../../../../app");
const { Car } = require("../../../../app/models");

describe("GET /v1/cars/:id", () => {
  let cars;
  beforeEach(async () => {
    cars = await Car.create({
      name: "Daihatsu Sunny",
      price: 100000,
      size: "SMALL",
      image: "someimage.png",
      isCurrentlyRented: false,
    });
    return cars;
  });

  afterEach(() => cars.destroy());
  it("should return statusCode 200", async () => {
    return request(app)
      .get("/v1/cars/" + cars.id)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            name: cars.name,
            price: cars.price,
            size: cars.size,
            image: cars.image,
            isCurrentlyRented: false,
          })
        );
      });
  });
})

const request = require("supertest");
const app = require("../../../../app");
const { Car, User } = require("../../../../app/models");

let accessToken;
beforeAll(async () => {
  await User.update({ roleId: 2 },
    {
      where: {
        email: "johnny@binar.co.id",
      },
    }
  );
});
beforeAll(async () => {
  response = await request(app).post("/v1/auth/login").send({
    email: "johnny@binar.co.id",
    password: "123456",
  });
 
  accessToken = response.body.accessToken;
});
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
  it("should return statusCode 204", async () => {
    return request(app)
      .delete("/v1/cars/" + cars.id)
      .set("Authorization", `Bearer ${accessToken}`)
      .then((res) => {
        expect(res.statusCode).toBe(204);
      });
  });
})

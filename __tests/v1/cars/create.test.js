const request = require("supertest");
const app = require("../../../app");
const { User, Car } = require("../../../app/models");

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



describe("POST /v1/cars", () => {
  afterEach(async () => {
    await User.update(
      { roleId: 1 },
      {
        where: {
          email: "johnny@binar.co.id",
        },
      }
    );
    Car.destroy({ where: { name: "Daihatsu Sunny" }, force: true });
  });
  it("should return statusCode 201", async () => {

    const name = "Daihatsu Sunny";
    const price = 100000;
    const size = "SMALL";
    const image = "someimage.png";
    return request(app)
      .post("/v1/cars")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("Content-Type", "application/json")
      .send({ name, price, size, image })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
            name,
            price,
            size,
            image
          })
        );
      });
  });
});

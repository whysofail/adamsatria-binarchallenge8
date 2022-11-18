const request = require('supertest')
const app = require("../../../app");
const { User } = require('../../../app/models')

describe("POST /users", () => {

  afterAll(async () => {
    await User.destroy({where : {email:'unregistered@binar.co.id'}})
  },5000)
  it("should return StatusCode 201", async () => {
    const name = 'Windah Basudara'
    const email = "unregistered@binar.co.id"
    const password = "123456";

    return request(app)
      .post("/v1/auth/register")
      .set("Content-Type", "application/json")
      .send({ name ,email, password })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            accessToken : expect.any(String)
          })
        )
      });
  });

  it('should return statusCode 422', async () => {
    const name = 'Johnny'
    const email = "johnny@binar.co.id"
    const password = "123456";

    return request(app)
      .post("/v1/auth/register")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({ name ,email, password })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect.objectContaining({
          error: {
            details : {
              email : email
            },
            name: expect.any(String),
            message: expect.any(String),
          },
        })
      });
  })
});
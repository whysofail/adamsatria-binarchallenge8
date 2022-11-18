const request = require('supertest');
const app = require('../../../app');

describe('POST /v1/auth/login', () => {
  it("should response with 201 as status code", async () => {
    
    const email = "johnny@binar.co.id"
    const password = "123456";

    return request(app)
      .post("/v1/auth/login")
      .set("Content-Type", "application/json")
      .send({ email, password })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            accessToken : expect.any(String)
          })
        )
      });
  });
  it("should response with 404 as status code", async () => {
    
    const email = "undefined@binar.co.id"
    const password = "123456";

    return request(app)
      .post("/v1/auth/login")
      .set("Content-Type", "application/json")
      .send({ email, password })
      .then((res) => {
        console.log(res.body)
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: {
              details : {
                email : email
              },
              name: expect.any(String),
              message: expect.any(String),
            },
          })
        )
      });
    })
    it("should response with 401 as status code", async () => {
    
      const email = "johnny@binar.co.id"
      const password = "wrongpasswordbutcorretemail";
  
      return request(app)
        .post("/v1/auth/login")
        .set("Content-Type", "application/json")
        .send({ email, password })
        .then((res) => {
          expect(res.statusCode).toBe(401);
          expect(res.body).toEqual(
            expect.objectContaining({
              error: {
                details : expect.any(Object),
                name: expect.any(String),
                message: expect.any(String),
              },
            })
          )
        });
    });
});

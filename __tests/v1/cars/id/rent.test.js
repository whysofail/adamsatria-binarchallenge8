const request = require("supertest");
const app = require("../../../../app");
const dayjs = require('dayjs')
const { Car, UserCar } = require("../../../../app/models");


let accessToken
beforeAll(async () => {
    response = await request(app).post("/v1/auth/login").send({
      email: "brian@binar.co.id",
      password: "123456",
    });
   
    accessToken = response.body.accessToken;
  });
  
describe('POST /v1/cars/:id/rent', () => { 
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
  
    afterAll( () => {
        UserCar.destroy({where : {id : cars.id}})
        cars.destroy()
    });
    it('return statusCode 201',async () => {
        const rentStartedAt = dayjs()
        const rentEndedAt =  dayjs().add('2','day')

        return request(app)
        .post('/v1/cars/' + cars.id + '/rent')
        .set("Authorization", `Bearer ${accessToken}`)
        .send({rentStartedAt,rentEndedAt})
        .then((res) => {
            expect(res.statusCode).toBe(201);
        })
    })
    it('return statusCode 422',async () => {
        const rentStartedAt = dayjs()
        const rentEndedAt =  dayjs().add('2','day')

        return request(app)
        .post('/v1/cars/' + cars.id + '/rent')
        .set("Authorization", `Bearer ${accessToken}`)
        .send({rentStartedAt,rentEndedAt})
        .then((res) => {
            expect(res.statusCode).toBe(201);
        })
    })
 })
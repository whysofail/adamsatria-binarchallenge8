const { Car, UserCar } = require("../models");
const dayjs = require("dayjs");
const CarController = require("./CarController");
const { CarAlreadyRentedError } = require("../errors");

describe('CarController', () => { 
  const id = 1;
  const name = "Daihatsu Sunny";
  const price = 10000;
  const size = "Small";
  const image = "someimage.png";
  const isCurrentlyRented = false;
  const cars = [];
  for (let i = 0; i < 10; i++) {
    const car = new Car({
      id,
      name,
      price,
      size,
      image,
      isCurrentlyRented,
    });
    cars.push(car);
  }
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  beforeEach(() => {
    jest.fn().mockClear();
  });
  afterEach(() => {
    jest.fn().mockClear();
  });
  describe('#handleListCars', () => { 
    it('should return statusCode 200, lists of cars and pagination property', async () => {
      const mockCarModel = {
        findAll: jest.fn().mockReturnValue(cars),
        count: jest.fn().mockReturnValue(10),
      };
      const mockRequest = {
        query: {
          page: 1,
          pageCount: 1,
          pageSize: 10,
          count: 10,
        },
      };
      const mockPagination = {
        page: mockRequest.query.page,
        pageCount: mockRequest.query.pageCount,
        pageSize: mockRequest.query.pageSize,
        count: mockRequest.query.count,
      };
      const carController = new CarController({ carModel: mockCarModel });
      await carController.handleListCars(mockRequest, mockResponse);
      expect(mockCarModel.findAll).toHaveBeenCalled();
      expect(mockCarModel.count).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        cars: cars,
        meta: { pagination: mockPagination },
      });
    })
   })
  describe('#handleGetCar', () => { 
    it("should return statusCode 200 and cars instances", async () => {
      const mockCarModel = {
        findByPk: jest.fn().mockReturnValue(cars),
      };
      const mockRequest = {
        params: {
          id: 1,
        },
      };
      const carController = new CarController({ carModel: mockCarModel });
      await carController.handleGetCar(mockRequest, mockResponse);
      expect(mockCarModel.findByPk).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(cars);
   })
  })
  describe('#handleCreateCar', () => { 
    const mockRequest = {
      body: {
        name: "Daihatsu Sunny",
        price: 200000,
        size: "Small",
        image: "someimage.png",
      },
    };
    it('should return statusCode 201 and cars instances requested', async () => {
      const mockCarModel = {
        create: jest.fn().mockReturnValue(cars)
      };

      const carController = new CarController({ carModel: mockCarModel });
      await carController.handleCreateCar(mockRequest, mockResponse);

      expect(mockCarModel.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(cars)
    })

    it('should return statusCode 422 and cars with error instances', async () => {
      const err = new Error('something')
      const mockCarModel = {
        create: jest.fn().mockReturnValue(Promise.reject(err))
      };
      const carController = new CarController({ carModel: mockCarModel });
      await carController.handleCreateCar(mockRequest, mockResponse);

      expect(mockCarModel.create).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          name: err.name,
          message: err.message,
        },
      });
    })
   })
  describe('#handleRentCar', () => { 
      const carId = 1;
      const rentStartedAt = "2022-06-12T23:50:21.817Z";
      const rentEndedAt = "2022-06-12T23:50:21.817Z";
      const userCars = new UserCar({
        carId,
        id,
        rentStartedAt,
        rentEndedAt,
      });
      
      const mockRequest = {
        params: {
          id: 1,
        },
        user: {
          id: 1,
        },
        body: {
          rentStartedAt,
          rentEndedAt,
        },
      };
      const mockNext = jest.fn().mockReturnThis();
    it('should return statusCode 201 and userCar instance', async () => {
      const mockCarModel = {
        findByPk: jest.fn().mockReturnValue(cars),
      };
      const mockUserCarModel = {
        
        //Received = where : something2, dont know how to properly fix this.
        findOne: jest.fn().mockReturnValue(undefined),

        create: jest.fn().mockReturnValue(userCars),
      };

      
      const carController = new CarController({
        carModel: mockCarModel,
        userCarModel: mockUserCarModel,
        dayjs: dayjs,
      });
      await carController.handleRentCar(mockRequest, mockResponse, mockNext);
      expect(mockCarModel.findByPk).toHaveBeenCalled();

      //Received = where : something2, dont know how to properly fix this.
      expect(mockUserCarModel.findOne).toHaveBeenCalled();

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockUserCarModel.create).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(userCars);
    })
    it('should return statusCode 422 and userCar with error instance', async () => {
      const err = new CarAlreadyRentedError(cars)
      const rentStartedAt = "2022-06-12T23:50:21.817Z";
      const rentEndedAt = "2022-06-12T23:50:21.817Z";

      const mockCarModel = {
        findByPk: jest.fn().mockReturnValue(cars),
      };
      const mockUserCarModel = {
        findOne: jest.fn(() => Promise.reject(err)),
        create: jest.fn().mockReturnValue(userCars),
      };

      const mockRequest = {
        params: {
          id: 1,
        },
        user: {
          id: 1,
        },
        body: {
          rentStartedAt,
          rentEndedAt,
        },
      };
      
      const carController = new CarController({
        carModel: mockCarModel,
        userCarModel: mockUserCarModel,
        dayjs: dayjs,
      });
      await carController.handleRentCar(mockRequest, mockResponse, mockNext);
      expect(mockCarModel.findByPk).toHaveBeenCalled();
      expect(mockUserCarModel.findOne).toHaveBeenCalled()
      expect(mockNext).toHaveBeenCalledWith(err);
    })
   })
  describe('#handleUpdateCar', () => { 
    const mockCar = new Car({
      id,
      name,
      price,
      size,
      image,
      isCurrentlyRented,
    });
    const mockRequest = {
      params: {
        id: 1,
      },
      body: {
        name,
        price,
        size,
        image,
        isCurrentlyRented,
      },
    };
    it('it should return statusCode 200 and cars json', async () => {
      mockCar.update = jest.fn().mockReturnThis();
      const mockCarModel = {
        findByPk: jest.fn().mockReturnValue(mockCar),
      };

      const carController = new CarController({ carModel: mockCarModel });
      await carController.handleUpdateCar(mockRequest, mockResponse);
      expect(mockCarModel.findByPk).toHaveBeenCalled();
      expect(mockCar.update).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCar);
    }),

    it('should return statusCode 422', async () => {
      const err = new Error('something')
      mockCar.update = jest.fn().mockReturnValue(Promise.reject(err))
      const mockCarModel = {
        findByPk: jest.fn().mockReturnValue(mockCar)
      };
      const carController = new CarController({ carModel: mockCarModel });
      await carController.handleUpdateCar(mockRequest, mockResponse);

      expect(mockCarModel.findByPk).toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(422)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          name: err.name,
          message: err.message,
        },
      });

    })
   })
  describe('#handleDeleteCar', () => { 
    it('should return statusCode 204', async () => {
      const mockRequest = {
        params: {
          id: 1,
        },
      };

      const mockCarModel = {
        destroy: jest.fn(),
      };
      mockResponse.end = jest.fn().mockReturnThis();

      const carController = new CarController({ carModel: mockCarModel });
      await carController.handleDeleteCar(mockRequest, mockResponse);
      expect(mockCarModel.destroy).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.end).toHaveBeenCalled();
    })
   })
 })
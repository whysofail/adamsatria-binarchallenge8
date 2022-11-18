const ApplicationController = require("./ApplicationController");
const { NotFoundError } = require("../errors");

describe("ApplicationController", () => {
  describe("#handleGetRoot", () => {
    it("should return statusCode 200 and json body", async () => {
      const json = { status: "OK", message: "BCR API is up and running!" };
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const applicationController = new ApplicationController();
      await applicationController.handleGetRoot(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(json);
    });
  });

  describe("#handleNotFound", () => {
    it("should return statusCode 404 and json body", async () => {
      const mockRequest = {
        method: "get",
        url: "/somelinks",
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      const err = new NotFoundError(mockRequest.method, mockRequest.url);

      const applicationController = new ApplicationController();
      await applicationController.handleNotFound(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          name: err.name,
          message: err.message,
          details: err.details,
        },
      });
    });
  });

  describe("#handleError", () => {
    it("should return statusCode 500 and json body", async () => {
      const err = new Error("Something");
      const mockRequest = {};
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const applicationController = new ApplicationController();
      await applicationController.handleError(err, mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          name: err.name,
          message: err.message,
          details: err.details || null,
        },
      });
    });
  });

  // describe("#getOffsetFromRequest", () => {
  //   it("should return offset from request", async () => {
  //     const mockRequest = {
  //       query: {
  //         page: 1,
  //         pageSize: 10,
  //       },
  //     };
  //     const { page, pageSize } = mockRequest.query;
  //     const offset = (page - 1) * pageSize;
  //     const applicationController = new ApplicationController();
  //     expect(
  //       await applicationController.getOffsetFromRequest(mockRequest)
  //     ).toBe(offset);
  //   });
  // });

  // describe('#buildPaginationObject', () => { 
  //   it('should return pagination property', async () => {
  //     const mockRequest = {
  //       query: {
  //         page: 1,
  //         pageSize: 10,
  //       },
  //     };
  //     const count = 10
  //     const { page, pageSize } = mockRequest.query;
  //     const pageCount = Math.ceil(count / pageSize)

  //     const applicationController = new ApplicationController();
  //     expect(
  //       await applicationController.buildPaginationObject(mockRequest, count)
  //     ).toStrictEqual({
  //       page,
  //       pageCount,
  //       pageSize,
  //       count
  //     });
  //   })
  //  })
});

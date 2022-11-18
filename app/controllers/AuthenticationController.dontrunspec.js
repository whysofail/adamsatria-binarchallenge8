/* eslint-disable no-undef */
const { User, Role } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AuthenticationController = require("./AuthenticationController");
const { JWT_SIGNATURE_KEY } = require("../../config/application");



describe("AuthenticationController", () => {
  const id = 1
  const name = 'Username'
  const email = 'mail@example.com'
  const image = 'someimage.png'
  const encryptedPassword = 'eyJzdWIiOiIxMjM0NTY3ODkwIiwicGFzc3dvcmQiOiJwYXNzd29yZCJ9'
  const roleId = 1
  const createdAt = "2022-06-12T23:50:21.817Z"
  const updatedAt = "2022-06-12T23:50:21.817Z"
  const users = [];
  for (let i = 0; i < 10; i++) {
  const user = new User({
    id,
    name,
    email,
    image,
    encryptedPassword,
    roleId,
    createdAt,
    updatedAt
  })
  users.push(user);
}
  const role = new Role({
    id: 1,
    name: 'ADMIN'
  })
 
  describe("#handleLogin", () => {
    it("should return statusCode 201 with json instances", async () => {
     const mockRequest = {
        body : {
          email : email,
          password : 'password'
        }
     }
     const mockRoleModel =  jest.fn().mockReturnValue(role)
     const mockUserModel =  {}
     mockUserModel.findOne  = jest.fn().mockReturnValue(undefined)
     const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
     const mockNext = jest.fn()
     const authenticationController = new AuthenticationController({userModel : mockUserModel, roleModel : mockRoleModel})
     await authenticationController.handleLogin(mockRequest, mockResponse, mockNext)

     expect(mockUserModel.findOne).toHaveBeenCalledWith(users)
     expect(mockResponse.status).toHaveBeenCalledWith(201)
    });
  });
});

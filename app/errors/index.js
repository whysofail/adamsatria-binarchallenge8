const CarAlreadyRentedError = require("./CarAlreadyRentedError")
const EmailNotRegisteredError = require("./EmailNotRegisteredError")
const EmailAlreadyTakenError = require('./EmailAlreadyTakenError')
const InsufficientAccessError = require("./InsufficientAccessError");
const NotFoundError = require("./NotFoundError")
const WrongPasswordError = require("./WrongPasswordError")

module.exports = {
  CarAlreadyRentedError,
  EmailNotRegisteredError,
  EmailAlreadyTakenError,
  InsufficientAccessError,
  NotFoundError,
  WrongPasswordError,
}

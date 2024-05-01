/**
 * All error classes
 */
//  const errorCodes = require("../json/error-codes");

class InvalidArgumentsError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidArgumentsError";
    this.errorCode = -1;
  }
}
module.exports = {
  InvalidArgumentsError: InvalidArgumentsError
};

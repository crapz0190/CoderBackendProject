export default class CustomError {
  static generateError(message, code) {
    const error = new Error(message);
    error.name = "CustomError";
    error.code = code;
    throw error;
  }
}

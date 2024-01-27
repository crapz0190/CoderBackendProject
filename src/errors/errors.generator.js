export default class CustomError {
  static generateError(message, code) {
    console.log("message custom", message);
    console.log("code custom", code);

    const error = new Error(message);
    error.code = code;
    throw error;
  }
}

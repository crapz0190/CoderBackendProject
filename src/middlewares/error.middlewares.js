// export const errorMiddleware = (error, req, res, next) => {
//   res.status(error.code || 500).json({ message: error.message });
// };

export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.code;
  let errorMessage = err.message;
  console.log("statusCode", statusCode);
  console.log("errorMessage", errorMessage);

  switch (statusCode) {
    case 400:
      return message(statusCode, errorMessage);
    case 401:
      return message(statusCode, errorMessage);
    case 403:
      return message(statusCode, errorMessage);
    case 404:
      return message(statusCode, errorMessage);
    case 500:
      return message(statusCode, errorMessage);
  }

  function message(code, messageError) {
    res.status(code).json({
      error: {
        status: code,
        message: messageError,
      },
    });
  }
};

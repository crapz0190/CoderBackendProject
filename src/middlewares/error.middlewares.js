export const errorMiddleware = (error, req, res, next) => {
  res.status(error.code || 500).json({ message: error.message });
};

// export const errorMiddleware = (error, req, res, next) => {
//   let statusCode = error.code || 500;
//   let errorMessage = error.message;

//   // Use a switch statement to handle different status codes
//   switch (statusCode) {
//     case 400:
//       errorMessage;
//       break;
//     case 401:
//       errorMessage;
//       break;
//     case 403:
//       errorMessage;
//       break;
//     case 404:
//       errorMessage;
//       break;
//     case 500:
//       errorMessage;
//       break;
//   }

//   res.status(statusCode).json({
//     error: {
//       status: statusCode,
//       message: errorMessage,
//     },
//   });
// };

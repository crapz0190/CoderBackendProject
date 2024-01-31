import swaggerJSDoc from "swagger-jsdoc";
import { _dirname } from "./config.js";
import { join } from "node:path";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "API documentation for Backend Project",
    },
  },
  apis: [join(_dirname, "docs/*.yaml")],
};

export const swaggerSetup = swaggerJSDoc(swaggerOptions);

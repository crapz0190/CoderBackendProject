import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcrypt";

// Ruta absoluta
const _filename = fileURLToPath(import.meta.url);
export const _dirname = join(dirname(_filename), "../");

// Variables de entorno
export const env = {
  NODE_ENV: process.env.NODE_ENV,
  URL: process.env.URL,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  URI_MONGO: process.env.URI_MONGO,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  TOKEN_SECRET_MONGO: process.env.TOKEN_SECRET_MONGO,
  NODEMAILER_USER: process.env.NODEMAILER_USER,
  NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
};

// Cifrado de password
export const hashData = async (data) => {
  return bcrypt.hash(data, 10);
};

export const compareData = async (data, hashData) => {
  return bcrypt.compare(data, hashData);
};

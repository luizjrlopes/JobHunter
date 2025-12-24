import { config } from "dotenv";

config();

export const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  mongoUri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/job-hunter",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
};

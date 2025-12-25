import express from "express";
import cors from "cors";
import morgan from "morgan";
import "express-async-errors";
import { env } from "./config/env";
import { connectToDatabase } from "./config/db";
import { jobsRouter } from "./routes/jobs.routes";
import { authRouter } from "./routes/auth.routes";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api", jobsRouter);
app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase(env.mongoUri);
  console.log("Connected to MongoDB");

  app.listen(env.port, () => {
    console.log(`API running on port ${env.port}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});

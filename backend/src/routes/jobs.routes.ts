import { Router } from "express";
import {
  createJob,
  deleteJob,
  exportJobs,
  getJobById,
  getJobs,
  importJobs,
  updateJob,
} from "../controllers/jobs.controller";
import { requireAuth } from "../middleware/auth";

export const jobsRouter = Router();

jobsRouter.get("/health", (_req, res) => res.json({ status: "ok" }));

jobsRouter.use(requireAuth);
jobsRouter.get("/jobs", getJobs);
jobsRouter.get("/jobs/:id", getJobById);
jobsRouter.post("/jobs", createJob);
jobsRouter.patch("/jobs/:id", updateJob);
jobsRouter.delete("/jobs/:id", deleteJob);
jobsRouter.post("/jobs/import", importJobs);
jobsRouter.get("/jobs/export", exportJobs);

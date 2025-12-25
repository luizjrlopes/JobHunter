import type { Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";
import { JobModel } from "../models/job.model";
import type { AuthRequest } from "../middleware/auth";

const objectIdSchema = z
  .string()
  .refine((value) => Types.ObjectId.isValid(value), {
    message: "ID invalido",
  });

// Helper para converter _id do MongoDB para id
const mapJobResponse = (job: any) => {
  const obj = job.toObject?.() || job;
  return {
    ...obj,
    id: obj._id?.toString?.() || obj._id,
    _id: undefined,
  };
};

const resourceSchema = z.object({
  label: z.string(),
  href: z.string().optional(),
});

const timelineSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  icon: z.string().optional(),
  createdAt: z.string().optional(),
});

const baseJobSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  track: z.enum(["AI", "FULL_STACK", "CLOUD"]),
  date: z.string().min(1),
  status: z.string().min(1),
  location: z.string().optional(),
  externalLink: z.string().optional(),
  employmentType: z
    .enum(["FullTime", "PartTime", "Contract", "Internship", "Unknown"])
    .optional(),
  workModel: z.enum(["remote", "hybrid", "on-site"]).optional(),
  seniority: z
    .enum(["Intern", "Junior", "Mid", "Senior", "Lead", "Unknown"])
    .optional(),
  description: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  additionalInfo: z.string().optional(),
  notes: z.array(z.string()).optional(),
  recruiterName: z.string().optional(),
  postedAt: z.string().optional(),
  priority: z.enum(["P1", "P2", "P3"]).optional(),
  cvVersion: z.string().optional(),
  messageSent: z.boolean().optional(),
  nextFollowUpAt: z.string().optional(),
  lastContactAt: z.string().optional(),
  resources: z.array(resourceSchema).optional(),
  reminders: z.array(z.string()).optional(),
  history: z.array(timelineSchema).optional(),
  archived: z.boolean().optional(),
});

const jobCreateSchema = baseJobSchema;
const jobUpdateSchema = baseJobSchema.partial();

export const getJobs = async (req: AuthRequest, res: Response) => {
  const { search, track, status, archived } = req.query;
  const filter: Record<string, unknown> = { ownerId: req.userId };

  if (search && typeof search === "string") {
    const regex = { $regex: search, $options: "i" };
    filter.$or = [{ company: regex }, { title: regex }];
  }
  if (track && typeof track === "string" && track !== "Todas") {
    filter.track = track;
  }
  if (status && typeof status === "string" && status !== "Todas") {
    filter.status = status;
  }
  if (archived === "true") {
    filter.archived = true;
  } else if (archived === "false") {
    filter.archived = false;
  }

  const jobs = await JobModel.find(filter).sort({ date: -1, createdAt: -1 });
  res.json(jobs.map(mapJobResponse));
};

export const getJobById = async (req: AuthRequest, res: Response) => {
  const id = objectIdSchema.safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ message: "ID invalido" });

  const job = await JobModel.findOne({ _id: id.data, ownerId: req.userId });
  if (!job)
    return res.status(404).json({ message: "Candidatura nao encontrada" });
  res.json(mapJobResponse(job));
};

export const createJob = async (req: AuthRequest, res: Response) => {
  const payload = jobCreateSchema.parse(req.body);

  const job = await JobModel.create({
    ...payload,
    ownerId: req.userId,
    date: payload.date ?? new Date().toISOString().split("T")[0],
  });

  res.status(201).json(mapJobResponse(job));
};

export const updateJob = async (req: AuthRequest, res: Response) => {
  const id = objectIdSchema.safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ message: "ID invalido" });

  const updates = jobUpdateSchema.parse(req.body);
  const job = await JobModel.findOneAndUpdate(
    { _id: id.data, ownerId: req.userId },
    updates,
    {
      new: true,
    }
  );
  if (!job)
    return res.status(404).json({ message: "Candidatura nao encontrada" });
  res.json(mapJobResponse(job));
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
  const id = objectIdSchema.safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ message: "ID invalido" });

  const job = await JobModel.findOneAndDelete({
    _id: id.data,
    ownerId: req.userId,
  });
  if (!job)
    return res.status(404).json({ message: "Candidatura nao encontrada" });
  res.status(204).send();
};

export const importJobs = async (req: AuthRequest, res: Response) => {
  const bodySchema = z.object({ jobs: z.array(jobCreateSchema) });
  const { jobs } = bodySchema.parse(req.body);

  const prepared = jobs.map((job) => ({
    ...job,
    ownerId: req.userId,
  }));

  await JobModel.deleteMany({ ownerId: req.userId });
  await JobModel.insertMany(prepared);

  const saved = await JobModel.find({ ownerId: req.userId }).sort({
    date: -1,
    createdAt: -1,
  });
  res.status(201).json(saved.map(mapJobResponse));
};

export const exportJobs = async (req: AuthRequest, res: Response) => {
  const jobs = await JobModel.find({ ownerId: req.userId }).sort({
    date: -1,
    createdAt: -1,
  });
  res.json(jobs.map(mapJobResponse));
};

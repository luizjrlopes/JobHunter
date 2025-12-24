import Dexie, { Table } from "dexie";
import type { Job } from "../types";

export class JobHunterDB extends Dexie {
  jobs!: Table<Job, number>;

  constructor() {
    super("JobHunterDB");

    this.version(1).stores({
      jobs: "++id, company, position, track, status, date, archived",
    });
  }
}

export const db = new JobHunterDB();

// Funções auxiliares
export const getAllJobs = async (): Promise<Job[]> => {
  return await db.jobs.toArray();
};

export const addJobToDB = async (job: Job): Promise<number> => {
  return await db.jobs.add(job);
};

export const updateJobInDB = async (
  id: number,
  updates: Partial<Job>
): Promise<number> => {
  return await db.jobs.update(id, updates);
};

export const deleteJobFromDB = async (id: number): Promise<void> => {
  await db.jobs.delete(id);
};

export const bulkReplaceJobs = async (jobs: Job[]): Promise<void> => {
  await db.transaction("rw", db.jobs, async () => {
    await db.jobs.clear();
    await db.jobs.bulkAdd(jobs);
  });
};

export const searchJobs = async (term: string): Promise<Job[]> => {
  const lowerTerm = term.toLowerCase();
  return await db.jobs
    .filter(
      (job) =>
        job.company.toLowerCase().includes(lowerTerm) ||
        job.position.toLowerCase().includes(lowerTerm)
    )
    .toArray();
};

export const getJobsByStatus = async (status: string): Promise<Job[]> => {
  return await db.jobs.where("status").equals(status).toArray();
};

export const getArchivedJobs = async (): Promise<Job[]> => {
  return await db.jobs.filter((job) => job.archived === true).toArray();
};

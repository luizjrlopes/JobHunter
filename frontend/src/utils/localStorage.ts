import type { Job } from "../types";

const STORAGE_KEY = "jobhunter-crm-jobs";

export const loadJobsFromStorage = (): Job[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Erro ao carregar dados do localStorage:", error);
    return null as any;
  }
};

export const saveJobsToStorage = (jobs: Job[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch (error) {
    console.error("Erro ao salvar dados no localStorage:", error);
  }
};

export const clearJobsFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Erro ao limpar dados do localStorage:", error);
  }
};

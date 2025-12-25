import type { AuthUser, Job } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Erro ao chamar a API");
  }
  return (await response.json()) as T;
};

export const fetchJobs = async (): Promise<Job[]> => {
  const res = await fetch(`${API_URL}/jobs`, { headers: { ...getAuthHeaders() } });
  return handleResponse<Job[]>(res);
};

export const createJob = async (
  job: Omit<Job, "id" | "ownerId" | "createdAt" | "updatedAt">
): Promise<Job> => {
  const res = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(job),
  });
  return handleResponse<Job>(res);
};

export const patchJob = async (id: string, partial: Partial<Job>): Promise<Job> => {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(partial),
  });
  return handleResponse<Job>(res);
};

export const removeJob = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/jobs/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok && res.status !== 204) {
    const message = await res.text();
    throw new Error(message || "Erro ao remover vaga");
  }
};

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<{ token: string; user: AuthUser }>(res);
};

export const register = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse<{ token: string; user: AuthUser }>(res);
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};


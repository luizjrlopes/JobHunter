import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  Job,
  JobFilters,
  JobResource,
  JobStatus,
  JobTimelineEntry,
  JobTrack,
} from "../types";
import {
  IN_PROGRESS_STATUS,
  OFFER_STATUSES,
  CONCLUDING_STATUSES,
  LEAD_STATUS,
} from "../constants/jobStatusSets";
import { fetchJobs, createJob, patchJob, removeJob } from "../services/api";
import { useAuth } from "../hooks/useAuth";

interface AddJobPayload {
  // Campos principais
  title: string;
  company: string;
  track: JobTrack;
  status: JobStatus;
  date?: string;
  location?: string;
  externalLink?: string;
  priority?: "P1" | "P2" | "P3";
  cvVersion?: string;
  nextFollowUpAt?: string;
  archived?: boolean;

  // Detalhes da vaga
  employmentType?: "FullTime" | "PartTime" | "Contract" | "Internship" | "Unknown";
  workModel?: "remote" | "hybrid" | "on-site";
  seniority?: "Intern" | "Junior" | "Mid" | "Senior" | "Lead" | "Unknown";
  recruiterName?: string;
  description?: string;
  responsibilities?: string[];
  benefits?: string[];
  additionalInfo?: string;
  notes?: string[];
  postedAt?: string;

  resources?: JobResource[];
  reminders?: string[];
  history?: JobTimelineEntry[];
}

interface JobContextValue {
  jobs: Job[];
  isLoading: boolean;
  filteredJobs: Job[];
  filters: JobFilters;
  setFilters: (filters: JobFilters) => void;
  updateFilters: (partial: Partial<JobFilters>) => void;
  addJob: (payload: AddJobPayload) => void;
  deleteJob: (id: string) => void;
  updateJob: (id: string, partial: Partial<Job>) => void;
  addHistoryEntry: (id: string, entry: JobTimelineEntry) => void;
  addResource: (id: string, resource: JobResource) => void;
  removeResource: (id: string, index: number) => void;
  addReminder: (id: string, text: string) => void;
  removeReminder: (id: string, index: number) => void;
  toggleArchive: (id: string) => void;
  stats: {
    total: number;
    process: number;
    offers: number;
    ghosted: number;
    leads: number;
  };
}

export const JobContext = createContext<JobContextValue | null>(null);

const defaultFilters: JobFilters = {
  search: "",
  track: "Todas",
  status: "Todas",
};

const getCompany = (job: Job) => job.company ?? "";
const getRole = (job: Job) => job.title ?? "";

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFiltersState] = useState<JobFilters>(defaultFilters);

  useEffect(() => {
    const loadJobs = async () => {
      if (!token) {
        setJobs([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const remoteJobs = await fetchJobs();
        setJobs(remoteJobs);
      } catch (error) {
        console.error("Erro ao carregar jobs:", error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, [token]);

  const setFilters = (next: JobFilters) => setFiltersState(next);
  const updateFilters = (partial: Partial<JobFilters>) =>
    setFiltersState((prev) => ({ ...prev, ...partial }));

  const addJob = async (payload: AddJobPayload) => {
    if (!token) return;
    const now = new Date();
    const nextJob = {
      title: payload.title,
      company: payload.company,
      track: payload.track,
      status: payload.status,
      date: payload.date ?? now.toISOString().split("T")[0],
      location: payload.location,
      externalLink: payload.externalLink,
      priority: payload.priority ?? "P2",
      cvVersion: payload.cvVersion,
      nextFollowUpAt: payload.nextFollowUpAt,
      archived: payload.archived ?? false,
      employmentType: payload.employmentType,
      workModel: payload.workModel,
      seniority: payload.seniority,
      recruiterName: payload.recruiterName,
      description: payload.description,
      responsibilities: payload.responsibilities ?? [],
      benefits: payload.benefits ?? [],
      additionalInfo: payload.additionalInfo,
      notes: payload.notes ?? [],
      postedAt: payload.postedAt,
      resources: payload.resources ?? [],
      reminders: payload.reminders ?? [],
      history:
        (payload.history && payload.history.length > 0)
          ? payload.history
          : [
              {
                title: "Aplicacao enviada",
                subtitle: payload.date ?? now.toISOString().split("T")[0],
                icon: "check" as const,
                createdAt: now.toISOString(),
              },
            ],
    } as Omit<Job, "id" | "ownerId" | "createdAt" | "updatedAt">;

    try {
      const saved = await createJob(nextJob);
      setJobs((prev) => [saved, ...prev]);
    } catch (error) {
      console.error("Erro ao adicionar job:", error);
    }
  };

  const updateJob = async (id: string, partial: Partial<Job>) => {
    if (!token) return;
    try {
      const updatedJob = await patchJob(id, partial);
      setJobs((prev) => prev.map((job) => (job.id === id ? updatedJob : job)));
    } catch (error) {
      console.error("Erro ao atualizar job:", error);
    }
  };

  const addHistoryEntry = async (id: string, entry: JobTimelineEntry) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const newHistory = [...(job.history ?? []), entry];
    await updateJob(id, { history: newHistory });
  };

  const addResource = async (id: string, resource: JobResource) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const newResources = [...(job.resources ?? []), resource];
    await updateJob(id, { resources: newResources });
  };

  const removeResource = async (id: string, index: number) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const newResources = (job.resources ?? []).filter((_, i) => i !== index);
    await updateJob(id, { resources: newResources });
  };

  const addReminder = async (id: string, text: string) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const newReminders = [...(job.reminders ?? []), text];
    await updateJob(id, { reminders: newReminders });
  };

  const removeReminder = async (id: string, index: number) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const newReminders = (job.reminders ?? []).filter((_, i) => i !== index);
    await updateJob(id, { reminders: newReminders });
  };

  const toggleArchive = async (id: string) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const archiving = !job.archived;

    const now = new Date().toISOString();
    const entry = {
      title: archiving ? "Candidatura arquivada" : "Candidatura desarquivada",
      subtitle: `Status: ${job.status}`,
      icon: "activity" as const,
      createdAt: now,
    };

    await updateJob(id, {
      archived: archiving,
      history: [...(job.history ?? []), entry],
    });
  };

  const deleteJob = async (id: string) => {
    if (!token) return;
    try {
      await removeJob(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Erro ao deletar job:", error);
    }
  };

  const filteredJobs = useMemo(() => {
    const searchTerm = filters.search.toLowerCase();

    return jobs.filter((job) => {
      const company = getCompany(job).toLowerCase();
      const role = getRole(job).toLowerCase();
      const matchesSearch = company.includes(searchTerm) || role.includes(searchTerm);
      const matchesTrack = filters.track === "Todas" || job.track === filters.track;
      const matchesStatus = filters.status === "Todas" || job.status === filters.status;

      return matchesSearch && matchesTrack && matchesStatus;
    });
  }, [filters, jobs]);

  const stats = useMemo(() => {
    const activeJobs = jobs.filter((job) => !job.archived);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

    const PROCESS_STATUSES = IN_PROGRESS_STATUS;
    const isConcludingStatus = (s: JobStatus) => CONCLUDING_STATUSES.includes(s);

    const toLocalDate = (dateStr: string) =>
      dateStr.includes("T") ? new Date(dateStr) : new Date(`${dateStr}T00:00:00`);

    const isInCurrentMonth = (dateStr: string) => {
      const d = toLocalDate(dateStr);
      return d >= startOfMonth && d <= now;
    };

    const getOfferEventDate = (job: Job): Date | null => {
      // Procura um evento de proposta/aceite no histórico; fallback para updatedAt
      const keywords = [/proposta/i, /oferta/i, /offer/i, /aceit/i, /accepted/i];
      const offerEntry = (job.history ?? []).slice().reverse().find((e) => {
        const t = e.title ?? "";
        return keywords.some((k) => k.test(t));
      });
      if (offerEntry?.createdAt) return toLocalDate(offerEntry.createdAt);
      if (job.updatedAt) return toLocalDate(job.updatedAt);
      return null;
    };

    return {
      // Total: candidaturas enviadas no mês atual (todos os status exceto Lead)
      total: jobs.filter((job) => job.status !== LEAD_STATUS && isInCurrentMonth(job.date)).length,

      // Em processo: statuses ativos (sem filtro por mês)
      process: activeJobs.filter((job) => PROCESS_STATUSES.includes(job.status)).length,

      // Ofertas/aceites: usar data do evento no histórico (ou updatedAt) para validar mês atual
      offers: activeJobs.filter((job) => {
        if (!OFFER_STATUSES.includes(job.status)) return false;
        const d = getOfferEventDate(job);
        return !!d && d >= startOfMonth && d <= now;
      }).length,

      // Sem resposta: candidaturas ativas com follow-up vencido (nextFollowUpAt passado). Exclui concluídas
      ghosted: activeJobs.filter((job) => {
        if (!PROCESS_STATUSES.includes(job.status)) return false;
        if (isConcludingStatus(job.status)) return false;
        if (!job.nextFollowUpAt) return false;
        const next = toLocalDate(job.nextFollowUpAt);
        return next < now;
      }).length,

      // Leads do mês: vagas salvas ainda não aplicadas, filtradas por date
      leads: jobs.filter((job) => job.status === LEAD_STATUS && isInCurrentMonth(job.date)).length,
    };
  }, [jobs]);

  const value: JobContextValue = {
    jobs,
    isLoading,
    filteredJobs,
    filters,
    setFilters,
    updateFilters,
    addJob,
    deleteJob,
    updateJob,
    addHistoryEntry,
    addResource,
    removeResource,
    addReminder,
    removeReminder,
    toggleArchive,
    stats,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export const jobTracks: JobTrack[] = [
  "AI",
  "FULL_STACK",
  "CLOUD",
];
export const jobStatuses: JobStatus[] = [
  "Lead",
  "Applied",
  "Viewed",
  "Contacted",
  "Interview",
  "TechnicalTest",
  "Offer",
  "Accepted",
  "Rejected",
  "Withdrawn",
  "Closed",
];


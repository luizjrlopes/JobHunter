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
  getAllJobs,
  updateJobInDB,
  addJobToDB,
  deleteJobFromDB,
  bulkReplaceJobs,
} from "../utils/db";
import {
  autoBackupJobs,
  exportJobsToJSON,
  importJobsFromJSON,
} from "../utils/backup";

interface JobContextValue {
  jobs: Job[];
  filteredJobs: Job[];
  filters: JobFilters;
  setFilters: (filters: JobFilters) => void;
  updateFilters: (partial: Partial<JobFilters>) => void;
  addJob: (payload: Omit<Job, "id" | "date"> & { date?: string }) => void;
  deleteJob: (id: number) => void;
  updateJob: (id: number, partial: Partial<Job>) => void;
  addHistoryEntry: (id: number, entry: JobTimelineEntry) => void;
  addResource: (id: number, resource: JobResource) => void;
  removeResource: (id: number, index: number) => void;
  addReminder: (id: number, text: string) => void;
  removeReminder: (id: number, index: number) => void;
  toggleArchive: (id: number) => void;
  exportBackup: () => void;
  importBackup: (file: File) => Promise<void>;
  stats: {
    total: number;
    process: number;
    offers: number;
    ghosted: number;
  };
}

// Função para gerar dados iniciais com datas dinâmicas
const getInitialJobs = (): Job[] => {
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const twentyDaysAgo = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return [
    {
      id: 1,
      company: "TechFlow",
      position: "Senior Frontend Dev",
      track: "Frontend",
      status: "Entrevista",
      date: twoDaysAgo,
      externalLink: "#",
      notes:
        "A empresa utiliza uma stack moderna com Next.js 14 e Tailwind CSS. Na primeira conversa com o RH, mencionaram que o foco da vaga é performance e acessibilidade. Próximo passo é o live coding com o Tech Lead. Disseram que valorizam muito testes unitários com Vitest.",
      resources: [
        { label: "Meu Currículo (v2)", href: "#" },
        { label: "TechFlow - site", href: "#" },
      ],
      reminders: [
        "Revisar SSR e Server Components",
        "Focar em otimização de imagem",
      ],
      history: [
        {
          title: "Aplicação enviada",
          subtitle: new Date(
            now.getTime() - 2 * 24 * 60 * 60 * 1000
          ).toLocaleDateString("pt-BR"),
          icon: "check",
          createdAt: new Date(
            now.getTime() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        {
          title: "Status atual",
          subtitle: "Entrevista",
          icon: "clock",
          createdAt: now.toISOString(),
        },
      ],
      archived: false,
    },
    {
      id: 2,
      company: "DataSphere",
      position: "AI Researcher",
      track: "Dados",
      status: "Aplicada",
      date: twentyDaysAgo,
    },
    {
      id: 3,
      company: "CloudWorks",
      position: "DevOps Engineer",
      track: "Backend",
      status: "Recusada",
      date: sixtyDaysAgo,
    },
    {
      id: 4,
      company: "Creative Minds",
      position: "Product Designer",
      track: "Design",
      status: "Oferta",
      date: sixtyDaysAgo,
    },
    {
      id: 5,
      company: "NextGen Bank",
      position: "Java Developer",
      track: "Backend",
      status: "Ghosted",
      date: ninetyDaysAgo,
    },
  ];
};

const initialJobs: Job[] = getInitialJobs();

export const JobContext = createContext<JobContextValue | null>(null);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  // Carregar jobs do IndexedDB
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFiltersState] = useState<JobFilters>({
    search: "",
    track: "Todas",
    status: "Todas",
  });

  // Carregar jobs do IndexedDB ao montar
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const storedJobs = await getAllJobs();
        if (storedJobs.length === 0) {
          // Se não houver dados, gerar jobs iniciais com datas atualizadas
          const freshInitialJobs = getInitialJobs();
          await bulkReplaceJobs(freshInitialJobs);
          setJobs(freshInitialJobs);
        } else {
          setJobs(storedJobs);
        }
      } catch (error) {
        console.error("Erro ao carregar jobs:", error);
        const freshInitialJobs = getInitialJobs();
        setJobs(freshInitialJobs);
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);

  const setFilters = (next: JobFilters) => setFiltersState(next);
  const updateFilters = (partial: Partial<JobFilters>) =>
    setFiltersState((prev) => ({ ...prev, ...partial }));

  const addJob = async (
    payload: Omit<Job, "id" | "date"> & { date?: string }
  ) => {
    const now = new Date();
    const nextJob: Job = {
      ...payload,
      id: Date.now(),
      date: payload.date ?? now.toISOString().split("T")[0],
    };
    try {
      await addJobToDB(nextJob);
      setJobs((prev) => [nextJob, ...prev]);
      autoBackupJobs([nextJob, ...jobs]);
    } catch (error) {
      console.error("Erro ao adicionar job:", error);
    }
  };

  const updateJob = async (id: number, partial: Partial<Job>) => {
    try {
      await updateJobInDB(id, partial);
      setJobs((prev) => {
        const updated = prev.map((job) =>
          job.id === id ? { ...job, ...partial } : job
        );
        autoBackupJobs(updated);
        return updated;
      });
    } catch (error) {
      console.error("Erro ao atualizar job:", error);
    }
  };

  const addHistoryEntry = async (id: number, entry: JobTimelineEntry) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const newHistory = [...(job.history ?? []), entry];
    await updateJob(id, { history: newHistory });
  };

  const addResource = async (id: number, resource: JobResource) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const newResources = [...(job.resources ?? []), resource];
    await updateJob(id, { resources: newResources });
  };

  const removeResource = async (id: number, index: number) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const newResources = (job.resources ?? []).filter((_, i) => i !== index);
    await updateJob(id, { resources: newResources });
  };

  const addReminder = async (id: number, text: string) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const newReminders = [...(job.reminders ?? []), text];
    await updateJob(id, { reminders: newReminders });
  };

  const removeReminder = async (id: number, index: number) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const newReminders = (job.reminders ?? []).filter((_, i) => i !== index);
    await updateJob(id, { reminders: newReminders });
  };

  const toggleArchive = async (id: number) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const archiving = !job.archived;

    const mapOnArchive: Record<JobStatus, JobStatus> = {
      Aplicada: "Desistencia",
      Entrevista: "Eliminado",
      Oferta: "Recusada",
      Recusada: "Recusada",
      Ghosted: "Ghosted",
      Eliminado: "Eliminado",
      Desistencia: "Desistencia",
    };
    const mapOnUnarchive: Record<JobStatus, JobStatus> = {
      Desistencia: "Aplicada",
      Eliminado: "Entrevista",
      Recusada: "Oferta",
      Aplicada: "Aplicada",
      Entrevista: "Entrevista",
      Oferta: "Oferta",
      Ghosted: "Ghosted",
    };

    const nextStatus = archiving
      ? mapOnArchive[job.status as JobStatus] ?? job.status
      : mapOnUnarchive[job.status as JobStatus] ?? job.status;

    const now = new Date().toISOString();
    const entry = {
      title: archiving ? "Candidatura arquivada" : "Candidatura desarquivada",
      subtitle: `Status alterado para ${nextStatus}`,
      icon: "activity" as const,
      createdAt: now,
    };

    await updateJob(id, {
      archived: archiving,
      status: nextStatus,
      history: [...(job.history ?? []), entry],
    });
  };

  const deleteJob = async (id: number) => {
    try {
      await deleteJobFromDB(id);
      setJobs((prev) => {
        const updated = prev.filter((job) => job.id !== id);
        autoBackupJobs(updated);
        return updated;
      });
    } catch (error) {
      console.error("Erro ao deletar job:", error);
    }
  };

  const exportBackup = () => {
    exportJobsToJSON(jobs);
  };

  const importBackup = async (file: File) => {
    try {
      const importedJobs = await importJobsFromJSON(file);
      await bulkReplaceJobs(importedJobs);
      setJobs(importedJobs);
      autoBackupJobs(importedJobs);
    } catch (error) {
      console.error("Erro ao importar backup:", error);
      throw error;
    }
  };

  const filteredJobs = useMemo(() => {
    const searchTerm = filters.search.toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        job.company.toLowerCase().includes(searchTerm) ||
        job.position.toLowerCase().includes(searchTerm);
      const matchesTrack =
        filters.track === "Todas" || job.track === filters.track;
      const matchesStatus =
        filters.status === "Todas" || job.status === filters.status;

      return matchesSearch && matchesTrack && matchesStatus;
    });
  }, [filters, jobs]);

  const stats = useMemo(() => {
    const activeJobs = jobs.filter((job) => !job.archived);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

    const toLocalDate = (dateStr: string) =>
      dateStr.includes("T")
        ? new Date(dateStr)
        : new Date(`${dateStr}T00:00:00`);

    const isInCurrentMonth = (jobDate: string) => {
      const d = toLocalDate(jobDate);
      return d >= startOfMonth && d <= now;
    };

    const hasNoRecentActivity = (job: Job): boolean => {
      // Se tiver histórico, usa a última atividade
      if (job.history && job.history.length > 0) {
        const lastEvent = job.history[job.history.length - 1];
        if (lastEvent.createdAt) {
          const lastEventDate = new Date(lastEvent.createdAt);
          return lastEventDate < fifteenDaysAgo;
        }
      }
      // fallback: data de aplicação
      const applicationDate = toLocalDate(job.date);
      return applicationDate < fifteenDaysAgo;
    };

    return {
      // Total de candidaturas no mês (independente de status e arquivamento)
      total: jobs.filter((job) => isInCurrentMonth(job.date)).length,

      // Em Processo = Aplicada ou Entrevista (no mês) e não arquivadas
      process: activeJobs.filter(
        (job) =>
          (job.status === "Aplicada" || job.status === "Entrevista") &&
          isInCurrentMonth(job.date)
      ).length,

      // Ofertas recebidas no mês (não arquivadas)
      offers: activeJobs.filter(
        (job) => job.status === "Oferta" && isInCurrentMonth(job.date)
      ).length,

      // Sem Resposta = Ghosted OU (Aplicada/Entrevista sem atividade há 15 dias) — somente ativas
      ghosted: activeJobs.filter((job) => {
        if (job.status === "Ghosted") return true;
        if (job.status === "Aplicada" || job.status === "Entrevista") {
          return hasNoRecentActivity(job);
        }
        return false;
      }).length,
    };
  }, [jobs]);

  const value: JobContextValue = {
    jobs,
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
    exportBackup,
    importBackup,
    stats,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export const jobTracks: Job["track"][] = [
  "Full Stack",
  "Frontend",
  "Backend",
  "Mobile",
  "Design",
  "Dados",
];
export const jobStatuses: JobStatus[] = [
  "Aplicada",
  "Entrevista",
  "Oferta",
  "Recusada",
  "Ghosted",
  "Eliminado",
  "Desistencia",
];

export type JobStatus =
  | "Aplicada"
  | "Entrevista"
  | "Oferta"
  | "Recusada"
  | "Ghosted"
  | "Eliminado"
  | "Desistencia";

export type JobTrack =
  | "Full Stack"
  | "Frontend"
  | "Backend"
  | "Mobile"
  | "Design"
  | "Dados";

export type TimelineIconKind = "check" | "clock" | "activity";

export interface JobTimelineEntry {
  title: string;
  subtitle: string;
  icon?: TimelineIconKind;
  createdAt?: string; // ISO timestamp
}

export interface JobResource {
  label: string;
  href: string;
}

export interface Job {
  id: number;
  company: string;
  position: string;
  track: JobTrack;
  status: JobStatus;
  date: string; // ISO string yyyy-mm-dd
  location?: string;
  externalLink?: string;
  notes?: string;
  resources?: JobResource[];
  reminders?: string[];
  history?: JobTimelineEntry[];
  archived?: boolean;
}

export interface JobFilters {
  search: string;
  track: JobTrack | "Todas";
  status: JobStatus | "Todas";
}

export type JobStatus =
  | "Lead"
  | "Applied"
  | "Viewed"
  | "Contacted"
  | "Interview"
  | "TechnicalTest"
  | "Offer"
  | "Accepted"
  | "Rejected"
  | "Withdrawn"
  | "Closed";

export type JobTrack = "AI" | "FULL_STACK" | "CLOUD";

export type WorkModel = "remote" | "hybrid" | "on-site";
export type EmploymentType = "FullTime" | "PartTime" | "Contract" | "Internship" | "Unknown";
export type Seniority = "Intern" | "Junior" | "Mid" | "Senior" | "Lead" | "Unknown";

export type TimelineIconKind = 
  | "search" | "send" | "eye" | "message" | "users" 
  | "code" | "terminal" | "briefcase" | "file-text" 
  | "check-circle" | "flag" | "check" | "clock" | "activity";

export interface JobTimelineEntry {
  title: string;
  subtitle: string;
  icon?: TimelineIconKind;
  createdAt?: string; // ISO timestamp
}

export interface JobResource {
  label: string;
  href?: string;
}

export interface Job {
  id: string;
  ownerId?: string;
  title: string; // Título da vaga
  company: string;
  track: JobTrack;
  date: string; // ISO string (yyyy-mm-dd)
  status: JobStatus;
  location?: string;
  externalLink?: string;
  employmentType?: EmploymentType;
  workModel?: WorkModel;
  seniority?: Seniority;
  description?: string; // Descrição da vaga
  responsibilities?: string[]; // Array de strings
  benefits?: string[]; // Array de strings
  additionalInfo?: string; // Info adicional
  notes?: string[]; // Observações livres
  recruiterName?: string;
  postedAt?: string; // Data de postagem
  priority?: "P1" | "P2" | "P3";
  cvVersion?: string;
  nextFollowUpAt?: string;
  resources?: JobResource[];
  reminders?: string[];
  history?: JobTimelineEntry[];
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobFilters {
  search: string;
  track: JobTrack | "Todas";
  status: JobStatus | "Todas";
}

export interface Skill {
  name: string;
  level?: "Basic" | "Intermediate" | "Advanced";
  tracks?: string[];
}

export interface Certification {
  title: string;
  issuer?: string;
  year?: number;
  tracks?: string[];
}

export interface Profile {
  headline?: string;
  activeTrack?: "AI" | "FULL_STACK" | "CLOUD";
  skills?: Skill[];
  certifications?: Certification[];
  languages?: string[];
  portfolioLinks?: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profile?: Profile;
}


import type { JobStatus } from "../types";

// Status em processo (ativos)
export const IN_PROGRESS_STATUS: JobStatus[] = [
  "Applied",
  "Viewed",
  "Contacted",
  "Interview",
  "TechnicalTest",
];

// Status de oferta/aceite
export const OFFER_STATUSES: JobStatus[] = [
  "Offer",
  "Accepted",
];

// Status que concluem o processo (não entram em "em processo" / "sem resposta")
export const CONCLUDING_STATUSES: JobStatus[] = [
  "Offer",
  "Accepted",
  "Rejected",
  "Withdrawn",
  "Closed",
];

// Status lead (vagas salvas)
export const LEAD_STATUS: JobStatus = "Lead";

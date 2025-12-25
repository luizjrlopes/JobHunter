import { Schema, model, Types } from "mongoose";

type JobStatus =
  | "Lead" // vaga salva, ainda não aplicada
  | "Applied" // candidatura enviada
  | "Viewed" // candidatura visualizada
  | "Contacted" // recrutador entrou em contato
  | "Interview" // em processo de entrevistas
  | "TechnicalTest" // teste técnico em andamento
  | "Offer" // proposta recebida
  | "Accepted" // proposta aceita
  | "Rejected" // rejeitado (em qualquer etapa)
  | "Withdrawn" // candidatura retirada por você
  | "Closed"; // processo encerrado (genérico)

const ResourceSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String },
  },
  { _id: false }
);
/** Histórico de eventos (aplicada, follow-up, entrevista...) */
const TimelineSchema = new Schema(
  {
    title: { type: String, required: true }, // ex: "Candidatura enviada"
    subtitle: { type: String, required: true }, // ex: "LinkedIn Easy Apply"
    icon: { type: String }, // ex: "send", "message", "call"
    createdAt: { type: String }, // ISO string
  },
  { _id: false }
);
const JobSchema = new Schema(
  {
    ownerId: { type: Types.ObjectId, required: true, index: true },
    // title é title e position no front
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },
    track: {
      type: String,
      enum: ["AI", "FULL_STACK", "CLOUD"],
      default: "AI",
    },
    date: { type: String, required: true }, // data principal (ex: aplicada)
    status: { type: String as () => JobStatus, required: true }, // ex: Lead/Applied/Interview/Offer...
    location: {
      type: String, // ex: "Minas Gerais"
      trim: true,
    },
    externalLink: { type: String }, // link principal (atalho)

    employmentType: {
      type: String,
      enum: ["FullTime", "PartTime", "Contract", "Internship", "Unknown"],
      default: "Unknown",
    },

    workModel: {
      type: String,
      enum: ["remote", "hybrid", "on-site"],
      default: "remote",
    },

    seniority: {
      type: String,
      enum: ["Intern", "Junior", "Mid", "Senior", "Lead", "Unknown"],
      default: "Unknown",
    },
    // area sobre a vaga no front
    description: {
      type: String,
    },
    responsibilities: {
      type: [String],
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    additionalInfo: {
      type: String,
    },

    notes: {
      type: [String],
      default: [],
    },

    recruiterName: { type: String },
    // quando foi postado na plataforma visualizada
    postedAt: {
      type: Date,
      default: Date.now,
    },

    // --- Operação de candidatura ---
    priority: { type: String, enum: ["P1", "P2", "P3"], default: "P2" },
    cvVersion: { type: String, trim: true },
    nextFollowUpAt: { type: Date },

    // --- Recursos e histórico ---
    //Recursos:Site da Empresa, Perfil do CTO
    resources: [ResourceSchema],
    reminders: [String],
    history: [TimelineSchema],

    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const JobModel = model("Job", JobSchema);

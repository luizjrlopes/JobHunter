import { Schema, model, Types } from "mongoose";

/**
 * Skill individual do usuário
 * Ex: Python, FastAPI, React
 */
const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    level: {
      type: String,
      enum: ["Basic", "Intermediate", "Advanced"],
      default: "Basic",
    },
    tracks: {
      type: [String],
      enum: ["AI", "FULL_STACK", "CLOUD"],
      default: [],
    },
  },
  { _id: false }
);

/**
 * Certificações profissionais
 */
const CertificationSchema = new Schema(
  {
    title: { type: String, required: true }, // ex: "AZ-104"
    issuer: { type: String }, // ex: "Microsoft"
    year: { type: Number },
    tracks: {
      type: [String],
      enum: ["AI", "FULL_STACK", "CLOUD"],
      default: [],
    },
  },
  { _id: false }
);

/**
 * Perfil profissional estruturado
 */
const ProfileSchema = new Schema(
  {
    headline: { type: String }, // resumo curto
    activeTrack: {
      type: String,
      enum: ["AI", "FULL_STACK", "CLOUD"],
    },
    skills: [SkillSchema],
    certifications: [CertificationSchema],
    languages: [String], // ex: ["English - Advanced"]
    portfolioLinks: [String],
  },
  { _id: false }
);

/**
 * Usuário
 */
const UserSchema = new Schema(
  {
    // Identidade
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },

    // Autenticação (mantém seu padrão atual)
    provider: { type: String }, // ex: "google", "github"
    providerId: { type: String },
    // Senha (hash)
    passwordHash: { type: String, required: true },

    // Perfil profissional (NOVO, mas opcional)
    profile: { type: ProfileSchema, default: {} },

    // Configurações gerais
    createdAt: { type: String },
    updatedAt: { type: String },

    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model("User", UserSchema);

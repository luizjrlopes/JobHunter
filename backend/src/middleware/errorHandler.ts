import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ message: "Rota n\u00e3o encontrada" });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Dados inválidos",
      issues: err.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    });
  }

  console.error(err);
  res.status(500).json({ message: "Erro interno do servidor" });
};

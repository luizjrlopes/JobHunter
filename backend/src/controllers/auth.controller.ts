import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserModel } from "../models/user.model";
import { env } from "../config/env";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const signToken = (userId: string) =>
  jwt.sign({ userId }, env.jwtSecret, { expiresIn: "7d" });

const buildUserPayload = (user: any) => {
  const id = user?.id ?? user?._id?.toString();
  return {
    id,
    name: user?.name,
    email: user?.email,
    avatar: user?.avatar,
    profile: user?.profile ?? {},
  };
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = registerSchema.parse(req.body);

  const exists = await UserModel.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: "Email ja cadastrado" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    name,
    email,
    passwordHash,
    profile: {},
  });
  const token = signToken(String((user as any).id ?? (user as any)._id));

  res.status(201).json({
    token,
    user: buildUserPayload(user),
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(401).json({ message: "Credenciais invalidas" });

  const isValid = await bcrypt.compare(
    password,
    (user as any).passwordHash ?? ""
  );
  if (!isValid)
    return res.status(401).json({ message: "Credenciais invalidas" });

  const token = signToken(String((user as any).id ?? (user as any)._id));
  res.json({ token, user: buildUserPayload(user) });
};

import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  username: z.string().min(2).max(32),
  password: z.string().min(8),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const CreateGameSchema = z.object({
  title: z.string().min(1).max(64),
  description: z.string().max(512).default(""),
});

export const SaveGameSchema = z.object({
  worldData: z.record(z.unknown()),
  scripts: z.record(z.string()),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

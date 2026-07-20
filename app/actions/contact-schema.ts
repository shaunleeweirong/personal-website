import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please tell me your name.").max(100, "Please keep your name under 100 characters."),
  email: z.string().email("That email doesn't look right.").max(254, "That email doesn't look right."),
  message: z.string().min(10, "Tell me a little more — at least 10 characters.").max(5000, "Please keep it under 5,000 characters."),
});

export type ContactState = { status: "idle" | "success" | "error"; message: string; values?: { name: string; email: string; message: string } };

import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please tell me your name."),
  email: z.string().email("That email doesn't look right."),
  message: z.string().min(10, "Tell me a little more — at least 10 characters."),
});

export type ContactState = { status: "idle" | "success" | "error"; message: string };

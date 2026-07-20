"use server";

import { z } from "zod";
import { Resend } from "resend";

export const contactSchema = z.object({
  name: z.string().min(2, "Please tell me your name."),
  email: z.string().email("That email doesn't look right."),
  message: z.string().min(10, "Tell me a little more — at least 10 characters."),
});

export type ContactState = { status: "idle" | "success" | "error"; message: string };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // honeypot: real users never fill this hidden field
  if (formData.get("company")) return { status: "success", message: "Thanks — I'll get back to you soon." };

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    return { status: "error", message: "The form isn't wired up yet — reach me on LinkedIn instead." };
  }

  try {
    const resend = new Resend(key);
    await resend.emails.send({
      from: "Website <onboarding@resend.dev>", // replace with verified domain sender at deploy
      to,
      replyTo: parsed.data.email,
      subject: `Website contact from ${parsed.data.name}`,
      text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
    });
    return { status: "success", message: "Thanks — I'll get back to you soon." };
  } catch (err) {
    console.error("contact delivery failed", err);
    return { status: "error", message: "Something broke on my end — reach me on LinkedIn instead." };
  }
}

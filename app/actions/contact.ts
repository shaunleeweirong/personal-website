"use server";

import { Resend } from "resend";
import { contactSchema, type ContactState } from "@/app/actions/contact-schema";

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // honeypot: real users never fill this hidden field
  if (formData.get("company")) return { status: "success", message: "Thanks — I'll get back to you soon." };

  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message, values };
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    return { status: "error", message: "The form isn't wired up yet — reach me on LinkedIn instead.", values };
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
    return { status: "error", message: "Something broke on my end — reach me on LinkedIn instead.", values };
  }
}

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { contactSchema } from "@/app/actions/contact-schema";
import { submitContact } from "@/app/actions/contact";
import type { ContactState } from "@/app/actions/contact-schema";

describe("contact validation", () => {
  it("accepts a valid submission", () => {
    const r = contactSchema.safeParse({ name: "Ada", email: "ada@example.com", message: "Hello there, Shaun!" });
    expect(r.success).toBe(true);
  });
  it("rejects bad email and short message", () => {
    expect(contactSchema.safeParse({ name: "Ada", email: "nope", message: "Hello there!" }).success).toBe(false);
    expect(contactSchema.safeParse({ name: "Ada", email: "ada@example.com", message: "hi" }).success).toBe(false);
  });
});

const idle: ContactState = { status: "idle", message: "" };

function fd(entries: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) f.set(k, v);
  return f;
}

describe("submitContact action", () => {
  beforeEach(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_TO_EMAIL;
  });

  it("returns fake success when honeypot is filled (bot)", async () => {
    const r = await submitContact(idle, fd({ company: "spambot", name: "x", email: "bad", message: "y" }));
    expect(r).toEqual({ status: "success", message: "Thanks — I'll get back to you soon." });
  });

  it("returns first validation error message for short name", async () => {
    const r = await submitContact(idle, fd({ name: "A", email: "ada@example.com", message: "Hello there, Shaun!" }));
    expect(r.status).toBe("error");
    expect(r.message).toBe("Please tell me your name.");
  });

  it("returns LinkedIn-pointing error when env is not configured", async () => {
    const r = await submitContact(idle, fd({ name: "Ada", email: "ada@example.com", message: "Hello there, Shaun!" }));
    expect(r.status).toBe("error");
    expect(r.message).toContain("LinkedIn");
  });
});

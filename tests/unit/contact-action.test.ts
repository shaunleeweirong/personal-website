import { describe, it, expect } from "vitest";
import { contactSchema } from "@/app/actions/contact";

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

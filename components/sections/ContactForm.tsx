"use client";
import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { contact, site } from "@/lib/content";

const initial: ContactState = { status: "idle", message: "" };
const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-[#22d3ee]/60 focus:outline-none";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.status === "success") {
    return <p role="status" className="text-sm text-[#67e8f9]">{state.message}</p>;
  }

  return (
    <form action={action} className="space-y-3 text-left">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <label className="block text-xs text-body">
        Name
        <input name="name" required minLength={2} className={`mt-1 ${inputClass}`} placeholder="Your name" />
      </label>
      <label className="block text-xs text-body">
        Email
        <input name="email" type="email" required className={`mt-1 ${inputClass}`} placeholder="you@company.com" />
      </label>
      <label className="block text-xs text-body">
        Message
        <textarea name="message" required minLength={10} rows={4} className={`mt-1 ${inputClass}`} placeholder="What are you building?" />
      </label>
      {state.status === "error" && (
        <p role="alert" className="text-xs text-red-400">
          {state.message}{" "}
          <a href={site.linkedInUrl} className="underline" target="_blank" rel="noopener noreferrer">
            LinkedIn ↗
          </a>
        </p>
      )}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] disabled:opacity-50"
        >
          {pending ? "Sending…" : contact.ctaPrimary}
        </button>
        <a href={site.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 underline-offset-4 hover:underline">
          {contact.ctaSecondary} ↗
        </a>
      </div>
    </form>
  );
}

import { contact, site } from "@/lib/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GradientText } from "@/components/ui/GradientText";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";

export function Contact() {
  const formConfigured = Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
  return (
    <section id={contact.id} className="relative overflow-hidden border-t border-white/[0.06] px-6 py-20 text-center sm:px-12">
      <div aria-hidden className="pointer-events-none absolute -bottom-36 left-1/2 h-72 w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(124,58,237,0.2),transparent_70%)]" />
      <div className="relative mx-auto max-w-xl">
        <Reveal>
          <SectionLabel>{contact.label}</SectionLabel>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {contact.headline}
            <br />
            <GradientText>{contact.headlineGradient}</GradientText>
          </h2>
          <p className="mt-3 text-sm text-body">{contact.sub}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          {formConfigured ? (
            <ContactForm />
          ) : (
            <a
              href={site.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-7 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            >
              {contact.ctaSecondary} ↗
            </a>
          )}
        </Reveal>
      </div>
    </section>
  );
}

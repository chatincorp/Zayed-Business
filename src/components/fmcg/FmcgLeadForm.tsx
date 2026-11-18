import { useState } from "react";
import { Link } from "react-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { isBackendConfigured } from "@/lib/backend";
import { FMCG_CONTACT, FMCG_SERVICES } from "@/data/fmcg";
import { ArrowRight, CheckCircle2, Loader2, Mail, Phone } from "lucide-react";

interface EnquiryInput {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  service: string;
  monthlyVolume?: string;
  message: string;
}

const volumeOptions = [
  "Under KES 500,000 / month",
  "KES 500,000 – 2M / month",
  "KES 2M – 10M / month",
  "Over KES 10M / month",
  "Not sure yet",
];

const inputClass =
  "w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20";

function FmcgLeadForm({
  onSubmit,
}: {
  onSubmit?: (input: EnquiryInput) => Promise<unknown>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onSubmit) return;
    setError(null);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await onSubmit({
        name: String(form.get("name") ?? ""),
        businessName: String(form.get("businessName") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        service: String(form.get("service") ?? ""),
        monthlyVolume: String(form.get("monthlyVolume") ?? "") || undefined,
        message: String(form.get("message") ?? ""),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="font-display text-xl font-bold text-foreground">Enquiry received</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          The FMCG desk will review your brief and respond within one business day.
          For urgent requirements call{" "}
          <a href="tel:+254114712989" className="font-semibold text-foreground">
            {FMCG_CONTACT.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fmcg-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Full name *
          </label>
          <input id="fmcg-name" name="name" required className={inputClass} placeholder="Your full name" />
        </div>
        <div>
          <label htmlFor="fmcg-business" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Business name *
          </label>
          <input id="fmcg-business" name="businessName" required className={inputClass} placeholder="Company or trading name" />
        </div>
        <div>
          <label htmlFor="fmcg-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Work email *
          </label>
          <input id="fmcg-email" name="email" type="email" required className={inputClass} placeholder="you@company.com" />
        </div>
        <div>
          <label htmlFor="fmcg-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Phone / WhatsApp *
          </label>
          <input id="fmcg-phone" name="phone" type="tel" required className={inputClass} placeholder="+254 7xx xxx xxx" />
        </div>
        <div>
          <label htmlFor="fmcg-service" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Service needed *
          </label>
          <select id="fmcg-service" name="service" required className={inputClass} defaultValue="">
            <option value="" disabled>Select a service</option>
            {FMCG_SERVICES.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
            <option value="FMCG wholesale supply">FMCG wholesale supply</option>
            <option value="FMCG supplier registration">FMCG supplier registration</option>
            <option value="Not sure yet">Not sure yet — advise me</option>
          </select>
        </div>
        <div>
          <label htmlFor="fmcg-volume" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Monthly volume
          </label>
          <select id="fmcg-volume" name="monthlyVolume" className={inputClass} defaultValue="">
            <option value="">Prefer not to say</option>
            {volumeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="fmcg-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          What do you need help with? *
        </label>
        <textarea
          id="fmcg-message"
          name="message"
          required
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Products, territory, current distribution and the outcome you want."
        />
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {onSubmit
            ? "We reply within one business day. No spam, ever."
            : "Live submissions are offline in this static build."}
        </p>
        {onSubmit ? (
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-[#E8C56A] px-6 py-3 text-sm font-semibold text-[#1a1305] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitting ? "Sending..." : "Send enquiry"}
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>
        ) : (
          <a
            href={`mailto:${FMCG_CONTACT.email}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
          >
            <Mail className="h-4 w-4" /> Email the FMCG desk
          </a>
        )}
      </div>
    </form>
  );
}

function LiveEnquiryForm() {
  const createEnquiry = useMutation(api.fmcg.createEnquiry);
  return (
    <FmcgLeadForm
      onSubmit={async (input) => {
        await createEnquiry(input);
      }}
    />
  );
}

export default function FmcgEnquirySection() {
  return (
    <section id="fmcg-enquiry" className="scroll-mt-24 bg-[#faf7f0] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr,1.15fr] lg:gap-16">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Talk to the FMCG desk
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight text-navy sm:text-4xl">
              Tell us what needs to move.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Whether you are launching a brand, fixing a route-to-market, or looking
              for dependable wholesale supply, start with a short brief. We will come
              back with a practical next step — not a generic brochure.
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={`mailto:${FMCG_CONTACT.email}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-navy transition-colors hover:border-amber-400"
              >
                <Mail className="h-4 w-4 text-amber-600" />
                {FMCG_CONTACT.email}
              </a>
              <a
                href="tel:+254114712989"
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm font-medium text-navy transition-colors hover:border-amber-400"
              >
                <Phone className="h-4 w-4 text-amber-600" />
                {FMCG_CONTACT.phone}
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Suppliers
              </p>
              <p className="mt-2 text-sm leading-relaxed text-amber-900/75">
                Ready to list your products? Register your business and upload your
                documents. Approved suppliers get a product dashboard and access to
                wholesale demand.
              </p>
              <Link
                to="/supplier/register"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-800 hover:underline"
              >
                Start supplier registration <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {isBackendConfigured ? <LiveEnquiryForm /> : <FmcgLeadForm />}
          </div>
        </div>
      </div>
    </section>
  );
}

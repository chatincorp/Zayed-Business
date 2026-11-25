import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import { countries, getOfficeForCountry } from "@/data/countries";
import {
  Calendar,
  Users,
  MessageSquare,
  FileText,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { useSEO } from "@/lib/seo";
import { useContactSubmitter } from "@/lib/siteContent";

const tabs = [
  { id: "appointment", label: "Book an Appointment", icon: Calendar },
  { id: "meeting", label: "Schedule a Meeting", icon: Users },
  { id: "inquiry", label: "General Inquiry", icon: MessageSquare },
  { id: "quotation", label: "Request a Quotation", icon: FileText },
];

const services = [
  "Business Development",
  "Sales",
  "Marketing",
  "Promotional Services",
  "FMCG Services",
  "FMCG Order Booking",
  "FMCG Sales",
  "FMCG Supplier Sourcing",
  "FMCG Merchandizing",
  "FMCG Product Promotion",
  "Security",
  "Web Development",
  "WordPress",
  "AI Integration",
  "AI Chatbot",
  "Other",
];

const formationTypes = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Company",
  "Private Limited Company",
  "Public Limited Company",
  "Corporation",
  "LLC",
  "Non-Profit Organization",
  "Government Organization",
  "NGO",
  "Other",
];

const inquiryCategories = [
  "General Information",
  "Business Development",
  "Sales",
  "Marketing",
  "Promotional Services",
  "FMCG Services",
  "Security",
  "Web Development",
  "WordPress",
  "AI Solutions",
  "Partnership",
  "Media / Zayed Tabloid",
  "Other",
];

const appointmentTypes = [
  "Business Consultation",
  "Sales Consultation",
  "Marketing Consultation",
  "FMCG Consultation",
  "Security Consultation",
  "Web Development Consultation",
  "WordPress Consultation",
  "AI Consultation",
  "General Consultation",
];

const meetingFormats = ["In Person", "Phone", "Video Conference", "Other"];

/** Names used in the form's error summary for fields native validation can reject. */
const FIELD_LABELS: Record<string, string> = {
  "contact-subject": "Subject",
  "contact-full-name": "Full name",
  "contact-phone": "Mobile number",
  "contact-email": "Email",
  "contact-confirm-email": "Confirm email",
  "contact-service": "Service required",
  "contact-quotation-service": "Service required",
  "contact-message": "Message",
};

export default function Contact() {
  useSEO({
    title: "Contact Yasir Zayed — Book a Business or Security Consultation",
    description:
      "Get in touch with Yasir Zayed: book an appointment, schedule a meeting, request a quotation or send a general inquiry. Call +254 114 712 989 or WhatsApp +254 717 227 012.",
    path: "/contact",
    keywords:
      "contact Yasir Zayed, business consultation Kenya, security consultation, quotation request, book appointment Nairobi",
  });

  const [activeTab, setActiveTab] = useState("appointment");
  const [submitted, setSubmitted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("KE");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  // Set when the request was handed off to the visitor's email client because
  // this build has no backend attached.
  const [fallbackMailto, setFallbackMailto] = useState<string | null>(null);
  const submitContact = useContactSubmitter();
  const office = getOfficeForCountry(selectedCountry);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();
    const subject =
      get("subject") || tabs.find((t) => t.id === activeTab)?.label || "Website inquiry";
    const phone = get("phone") ? `${selectedCountry} ${get("phone")}` : undefined;

    setSending(true);
    setSendError(null);
    setFallbackMailto(null);
    try {
      const stored = await submitContact({
        name: get("fullName") || "Website visitor",
        email: get("email"),
        subject,
        message: get("message"),
        phone,
        company: get("company") || undefined,
        inquiryType: activeTab,
        department: office.name,
      });

      if (stored) {
        setSubmitted(true);
        return;
      }

      // No backend attached (static build): hand the request to the visitor's
      // email client, pre-filled and addressed to the routed office, so it still
      // reaches the team instead of silently failing.
      const lines = [
        `Name: ${get("fullName") || "Website visitor"}`,
        `Email: ${get("email")}`,
        phone ? `Phone: ${phone}` : null,
        get("company") ? `Company: ${get("company")}` : null,
        get("position") ? `Position: ${get("position")}` : null,
        `Request type: ${tabs.find((t) => t.id === activeTab)?.label ?? activeTab}`,
        `Office: ${office.name}`,
        "",
        get("message") || "(no additional information provided)",
      ].filter((line): line is string => line !== null);
      const mailto = `mailto:${office.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(lines.join("\n"))}`;

      setFallbackMailto(mailto);
      setSubmitted(true);
      window.location.href = mailto;
    } catch {
      setSendError(
        `We couldn't send your request just now. Please email us directly at ${office.email} and we'll pick it up from there.`
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4"
            >
              Contact Us
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
            >
              Let's Start a Conversation
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-lg"
            >
              Choose how you'd like to connect with us.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-8 bg-navy border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-6 justify-center">
            <a href="tel:+254114712989" className="flex items-center gap-2 text-white/60 hover:text-electric text-sm transition-colors">
              <Phone className="w-4 h-4" />
              +254 114 712 989
            </a>
            <a href="tel:+254717227012" className="flex items-center gap-2 text-white/60 hover:text-electric text-sm transition-colors">
              <Phone className="w-4 h-4" />
              +254 717 227 012
            </a>
            <a href="mailto:info@yasirzayed.com" className="flex items-center gap-2 text-white/60 hover:text-electric text-sm transition-colors">
              <Mail className="w-4 h-4" />
              info@yasirzayed.com
            </a>
            <a
              href="https://wa.me/254717227012?text=Hello%20Yasir%20Zayed%2C%20I%27d%20like%20to%20inquire%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/60 hover:text-electric text-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Tabbed Form */}
      <section className="pt-8 sm:pt-12 pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Tabs. Labels stay visible at every width: icon-only tabs read as
              blank next to the floating chat buttons on phones. */}
          <div
            role="group"
            aria-label="Contact request type"
            className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-10 p-1 bg-muted rounded-xl"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={activeTab === tab.id}
                aria-label={tab.label}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSubmitted(false);
                  setFallbackMailto(null);
                }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex-1 justify-center text-center ${
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  {fallbackMailto ? "Request Ready to Send" : "Request Received"}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {fallbackMailto
                    ? `Your email app has been opened with this request addressed to ${office.email}. If nothing opened, send it with the link below.`
                    : "Thank you for contacting Yasir Zayed. Our team will review your request and respond shortly."}
                </p>
                {fallbackMailto && (
                  <a
                    href={fallbackMailto}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-electric px-5 py-2.5 text-sm font-semibold text-white hover:bg-electric-dark transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Open the email again
                  </a>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ContactForm
                  type={activeTab}
                  onSubmit={handleSubmit}
                  selectedCountry={selectedCountry}
                  onCountryChange={setSelectedCountry}
                  sending={sending}
                  sendError={sendError}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
      {/* The floating chat bubbles are fixed to the viewport corner, where on
          phones they sit on top of the request-type tabs and the submit
          button. The quick-contact bar above already offers every channel, so
          they are only shown from `sm` up on this page. */}
      <div className="hidden sm:block">
        <FloatingWidgets />
      </div>
    </div>
  );
}

function ContactForm({
  type,
  onSubmit,
  selectedCountry,
  onCountryChange,
  sending,
  sendError,
}: {
  type: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  selectedCountry: string;
  onCountryChange: (code: string) => void;
  sending: boolean;
  sendError: string | null;
}) {
  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-electric/30 focus:border-electric transition-all";

  const currentCountry = countries.find((c) => c.code === selectedCountry) || countries[0];
  const office = getOfficeForCountry(selectedCountry);

  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  // The form relies on native constraint validation, which blocks the submit
  // and focuses the first invalid control. These props make that failure
  // visible to assistive tech: aria-invalid on the field itself, and a shared
  // live summary that each invalid field points at with aria-describedby.
  const field = (id: string) => ({
    id,
    "aria-invalid": invalidFields.includes(id) || undefined,
    "aria-describedby": invalidFields.includes(id)
      ? "contact-form-error-summary"
      : undefined,
    onInvalid: () =>
      setInvalidFields((prev) => (prev.includes(id) ? prev : [...prev, id])),
    onInput: () =>
      setInvalidFields((prev) => prev.filter((fieldId) => fieldId !== id)),
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Title */}
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">
          {tabs.find((t) => t.id === type)?.label}
        </h2>
      </div>

      {/* Native validation blocks the submit and moves focus to the first
          invalid field; this announces every field that needs attention. */}
      {invalidFields.length > 0 && (
        <p
          id="contact-form-error-summary"
          role="alert"
          className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-4 py-3"
        >
          Please complete:{" "}
          {invalidFields.map((id) => FIELD_LABELS[id] ?? id).join(", ")}.
        </p>
      )}

      {/* Subject (all tabs) */}
      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground mb-1.5">
          Subject <span className="text-destructive">*</span>
        </label>
        <input
          {...field("contact-subject")}
          type="text"
          name="subject"
          required
          className={inputClass}
          placeholder={
            type === "appointment"
              ? "e.g., Business Growth Consultation"
              : type === "meeting"
              ? "e.g., Q3 Strategy Review Meeting"
              : type === "inquiry"
              ? "e.g., Inquiry About AI Services"
              : "e.g., Quotation for CRM Implementation"
          }
        />
      </div>

      {/* Personal Info (all tabs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-full-name" className="block text-sm font-medium text-foreground mb-1.5">
            Full Name <span className="text-destructive">*</span>
          </label>
          <input
            {...field("contact-full-name")}
            type="text"
            name="fullName"
            required
            className={inputClass}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-foreground mb-1.5">
            Personal Mobile Number <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-2">
            <select
              id="contact-country-code"
              aria-label="Country dialling code"
              value={selectedCountry}
              onChange={(e) => onCountryChange(e.target.value)}
              className="w-36 px-2 py-3 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-electric/30 focus:border-electric transition-all appearance-none cursor-pointer"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.dial} {c.name}
                </option>
              ))}
            </select>
            <input
              {...field("contact-phone")}
              type="tel"
              name="phone"
              required
              className={`${inputClass} flex-1`}
              placeholder="Phone number"
            />
          </div>
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">
            Personal Email <span className="text-destructive">*</span>
          </label>
          <input
            {...field("contact-email")}
            type="email"
            name="email"
            required
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="contact-confirm-email" className="block text-sm font-medium text-foreground mb-1.5">
            Confirm Personal Email <span className="text-destructive">*</span>
          </label>
          <input
            {...field("contact-confirm-email")}
            type="email"
            name="confirmEmail"
            required
            className={inputClass}
            placeholder="Confirm your email"
          />
        </div>
      </div>

      {/* Company Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-company" className="block text-sm font-medium text-foreground mb-1.5">
            Company / Business Name {type !== "inquiry" && <span className="text-destructive">*</span>}
          </label>
          <input
            {...field("contact-company")}
            type="text"
            name="company"
            className={inputClass}
            placeholder="Company name"
          />
        </div>
        <div>
          <label htmlFor="contact-formation-type" className="block text-sm font-medium text-foreground mb-1.5">
            Company Formation Type
          </label>
          <select id="contact-formation-type" className={inputClass}>
            <option value="">Select type</option>
            {formationTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="contact-position" className="block text-sm font-medium text-foreground mb-1.5">Position in Company</label>
          <input id="contact-position" type="text" name="position" className={inputClass} placeholder="Your position" />
        </div>
        <div>
          <label htmlFor="contact-business-email" className="block text-sm font-medium text-foreground mb-1.5">Official Business Email</label>
          <input id="contact-business-email" type="email" name="businessEmail" className={inputClass} placeholder="you@company.com" />
        </div>
      </div>

      {/* Tab-specific fields */}
      {type === "appointment" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="contact-service" className="block text-sm font-medium text-foreground mb-1.5">
              Service Required
            </label>
            <select id="contact-service" className={inputClass}>
              <option value="">Select service</option>
              {appointmentTypes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="contact-preferred-method" className="block text-sm font-medium text-foreground mb-1.5">Preferred Contact Method</label>
            <select id="contact-preferred-method" className={inputClass}>
              <option>Email</option>
              <option>Phone</option>
              <option>WhatsApp</option>
            </select>
          </div>
          <div>
            <label htmlFor="contact-appointment-date" className="block text-sm font-medium text-foreground mb-1.5">Preferred Date</label>
            <input id="contact-appointment-date" type="date" className={inputClass} />
          </div>
          <div>
            <label htmlFor="contact-appointment-time" className="block text-sm font-medium text-foreground mb-1.5">Preferred Time</label>
            <input id="contact-appointment-time" type="time" className={inputClass} />
          </div>
        </div>
      )}

      {type === "meeting" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label htmlFor="contact-meeting-purpose" className="block text-sm font-medium text-foreground mb-1.5">Meeting Purpose</label>
            <input id="contact-meeting-purpose" type="text" className={inputClass} placeholder="Brief purpose of the meeting" />
          </div>
          <div>
            <label htmlFor="contact-meeting-date" className="block text-sm font-medium text-foreground mb-1.5">Preferred Date</label>
            <input id="contact-meeting-date" type="date" className={inputClass} />
          </div>
          <div>
            <label htmlFor="contact-meeting-time" className="block text-sm font-medium text-foreground mb-1.5">Preferred Time</label>
            <input id="contact-meeting-time" type="time" className={inputClass} />
          </div>
          <div>
            <label htmlFor="contact-meeting-format" className="block text-sm font-medium text-foreground mb-1.5">Meeting Format</label>
            <select id="contact-meeting-format" className={inputClass}>
              {meetingFormats.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {type === "inquiry" && (
        <div>
          <label htmlFor="contact-inquiry-category" className="block text-sm font-medium text-foreground mb-1.5">
            Inquiry Category
          </label>
          <select id="contact-inquiry-category" className={inputClass}>
            <option value="">Select category</option>
            {inquiryCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {type === "quotation" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="contact-quotation-service" className="block text-sm font-medium text-foreground mb-1.5">
              Service Required <span className="text-destructive">*</span>
            </label>
            <select
              {...field("contact-quotation-service")}
              name="service"
              className={inputClass}
              required
            >
              <option value="">Select service</option>
              {services.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="contact-budget" className="block text-sm font-medium text-foreground mb-1.5">Estimated Budget</label>
            <input id="contact-budget" type="text" className={inputClass} placeholder="e.g. $5,000 - $15,000" />
          </div>
          <div>
            <label htmlFor="contact-start-date" className="block text-sm font-medium text-foreground mb-1.5">Expected Start Date</label>
            <input id="contact-start-date" type="date" className={inputClass} />
          </div>
          <div>
            <label htmlFor="contact-region" className="block text-sm font-medium text-foreground mb-1.5">Project Location / Region</label>
            <input id="contact-region" type="text" className={inputClass} placeholder="e.g. Nairobi, Kenya" />
          </div>
        </div>
      )}

      {/* Message / Description (all tabs except quotation) */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">
          {type === "quotation"
            ? "Project / Requirement Description *"
            : type === "meeting"
            ? "Additional Notes"
            : "Additional Information"}
        </label>
        <textarea
          {...field("contact-message")}
          name="message"
          rows={5}
          required={type === "inquiry" || type === "quotation"}
          className={`${inputClass} resize-none`}
          placeholder="Tell us about your needs..."
        />
      </div>

      {/* RBAC Office Routing Info */}
      <div className="p-4 rounded-xl bg-electric/5 border border-electric/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-electric" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Routed to: {office.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your request will be handled by our {currentCountry.region} office.{' '}
              Contact: {office.email} · {office.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Submit */}
      {sendError && (
        <p role="alert" className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-4 py-3">
          {sendError}
        </p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex items-center gap-2 px-8 py-3.5 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all duration-200 shadow-lg shadow-electric/20 hover:shadow-electric/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {sending ? "Sending…" : "Request a Consultation"}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
}

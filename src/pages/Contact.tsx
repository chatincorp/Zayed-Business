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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
          </div>
        </div>
      </section>

      {/* Tabbed Form */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 p-1 bg-muted rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSubmitted(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
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
                  Request Received
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Thank you for contacting Yasir Zayed. Our team will review your request and respond shortly.
                </p>
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
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
      <FloatingWidgets />
    </div>
  );
}

function ContactForm({
  type,
  onSubmit,
  selectedCountry,
  onCountryChange,
}: {
  type: string;
  onSubmit: (e: React.FormEvent) => void;
  selectedCountry: string;
  onCountryChange: (code: string) => void;
}) {
  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-electric/30 focus:border-electric transition-all";

  const currentCountry = countries.find((c) => c.code === selectedCountry) || countries[0];
  const office = getOfficeForCountry(selectedCountry);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Title */}
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">
          {tabs.find((t) => t.id === type)?.label}
        </h2>
      </div>

      {/* Subject (all tabs) */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Subject <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
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
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Full Name <span className="text-destructive">*</span>
          </label>
          <input type="text" required className={inputClass} placeholder="Your full name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Personal Mobile Number <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-2">
            <select
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
            <input type="tel" required className={`${inputClass} flex-1`} placeholder="Phone number" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Personal Email <span className="text-destructive">*</span>
          </label>
          <input type="email" required className={inputClass} placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Confirm Personal Email <span className="text-destructive">*</span>
          </label>
          <input type="email" required className={inputClass} placeholder="Confirm your email" />
        </div>
      </div>

      {/* Company Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Company / Business Name {type !== "inquiry" && <span className="text-destructive">*</span>}
          </label>
          <input type="text" className={inputClass} placeholder="Company name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Company Formation Type
          </label>
          <select className={inputClass}>
            <option value="">Select type</option>
            {formationTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Position in Company</label>
          <input type="text" className={inputClass} placeholder="Your position" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Official Business Email</label>
          <input type="email" className={inputClass} placeholder="you@company.com" />
        </div>
      </div>

      {/* Tab-specific fields */}
      {type === "appointment" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Service Required
            </label>
            <select className={inputClass}>
              <option value="">Select service</option>
              {appointmentTypes.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Contact Method</label>
            <select className={inputClass}>
              <option>Email</option>
              <option>Phone</option>
              <option>WhatsApp</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Date</label>
            <input type="date" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Time</label>
            <input type="time" className={inputClass} />
          </div>
        </div>
      )}

      {type === "meeting" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5">Meeting Purpose</label>
            <input type="text" className={inputClass} placeholder="Brief purpose of the meeting" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Date</label>
            <input type="date" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Time</label>
            <input type="time" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Meeting Format</label>
            <select className={inputClass}>
              {meetingFormats.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {type === "inquiry" && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Inquiry Category
          </label>
          <select className={inputClass}>
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
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Service Required <span className="text-destructive">*</span>
            </label>
            <select className={inputClass} required>
              <option value="">Select service</option>
              {services.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Estimated Budget</label>
            <input type="text" className={inputClass} placeholder="e.g. $5,000 - $15,000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Expected Start Date</label>
            <input type="date" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Project Location / Region</label>
            <input type="text" className={inputClass} placeholder="e.g. Nairobi, Kenya" />
          </div>
        </div>
      )}

      {/* Message / Description (all tabs except quotation) */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {type === "quotation"
            ? "Project / Requirement Description *"
            : type === "meeting"
            ? "Additional Notes"
            : "Additional Information"}
        </label>
        <textarea
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
      <div className="pt-2">
        <button
          type="submit"
          className="group inline-flex items-center gap-2 px-8 py-3.5 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all duration-200 shadow-lg shadow-electric/20 hover:shadow-electric/30"
        >
          Request a Consultation
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
}

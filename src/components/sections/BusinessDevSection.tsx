import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Target,
  Search,
  Lightbulb,
  Handshake,
  Rocket,
  Settings,
  Building2,
  Globe,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

const services = [
  {
    icon: Target,
    title: "Strategic Business Planning",
    description: "Comprehensive business strategies aligned with your vision, market conditions and growth objectives.",
  },
  {
    icon: Search,
    title: "Market Research & Analysis",
    description: "Data-driven market intelligence to identify opportunities, understand competitors and inform strategic decisions.",
  },
  {
    icon: Lightbulb,
    title: "Business Model Optimization",
    description: "Refine and strengthen your business model for improved profitability, scalability and market relevance.",
  },
  {
    icon: Handshake,
    title: "Partnership & Alliance Development",
    description: "Identify, develop and manage strategic partnerships that create mutual value and accelerate growth.",
  },
  {
    icon: Rocket,
    title: "Expansion & Growth Strategy",
    description: "Market entry strategies, geographic expansion plans and growth roadmaps tailored to your ambitions.",
  },
  {
    icon: Settings,
    title: "Operational Efficiency Consulting",
    description: "Streamline operations, reduce costs and improve productivity through process optimization and best practices.",
  },
  {
    icon: Building2,
    title: "Company & Business Registration",
    description: "End-to-end business registration services in Kenya for local and foreign companies. We handle all statutory filings, compliance and documentation.",
  },
];

const registrationTypes = [
  {
    type: "Private Limited Company (Ltd)",
    description: "Most popular for SMEs. Limited liability protection with 1-50 shareholders.",
    fee: "KES 25,000 – 45,000",
    timeline: "5-10 business days",
    includes: ["Name reservation", "CR12 forms", "Memorandum & Articles", "Certificate of Incorporation", "PIN & VAT registration"],
  },
  {
    type: "Public Limited Company (PLC)",
    description: "For companies seeking to raise capital from the public. Minimum 7 shareholders.",
    fee: "KES 65,000 – 120,000",
    timeline: "10-15 business days",
    includes: ["Name reservation", "Prospectus preparation", "SECP registration", "NSE listing readiness", "Full compliance package"],
  },
  {
    type: "Limited by Guarantee",
    description: "Ideal for non-profits, NGOs, clubs and professional bodies. No share capital.",
    fee: "KES 20,000 – 35,000",
    timeline: "5-10 business days",
    includes: ["Name reservation", "Constitution drafting", "Certificate of Incorporation", "NGO Coordination Board filing", "Compliance setup"],
  },
  {
    type: "Sole Proprietorship",
    description: "Simplest structure. Full control, but unlimited personal liability.",
    fee: "KES 8,000 – 15,000",
    timeline: "2-5 business days",
    includes: ["Business name registration", "County business permit", "PIN certificate", "Basic compliance"],
  },
  {
    type: "Partnership",
    description: "Two or more persons carrying on business together. Flexible structure.",
    fee: "KES 15,000 – 28,000",
    timeline: "5-7 business days",
    includes: ["Name reservation", "Partnership deed", "Registration with Registrar", "PIN certificates"],
  },
  {
    type: "Community-Based Organization",
    description: "For community groups, cooperatives and self-help groups.",
    fee: "KES 5,000 – 12,000",
    timeline: "7-14 business days",
    includes: ["Group registration", "Constitution drafting", "County government approval", "NGO Board coordination"],
  },
];

const foreignServices = [
  {
    service: "Foreign Company Branch Registration",
    description: "Register your foreign company's branch office in Kenya with full compliance.",
    fee: "KES 80,000 – 150,000",
  },
  {
    service: "Subsidiary Incorporation",
    description: "Incorporate a Kenyan subsidiary for your international business.",
    fee: "KES 55,000 – 95,000",
  },
  {
    service: "Joint Venture Setup",
    description: "Structure and register joint ventures between local and foreign entities.",
    fee: "KES 70,000 – 130,000",
  },
];

export default function BusinessDevSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="business-dev" className="relative py-24 sm:py-32 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern-dark" />

      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-electric/[0.03] to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: header */}
          <div className="lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4 block">
                01 — Business Development
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                Strategic Growth for Lasting Success
              </h2>
              <p className="text-lg text-white/50 leading-relaxed mb-8">
                Our business development consulting helps organizations identify opportunities,
                optimize operations and build strategies that drive sustainable growth.
              </p>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all duration-200 shadow-lg shadow-electric/20"
              >
                Start a Consultation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right: service cards */}
          <div className="space-y-4">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className="group p-6 rounded-xl bg-navy-light/40 border border-white/5 hover:border-white/10 hover:bg-navy-light/60 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center shrink-0 group-hover:bg-electric/20 transition-colors">
                    <service.icon className="w-5 h-5 text-electric" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white mb-1.5">
                      {service.title}
                    </h3>
                    <p className="text-sm text-white/45 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Company Registration Pricing Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric/10 border border-electric/20 mb-4">
              <Building2 className="w-4 h-4 text-electric" />
              <span className="text-electric text-xs font-semibold uppercase tracking-wider">Kenya Registration Services</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
              Company & Business Registration in Kenya
            </h3>
            <p className="text-white/40 text-base max-w-2xl mx-auto">
              Our base of operations is <strong className="text-white/70">Kenya</strong>. We register local and foreign companies across all business structures.
              Partners may also facilitate establishment of investments in jurisdictions where our operations are limited.
            </p>
          </div>

          {/* Local Registration Types */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {registrationTypes.map((reg, i) => (
              <motion.div
                key={reg.type}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.06 }}
                className="p-5 rounded-xl bg-navy-light/40 border border-white/5 hover:border-electric/20 transition-all duration-300"
              >
                <h4 className="text-white font-bold text-sm mb-1">{reg.type}</h4>
                <p className="text-white/35 text-xs mb-3 leading-relaxed">{reg.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-electric font-bold text-sm">{reg.fee}</span>
                  <span className="text-white/25 text-[10px] uppercase tracking-wider">{reg.timeline}</span>
                </div>
                <div className="space-y-1">
                  {reg.includes.map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-xs text-white/40">
                      <div className="w-1 h-1 rounded-full bg-electric/50 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Foreign Company Services */}
          <div className="rounded-2xl bg-gradient-to-br from-navy-light/60 to-navy/80 border border-white/5 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h4 className="text-white font-bold">Foreign Company Registration</h4>
                <p className="text-white/35 text-xs">Establish your international business presence in Kenya</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {foreignServices.map((fs, i) => (
                <motion.div
                  key={fs.service}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.08 }}
                  className="p-4 rounded-xl bg-navy-light/30 border border-white/5 hover:border-violet-500/20 transition-all"
                >
                  <h5 className="text-white text-sm font-semibold mb-1">{fs.service}</h5>
                  <p className="text-white/30 text-xs mb-2 leading-relaxed">{fs.description}</p>
                  <span className="text-violet-400 font-bold text-sm">{fs.fee}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-white/20 text-xs mt-4 italic">
              * Partners may facilitate establishment of investments in jurisdictions where our operations are limited. Fees are indicative and subject to scope review.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

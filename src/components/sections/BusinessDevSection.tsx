import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Target,
  Search,
  Lightbulb,
  Handshake,
  Rocket,
  Settings,
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
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Target,
  Workflow,
  Users,
  Database,
  BarChart3,
  Magnet,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

const services = [
  { icon: Target, title: "Sales Strategy Development", description: "Custom sales strategies aligned with your business goals, market position and competitive landscape." },
  { icon: Workflow, title: "Sales Process Optimization", description: "Streamline and optimize your sales pipeline for maximum efficiency and conversion rates." },
  { icon: Users, title: "Sales Team Training & Development", description: "Empower your sales team with the skills, knowledge and tools to consistently exceed targets." },
  { icon: Database, title: "CRM Implementation & Optimization", description: "Select, implement and optimize CRM systems that drive sales performance and customer relationships." },
  { icon: BarChart3, title: "Sales Performance Management", description: "KPI frameworks, performance dashboards and coaching systems that drive accountability and results." },
  { icon: Magnet, title: "Lead Generation & Pipeline Development", description: "Build sustainable lead generation engines and healthy sales pipelines that fuel growth." },
  { icon: UserCheck, title: "Account Management & Retention", description: "Strategies and systems to retain customers, maximize lifetime value and build lasting relationships." },
];

const funnelSteps = ["LEADS", "QUALIFICATION", "SALES", "CUSTOMER", "RETENTION"];

export default function SalesSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="sales" className="relative py-24 sm:py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
          >
            02 — Sales Services
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight"
          >
            Build Sales Systems That Perform
          </motion.h2>
        </div>

        {/* Sales funnel visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center gap-2 sm:gap-3 mb-16 overflow-x-auto pb-4"
        >
          {funnelSteps.map((step, i) => (
            <div key={step} className="flex items-center gap-2 sm:gap-3">
              <div className="relative px-4 sm:px-6 py-3 rounded-lg bg-navy text-white text-xs sm:text-sm font-semibold tracking-wide text-center min-w-[100px] sm:min-w-[130px]"
                style={{
                  clipPath: i === 0
                    ? "polygon(0 0, 100% 0, 95% 100%, 5% 100%)"
                    : i === funnelSteps.length - 1
                    ? "polygon(5% 0, 95% 0, 100% 100%, 0 100%)"
                    : "polygon(3% 0, 97% 0, 94% 100%, 6% 100%)",
                }}
              >
                {step}
              </div>
              {i < funnelSteps.length - 1 && (
                <div className="text-electric/40">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.07 }}
              className="group p-6 rounded-2xl bg-card border border-border/60 hover:border-border hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-electric/10 flex items-center justify-center mb-4 group-hover:bg-electric/20 transition-colors">
                <service.icon className="w-5 h-5 text-electric" />
              </div>
              <h3 className="font-display text-base font-bold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold text-sm rounded-lg hover:bg-navy-light transition-all duration-200"
          >
            Talk to a Sales Expert
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

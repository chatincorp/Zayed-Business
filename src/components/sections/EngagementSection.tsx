import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Target, Clock, Timer, Trophy, Layers, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const models = [
  {
    icon: Target,
    title: "Project-Based Engagements",
    description: "Fixed scope, deliverables, timelines and milestones. Ideal for defined business objectives with clear outcomes.",
  },
  {
    icon: Clock,
    title: "Monthly Retainer",
    description: "Ongoing consultancy support with dedicated monthly allocation. Perfect for continuous strategic guidance.",
  },
  {
    icon: Timer,
    title: "Hourly Consulting",
    description: "Flexible advisory support for specific needs. Pay only for the time and expertise you require.",
  },
  {
    icon: Trophy,
    title: "Performance-Based",
    description: "Fees partially or fully tied to achieved results and KPIs. Aligned incentives for maximum impact.",
  },
  {
    icon: Layers,
    title: "Hybrid Models",
    description: "Combination of fixed fees and performance incentives. Customized to your business needs and objectives.",
  },
];

export default function EngagementSection() {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section className="relative py-24 sm:py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
          >
            Engagement Models
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight"
          >
            Flexible Ways to Work Together
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {models.map((model, i) => (
            <motion.div
              key={model.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="group relative p-7 rounded-2xl bg-card border border-border/60 hover:border-border hover:shadow-xl hover:shadow-black/5 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-electric/10 flex items-center justify-center mb-5 group-hover:bg-electric/15 transition-colors">
                <model.icon className="w-6 h-6 text-electric" />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-3">
                {model.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {model.description}
              </p>
              <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-electric/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold text-sm rounded-lg hover:bg-navy-light transition-all duration-200"
          >
            Discuss Engagement Options
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

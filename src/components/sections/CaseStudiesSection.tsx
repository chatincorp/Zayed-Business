import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink } from "lucide-react";

const placeholders = [
  {
    category: "Business Development",
    title: "Strategic Growth Initiative",
    challenge: "Challenge details will be added once project results are available.",
    approach: "Our approach will be documented here.",
  },
  {
    category: "Security Solutions",
    title: "Enterprise Security Deployment",
    challenge: "Security project details will be added once project results are available.",
    approach: "Our approach will be documented here.",
  },
  {
    category: "Technology",
    title: "Digital Platform Transformation",
    challenge: "Technology project details will be added once project results are available.",
    approach: "Our approach will be documented here.",
  },
];

export default function CaseStudiesSection() {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section className="relative py-24 sm:py-32 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern-dark" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
          >
            Case Studies
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
          >
            Our Work in Action
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-white/50 text-lg max-w-2xl mx-auto"
          >
            Real projects delivering real results for real businesses.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {placeholders.map((cs, i) => (
            <motion.div
              key={cs.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="group relative p-7 rounded-2xl bg-navy-light/40 border border-white/5 hover:border-white/10 transition-all duration-500"
            >
              {/* Category badge */}
              <span className="inline-block px-3 py-1 rounded-full bg-electric/10 text-electric text-xs font-semibold uppercase tracking-wider mb-4">
                {cs.category}
              </span>

              <h3 className="font-display text-xl font-bold text-white mb-3">
                {cs.title}
              </h3>

              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-1">Challenge</p>
                  <p className="text-white/50 text-sm leading-relaxed">{cs.challenge}</p>
                </div>
                <div>
                  <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-1">Approach</p>
                  <p className="text-white/50 text-sm leading-relaxed">{cs.approach}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-electric/60 group-hover:text-electric transition-colors">
                View Case Study
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

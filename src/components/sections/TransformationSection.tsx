import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { X, Check } from "lucide-react";

const beforeItems = [
  "Manual processes",
  "Disconnected systems",
  "Poor visibility",
  "Slow response",
  "Inconsistent customer experience",
];

const afterItems = [
  "Automated workflows",
  "Integrated systems",
  "Better visibility",
  "Faster response",
  "Intelligent customer engagement",
];

export default function TransformationSection() {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");

  return (
    <section className="relative py-24 sm:py-32 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern-dark" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
          >
            Business Transformation
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
          >
            Transform How Your Business Operates
          </motion.h2>
        </div>

        {/* Tab toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex p-1 rounded-xl bg-navy-light/50 border border-white/10">
            <button
              onClick={() => setActiveTab("before")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === "before"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "text-white/50 hover:text-white/70 border border-transparent"
              }`}
            >
              Before
            </button>
            <button
              onClick={() => setActiveTab("after")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === "after"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-white/50 hover:text-white/70 border border-transparent"
              }`}
            >
              After
            </button>
          </div>
        </motion.div>

        {/* Comparison */}
        <div className="max-w-2xl mx-auto">
          {activeTab === "before" ? (
            <motion.div
              key="before"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {beforeItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-5 rounded-xl bg-red-500/5 border border-red-500/10"
                >
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <X className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-white/80 font-medium">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="after"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {afterItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-white/80 font-medium">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

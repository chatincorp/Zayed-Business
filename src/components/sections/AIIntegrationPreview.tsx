import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Bot, ArrowRight, Zap, TrendingUp, Clock, Users } from "lucide-react";

const metrics = [
  { label: "Processing Time", before: "48 hrs", after: "2.3 hrs", icon: Clock, improvement: "95% faster" },
  { label: "Customer Response", before: "24 hrs", after: "< 5 min", icon: Users, improvement: "99% faster" },
  { label: "Data Accuracy", before: "72%", after: "98.5%", icon: TrendingUp, improvement: "+36% gain" },
  { label: "Task Automation", before: "Manual", after: "85% Auto", icon: Zap, improvement: "85% automated" },
];

const workflowBefore = [
  { step: "Customer inquiry arrives", status: "manual", time: "0 min" },
  { step: "Staff manually reviews request", status: "manual", time: "15 min" },
  { step: "Forward to relevant department", status: "manual", time: "30 min" },
  { step: "Department reviews and responds", status: "manual", time: "24 hrs" },
  { step: "Follow-up scheduled manually", status: "manual", time: "48 hrs" },
];

const workflowAfter = [
  { step: "AI captures and classifies inquiry", status: "auto", time: "0.1 sec" },
  { step: "AI routes to right department instantly", status: "auto", time: "0.2 sec" },
  { step: "AI drafts response for review", status: "auto", time: "1 min" },
  { step: "Staff approves and sends", status: "hybrid", time: "2 min" },
  { step: "AI schedules follow-up automatically", status: "auto", time: "Instant" },
];

export default function AIIntegrationPreview() {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [showAfter, setShowAfter] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setShowAfter(true), 2000);
    return () => clearTimeout(timer);
  }, [inView]);

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setActiveWorkflowStep((p) => (p + 1) % workflowAfter.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <section className="relative py-24 sm:py-32 bg-navy-dark overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern-dark" />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-violet-400 text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
          >
            See the Difference
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
          >
            Before & After AI Integration
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Watch a real business workflow transform from manual, slow processes to intelligent, automated operations.
          </motion.p>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 mt-8"
          >
            <button
              onClick={() => setShowAfter(false)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                !showAfter ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              Before AI
            </button>
            <button
              onClick={() => setShowAfter(true)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                showAfter ? "bg-violet-500 text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              After AI
            </button>
          </motion.div>
        </div>

        {/* Main demo area */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Left: Workflow visualization */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-2xl bg-navy-light/50 border border-white/5 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${showAfter ? "bg-violet-500/20" : "bg-white/5"}`}>
                <Bot className={`w-5 h-5 ${showAfter ? "text-violet-400" : "text-white/40"}`} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">
                  {showAfter ? "AI-Powered Workflow" : "Manual Workflow"}
                </h3>
                <p className="text-white/40 text-xs">
                  {showAfter ? "Intelligent automation at every step" : "Traditional manual process"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="wait">
                {(showAfter ? workflowAfter : workflowBefore).map((step, i) => (
                  <motion.div
                    key={`${showAfter ? "after" : "before"}-${i}`}
                    initial={{ opacity: 0, x: showAfter ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                      i === activeWorkflowStep
                        ? showAfter
                          ? "bg-violet-500/10 border border-violet-500/20"
                          : "bg-white/5 border border-white/10"
                        : "border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        showAfter
                          ? "bg-violet-500/20 text-violet-400"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm">{step.step}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {showAfter && (
                        <span
                          className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            step.status === "auto"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {step.status}
                        </span>
                      )}
                      <span className="text-white/30 text-xs font-mono whitespace-nowrap">{step.time}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Total time */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-white/40 text-sm">Total Process Time</span>
              <span className={`text-xl font-bold ${showAfter ? "text-emerald-400" : "text-white/60"}`}>
                {showAfter ? "< 5 minutes" : "48+ hours"}
              </span>
            </div>
          </motion.div>

          {/* Right: Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  className="p-5 rounded-2xl bg-navy-light/50 border border-white/5 hover:border-white/10 transition-all"
                >
                  <Icon className="w-5 h-5 text-violet-400/70 mb-3" />
                  <p className="text-white/40 text-xs font-medium mb-1">{m.label}</p>
                  <div className="flex items-baseline gap-2">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={showAfter ? "after" : "before"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-2xl font-bold text-white"
                      >
                        {showAfter ? m.after : m.before}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {showAfter && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-semibold text-emerald-400 mt-1 block"
                      >
                        {m.improvement}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <a
            href="/contact"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-violet-500 text-white font-semibold text-sm rounded-xl hover:bg-violet-600 transition-all shadow-xl shadow-violet-500/20"
          >
            See How AI Can Transform Your Business
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

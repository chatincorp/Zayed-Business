import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Mail,
  Database,
  BarChart3,
  Users,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react";

const nodes = [
  { id: "trigger", label: "New Lead", icon: Users, color: "#0ea5e9" },
  { id: "enrich", label: "Data Enrichment", icon: Database, color: "#8b5cf6" },
  { id: "qualify", label: "AI Qualification", icon: Zap, color: "#06b6d4" },
  { id: "notify", label: "Team Notification", icon: MessageSquare, color: "#10b981" },
  { id: "email", label: "Welcome Email", icon: Mail, color: "#f59e0b" },
  { id: "report", label: "Analytics Update", icon: BarChart3, color: "#ec4899" },
];

const automations = [
  {
    name: "Lead Capture & Qualification",
    description: "New website leads are automatically enriched with company data, scored by AI and routed to the right sales rep.",
    steps: ["Website form submitted", "Company data enriched", "AI scores lead quality", "Assigned to sales rep", "Welcome email sent"],
  },
  {
    name: "Client Onboarding",
    description: "Once a deal closes, the entire onboarding workflow kicks off automatically — contracts, welcome packs, account setup.",
    steps: ["Deal marked as won", "Contract generated", "Welcome pack emailed", "Account created", "Onboarding call scheduled"],
  },
  {
    name: "Security Alert Pipeline",
    description: "Security events are detected, classified, escalated and documented without manual intervention.",
    steps: ["Alert detected", "AI classifies severity", "Right team notified", "Response initiated", "Incident logged & reported"],
  },
];

export default function WorkflowAutomation() {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });
  const [activeNode, setActiveNode] = useState(0);
  const [activeAutomation, setActiveAutomation] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setActiveNode((p) => (p + 1) % nodes.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <section className="relative py-24 sm:py-32 bg-navy-dark overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern-dark" />
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-emerald-400 text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
          >
            08 — Workflow Automation
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
          >
            Automate the Busywork
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Connect your tools, eliminate manual handoffs and let intelligent automation handle the repetitive work.
          </motion.p>
        </div>

        {/* Animated pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20 overflow-x-auto pb-4"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-4 min-w-[700px] mx-auto px-4">
            {nodes.map((node, i) => {
              const Icon = node.icon;
              const isActive = i === activeNode;
              return (
                <div key={node.id} className="flex items-center gap-2 sm:gap-4">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      borderColor: isActive ? node.color : "rgba(255,255,255,0.05)",
                    }}
                    transition={{ duration: 0.4 }}
                    className="relative flex flex-col items-center gap-2"
                  >
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isActive ? "shadow-lg" : "bg-navy-light/50 border border-white/5"
                      }`}
                      style={isActive ? { backgroundColor: `${node.color}20`, borderColor: `${node.color}40` } : {}}
                    >
                      <Icon
                        className="w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-500"
                        style={{ color: isActive ? node.color : "rgba(255,255,255,0.3)" }}
                      />
                    </div>
                    <span
                      className="text-[10px] sm:text-xs font-semibold text-center transition-colors duration-500 whitespace-nowrap"
                      style={{ color: isActive ? node.color : "rgba(255,255,255,0.3)" }}
                    >
                      {node.label}
                    </span>
                    {/* Pulse ring on active */}
                    {isActive && (
                      <motion.div
                        className="absolute -inset-2 rounded-2xl border-2"
                        style={{ borderColor: `${node.color}20` }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 1.3] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                  {i < nodes.length - 1 && (
                    <div className="flex items-center">
                      <motion.div
                        className="w-8 sm:w-16 h-px"
                        style={{
                          background: i < activeNode
                            ? `linear-gradient(90deg, ${nodes[i].color}, ${nodes[i + 1].color})`
                            : "rgba(255,255,255,0.05)",
                        }}
                        animate={{ opacity: i < activeNode ? 0.6 : 0.2 }}
                      />
                      {i < activeNode && (
                        <motion.div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: nodes[i].color }}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: [0, 1, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Automation examples */}
        <div className="grid lg:grid-cols-3 gap-6">
          {automations.map((auto, i) => (
            <motion.div
              key={auto.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              onClick={() => setActiveAutomation(i)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                activeAutomation === i
                  ? "bg-navy-light/60 border-emerald-500/30 shadow-lg shadow-emerald-500/5"
                  : "bg-navy-light/30 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-white font-bold text-sm">{auto.name}</h3>
              </div>
              <p className="text-white/40 text-sm leading-relaxed mb-5">{auto.description}</p>

              <div className="space-y-2">
                {auto.steps.map((step, j) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={activeAutomation === i ? { opacity: 1, x: 0 } : { opacity: 0.5, x: 0 }}
                    transition={{ duration: 0.3, delay: j * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/50 shrink-0" />
                    <span className="text-white/60 text-xs">{step}</span>
                    {j < auto.steps.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-white/15 ml-auto shrink-0" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

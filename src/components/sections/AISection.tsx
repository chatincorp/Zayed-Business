import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Bot,
  Brain,
  Workflow,
  FileSearch,
  BarChart3,
  Database,
  MessageSquare,
  Calendar,
  Users,
  ArrowRight,
  Link,
} from "lucide-react";
import { Link as RouterLink } from "react-router";

const aiServices = [
  { icon: Workflow, title: "AI Workflow Automation" },
  { icon: Brain, title: "AI-Powered Business Systems" },
  { icon: Link, title: "API Integrations" },
  { icon: FileSearch, title: "Intelligent Document Processing" },
  { icon: BarChart3, title: "AI Analytics" },
  { icon: Database, title: "CRM + AI Integration" },
  { icon: Workflow, title: "Automated Reporting" },
  { icon: Bot, title: "AI Assistants" },
  { icon: Database, title: "Internal Knowledge Systems" },
];

const chatbotFeatures = [
  { icon: MessageSquare, title: "24/7 Customer Assistance" },
  { icon: Users, title: "Lead Qualification" },
  { icon: Brain, title: "Knowledge-Based Answers" },
  { icon: Globe, title: "Website Chat" },
  { icon: MessageSquare, title: "WhatsApp Integration" },
  { icon: Database, title: "CRM Integration" },
  { icon: Calendar, title: "Appointment Assistance" },
  { icon: Users, title: "Internal Staff Assistants" },
];

function Globe({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

const ecosystemFlow = [
  { label: "WEBSITE", desc: "Your digital front door" },
  { label: "CRM", desc: "Customer data hub" },
  { label: "CUSTOM AI", desc: "Intelligent decision engine" },
  { label: "BUSINESS DATA", desc: "Informed intelligence" },
  { label: "AUTOMATION", desc: "Streamlined operations" },
  { label: "CUSTOMER", desc: "Enhanced experience" },
  { label: "ANALYTICS", desc: "Measurable insights" },
];

export default function AISection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="ai" className="relative py-24 sm:py-32 bg-navy-dark overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern-dark" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* AI Integration */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-violet-400 text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
            >
              07 — AI & Automation
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
            >
              Make Your Business Intelligent
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-white/50 text-lg max-w-2xl mx-auto"
            >
              AI that gives your team more time back, a higher success rate on the work it touches, and the feeling of winning more often — by taking on the routine so your people can focus on the work that matters and actually enjoy a break.
            </motion.p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiServices.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                className="group p-5 rounded-xl bg-navy-light/40 border border-white/5 hover:border-violet-500/20 hover:bg-navy-light/60 transition-all duration-300"
              >
                <s.icon className="w-5 h-5 text-violet-400/70 group-hover:text-violet-400 transition-colors mb-3" />
                <h4 className="text-white text-sm font-bold">{s.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Signature section: AI + Business Ecosystem */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-24 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-navy-light/60 to-navy/80 border border-white/5"
        >
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-white text-center mb-3">
            What Happens When Your Business Becomes Intelligent?
          </h3>
          <p className="text-center text-white/50 mb-10 max-w-xl mx-auto">
            We don't just add AI. We connect AI to the way your business actually works — and price it transparently: AI Agents from $3,000, management and maintenance at $250 monthly plus $100 per agent, a multi-agent framework at $5,000 per skill per agent, and agent training at $300 per agent.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ecosystemFlow.map((step, i) => (
              <div key={step.label} className="text-center p-4">
                <div className="w-12 h-12 mx-auto rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-3">
                  <span className="text-violet-400 font-bold text-sm">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h4 className="text-white text-sm font-bold mb-1">{step.label}</h4>
                <p className="text-white/40 text-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Chatbots */}
        <div>
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            >
              AI Agents, Management & Multi-Agent Frameworks
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/50 text-lg max-w-2xl mx-auto"
            >
              AI agents that handle real work across your business — with a clear, all-in cost: $3,000 per AI agent setup, $250 monthly management and maintenance, $100 per agent each month on subscription, a multi-agent framework at $5,000 per skill per agent, and $300 training per agent.
            </motion.p>
          </div>

          {/* Chatbot mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-md mx-auto mb-12 p-6 rounded-2xl bg-navy-light/50 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
              <div className="w-8 h-8 rounded-full bg-electric/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-electric" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">YZ Assistant</p>
                <p className="text-green-400 text-xs">● Online</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-xl rounded-tl-sm p-3 max-w-[85%]">
                <p className="text-white/80 text-sm">Hello! How can I help your business today?</p>
              </div>
              <div className="bg-electric/20 rounded-xl rounded-tr-sm p-3 max-w-[85%] ml-auto">
                <p className="text-white/90 text-sm">I'd like to learn about your security solutions.</p>
              </div>
              <div className="bg-white/5 rounded-xl rounded-tl-sm p-3 max-w-[85%]">
                <p className="text-white/80 text-sm">We offer CCTV, access control, intrusion alarms and more. Would you like to schedule a security assessment?</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {chatbotFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-navy-light/30 border border-white/5"
              >
                <f.icon className="w-4 h-4 text-electric/60 shrink-0" />
                <span className="text-white/70 text-xs font-medium">{f.title}</span>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <RouterLink
              to="/contact"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all duration-200 shadow-lg shadow-electric/20"
            >
              Talk to Us About AI Agents, Management & Multi-Agent Frameworks
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  );
}

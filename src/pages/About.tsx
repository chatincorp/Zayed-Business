import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Target,
  BarChart3,
  Globe,
  Shield,
  Cpu,
  Bot,
  Zap,
  Pen,
  Users,
  Rocket,
  Eye,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Handshake,
  Building2,
} from "lucide-react";

/* ── Capabilities ──────────────────────────────────────────────── */

const capabilities = [
  {
    icon: Target,
    title: "Business Development & Growth",
    description:
      "We help organizations identify opportunities, develop growth strategies, strengthen market positioning and build pathways toward sustainable business expansion.",
    color: "text-electric",
    bg: "bg-electric/10",
  },
  {
    icon: BarChart3,
    title: "Sales & Marketing",
    description:
      "We develop marketing-focused strategies and digital experiences designed to attract prospects, generate qualified leads, increase engagement and convert opportunities into customers.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Globe,
    title: "Web Development",
    description:
      "We design and develop modern, responsive, high-performance corporate websites and custom web applications built around each business's objectives.",
    color: "text-sky-400",
    bg: "bg-sky-400/10",
  },
  {
    icon: Pen,
    title: "Custom WordPress Development",
    description:
      "Bespoke WordPress websites and themes — tailored designs, functionality, content structures, integrations and administration capabilities suited to specific requirements.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: Cpu,
    title: "AI System Integration",
    description:
      "We integrate artificial intelligence into business processes and digital platforms to automate workflows, improve productivity, enhance customer interaction and sharpen decision-making.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    icon: Bot,
    title: "Custom AI Chatbots",
    description:
      "Intelligent conversational systems built around specific business requirements, services, products and customer workflows — available 24/7.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: Zap,
    title: "Digital Automation",
    description:
      "We identify repetitive processes and streamline them through intelligent automation, integrations, workflows and connected business systems.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
  {
    icon: Shield,
    title: "Security Solutions",
    description:
      "Through our dedicated security ecosystem — CCTV, access control, intrusion detection and monitoring — we help organizations strengthen their protection and security posture.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
  },
];

/* ── Journey ───────────────────────────────────────────────────── */

const journeySteps = [
  "Discover",
  "Engage",
  "Inquire",
  "Verify",
  "Connect",
  "Convert",
  "Grow",
];

/* ── AI Applications ───────────────────────────────────────────── */

const aiApplications = [
  "AI-powered customer assistance",
  "Custom AI chatbots",
  "Intelligent information systems",
  "Workflow automation",
  "AI-assisted content creation",
  "Business process integration",
  "Customer engagement",
  "Lead qualification",
  "Knowledge-based assistants",
  "AI-enhanced digital experiences",
];

/* ── Who We Serve ──────────────────────────────────────────────── */

const audiences = [
  "Startups",
  "Small & Medium Businesses",
  "Established Companies",
  "Corporate Organizations",
  "Professional Service Firms",
  "Technology Companies",
  "Entrepreneurs",
  "Organizations Undergoing Digital Transformation",
  "Businesses Expanding Into New Markets",
];

export default function About() {
  const [ref1, inView1] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ref3, inView3] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ref4, inView4] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ref5, inView5] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ref6, inView6] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-28 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-electric/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref1}>
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric/10 border border-electric/20 mb-6"
            >
              <Building2 className="w-4 h-4 text-electric" />
              <span className="text-electric text-xs font-semibold uppercase tracking-wider">
                The Zayed Brief
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={inView1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
            >
              Transforming Ideas Into{" "}
              <span className="text-gradient-blue">
                Intelligent Business Solutions
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-3xl"
            >
              Yasir Zayed is a multi-disciplinary business, technology, digital
              transformation, artificial intelligence, and security solutions
              company focused on helping organizations build, modernize, protect
              and grow their businesses in an increasingly digital world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-electric text-white font-semibold text-sm rounded-xl hover:bg-electric-dark transition-all shadow-xl shadow-electric/20"
              >
                Explore Our Services
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/15 text-white/70 font-medium text-sm rounded-xl hover:bg-white/5 hover:border-white/25 hover:text-white transition-all backdrop-blur-sm"
              >
                Start a Conversation
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ MISSION + VISION ═══════════ */}
      <section className="relative py-20 sm:py-28 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref2}>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView2 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="p-8 sm:p-10 rounded-2xl bg-navy-light/50 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-electric/10 flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-electric" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-4">
                Our Vision
              </h2>
              <p className="text-white/50 leading-relaxed">
                To build an integrated ecosystem where{" "}
                <strong className="text-white/70">
                  business strategy, digital technology, artificial intelligence,
                  automation, marketing, and security
                </strong>{" "}
                work together to create stronger and more competitive
                organizations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView2 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 sm:p-10 rounded-2xl bg-navy-light/50 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-5">
                <Rocket className="w-6 h-6 text-violet-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-4">
                Our Mission
              </h2>
              <p className="text-white/50 leading-relaxed">
                To help businesses turn ideas, challenges, and opportunities into{" "}
                <strong className="text-white/70">
                  practical digital solutions that create measurable value and
                  support sustainable growth.
                </strong>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ APPROACH ═══════════ */}
      <section className="relative py-20 sm:py-28 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref3}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView3 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4 block">
                Our Approach
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-6">
                Business Growth Meets Technology
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Modern businesses need more than a website or a technology
                provider. They need systems that attract the right audience,
                convert opportunities into customers, automate repetitive
                processes, provide better customer experiences, and support
                long-term growth.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Yasir Zayed combines{" "}
                <strong className="text-foreground">
                  commercial strategy with technology and innovation
                </strong>{" "}
                to create solutions around the complete customer journey. From
                establishing a compelling digital presence to implementing
                AI-powered systems, our solutions are designed to help businesses
                operate more efficiently and compete more effectively.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every organization is different. Our solutions are not limited to
                a fixed package. We combine different capabilities according to
                each organization's requirements — whether that's a corporate
                website, a complete digital transformation, an AI chatbot
                connected to business processes, or a full marketing and
                lead-generation infrastructure.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView3 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="p-8 rounded-2xl bg-muted/30 border border-border/50"
            >
              <h3 className="font-display text-lg font-bold text-foreground mb-6">
                From Visitor to Customer
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Our digital solutions are designed with business growth in mind.
                We focus on creating experiences that move users through the
                entire journey:
              </p>
              <div className="flex flex-wrap gap-2">
                {journeySteps.map((step, i) => (
                  <div
                    key={step}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-electric/5 border border-electric/10"
                  >
                    <span className="text-electric font-bold text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-foreground text-xs font-semibold">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground/60 mt-4">
                Websites, landing pages, content, CTAs, contact systems, AI
                assistants, marketing tools and business integrations — working
                together as one connected ecosystem.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ CAPABILITIES ═══════════ */}
      <section className="relative py-20 sm:py-28 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref4}>
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={inView4 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
            >
              Core Capabilities
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView4 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight"
            >
              What We Do
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView4 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.06 }}
                  className="group p-6 rounded-2xl bg-navy-light/40 border border-white/5 hover:border-white/10 hover:bg-navy-light/60 transition-all duration-300"
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${cap.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-5 h-5 ${cap.color}`} />
                  </div>
                  <h3 className="font-display text-sm font-bold text-white mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {cap.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ AI SECTION ═══════════ */}
      <section className="relative py-20 sm:py-28 bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark" />
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref5}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView5 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="text-violet-400 text-xs font-semibold uppercase tracking-[0.25em] mb-4 block">
                Intelligent Technology
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
                Artificial Intelligence Done Right
              </h2>
              <p className="text-white/50 leading-relaxed mb-5">
                Artificial intelligence is becoming an important part of how
                businesses operate and interact with customers. Yasir Zayed helps
                organizations explore practical applications of AI across their
                operations.
              </p>
              <p className="text-white/50 leading-relaxed">
                Our goal is not to add AI simply because it is fashionable. We
                focus on identifying where intelligent technology can provide{" "}
                <strong className="text-white/70">genuine business value</strong>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView5 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-2 gap-3"
            >
              {aiApplications.map((app, i) => (
                <motion.div
                  key={app}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView5 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-navy-light/40 border border-white/5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400/60 shrink-0" />
                  <span className="text-white/60 text-xs font-medium">
                    {app}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ WHO WE SERVE ═══════════ */}
      <section className="relative py-20 sm:py-28 bg-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref6}>
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView6 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4"
            >
              Designed for Modern Organizations
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView6 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Our solutions adapt to organizations at every stage of growth.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView6 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto"
          >
            {audiences.map((a, i) => (
              <span
                key={a}
                className="px-4 py-2 rounded-xl bg-card border border-border/60 text-sm font-medium text-foreground hover:border-electric/30 hover:bg-electric/5 transition-all cursor-default"
              >
                {a}
              </span>
            ))}
          </motion.div>

          {/* Philosophy quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView6 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 max-w-3xl mx-auto text-center"
          >
            <div className="p-8 sm:p-10 rounded-2xl bg-navy-dark border border-white/5">
              <Lightbulb className="w-8 h-8 text-electric/50 mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Our Philosophy
              </h3>
              <p className="text-white/50 leading-relaxed mb-4">
                We believe technology should serve the business — not the other
                way around. Every website, system, integration, automation, and
                AI solution should have a purpose: to generate leads, increase
                sales, improve customer service, automate operations, strengthen
                security, establish credibility, or create new opportunities.
              </p>
              <p className="text-white/40 text-sm italic">
                "Your business has the vision. We help build the systems that
                bring it to life."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="relative py-20 sm:py-24 bg-navy-dark">
        <div className="absolute inset-0 bg-grid-pattern-dark" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            More Than a Service Provider
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-lg mb-10 max-w-2xl mx-auto"
          >
            Yasir Zayed is positioned as a strategic technology and business
            growth partner. We combine creativity, technology, business thinking,
            AI, digital marketing, development and security to help organizations
            move from ideas to implementation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-electric text-white font-semibold rounded-xl hover:bg-electric-dark transition-all shadow-xl shadow-electric/25"
            >
              <Handshake className="w-5 h-5" />
              Start a Partnership
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white/80 font-medium rounded-xl hover:bg-white/5 hover:border-white/30 transition-all"
            >
              View All Services
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

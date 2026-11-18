import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Camera,
  Wifi,
  Lock,
  Thermometer,
  Monitor,
  Key,
  Cog,
  Shield,
  ArrowRight,
  Building,
  Home,
  Factory,
  GraduationCap,
  Stethoscope,
  Landmark,
  Car,
  HardHat,
  Hotel,
  Construction,
} from "lucide-react";
import { Link } from "react-router";

const categories = [
  { icon: Camera, label: "CCTV Systems", desc: "Complete surveillance solutions" },
  { icon: Wifi, label: "IP Cameras", desc: "Network-based camera systems" },
  { icon: Monitor, label: "HD/Coax Cameras", desc: "High-definition analog systems" },
  { icon: Camera, label: "PTZ Cameras", desc: "Pan-tilt-zoom cameras" },
  { icon: Shield, label: "Intrusion Alarms", desc: "Detection and alert systems" },
  { icon: Lock, label: "Video Intercom", desc: "Communication and verification" },
  { icon: Key, label: "Access Control", desc: "Entry management systems" },
  { icon: Thermometer, label: "Thermal Products", desc: "Temperature monitoring" },
  { icon: Cog, label: "Security Software", desc: "Management platforms" },
  { icon: Monitor, label: "Displays & Controllers", desc: "Monitoring equipment" },
  { icon: Wifi, label: "Transmission", desc: "Network infrastructure" },
  { icon: Lock, label: "Smart Locks", desc: "Electronic lock systems" },
];

const services = [
  "System Design",
  "Installation",
  "Product Sourcing",
  "After-Sales Support",
];

const flowSteps = ["CAMERA", "NETWORK", "CONTROL", "MONITORING", "ACCESS", "PROTECTION"];

const industries = [
  { icon: Hotel, name: "Hospitality" },
  { icon: Home, name: "Residential" },
  { icon: Building, name: "Commercial" },
  { icon: Factory, name: "Industrial" },
  { icon: Car, name: "Parking" },
  { icon: HardHat, name: "Construction" },
  { icon: GraduationCap, name: "Education" },
  { icon: Stethoscope, name: "Medical" },
  { icon: Landmark, name: "Financial" },
  { icon: Building, name: "Government" },
  { icon: Construction, name: "Public Service" },
  { icon: Users, name: "High-Traffic Environments" },
];

function Users({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default function SecuritySection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="security" className="relative py-24 sm:py-32 bg-navy-dark overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern-dark" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-500/[0.03] to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-cyan-400 text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
          >
            05 — Security Solutions
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
          >
            Secure Your World With Confidence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-white/50 max-w-2xl mx-auto"
          >
            Professional security technology, surveillance and access solutions designed to protect businesses, homes and institutions.
          </motion.p>
        </div>

        {/* Security technology flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-16"
        >
          {flowSteps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="px-3 sm:px-5 py-2 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs sm:text-sm font-semibold tracking-wide">
                {step}
              </div>
              {i < flowSteps.length - 1 && (
                <ArrowRight className="w-3 h-3 text-cyan-500/30" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Product categories grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
              className="group p-4 rounded-xl bg-navy-light/40 border border-white/5 hover:border-cyan-500/20 hover:bg-navy-light/60 transition-all duration-300"
            >
              <cat.icon className="w-5 h-5 text-cyan-400/60 group-hover:text-cyan-400 transition-colors mb-2" />
              <h4 className="text-white text-sm font-semibold mb-0.5">{cat.label}</h4>
              <p className="text-white/35 text-xs">{cat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {services.map((s) => (
            <div key={s} className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm font-medium">
              {s}
            </div>
          ))}
        </motion.div>

        {/* Industries */}
        <div className="mb-12">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center text-white/60 text-sm font-semibold uppercase tracking-widest mb-8"
          >
            Sectors We Serve
          </motion.h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {industries.map((ind, i) => (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.04 }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <ind.icon className="w-5 h-5 text-cyan-400/50" />
                <span className="text-white/60 text-xs text-center font-medium">{ind.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white font-semibold text-sm rounded-lg hover:bg-cyan-600 transition-all duration-200 shadow-lg shadow-cyan-500/20"
          >
            Request a Security Assessment
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

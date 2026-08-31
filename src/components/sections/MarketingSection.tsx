import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Pen,
  Layers,
  Globe,
  FileText,
  Share2,
  Heart,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

const services = [
  { icon: Pen, title: "Marketing Strategy & Planning", description: "Comprehensive marketing strategies aligned with business objectives and market opportunities." },
  { icon: Layers, title: "Brand Development & Positioning", description: "Build a distinctive brand identity that resonates with your target audience and market position." },
  { icon: Globe, title: "Digital Marketing Strategy", description: "Multi-channel digital marketing strategies that drive awareness, engagement and conversions." },
  { icon: FileText, title: "Content Marketing Program", description: "Strategic content creation and distribution that establishes authority and drives organic growth." },
  { icon: Share2, title: "Social Media Marketing", description: "Social media strategies, community management and paid campaigns that build audience and drive results." },
  { icon: Heart, title: "Customer Experience Optimization", description: "Map and optimize every customer touchpoint for satisfaction, loyalty and advocacy." },
  { icon: BarChart3, title: "Marketing Analytics & ROI Measurement", description: "Data-driven marketing measurement, attribution and optimization for maximum return on investment." },
];

const ecosystemSteps = ["BRAND", "CONTENT", "DIGITAL", "SOCIAL", "CUSTOMER", "ANALYTICS"];

export default function MarketingSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="marketing" className="relative py-24 sm:py-32 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern-dark" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
          >
            03 — Marketing Services
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
          >
            Make Your Brand Impossible to Ignore
          </motion.h2>
        </div>

        {/* Marketing ecosystem flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-16"
        >
          {ecosystemSteps.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/80 text-xs sm:text-sm font-semibold tracking-wide">
                {step}
              </div>
              {i < ecosystemSteps.length - 1 && (
                <div className="w-6 h-px bg-gradient-to-r from-electric/40 to-transparent" />
              )}
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.07 }}
              className="group p-6 rounded-2xl bg-navy-light/40 border border-white/5 hover:border-white/10 hover:bg-navy-light/60 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-electric/10 flex items-center justify-center mb-4 group-hover:bg-electric/20 transition-colors">
                <service.icon className="w-5 h-5 text-electric" />
              </div>
              <h3 className="font-display text-base font-bold text-white mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-white/45 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all duration-200 shadow-lg shadow-electric/20"
          >
            Talk to a Marketing Expert
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

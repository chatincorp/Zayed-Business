import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Globe,
  Layout,
  ShoppingCart,
  Plug,
  Database,
  Palette,
  Gauge,
  Code,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

const webServices = [
  { icon: Globe, title: "Custom Corporate Websites" },
  { icon: Layout, title: "Web Applications" },
  { icon: Layout, title: "Business Portals" },
  { icon: ShoppingCart, title: "E-Commerce Platforms" },
  { icon: Plug, title: "API Integrations" },
  { icon: Database, title: "CRM Integrations" },
  { icon: Palette, title: "Responsive UX/UI" },
  { icon: Gauge, title: "Performance Optimization" },
];

const wpServices = [
  "Custom WordPress Themes",
  "Custom UI/UX",
  "Gutenberg Development",
  "Elementor Development",
  "Custom Plugins",
  "WooCommerce",
  "API Integrations",
  "CRM Integrations",
  "AI Integrations",
  "Performance Optimization",
  "Security Hardening",
  "Maintenance & Support",
];

const webFlow = ["WEBSITE", "API", "CRM", "DATABASE", "AUTOMATION", "CUSTOMER"];

export default function TechnologySection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="technology" className="relative py-24 sm:py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Web Development */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
            >
              06 — Custom Web Development
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight"
            >
              Digital Experiences Built Around Your Business
            </motion.h2>
          </div>

          {/* Architecture flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12"
          >
            {webFlow.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="px-3 sm:px-5 py-2 rounded-lg bg-navy/5 border border-border text-foreground text-xs sm:text-sm font-semibold tracking-wide">
                  {step}
                </div>
                {i < webFlow.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-electric/30" />
                )}
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {webServices.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                className="group p-5 rounded-xl bg-card border border-border/60 hover:border-border hover:shadow-md transition-all duration-300"
              >
                <s.icon className="w-5 h-5 text-electric mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="text-foreground text-sm font-bold">{s.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>

        {/* WordPress Development */}
        <div>
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4"
            >
              WordPress Without the Limitations
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Custom WordPress experiences engineered around your brand, content structure, business requirements and long-term growth.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {wpServices.map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.04 }}
                className="p-4 rounded-xl bg-card border border-border/60 hover:border-border transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-electric" />
                  <span className="text-foreground text-sm font-medium">{s}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-electric text-white font-semibold text-sm rounded-lg hover:bg-electric-dark transition-all duration-200 shadow-lg shadow-electric/20"
            >
              Build My Website
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

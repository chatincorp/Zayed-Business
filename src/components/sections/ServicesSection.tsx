import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router";
import {
  TrendingUp,
  BarChart3,
  Megaphone,
  Radio,
  Shield,
  Globe,
  Bot,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { useSiteServices } from "@/lib/siteContent";

/** Icon + accent per service category, so admin-created services still look right. */
const CATEGORY_STYLE: Record<string, { icon: typeof TrendingUp; color: string }> = {
  business: { icon: TrendingUp, color: "electric" },
  sales: { icon: BarChart3, color: "blue-400" },
  marketing: { icon: Megaphone, color: "indigo-400" },
  promotional: { icon: Radio, color: "violet-400" },
  security: { icon: Shield, color: "cyan-400" },
  digital: { icon: Globe, color: "sky-400" },
  ai: { icon: Bot, color: "emerald-400" },
  fmcg: { icon: ShoppingCart, color: "orange-400" },
};

export default function ServicesSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const navigate = useNavigate();
  const siteServices = useSiteServices();

  // Published services from the admin panel, styled by category. Falls back to
  // the bundled list when no backend is attached.
  const services = siteServices.map((s, i) => {
    const style = CATEGORY_STYLE[s.category] ?? CATEGORY_STYLE.business;
    return {
      num: String(i + 1).padStart(2, "0"),
      title: s.title,
      description: s.shortDescription ?? "",
      icon: style.icon,
      color: style.color,
      link: s.ctaUrl ?? "/services",
    };
  });


  const scrollTo = (href: string) => {
    const id = href.replace("/#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="relative py-24 sm:py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4"
          >
            Our Services
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight"
          >
            A Complete Growth Ecosystem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Eight integrated service areas designed to help your business grow, operate smarter and stay secure.
          </motion.p>
        </div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.num}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
            >
              <button
                onClick={() => {
                  if (service.link.startsWith("/#")) scrollTo(service.link);
                  else navigate(service.link);
                }}
                className="group relative w-full text-left p-6 sm:p-7 rounded-2xl bg-card border border-border/60 hover:border-border transition-all duration-500 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1"
              >
                {/* Number */}
                <span className="text-xs font-mono text-muted-foreground/40 mb-4 block">
                  {service.num}
                </span>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-${service.color}/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`w-6 h-6 text-${service.color}`} />
                </div>

                {/* Title */}
                <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-electric transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {service.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-electric opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  Explore Services
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-electric/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

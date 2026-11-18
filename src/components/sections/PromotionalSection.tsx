import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Rocket,
  Package,
  Calendar,
  Presentation,
  Link,
  Snowflake,
  Award,
  ArrowRight,
} from "lucide-react";
import { Link as RouterLink } from "react-router";

const services = [
  { icon: Rocket, title: "Promotional Campaign Development", description: "Strategic promotional campaigns designed to increase brand visibility, drive engagement and generate leads." },
  { icon: Package, title: "Product Launch Support", description: "End-to-end product launch strategies from pre-launch buzz to post-launch momentum and optimization." },
  { icon: Calendar, title: "Event Marketing & Management", description: "Plan, promote and manage events that create meaningful connections and measurable business outcomes." },
  { icon: Presentation, title: "Trade Show & Exhibition Strategy", description: "Maximize your trade show investment with strategic planning, booth design and post-event follow-up." },
  { icon: Link, title: "Partnership Promotion Programs", description: "Co-marketing campaigns and partnership programs that amplify reach and create mutual value." },
  { icon: Snowflake, title: "Seasonal & Holiday Campaigns", description: "Timely campaigns aligned with seasonal trends, holidays and cultural moments that resonate." },
  { icon: Award, title: "Loyalty & Retention Programs", description: "Build customer loyalty through strategic reward programs, engagement initiatives and relationship building." },
];

export default function PromotionalSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="promotional" className="relative py-24 sm:py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
          >
            04 — Promotional Services
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight"
          >
            Amplify Your Reach
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Promotional strategies that create awareness, drive engagement and generate measurable results.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
              className="group p-6 rounded-2xl bg-card border border-border/60 hover:border-border hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-electric/10 flex items-center justify-center mb-4 group-hover:bg-electric/20 transition-colors">
                <service.icon className="w-5 h-5 text-electric" />
              </div>
              <h3 className="font-display text-base font-bold text-foreground mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <RouterLink
            to="/contact"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold text-sm rounded-lg hover:bg-navy-light transition-all duration-200"
          >
            Discuss Promotional Strategy
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </RouterLink>
        </div>
      </div>
    </section>
  );
}

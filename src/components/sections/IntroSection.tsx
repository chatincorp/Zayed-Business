import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { TrendingUp, Shield, Cpu } from "lucide-react";

const pillars = [
  {
    icon: TrendingUp,
    title: "BUSINESS",
    items: "Strategy • Sales • Marketing",
    color: "from-electric to-blue-500",
    iconColor: "text-electric",
  },
  {
    icon: Shield,
    title: "SECURITY",
    items: "Surveillance • Access • Protection",
    color: "from-cyan-500 to-electric-dark",
    iconColor: "text-cyan-400",
  },
  {
    icon: Cpu,
    title: "TECHNOLOGY",
    items: "Web • AI • Automation",
    color: "from-violet-500 to-electric",
    iconColor: "text-violet-400",
  },
];

export default function IntroSection() {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="relative py-24 sm:py-32 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern-dark" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Main statement */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-electric/80 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] mb-4"
          >
            One Partner. Multiple Growth Solutions.
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-4xl mx-auto"
          >
            From business strategy and sales growth to security infrastructure,
            digital experiences and artificial intelligence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-white/50 max-w-2xl mx-auto"
          >
            Yasir Zayed helps organizations build stronger foundations for sustainable growth.
          </motion.p>
        </div>

        {/* Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
              className="group relative"
            >
              <div className="relative p-8 sm:p-10 rounded-2xl bg-navy-light/50 border border-white/5 hover:border-white/10 transition-all duration-500 hover:bg-navy-light/70">
                {/* Gradient top accent */}
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${pillar.color} opacity-50 group-hover:opacity-100 transition-opacity`} />

                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pillar.color} bg-opacity-10 flex items-center justify-center mb-6`}>
                  <pillar.icon className={`w-7 h-7 ${pillar.iconColor}`} />
                </div>
                <h3 className="text-white font-bold text-xl tracking-tight mb-3">
                  {pillar.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {pillar.items}
                </p>

                {/* Hover glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

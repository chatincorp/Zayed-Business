import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Search, Compass, PenTool, Zap, TrendingUp } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "DISCOVER",
    description: "Understand the business, challenges and objectives.",
    icon: Search,
  },
  {
    num: "02",
    title: "STRATEGIZE",
    description: "Identify opportunities and develop the right approach.",
    icon: Compass,
  },
  {
    num: "03",
    title: "DESIGN",
    description: "Design the appropriate strategy, technology or solution.",
    icon: PenTool,
  },
  {
    num: "04",
    title: "IMPLEMENT",
    description: "Put the solution into action.",
    icon: Zap,
  },
  {
    num: "05",
    title: "OPTIMIZE",
    description: "Measure performance and continuously improve.",
    icon: TrendingUp,
  },
];

export default function ProcessSection() {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section id="process" className="relative py-24 sm:py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-electric text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
          >
            How We Work
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight"
          >
            A Clear Path to Results
          </motion.h2>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connecting line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              className="absolute top-[52px] left-[10%] right-[10%] h-px bg-gradient-to-r from-electric/20 via-electric/50 to-electric/20 origin-left"
            />

            <div className="grid grid-cols-5 gap-4">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                  className="text-center relative"
                >
                  {/* Icon circle */}
                  <div className="relative mx-auto mb-6">
                    <div className="w-[104px] h-[104px] mx-auto rounded-full bg-card border border-border flex items-center justify-center relative z-10">
                      <step.icon className="w-7 h-7 text-electric" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-electric text-white text-xs font-bold flex items-center justify-center z-20">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="font-display text-sm font-bold text-foreground tracking-wider mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed px-2">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden">
          <div className="relative pl-8">
            {/* Vertical line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-electric/20 via-electric/50 to-electric/20" />

            <div className="space-y-10">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="relative"
                >
                  <div className="absolute -left-5 w-6 h-6 rounded-full bg-electric flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">{step.num}</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center shrink-0">
                      <step.icon className="w-5 h-5 text-electric" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground tracking-wider mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

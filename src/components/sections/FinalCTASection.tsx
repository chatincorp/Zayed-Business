import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Phone, Mail, Globe } from "lucide-react";
import { Link } from "react-router";

export default function FinalCTASection() {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="relative py-24 sm:py-32 bg-navy-dark overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern-dark" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-electric/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="text-center max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Ready to Build What's Next?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg sm:text-xl text-white/50 leading-relaxed mb-10"
          >
            Whether you need a growth strategy, stronger sales operation, professional security infrastructure, a custom digital platform or intelligent AI integration — let's build the right solution around your business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-electric text-white font-semibold rounded-lg hover:bg-electric-dark transition-all duration-300 shadow-xl shadow-electric/25 hover:shadow-electric/40 hover:-translate-y-0.5 text-base"
            >
              Start a Conversation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/#services"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white/80 font-medium rounded-lg hover:bg-white/5 hover:border-white/30 transition-all duration-300 hover:-translate-y-0.5 text-base"
            >
              Explore Our Services
            </Link>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            <a
              href="tel:+44114712989"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all"
            >
              <Phone className="w-5 h-5 text-electric" />
              <span className="text-white/80 text-sm font-medium">0114 712 989</span>
            </a>
            <a
              href="tel:+254711625144"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all"
            >
              <Phone className="w-5 h-5 text-electric" />
              <span className="text-white/80 text-sm font-medium">0711625144</span>
            </a>
            <a
              href="mailto:info@yasirzayed.com"
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all"
            >
              <Mail className="w-5 h-5 text-electric" />
              <span className="text-white/80 text-sm font-medium">info@yasirzayed.com</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <a
              href="mailto:thenassirgroup@gmail.com"
              className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-white/60 transition-colors"
            >
              <Mail className="w-4 h-4" />
              thenassirgroup@gmail.com
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4"
          >
            <a
              href="https://yasirzayed.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-electric/60 text-sm hover:text-electric transition-colors"
            >
              <Globe className="w-4 h-4" />
              yasirzayed.com
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

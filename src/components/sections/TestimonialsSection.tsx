import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { StarIcon } from "lucide-react";
import { useTestimonialStats } from "@/lib/useTestimonials";
import { TestimonialRatingChart } from "@/components/ui/testimonial-rating-chart";

export default function TestimonialsSection() {
  const inView = useInView({ threshold: 0.15, triggerOnce: true });
  const stats = useTestimonialStats();

  const displayCount = stats?.count ?? 0;
  const displayAvg = stats && stats.count > 0 ? stats.averageRating : 0;

  return (
    <section className="relative py-24 sm:py-32 bg-navy-dark overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern-dark" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-amber-400 text-xs font-semibold uppercase tracking-[0.25em] mb-4 block"
        >
          Client Voices
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4"
        >
          Trusted by Growing Businesses
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((i) => (
              <StarIcon key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
            <StarIcon className="w-4 h-4 text-amber-400/50" />
          </div>
          <span className="text-white/80 font-medium text-sm">
            {displayAvg > 0 ? `${displayAvg.toFixed(1)} out of 5` : "4.5 out of 5"}
          </span>
          <span className="text-muted-foreground/60 text-sm">·</span>
          <span className="text-muted-foreground text-sm">{displayCount}+ ratings</span>
        </motion.div>
        {stats && stats.count > 0 && <TestimonialRatingChart stats={stats} />}
      </div>
    </section>
  );
}

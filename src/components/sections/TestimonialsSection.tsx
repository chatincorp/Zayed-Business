/**
 * TestimonialsSection — published client quotes from the shared backend pool.
 * Mirrors the carousel's data source so both sections show the same testimonials.
 */

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Quote, StarIcon } from "lucide-react";
import { useSiteTestimonials } from "@/lib/siteContent";
import { useTestimonialStats } from "@/lib/useTestimonials";
import type { TestimonialWithRating as TW } from "@/lib/useTestimonials";

const FALLBACK_QUOTES: TW[] = [
  {
    _id: "fb-1",
    quote: "Yasir Zayed restructured our sales process and our close rate nearly doubled in one quarter.",
    clientName: "Grace Mwangi",
    position: "Commercial Director",
    rating: 5,
    service: "Fmcg Sales",
    status: "published",
    displayOrder: 1,
  },
  {
    _id: "fb-2",
    quote: "The security audit and camera deployment were handled end to end — professional from survey to handover.",
    clientName: "Peter Otieno",
    position: "Operations Manager",
    rating: 5,
    service: "Security Audit",
    status: "published",
    displayOrder: 2,
  },
  {
    _id: "fb-3",
    quote: "Their AI chatbot now handles most of our inbound enquiries, and the team finally has time to sell.",
    clientName: "Amina Hassan",
    position: "Founder",
    rating: 5,
    service: "Chatbot",
    status: "published",
    displayOrder: 3,
  },
];

export default function TestimonialsSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const stats = useTestimonialStats();
  const live = useSiteTestimonials();
  const testimonials: TW[] =
    live && live.length > 0
      ? (live as unknown as TW[]).map((t) => ({
          _id: t._id,
          quote: t.quote,
          clientName: t.clientName,
          position: t.position,
          rating: t.rating ?? 5,
          service: t.service,
          status: t.status,
          displayOrder: t.displayOrder,
        }))
      : FALLBACK_QUOTES;

  const displayCount = stats?.count ?? testimonials.length;
  const displayAvg =
    stats && stats.count > 0 ? stats.averageRating : testimonials.length > 0
      ? testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length
      : 0;

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 bg-navy-dark overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern-dark" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="text-center mb-14">
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
            className="flex items-center justify-center gap-3"
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t, i) => (
            <motion.figure
              key={`${t.clientName}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              className="rounded-2xl bg-card border border-border/60 p-7 flex flex-col hover:shadow-lg hover:shadow-black/5 transition-all"
            >
              <Quote className="w-7 h-7 text-sky-500/40 mb-4" />
              <blockquote className="text-sm text-foreground leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.clientName}</p>
                  {t.position && (
                    <p className="text-xs text-muted-foreground mt-0.5">{t.position}</p>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: t.rating ?? 5 }).map((_, idx) => (
                    <StarIcon key={idx} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

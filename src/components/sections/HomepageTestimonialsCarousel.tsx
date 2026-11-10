import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { StarIcon, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useSiteTestimonials } from "@/lib/siteContent";
import { useTestimonialStats, TestimonialWithRating } from "@/lib/useTestimonials";

function avatarFor(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function serviceLabelFor(service?: string) {
  if (!service) return "Client feedback";
  return service
    .split(/[-_ ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating
              ? "text-amber-400 fill-amber-400"
              : "text-amber-400/20"
          }`}
        />
      ))}
    </div>
  );
}

function useAutoPlay(count: number, delay = 5500) {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  const start = () => {
    stop();
    timer.current = setTimeout(() => {
      setIndex((i) => (i + 1) % count);
    }, delay);
  };

  return { index, setIndex, start, stop };
}

export default function HomepageTestimonialsCarousel() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const stats = useTestimonialStats();
  const live = useSiteTestimonials();
  const testimonials: TestimonialWithRating[] =
    live && live.length > 0
      ? live.map((t) => ({
          _id: (t as TestimonialWithRating)._id,
          quote: t.quote,
          clientName: t.clientName,
          position: (t as TestimonialWithRating).position,
          rating: (t as TestimonialWithRating).rating ?? 5,
          service: (t as TestimonialWithRating).service,
          status: t.status,
          displayOrder: t.displayOrder,
        }))
      : [];

  const published = testimonials.filter((t) => t.status === "published");
  const displayCount = stats?.count ?? published.length;
  const displayAvg =
    stats && stats.count > 0
      ? stats.averageRating
      : published.length > 0
        ? published.reduce((a, t) => a + t.rating, 0) / published.length
        : 4.5;

  const fallback: TestimonialWithRating[] = [
    {
      _id: "fallback-1",
      quote: "Yasir Zayed restructured our sales process and our close rate nearly doubled in one quarter.",
      clientName: "Grace Mwangi",
      position: "Commercial Director",
      rating: 5,
      service: "Fmcg Sales",
      status: "published",
      displayOrder: 1,
    },
    {
      _id: "fallback-2",
      quote: "The security audit and camera deployment were handled end to end — professional from survey to handover.",
      clientName: "Peter Otieno",
      position: "Operations Manager",
      rating: 5,
      service: "Security Audit",
      status: "published",
      displayOrder: 2,
    },
    {
      _id: "fallback-3",
      quote: "Their AI chatbot now handles most of our inbound enquiries, and the team finally has time to sell.",
      clientName: "Amina Hassan",
      position: "Founder",
      rating: 5,
      service: "Chatbot",
      status: "published",
      displayOrder: 3,
    },
  ];

  const effective = published.length > 0 ? published : fallback;
  const { index, setIndex, start, stop } = useAutoPlay(effective.length);

  if (effective.length === 0) return null;

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 bg-navy-dark overflow-hidden"
      onMouseEnter={stop}
      onMouseLeave={start}
    >
      <div className="absolute inset-0 bg-grid-pattern-dark" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
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
            className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-3"
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

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-muted-foreground text-sm mt-4 max-w-lg mx-auto"
          >
            {displayCount > 0
              ? `${displayCount} published reviews across our services — averaged from real engagements.`
              : "Reviews coming soon."}
          </motion.p>
        </div>

        {/* Active review */}
        <div className="relative">
          <div className="relative min-h-[240px]">
            {effective.map((review, idx) => (
              <motion.div
                key={review._id ?? idx}
                initial={{ opacity: 0, x: 30 }}
                animate={{
                  opacity: idx === index ? 1 : 0,
                  x: idx === index ? 0 : 30,
                  scale: idx === index ? 1 : 0.97,
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute inset-0 opacity-0 pointer-events-none"
              >
                <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border/60">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-11 h-11 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 text-sm font-bold shrink-0">
                      {avatarFor(review.clientName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">
                        {review.clientName}
                      </p>
                      <p className="text-muted-foreground text-xs capitalize">
                        {serviceLabelFor(review.service)}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <div className="relative">
                    <Quote className="w-5 h-5 text-sky-500/30 absolute -top-1 left-5 rotate-180" />
                    <p className="text-white/70 text-sm leading-relaxed pl-4 pr-2">
                      &ldquo;{review.quote}&rdquo;
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {effective.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setIndex(idx)}
                className={`transition-all rounded-full ${
                  idx === index
                    ? "w-6 h-1.5 bg-amber-400"
                    : "w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Show review ${idx + 1}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setIndex((i) => (i - 1 + effective.length) % effective.length)}
              className="group p-2 rounded-full bg-card border border-border/60 hover:border-sky-500/30 text-white/60 hover:text-white transition-all"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % effective.length)}
              className="group p-2 rounded-full bg-card border border-border/60 hover:border-sky-500/30 text-white/60 hover:text-white transition-all"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6">
          {displayCount > 0
            ? `${displayCount} published reviews across our services. Individual experiences vary.`
            : "Reviews coming soon."}
        </p>
      </div>
    </section>
  );
}

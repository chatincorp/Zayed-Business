import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { StarIcon, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const reviews = [
  {
    rating: 5,
    text: "We replaced a lot of manual follow-up with a simple automated sequence, and the difference showed up within the first month — faster responses and fewer leads slipping through the cracks.",
    service: "Process Automation",
    avatar: "ST",
  },
  {
    rating: 5,
    text: "Their CCTV proposal was the first one that actually matched what we needed instead of what they wanted to sell. The install was clean, the remote access works, and the handover felt complete.",
    service: "Security Solutions",
    avatar: "MO",
  },
  {
    rating: 5,
    text: "The team helped us fix our route-to-market and within weeks the outlet coverage looked noticeably better. Actual walk-throughs, not just slides.",
    service: "FMCG Sales & Distribution",
    avatar: "AW",
  },
  {
    rating: 4,
    text: "The marketplace listings made our products visible on the platforms where our buyers are already shopping. The setup was quicker than we expected and the profiles look professional.",
    service: "Marketplace Listings",
    avatar: "JK",
  },
  {
    rating: 4,
    text: "Our social accounts went from quiet to actually active without turning into noise. The content fits our voice and the calendar makes the whole thing manageable.",
    service: "Social Media Management",
    avatar: "PN",
  },
  {
    rating: 5,
    text: "The ad we ran for the launch was short, clear and actually modern — not the kind of thing you get from a generic template. Good turnaround too.",
    service: "Ad Creation",
    avatar: "LM",
  },
  {
    rating: 4,
    text: "Smart, practical guidance. They asked the questions we had not thought to answer, and the plan we left with was something our team could actually follow.",
    service: "Business Strategy",
    avatar: "CN",
  },
  {
    rating: 5,
    text: "The chatbot now handles a lot of the routine questions and appointments, so the team spends more time on the conversations that actually need a person.",
    service: "AI Chat & Automation",
    avatar: "RD",
  },
  {
    rating: 4,
    text: "The content they produced was ready to use, not something we had to rewrite from scratch. Short, clear, and aligned with what we actually sell.",
    service: "Content Generation",
    avatar: "VT",
  },
  {
    rating: 5,
    text: "Professional from first contact to final handover. Nothing felt rushed, and the work was delivered the way it was described.",
    service: "Full Engagement",
    avatar: "BO",
  },
];

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

function useAutoPlay(delay = 5500) {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  const start = () => {
    stop();
    timer.current = setTimeout(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, delay);
  };

  return { index, setIndex, start, stop };
}

export default function HomepageTestimonialsCarousel() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const { index, setIndex, start, stop } = useAutoPlay();
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
            What Clients Say
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-3"
          >
            Real Feedback From Real Work
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
            <span className="text-white/80 font-medium text-sm">4.5 out of 5</span>
            <span className="text-muted-foreground/60 text-sm">·</span>
            <span className="text-muted-foreground text-sm">100+ ratings</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-muted-foreground text-sm mt-4 max-w-lg mx-auto"
          >
            Across strategy, security, FMCG, AI, marketplaces, content and ads — balanced feedback from real engagements.
          </motion.p>
        </div>

        {/* Active review */}
        <div className="relative">
          <div className="relative min-h-[240px]">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={{
                  opacity: i === index ? 1 : 0,
                  x: i === index ? 0 : 30,
                  scale: i === index ? 1 : 0.97,
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute inset-0 opacity-0 pointer-events-none"
              >
                <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border/60">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-11 h-11 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 text-sm font-bold shrink-0">
                      {review.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">
                        Client feedback
                      </p>
                      <p className="text-muted-foreground text-xs capitalize">
                        {review.service}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <div className="relative">
                    <Quote className="w-5 h-5 text-sky-500/30 absolute -top-1 left-5 rotate-180" />
                    <p className="text-white/70 text-sm leading-relaxed pl-4 pr-2">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`transition-all rounded-full ${
                  i === index
                    ? "w-6 h-1.5 bg-amber-400"
                    : "w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Show review ${i + 1}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setIndex((i) => (i - 1 + reviews.length) % reviews.length)}
              className="group p-2 rounded-full bg-card border border-border/60 hover:border-sky-500/30 text-white/60 hover:text-white transition-all"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % reviews.length)}
              className="group p-2 rounded-full bg-card border border-border/60 hover:border-sky-500/30 text-white/60 hover:text-white transition-all"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6">
          Aggregated across multiple services. Individual experiences vary.
        </p>
      </div>
    </section>
  );
}
